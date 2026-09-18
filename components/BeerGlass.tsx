import React from 'react';

interface BeerGlassProps {
    srm: number | null;
}

// Convert SRM color value to approximate HEX color
function srmToHex(srm: number | null): string {
    if (srm == null || isNaN(srm)) return '#facc15'; // default yellow
    if (srm <= 2) return '#fef08a';
    if (srm <= 4) return '#fde047';
    if (srm <= 6) return '#facc15';
    if (srm <= 9) return '#eab308';
    if (srm <= 12) return '#ca8a04';
    if (srm <= 15) return '#a16207';
    if (srm <= 18) return '#854d0e';
    if (srm <= 20) return '#713f12';
    if (srm <= 24) return '#422006';
    return '#1c1917';
}

export default function BeerGlass({ srm }: { srm: number | null }) {
    const liquidColor = srmToHex(srm);

    return (
        <div className="relative w-8 h-10 flex items-center justify-center">
            <svg className="w-full h-full drop-shadow" viewBox="0 0 32 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                {/* Beer Mug Handle */}
                <path
                    d="M 23 9 C 29 9, 29 23, 23 23"
                    stroke="#94a3b8"
                    strokeWidth="3"
                    strokeLinecap="round"
                    fill="none"
                />
                
                {/* Mug Body Container */}
                <path
                    d="M 6 6 L 22 6 C 23 18, 23 20, 22 30 C 21 32, 20 32, 19 32 L 9 32 C 8 32, 7 32, 6 30 C 5 20, 5 18, 6 6 Z"
                    fill="#1e293b"
                    stroke="#cbd5e1"
                    strokeWidth="2"
                />

                {/* Liquid Fill */}
                <path
                    d="M 7 11 L 21 11 C 21.8 19, 21.8 21, 21 29 C 20.5 30.5, 20 31, 19 31 L 9 31 C 8 31, 7.5 30.5, 7 29 C 6.2 21, 6.2 19, 7 11 Z"
                    fill={liquidColor}
                />

                {/* Foam Head */}
                <path
                    d="M 6.5 11 C 6.5 9.5, 8 8.5, 10 9 C 12 7.5, 15 8.5, 17 9 C 19 8, 21 9, 21.5 11 C 21.5 12.5, 19 13, 14 13 C 9 13, 6.5 12.5, 6.5 11 Z"
                    fill="#ffffff"
                />
            </svg>
        </div>
    );
}
