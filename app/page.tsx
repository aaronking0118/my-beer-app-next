'use client';

import { useState, useEffect } from 'react';
import BeerGlass from '@/components/BeerGlass';

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

// Helper to map country names to ISO 2-letter codes for flag CDN images
function getCountryCode(country: string | null): string {
    if (!country) return '';
    const c = country.trim().toLowerCase();
    if (c === 'usa' || c === 'united states' || c === 'us') return 'us';
    if (c === 'japan' || c === 'jp') return 'jp';
    if (c === 'germany' || c === 'de') return 'de';
    if (c === 'belgium' || c === 'be') return 'be';
    if (c === 'united kingdom' || c === 'uk' || c === 'gb') return 'gb';
    if (c === 'canada' || c === 'ca') return 'ca';
    if (c === 'mexico' || c === 'mx') return 'mx';
    if (c === 'australia' || c === 'au') return 'au';
    if (c === 'france' || c === 'fr') return 'fr';
    if (c === 'netherlands' || c === 'nl') return 'nl';
    return '';
}

// Star rating component with precise half-star gradient fill
function StarRating({ rank }: { rank: number | null | string }) {
    if (rank == null || rank === '') return <span className="text-gray-500 text-xs">--</span>;
    
    const numericRank = typeof rank === 'number' ? rank : parseFloat(rank);
    if (isNaN(numericRank)) return <span className="text-gray-500 text-xs">--</span>;
    
    let starColor = '#ef4444'; // Red
    if (numericRank >= 4.0) starColor = '#22c55e'; // Green
    else if (numericRank >= 3.0) starColor = '#eab308'; // Yellow
    else if (numericRank >= 2.0) starColor = '#f97316'; // Orange

    return (
        <div className="flex items-center gap-1.5">
            <div className="flex text-sm gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => {
                    const diff = numericRank - (star - 1);
                    
                    let fillPercentage = 0;
                    if (diff >= 1) fillPercentage = 100;
                    else if (diff > 0) fillPercentage = diff * 100;

                    return (
                        <span key={star} className="relative inline-block text-gray-700">
                            <span>★</span>
                            {fillPercentage > 0 && (
                                <span 
                                    className="absolute top-0 left-0 overflow-hidden" 
                                    style={{ width: `${fillPercentage}%`, color: starColor }}
                                >
                                    ★
                                </span>
                            )}
                        </span>
                    );
                })}
            </div>
            <span className="text-xs font-semibold text-gray-300">({numericRank.toFixed(1)})</span>
        </div>
    );
}

