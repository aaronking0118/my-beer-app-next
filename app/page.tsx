'use client';

import { useState, useEffect, useMemo } from 'react';
import BeerGlass from '@/components/BeerGlass';

export const dynamic = 'force-dynamic';

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

function StarRating({ rank }: { rank: number | null | string }) {
    if (rank == null || rank === '') return <span className="text-gray-500 text-xs">--</span>;
    
    const numericRank = typeof rank === 'number' ? rank : parseFloat(rank);
    if (isNaN(numericRank)) return <span className="text-gray-500 text-xs">--</span>;
    
    let starColor = '#ef4444';
    if (numericRank >= 4.0) starColor = '#22c55e';
    else if (numericRank >= 3.0) starColor = '#eab308';
    else if (numericRank >= 2.0) starColor = '#f97316';

    const starPath = "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";

    const stars = [];
    for (let i = 1; i <= 5; i++) {
        const diff = numericRank - (i - 1);
        if (diff >= 0.75) {
            stars.push('full');
        } else if (diff >= 0.25) {
            stars.push('half');
        } else {
            stars.push('empty');
        }
    }

    const formattedRank = Number.isInteger(numericRank) ? numericRank.toString() : numericRank.toFixed(1);

    return (
        <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
                {stars.map((type, index) => {
                    if (type === 'full') {
                        return (
                            <svg key={index} className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill={starColor}>
                                <path d={starPath} />
                            </svg>
                        );
                    }
                    if (type === 'half') {
                        return (
                            <div key={index} className="relative w-4 h-4 flex-shrink-0">
                                <svg className="absolute inset-0 w-4 h-4" viewBox="0 0 24 24" fill="#374151">
                                    <path d={starPath} />
                                </svg>
                                <svg className="absolute inset-0 w-4 h-4 overflow-hidden" viewBox="0 0 24 24" style={{ clipPath: 'inset(0 50% 0 0)' }} fill={starColor}>
                                    <path d={starPath} />
                                </svg>
                            </div>
                        );
                    }
                    return (
                        <svg key={index} className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24" fill="#374151">
                            <path d={starPath} />
                        </svg>
                    );
                })}
            </div>
            <span className="text-xs font-semibold text-gray-300">{formattedRank}</span>
        </div>
    );
}

