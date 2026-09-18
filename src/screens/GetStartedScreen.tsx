import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  ArrowRight, 
  Search, 
  QrCode, 
  CreditCard, 
  Network,
  Users,
  Building2,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { DESIGN_TOKENS } from '../design-system/tokens';

interface GetStartedScreenProps {
  userName?: string;
  userEmail?: string;
  onGetStarted: () => void;
  onSkip: () => void;
  isLargeTextMode?: boolean;
}

export const GetStartedScreen: React.FC<GetStartedScreenProps> = ({
  userName = 'Shravani',
  userEmail = 'shravani@example.com',
  onGetStarted,
  onSkip,
  isLargeTextMode = false,
}) => {
  const [isNavigating, setIsNavigating] = useState(false);
  const [simulatedUserName, setSimulatedUserName] = useState<string>(userName);

  // Extract first name for personalized greeting, handling long names gracefully
  const getFirstName = (nameStr: string) => {
    const trimmed = nameStr.trim();
    if (!trimmed) return 'Shravani';
    const firstPart = trimmed.split(' ')[0];
    return firstPart.length > 20 ? firstPart.slice(0, 18) + '…' : firstPart;
  };

  const displayName = getFirstName(simulatedUserName);

  const handleStartDemo = () => {
    if (isNavigating) return; // Prevent double taps
    setIsNavigating(true);
    onGetStarted();
  };

  const handleSkipDemo = () => {
    if (isNavigating) return;
    setIsNavigating(true);
    onSkip();
  };

  return (
    <div
      id="screen-get-started"
      className="h-full w-full flex flex-col justify-between select-none relative overflow-y-auto px-5 py-3 text-[#F8FAFC]"
      style={{
        backgroundColor: DESIGN_TOKENS.colors.background,
        fontFamily: DESIGN_TOKENS.typography.fontFamily,
      }}
    >
      {/* ========================================================= */}
      {/* 1. TOP AREA: Safe Area & Subtle Personal Acknowledgement  */}
      {/* ========================================================= */}
      <div className="pt-2 pb-1 flex items-center justify-between shrink-0">
        {/* Subtle Welcome greeting */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#CBD5E1] tracking-wide">
              Welcome, <span className="text-white font-bold">{displayName}</span>
            </span>
          </div>
          <span className="text-[11px] text-[#64748B]">Your personal account is active</span>
        </div>

        {/* Subtle Success Badge (Not an intrusive banner) */}
        <div 
          className="flex items-center gap-1 px-2.5 py-1 rounded-full border text-[11px] font-medium"
          style={{
            backgroundColor: 'rgba(229, 169, 60, 0.08)',
            borderColor: 'rgba(229, 169, 60, 0.25)',
            color: DESIGN_TOKENS.colors.accent,
          }}
        >
          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Account ready</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. MAIN HERO ILLUSTRATION: Professional Network Genesis   */}
      {/* ========================================================= */}
      <div className="my-auto py-2 flex items-center justify-center w-full min-h-[180px] max-h-[42vh] shrink-1">
        <div className="w-full max-w-[360px] relative flex items-center justify-center">
          {/* Editorial Vector Illustration */}
          <svg
            viewBox="0 0 360 250"
            className="w-full h-auto drop-shadow-md select-none"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Subtle radial ambient glows */}
              <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#E5A93C" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#E5A93C" stopOpacity="0" />
              </radialGradient>

              <linearGradient id="goldPathGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#64748B" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#E5A93C" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#E5A93C" stopOpacity="0.3" />
              </linearGradient>

              <linearGradient id="cardGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#182030" />
                <stop offset="100%" stopColor="#111622" />
              </linearGradient>

              <linearGradient id="cardGradCenter" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#221C14" />
                <stop offset="100%" stopColor="#14110C" />
              </linearGradient>
            </defs>

            {/* Faint concentric network orbits */}
            <circle cx="180" cy="125" r="105" stroke="#FFFFFF" strokeOpacity="0.04" strokeDasharray="3 3" />
            <circle cx="180" cy="125" r="70" stroke="#FFFFFF" strokeOpacity="0.06" strokeDasharray="4 4" />
            
            {/* Center ambient glow */}
            <circle cx="180" cy="125" r="60" fill="url(#centerGlow)" />

            {/* -------------------------------------------------- */}
            {/* Connection Paths into Central User Network Hub     */}
            {/* -------------------------------------------------- */}
            {/* Path 1: From Rahul Patil (Search) -> Center */}
            <path
              d="M 100 68 C 125 75, 145 95, 160 115"
              stroke="url(#goldPathGrad)"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <circle cx="160" cy="115" r="2.5" fill="#E5A93C" />

            {/* Path 2: From Neha Shah (QR Exchange) -> Center */}
            <path
              d="M 265 65 C 240 75, 215 95, 200 115"
              stroke="url(#goldPathGrad)"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <circle cx="200" cy="115" r="2.5" fill="#E5A93C" />

            {/* Path 3: From Amit Kulkarni (Card Scan) -> Center */}
            <path
              d="M 180 190 L 180 155"
              stroke="url(#goldPathGrad)"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />
            <circle cx="180" cy="155" r="2.5" fill="#E5A93C" />

            {/* -------------------------------------------------- */}
            {/* IDENTITY CARD 1: Rahul Patil (Discovered via Search)*/}
            {/* -------------------------------------------------- */}
            <g transform="translate(15, 24)">
              {/* Card Container */}
              <rect
                x="0"
                y="0"
                width="145"
                height="56"
                rx="10"
                fill="url(#cardGrad1)"
                stroke="#FFFFFF"
                strokeOpacity="0.1"
                strokeWidth="1"
              />
              {/* Subtle Search Source Pill */}
              <rect x="8" y="7" width="16" height="16" rx="4" fill="#1F293D" />
              <circle cx="15" cy="14" r="3" stroke="#60A5FA" strokeWidth="1.2" fill="none" />
              <line x1="17.2" y1="16.2" x2="19.5" y2="18.5" stroke="#60A5FA" strokeWidth="1.2" strokeLinecap="round" />

              {/* Identity Details */}
              <text x="30" y="19" fill="#F8FAFC" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
                Rahul Patil
              </text>
              <text x="8" y="36" fill="#E5A93C" fontSize="9.5" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif">
                Owner
              </text>
              <text x="40" y="36" fill="#94A3B8" fontSize="9" fontWeight="500" fontFamily="Plus Jakarta Sans, sans-serif">
                • ABC Manufacturing
              </text>
              <text x="8" y="48" fill="#64748B" fontSize="8" fontFamily="Plus Jakarta Sans, sans-serif">
                Industrial Supplies • Solapur
              </text>
            </g>

            {/* -------------------------------------------------- */}
            {/* IDENTITY CARD 2: Neha Shah (Met via Digital QR)   */}
            {/* -------------------------------------------------- */}
            <g transform="translate(200, 20)">
              {/* Card Container */}
              <rect
                x="0"
                y="0"
                width="145"
                height="56"
                rx="10"
                fill="url(#cardGrad1)"
                stroke="#FFFFFF"
                strokeOpacity="0.1"
                strokeWidth="1"
              />
              {/* Subtle QR Source Pill */}
              <rect x="8" y="7" width="16" height="16" rx="4" fill="#1F293D" />
              <rect x="10.5" y="9.5" width="4.5" height="4.5" stroke="#34D399" strokeWidth="1" fill="none" />
              <rect x="17" y="9.5" width="4.5" height="4.5" stroke="#34D399" strokeWidth="1" fill="none" />
              <rect x="10.5" y="16" width="4.5" height="4.5" stroke="#34D399" strokeWidth="1" fill="none" />
              <circle cx="19" cy="18" r="1" fill="#34D399" />

              {/* Identity Details */}
              <text x="30" y="19" fill="#F8FAFC" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
                Neha Shah
              </text>
              <text x="8" y="36" fill="#E5A93C" fontSize="9.5" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif">
                Founder
              </text>
              <text x="50" y="36" fill="#94A3B8" fontSize="9" fontWeight="500" fontFamily="Plus Jakarta Sans, sans-serif">
                • Studio Arc
              </text>
              <text x="8" y="48" fill="#64748B" fontSize="8" fontFamily="Plus Jakarta Sans, sans-serif">
                Architecture & Interior Design
              </text>
            </g>

            {/* -------------------------------------------------- */}
            {/* IDENTITY CARD 3: Amit Kulkarni (Physical Card Scan)*/}
            {/* -------------------------------------------------- */}
            <g transform="translate(108, 184)">
              {/* Card Container */}
              <rect
                x="0"
                y="0"
                width="144"
                height="54"
                rx="10"
                fill="url(#cardGrad1)"
                stroke="#FFFFFF"
                strokeOpacity="0.1"
                strokeWidth="1"
              />
              {/* Subtle Card Scan Source Pill */}
              <rect x="8" y="7" width="16" height="16" rx="4" fill="#1F293D" />
              <rect x="10" y="10" width="12" height="9" rx="1.5" stroke="#F472B6" strokeWidth="1" fill="none" />
              <line x1="10" y1="13" x2="22" y2="13" stroke="#F472B6" strokeWidth="0.8" />

              {/* Identity Details */}
              <text x="30" y="19" fill="#F8FAFC" fontSize="11" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
                Amit Kulkarni
              </text>
              <text x="8" y="35" fill="#E5A93C" fontSize="9.5" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif">
                Director
              </text>
              <text x="49" y="35" fill="#94A3B8" fontSize="9" fontWeight="500" fontFamily="Plus Jakarta Sans, sans-serif">
                • KTech Solutions
              </text>
              <text x="8" y="46" fill="#64748B" fontSize="8" fontFamily="Plus Jakarta Sans, sans-serif">
                Enterprise Cloud Infrastructure
              </text>
            </g>

            {/* -------------------------------------------------- */}
            {/* CENTRAL USER IDENTITY: YOUR BUSINESS NETWORK HUB   */}
            {/* -------------------------------------------------- */}
            <g transform="translate(130, 96)">
              {/* Glowing Outer Card */}
              <rect
                x="0"
                y="0"
                width="100"
                height="56"
                rx="12"
                fill="url(#cardGradCenter)"
                stroke="#E5A93C"
                strokeWidth="1.5"
              />
              {/* Inner Accent Ring & Avatar Symbol */}
              <circle cx="24" cy="28" r="14" fill="#E5A93C" fillOpacity="0.15" stroke="#E5A93C" strokeWidth="1" />
              {/* Minimal Person Silhouette */}
              <circle cx="24" cy="23" r="4.5" fill="#E5A93C" />
              <path d="M 17 35 C 17 30, 31 30, 31 35" stroke="#E5A93C" strokeWidth="1.5" fill="none" strokeLinecap="round" />

              {/* Hub Labels */}
              <text x="44" y="24" fill="#FFFFFF" fontSize="10" fontWeight="700" fontFamily="Plus Jakarta Sans, sans-serif">
                My Network
              </text>
              <text x="44" y="37" fill="#E5A93C" fontSize="8.5" fontWeight="600" fontFamily="Plus Jakarta Sans, sans-serif">
                Digital Hub
              </text>
              <text x="44" y="47" fill="#94A3B8" fontSize="7.5" fontFamily="Plus Jakarta Sans, sans-serif">
                1 Account • All Contacts
              </text>
            </g>
          </svg>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. LOWER CONTENT: Main Copy & Value Proposition           */}
      {/* ========================================================= */}
      <div className="space-y-2 pt-1 text-center shrink-0">
        {/* Main Heading (Allows natural 2-line break) */}
        <h1
          id="get-started-heading"
          className={`font-bold tracking-tight text-[#F8FAFC] leading-[1.2] mx-auto max-w-[320px] ${
            isLargeTextMode ? 'text-2xl' : 'text-[23px] sm:text-[25px]'
          }`}
        >
          Build your network,
          <span className="block text-white">one connection at a time.</span>
        </h1>

        {/* Concise Supporting Text (Visually secondary, max 2 lines) */}
        <p
          id="get-started-subtext"
          className={`text-[#94A3B8] leading-relaxed mx-auto max-w-[300px] ${
            isLargeTextMode ? 'text-sm' : 'text-xs sm:text-[13px]'
          }`}
        >
          See how easy it is to find, exchange and keep the business connections that matter.
        </p>

        {/* Demo Expectation Indicator (Reassuring short onboarding) */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-medium text-[#CBD5E1]">
          <Clock className="w-3 h-3 text-[#E5A93C]" />
          <span>Quick demo • Less than a minute</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. BOTTOM ACTION ZONE: Get Started CTA + Skip Option      */}
      {/* ========================================================= */}
      <div className="pt-3 pb-1 space-y-2 shrink-0">
        {/* Primary CTA: Launches Product Demo */}
        <button
          id="btn-get-started-launch-demo"
          type="button"
          onClick={handleStartDemo}
          disabled={isNavigating}
          className="w-full h-[52px] rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] shadow-lg focus:outline-hidden focus:ring-2 focus:ring-[#E5A93C] focus:ring-offset-2 focus:ring-offset-[#0A0D14] hover:brightness-105"
          style={{
            backgroundColor: DESIGN_TOKENS.colors.accent,
            color: DESIGN_TOKENS.colors.accentForeground,
            minHeight: DESIGN_TOKENS.touchTarget.minHeight,
            fontSize: '15px',
          }}
          aria-label="Get Started with the quick interactive demonstration"
        >
          <span>Get Started</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* Secondary Action: Skip for now (Navigates to Business Setup) */}
        <div className="text-center pt-0.5">
          <button
            id="btn-skip-demo"
            type="button"
            onClick={handleSkipDemo}
            disabled={isNavigating}
            className="text-xs text-[#94A3B8] hover:text-white transition-colors py-1.5 px-3 font-medium rounded-lg hover:bg-white/[0.04] active:scale-[0.98]"
            style={{ minHeight: '36px' }}
          >
            Skip for now
          </button>
        </div>

        {/* Discreet Prototype Inspection Bar */}
        <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[10px] text-[#64748B]">
          <span>Name Preview Test:</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => setSimulatedUserName('Shravani')}
              className={`px-1.5 py-0.5 rounded border ${
                displayName === 'Shravani'
                  ? 'border-[#E5A93C]/40 text-[#E5A93C] bg-[#E5A93C]/10'
                  : 'border-white/[0.06] text-[#64748B] hover:text-white'
              }`}
            >
              Default (Shravani)
            </button>
            <button
              onClick={() => setSimulatedUserName('Shrinivas Venkateshwara Rao Kulkarni')}
              className={`px-1.5 py-0.5 rounded border ${
                displayName.startsWith('Shrinivas')
                  ? 'border-[#E5A93C]/40 text-[#E5A93C] bg-[#E5A93C]/10'
                  : 'border-white/[0.06] text-[#64748B] hover:text-white'
              }`}
            >
              Long Name
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
