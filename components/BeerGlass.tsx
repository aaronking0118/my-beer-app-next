import React from 'react';

interface BeerGlassProps {
    srm: number | null;
    style?: string | null;
}

// Convert SRM to an approximate hex color, returns null if no SRM
function srmToHex(srmVal: number | null): string | null {
    if (srmVal == null || srmVal <= 0) return null;
    const srm = Math.max(1, Math.min(40, srmVal));
    const srmColors: Record<number, string> = {
        1: '#f8f6d8', 2: '#fef1bc', 3: '#ffe67c', 4: '#ffdf33',
        5: '#f8c832', 6: '#ffb020', 7: '#de9610', 8: '#c77d04',
        9: '#bb6c03', 10: '#b05b03', 11: '#ac4c00', 12: '#a63d00',
        13: '#9e3000', 14: '#952500', 15: '#8e1b00', 16: '#851400',
        17: '#7d0e00', 18: '#750900', 19: '#6d0500', 20: '#650100',
        22: '#5d0000', 25: '#520000', 30: '#400000', 35: '#300000', 40: '#1a0000'
    };
    return srmColors[Math.round(srm)] || '#f59e0b';
}

function getGlassType(style?: string | null): 'pint' | 'tulip' | 'snifter' | 'weizen' | 'pilsner' | 'mug' {
    if (!style) return 'pint';
    const s = style.toLowerCase();
    if (s.includes('stout') || s.includes('porter') || s.includes('barrel-aged') || s.includes('quad') || s.includes('strong ale') || s.includes('barleywine')) {
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
    if (s.includes('bock') || s.includes('märzen') || s.includes('festbier') || s.includes('amber')) {
        return 'mug';
    }
    return 'pint';
}

export default function BeerGlass({ srm, style }: BeerGlassProps) {
    const color = srmToHex(srm);
    const glassType = getGlassType(style);
    const uid = Math.random().toString(36).substring(2, 9);
    const fillGrad = `fill-${uid}`;
    const glassGrad = `glass-${uid}`;

    return (
        <svg className="w-7 h-10 overflow-visible drop-shadow-sm" viewBox="0 0 32 48">
            <defs>
                {color && (
                    <linearGradient id={fillGrad} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.85" />
                        <stop offset="45%" stopColor={color} stopOpacity="1" />
                        <stop offset="100%" stopColor={color} stopOpacity="0.75" />
                    </linearGradient>
                )}
                <linearGradient id={glassGrad} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#ffffff" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
                </linearGradient>
            </defs>

            {/* --- 1. NONIC PINT --- */}
            {glassType === 'pint' && (
                <>
                    {color && (
                        <>
                            <path d="M 9.5 15 L 10.5 43 C 10.5 44.7 11.8 46 13.4 46 L 18.6 46 C 20.2 46 21.5 44.7 21.5 43 L 22.5 15 Z" fill={`url(#${fillGrad})`} />
                            <path d="M 9 13.5 C 9 11.7 10.8 10.7 12.8 11.7 C 14.8 10.3 17.2 11.7 19.2 11 C 21.2 11.7 23 10.5 23 13 C 23 14.3 21 14.7 20 14.7 C 18 14.7 11 14.7 9 13.5 Z" fill="#f8fafc" opacity="0.95" />
                        </>
                    )}
                    <path d="M 7.5 12 L 9 3.5 C 9.2 2.5 10.1 1.8 10.7 1.8 L 21.3 1.8 C 22.1 1.8 22.8 2.5 23 3.5 L 24.5 12" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 8.2 13 C 8.2 13 11 14.3 16 14.3 C 21 14.3 23.8 13 23.8 13 L 22.8 43 C 22.8 45.3 20.8 47.5 18.2 47.5 L 13.8 47.5 C 11.2 47.5 9.2 45.3 9.2 43 Z" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M 11.8 18 L 12.8 41" fill="none" stroke={`url(#${glassGrad})`} strokeWidth="1.5" strokeLinecap="round" />
                </>
            )}

            {/* --- 2. TULIP --- */}
            {glassType === 'tulip' && (
                <>
                    {color && (
                        <>
                            <path d="M 12 23 C 9 26 9 32 12 36 C 14.5 39.5 16 41.5 16 44.5 L 18 44.5 C 18 41.5 19 39.5 21.5 36 C 24.5 32 24.5 26 21.5 23 Z" fill={`url(#${fillGrad})`} />
                            <path d="M 10 12.5 C 10 10.7 11.8 10.3 13.8 11.3 C 15.8 10 18.2 11.3 20 10.7 C 21.8 11.3 22.5 12.5 22.5 13.5 C 22.5 14.3 20.5 14.5 16 14.5 C 11.5 14.5 10 13.3 10 12.5 Z" fill="#f8fafc" opacity="0.95" />
                        </>
                    )}
                    <path d="M 10 11.5 C 8.8 14 7.5 18.5 9.8 23 C 12.8 28.5 13 31.8 11 35 L 24 35 C 22 31.8 22.2 28.5 25.2 23 C 27.5 18.5 26.2 14 25 11.5" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 16 35 L 16 45 L 18 45 L 18 35" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M 12 45 L 22 45" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                </>
            )}

            {/* --- 3. SNIFTER --- */}
            {glassType === 'snifter' && (
                <>
                    {color && (
                        <path d="M 10 25 C 8.5 29 9.5 36 13.5 40 L 20.5 40 C 24.5 36 25.5 29 24 25 Z" fill={`url(#${fillGrad})`} />
                    )}
                    <path d="M 15 40.5 L 15 46 L 19 46 L 19 40.5" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M 12.5 47 L 21.5 47" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 11 24 C 9.5 19.5 12.5 14.5 17 14.5 C 21.5 14.5 24.5 19.5 23 24 C 25 28 25 35 20.5 40 C 18.5 41.5 16.5 41.5 13.5 40 C 9 35 9 28 11 24 Z" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </>
            )}

            {/* --- 4. WEIZEN --- */}
            {glassType === 'weizen' && (
                <>
                    {color && (
                        <>
                            <path d="M 10 17 L 11 43 C 11 44.8 11.8 46 13.5 46 L 18.5 46 C 20.2 46 21 44.8 21 43 L 22 17 Z" fill={`url(#${fillGrad})`} />
                            <path d="M 9 16 C 9 14.2 10.8 13.5 12.8 14.5 C 14.8 13 17.2 14.5 19.2 14 C 21 14.7 23 14 23 16 C 23 17.2 21 17.5 16 17.5 C 11 17.5 9 17 9 16 Z" fill="#f8fafc" opacity="0.95" />
                        </>
                    )}
                    <path d="M 8 15 C 8 15 9 10 11 8 L 20 8 C 22 10 23 15 23 15" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 9.5 16 L 21.5 16" fill="none" stroke="#cbd5e1" strokeWidth="1.2" />
                    <path d="M 11 17 L 11 43 C 11 45.5 12.2 47.2 14.2 47.2 L 17.8 47.2 C 19.8 47.2 21 45.5 21 43 L 22 17" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinejoin="round" />
                </>
            )}

            {/* --- 5. PILSNER --- */}
            {glassType === 'pilsner' && (
                <>
                    {color && (
                        <>
                            <path d="M 12 14 L 13 41 C 13 42.8 13.5 44 14.5 44 L 17.5 44 C 18.5 44 19 42.8 19 41 L 20 14 Z" fill={`url(#${fillGrad})`} />
                            <path d="M 11 13 C 11 11.2 12.5 10.8 14.5 11.8 C 16.5 10.5 18.5 11.8 20 11.2 C 21.5 11.8 22.5 12.8 22.5 13.8 C 22.5 14.8 20 15.2 16 15.2 C 12 15.2 11 14.2 11 13 Z" fill="#f8fafc" opacity="0.95" />
                        </>
                    )}
                    <path d="M 10.5 12 C 10 8.5 11.8 3 14 3 L 17 3 C 19.2 3 21 8.5 20.5 12" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 13 41 C 13 43.8 13.8 46 15.5 46 L 16.5 46 C 18.2 46 19 43.8 19 41 L 20 14 L 12 14 Z" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinejoin="round" />
                </>
            )}

            {/* --- 6. BEER MUG --- */}
            {glassType === 'mug' && (
                <>
                    {color && (
                        <>
                            <path d="M 9 13 L 10 43 C 10 45 11.5 46.5 13.5 46.5 L 20.5 46.5 C 22.5 46.5 24 45 24 43 L 25 13 Z" fill={`url(#${fillGrad})`} />
                            <path d="M 8.5 12 C 8.5 10.2 10.5 9.7 12.5 10.7 C 14.5 9.3 16.8 10.7 18.8 10 C 20.8 10.7 22.5 9.7 23.2 12 C 23.2 13.2 21 13.7 16 13.7 C 11 13.7 8.5 13.2 8.5 12 Z" fill="#f8fafc" opacity="0.95" />
                        </>
                    )}
                    <path d="M 24 17 C 29 17 30 28 24 34" fill="none" stroke="#cbd5e1" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M 8.5 11.5 L 23.5 11.5" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 9 13 L 10 43 C 10 45.2 11.5 47 13.8 47 L 20.2 47 C 22.5 47 24 45.2 24.5 43 L 25.5 13" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinejoin="round" />
                </>
            )}
        </svg>
    );
}