function SpeedometerGauge({ value, max, type, beerId }: { value: number | null; max: number; type: 'abv' | 'ibu'; beerId: number }) {
    if (value == null || isNaN(value)) return <span className="text-gray-500 text-xs">--</span>;

    const numericVal = typeof value === 'number' ? value : parseFloat(String(value));

    const percentExclamationIcon = (
        <span className="font-mono font-black text-sm animate-pulse tracking-tighter">
            %!
        </span>
    );

    const detailedHopIcon = (
        <svg className="w-4 h-4 animate-pulse flex-shrink-0 text-emerald-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C10.5 2 9 3.2 9 5c0 .8.3 1.5.8 2.1C8.3 8 7 9.8 7 12c0 1.8.8 3.4 2 4.4-.5.8-.8 1.7-.8 2.6 0 2.2 1.8 4 4 4s4-1.8 4-4c0-.9-.3-1.8-.8-2.6 1.2-1 2-2.6 2-4.4 0-2.2-1.3-4-2.8-4.9.5-.6.8-1.3.8-2.1 0-1.8-1.5-3-3-3zm0 2c.6 0 1 .6 1 1.5 0 .5-.2 1-.6 1.4l-.4.4-.4-.4c-.4-.4-.6-.9-.6-1.4 0-.9.4-1.5 1-1.5zm0 6c1.1 0 2 .5 2.6 1.2-.6.7-1.5 1.2-2.6 1.2s-2-.5-2.6-1.2c.6-.7 1.5-1.2 2.6-1.2zm0 5c1.4 0 2.7.5 3.6 1.3-.9.8-2.2 1.3-3.6 1.3s-2.7-.5-3.6-1.3c.9-.8 2.2-1.3 3.6-1.3zm0 4.5c.9 0 1.8-.3 2.5-.8-.7.5-1.6.8-2.5.8s-1.8-.3-2.5-.8c.7.5 1.6.8 2.5.8z"/>
        </svg>
    );

    if (type === 'abv' && numericVal > 10) {
        return (
            <div className="flex justify-center">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-950/95 border border-red-500 rounded-lg text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                    {percentExclamationIcon}
                    <span className="font-mono font-bold text-xs">{numericVal.toFixed(1)}%</span>
                </div>
            </div>
        );
    }

    if (type === 'ibu' && numericVal > 100) {
        return (
            <div className="flex justify-center">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950/95 border border-emerald-400 rounded-lg text-emerald-400 shadow-[0_0_10px_rgba(34,197,94,0.6)]">
                    {detailedHopIcon}
                    <span className="font-mono font-bold text-xs">{Math.round(numericVal)}</span>
                </div>
            </div>
        );
    }

    const clampedVal = Math.min(Math.max(numericVal, 0), max);
    const percentage = clampedVal / max;
    const angle = -90 + percentage * 180;

    const formattedVal = type === 'abv' 
        ? (Number.isInteger(numericVal) ? `${numericVal}%` : `${numericVal.toFixed(1)}%`)
        : `${Math.round(numericVal)}`;

    const gradientId = `gauge-gradient-${beerId}-${type}`;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-16 flex flex-col items-center">
                <div className="relative w-16 h-9 bg-gray-900 rounded-t-full border-t border-x border-gray-700 overflow-hidden flex flex-col items-center justify-end shadow-inner">
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 64 36">
                        <defs>
                            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                                {type === 'abv' ? (
                                    <>
                                        <stop offset="0%" stopColor="#06b6d4" />
                                        <stop offset="50%" stopColor="#3b82f6" />
                                        <stop offset="100%" stopColor="#581c87" />
                                    </>
                                ) : (
                                    <>
                                        <stop offset="0%" stopColor="#d97706" />
                                        <stop offset="50%" stopColor="#84cc16" />
                                        <stop offset="100%" stopColor="#22c55e" />
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
                        className="absolute bottom-0 w-0.5 h-7 bg-white origin-bottom transition-transform duration-500 z-20 drop-shadow-[0_0_2px_rgba(255,255,255,0.8)] left-1/2 -translate-x-1/2"
                        style={{ transform: `translateX(-50%) rotate(${angle}deg)` }}
                    >
                        <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 bg-white rounded-full border border-gray-900"></div>
                    </div>
                </div>
            </div>

            <div className="w-24 flex items-center justify-between text-[9px] text-gray-400 font-mono mt-0.5 px-1 relative">
                <span>0</span>
                <span className="absolute left-1/2 -translate-x-1/2 font-bold text-white text-center">{formattedVal}</span>
                <span className="ml-auto">{max}</span>
            </div>
        </div>
    );
}

export default function Home() {
    const [beers, setBeers] = useState<Beer[]>([]);
    const [totalBeers, setTotalBeers] = useState(0);
    const [totalBreweries, setTotalBreweries] = useState(0);
    const [styles, setStyles] = useState<string[]>([]);
    
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('');
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
    
    const [beerMax, setBeerMax] = useState(15000);
    const [breweryMax, setBreweryMax] = useState(2000);

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

    const averageRank = useMemo(() => {
        const rankedBeers = beers.filter(b => b.rank != null && !isNaN(Number(b.rank)));
        if (rankedBeers.length === 0) return 0;
        const sum = rankedBeers.reduce((acc, b) => acc + Number(b.rank), 0);
        return sum / rankedBeers.length;
    }, [beers]);
    
    const beerAngle = Math.min(Math.max((totalBeers / beerMax) * 180 - 90, -90), 90);
    const breweryAngle = Math.min(Math.max((totalBreweries / breweryMax) * 180 - 90, -90), 90);

    const rankMax = 5;
    const rankPercentage = Math.min(averageRank / rankMax, 1);
    const rankAngle = -90 + rankPercentage * 180;

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
                
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-gray-800 pb-6">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                            <span className="w-8 h-8 flex items-center justify-center">
                                <BeerGlass srm={6} />
                            </span>
                            Aaron's Great Beer Adventure
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">
                            {totalBeers.toLocaleString()} Beers and Counting
                        </p>
                    </div>

                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-3 bg-gray-900/80 border border-gray-800 p-2.5 rounded-xl">
                            <span className="text-xs text-gray-400 font-mono">Goals:</span>
                            <div className="flex items-center gap-2 text-xs font-mono">
                                <label className="text-gray-500">Beers:</label>
                                <input 
                                    type="number" 
                                    value={beerMax} 
                                    onChange={(e) => setBeerMax(Number(e.target.value))}
                                    className="w-20 bg-gray-950 border border-gray-700 rounded px-2 py-1 text-white text-right focus:outline-none focus:border-blue-500"
                                />
                                <label className="text-gray-500">Breweries:</label>
                                <input 
                                    type="number" 
                                    value={breweryMax} 
                                    onChange={(e) => setBreweryMax(Number(e.target.value))}
                                    className="w-20 bg-gray-950 border border-gray-700 rounded px-2 py-1 text-white text-right focus:outline-none focus:border-emerald-500"
                                />
                            </div>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg transition-all flex items-center gap-2"
                        >
                            + Add New Beer
                        </button>
                    </div>
                </div>

                {/* Instrument Cluster Header */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Pod 1: Beers Speedometer (Violet/Fuchsia scheme) */}
                    <div className="bg-gradient-to-b from-[#161f33] to-[#111827] border border-gray-700/80 p-5 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_10px_20px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col items-center">
                        <div className="absolute top-3 left-4 text-[10px] font-mono tracking-widest text-fuchsia-400 uppercase font-bold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 animate-pulse"></span>
                            Beers
                        </div>
                        <div className="mt-6 relative w-36 h-20 bg-gray-950 rounded-t-full border-t border-x border-gray-700 overflow-hidden flex flex-col items-center justify-end shadow-inner">
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 144 72">
                                <defs>
                                    <linearGradient id="pod-beers-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#8b5cf6" />
                                        <stop offset="50%" stopColor="#c084fc" />
                                        <stop offset="100%" stopColor="#d946ef" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M 12 60 A 60 60 0 0 1 132 60"
                                    fill="none"
                                    stroke="url(#pod-beers-grad)"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div 
                                className="absolute bottom-0 w-1 h-16 bg-white origin-bottom transition-transform duration-500 z-20 drop-shadow-[0_0_4px_rgba(255,255,255,0.9)] left-1/2 -translate-x-1/2"
                                style={{ transform: `translateX(-50%) rotate(${beerAngle}deg)` }}
                            >
                                <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 bg-white rounded-full border-2 border-gray-900 shadow-md"></div>
                            </div>
                        </div>
                        <div className="w-40 flex items-center justify-between text-[10px] text-gray-400 font-mono mt-1 px-1">
                            <span>0</span>
                            <span className="font-extrabold text-white text-base tracking-tight">{totalBeers.toLocaleString()}</span>
                            <span>{beerMax.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Pod 2: Breweries Tachometer (Amber/Rose scheme) */}
                    <div className="bg-gradient-to-b from-[#161f33] to-[#111827] border border-gray-700/80 p-5 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_10px_20px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col items-center">
                        <div className="absolute top-3 left-4 text-[10px] font-mono tracking-widest text-amber-500 uppercase font-bold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            Breweries
                        </div>
                        <div className="mt-6 relative w-36 h-20 bg-gray-950 rounded-t-full border-t border-x border-gray-700 overflow-hidden flex flex-col items-center justify-end shadow-inner">
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 144 72">
                                <defs>
                                    <linearGradient id="pod-brewery-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#f59e0b" />
                                        <stop offset="50%" stopColor="#fb7185" />
                                        <stop offset="100%" stopColor="#f43f5e" />
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M 12 60 A 60 60 0 0 1 132 60"
                                    fill="none"
                                    stroke="url(#pod-brewery-grad)"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div 
                                className="absolute bottom-0 w-1 h-16 bg-white origin-bottom transition-transform duration-500 z-20 drop-shadow-[0_0_4px_rgba(255,255,255,0.9)] left-1/2 -translate-x-1/2"
                                style={{ transform: `translateX(-50%) rotate(${breweryAngle}deg)` }}
                            >
                                <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 bg-white rounded-full border-2 border-gray-900 shadow-md"></div>
                            </div>
                        </div>
                        <div className="w-40 flex items-center justify-between text-[10px] text-gray-400 font-mono mt-1 px-1">
                            <span>0</span>
                            <span className="font-extrabold text-white text-base tracking-tight">{totalBreweries.toLocaleString()}</span>
                            <span>{breweryMax.toLocaleString()}</span>
                        </div>
                    </div>

                    {/* Pod 3: Avg Rank Dial (Matching Star Rating Thresholds) */}
                    <div className="bg-gradient-to-b from-[#161f33] to-[#111827] border border-gray-700/80 p-5 rounded-2xl shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_10px_20px_rgba(0,0,0,0.4)] relative overflow-hidden flex flex-col items-center">
                        <div className="absolute top-3 left-4 text-[10px] font-mono tracking-widest text-yellow-400 uppercase font-bold flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse"></span>
                            Average Rank
                        </div>
                        <div className="mt-6 relative w-36 h-20 bg-gray-950 rounded-t-full border-t border-x border-gray-700 overflow-hidden flex flex-col items-center justify-end shadow-inner">
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 144 72">
                                <defs>
                                    <linearGradient id="pod-rank-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#ef4444" /> {/* Red (<2.0) */}
                                        <stop offset="40%" stopColor="#f97316" /> {/* Orange (2.0+) */}
                                        <stop offset="65%" stopColor="#eab308" /> {/* Yellow (3.0+) */}
                                        <stop offset="100%" stopColor="#22c55e" /> {/* Green (4.0+) */}
                                    </linearGradient>
                                </defs>
                                <path
                                    d="M 12 60 A 60 60 0 0 1 132 60"
                                    fill="none"
                                    stroke="url(#pod-rank-grad)"
                                    strokeWidth="6"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div 
                                className="absolute bottom-0 w-1 h-16 bg-white origin-bottom transition-transform duration-500 z-20 drop-shadow-[0_0_4px_rgba(255,255,255,0.9)] left-1/2 -translate-x-1/2"
                                style={{ transform: `translateX(-50%) rotate(${rankAngle}deg)` }}
                            >
                                <div className="absolute -bottom-1.5 -left-1.5 w-4 h-4 bg-white rounded-full border-2 border-gray-900 shadow-md"></div>
                            </div>
                        </div>
                        <div className="w-40 flex items-center justify-between text-[10px] text-gray-400 font-mono mt-1 px-1">
                            <span>0.0</span>
                            <span className="font-extrabold text-white text-base tracking-tight">{averageRank.toFixed(2)}</span>
                            <span>5.0</span>
                        </div>
                    </div>

                </div>

                {/* Filters */}
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

                {/* Table */}
                <div className="bg-[#111827] border border-gray-800 rounded-2xl overflow-hidden shadow-xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-800 text-xs text-gray-400 uppercase tracking-wider bg-[#161f33]">
                                    <th className="p-4">Badge #</th>
                                    <th className="p-4 w-16"></th>
                                    <th className="p-4">Beer / Brewery</th>
                                    <th className="p-4">Style</th>
                                    <th className="p-4">Origin</th>
                                    <th className="p-4">Rank</th>
                                    <th className="p-4 text-center">ABV</th>
                                    <th className="p-4 text-center">IBU</th>
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
                                                    {beer.country ? (
                                                        <div className="flex items-center gap-2">
                                                            {countryCode ? (
                                                                <img 
                                                                    src={`https://flagcdn.com/24x18/${countryCode}.png`} 
                                                                    alt={beer.country} 
                                                                    className="w-5 h-3.5 object-cover rounded shadow-sm border border-gray-700" 
                                                                />
                                                            ) : (
                                                                <span className="w-5 h-3.5 flex items-center justify-center text-xs">??</span>
                                                            )}
                                                            <span className="font-medium text-white">{beer.country}</span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-500 text-xs">--</span>
                                                    )}
                                                    {beer.state && <div className="text-xs text-gray-400 mt-0.5 ml-7">{beer.state}</div>}
                                                </td>
                                                <td className="p-4">
                                                    <StarRating rank={beer.rank} />
                                                </td>
                                                <td className="p-4">
                                                    <SpeedometerGauge value={beer.abv} max={10} type="abv" beerId={beer.id} />
                                                </td>
                                                <td className="p-4">
                                                    <SpeedometerGauge value={beer.ibu} max={100} type="ibu" beerId={beer.id} />
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
        </main>
    );
}