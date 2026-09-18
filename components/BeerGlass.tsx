import React from 'react';

interface BeerGlassProps {
    srm: number | null;
    style?: string | null;
}

// Convert SRM (Standard Reference Method) to an approximate hex color for beer
function srmToHex(srmVal: number | null): string {
    if (srmVal == null || isNaN(srmVal)) return '#f59e0b'; // Default amber
    const srm = Math.max(1, Math.min(40, srmVal));
    
    // Approximate SRM color mapping scale
    const srmColors: Record<number, string>  = {
        1: '#f8f6d8', 2: '#fef1bc', 3: '#ffe67c', 4: '#ffdf33', 
        5: '#f8c832', 6: '#ffb020', 7: '#de9610', 8: '#c77d04',
        9: '#bb6c03', 10: '#b05b03', 11: '#ac4c00', 12: '#a63d00',
        13: '#9e3000', 14: '#952500', 15: '#8e1b00', 16: '#851400',
        17: '#7d0e00', 18: '#750900', 19: '#6d0500', 20: '#650100',
        22: '#5d0000', 25: '#520000', 30: '#400000', 35: '#300000', 40: '#1a0000'
    };

    if (srmColors[Math.round(srm)]) return srmColors[Math.round(srm)];
    
    // Fallback linear interpolation approximation
    const keys = Object.keys(srmColors).map(Number).sort((a, b) => a - b);
    let lower = keys[0];
    let upper = keys[keys.length - 1];
    for (let i = 0; i < keys.length; i++) {
        if (keys[i] <= srm) lower = keys[i];
        if (keys[i] >= srm) { upper = keys[i]; break; }
    }
    return srmColors[lower] || '#f59e0b';
}

function getGlassType(style?: string | null): 'pint' | 'tulip' | 'snifter' | 'weizen' | 'pilsner' | 'mug' {
    if (!style) return 'pint';
    const s = style.toLowerCase();

    if (s.includes('stout') || s.includes('porter') || s.includes('barrel-aged') || s.includes('quadruple') || s.includes('strong ale')) {
        return 'snifter';
    }
    if (s.includes('ipa') || s.includes('belgian') || s.includes('saison') || s.includes('wild ale') || s.includes('lambic') || s.includes('sour')) {
        return 'tulip';
    }
    if (s.includes('hefeweizen') || s.includes('witbier') || s.includes('wheat')) {
        return 'weizen';
    }
    if (s.includes('pilsner') || s.includes('helles') || s.includes('kölsch') || s.includes('lager')) {
        return 'pilsner';
    }
    if (s.includes('doppelbock') || s.includes('märzen') || s.includes('festbier') || s.includes('amber')) {
        return 'mug';
    }
    return 'pint'; // Default Nonic Pint
}

