import { neon } from '@neondatabase/serverless';
import { NextResponse, type NextRequest } from 'next/server';

interface Beer {
    id?: number;
    beer_number?: number;
    brewery_name?: string;
    beer_name?: string;
    beer_style?: string;
    abv?: number | null;
    ibu?: number | null;
    srm?: number | null;
    rank?: number | null;
    tasting_notes?: string | null;
    country?: string | null;
    state?: string | null;
    consumption_date?: string | null;
}

// Handle GET requests (Fetching beers, pagination, search, styles, and brewery list)
export async function GET(req: NextRequest) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        return NextResponse.json({ error: 'DATABASE_URL is not defined.' }, { status: 500 });
    }

    const sql = neon(databaseUrl);
    const searchParams = req.nextUrl.searchParams;

    try {
        if (searchParams.get('action') === 'breweries') {
            const breweries = await sql`
                SELECT DISTINCT brewery_name, country, state 
                FROM beers 
                WHERE brewery_name IS NOT NULL 
                ORDER BY brewery_name ASC
            `;
            return NextResponse.json({ breweries });
        }

        const page = parseInt(searchParams.get('page') || '1', 10);
        const limit = parseInt(searchParams.get('limit') || '50', 10);
        const offset = (page - 1) * limit;
        const search = searchParams.get('search') ? `%${searchParams.get('search')}%` : '%%';
        const style = searchParams.get('style') || '';
        const sort = searchParams.get('sort') || 'brewery_asc';

        let orderBy = sql`ORDER BY brewery_name ASC, beer_name ASC`;
        if (sort === 'oldest') orderBy = sql`ORDER BY id ASC`;
        if (sort === 'newest') orderBy = sql`ORDER BY id DESC`;
        if (sort === 'rank_desc') orderBy = sql`ORDER BY rank DESC NULLS LAST`;
        if (sort === 'abv_desc') orderBy = sql`ORDER BY abv DESC NULLS LAST`;

        let beersQuery, countQuery;
        if (style) {
            beersQuery = sql`
                SELECT id, beer_number, beer_name, brewery_name, beer_style, rank, abv, ibu, srm, country, state, tasting_notes, consumption_date
                FROM beers 
                WHERE (beer_name ILIKE ${search} OR brewery_name ILIKE ${search})
                AND beer_style = ${style}
                ${orderBy}
                LIMIT ${limit} OFFSET ${offset}
            `;
            countQuery = sql`
                SELECT COUNT(*) as total 
                FROM beers 
                WHERE (beer_name ILIKE ${search} OR brewery_name ILIKE ${search})
                AND beer_style = ${style}
            `;
        } else {
            beersQuery = sql`
                SELECT id, beer_number, beer_name, brewery_name, beer_style, rank, abv, ibu, srm, country, state, tasting_notes, consumption_date 
                FROM beers 
                WHERE (beer_name ILIKE ${search} OR brewery_name ILIKE ${search})
                ${orderBy}
                LIMIT ${limit} OFFSET ${offset}
            `;
            countQuery = sql`
                SELECT COUNT(*) as total 
                FROM beers 
                WHERE (beer_name ILIKE ${search} OR brewery_name ILIKE ${search})
            `;
        }

        const [beers, countResult, stylesResult, breweryCountResult] = await Promise.all([
            beersQuery,
            countQuery,
            sql`SELECT DISTINCT beer_style FROM beers WHERE beer_style IS NOT NULL ORDER BY beer_style ASC`,
            sql`SELECT COUNT(DISTINCT brewery_name) as total_breweries FROM beers WHERE brewery_name IS NOT NULL`
        ]);

        return NextResponse.json({
            beers,
            total: parseInt(countResult[0].total, 10),
            totalBreweries: parseInt(breweryCountResult[0].total_breweries, 10),
            page,
            limit,
            styles: stylesResult.map((s: any) => s.beer_style)
        });

    } catch (error: any) {
        console.error('Database error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// Handle POST requests (Adding a new beer)
export async function POST(req: NextRequest) {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
        return NextResponse.json({ error: 'DATABASE_URL is not defined.' }, { status: 500 });
    }

    const sql = neon(databaseUrl);

    try {
        const body: Beer = await req.json();
        let {
            beer_number,
            brewery_name,
            beer_name,
            country,
            state,
            rank,
            tasting_notes,
            consumption_date
        } = body;

        if (!brewery_name || !beer_name) {
            return NextResponse.json({ error: 'Brewery name and beer name are required.' }, { status: 400 });
        }

        if (!beer_number) {
            const maxResult = await sql`SELECT MAX(beer_number) as max_num FROM beers`;
            beer_number = (Number(maxResult[0]?.max_num) || 10000) + 1;
        }

        const finalConsumptionDate = consumption_date || new Date().toISOString().split('T')[0];
        const parsedRank = rank !== '' && rank != null ? Number(rank) : null;

        const insertResult = await sql`
            INSERT INTO beers (
                beer_number,
                brewery_name,
                beer_name,
                country,
                state,
                rank,
                tasting_notes,
                consumption_date
            ) VALUES (
                ${beer_number},
                ${brewery_name},
                ${beer_name},
                ${country || null},
                ${state || null},
                ${parsedRank},
                ${tasting_notes || null},
                ${finalConsumptionDate}
            )
            RETURNING id, beer_number, brewery_name, beer_name, rank, consumption_date;
        `;

        return NextResponse.json({
            message: 'Beer successfully logged to database!',
            beer: insertResult[0]
        }, { status: 201 });

    } catch (error: any) {
        console.error('Database insert error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}