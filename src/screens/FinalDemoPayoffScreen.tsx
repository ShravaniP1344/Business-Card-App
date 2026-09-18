import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  CreditCard, 
  QrCode, 
  Check, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  User, 
  Briefcase, 
  MapPin, 
  Tag, 
  FileText, 
  Clock, 
  RotateCcw, 
  ShieldCheck, 
  Layers,
  Sliders
} from 'lucide-react';
import { DESIGN_TOKENS } from '../design-system/tokens';

interface FinalDemoPayoffScreenProps {
  onBackToScreen9: () => void;
  onSetUpBusinessIdentity: () => void;
  isLargeTextMode?: boolean;
}

export const FinalDemoPayoffScreen: React.FC<FinalDemoPayoffScreenProps> = ({
  onBackToScreen9,
  onSetUpBusinessIdentity,
  isLargeTextMode = false,
}) => {
  // Animation stage for visual convergence: 0 = initial, 1 = search enters, 2 = scan enters, 3 = qr pulses, 4 = complete settled
  const [animStage, setAnimStage] = useState<number>(4); // default to settled for instant readability
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  // Reviewer test states
  const [testLongNames, setTestLongNames] = useState<boolean>(false);
  const [testDevanagari, setTestDevanagari] = useState<boolean>(false);

  // Trigger animation sequence on demand
  const handleReplayAnimation = () => {
    setIsAnimating(true);
    setAnimStage(0);
    setTimeout(() => setAnimStage(1), 350);
    setTimeout(() => setAnimStage(2), 750);
    setTimeout(() => setAnimStage(3), 1150);
    setTimeout(() => {
      setAnimStage(4);
      setIsAnimating(false);
    }, 1500);
  };

  // Contacts data with optional stress-test states
  const rahulName = testDevanagari 
    ? 'राहुल पाटील' 
    : testLongNames 
    ? 'Shrinivas Venkateshwara Rao Kulkarni' 
    : 'Rahul Patil';

  const rahulRole = testDevanagari ? 'मालक' : 'Owner';
  const rahulCompany = testDevanagari 
    ? 'एबीसी मॅन्युफॅक्चरिंग' 
    : testLongNames 
    ? 'Shree Siddhivinayak Industrial Engineering Solutions Private Limited' 
    : 'ABC Manufacturing';

  const arjunName = testDevanagari ? 'अर्जुन देशमुख' : 'Arjun Deshmukh';
  const arjunRole = testDevanagari ? 'विक्री व्यवस्थापक' : 'Sales Manager';
  const arjunCompany = testDevanagari ? 'व्हर्टेक्स इंडस्ट्रियल सोल्युशन्स' : 'Vertex Industrial Solutions';

  return (
    <div
      id="screen-10-final-demo-payoff"
      className="relative h-full w-full select-none overflow-hidden flex flex-col justify-between bg-[#0A0D14] text-[#F8FAFC]"
      style={{ fontFamily: DESIGN_TOKENS.typography.fontFamily }}
    >
      {/* ============================================================= */}
      {/* 1. TOP BAR (BACK ACTION & COMPLETED DEMO INDICATOR)           */}
      {/* ============================================================= */}
      <header className="shrink-0 pt-3 pb-2.5 px-4 bg-[#0A0D14]/95 backdrop-blur-md border-b border-white/[0.06] z-20 flex items-center justify-between">
        <button
          id="btn-s10-back"
          type="button"
          onClick={onBackToScreen9}
          className="w-9 h-9 rounded-xl bg-[#141B29] border border-white/[0.08] hover:border-white/[0.2] flex items-center justify-center text-[#94A3B8] hover:text-white transition-all active:scale-95 shadow-sm"
          aria-label="Back to Screen 9 Review"
          title="Back to review screen"
        >
          <ArrowLeft className="w-4 h-4 text-[#E5A93C]" />
        </button>

        {/* Demo Completion Indicator */}
        <div className="flex items-center gap-2 bg-[#121722] border border-white/[0.08] px-2.5 py-1 rounded-full shadow-xs">
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          </div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-[#10B981]">
            <Check className="w-3 h-3 stroke-[3]" />
            <span>Demo Complete</span>
          </div>
        </div>
      </header>

      {/* ============================================================= */}
      {/* 2. SCROLLABLE MAIN CONTENT BODY                               */}
      {/* ============================================================= */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* =========================================================== */}
        {/* A. CONVERGENCE STORY: 3 ENTRY PATHS TOWARD MY NETWORK       */}
        {/* =========================================================== */}
        <div className="text-center pt-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-[#E5A93C] mb-1">
            3 Ways to Connect • 1 Place to Keep Them
          </p>
          <h1 className="text-base font-extrabold text-white tracking-tight leading-snug">
            However you meet, keep the connection.
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1 max-w-[320px] mx-auto leading-relaxed">
            Your business network, all in one place.
          </p>
        </div>

        {/* Convergence Visual Nodes (Search, Scan, QR) */}
        <div className="relative pt-2 pb-1">
          {/* Subtle connecting convergence lines */}
          <div className="grid grid-cols-3 gap-2 text-center max-w-[320px] mx-auto relative z-10">
            {/* 1. SEARCH PATH */}
            <div 
              className={`p-2 rounded-xl border transition-all duration-300 flex flex-col items-center gap-1 ${
                animStage >= 1
                  ? 'bg-[#141B29] border-[#E5A93C]/40 text-white shadow-sm'
                  : 'bg-[#10141E] border-white/[0.06] text-[#64748B]'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-[#E5A93C]/15 flex items-center justify-center text-[#E5A93C]">
                <Search className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold">Search</span>
              <span className="text-[9px] text-[#94A3B8]">App directory</span>
            </div>

            {/* 2. SCAN PATH */}
            <div 
              className={`p-2 rounded-xl border transition-all duration-300 flex flex-col items-center gap-1 ${
                animStage >= 2
                  ? 'bg-[#141B29] border-[#E5A93C]/40 text-white shadow-sm'
                  : 'bg-[#10141E] border-white/[0.06] text-[#64748B]'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400">
                <CreditCard className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold">Card Scan</span>
              <span className="text-[9px] text-[#94A3B8]">Paper cards</span>
            </div>

            {/* 3. QR PATH */}
            <div 
              className={`p-2 rounded-xl border transition-all duration-300 flex flex-col items-center gap-1 ${
                animStage >= 3
                  ? 'bg-[#141B29] border-[#E5A93C]/40 text-white shadow-sm'
                  : 'bg-[#10141E] border-white/[0.06] text-[#64748B]'
              }`}
            >
              <div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-400">
                <QrCode className="w-3.5 h-3.5" />
              </div>
              <span className="text-[11px] font-bold">QR Code</span>
              <span className="text-[9px] text-[#94A3B8]">Instant exchange</span>
            </div>
          </div>

          {/* Three subtle convergence down-arrows */}
          <div className="flex justify-around max-w-[280px] mx-auto py-1 text-[#E5A93C]/60 text-[10px]">
            <span className="animate-pulse">↓</span>
            <span className="animate-pulse">↓</span>
            <span className="animate-pulse">↓</span>
          </div>
        </div>

        {/* =========================================================== */}
        {/* B. MY NETWORK SURFACE PREVIEW                               */}
        {/* =========================================================== */}
        <div 
          className="bg-[#121722] rounded-2xl p-3.5 border border-white/[0.1] shadow-xl space-y-3 relative overflow-hidden"
          style={{
            boxShadow: '0 8px 30px -4px rgba(0, 0, 0, 0.6), 0 0 1px 1px rgba(229, 169, 60, 0.1)',
          }}
        >
          {/* Subtle top glow bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#E5A93C]/40 to-transparent" />

          {/* Surface Header */}
          <div className="flex items-center justify-between pb-1 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#10B981]" />
              <h2 className="text-xs font-extrabold uppercase tracking-wider text-white">
                My Network
              </h2>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-[#94A3B8] bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
              <ShieldCheck className="w-3 h-3 text-[#10B981]" />
              <span>Private to you</span>
            </div>
          </div>

          {/* Search Hint Input (Visual only, reinforces future lookup) */}
          <div className="h-8 px-2.5 rounded-lg bg-[#182030] border border-white/[0.08] flex items-center gap-2 text-[#64748B] text-xs">
            <Search className="w-3.5 h-3.5" />
            <span>Search your network...</span>
          </div>

          {/* EQUAL CARDS CONTAINER */}
          <div className="space-y-2.5">
            {/* 1. RAHUL PATIL (REGISTERED DIGITAL IDENTITY FROM SEARCH) */}
            <div 
              className={`bg-[#182030] rounded-xl p-3 border border-white/[0.08] transition-all duration-300 hover:border-white/[0.2] relative ${
                animStage >= 1 ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-2'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  {/* Rahul Avatar */}
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/[0.12] flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs">
                    RP
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-white truncate">
                      {rahulName}
                    </p>
                    <p className="text-[11px] text-[#E5A93C] font-semibold truncate">
                      {rahulRole} • {rahulCompany}
                    </p>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5 truncate">
                      Manufacturing • Solapur
                    </p>
                  </div>
                </div>

                {/* Source Badge: Search */}
                <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E5A93C]/10 border border-[#E5A93C]/20 text-[#E5A93C] text-[9px] font-semibold">
                  <Search className="w-2.5 h-2.5" />
                  <span>Search</span>
                </span>
              </div>
            </div>

            {/* 2. ARJUN DESHMUKH (SCANNED PHYSICAL CARD SOURCE) */}
            <div 
              className={`bg-[#182030] rounded-xl p-3 border border-white/[0.08] transition-all duration-300 hover:border-white/[0.2] relative ${
                animStage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-40 translate-y-2'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 flex-1 min-w-0">
                  {/* Arjun Avatar */}
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#B45309] to-[#78350F] border border-amber-400/30 flex items-center justify-center font-bold text-xs text-amber-200 shrink-0 shadow-xs">
                    AD
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-xs text-white truncate">
                      {arjunName}
                    </p>
                    <p className="text-[11px] text-[#E5A93C] font-semibold truncate">
                      {arjunRole} • {arjunCompany}
                    </p>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5 truncate">
                      Industrial Solutions • Pune, Maharashtra
                    </p>
                  </div>
                </div>

                {/* Source Badge: Card scan */}
                <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[9px] font-semibold">
                  <CreditCard className="w-2.5 h-2.5" />
                  <span>Card scan</span>
                </span>
              </div>
            </div>

            {/* 3. FUTURE QR SOURCE ENTRY HINT */}
            <div 
              className={`bg-[#182030]/60 rounded-xl p-2.5 border border-dashed border-white/[0.08] flex items-center justify-between transition-all duration-300 ${
                animStage >= 3 ? 'opacity-100' : 'opacity-30'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                  <QrCode className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[11px] font-medium text-[#CBD5E1]">
                    Met someone with a QR?
                  </p>
                  <p className="text-[9px] text-[#64748B]">
                    Exchanges save right here automatically
                  </p>
                </div>
              </div>
              <span className="text-[9px] text-blue-400/80 font-semibold px-1.5 py-0.5 bg-blue-500/10 rounded">
                QR Ready
              </span>
            </div>
          </div>

          {/* Subtly Hint Network Utilities: Notes • Tags • Follow-ups */}
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-[#64748B]">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <FileText className="w-3 h-3 text-[#94A3B8]" />
                <span>Notes</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Tag className="w-3 h-3 text-[#94A3B8]" />
                <span>Tags</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-[#94A3B8]" />
                <span>Follow-ups</span>
              </span>
            </div>
            <span className="text-[9px] text-[#94A3B8] italic">
              Easily accessible later
            </span>
          </div>
        </div>

        {/* Supporting takeaway line */}
        <p className="text-center text-[11px] text-[#94A3B8] leading-relaxed max-w-[300px] mx-auto pt-1">
          Search, scan or exchange a QR — they'll be easy to find whenever you need them.
        </p>

        {/* Bottom padding for sticky CTA clearance */}
        <div className="h-20" />
      </div>

      {/* ============================================================= */}
      {/* 3. STICKY BOTTOM PRIMARY CTA (SET UP MY BUSINESS IDENTITY)     */}
      {/* ============================================================= */}
      <div className="shrink-0 p-4 bg-gradient-to-t from-[#0A0D14] via-[#0A0D14]/95 to-transparent border-t border-white/[0.06] z-20 space-y-2">
        {/* Conversational Intro Copy */}
        <p className="text-center text-xs font-semibold text-[#CBD5E1]">
          Now, let's set up how people see you.
        </p>

        <button
          id="btn-set-up-business-identity"
          type="button"
          onClick={onSetUpBusinessIdentity}
          className="w-full h-[52px] rounded-xl bg-[#E5A93C] hover:bg-amber-400 text-[#0A0D14] font-bold text-sm tracking-tight transition-all active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg"
          style={{ minHeight: DESIGN_TOKENS.touchTarget.minHeight }}
        >
          <span>Set Up My Business Identity</span>
          <ArrowLeft className="w-4 h-4 rotate-180 text-[#0A0D14] stroke-[2.5]" />
        </button>
      </div>

      {/* ============================================================= */}
      {/* 4. REVIEWER INSPECTOR DRAWER                                  */}
      {/* ============================================================= */}
      <div className="absolute top-14 right-4 z-30 pointer-events-auto">
        <details className="group">
          <summary className="list-none cursor-pointer bg-[#121722]/90 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-full text-[10px] text-[#94A3B8] hover:text-white flex items-center gap-1 shadow-md">
            <span>Inspector</span>
            <span className="text-[#E5A93C]">▾</span>
          </summary>
          <div className="mt-1 bg-[#121722] border border-white/20 rounded-xl p-2.5 shadow-2xl space-y-2 text-[10px] w-56">
            <p className="text-[#94A3B8] font-semibold">Demo Controls:</p>
            <button
              onClick={handleReplayAnimation}
              disabled={isAnimating}
              className="w-full px-2 py-1 rounded text-left border border-white/10 hover:border-white/20 text-[#CBD5E1] hover:text-white flex items-center justify-between"
            >
              <span>Replay Convergence</span>
              <RotateCcw className="w-3 h-3 text-[#E5A93C]" />
            </button>
            <button
              onClick={() => setTestLongNames(!testLongNames)}
              className={`w-full px-2 py-1 rounded text-left border ${
                testLongNames ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white' : 'border-white/5 text-[#94A3B8]'
              }`}
            >
              Toggle Long Names Stress Test
            </button>
            <button
              onClick={() => setTestDevanagari(!testDevanagari)}
              className={`w-full px-2 py-1 rounded text-left border ${
                testDevanagari ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white' : 'border-white/5 text-[#94A3B8]'
              }`}
            >
              Toggle Devanagari (मराठी)
            </button>
          </div>
        </details>
      </div>

    </div>
  );
};