export default function BeerGlass({ srm, style }: BeerGlassProps) {
    const color = srmToHex(srm);
    const glassType = getGlassType(style);
    const gradientId = `beer-fill-${Math.random().toString(36).substring(2, 9)}`;

    return (
        <svg className="w-8 h-10 overflow-visible" viewBox="0 0 36 48">
            <defs>
                <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.85" />
                    <stop offset="50%" stopColor={color} stopOpacity="1" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.75" />
                </linearGradient>
            </defs>

            {/* --- SHAPE 1: NOMIC PINT --- */}
            {glassType === 'pint' && (
                <>
                    {/* Beer Fill */}
                    <path d="M 8.5 13 L 9.5 43 C 9.5 44.5 10.5 45.5 12 45.5 L 24 45.5 C 25.5 45.5 26.5 44.5 26.5 43 L 27.5 13 Z" fill={`url(#${gradientId})`} />
                    {/* Foam head */}
                    <path d="M 8.2 13 C 8.2 11 10 10.5 12 11 C 14 9.5 16 11.5 18 10.5 C 20 11.5 22 9.5 24 11 C 26 10.5 27.8 11 27.8 13 Z" fill="#f8fafc" />
                    {/* Glass Outline */}
                    <path d="M 7 11 L 8.5 2.5 C 8.7 2 9.2 1.5 9.8 1.5 L 26.2 1.5 C 26.8 1.5 27.3 2 27.5 2.5 L 29 11 M 8 12 C 8 12 11 13.5 18 13.5 C 25 13.5 28 12 28 12 L 27.5 43 C 27.5 45.2 25.7 47 23.5 47 L 12.5 47 C 10.3 47 8.5 45.2 8.5 43 Z" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </>
            )}

            {/* --- SHAPE 2: TULIP (IPAs & Belgians) --- */}
            {glassType === 'tulip' && (
                <>
                    <path d="M 12 23 C 8 26 8 32 12 36 C 15 39 16 41 16 44 L 20 44 C 20 41 21 39 24 36 C 28 32 28 26 24 23 Z" fill={`url(#${gradientId})`} />
                    {/* Foam */}
                    <path d="M 11 12 C 11 10 13 9.5 15 10.5 C 18 9 21 10.5 23 10.5 C 25 9.5 27 10 27 12 Z" fill="#f8fafc" />
                    {/* Outline */}
                    <path d="M 11 11 C 9 14 7 19 10 24 C 13 28 12 31 10 35 L 14 35 C 15 32 17 28 21 24 C 24 20 23 15 25 11 M 16 35 L 16 44 L 20 44 L 20 35 M 13 44 L 23 44" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </>
            )}

            {/* --- SHAPE 3: SNIFTER (Stouts & Barleywines) --- */}
            {glassType === 'snifter' && (
                <>
                    <path d="M 9 24 C 7 28 8 35 13 39 L 23 39 C 28 35 29 28 27 24 Z" fill={`url(#${gradientId})`} />
                    <path d="M 15 41 L 15 45 L 21 45 L 21 41" fill="none" stroke="#94a3b8" strokeWidth="1.5" />
                    <path d="M 10 23 C 9 18 13 14 18 14 C 23 14 27 18 26 23 C 28 27 28 34 23 39 C 20 41 16 41 13 39 C 8 34 8 27 10 23 Z" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                </>
            )}

            {/* --- SHAPE 4: WEIZEN (Wheat Beers) --- */}
            {glassType === 'weizen' && (
                <>
                    <path d="M 10 17 L 11.5 43 C 11.5 45 12.5 46 14 46 L 22 46 C 23.5 46 24.5 45 24.5 43 L 26 17 Z" fill={`url(#${gradientId})`} />
                    <path d="M 9 16 C 9 14 11 13.5 13 14.5 C 15 13 18 14 21 13.5 C 23 14.5 25 13 27 16 Z" fill="#f8fafc" />
                    <path d="M 8 15 C 8 15 9 10 11 8 L 25 8 C 27 10 28 15 28 15 M 10 16 L 26 16 M 11.5 43 C 11.5 45.5 13 46.5 15 46.5 L 21 46.5 C 23 46.5 24.5 45.5 24.5 43 L 26 17 L 10 17 Z" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                </>
            )}

            {/* --- SHAPE 5: PILSNER FLUTE --- */}
            {glassType === 'pilsner' && (
                <>
                    <path d="M 13 13 L 14.5 41 C 14.5 43 15 44 16 44 L 20 44 C 21 44 21.5 43 21.5 41 L 23 13 Z" fill={`url(#${gradientId})`} />
                    <path d="M 12 12 C 12 10 14 10 16 11 C 18 10 20 11 22 10.5 C 24 10 24 12 24 12 Z" fill="#f8fafc" />
                    <path d="M 11.5 11 C 11 8 13 2 15 2 L 21 2 C 23 2 25 8 24.5 11 M 13.5 41 C 13.5 43.5 14.5 45.5 16 45.5 L 20 45.5 C 21.5 45.5 22.5 43.5 22.5 41 L 23 13 L 13 13 Z" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                </>
            )}

            {/* --- SHAPE 6: BEER MUG (Lagers/Bocks) --- */}
            {glassType === 'mug' && (
                <>
                    <path d="M 9 13 L 10 43 C 10 45 11 46 13 46 L 23 46 C 25 46 26 45 26 43 L 27 13 Z" fill={`url(#${gradientId})`} />
                    <path d="M 8.8 13 C 8.8 11 11 10.5 13 11.5 C 15 10 18 11.5 21 11 C 23 11.5 25 10 27.2 13 Z" fill="#f8fafc" />
                    {/* Handle */}
                    <path d="M 27 17 C 32 17 33 28 27 34" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 9 12 L 27 12 M 9.5 13 L 10 43 C 10 45.2 11.8 47 14 47 L 22 47 C 24.2 47 26 45.2 26.5 43 L 27 13" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                </>
            )}
        </svg>
    );
}