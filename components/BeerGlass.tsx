import React from 'react';
import { srmToHex } from '@/utils/srmToHex';

interface BeerGlassProps {
  srm?: number | null;
  beerName?: string;
}

export default function BeerGlass({ srm, beerName }: BeerGlassProps) {
  const fillColor = srmToHex(srm);

  return (
    <div className="flex items-center gap-3">
      {/* SVG Pint Glass */}
      <svg
        width="28"
        height="40"
        viewBox="0 0 32 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm flex-shrink-0"
      >
        {/* Glass Outline & Body Mask */}
        <path
          d="M6 2L3 42C2.8 44.5 4.8 46.5 7.3 46.5H24.7C27.2 46.5 29.2 44.5 29 42L26 2H6Z"
          fill="#1e293b"
          stroke="#64748b"
          strokeWidth="2"
        />
        {/* Liquid Fill based on SRM */}
        <path
          d="M6.8 8L4.5 40C4.4 41.5 5.6 42.8 7.1 42.8H24.9C26.4 42.8 27.6 41.5 27.5 40L25.2 8H6.8Z"
          fill={fillColor}
        />
        {/* Foam / Head */}
        <path
          d="M6.2 6H25.8C26.3 6 26.7 5.6 26.6 5.1C26.3 3.5 24.8 2.2 23 2.2H9C7.2 2.2 5.7 3.5 5.4 5.1C5.3 5.6 5.7 6 6.2 6Z"
          fill="#f8fafc"
          opacity="0.9"
        />
      </svg>
      {srm != null && (
        <span className="text-xs text-slate-400 font-mono">SRM: {srm}</span>
      )}
    </div>
  );
}