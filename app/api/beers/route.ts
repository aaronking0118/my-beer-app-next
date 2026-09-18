import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'beers.json');

function getDb() {
    if (!fs.existsSync(dbPath)) {
        return { beers: [] };
    }
    const fileData = fs.readFileSync(dbPath, 'utf-8');
    return JSON.parse(fileData);
}

function saveDb(data: any) {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const search = url.searchParams.get('search')?.toLowerCase() || '';
        const style = url.searchParams.get('style') || '';
        const sort = url.searchParams.get('sort') || 'newest';
        const page = parseInt(url.searchParams.get('page') || '1', 10);
        const limit = 25;

        const db = getDb();
        let beers = db.beers || [];

        // Apply filters
        const filtered = beers.filter((beer: any) => {
            const matchesSearch = 
                (beer.beer_name && beer.beer_name.toLowerCase().includes(search)) ||
                (beer.brewery_name && beer.brewery_name.toLowerCase().includes(search));
            
            const matchesStyle = style === '' || beer.beer_style === style;

            return matchesSearch && matchesStyle;
        });

        // Compute global stats for the filtered dataset before pagination
        const uniqueBreweries = new Set(filtered.map((b: any) => b.brewery_name?.trim().toLowerCase()).filter(Boolean));
        
        const rankedBeers = filtered.filter((b: any) => b.rank != null && !isNaN(Number(b.rank)));
        const totalRankSum = rankedBeers.reduce((acc: number, b: any) => acc + Number(b.rank), 0);
        const averageRank = rankedBeers.length > 0 ? totalRankSum / rankedBeers.length : 0;

        // Apply sorting
        filtered.sort((a: any, b: any) => {
            if (sort === 'oldest') {
                return (a.beer_number || a.id) - (b.beer_number || b.id);
            } else if (sort === 'rank_desc') {
                return (b.rank || 0) - (a.rank || 0);
            } else if (sort === 'abv_desc') {
                return (b.abv || 0) - (a.abv || 0);
            } else {
                // newest
                return (b.beer_number || b.id) - (a.beer_number || a.id);
            }
        });

        const total = filtered.length;
        const totalBreweries = uniqueBreweries.size;
        const totalPages = Math.ceil(total / limit) || 1;

        const paginatedBeers = filtered.slice((page - 1) * limit, page * limit);

        // Extract unique styles for dropdown
        const allStyles = Array.from(new Set(beers.map((b: any) => b.beer_style).filter(Boolean))) as string[];
        allStyles.sort();

        return NextResponse.json({
            beers: paginatedBeers,
            total,
            totalBreweries,
            averageRank,
            totalPages,
            page,
            styles: allStyles
        });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const db = getDb();
        
        if (!db.beers) {
            db.beers = [];
        }

        const maxId = db.beers.length > 0 ? Math.max(...db.beers.map((b: any) => b.id || 0)) : 0;
        const maxNumber = db.beers.length > 0 ? Math.max(...db.beers.map((b: any) => b.beer_number || 0)) : 0;

        const newBeer = {
            id: maxId + 1,
            beer_number: maxNumber + 1,
            beer_name: body.beer_name || 'Unnamed Beer',
            brewery_name: body.brewery_name || 'Unknown Brewery',
            beer_style: body.beer_style || '',
            rank: body.rank !== undefined ? body.rank : null,
            abv: body.abv !== undefined ? body.abv : null,
            ibu: body.ibu !== undefined ? body.ibu : null,
            srm: body.srm !== undefined ? body.srm : null,
            country: body.country || 'USA',
            state: body.state || '',
            tasting_notes: body.tasting_notes || '',
            consumption_date: new Date().toISOString().split('T')[0]
        };

        db.beers.unshift(newBeer);
        saveDb(db);

        return NextResponse.json({ success: true, beer: newBeer });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Failed to add beer' }, { status: 500 });
    }
}
