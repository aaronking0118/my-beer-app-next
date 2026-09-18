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

    if (s.includes('stout') || s.includes('porter') || s.includes('barrel-aged') || s.includes('quadruple') || s.includes('strong ale') || s.includes('barleywine')) {
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
    if (s.includes('doppelbock') || s.includes('märzen') || s.includes('festbier') || s.includes('amber') || s.includes('bock')) {
        return 'mug';
    }
    return 'pint';
}

export default function BeerGlass({ srm, style }: BeerGlassProps) {
    const color = srmToHex(srm);
    const glassType = getGlassType(style);
    const uid = Math.random().toString(36).substring(2, 9);
    const fillGrad = `fill-${uid}`;
    const shineGrad = `shine-${uid}`;

    return (
        <svg className="w-7 h-10 overflow-visible drop-shadow-sm" viewBox="0 0 32 48">
            <defs>
                <linearGradient id={fillGrad} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={color} stopOpacity="0.82" />
                    <stop offset="45%" stopColor={color} stopOpacity="1" />
                    <stop offset="100%" stopColor={color} stopOpacity="0.7" />
                </linearGradient>
                <linearGradient id={shineGrad} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
                    <stop offset="50%" stopColor="#ffffff" stopOpacity="0.05" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
                </linearGradient>
            </defs>

            {/* --- 1. NONIC PINT --- */}
            {glassType === 'pint' && (
                <>
                    <path d="M 9.5 13.5 L 10.5 43 C 10.5 44.6 11.8 45.8 13.4 45.8 L 18.6 45.8 C 20.2 45.8 21.5 44.6 21.5 43 L 22.5 13.5 Z" fill={`url(#${fillGrad})`} />
                    {/* Foam Head */}
                    <path d="M 9 12 C 9 10 10.8 9.2 12.8 10.2 C 14.8 8.8 17.2 10.2 19.2 9.5 C 21.2 10.2 23 9 23 11.5 C 23 12.8 21 13.2 20 13.2 C 18 13.2 11 13.2 9 12 Z" fill="#f8fafc" />
                    {/* Glass Outline & Nonic ring */}
                    <path d="M 7.5 11 L 9 2.5 C 9.2 1.8 9.9 1.2 10.7 1.2 L 21.3 1.2 C 22.1 1.2 22.8 1.8 23 2.5 L 24.5 11" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 8.2 12 C 8.2 12 10.8 13.2 16 13.2 C 21.2 13.2 23.8 12 23.8 12 L 22.5 43 C 22.5 45.2 20.7 47 18.5 47 L 13.5 47 C 11.3 47 9.5 45.2 9.5 43 Z" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M 11.5 17 L 12.5 41" fill="none" stroke={`url(#${shineGrad})`} strokeWidth="1.5" strokeLinecap="round" />
                </>
            )}

            {/* --- 2. TULIP --- */}
            {glassType === 'tulip' && (
                <>
                    <path d="M 11.5 22 C 8.5 25 8.5 31 11.5 35 C 14 38.5 15 40.5 15 44 L 17 44 C 17 40.5 18 38.5 20.5 35 C 23.5 31 23.5 25 20.5 22 Z" fill={`url(#${fillGrad})`} />
                    {/* Foam */}
                    <path d="M 10 11 C 10 9.2 11.8 8.8 13.8 9.8 C 15.8 8.5 18.2 9.8 20 9.2 C 22 9.8 22 11 22 12 C 22 12.8 20 13 16 13 C 12 13 10 12.2 10 11 Z" fill="#f8fafc" />
                    {/* Outline */}
                    <path d="M 10 10.5 C 8.8 13.5 7.5 18 9.8 22 C 12.5 26.5 12 29.8 10.5 34 L 21.5 34 C 20 29.8 19.5 26.5 22.2 22 C 24.5 18 23.2 13.5 22 10.5" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M 15 34 L 15 44.5 L 17 44.5 L 17 34" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M 11.5 44.5 L 20.5 44.5" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                </>
            )}

            {/* --- 3. SNIFTER --- */}
            {glassType === 'snifter' && (
                <>
                    <path d="M 9.5 23 C 8 27 9 34 13 38 L 19 38 C 23 34 24 27 22.5 23 Z" fill={`url(#${fillGrad})`} />
                    <path d="M 15 39 L 15 45 L 17 45 L 17 39" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinejoin="round" />
                    <path d="M 11.5 46 L 20.5 46" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 10.5 22 C 9 18 12.5 13.5 16 13.5 C 19.5 13.5 23 18 21.5 22 C 23.5 26 23.5 33 19 38 C 17 39.5 15 39.5 13 38 C 8.5 33 8.5 26 10.5 22 Z" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </>
            )}

            {/* --- 4. WEIZEN --- */}
            {glassType === 'weizen' && (
                <>
                    <path d="M 10 16 L 11 42.5 C 11 44.2 11.8 45.2 13 45.2 L 19 45.2 C 20.2 45.2 21 44.2 21 42.5 L 22 16 Z" fill={`url(#${fillGrad})`} />
                    {/* Foam */}
                    <path d="M 9 15 C 9 13.2 10.8 12.5 12.8 13.5 C 14.8 12 17.2 13.2 19.2 12.8 C 21 13.5 23 13 23 15 C 23 16 21 16.2 16 16.2 C 11 16.2 9 15.8 9 15 Z" fill="#f8fafc" />
                    {/* Outline */}
                    <path d="M 8.5 14 C 8.5 14 9.5 9 11.5 7 L 20.5 7 C 22.5 9 23.5 14 23.5 14" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 9.5 15 L 22.5 15" fill="none" stroke="#cbd5e1" strokeWidth="1.2" />
                    <path d="M 11 16 L 11 42.5 C 11 44.8 12 46.2 13.8 46.2 L 18.2 46.2 C 20 46.2 21 44.8 21 42.5 L 22 16" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinejoin="round" />
                </>
            )}

            {/* --- 5. PILSNER --- */}
            {glassType === 'pilsner' && (
                <>
                    <path d="M 11.5 13 L 13 41 C 13 42.5 13.8 43.5 14.8 43.5 L 17.2 43.5 C 18.2 43.5 19 42.5 19 41 L 20.5 13 Z" fill={`url(#${fillGrad})`} />
                    {/* Foam */}
                    <path d="M 10.5 12 C 10.5 10.2 12 9.8 14 10.8 C 16 9.5 18 10.8 19.5 10.2 C 21 10.8 21.5 11.8 21.5 12.8 C 21.5 13.5 19 13.8 16 13.8 C 13 13.8 10.5 13 10.5 12 Z" fill="#f8fafc" />
                    {/* Outline */}
                    <path d="M 10 11 C 9.5 7.5 11.5 2 14 2 L 18 2 C 20.5 2 22.5 7.5 22 11" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 13 41 C 13 43.5 14 45 15.5 45 L 16.5 45 C 18 45 19 43.5 19 41 L 20.5 13 L 11.5 13 Z" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinejoin="round" />
                </>
            )}

            {/* --- 6. MUG --- */}
            {glassType === 'mug' && (
                <>
                    <path d="M 9.5 13 L 10.5 42.5 C 10.5 44.2 11.5 45.2 13 45.2 L 19 45.2 C 20.5 45.2 21.5 44.2 21.5 42.5 L 22.5 13 Z" fill={`url(#${fillGrad})`} />
                    {/* Foam */}
                    <path d="M 8.8 12 C 8.8 10.2 10.8 9.5 12.8 10.5 C 14.8 9 17.2 10.5 19.2 10 C 21 10.5 22.5 9.8 23.2 12 C 23.2 13 21 13.5 16 13.5 C 11 13.5 8.8 13 8.8 12 Z" fill="#f8fafc" />
                    {/* Handle */}
                    <path d="M 21.5 16 C 26.5 16 27.5 27 21.5 33" fill="none" stroke="#cbd5e1" strokeWidth="2.2" strokeLinecap="round" />
                    <path d="M 8.5 11.5 L 23.5 11.5" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M 9.5 13 L 10.5 42.5 C 10.5 44.8 11.8 46.2 13.5 46.2 L 18.5 46.2 C 20.2 46.2 21.5 44.8 21.8 42.5 L 22.5 13" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinejoin="round" />
                </>
            )}
        </svg>
    );
}