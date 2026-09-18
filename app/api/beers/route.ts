import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = 25;
    const offset = (page - 1) * limit;

    const search = searchParams.get('search') || '';
    const style = searchParams.get('style') || '';
    const sort = searchParams.get('sort') || 'newest';

    let queryConditions = [];
    let queryValues: any[] = [];
    let paramIndex = 1;

    if (search) {
      queryConditions.push(`(beer_name ILIKE $${paramIndex} OR brewery_name ILIKE $${paramIndex})`);
      queryValues.push(`%${search}%`);
      paramIndex++;
    }

    if (style) {
      queryConditions.push(`beer_style = $${paramIndex}`);
      queryValues.push(style);
      paramIndex++;
    }

    const whereClause = queryConditions.length > 0 ? `WHERE ${queryConditions.join(' AND ')}` : '';

    let orderBy = 'id DESC';
    if (sort === 'oldest') orderBy = 'id ASC';
    if (sort === 'rank_desc') orderBy = 'rank DESC NULLS LAST';
    if (sort === 'abv_desc') orderBy = 'abv DESC NULLS LAST';

    // Fetch beers
    const beersQuery = `
      SELECT id, beer_number, beer_name, brewery_name, beer_style, rank, abv, ibu, srm, country, state, tasting_notes, consumption_date
      FROM beers
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT ${limit} OFFSET ${offset}
    `;
    const beersResult = await pool.query(beersQuery, queryValues);

    // Fetch total count and stats
    const countQuery = `SELECT COUNT(*) FROM beers ${whereClause}`;
    const countResult = await pool.query(countQuery, queryValues);
    const total = parseInt(countResult.rows[0].count, 10);

    const breweriesResult = await pool.query(`SELECT COUNT(DISTINCT brewery_name) FROM beers`);
    const totalBreweries = parseInt(breweriesResult.rows[0].count, 10);

    const stylesResult = await pool.query(`SELECT DISTINCT beer_style FROM beers WHERE beer_style IS NOT NULL AND beer_style != '' ORDER BY beer_style ASC`);
    const styles = stylesResult.rows.map(row => row.beer_style);

    return NextResponse.json({
      beers: beersResult.rows,
      total,
      totalBreweries,
      styles,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    console.error('Database error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { brewery_name, beer_name, beer_style, country, state, rank, abv, ibu, srm, tasting_notes } = body;

    // Get latest beer number increment
    const maxNumResult = await pool.query('SELECT MAX(beer_number) as max_num FROM beers');
    const nextBeerNumber = (maxNumResult.rows[0]?.max_num || 0) + 1;

    const insertQuery = `
      INSERT INTO beers (beer_number, brewery_name, beer_name, beer_style, country, state, rank, abv, ibu, srm, tasting_notes, consumption_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW())
      RETURNING *;
    `;

    const values = [
      nextBeerNumber,
      brewery_name,
      beer_name,
      beer_style || null,
      country || 'USA',
      state || 'Texas',
      rank ?? null,
      abv ?? null,
      ibu ?? null,
      srm ?? null,
      tasting_notes || null,
    ];

    const result = await pool.query(insertQuery, values);

    return NextResponse.json({ success: true, beer: result.rows[0] }, { status: 201 });
  } catch (error: any) {
    console.error('Insert error:', error);
    return NextResponse.json({ error: error.message || 'Failed to insert beer' }, { status: 500 });
  }
}