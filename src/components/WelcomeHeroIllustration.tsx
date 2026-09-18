import React from 'react';
import { DESIGN_TOKENS } from '../design-system/tokens';

interface WelcomeHeroIllustrationProps {
  className?: string;
}

export const WelcomeHeroIllustration: React.FC<WelcomeHeroIllustrationProps> = ({ className = '' }) => {
  return (
    <div className={`relative w-full flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 400 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[260px] object-contain"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Subtle Ambient Radial Glow */}
          <radialGradient id="ambientGlow" cx="50%" cy="55%" r="50%">
            <stop offset="0%" stopColor="#E5A93C" stopOpacity="0.18" />
            <stop offset="50%" stopColor="#E5A93C" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#0A0D14" stopOpacity="0" />
          </radialGradient>

          {/* Golden Connection Gradient */}
          <linearGradient id="goldConnectionGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E5A93C" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#FDE68A" stopOpacity="1" />
            <stop offset="100%" stopColor="#E5A93C" stopOpacity="0.9" />
          </linearGradient>

          {/* Floating Card Surface Gradients */}
          <linearGradient id="cardGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1E2738" />
            <stop offset="100%" stopColor="#121824" />
          </linearGradient>

          <linearGradient id="cardGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#252F44" />
            <stop offset="100%" stopColor="#141C2B" />
          </linearGradient>

          {/* Subtle Silhouette Gradients */}
          <linearGradient id="personLeftGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          <linearGradient id="personRightGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3E4C63" />
            <stop offset="100%" stopColor="#1E293B" />
          </linearGradient>

          {/* Soft Card Shadow */}
          <filter id="softCardShadow" x="-20%" y="-20%" width="140%" height="150%" filterUnits="userSpaceOnUse">
            <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000000" floodOpacity="0.65" />
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#E5A93C" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Ambient Center Glow */}
        <circle cx="200" cy="140" r="130" fill="url(#ambientGlow)" />

        {/* Minimal Editorial Architectural Arches (Meeting Space Context) */}
        <path
          d="M60 270 V130 C60 80, 110 40, 170 40 H230 C290 40, 340 80, 340 130 V270"
          stroke="#1E273A"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          opacity="0.6"
        />
        <path
          d="M100 270 V160 C100 120, 140 90, 190 90 H210 C260 90, 300 120, 300 160 V270"
          stroke="#1E273A"
          strokeWidth="1"
          opacity="0.4"
        />

        {/* ------------------------------------------------------------- */}
        {/* PERSON A (LEFT) — Professional holding smartphone with digital card */}
        {/* ------------------------------------------------------------- */}
        <g id="person-left" opacity="0.95">
          {/* Head & Hair */}
          <circle cx="95" cy="85" r="22" fill="#E2E8F0" />
          <path
            d="M74 80 C74 65, 85 58, 105 58 C118 58, 122 68, 120 78 C115 76, 108 75, 98 75 C85 75, 78 78, 74 80 Z"
            fill="#1E293B"
          />
          {/* Neck */}
          <path d="M91 106 H99 V118 H91 Z" fill="#CBD5E1" />

          {/* Shoulders & Business Jacket */}
          <path
            d="M50 250 L62 142 C64 126, 78 116, 94 116 C105 116, 118 123, 122 135 L135 180 L120 250 Z"
            fill="url(#personLeftGrad)"
          />
          {/* Lapel & Collar Accent */}
          <path d="M94 116 L88 160 L102 145 Z" fill="#475569" opacity="0.7" />
          <path d="M96 116 L106 160 L98 145 Z" fill="#475569" opacity="0.9" />

          {/* Left Arm extended forward holding phone */}
          <path
            d="M122 145 L156 168 C160 171, 166 168, 168 163 L172 154"
            stroke="#CBD5E1"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Smartphone device */}
          <g transform="translate(160, 132) rotate(12)">
            {/* Phone Body */}
            <rect x="0" y="0" width="22" height="42" rx="4" fill="#0F172A" stroke="#475569" strokeWidth="1.2" />
            {/* Screen */}
            <rect x="2" y="3" width="18" height="36" rx="2.5" fill="#1E293B" />
            {/* Digital Identity on screen */}
            <rect x="4" y="8" width="14" height="12" rx="2" fill="#E5A93C" fillOpacity="0.25" stroke="#E5A93C" strokeWidth="0.8" />
            <rect x="6" y="11" width="6" height="1.5" rx="0.5" fill="#E5A93C" />
            <rect x="6" y="14" width="9" height="1" rx="0.5" fill="#94A3B8" />
            <circle cx="15" cy="13" r="1.5" fill="#E5A93C" />
            {/* Home indicator bar */}
            <line x1="8" y1="36" x2="14" y2="36" stroke="#64748B" strokeWidth="1" strokeLinecap="round" />
          </g>
        </g>

        {/* ------------------------------------------------------------- */}
        {/* PERSON B (RIGHT) — Professional offering physical business card */}
        {/* ------------------------------------------------------------- */}
        <g id="person-right" opacity="0.95">
          {/* Head & Hair */}
          <circle cx="305" cy="85" r="22" fill="#F8FAFC" />
          <path
            d="M285 75 C285 62, 298 56, 318 56 C332 56, 336 68, 334 82 C330 75, 318 72, 308 72 C295 72, 288 74, 285 75 Z"
            fill="#0F172A"
          />
          {/* Neck */}
          <path d="M301 106 H309 V118 H301 Z" fill="#E2E8F0" />

          {/* Shoulders & Business Tailored Suit */}
          <path
            d="M350 250 L338 142 C336 126, 322 116, 306 116 C295 116, 282 123, 278 135 L265 180 L280 250 Z"
            fill="url(#personRightGrad)"
          />
          {/* Lapels */}
          <path d="M306 116 L312 160 L298 145 Z" fill="#475569" opacity="0.7" />
          <path d="M304 116 L294 160 L302 145 Z" fill="#475569" opacity="0.9" />

          {/* Arm holding physical business card forward */}
          <path
            d="M278 145 L244 168 C240 171, 234 168, 232 163 L228 155"
            stroke="#E2E8F0"
            strokeWidth="10"
            strokeLinecap="round"
          />

          {/* Physical Business Card held in fingers */}
          <g transform="translate(216, 142) rotate(-10)">
            <rect
              x="0"
              y="0"
              width="34"
              height="20"
              rx="2.5"
              fill="#F8FAFC"
              stroke="#CBD5E1"
              strokeWidth="0.8"
              filter="drop-shadow(0 3px 6px rgba(0,0,0,0.5))"
            />
            {/* Card Content Mock */}
            <rect x="4" y="4" width="14" height="2" rx="0.5" fill="#0F172A" />
            <rect x="4" y="8" width="10" height="1.5" rx="0.5" fill="#64748B" />
            <line x1="4" y1="13" x2="22" y2="13" stroke="#CBD5E1" strokeWidth="0.8" />
            <circle cx="28" cy="7" r="2.5" fill="#E5A93C" />
          </g>
        </g>

        {/* ------------------------------------------------------------- */}
        {/* CENTER DIGITAL CONNECTION: The "Meeting → Digital Network" concept */}
        {/* ------------------------------------------------------------- */}

        {/* Glowing Golden Connection Arc */}
        <path
          d="M174 150 C188 120, 212 120, 226 150"
          stroke="url(#goldConnectionGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="4 3"
        />

        {/* Dynamic Connection Pulse Dot */}
        <circle cx="200" cy="132" r="4.5" fill="#E5A93C">
          <animate attributeName="r" values="3.5;5.5;3.5" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="132" r="8" fill="#E5A93C" opacity="0.25">
          <animate attributeName="r" values="6;11;6" dur="2.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur="2.4s" repeatCount="indefinite" />
        </circle>

        {/* FLOATING MICRO BUSINESS IDENTITY CARD 1 (from Person A) */}
        <g transform="translate(142, 68)" filter="url(#softCardShadow)">
          <rect
            x="0"
            y="0"
            width="56"
            height="36"
            rx="6"
            fill="url(#cardGradLeft)"
            stroke="#E5A93C"
            strokeWidth="1.2"
            strokeOpacity="0.7"
          />
          {/* Identity details */}
          <circle cx="10" cy="12" r="4" fill="#3B82F6" />
          <rect x="18" y="9" width="28" height="3" rx="1" fill="#F8FAFC" />
          <rect x="18" y="14" width="20" height="2" rx="0.8" fill="#94A3B8" />
          {/* Tag & QR indicator */}
          <rect x="7" y="22" width="22" height="8" rx="2" fill="#E5A93C" fillOpacity="0.15" />
          <text x="10" y="28" fill="#E5A93C" fontSize="5" fontWeight="600" fontFamily="sans-serif">
            Owner
          </text>
          {/* Mini QR Icon symbol */}
          <rect x="39" y="21" width="10" height="10" rx="1.5" fill="#1E293B" stroke="#94A3B8" strokeWidth="0.5" />
          <rect x="41" y="23" width="2.5" height="2.5" fill="#E5A93C" />
          <rect x="45" y="23" width="2.5" height="2.5" fill="#E5A93C" />
          <rect x="41" y="27" width="2.5" height="2.5" fill="#E5A93C" />
        </g>

        {/* FLOATING MICRO BUSINESS IDENTITY CARD 2 (from Person B) */}
        <g transform="translate(204, 76)" filter="url(#softCardShadow)">
          <rect
            x="0"
            y="0"
            width="56"
            height="36"
            rx="6"
            fill="url(#cardGradRight)"
            stroke="rgba(255,255,255,0.18)"
            strokeWidth="1"
          />
          {/* Identity details */}
          <circle cx="10" cy="12" r="4" fill="#10B981" />
          <rect x="18" y="9" width="28" height="3" rx="1" fill="#F8FAFC" />
          <rect x="18" y="14" width="24" height="2" rx="0.8" fill="#94A3B8" />
          {/* Tag */}
          <rect x="7" y="22" width="26" height="8" rx="2" fill="#38BDF8" fillOpacity="0.15" />
          <text x="10" y="28" fill="#38BDF8" fontSize="5" fontWeight="600" fontFamily="sans-serif">
            Founder
          </text>
          {/* Sync check */}
          <circle cx="45" cy="26" r="4" fill="#10B981" fillOpacity="0.2" />
          <path d="M43 26 L44.5 27.5 L47 25" stroke="#10B981" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </g>

        {/* Subtle Network Sync Line between cards */}
        <path
          d="M170 104 C185 112, 195 112, 210 104"
          stroke="#E5A93C"
          strokeWidth="1.2"
          strokeDasharray="2 2"
          opacity="0.8"
        />

        {/* Minimal Base Ground Line */}
        <line x1="30" y1="250" x2="370" y2="250" stroke="#1E273A" strokeWidth="1" opacity="0.5" />
      </svg>
    </div>
  );
};
