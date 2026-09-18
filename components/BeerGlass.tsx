import React from 'react';

interface BeerGlassProps {
    srm: number | null;
    style?: string | null;
}

function srmToHex(srmVal: number | null): string {
    if (srmVal == null || isNaN(srmVal)) return '#f59e0b';
    const srm = Math.max(1, Math.min(40, srmVal));
    const srmColors: Record<number, string> = {
        1: '#f8f6d8', 2: '#fef1bc', 3: '#ffe67c', 4: '#ffdf33', 
        5: '#f8c832', 6: '#ffb020', 7: '#de9610', 8: '#c77d04',
        9: '#bb6c03', 10: '#b05b03', 11: '#ac4c00', 12: '#a63d00',
        13: '#9e3000', 14: '#952500', 15: '#8e1b00', 16: '#851400',
        17: '#7d0e00', 18: '#750900', 19: '#6d0500', 20: '#650100',
        22: '#5d0000', 25: '#520000', 30: '#400000', 35: '#300000', 40: '#1a0000'
    };
    if (srmColors[Math.round(srm)]) return srmColors[Math.round(srm)];
    return '#f59e0b';
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
    return 'pint';
}

export default function BeerGlass({ srm, style }: BeerGlassProps) {
    const color = srmToHex(srm);
    const glassType = getGlassType(style);
    const uid = Math.random().toString(36).substring(2, 9);
    const fillGrad = `fill-${uid}`;
    const glassGrad = `glass-${uid}`;

    return (
        <svg className="w-8 h-10 overflow-visible" viewBox="0 0 36 48">
            <defs>
                <linearGradient id={fillGrad} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.8" />
                    <stop offset="50%" stopColor={color} stopOpacity="1" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id={glassGrad} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
                </linearGradient>
            </defs>

            {/* --- 1. NONIC PINT --- */}
            {glassType === 'pint' && (
                <>
                    <path d="M 9.5 14 L 10.5 43.5 C 10.5 44.9 11.6 46 13 46 L 23 46 C 24.4 46 25.5 44.9 25.5 43.5 L 26.5 14 Z" fill={`url(#${fillGrad})`} />
                    <path d="M 10 12.5 C 10 11 11.5 10 13 11 C 15 9.5 18 11 20 10 C 22 11 24.5 9.5 26 11 C 27.5 10 28 11 28 12.5 Z" fill="#f8fafc" opacity="0.95" />
                    {/* Outline & Rim */}
                    <path d="M 7.5 11.5 L 9 3 C 9.2 2 10.1 1.5 11.2 1.5 L 24.8 1.5 C 25.9 1.5 26.8 2 27 3 L 28.5 11.5" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 8.5 12.5 C 8.5 12.5 11.5 14 18 14 C 24.5 14 27.5 12.5 27.5 12.5 L 26.5 43.5 C 26.5 45.4 24.9 47 23 47 L 13 47 C 11.1 47 9.5 45.4 9.5 43.5 Z" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M 12 18 L 13.5 41" fill="none" stroke={`url(#${glassGrad})`} strokeWidth="1.5" strokeLinecap="round" />
                </>
            )}

            {/* --- 2. TULIP --- */}
            {glassType === 'tulip' && (
                <>
                    <path d="M 12.5 23 C 9 26 9 32 12.5 36 C 15 39 16 41 16 44 L 20 44 C 20 41 21 39 23.5 36 C 27 32 27 26 23.5 23 Z" fill={`url(#${fillGrad})`} />
                    <path d="M 11 11.5 C 11 9.5 13 9 15 10 C 18 8.5 21 10 23 10 C 25 9 27 9.5 27 11.5 Z" fill="#f8fafc" opacity="0.95" />
                    <path d="M 11 11 C 9.5 14 8 18.5 10.5 23 C 13.5 27.5 13 31 11 35 L 25 35 C 23 31 22.5 27.5 25.5 23 C 28 18.5 26.5 14 25 11" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 16 35 L 16 44.5 L 20 44.5 L 20 35" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M 12 44.5 L 24 44.5" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                </>
            )}

            {/* --- 3. SNIFTER --- */}
            {glassType === 'snifter' && (
                <>
                    <path d="M 10 24 C 8.5 28 9.5 35 13.5 39 L 22.5 39 C 26.5 35 27.5 28 26 24 Z" fill={`url(#${fillGrad})`} />
                    <path d="M 15 40 L 15 45.5 L 21 45.5 L 21 40" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M 12 46.5 L 24 46.5" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 11 23 C 9.5 18.5 13 14 18 14 C 23 14 26.5 18.5 25 23 C 27 27 27 34 22.5 39 C 20 40 16 40 13.5 39 C 9 34 9 27 11 23 Z" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </>
            )}

            {/* --- 4. WEIZEN --- */}
            {glassType === 'weizen' && (
                <>
                    <path d="M 10.5 16.5 L 12 43 C 12 44.5 12.8 45.5 14 45.5 L 22 45.5 C 23.2 45.5 24 44.5 24 43 L 25.5 16.5 Z" fill={`url(#${fillGrad})`} />
                    <path d="M 9.5 15.5 C 9.5 13.5 11.5 13 13.5 14 C 16 12.5 19 14 21.5 13.5 C 23.5 14.5 25.5 13.5 26.5 15.5 Z" fill="#f8fafc" opacity="0.95" />
                    <path d="M 8.5 14.5 C 8.5 14.5 9.5 9.5 11.5 7.5 L 24.5 7.5 C 26.5 9.5 27.5 14.5 27.5 14.5" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 10 15.5 L 26 15.5" fill="none" stroke="#94a3b8" strokeWidth="1.2" />
                    <path d="M 12 43 C 12 45.2 13.2 46.5 15 46.5 L 21 46.5 C 22.8 46.5 24 45.2 24 43 L 25.5 16.5 L 10.5 16.5 Z" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinejoin="round" />
                </>
            )}

            {/* --- 5. PILSNER --- */}
            {glassType === 'pilsner' && (
                <>
                    <path d="M 13.5 13.5 L 14.5 41 C 14.5 42.5 15 43.5 16 43.5 L 20 43.5 C 21 43.5 21.5 42.5 21.5 41 L 22.5 13.5 Z" fill={`url(#${fillGrad})`} />
                    <path d="M 12.5 12.5 C 12.5 10.5 14.5 10.5 16.5 11.5 C 18.5 10.5 20.5 11.5 22.5 11 C 24 10.5 24.5 12 24.5 12.5 Z" fill="#f8fafc" opacity="0.95" />
                    <path d="M 12 11.5 C 11.5 8 13.5 2 15.5 2 L 20.5 2 C 22.5 2 24.5 8 24 11.5" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 14 41 C 14 43.5 15 45 16.5 45 L 19.5 45 C 21 45 22 43.5 22 41 L 22.5 13.5 L 13.5 13.5 Z" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinejoin="round" />
                </>
            )}

            {/* --- 6. MUG --- */}
            {glassType === 'mug' && (
                <>
                    <path d="M 10 13 L 11 43 C 11 44.8 12 45.8 13.5 45.8 L 22.5 45.8 C 24 45.8 25 44.8 25 43 L 26 13 Z" fill={`url(#${fillGrad})`} />
                    <path d="M 9.5 12 C 9.5 10 11.5 9.5 13.5 10.5 C 16 9 18.5 10.5 21 10 C 23 10.5 25 9.5 26.5 12 Z" fill="#f8fafc" opacity="0.95" />
                    {/* Handle */}
                    <path d="M 25 17 C 30 17 31 28 25 34" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M 9.5 11.5 L 26.5 11.5" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 10 13 L 11 43 C 11 45.2 12.5 46.8 14.5 46.8 L 21.5 46.8 C 23.5 46.8 25 45.2 25.5 43 L 26.5 13" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinejoin="round" />
                </>
            )}
        </svg>
    );
}