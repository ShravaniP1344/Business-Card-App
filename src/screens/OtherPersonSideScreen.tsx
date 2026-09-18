import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ArrowRight, 
  Bell, 
  Check, 
  CheckCircle2, 
  UserPlus, 
  Building2, 
  Briefcase, 
  MapPin, 
  Sparkles, 
  RefreshCw, 
  Smartphone,
  ShieldCheck,
  Info,
  Layers,
  Users
} from 'lucide-react';
import { DESIGN_TOKENS } from '../design-system/tokens';

export type Screen6State = 'received-notification' | 'adding' | 'both-saved' | 'not-now';

interface OtherPersonSideScreenProps {
  onBackToScreen5: () => void;
  onContinueToNextDemo: () => void;
  isLargeTextMode?: boolean;
}

export const OtherPersonSideScreen: React.FC<OtherPersonSideScreenProps> = ({
  onBackToScreen5,
  onContinueToNextDemo,
  isLargeTextMode = false,
}) => {
  const [demoState, setDemoState] = useState<Screen6State>('received-notification');
  const [isLongNameTest, setIsLongNameTest] = useState<boolean>(false);

  // Simulated tap on Rahul's "+ Add Shravani to My Network"
  const handleRahulAddShravani = () => {
    if (demoState === 'adding' || demoState === 'both-saved') return;
    setDemoState('adding');
    setTimeout(() => {
      setDemoState('both-saved');
    }, 750);
  };

  const handleRahulNotNow = () => {
    setDemoState('not-now');
  };

  const senderName = isLongNameTest ? 'Shrinivas V. R. Kulkarni' : 'Shravani Pasnur';
  const senderRole = 'Software Engineer';
  const senderCompany = isLongNameTest 
    ? 'Aikyam AI Systems & Enterprise Robotics' 
    : 'Aikyam AI Systems';

  return (
    <div
      id="screen-6-other-person-side"
      className="h-full w-full flex flex-col justify-between select-none relative overflow-y-auto px-4 sm:px-5 py-3 text-[#F8FAFC]"
      style={{
        backgroundColor: DESIGN_TOKENS.colors.background,
        fontFamily: DESIGN_TOKENS.typography.fontFamily,
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP BAR: Back Navigation + Demo Step 3 Progress Indicator  */}
      {/* ------------------------------------------------------------- */}
      <div className="pt-1 pb-2 shrink-0 flex items-center justify-between border-b border-white/[0.06]">
        {/* Back returns to Screen 5 in its added state */}
        <button
          id="btn-screen6-back-to-screen5"
          type="button"
          onClick={onBackToScreen5}
          className="h-9 px-2.5 -ml-1 rounded-xl flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white hover:bg-white/[0.04] transition-colors"
          aria-label="Back to Rahul's Business Identity"
        >
          <ArrowLeft className="w-4 h-4 text-[#E5A93C]" />
          <span className="font-medium">Rahul's Card</span>
        </button>

        {/* Demo Progress Indicator (Consistent 3-stage flow) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#141A27] px-2.5 py-1 rounded-full border border-white/[0.08]">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="text-[11px] font-semibold text-white">Step 3 of 3</span>
            <span className="text-[11px] text-[#64748B]">•</span>
            <span className="text-[11px] text-[#E5A93C] font-semibold">Mutual Choice</span>
          </div>
          <span className="text-[10px] text-[#64748B] font-medium hidden sm:inline">Quick demo</span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. HEADER: Core Lesson Headline & Non-Technical Supporting Copy */}
      {/* ------------------------------------------------------------- */}
      <div className="pt-2 pb-1 space-y-1 shrink-0 text-center sm:text-left">
        <h1 
          id="screen6-main-heading"
          className={`font-bold tracking-tight text-white leading-tight ${
            isLargeTextMode ? 'text-lg sm:text-xl' : 'text-base sm:text-lg'
          }`}
        >
          Networking works both ways.
        </h1>
        <p className="text-xs text-[#94A3B8] leading-relaxed max-w-[360px]">
          When you add someone, they can choose to keep your business identity too.
        </p>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. VISUAL STORY: TWO PHONES / TWO PEOPLE VERTICAL STAGGER     */}
      {/* ------------------------------------------------------------- */}
      <div className="my-auto py-2 space-y-3 shrink-1">

        {/* =========================================================== */}
        {/* SIDE 1: SHRAVANI'S PHONE / NETWORK (ALREADY SAVED)           */}
        {/* =========================================================== */}
        <div 
          id="shravani-network-card"
          className="rounded-xl bg-[#121722]/90 border border-white/[0.1] p-3 shadow-md relative overflow-hidden"
        >
          {/* Subtle Persona Badge */}
          <div className="flex items-center justify-between pb-2 border-b border-white/[0.06] text-[10px]">
            <div className="flex items-center gap-1.5 font-bold text-[#E5A93C] uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E5A93C]" />
              <span>Shravani's Network</span>
            </div>
            
            {/* Confirmation: Already stored in My Network */}
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] font-semibold">
              <Check className="w-3 h-3 stroke-[2.5]" />
              <span>✓ Saved in My Network</span>
            </span>
          </div>

          {/* Rahul's Stored Business Identity Item (Continuity from Screen 5) */}
          <div className="flex items-center gap-3 pt-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#221C14] to-[#14110C] border border-[#E5A93C]/60 flex items-center justify-center text-[#E5A93C] font-bold text-xs shrink-0">
              RP
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-white truncate">Rahul Patil</span>
                <span className="text-xs font-semibold text-[#E5A93C]">• Owner</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-[#CBD5E1] truncate mt-0.5">
                <Building2 className="w-3 h-3 text-[#E5A93C] shrink-0" />
                <span className="truncate">ABC Manufacturing</span>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <span className="text-[10px] text-[#64748B] block font-mono">No approval needed</span>
              <span className="text-[10px] text-[#10B981] font-semibold">Already saved</span>
            </div>
          </div>
        </div>

        {/* =========================================================== */}
        {/* DIRECTIONAL NOTIFICATION TRANSITION INDICATOR               */}
        {/* =========================================================== */}
        <div className="flex flex-col items-center justify-center py-0.5 relative">
          <div className="flex items-center gap-2 bg-[#182030] px-3 py-1 rounded-full border border-white/[0.08] shadow-sm">
            <Bell className="w-3 h-3 text-[#E5A93C] animate-bounce" />
            <span className="text-[10px] font-medium text-[#CBD5E1]">
              Notification sent to Rahul
            </span>
            <span className="text-[10px] text-[#64748B]">↓</span>
          </div>
          {/* Directional Connector Line */}
          <div className="w-[2px] h-3 bg-gradient-to-b from-[#E5A93C]/40 to-transparent" />
        </div>

        {/* =========================================================== */}
        {/* SIDE 2: RAHUL'S PHONE / NOTIFICATION & INDEPENDENT DECISION */}
        {/* =========================================================== */}
        <div 
          id="rahul-phone-card"
          className="rounded-2xl bg-gradient-to-b from-[#141B29] to-[#0F1420] border-2 border-white/[0.12] p-3.5 shadow-xl relative overflow-hidden transition-all duration-300"
          style={{
            borderColor: demoState === 'both-saved' ? 'rgba(16, 185, 129, 0.4)' : 'rgba(229, 169, 60, 0.35)',
          }}
        >
          {/* Header on Rahul's Phone */}
          <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08] text-[11px]">
            <div className="flex items-center gap-1.5 font-bold text-white">
              <Smartphone className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span>Rahul's Phone</span>
            </div>
            <span className="text-[10px] font-medium text-[#94A3B8] bg-white/[0.04] px-2 py-0.5 rounded-full border border-white/[0.06]">
              In-App Notification
            </span>
          </div>

          {/* Elegant Notification Banner */}
          <div className="mt-2.5 bg-[#121722] border border-[#E5A93C]/30 rounded-xl p-2.5 flex items-start gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C] shrink-0 mt-0.5">
              <Bell className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white font-semibold leading-snug">
                "{senderName} added you to their network."
              </p>
              <p className="text-[10px] text-[#94A3B8] mt-0.5">
                Rahul can view your public business identity and independently decide to keep it.
              </p>
            </div>
          </div>

          {/* Shravani's Presented Business Identity Card (Follows Screen 5 DS) */}
          <div className="mt-2.5 rounded-xl bg-[#0C1018] border border-white/[0.08] p-3 space-y-2">
            <div className="flex items-start gap-2.5">
              {/* Shravani's Monogram Avatar */}
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1C2436] to-[#0E131F] border border-[#E5A93C]/40 flex items-center justify-center text-[#E5A93C] font-bold text-xs shrink-0">
                SP
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs text-white truncate">{senderName}</h3>
                  <span className="text-[11px] text-[#E5A93C] font-medium">• {senderRole}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#CBD5E1] mt-0.5">
                  <Building2 className="w-3 h-3 text-[#E5A93C] shrink-0" />
                  <span className="truncate">{senderCompany}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-[#64748B] mt-0.5">
                  <MapPin className="w-2.5 h-2.5" />
                  <span>Technology • Solapur, Maharashtra</span>
                </div>
              </div>
            </div>
          </div>

          {/* RAHUL'S INDEPENDENT ACTIONS */}
          <div className="mt-3 pt-2 border-t border-white/[0.08]">
            
            {/* CASE 1: Default / Prompting Rahul's Action */}
            {demoState === 'received-notification' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] text-[#94A3B8]">
                  <span className="font-medium text-[#CBD5E1]">Rahul's Choice:</span>
                  <span className="text-[#E5A93C] font-medium flex items-center gap-1">
                    <Sparkles className="w-2.5 h-2.5" /> Tap to simulate Rahul
                  </span>
                </div>

                {/* Primary Action on Rahul's side: + Add Shravani to My Network */}
                <button
                  id="btn-rahul-add-shravani"
                  type="button"
                  onClick={handleRahulAddShravani}
                  className="w-full h-11 rounded-xl font-bold flex items-center justify-center gap-2 bg-[#E5A93C] text-[#0A0D14] text-xs transition-all active:scale-[0.98] shadow-md hover:brightness-105"
                  aria-label={`Simulate Rahul adding ${senderName} to My Network`}
                >
                  <UserPlus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>+ Add Shravani to My Network</span>
                </button>

                {/* Subtle Secondary Option: "Not now" (NOT Reject) */}
                <button
                  id="btn-rahul-not-now"
                  type="button"
                  onClick={handleRahulNotNow}
                  className="w-full py-1.5 text-center text-[11px] text-[#94A3B8] hover:text-white transition-colors"
                >
                  Not now
                </button>
              </div>
            )}

            {/* CASE 2: Loading transition */}
            {demoState === 'adding' && (
              <div className="h-11 rounded-xl bg-[#E5A93C]/80 text-[#0A0D14] flex items-center justify-center gap-2 text-xs font-bold">
                <RefreshCw className="w-3.5 h-3.5 animate-spin stroke-[2.5]" />
                <span>Saving to Rahul's Network...</span>
              </div>
            )}

            {/* CASE 3: Rahul successfully added Shravani */}
            {demoState === 'both-saved' && (
              <div className="space-y-1.5 text-center">
                <div 
                  id="badge-shravani-added-by-rahul"
                  className="h-10 rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] flex items-center justify-center gap-1.5 text-xs font-semibold"
                >
                  <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>✓ Shravani added to Rahul's Network</span>
                </div>
                <p className="text-[10px] text-[#94A3B8]">
                  Rahul now also has your card in his personal My Network list.
                </p>
              </div>
            )}

            {/* CASE 4: Rahul chose "Not now" */}
            {demoState === 'not-now' && (
              <div className="bg-[#182030] rounded-xl p-2.5 border border-white/[0.08] space-y-1.5 text-left">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#CBD5E1]">
                  <span>Rahul chose: "Not now"</span>
                </div>
                <p className="text-[11px] text-[#94A3B8] leading-relaxed">
                  Rahul remains in <strong className="text-white">your</strong> network. Nothing was undone or deleted. He can always add you later from his notifications.
                </p>
                <button
                  onClick={() => setDemoState('received-notification')}
                  className="text-[10px] text-[#E5A93C] underline hover:text-[#F3C775]"
                >
                  Reset choice
                </button>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================== */}
        {/* VISUAL PAYOFF: MUTUAL / INDEPENDENT SAVED RELATIONSHIP      */}
        {/* =========================================================== */}
        {demoState === 'both-saved' && (
          <div 
            id="both-saved-payoff-banner"
            className="rounded-xl bg-[#10B981]/10 border border-[#10B981]/30 p-3 text-center space-y-1 animate-fade-in"
          >
            <div className="flex items-center justify-center gap-2 text-xs font-bold text-white">
              <span>Shravani's Network</span>
              <span className="text-[#10B981] font-mono">←✓→</span>
              <span>Rahul's Network</span>
            </div>
            <p className="text-xs font-semibold text-[#10B981]">
              Now you've both kept the connection.
            </p>
            <p className="text-[11px] text-[#CBD5E1]">
              No requests. Each person chooses who they keep.
            </p>
          </div>
        )}

      </div>

      {/* ------------------------------------------------------------- */}
      {/* 4. PRIMARY ACTION ZONE: Continue to Physical Card Scan Demo   */}
      {/* ------------------------------------------------------------- */}
      <div className="pt-2 pb-1 space-y-2 shrink-0 border-t border-white/[0.06]">
        
        {/* Explanatory Teaching Microcopy */}
        <p className="text-center text-[11px] text-[#94A3B8]">
          {demoState === 'both-saved'
            ? 'Both of you can now access each other’s business identities at any time.'
            : demoState === 'not-now'
            ? 'Directional networking gives every member full control over their own contacts.'
            : 'Simulate Rahul’s response above, or continue directly to explore card scanning.'}
        </p>

        {/* Continue Button (Advances to next part of demo: Physical Card Scan) */}
        <button
          id="btn-screen6-continue"
          type="button"
          onClick={onContinueToNextDemo}
          className="w-full h-[52px] rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] shadow-lg hover:brightness-105"
          style={{
            backgroundColor: DESIGN_TOKENS.colors.accent,
            color: DESIGN_TOKENS.colors.accentForeground,
            minHeight: DESIGN_TOKENS.touchTarget.minHeight,
            fontSize: '15px',
          }}
          aria-label="Continue to Physical Business Card Scanning Demo"
        >
          <span>Continue</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </button>

        {/* ----------------------------------------------------------- */}
        {/* PROTOTYPE TEST INSPECTOR BAR (For Reviewing Edge States)    */}
        {/* ----------------------------------------------------------- */}
        <div className="pt-1.5 border-t border-white/[0.05] flex flex-wrap items-center justify-between gap-1.5 text-[10px] text-[#64748B]">
          <span>Screen 6 Test States:</span>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setDemoState('received-notification')}
              className={`px-1.5 py-0.5 rounded border transition-all ${
                demoState === 'received-notification'
                  ? 'border-[#E5A93C]/40 text-[#E5A93C] bg-[#E5A93C]/10 font-semibold'
                  : 'border-white/[0.06] text-[#64748B] hover:text-white'
              }`}
            >
              Default (Notified)
            </button>
            <button
              onClick={() => setDemoState('both-saved')}
              className={`px-1.5 py-0.5 rounded border transition-all ${
                demoState === 'both-saved'
                  ? 'border-[#10B981]/40 text-[#10B981] bg-[#10B981]/10 font-semibold'
                  : 'border-white/[0.06] text-[#64748B] hover:text-white'
              }`}
            >
              Both Saved
            </button>
            <button
              onClick={() => setDemoState('not-now')}
              className={`px-1.5 py-0.5 rounded border transition-all ${
                demoState === 'not-now'
                  ? 'border-white/30 text-white bg-white/10 font-semibold'
                  : 'border-white/[0.06] text-[#64748B] hover:text-white'
              }`}
            >
              "Not Now" Choice
            </button>
            <button
              onClick={() => setIsLongNameTest(!isLongNameTest)}
              className={`px-1.5 py-0.5 rounded border transition-all ${
                isLongNameTest
                  ? 'border-[#E5A93C]/40 text-[#E5A93C] bg-[#E5A93C]/10 font-semibold'
                  : 'border-white/[0.06] text-[#64748B] hover:text-white'
              }`}
            >
              {isLongNameTest ? 'Long Names: ON' : 'Long Names: OFF'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