// Dial Speedometer Gauge Component with Check Engine Light overrides for over-limits
function SpeedometerGauge({ value, max, type }: { value: number | null; max: number; type: 'abv' | 'ibu' }) {
    if (value == null || isNaN(value)) return <span className="text-gray-500 text-xs">--</span>;

    const numericVal = typeof value === 'number' ? value : parseFloat(String(value));

    // Check Engine Light override for ABV > 10%
    if (type === 'abv' && numericVal > 10) {
        return (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-950/90 border border-red-500 rounded-lg text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)] animate-pulse">
                <span className="font-mono font-bold text-xs">⚠️</span>
                <span className="font-mono font-bold text-xs">{numericVal}%!</span>
            </div>
        );
    }

    // Check Engine Light override for IBU > 100
    if (type === 'ibu' && numericVal > 100) {
        return (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/90 border border-emerald-400 rounded-lg text-emerald-400 shadow-[0_0_10px_rgba(34,197,94,0.6)] animate-pulse">
                <span className="text-xs">🌿</span>
                <span className="font-mono font-bold text-xs">{numericVal} IBU!</span>
            </div>
        );
    }

    const clampedVal = Math.min(Math.max(numericVal, 0), max);
    const percentage = clampedVal / max;
    const angle = -90 + percentage * 180;

    const unit = type === 'abv' ? '%' : ' IBU';
    const gradientId = `gauge-gradient-${type}-${Math.random().toString(36).substring(2, 9)}`;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-16 h-9 bg-gray-900 rounded-t-full border-t border-x border-gray-700 overflow-hidden flex flex-col items-center justify-end shadow-inner">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 64 36">
                    <defs>
                        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                            {type === 'abv' ? (
                                <>
                                    <stop offset="0%" stopColor="#06b6d4" />     {/* Cyan */}
                                    <stop offset="50%" stopColor="#3b82f6" />    {/* Blue */}
                                    <stop offset="100%" stopColor="#581c87" />   {/* Dark Purple */}
                                </>
                            ) : (
                                <>
                                    <stop offset="0%" stopColor="#d97706" />     {/* Earthy Gold/Brown */}
                                    <stop offset="50%" stopColor="#84cc16" />    {/* Olive/Light Green */}
                                    <stop offset="100%" stopColor="#22c55e" />   {/* Bright Green */}
                                </>
                            )}
                        </linearGradient>
                    </defs>
                    <path
                        d="M 6 30 A 26 26 0 0 1 58 30"
                        fill="none"
                        stroke={`url(#${gradientId})`}
                        strokeWidth="4"
                        strokeLinecap="round"
                    />
                </svg>

                <div 
                    className="absolute bottom-0 w-0.5 h-7 bg-white origin-bottom transition-transform duration-500 z-20 drop-shadow"
                    style={{ transform: `rotate(${angle}deg)` }}
                >
                    <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-red-600 rounded-full border border-white"></div>
                </div>
            </div>

            <div className="w-20 flex justify-between text-[9px] text-gray-400 font-mono mt-0.5 px-0.5">
                <span>0</span>
                <span className="font-bold text-white">{numericVal}{unit}</span>
                <span>{max}</span>
            </div>
        </div>
    );
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

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [breweryName, setBreweryName] = useState('');
    const [beerName, setBeerName] = useState('');
    const [beerStyle, setBeerStyle] = useState('');
    const [country, setCountry] = useState('USA');
    const [state, setState] = useState('Texas');
    const [rank, setRank] = useState('');
    const [abv, setAbv] = useState('');
    const [ibu, setIbu] = useState('');
    const [srm, setSrm] = useState('');
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
                    abv: abv ? parseFloat(abv) : null,
                    ibu: ibu ? parseFloat(ibu) : null,
                    srm: srm ? parseFloat(srm) : null,
                    tasting_notes: tastingNotes,
                }),
            });

            if (res.ok) {
                setIsModalOpen(false);
                setBreweryName('');
                setBeerName('');
                setBeerStyle('');
                setRank('');
                setAbv('');
                setIbu('');
                setSrm('');
                setTastingNotes('');
                fetchBeers();
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

                {/* Filter Controls */}
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
                                    <th className="p-4">Glass</th>
                                    <th className="p-4">Beer / Brewery</th>
                                    <th className="p-4">Style</th>
                                    <th className="p-4">Origin</th>
                                    <th className="p-4">Rank</th>
                                    <th className="p-4">ABV</th>
                                    <th className="p-4">IBU</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800 text-sm">
                                {loading ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-12 text-gray-400">Loading your adventure...</td>
                                    </tr>
                                ) : beers.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="text-center py-12 text-gray-400">No beers found.</td>
                                    </tr>
                                ) : (
                                    beers.map((beer) => {
                                        const countryCode = getCountryCode(beer.country);
                                        return (
                                            <tr key={beer.id} className="hover:bg-[#1a2336] transition-colors">
                                                <td className="p-4 font-mono text-blue-400">#{beer.beer_number}</td>
                                                <td className="p-4">
                                                    <div className="w-8 flex justify-center">
                                                        <BeerGlass srm={beer.srm} />
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="font-bold text-white">{beer.beer_name}</div>
                                                    <div className="text-xs text-gray-400">{beer.brewery_name}</div>
                                                </td>
                                                <td className="p-4 text-gray-300">{beer.beer_style || '--'}</td>
                                                <td className="p-4 text-gray-300">
                                                    <div className="flex items-center gap-2">
                                                        {countryCode ? (
                                                            <img 
                                                                src={`https://flagcdn.com/24x18/${countryCode}.png`} 
                                                                alt={beer.country || 'Flag'} 
                                                                className="w-5 h-3.5 object-cover rounded shadow-sm border border-gray-700" 
                                                            />
                                                        ) : (
                                                            <span className="w-5 h-3.5 flex items-center justify-center text-xs">🌐</span>
                                                        )}
                                                        <span className="font-medium text-white">{beer.country || '--'}</span>
                                                    </div>
                                                    {beer.state && <div className="text-xs text-gray-400 mt-0.5 ml-7">{beer.state}</div>}
                                                </td>
                                                <td className="p-4">
                                                    <StarRating rank={beer.rank} />
                                                </td>
                                                <td className="p-4">
                                                    <SpeedometerGauge value={beer.abv} max={10} type="abv" />
                                                </td>
                                                <td className="p-4">
                                                    <SpeedometerGauge value={beer.ibu} max={100} type="ibu" />
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Add Beer Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-[#111827] border border-gray-800 rounded-2xl w-full max-w-lg p-6 space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
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
                            <div className="grid grid-cols-3 gap-2">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">ABV (%)</label>
                                    <input type="number" step="0.1" value={abv} onChange={(e) => setAbv(e.target.value)} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="6.5" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">IBU</label>
                                    <input type="number" value={ibu} onChange={(e) => setIbu(e.target.value)} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="45" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">SRM (Color)</label>
                                    <input type="number" value={srm} onChange={(e) => setSrm(e.target.value)} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue-500" placeholder="6" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">Country</label>
                                    <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-400 uppercase mb-1">State</label>
                                    <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="w-full bg-[#1f2937] border border-gray-700 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-blue-500" />
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