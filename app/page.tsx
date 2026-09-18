'use client';

import React, { useState, useEffect } from 'react';
import StarRating from '@/components/StarRating';
import SpeedometerGauge from '@/components/SpeedometerGauge';

interface Beer {
    id: number;
    beer_number?: number;
    beer_name: string;
    brewery_name: string;
    beer_style?: string;
    country?: string;
    state?: string;
    rank?: number;
    abv?: number;
    ibu?: number;
    srm?: number;
    tasting_notes?: string;
    consumption_date?: string;
}

export default function TastingLogPage() {
    const [beers, setBeers] = useState<Beer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('');
    const [sortOrder, setSortOrder] = useState('newest');
    const [page, setPage] = useState(1);
    
    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [breweryName, setBreweryName] = useState('');
    const [beerName, setBeerName] = useState('');
    const [beerStyle, setBeerStyle] = useState('');
    const [country, setCountry] = useState('United States');
    const [state, setState] = useState('');
    const [rank, setRank] = useState('');
    const [abv, setAbv] = useState('');
    const [ibu, setIbu] = useState('');
    const [srm, setSrm] = useState('');
    const [tastingNotes, setTastingNotes] = useState('');

    useEffect(() => {
        fetchBeers();
    }, [searchQuery, selectedStyle, sortOrder, page]);

    const fetchBeers = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams({
                search: searchQuery,
                style: selectedStyle,
                sort: sortOrder,
                page: page.toString()
            });
            const res = await fetch(`/api/beers?${queryParams.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setBeers(data.beers || data);
            }
        } catch (error) {
            console.error('Failed to load beers:', error);
        } finally {
            setLoading(false);
        }
    };

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
                    abv: abv ? parseFloat(abv) : null,
                    ibu: ibu ? parseInt(ibu, 10) : null,
                    srm: srm ? parseInt(srm, 10) : null,
                    tasting_notes: tastingNotes,
                    consumption_date: new Date().toISOString().split('T')[0]
                })
            });

            if (res.ok) {
                setIsModalOpen(false);
                // Reset form
                setBreweryName('');
                setBeerName('');
                setBeerStyle('');
                setState('');
                setRank('');
                setAbv('');
                setIbu('');
                setSrm('');
                setTastingNotes('');
                fetchBeers();
            }
        } catch (error) {
            console.error('Failed to save beer:', error);
        }
    };

    const getCountryCode = (countryName?: string) => {
        if (!countryName) return null;
        const map: { [key: string]: string } = {
            'United States': 'us',
            'Belgium': 'be',
            'Germany': 'de',
            'United Kingdom': 'gb',
            'Canada': 'ca',
            'Mexico': 'mx',
            'Netherlands': 'nl',
            'Ireland': 'ie'
        };
        return map[countryName] || null;
    };

    return (
        <main className="min-h-screen bg-[#0b0f19] text-gray-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#111827] p-6 rounded-2xl border border-gray-800 shadow-xl">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
                            <span>??</span> Craft Beer Tasting Log
                        </h1>
                        <p className="text-sm text-gray-400 mt-1">
                            Track, rate, and explore your personal cellar and tasting archives.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg flex items-center gap-2 text-sm"
                    >
                        <span>+</span> Log New Beer
                    </button>
                </div>

                {/* Filters & Search Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <input
                            type="text"
                            placeholder="Search by beer name, brewery, or tasting notes..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                            className="w-full bg-[#111827] border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors shadow-inner"
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            value={selectedStyle}
                            onChange={(e) => { setSelectedStyle(e.target.value); setPage(1); }}
                            className="w-full bg-[#111827] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        >
                            <option value="">All Styles</option>
                            <option value="IPA">IPA</option>
                            <option value="Stout">Stout</option>
                            <option value="Sour">Sour</option>
                            <option value="Lager">Lager</option>
                            <option value="Pilsner">Pilsner</option>
                            <option value="Belgian">Belgian</option>
                        </select>
                        <select
                            value={sortOrder}
                            onChange={(e) => { setSortOrder(e.target.value); setPage(1); }}
                            className="w-full bg-[#111827] border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="rank_desc">Highest Rated</option>
                            <option value="abv_desc">Highest ABV</option>
                        </select>
                    </div>
                </div>

                {/* Main Table Container */}
                <div className="bg-[#111827] rounded-2xl border border-gray-800 overflow-hidden shadow-xl">
                    {loading ? (
                        <div className="p-12 text-center text-gray-400 font-mono animate-pulse">
                            Loading tasting data...
                        </div>
                    ) : beers.length === 0 ? (
                        <div className="p-12 text-center text-gray-500 font-mono">
                            No beers found matching your criteria.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b border-gray-800 text-xs font-mono text-gray-400 uppercase bg-[#0f172a]">
                                        <th className="p-4">No.</th>
                                        <th className="p-4">Beer / Brewery</th>
                                        <th className="p-4">Style</th>
                                        <th className="p-4 text-center">Country</th>
                                        <th className="p-4 text-center">Rank</th>
                                        <th className="p-4 text-center">ABV</th>
                                        <th className="p-4 text-center">IBU</th>
                                        <th className="p-4">Tasting Notes</th>
                                        <th className="p-4 text-right">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-800/60 text-sm">
                                    {beers.map((beer) => {
                                        const countryCode = getCountryCode(beer.country);
                                        return (
                                            <tr key={beer.id} className="hover:bg-gray-800/40 transition-colors">
                                                <td className="p-4 font-mono text-xs text-gray-400">
                                                    #{beer.beer_number || beer.id}
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-bold text-white">{beer.beer_name}</div>
                                                    <div className="text-xs text-gray-400">{beer.brewery_name}</div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="inline-block px-2.5 py-1 bg-gray-800 text-gray-300 rounded-lg text-xs font-medium">
                                                        {beer.beer_style || 'Unspecified'}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-center">
                                                    {countryCode ? (
                                                        <span className={`fi fi-${countryCode} text-lg rounded shadow-sm`} title={beer.country || ''}></span>
                                                    ) : (
                                                        <span className="text-xs text-gray-500">{beer.country || '--'}</span>
                                                    )}
                                                </td>
                                                <td className="p-4 text-center">
                                                    <StarRating rank={beer.rank} />
                                                </td>
                                                <td className="p-4 text-center">
                                                    <SpeedometerGauge beerId={beer.id} max={15} type="abv" value={beer.abv} />
                                                </td>
                                                <td className="p-4 text-center">
                                                    <SpeedometerGauge beerId={beer.id} max={120} type="ibu" value={beer.ibu} />
                                                </td>
                                                <td className="p-4 max-w-xs text-gray-300 text-xs italic truncate" title={beer.tasting_notes || ''}>
                                                    {beer.tasting_notes || <span className="text-gray-600 not-italic">No notes recorded</span>}
                                                </td>
                                                <td className="p-4 text-right font-mono text-xs text-gray-400">
                                                    {beer.consumption_date || '--'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>

            {/* Modal for Adding New Beer */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-[#111827] border border-gray-800 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center border-b border-gray-800 pb-4">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <span>??</span> Log New Beer Tasting
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-white text-lg font-mono font-bold px-2 py-1"
                            >
                                ?
                            </button>
                        </div>

                        <form onSubmit={handleAddBeer} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Brewery Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Sierra Nevada"
                                        value={breweryName}
                                        onChange={(e) => setBreweryName(e.target.value)}
                                        className="w-full bg-[#1f2937] border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Beer Name</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Pale Ale"
                                        value={beerName}
                                        onChange={(e) => setBeerName(e.target.value)}
                                        className="w-full bg-[#1f2937] border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Style</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. American IPA"
                                        value={beerStyle}
                                        onChange={(e) => setBeerStyle(e.target.value)}
                                        className="w-full bg-[#1f2937] border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Country</label>
                                    <input
                                        type="text"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="w-full bg-[#1f2937] border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1">State</label>
                                    <input
                                        type="text"
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        className="w-full bg-[#1f2937] border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Rank (0-5)</label>
                                    <input
                                        type="number"
                                        step="0.5"
                                        min="0"
                                        max="5"
                                        placeholder="4.5"
                                        value={rank}
                                        onChange={(e) => setRank(e.target.value)}
                                        className="w-full bg-[#1f2937] border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1">ABV (%)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder="6.2"
                                        value={abv}
                                        onChange={(e) => setAbv(e.target.value)}
                                        className="w-full bg-[#1f2937] border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1">IBU</label>
                                    <input
                                        type="number"
                                        placeholder="45"
                                        value={ibu}
                                        onChange={(e) => setIbu(e.target.value)}
                                        className="w-full bg-[#1f2937] border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-gray-400 uppercase mb-1">SRM</label>
                                    <input
                                        type="number"
                                        placeholder="6"
                                        value={srm}
                                        onChange={(e) => setSrm(e.target.value)}
                                        className="w-full bg-[#1f2937] border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-gray-400 uppercase mb-1">Tasting Notes</label>
                                <textarea
                                    rows={3}
                                    placeholder="Piney hops, citrus peel, clean malt finish..."
                                    value={tastingNotes}
                                    onChange={(e) => setTastingNotes(e.target.value)}
                                    className="w-full bg-[#1f2937] border border-gray-700 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                                ></textarea>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition-colors shadow-lg"
                                >
                                    Save Beer Entry
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}
