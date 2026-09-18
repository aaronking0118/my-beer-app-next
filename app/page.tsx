'use client';

import { useState, useEffect } from 'react';

interface Beer {
    id: number;
    beer_number: number;
    beer_name: string;
    brewery_name: string;
    beer_style: string;
    rank: number | null;
    abv: number | null;
    ibu: number | null;
    srm: number | null;
    country: string | null;
    state: string | null;
    tasting_notes: string | null;
    consumption_date: string | null;
}

export default function Home() {
    const [beers, setBeers] = useState<Beer[]>([]);
    const [totalBeers, setTotalBeers] = useState(0);
    const [totalBreweries, setTotalBreweries] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('');
    const [styles, setStyles] = useState<string[]>([]);
    const [sortOrder, setSortOrder] = useState('newest');
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);

    // Modal state for adding a new beer
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [breweryName, setBreweryName] = useState('');
    const [beerName, setBeerName] = useState('');
    const [beerStyle, setBeerStyle] = useState('');
    const [country, setCountry] = useState('USA');
    const [state, setState] = useState('Texas');
    const [rank, setRank] = useState('');
    const [tastingNotes, setTastingNotes] = useState('');

    const fetchBeers = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/beers?page=${page}&search=${searchQuery}&style=${selectedStyle}&sort=${sortOrder}`);
            const data = await res.json();
            if (res.ok) {
                setBeers(data.beers);
                setTotalBeers(data.total);
                setTotalBreweries(data.totalBreweries);
                setStyles(data.styles);
            }
        } catch (error) {
            console.error('Failed to fetch beers:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBeers();
    }, [page, searchQuery, selectedStyle, sortOrder]);

    const handleAddBeer = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/beers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    brewery_name: breweryName,
                    beer_name: beerName,
                    beer_style: beerStyle,
                    country,
                    state,
                    rank: rank ? parseFloat(rank) : null,
                    tasting_notes: tastingNotes,
                }),
            });

            if (res.ok) {
                setIsModalOpen(false);
                setBreweryName('');
                setBeerName('');
                setBeerStyle('');
                setRank('');
                setTastingNotes('');
                fetchBeers(); // Refresh list
            } else {
                const err = await res.json();
                alert(err.error || 'Failed to add beer');
            }
        } catch (error) {
            console.error('Error adding beer:', error);
        }
    };

    return (
        <main className="min-h-screen bg-[#0b0f19] text-gray-100 p-6 md:p-10 font-sans">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                            🍺 Aaron&apos;s Great Beer Adventure
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">
                            {totalBeers.toLocaleString()}+ Beers and Counting
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2"
                    >
                        + Add New Beer
                    </button>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl shadow-sm">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Beers</p>
                        <p className="text-4xl font-extrabold text-white mt-2">{totalBeers.toLocaleString()}</p>
                    </div>
                    <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl shadow-sm">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Breweries</p>
                        <p className="text-4xl font-extrabold text-white mt-2">{totalBreweries.toLocaleString()}</p>
                    </div>
                    <div className="bg-[#111827] border border-gray-800 p-6 rounded-2xl shadow-sm">
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Platform Status</p>
                        <p className="text-xl font-bold text-emerald-400 mt-3 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span> Next.js Active
                        </p>
                    </div>
                </div>

                {/* Filter and Search Controls */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#111827] p-4 rounded-2xl border border-gray-800">
                    <input
                        type="text"
                        placeholder="Search by name, brewery..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full md:w-96 bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    />

                    <div className="flex gap-4 w-full md:w-auto">
                        <select
                            value={selectedStyle}
                            onChange={(e) => setSelectedStyle(e.target.value)}
                            className="bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="">All Styles</option>
                            {styles.map((style) => (
                                <option key={style} value={style}>{style}</option>
                            ))}
                        </select>

                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-blue-500"
                        >
                            <option value="newest">Date Added (Newest)</option>
                            <option value="oldest">Date Added (Oldest)</option>
                            <option value="rank_desc">Highest Rated</option>
                            <option value="abv_desc">Highest ABV</option>
                        </select>
                    </div>
                </div>

                {/* Beer Table */}
                <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-800 text-xs text-gray-400 uppercase tracking-wider bg-[#161f33]">
                                    <th className="p-4">Badge #</th>
                                    <th className="p-4">Beer / Brewery</th>
                                    <th className="p-4">Style</th>
                                    <th className="p-4">Origin</th>
                                    <th className="p-4">Rank</th>
                                    <th className="p-4">ABV</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800 text-sm">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-gray-400">Loading your adventure...</td>
                                    </tr>
                                ) : beers.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="text-center py-12 text-gray-400">No beers found.</td>
                                    </tr>
                                ) : (
                                    beers.map((beer) => (
                                        <tr key={beer.id} className="hover:bg-[#1a2336] transition-colors">
                                            <td className="p-4 font-mono text-blue-400">#{beer.beer_number}</td>
                                            <td className="p-4">
                                                <div className="font-bold text-white">{beer.beer_name}</div>
                                                <div className="text-xs text-gray-400">{beer.brewery_name}</div>
                                            </td>
                                            <td className="p-4 text-gray-300">{beer.beer_style || '--'}</td>
                                            <td className="p-4 text-gray-300">{beer.country ? `${beer.country}${beer.state ? `, ${beer.state}` : ''}` : '--'}</td>
                                            <td className="p-4 font-semibold text-yellow-400">{beer.rank ? `${beer.rank} ⭐` : '--'}</td>
                                            <td className="p-4 text-gray-300">{beer.abv ? `${beer.abv}%` : '--'}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Add Beer Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-[#111827] border border-gray-800 rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl">
                        <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                            <h2 className="text-xl font-bold text-white">Log a New Beer</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">&times;</button>
                        </div>
                        <form onSubmit={handleAddBeer} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Brewery Name</label>
                                <input type="text" required value={breweryName} onChange={(e) => setBreweryName(e.target.value)} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. Sierra Nevada" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Beer Name</label>
                                <input type="text" required value={beerName} onChange={(e) => setBeerName(e.target.value)} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. Pale Ale" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Style</label>
                                    <input type="text" value={beerStyle} onChange={(e) => setBeerStyle(e.target.value)} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="e.g. Pale Ale" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Rank (0-5)</label>
                                    <input type="number" step="0.5" max="5" min="0" value={rank} onChange={(e) => setRank(e.target.value)} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="4.5" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Tasting Notes</label>
                                <textarea value={tastingNotes} onChange={(e) => setTastingNotes(e.target.value)} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="Piney, citrus, crisp finish..."></textarea>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 rounded-xl text-gray-400 hover:text-white">Cancel</button>
                                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-2 rounded-xl transition-all">Save Beer</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}