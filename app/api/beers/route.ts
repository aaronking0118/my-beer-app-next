import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const search = url.searchParams.get('search')?.toLowerCase() || '';
        const style = url.searchParams.get('style') || '';
        const sort = url.searchParams.get('sort') || 'newest';
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = 25;
        const offset = (page - 1) * limit;

        // Build dynamic query filters
        let queryConditions = [];
        let queryParams: any[] = [];
        let paramIndex = 1;

        if (search) {
            queryConditions.push(`(LOWER(beer_name) LIKE $${paramIndex} OR LOWER(brewery_name) LIKE $${paramIndex})`);
            queryParams.push(`%${search}%`);
            paramIndex++;
        }

        if (style) {
            queryConditions.push(`beer_style = $${paramIndex}`);
            queryParams.push(style);
            paramIndex++;
        }

        const whereClause = queryConditions.length > 0 ? `WHERE ${queryConditions.join(' AND ')}` : '';

        // Determine sort order
        let orderBy = 'id DESC';
        if (sort === 'oldest') orderBy = 'id ASC';
        else if (sort === 'rank_desc') orderBy = 'rank DESC NULLS LAST';
        else if (sort === 'abv_desc') orderBy = 'abv DESC NULLS LAST';

        // Fetch paginated beers from Neon
        const queryText = `
            SELECT * FROM beers 
            ${whereClause} 
            ORDER BY ${orderBy} 
            LIMIT ${limit} OFFSET ${offset}
        `;
        const result = await pool.query(queryText, queryParams);
        const beers = result.rows;

        // Fetch total count for pagination
        const countQuery = `SELECT COUNT(*) FROM beers ${whereClause}`;
        const countResult = await pool.query(countQuery, queryParams);
        const total = parseInt(countResult.rows[0].count, 10);

        // Fetch total unique breweries
        const breweriesResult = await pool.query(`SELECT COUNT(DISTINCT LOWER(TRIM(brewery_name))) FROM beers`);
        const totalBreweries = parseInt(breweriesResult.rows[0].count, 10);

        // Fetch all unique styles for dropdown
        const stylesResult = await pool.query(`SELECT DISTINCT beer_style FROM beers WHERE beer_style IS NOT NULL AND beer_style != '' ORDER BY beer_style ASC`);
        const styles = stylesResult.rows.map(r => r.beer_style);

        return NextResponse.json({
            beers,
            total,
            totalBreweries,
            totalPages: Math.ceil(total / limit) || 1,
            page,
            styles
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Get max ID and number from Neon
        const maxResult = await pool.query(`SELECT MAX(id) as max_id, MAX(beer_number) as max_num FROM beers`);
        const maxId = maxResult.rows[0]?.max_id || 0;
        const maxNumber = maxResult.rows[0]?.max_num || 0;

        const insertQuery = `
            INSERT INTO beers (id, beer_number, beer_name, brewery_name, beer_style, rank, abv, ibu, srm, country, state, tasting_notes, consumption_date)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_DATE)
            RETURNING *
        `;

        const values = [
            maxId + 1,
            maxNumber + 1,
            body.beer_name || 'Unnamed Beer',
            body.brewery_name || 'Unknown Brewery',
            body.beer_style || '',
            body.rank !== undefined && body.rank !== '' ? body.rank : null,
            body.abv !== undefined && body.abv !== '' ? body.abv : null,
            body.ibu !== undefined && body.ibu !== '' ? body.ibu : null,
            body.srm !== undefined && body.srm !== '' ? body.srm : null,
            body.country || 'USA',
            body.state || '',
            body.tasting_notes || ''
        ];

        const result = await pool.query(insertQuery, values);
        return NextResponse.json({ success: true, beer: result.rows[0] });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to add beer' }, { status: 500 });
    }
}