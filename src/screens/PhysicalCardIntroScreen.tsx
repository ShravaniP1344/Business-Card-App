import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Camera, 
  Image as ImageIcon, 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  AlertCircle, 
  Users, 
  Scan, 
  Check, 
  ArrowDown, 
  ExternalLink,
  Layers,
  HelpCircle
} from 'lucide-react';
import { DESIGN_TOKENS } from '../design-system/tokens';

export type CardOrientation = 'landscape' | 'portrait';
export type CardLanguage = 'english' | 'bilingual';

interface PhysicalCardIntroScreenProps {
  onBackToScreen6: () => void;
  onScanCard: () => void;
  onChooseFromGallery: () => void;
  isLargeTextMode?: boolean;
}

export const PhysicalCardIntroScreen: React.FC<PhysicalCardIntroScreenProps> = ({
  onBackToScreen6,
  onScanCard,
  onChooseFromGallery,
  isLargeTextMode = false,
}) => {
  // Test controls for reviewer
  const [orientation, setOrientation] = useState<CardOrientation>('landscape');
  const [language, setLanguage] = useState<CardLanguage>('english');
  const [highlightStep, setHighlightStep] = useState<number>(0); // 0: All, 1: Card, 2: Scanner, 3: Digital Fields

  return (
    <div
      id="screen-7-physical-card-intro"
      className="h-full w-full flex flex-col justify-between select-none relative overflow-y-auto px-4 sm:px-5 py-3 text-[#F8FAFC]"
      style={{
        backgroundColor: DESIGN_TOKENS.colors.background,
        fontFamily: DESIGN_TOKENS.typography.fontFamily,
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP BAR: Back Navigation + Demo Progress Indicator         */}
      {/* ------------------------------------------------------------- */}
      <div className="pt-1 pb-2 shrink-0 flex items-center justify-between border-b border-white/[0.06]">
        {/* Back returns to Screen 6 in its completed state */}
        <button
          id="btn-screen7-back-to-screen6"
          type="button"
          onClick={onBackToScreen6}
          className="h-9 px-2.5 -ml-1 rounded-xl flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white hover:bg-white/[0.04] transition-colors"
          aria-label="Back to Mutual Choice Demo"
        >
          <ArrowLeft className="w-4 h-4 text-[#E5A93C]" />
          <span className="font-medium">Screen 6</span>
        </button>

        {/* Demo Progress Indicator (Consistent style across demo screens) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#141A27] px-2.5 py-1 rounded-full border border-white/[0.08]">
            <span className="w-2 h-2 rounded-full bg-[#E5A93C] animate-pulse" />
            <span className="text-[11px] font-semibold text-white">Demo</span>
            <span className="text-[11px] text-[#64748B]">•</span>
            <span className="text-[11px] text-[#E5A93C] font-semibold">Card Scan Intro</span>
          </div>
          <span className="text-[10px] text-[#64748B] font-medium hidden sm:inline">Quick demo</span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. HEADINGS: Story Transition & Clear Value Proposition       */}
      {/* ------------------------------------------------------------- */}
      <div className="pt-2 pb-1 space-y-1 shrink-0 text-center sm:text-left">
        {/* Contextual eyebrow transition line */}
        <p className="text-[11px] font-medium text-[#E5A93C] tracking-wide">
          But not everyone you meet will be here.
        </p>

        {/* Main Heading */}
        <h1 
          id="screen7-main-heading"
          className={`font-bold tracking-tight text-white leading-tight ${
            isLargeTextMode ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
          }`}
        >
          Sometimes, they just hand you a card.
        </h1>

        {/* Supporting Copy */}
        <p className="text-xs text-[#94A3B8] leading-relaxed max-w-[360px]">
          Scan it and keep the details in your network.
        </p>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. HERO VISUAL: PHYSICAL CARD → PHONE SCAN → DIGITAL CONTACT   */}
      {/* ------------------------------------------------------------- */}
      <div className="my-auto py-2 space-y-3 shrink-1">

        {/* =========================================================== */}
        {/* STEP A: THE REAL-WORLD PHYSICAL BUSINESS CARD               */}
        {/* =========================================================== */}
        <div 
          id="hero-physical-business-card"
          className={`relative transition-all duration-300 ${
            highlightStep === 1 ? 'ring-2 ring-[#E5A93C]' : ''
          }`}
        >
          {/* Subtle real-world tag */}
          <div className="flex items-center justify-between text-[10px] text-[#94A3B8] pb-1.5">
            <span className="font-semibold uppercase tracking-wider text-[#CBD5E1] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#CBD5E1]" />
              Physical Paper Card
            </span>
            <span className="text-[#64748B] italic">Handed to you in person</span>
          </div>

          {/* Physical Business Card Surface (High-contrast light card against dark background) */}
          <div 
            className={`rounded-xl shadow-lg border border-white/20 p-3.5 text-[#0F172A] relative overflow-hidden transition-all duration-300 ${
              orientation === 'portrait' ? 'max-w-[280px] mx-auto min-h-[170px]' : 'w-full min-h-[135px]'
            }`}
            style={{
              background: 'linear-gradient(135deg, #F8FAFC 0%, #EDEFEA 100%)',
              boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.4), 0 2px 6px -1px rgba(0, 0, 0, 0.2)',
            }}
          >
            {/* Realistic paper card texture overlay & foil edge line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B]" />
            <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-black/[0.03] pointer-events-none" />

            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-extrabold text-sm sm:text-base tracking-tight text-[#0F172A] uppercase">
                  Arjun Deshmukh
                </h3>
                <p className="text-[11px] font-semibold text-[#B45309]">
                  Sales Manager
                </p>
              </div>

              {/* Company Logo Mark on physical card */}
              <div className="w-8 h-8 rounded-lg bg-[#0F172A] text-amber-400 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                V
              </div>
            </div>

            {/* Company Name & Details */}
            <div className="mt-2 pt-2 border-t border-black/[0.08]">
              <div className="flex items-center gap-1 font-bold text-xs text-[#1E293B]">
                <span>Vertex Industrial Solutions</span>
              </div>
              {language === 'bilingual' && (
                <p className="text-[10px] text-[#475569] font-medium">
                  व्हर्टेक्स इंडस्ट्रियल सोल्युशन्स • पुणे
                </p>
              )}

              <div className="mt-1.5 grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] text-[#475569] font-medium">
                <span className="truncate">+91 98220 45871</span>
                <span className="truncate">arjun@vertexindustrial.in</span>
                <span className="truncate">vertexindustrial.in</span>
                <span className="truncate">Pune, Maharashtra</span>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================== */}
        {/* STEP B: PHONE / CAMERA SCAN INTERACTION                     */}
        {/* =========================================================== */}
        <div 
          id="hero-scanner-interaction"
          className="relative flex flex-col items-center justify-center py-1"
        >
          {/* Subtle Directional Arrow */}
          <div className="w-[1.5px] h-3 bg-gradient-to-b from-white/30 to-[#E5A93C]/60" />

          {/* Scanner Device Framing Pill */}
          <div className="my-1 flex items-center gap-2 bg-[#141B29] px-3.5 py-1.5 rounded-full border border-[#E5A93C]/40 shadow-md">
            <Scan className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span className="text-[11px] font-semibold text-white">
              Instant Card Scanning
            </span>
            <span className="text-[10px] text-[#94A3B8]">
              (No manual typing)
            </span>
          </div>

          {/* Directional Downward Transition */}
          <div className="w-[1.5px] h-3 bg-gradient-to-b from-[#E5A93C]/60 to-[#10B981]/50" />
        </div>

        {/* =========================================================== */}
        {/* STEP C: DIGITAL TRANSFORMATION (CLEAN STRUCTURED FIELDS)    */}
        {/* =========================================================== */}
        <div 
          id="hero-digital-contact-card"
          className={`rounded-xl bg-[#121722] border-2 border-white/[0.12] p-3 shadow-xl relative overflow-hidden transition-all duration-300 ${
            highlightStep === 3 ? 'ring-2 ring-[#E5A93C]' : ''
          }`}
        >
          {/* Digital Card Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-[10px]">
            <span className="font-semibold uppercase tracking-wider text-[#10B981] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
              Organized Digital Contact
            </span>
            <span className="text-[10px] text-[#94A3B8] bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
              Structured Fields
            </span>
          </div>

          {/* Extracted Contact Header */}
          <div className="flex items-start gap-2.5 pt-2.5">
            {/* Digital Monogram Avatar */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1F293D] to-[#121722] border border-[#E5A93C]/60 flex items-center justify-center text-[#E5A93C] font-bold text-xs shrink-0">
              AD
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-xs sm:text-sm text-white truncate">
                  Arjun Deshmukh
                </h3>
                <span className="text-[11px] font-medium text-[#E5A93C]">
                  • Sales Manager
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-[#CBD5E1] mt-0.5">
                <Building2 className="w-3 h-3 text-[#E5A93C] shrink-0" />
                <span className="truncate">Vertex Industrial Solutions</span>
              </div>
            </div>
          </div>

          {/* Structured Key Fields */}
          <div className="mt-2.5 pt-2 border-t border-white/[0.06] space-y-1.5 text-[11px]">
            <div className="flex items-center justify-between text-[#CBD5E1]">
              <span className="flex items-center gap-1 text-[#94A3B8] text-[10px]">
                <Phone className="w-3 h-3 text-[#E5A93C]" /> Phone
              </span>
              <span className="font-mono text-xs text-white">+91 98220 45871</span>
            </div>

            <div className="flex items-center justify-between text-[#CBD5E1]">
              <span className="flex items-center gap-1 text-[#94A3B8] text-[10px]">
                <Mail className="w-3 h-3 text-[#E5A93C]" /> Email
              </span>
              <span className="font-mono text-[11px] text-white truncate max-w-[190px]">
                arjun@vertexindustrial.in
              </span>
            </div>

            {/* Category Field with SUBTLE AMBER REVIEW INDICATOR (No fake AI percentage!) */}
            <div className="flex items-center justify-between pt-1 border-t border-white/[0.04]">
              <span className="text-[#94A3B8] text-[10px]">Category</span>
              <div className="flex items-center gap-1.5">
                <span className="text-white text-xs font-medium">
                  Industrial Solutions
                </span>
                <span 
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/15 border border-amber-500/40 text-amber-300 text-[9px] font-semibold"
                  title="Category suggested from business card — you can confirm or edit on review"
                >
                  <AlertCircle className="w-2.5 h-2.5 text-amber-400" />
                  <span>Check this</span>
                </span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* STEP D: DESTINATION IN MY NETWORK                         */}
          {/* ========================================================= */}
          <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between bg-[#0B0E14] -mx-3 -mb-3 p-2.5 rounded-b-xl">
            <div className="flex items-center gap-1.5 text-[11px] text-[#94A3B8]">
              <Users className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>Destination:</span>
              <strong className="text-white font-semibold">My Network</strong>
            </div>
            <span className="text-[10px] text-[#10B981] font-medium flex items-center gap-1">
              <Check className="w-3 h-3" /> Ready on review
            </span>
          </div>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. PRIMARY & SECONDARY ACTIONS                                */}
      {/* ------------------------------------------------------------- */}
      <div className="pt-2 pb-1 space-y-2 shrink-0 border-t border-white/[0.06]">
        
        {/* Explanatory Context Note */}
        <p className="text-center text-[11px] text-[#94A3B8]">
          Capture card live with camera, or import an existing card image.
        </p>

        {/* PRIMARY CTA: Scan a Card (Navigates to Screen 8 Camera) */}
        <button
          id="btn-scan-a-card"
          type="button"
          onClick={onScanCard}
          className="w-full h-[52px] rounded-xl font-bold flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.98] shadow-lg hover:brightness-105 cursor-pointer"
          style={{
            backgroundColor: DESIGN_TOKENS.colors.accent,
            color: DESIGN_TOKENS.colors.accentForeground,
            minHeight: DESIGN_TOKENS.touchTarget.minHeight,
            fontSize: '15px',
          }}
          aria-label="Scan a physical business card with camera"
        >
          <Camera className="w-5 h-5 stroke-[2.2]" />
          <span>Scan a Card</span>
        </button>

        {/* SECONDARY ACTION: Choose from Gallery */}
        <button
          id="btn-choose-from-gallery"
          type="button"
          onClick={onChooseFromGallery}
          className="w-full h-11 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 bg-[#141B29] text-[#CBD5E1] border border-white/[0.1] hover:text-white hover:border-white/[0.2] transition-all active:scale-[0.99] cursor-pointer"
          aria-label="Choose an existing business card photo from your gallery"
        >
          <ImageIcon className="w-4 h-4 text-[#94A3B8]" />
          <span>Choose from Gallery</span>
        </button>

        {/* ----------------------------------------------------------- */}
        {/* PROTOTYPE REVIEWER CONTROLS                                */}
        {/* ----------------------------------------------------------- */}
        <div className="pt-1.5 border-t border-white/[0.05] flex flex-wrap items-center justify-between gap-1.5 text-[10px] text-[#64748B]">
          <span>Screen 7 Spec Controls:</span>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setOrientation(orientation === 'landscape' ? 'portrait' : 'landscape')}
              className={`px-1.5 py-0.5 rounded border transition-all ${
                orientation === 'portrait'
                  ? 'border-[#E5A93C]/40 text-[#E5A93C] bg-[#E5A93C]/10 font-semibold'
                  : 'border-white/[0.06] text-[#64748B] hover:text-white'
              }`}
            >
              {orientation === 'landscape' ? 'Card: Landscape' : 'Card: Portrait'}
            </button>
            <button
              onClick={() => setLanguage(language === 'english' ? 'bilingual' : 'english')}
              className={`px-1.5 py-0.5 rounded border transition-all ${
                language === 'bilingual'
                  ? 'border-[#E5A93C]/40 text-[#E5A93C] bg-[#E5A93C]/10 font-semibold'
                  : 'border-white/[0.06] text-[#64748B] hover:text-white'
              }`}
            >
              {language === 'bilingual' ? 'Language: Bilingual' : 'Language: English'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
