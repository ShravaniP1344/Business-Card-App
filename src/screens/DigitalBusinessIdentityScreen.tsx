import React, { useState } from 'react';
import { 
  ArrowLeft, 
  UserPlus, 
  Check, 
  Phone, 
  Mail, 
  Globe, 
  MapPin, 
  Building2, 
  MessageSquare, 
  ExternalLink,
  Sparkles,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Share2,
  QrCode,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { DESIGN_TOKENS } from '../design-system/tokens';

export type Screen5Variant = 
  | 'default' 
  | 'already-added' 
  | 'network-error' 
  | 'unavailable' 
  | 'long-names';

interface DigitalBusinessIdentityScreenProps {
  onBackToSearch: () => void;
  onNavigateToScreen6: () => void;
  isLargeTextMode?: boolean;
  initialAdditionState?: 'idle' | 'adding' | 'added';
  onAdditionStateChange?: (state: 'idle' | 'adding' | 'added') => void;
}

export const DigitalBusinessIdentityScreen: React.FC<DigitalBusinessIdentityScreenProps> = ({
  onBackToSearch,
  onNavigateToScreen6,
  isLargeTextMode = false,
  initialAdditionState = 'idle',
  onAdditionStateChange,
}) => {
  // Interactive addition state
  const [additionState, setAdditionState] = useState<'idle' | 'adding' | 'added'>(initialAdditionState);
  const [activeVariant, setActiveVariant] = useState<Screen5Variant>('default');
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Trigger feedback toast for contact actions (Call, WhatsApp, Email, Website)
  const triggerActionFeedback = (message: string) => {
    setFeedbackToast(message);
    setTimeout(() => setFeedbackToast(null), 2500);
  };

  // Simulated addition interaction
  const handleAddToNetwork = () => {
    if (additionState !== 'idle') return; // Prevent double-tap
    setAdditionState('adding');
    onAdditionStateChange?.('adding');

    setTimeout(() => {
      if (activeVariant === 'network-error') {
        setAdditionState('idle');
        onAdditionStateChange?.('idle');
        return;
      }
      setAdditionState('added');
      onAdditionStateChange?.('added');
    }, 850);
  };

  // Reset addition when switching test variants
  const handleVariantChange = (variant: Screen5Variant) => {
    setActiveVariant(variant);
    if (variant === 'already-added') {
      setAdditionState('added');
      onAdditionStateChange?.('added');
    } else {
      setAdditionState('idle');
      onAdditionStateChange?.('idle');
    }
  };

  // Determine person and company data based on variant
  const isLong = activeVariant === 'long-names';
  const personName = isLong 
    ? 'Shrinivas Venkateshwara Rao Kulkarni' 
    : 'Rahul Patil';
  
  const designation = isLong
    ? 'Senior Business Development & Strategic Partnerships Manager'
    : 'Owner';

  const companyName = isLong
    ? 'Shree Siddhivinayak Industrial Engineering Solutions Private Limited'
    : 'ABC Manufacturing';

  const industry = isLong
    ? 'Heavy Industrial Machinery & Automation'
    : 'Manufacturing';

  const location = isLong
    ? 'Chakan Industrial Corridor, Pune, Maharashtra'
    : 'Solapur, Maharashtra';

  const phone = '+91 98765 43210';
  const email = isLong ? 's.kulkarni@siddhivinayak-eng.com' : 'rahul@abcmanufacturing.in';
  const website = isLong ? 'siddhivinayak-engineering-solutions.com' : 'abcmanufacturing.in';

  // -----------------------------------------------------------------
  // Edge Case: Profile Unavailable
  // -----------------------------------------------------------------
  if (activeVariant === 'unavailable') {
    return (
      <div 
        id="screen5-unavailable"
        className="h-full w-full flex flex-col justify-between overflow-y-auto px-5 py-4 text-[#F8FAFC]"
        style={{ backgroundColor: DESIGN_TOKENS.colors.background }}
      >
        <div className="flex items-center justify-between pt-1">
          <button
            onClick={onBackToSearch}
            className="h-9 px-2.5 rounded-xl bg-[#121722] border border-white/[0.08] flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 text-[#E5A93C]" />
            <span>Back to Search</span>
          </button>
        </div>

        <div className="my-auto text-center space-y-3 max-w-[280px] mx-auto py-8">
          <div className="w-14 h-14 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444] mx-auto">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-base font-bold text-white">This business identity is no longer available</h2>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            The member may have updated or removed this business role.
          </p>
          <button
            onClick={onBackToSearch}
            className="mt-2 h-10 px-4 rounded-xl bg-[#182030] border border-white/[0.12] text-xs font-semibold text-white hover:border-[#E5A93C]/40"
          >
            Search Other Identities
          </button>
        </div>

        {/* Variant selector in footer */}
        <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-[#64748B]">
          <span>Test Edge Case:</span>
          <button 
            onClick={() => handleVariantChange('default')}
            className="px-2 py-1 rounded bg-[#182030] text-[#E5A93C] border border-[#E5A93C]/30"
          >
            Back to Default (Rahul Patil)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      id="screen-5-digital-business-identity"
      className="h-full w-full flex flex-col justify-between select-none relative overflow-y-auto px-5 py-3 text-[#F8FAFC]"
      style={{
        backgroundColor: DESIGN_TOKENS.colors.background,
        fontFamily: DESIGN_TOKENS.typography.fontFamily,
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. TOP BAR: Back Navigation + Demo Step 2 Progress Indicator  */}
      {/* ------------------------------------------------------------- */}
      <div className="pt-1.5 pb-2 shrink-0 flex items-center justify-between border-b border-white/[0.06]">
        {/* Back to Screen 4 (Preserves Search State) */}
        <button
          id="btn-screen5-back-to-search"
          type="button"
          onClick={onBackToSearch}
          className="h-9 px-2.5 -ml-1 rounded-xl flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white hover:bg-white/[0.04] transition-colors"
          aria-label="Back to Search Results"
        >
          <ArrowLeft className="w-4 h-4 text-[#E5A93C]" />
          <span className="font-medium">Search</span>
        </button>

        {/* Demo Progress Indicator (Consistent with Step 1) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#141A27] px-2.5 py-1 rounded-full border border-white/[0.08]">
            <span className="w-2 h-2 rounded-full bg-[#10B981]" />
            <span className="text-[11px] font-semibold text-white">Step 2 of 3</span>
            <span className="text-[11px] text-[#64748B]">•</span>
            <span className="text-[11px] text-[#E5A93C] font-semibold">Add</span>
          </div>
          <span className="text-[10px] text-[#64748B] font-medium hidden sm:inline">Quick demo</span>
        </div>
      </div>

      {/* Floating Action Feedback Toast (For Call/Email/WhatsApp taps) */}
      {feedbackToast && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-30 bg-[#1F293D] border border-[#E5A93C]/40 text-white text-[11px] font-medium px-3.5 py-1.5 rounded-full shadow-xl flex items-center gap-1.5 animate-fade-in">
          <Sparkles className="w-3 h-3 text-[#E5A93C]" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. MAIN CONTENT: Digital Business Identity Card & Details     */}
      {/* ------------------------------------------------------------- */}
      <div className="my-auto py-2.5 space-y-3.5 shrink-1">
        
        {/* =========================================================== */}
        {/* HERO: The Original Digital Business Identity Card           */}
        {/* =========================================================== */}
        <div 
          id="digital-identity-card"
          className="relative rounded-2xl overflow-hidden border shadow-xl transition-all duration-300"
          style={{
            background: 'linear-gradient(145deg, #141B29 0%, #0F1420 100%)',
            borderColor: additionState === 'added' ? 'rgba(229, 169, 60, 0.5)' : 'rgba(255, 255, 255, 0.12)',
            boxShadow: additionState === 'added' ? '0 10px 30px -10px rgba(229, 169, 60, 0.25)' : '0 10px 25px -5px rgba(0,0,0,0.5)',
          }}
        >
          {/* Subtle Background Pattern: Modern Geometric Mesh Lines */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.035]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="cardGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#FFFFFF" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#cardGrid)" />
            </svg>
          </div>

          {/* Top Gold Corner Ambient Glow */}
          <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-[#E5A93C]/10 blur-xl pointer-events-none" />

          {/* Card Interior Padding */}
          <div className="relative p-4 sm:p-5 space-y-3.5">
            
            {/* Header of the Card: Business Identity Badge & Status */}
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              {/* Business Identity Tag */}
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#E5A93C]" />
                <span className="text-[10px] font-bold text-[#E5A93C] uppercase tracking-wider">
                  Digital Business Identity
                </span>
              </div>

              {/* Status Indicator: Real-time In-Network vs Public ID */}
              {additionState === 'added' ? (
                <div className="flex items-center gap-1 bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                  <Check className="w-3 h-3 stroke-[2.5]" />
                  <span>In Your Network</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 bg-white/[0.05] text-[#94A3B8] border border-white/[0.08] px-2 py-0.5 rounded-full text-[10px] font-medium">
                  <ShieldCheck className="w-3 h-3 text-[#E5A93C]" />
                  <span>Verified Member</span>
                </div>
              )}
            </div>

            {/* PERSON + BUSINESS RELATIONSHIP CORE BLOCK */}
            <div className="flex items-start gap-3.5">
              {/* Rahul's Avatar: Premium Monogram with Gold Trim */}
              <div className="relative shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#221C14] to-[#14110C] border-2 border-[#E5A93C] flex items-center justify-center text-[#E5A93C] font-bold text-lg shadow-md">
                  {isLong ? 'SV' : 'RP'}
                </div>
                {/* Active Platform Presence Indicator */}
                <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#10B981] border-2 border-[#0F1420]" title="Active on Network" />
              </div>

              {/* Person Identity Details */}
              <div className="flex-1 min-w-0">
                <h1 
                  id="person-name"
                  className={`font-bold tracking-tight text-white leading-tight break-words ${
                    isLargeTextMode ? 'text-lg' : 'text-[17px]'
                  }`}
                >
                  {personName}
                </h1>
                
                {/* Role / Designation at this Specific Business */}
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs font-semibold text-[#E5A93C] tracking-wide break-words">
                    {designation}
                  </span>
                </div>

                {/* Clear Visual Association with Company */}
                <div className="flex items-center gap-1.5 text-xs text-[#CBD5E1] mt-1.5 font-medium">
                  <div className="w-4 h-4 rounded-md bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C] shrink-0">
                    <Building2 className="w-2.5 h-2.5" />
                  </div>
                  <span className="truncate font-semibold text-white">
                    {companyName}
                  </span>
                </div>
              </div>
            </div>

            {/* Business Category & Geolocation Pill Bar */}
            <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-medium text-[#CBD5E1]">
                <Briefcase className="w-3 h-3 text-[#E5A93C]" />
                <span className="truncate">{industry}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[11px] font-medium text-[#94A3B8]">
                <MapPin className="w-3 h-3 text-[#64748B]" />
                <span className="truncate">{location}</span>
              </span>
            </div>

            {/* Subtle Divider */}
            <div className="border-t border-white/[0.08] pt-2" />

            {/* Contact Rows Associated Exclusively with ABC Manufacturing */}
            <div className="space-y-1.5 text-xs">
              {/* Phone */}
              <div className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-white/[0.02]">
                <div className="flex items-center gap-2 text-[#94A3B8]">
                  <Phone className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Business Phone</span>
                </div>
                <span className="font-mono text-[12px] font-semibold text-white">{phone}</span>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-white/[0.02]">
                <div className="flex items-center gap-2 text-[#94A3B8]">
                  <Mail className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Direct Email</span>
                </div>
                <span className="font-mono text-[11px] text-[#CBD5E1] truncate max-w-[170px]">{email}</span>
              </div>

              {/* Website */}
              <div className="flex items-center justify-between py-1 px-2 rounded-lg hover:bg-white/[0.02]">
                <div className="flex items-center gap-2 text-[#94A3B8]">
                  <Globe className="w-3.5 h-3.5 text-[#64748B]" />
                  <span>Website</span>
                </div>
                <span className="font-mono text-[11px] text-[#E5A93C] truncate max-w-[170px]">{website}</span>
              </div>
            </div>

            {/* Quick Contact Actions: Call, WhatsApp, Email */}
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => triggerActionFeedback(`Simulating call to ${phone}`)}
                className="h-9 rounded-xl bg-[#121722] border border-white/[0.1] hover:border-white/[0.2] flex items-center justify-center gap-1.5 text-xs font-semibold text-[#CBD5E1] hover:text-white transition-all active:scale-[0.97]"
                style={{ minHeight: '38px' }}
              >
                <Phone className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Call</span>
              </button>

              <button
                type="button"
                onClick={() => triggerActionFeedback(`Opening WhatsApp conversation with ${personName}`)}
                className="h-9 rounded-xl bg-[#121722] border border-white/[0.1] hover:border-white/[0.2] flex items-center justify-center gap-1.5 text-xs font-semibold text-[#CBD5E1] hover:text-white transition-all active:scale-[0.97]"
                style={{ minHeight: '38px' }}
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#25D366]" />
                <span>WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => triggerActionFeedback(`Composing email to ${email}`)}
                className="h-9 rounded-xl bg-[#121722] border border-white/[0.1] hover:border-white/[0.2] flex items-center justify-center gap-1.5 text-xs font-semibold text-[#CBD5E1] hover:text-white transition-all active:scale-[0.97]"
                style={{ minHeight: '38px' }}
              >
                <Mail className="w-3.5 h-3.5 text-[#60A5FA]" />
                <span>Email</span>
              </button>
            </div>
          </div>
        </div>

        {/* =========================================================== */}
        {/* MULTIPLE-BUSINESS NOTE: Nexa Consulting Separation          */}
        {/* =========================================================== */}
        <div className="bg-[#121722]/80 border border-white/[0.06] rounded-xl p-2.5 flex items-start gap-2.5">
          <div className="w-5 h-5 rounded-md bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[#94A3B8] shrink-0 mt-0.5">
            <Briefcase className="w-3 h-3" />
          </div>
          <div className="text-[11px] leading-relaxed text-[#94A3B8]">
            <span className="text-[#CBD5E1] font-semibold">Separate Identity Notice: </span>
            Rahul also partners at <strong className="text-white">Nexa Consulting</strong>. Adding this card stores only his <span className="text-[#E5A93C] font-medium">ABC Manufacturing</span> identity.
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. PRIMARY ACTION ZONE: Add to My Network & Transitions       */}
      {/* ------------------------------------------------------------- */}
      <div className="pt-2 pb-1 space-y-2 shrink-0 border-t border-white/[0.06]">
        
        {/* Teaching Message (Explains what is being kept) */}
        {additionState !== 'added' ? (
          <p className="text-center text-xs text-[#94A3B8] font-medium">
            Keep Rahul's <span className="text-white font-semibold">ABC Manufacturing</span> identity in your network.
          </p>
        ) : (
          <div className="text-center space-y-0.5">
            <p className="text-xs font-semibold text-[#10B981] flex items-center justify-center gap-1">
              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Added to your network</span>
            </p>
            <p className="text-[11px] text-[#94A3B8]">
              Rahul will be notified and can independently add you back.
            </p>
          </div>
        )}

        {/* STATE 1: Default / Idle (+ Add to My Network) */}
        {additionState === 'idle' && (
          <button
            id="btn-add-to-my-network"
            type="button"
            onClick={handleAddToNetwork}
            className="w-full h-[52px] rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] shadow-lg hover:brightness-105"
            style={{
              backgroundColor: DESIGN_TOKENS.colors.accent,
              color: DESIGN_TOKENS.colors.accentForeground,
              minHeight: DESIGN_TOKENS.touchTarget.minHeight,
              fontSize: '15px',
            }}
            aria-label={`Add ${personName} at ${companyName} to My Network`}
          >
            <UserPlus className="w-4 h-4 stroke-[2.5]" />
            <span>+ Add to My Network</span>
          </button>
        )}

        {/* STATE 2: Loading State (Adding...) */}
        {additionState === 'adding' && (
          <button
            id="btn-adding-to-network-loading"
            type="button"
            disabled
            className="w-full h-[52px] rounded-xl font-bold flex items-center justify-center gap-2.5 bg-[#E5A93C]/80 text-[#0A0D14] cursor-not-allowed"
            style={{ minHeight: DESIGN_TOKENS.touchTarget.minHeight, fontSize: '15px' }}
          >
            <RefreshCw className="w-4 h-4 animate-spin stroke-[2.5]" />
            <span>Adding to My Network...</span>
          </button>
        )}

        {/* STATE 3: Added Success Transition -> Revealing Next Action */}
        {additionState === 'added' && (
          <div className="space-y-2">
            {/* Success Confirmation Badge Button */}
            <div
              id="badge-added-to-my-network"
              className="w-full h-[46px] rounded-xl font-semibold flex items-center justify-center gap-2 bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981]"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>✓ Added to My Network</span>
            </div>

            {/* Next Action in Onboarding Demo: Navigate to Screen 6 */}
            <button
              id="btn-see-what-happens-next"
              type="button"
              onClick={onNavigateToScreen6}
              className="w-full h-[52px] rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] shadow-lg hover:brightness-105"
              style={{
                backgroundColor: DESIGN_TOKENS.colors.accent,
                color: DESIGN_TOKENS.colors.accentForeground,
                minHeight: DESIGN_TOKENS.touchTarget.minHeight,
                fontSize: '15px',
              }}
            >
              <span>See what happens next</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        )}

        {/* Network Error State Action (if triggered in test inspector) */}
        {activeVariant === 'network-error' && additionState === 'idle' && (
          <div className="bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-xl p-2.5 text-center space-y-1">
            <p className="text-xs font-semibold text-[#EF4444]">
              Couldn't add Rahul right now.
            </p>
            <p className="text-[11px] text-[#94A3B8]">
              Check your connection and try again.
            </p>
            <button
              onClick={handleAddToNetwork}
              className="mt-1 px-3 py-1 bg-[#EF4444] text-white text-xs font-semibold rounded-lg"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ----------------------------------------------------------- */}
        {/* PROTOTYPE TEST INSPECTOR BAR (Edge Cases Verification)      */}
        {/* ----------------------------------------------------------- */}
        <div className="pt-2 border-t border-white/[0.05] flex flex-wrap items-center justify-between gap-1.5 text-[10px] text-[#64748B]">
          <span>Screen 5 Test Variants:</span>
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => handleVariantChange('default')}
              className={`px-1.5 py-0.5 rounded border transition-all ${
                activeVariant === 'default'
                  ? 'border-[#E5A93C]/40 text-[#E5A93C] bg-[#E5A93C]/10 font-semibold'
                  : 'border-white/[0.06] text-[#64748B] hover:text-white'
              }`}
            >
              Default
            </button>
            <button
              onClick={() => handleVariantChange('already-added')}
              className={`px-1.5 py-0.5 rounded border transition-all ${
                activeVariant === 'already-added'
                  ? 'border-[#E5A93C]/40 text-[#E5A93C] bg-[#E5A93C]/10 font-semibold'
                  : 'border-white/[0.06] text-[#64748B] hover:text-white'
              }`}
            >
              Already In Network
            </button>
            <button
              onClick={() => handleVariantChange('long-names')}
              className={`px-1.5 py-0.5 rounded border transition-all ${
                activeVariant === 'long-names'
                  ? 'border-[#E5A93C]/40 text-[#E5A93C] bg-[#E5A93C]/10 font-semibold'
                  : 'border-white/[0.06] text-[#64748B] hover:text-white'
              }`}
            >
              Long Names
            </button>
            <button
              onClick={() => handleVariantChange('network-error')}
              className={`px-1.5 py-0.5 rounded border transition-all ${
                activeVariant === 'network-error'
                  ? 'border-[#EF4444]/40 text-[#EF4444] bg-[#EF4444]/10 font-semibold'
                  : 'border-white/[0.06] text-[#64748B] hover:text-white'
              }`}
            >
              Network Error
            </button>
            <button
              onClick={() => handleVariantChange('unavailable')}
              className={`px-1.5 py-0.5 rounded border transition-all ${
                activeVariant === 'unavailable'
                  ? 'border-white/30 text-white bg-white/10 font-semibold'
                  : 'border-white/[0.06] text-[#64748B] hover:text-white'
              }`}
            >
              Unavailable
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
