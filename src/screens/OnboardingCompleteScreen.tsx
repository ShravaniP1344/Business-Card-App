import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Check, 
  Search, 
  QrCode, 
  ScanLine, 
  Users, 
  Briefcase, 
  Building2, 
  Sparkles,
  ChevronRight,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { DESIGN_TOKENS } from '../design-system/tokens';
import { BusinessIdentityFormData } from './BusinessIdentitySetupScreen';

interface OnboardingCompleteScreenProps {
  userFullName: string;
  userProfilePhoto?: string | null;
  identities?: BusinessIdentityFormData[];
  onBack: () => void;
  onEnterApp: () => void;
  isLargeTextMode?: boolean;
}

export const OnboardingCompleteScreen: React.FC<OnboardingCompleteScreenProps> = ({
  userFullName,
  userProfilePhoto,
  identities = [],
  onBack,
  onEnterApp,
  isLargeTextMode = false,
}) => {
  const [isEntering, setIsEntering] = useState(false);
  const [testScenario, setTestScenario] = useState<'default' | 'multi' | 'long' | 'devanagari'>('default');
  const [showInspector, setShowInspector] = useState(false);

  // Active identity list based on test scenario or real props
  const resolvedIdentities = React.useMemo(() => {
    if (testScenario === 'multi') {
      return [
        {
          personName: 'Shravani Pasnur',
          businessName: 'Aikyam AI Systems',
          role: 'Software Engineer',
          businessCategory: 'Technology',
          city: 'Solapur',
          state: 'Maharashtra',
          phoneCountryCode: '+91',
        },
        {
          personName: 'Shravani Pasnur',
          businessName: 'Pasnur Industries',
          role: 'Director',
          businessCategory: 'Manufacturing & Textiles',
          city: 'Solapur',
          state: 'Maharashtra',
          phoneCountryCode: '+91',
        }
      ] as BusinessIdentityFormData[];
    }

    if (testScenario === 'long') {
      return [
        {
          personName: 'Dr. Shravanikumari Pasnur-Deshmukh',
          businessName: 'Aikyam Cognitive & Distributed Artificial Intelligence Systems Pvt. Ltd.',
          role: 'Principal Research Architect & Lead Technical Consultant',
          businessCategory: 'Enterprise Artificial Intelligence & Machine Learning Engineering',
          city: 'Solapur Industrial Metropolitan Corridor',
          state: 'Maharashtra',
          phoneCountryCode: '+91',
        }
      ] as BusinessIdentityFormData[];
    }

    if (testScenario === 'devanagari') {
      return [
        {
          personName: 'श्रावणी पासनूर',
          businessName: 'ऐक्यम एआय सिस्टीम्स',
          role: 'सॉफ्टवेअर इंजिनिअर',
          businessCategory: 'तंत्रज्ञान व माहिती प्रणाली',
          city: 'सोलापूर',
          state: 'महाराष्ट्र',
          phoneCountryCode: '+91',
        }
      ] as BusinessIdentityFormData[];
    }

    if (identities && identities.length > 0) {
      return identities;
    }

    return [
      {
        personName: userFullName || 'Shravani Pasnur',
        businessName: 'Aikyam AI Systems',
        role: 'Software Engineer',
        businessCategory: 'Technology',
        city: 'Solapur',
        state: 'Maharashtra',
        phoneCountryCode: '+91',
      }
    ] as BusinessIdentityFormData[];
  }, [identities, testScenario, userFullName]);

  const primaryIdentity = resolvedIdentities[0];
  const totalIdentitiesCount = resolvedIdentities.length;
  const isMultiIdentity = totalIdentitiesCount > 1;

  // Person initials calculation
  const getInitials = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (parts[0] ? parts[0].slice(0, 2) : 'SP').toUpperCase();
  };

  const getBusinessInitials = (bName: string) => {
    const parts = bName.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (parts[0] ? parts[0].slice(0, 2) : 'AI').toUpperCase();
  };

  const handleEnterClick = () => {
    if (isEntering) return;
    setIsEntering(true);
    // Brief transition state: "Opening..." (per spec requirement)
    setTimeout(() => {
      onEnterApp();
    }, 450);
  };

  return (
    <div 
      id="screen-14-onboarding-complete"
      className="relative flex flex-col h-full w-full bg-[#0A0D14] text-[#F8FAFC] select-none overflow-hidden font-sans"
      style={{ fontFamily: DESIGN_TOKENS.typography.fontFamily }}
    >
      {/* Background Subtle Gradient & Abstract Constellation Field */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft Radial Ambient Glow */}
        <div 
          className="absolute top-[28%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #E5A93C 0%, #10B981 40%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[280px] h-[180px] rounded-full blur-3xl opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #1F293D 0%, transparent 70%)' }}
        />
      </div>

      {/* TOP APP BAR: Minimal back arrow */}
      <header className="relative z-10 flex items-center justify-between px-4 pt-3 pb-2 shrink-0">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-[#121722]/80 hover:bg-[#182030] border border-white/[0.08] flex items-center justify-center text-[#94A3B8] hover:text-white transition-all active:scale-95"
          aria-label="Back to Business Identities"
          title="Back to previous screen"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        {/* Prototype Inspector Toggle */}
        <button
          onClick={() => setShowInspector(!showInspector)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
            showInspector 
              ? 'bg-[#E5A93C]/20 border-[#E5A93C]/50 text-[#E5A93C]' 
              : 'bg-[#121722]/60 border-white/[0.08] text-[#94A3B8] hover:text-white'
          }`}
          title="Toggle completion variations & multilingual test"
        >
          <Sliders className="w-3 h-3" />
          <span>Screen 14 Demo</span>
        </button>
      </header>

      {/* INSPECTOR SLIDEOUT */}
      {showInspector && (
        <div className="relative z-20 mx-4 mb-2 p-2.5 rounded-xl bg-[#121722] border border-[#E5A93C]/30 shadow-lg shrink-0">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/[0.08]">
            <span className="text-[11px] font-semibold text-[#E5A93C] flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Test Variations (Screen 14 Spec)
            </span>
            <span className="text-[10px] text-[#94A3B8]">Prototype Control</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10px]">
            <button
              onClick={() => setTestScenario('default')}
              className={`px-2 py-1.5 rounded-lg border text-left font-medium transition-all ${
                testScenario === 'default'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8] hover:text-white'
              }`}
            >
              1 Identity (Default)
            </button>
            <button
              onClick={() => setTestScenario('multi')}
              className={`px-2 py-1.5 rounded-lg border text-left font-medium transition-all ${
                testScenario === 'multi'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8] hover:text-white'
              }`}
            >
              2 Identities (Multi)
            </button>
            <button
              onClick={() => setTestScenario('long')}
              className={`px-2 py-1.5 rounded-lg border text-left font-medium transition-all ${
                testScenario === 'long'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8] hover:text-white'
              }`}
            >
              Long Enterprise Text
            </button>
            <button
              onClick={() => setTestScenario('devanagari')}
              className={`px-2 py-1.5 rounded-lg border text-left font-medium transition-all ${
                testScenario === 'devanagari'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8] hover:text-white'
              }`}
            >
              मराठी (Devanagari)
            </button>
          </div>
        </div>
      )}

      {/* MAIN SCROLLABLE CONTENT */}
      <main className="relative z-10 flex-1 px-5 flex flex-col items-center justify-center text-center overflow-y-auto min-h-0 py-2">
        <div className="w-full max-w-[340px] flex flex-col items-center mx-auto my-auto">
          
          {/* 1. COMPLETION ICON: Restrained emerald & gold tick */}
          <div className="relative mb-3 flex items-center justify-center">
            {/* Soft Ambient Halo */}
            <div className="absolute inset-0 w-12 h-12 rounded-full bg-[#10B981]/20 blur-md" />
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10B981]/25 to-[#0A0D14] border border-[#10B981]/40 flex items-center justify-center shadow-md">
              <Check className="w-6 h-6 text-[#10B981] stroke-[2.5]" />
            </div>
          </div>

          {/* 2. HEADLINE & SUPPORTING COPY */}
          <h1 className={`font-bold tracking-tight text-white mb-1.5 ${
            isLargeTextMode ? 'text-2xl' : 'text-[23px]'
          }`}>
            You're all set.
          </h1>

          <p className={`text-[#94A3B8] max-w-[280px] leading-snug mb-5 ${
            isLargeTextMode ? 'text-sm' : 'text-[13px]'
          }`}>
            Your business identity is ready. Start building your network.
          </p>

          {/* 3. VISUAL COMPOSITION: User's Compact Identity Card with subtle active network satellite nodes */}
          <div className="relative w-full mb-5">
            
            {/* Subtle Abstract Peripheral Nodes (Search, QR, Scan, Network) */}
            {/* Node: Search (Top Left) */}
            <div 
              className="absolute -top-3 -left-2 z-10 flex items-center gap-1 px-2 py-1 rounded-full bg-[#121722]/95 border border-white/[0.12] text-[10px] text-[#94A3B8] shadow-md backdrop-blur-xs transition-transform hover:scale-105"
              title="Search Discovery"
            >
              <Search className="w-2.5 h-2.5 text-[#E5A93C]" />
              <span className="text-[9px] font-medium tracking-wide">Search</span>
            </div>

            {/* Node: QR (Top Right) */}
            <div 
              className="absolute -top-3 -right-2 z-10 flex items-center gap-1 px-2 py-1 rounded-full bg-[#121722]/95 border border-white/[0.12] text-[10px] text-[#94A3B8] shadow-md backdrop-blur-xs transition-transform hover:scale-105"
              title="Instant Digital QR"
            >
              <QrCode className="w-2.5 h-2.5 text-[#E5A93C]" />
              <span className="text-[9px] font-medium tracking-wide">QR</span>
            </div>

            {/* Node: Scan (Bottom Left) */}
            <div 
              className="absolute -bottom-2.5 -left-2 z-10 flex items-center gap-1 px-2 py-1 rounded-full bg-[#121722]/95 border border-white/[0.12] text-[10px] text-[#94A3B8] shadow-md backdrop-blur-xs transition-transform hover:scale-105"
              title="Physical Card Scanner"
            >
              <ScanLine className="w-2.5 h-2.5 text-[#E5A93C]" />
              <span className="text-[9px] font-medium tracking-wide">Scan</span>
            </div>

            {/* Node: Network (Bottom Right) */}
            <div 
              className="absolute -bottom-2.5 -right-2 z-10 flex items-center gap-1 px-2 py-1 rounded-full bg-[#121722]/95 border border-white/[0.12] text-[10px] text-[#94A3B8] shadow-md backdrop-blur-xs transition-transform hover:scale-105"
              title="My Network Hub"
            >
              <Users className="w-2.5 h-2.5 text-[#10B981]" />
              <span className="text-[9px] font-medium tracking-wide">Network</span>
            </div>

            {/* The Central Compact Identity Card */}
            <div className="relative w-full rounded-2xl bg-gradient-to-b from-[#161D2B] to-[#121722] border border-white/[0.14] p-4 text-left shadow-xl overflow-hidden transition-all hover:border-[#E5A93C]/40">
              
              {/* Subtle top accent rim */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E5A93C]/60 to-transparent" />

              {/* Header inside card: Avatar + Personal Info */}
              <div className="flex items-start gap-3 mb-3">
                {/* User Monogram or Photo */}
                <div className="relative shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1F293D] to-[#141B28] border border-white/[0.18] flex items-center justify-center font-bold text-sm text-[#E5A93C] shadow-sm overflow-hidden">
                    {userProfilePhoto ? (
                      <img 
                        src={userProfilePhoto} 
                        alt={primaryIdentity?.personName || userFullName} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <span>{getInitials(primaryIdentity?.personName || userFullName)}</span>
                    )}
                  </div>
                  {/* Subtle active emerald ring badge */}
                  <div 
                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#10B981] border-2 border-[#121722] flex items-center justify-center shadow-xs"
                    title="Active verified digital card"
                  >
                    <Check className="w-2.5 h-2.5 text-[#0A0D14] stroke-[3]" />
                  </div>
                </div>

                {/* Personal Name & Role */}
                <div className="min-w-0 flex-1 pt-0.5">
                  <div className="flex items-center justify-between gap-1">
                    <h2 className="text-sm font-bold text-white tracking-tight truncate">
                      {primaryIdentity?.personName || userFullName}
                    </h2>
                    
                    {/* Status Pill: ✓ Ready */}
                    <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[10px] font-semibold text-[#10B981]">
                      <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                      <span>Ready</span>
                    </span>
                  </div>

                  <p className="text-[12px] font-medium text-[#E5A93C] truncate mt-0.5">
                    {primaryIdentity?.role || 'Software Engineer'}
                  </p>
                </div>
              </div>

              {/* Business Entity Row (Compact Summary) */}
              <div className="pt-2.5 border-t border-white/[0.08] flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  {/* Business Monogram / Logo */}
                  <div className="w-6 h-6 rounded-md bg-[#1F293D] border border-white/[0.1] text-[10px] font-bold text-[#E5A93C] flex items-center justify-center shrink-0">
                    {getBusinessInitials(primaryIdentity?.businessName || 'Aikyam AI Systems')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] font-semibold text-white truncate">
                      {primaryIdentity?.businessName || 'Aikyam AI Systems'}
                    </div>
                    <div className="text-[10px] text-[#94A3B8] truncate">
                      {primaryIdentity?.businessCategory || 'Technology'} • {primaryIdentity?.city || 'Solapur'}
                    </div>
                  </div>
                </div>

                {/* Second business indicator if multi-identity */}
                {isMultiIdentity && (
                  <div className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#182030] border border-white/[0.1] text-[9.5px] font-medium text-[#94A3B8]">
                    <span>+{totalIdentitiesCount - 1} more</span>
                  </div>
                )}
              </div>

              {/* Multi-identity badge if multiple businesses created */}
              {isMultiIdentity && (
                <div className="mt-2.5 pt-2 border-t border-white/[0.06] flex items-center justify-between text-[10px] text-[#94A3B8]">
                  <span className="flex items-center gap-1 text-[#E5A93C] font-medium">
                    <Building2 className="w-3 h-3" />
                    <span>{totalIdentitiesCount} business identities active</span>
                  </span>
                  <span className="text-[#64748B]">Single Account</span>
                </div>
              )}
            </div>
          </div>

          {/* Subdued reassurance note (No promo, no pricing, no permission clutter) */}
          <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
            <span>Onboarding finished • Personal account verified</span>
          </div>

        </div>
      </main>

      {/* BOTTOM ACTION AREA: Primary CTA "Enter App" */}
      <footer className="relative z-10 px-5 pt-3 pb-6 shrink-0 bg-gradient-to-t from-[#0A0D14] via-[#0A0D14] to-transparent">
        <button
          id="btn-enter-app"
          onClick={handleEnterClick}
          disabled={isEntering}
          className={`w-full h-[52px] rounded-xl font-semibold text-[15px] flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.98] ${
            isEntering
              ? 'bg-[#E5A93C]/80 text-[#0A0D14] cursor-wait'
              : 'bg-[#E5A93C] hover:bg-[#D49629] text-[#0A0D14] hover:shadow-[#E5A93C]/20'
          }`}
          aria-label="Enter App and open Home"
        >
          {isEntering ? (
            <>
              <div className="w-4 h-4 rounded-full border-2 border-[#0A0D14] border-t-transparent animate-spin" />
              <span>Opening...</span>
            </>
          ) : (
            <>
              <span>Enter App</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </>
          )}
        </button>

        {/* Small accessibility note */}
        <p className="text-center text-[10px] text-[#64748B] mt-2.5">
          Home • Search • Scanner • My Network are ready
        </p>
      </footer>
    </div>
  );
};
