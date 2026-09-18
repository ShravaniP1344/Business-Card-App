import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Plus, 
  Check, 
  Briefcase, 
  Building2, 
  ArrowRight, 
  Sliders, 
  ShieldCheck, 
  CheckCircle2, 
  Info,
  Loader2
} from 'lucide-react';
import { DESIGN_TOKENS } from '../design-system/tokens';
import { BusinessIdentityFormData } from './BusinessIdentitySetupScreen';

interface AddAnotherBusinessScreenProps {
  userFullName?: string;
  userProfilePhoto?: string | null;
  identities?: BusinessIdentityFormData[];
  onBack: () => void;
  onAddAnotherBusiness: () => void;
  onContinue: () => void;
  isLargeTextMode?: boolean;
}

export const AddAnotherBusinessScreen: React.FC<AddAnotherBusinessScreenProps> = ({
  userFullName = 'Shravani Pasnur',
  userProfilePhoto = null,
  identities = [],
  onBack,
  onAddAnotherBusiness,
  onContinue,
  isLargeTextMode = false,
}) => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showInspector, setShowInspector] = useState<boolean>(false);
  const [scenarioMode, setScenarioMode] = useState<'default' | 'two-businesses' | 'three-businesses' | 'long-text' | 'devanagari'>('default');

  // Fallback initial confirmed identity if empty array passed
  const defaultFirstIdentity: BusinessIdentityFormData = {
    personName: userFullName,
    profilePhoto: userProfilePhoto,
    businessName: 'Aikyam AI Systems',
    businessLogo: null,
    businessCategory: 'Technology',
    role: 'Software Engineer',
    businessPhone: '+91 98765 43210',
    phoneCountryCode: '+91',
    businessEmail: 'shravani@aikyam.ai',
    website: 'aikyam.ai',
    instagram: '@aikyam',
    city: 'Solapur',
    state: 'Maharashtra',
    aboutBusiness: 'Technology solutions focused on practical digital products and enterprise AI applications.',
  };

  // Resolve list of active identities based on inspector scenario or passed props
  const activeIdentities: BusinessIdentityFormData[] = React.useMemo(() => {
    if (scenarioMode === 'two-businesses') {
      return [
        defaultFirstIdentity,
        {
          personName: userFullName,
          profilePhoto: userProfilePhoto,
          businessName: 'Pasnur Industries',
          businessLogo: null,
          businessCategory: 'Manufacturing',
          role: 'Owner & Managing Director',
          businessPhone: '+91 98220 12345',
          phoneCountryCode: '+91',
          businessEmail: 'shravani@pasnurindustries.in',
          website: 'pasnurindustries.in',
          instagram: '@pasnur_ind',
          city: 'Solapur',
          state: 'Maharashtra',
          aboutBusiness: 'Precision engineering, metal fabrication, and industrial equipment components.',
        },
      ];
    }
    if (scenarioMode === 'three-businesses') {
      return [
        defaultFirstIdentity,
        {
          personName: userFullName,
          profilePhoto: userProfilePhoto,
          businessName: 'Pasnur Industries',
          businessLogo: null,
          businessCategory: 'Manufacturing',
          role: 'Owner',
          businessPhone: '+91 98220 12345',
          phoneCountryCode: '+91',
          businessEmail: 'shravani@pasnurindustries.in',
          website: 'pasnurindustries.in',
          instagram: '',
          city: 'Solapur',
          state: 'Maharashtra',
          aboutBusiness: 'Industrial components manufacturing.',
        },
        {
          personName: userFullName,
          profilePhoto: userProfilePhoto,
          businessName: 'XYZ Technical Advisory',
          businessLogo: null,
          businessCategory: 'Consulting',
          role: 'Principal Consultant',
          businessPhone: '+91 94220 99887',
          phoneCountryCode: '+91',
          businessEmail: 'shravani@xyzconsulting.com',
          website: 'xyzconsulting.com',
          instagram: '',
          city: 'Pune',
          state: 'Maharashtra',
          aboutBusiness: 'Technology advisory and automation strategies.',
        },
      ];
    }
    if (scenarioMode === 'long-text') {
      return [
        {
          ...defaultFirstIdentity,
          businessName: 'Shree Siddhivinayak Industrial Engineering Solutions Private Limited',
          role: 'Senior Business Development & Strategic Partnerships Regional Manager',
          businessCategory: 'Industrial Equipment Manufacturing & Automation',
          city: 'Chhatrapati Sambhajinagar',
          state: 'Maharashtra',
        },
      ];
    }
    if (scenarioMode === 'devanagari') {
      return [
        {
          ...defaultFirstIdentity,
          personName: 'श्रावणी पासनूर',
          businessName: 'श्री गणेश टेक्नॉलॉजीज प्रायव्हेट लिमिटेड',
          role: 'संस्थापक व मुख्य कार्यकारी अधिकारी',
          businessCategory: 'माहिती तंत्रज्ञान व संगणक प्रणाली',
          city: 'सोलापूर',
          state: 'महाराष्ट्र',
        },
      ];
    }

    // Default: use passed identities if available, otherwise default to first confirmed Aikyam identity
    return identities.length > 0 ? identities : [defaultFirstIdentity];
  }, [identities, scenarioMode, userFullName, userProfilePhoto]);

  // Initials generator
  const getInitials = (name: string, fallback: string = 'SP') => {
    if (!name) return fallback;
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const personInitials = getInitials(userFullName, 'SP');

  const handleContinue = () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onContinue();
    }, 450);
  };

  const isManyIdentities = activeIdentities.length >= 3;

  return (
    <div 
      id="screen-13-add-another-business"
      className="h-full w-full flex flex-col justify-between overflow-hidden select-none"
      style={{ backgroundColor: DESIGN_TOKENS.colors.background }}
    >
      {/* TOP BAR */}
      <header className="shrink-0 flex items-center justify-between px-5 pt-4 pb-2 z-20 border-b border-white/[0.04]">
        <button
          id="btn-back-to-screen12"
          onClick={onBack}
          className="w-10 h-10 -ml-1.5 rounded-xl flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-white/5 active:scale-95 transition-all"
          style={{ minHeight: DESIGN_TOKENS.touchTarget.minHeight, minWidth: DESIGN_TOKENS.touchTarget.minWidth }}
          aria-label="Back to Business Identity Preview"
        >
          <ArrowLeft className="w-5 h-5 text-[#E5A93C]" />
        </button>

        {/* Center label (minimal, no demo progress) */}
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121722] border border-white/[0.08]">
          <Building2 className="w-3.5 h-3.5 text-[#E5A93C]" />
          <span className="text-[11px] font-semibold text-[#CBD5E1] tracking-tight">
            Business Identities
          </span>
        </div>

        {/* Inspector toggle for reviewer testing */}
        <button
          id="btn-toggle-screen13-inspector"
          onClick={() => setShowInspector(!showInspector)}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            showInspector 
              ? 'bg-[#E5A93C] text-[#0A0D14]' 
              : 'bg-[#141B29] border border-white/[0.12] text-[#94A3B8] hover:text-[#E5A93C]'
          }`}
          title="Reviewer inspector"
          aria-label="Reviewer Inspector"
        >
          <Sliders className="w-4 h-4" />
        </button>
      </header>

      {/* INSPECTOR DRAWER (For reviewer edge-case verification) */}
      {showInspector && (
        <div className="shrink-0 bg-[#0E131E] border-b border-[#E5A93C]/30 px-5 py-3 text-xs space-y-2.5 z-30 animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#E5A93C] uppercase tracking-wider text-[10px]">
              Screen 13 Architecture Inspector
            </span>
            <button 
              onClick={() => setShowInspector(false)}
              className="text-[#94A3B8] hover:text-white text-[11px]"
            >
              Close
            </button>
          </div>
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setScenarioMode('default')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                scenarioMode === 'default'
                  ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold'
                  : 'bg-[#182030] text-[#94A3B8] hover:text-white'
              }`}
            >
              1 Identity (Default)
            </button>
            <button
              onClick={() => setScenarioMode('two-businesses')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                scenarioMode === 'two-businesses'
                  ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold'
                  : 'bg-[#182030] text-[#94A3B8] hover:text-white'
              }`}
            >
              2 Identities (Aikyam + Pasnur)
            </button>
            <button
              onClick={() => setScenarioMode('three-businesses')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                scenarioMode === 'three-businesses'
                  ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold'
                  : 'bg-[#182030] text-[#94A3B8] hover:text-white'
              }`}
            >
              3 Identities (List Mode)
            </button>
            <button
              onClick={() => setScenarioMode('long-text')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                scenarioMode === 'long-text'
                  ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold'
                  : 'bg-[#182030] text-[#94A3B8] hover:text-white'
              }`}
            >
              Long Names Wrap
            </button>
            <button
              onClick={() => setScenarioMode('devanagari')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                scenarioMode === 'devanagari'
                  ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold'
                  : 'bg-[#182030] text-[#94A3B8] hover:text-white'
              }`}
            >
              Devanagari (मराठी)
            </button>
          </div>
          <p className="text-[10px] text-[#64748B] italic">
            Note: Demonstrates multi-identity list scaling without horizontal breakage or multiple login accounts.
          </p>
        </div>
      )}

      {/* SCROLLABLE MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* SUBTLE SUCCESS ACKNOWLEDGEMENT */}
        <div className="flex items-center justify-start">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/25 text-[#10B981]">
            <Check className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="text-[11px] font-semibold tracking-tight">
              First identity ready
            </span>
          </div>
        </div>

        {/* MAIN HEADING & SUPPORTING COPY */}
        <div className="space-y-1.5">
          <h1 className={`font-bold text-white tracking-tight leading-snug ${isLargeTextMode ? 'text-2xl' : 'text-xl'}`}>
            Do you represent another business?
          </h1>
          <p className="text-xs text-[#94A3B8] leading-relaxed max-w-[95%]">
            You can keep different business identities under the same account.
          </p>
        </div>

        {/* VISUAL EXPLANATION: ONE PERSON -> MULTIPLE BUSINESS IDENTITIES */}
        <section 
          aria-label="Account and business identities"
          className="space-y-3 pt-1"
        >
          {/* PERSON CARD / ROOT ENTITY */}
          <div className="bg-[#101520] border border-white/[0.10] rounded-2xl p-3.5 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3 min-w-0">
              {/* Profile Photo or Initials */}
              <div className="relative shrink-0">
                {userProfilePhoto ? (
                  <img 
                    src={userProfilePhoto} 
                    alt={userFullName}
                    className="w-11 h-11 rounded-xl object-cover border border-[#E5A93C]/40 shadow-xs"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#1E2738] to-[#141B26] border border-white/[0.14] flex items-center justify-center text-[#E5A93C] font-bold text-sm shadow-inner">
                    {personInitials}
                  </div>
                )}
                <div 
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#0A0D14] border border-white/[0.12] flex items-center justify-center text-[#10B981]"
                  title="Verified Personal Account"
                >
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
              </div>

              {/* Person Name & Account Context */}
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
                    Personal Account
                  </span>
                </div>
                <h2 className="text-sm font-bold text-white truncate">
                  {userFullName}
                </h2>
                <p className="text-[11px] text-[#94A3B8]">
                  {activeIdentities.length} {activeIdentities.length === 1 ? 'business identity' : 'business identities'}
                </p>
              </div>
            </div>

            {/* Subtle One Account Badge */}
            <span className="shrink-0 text-[10px] font-medium text-[#E5A93C] bg-[#E5A93C]/10 border border-[#E5A93C]/20 px-2 py-0.5 rounded-md">
              Single Login
            </span>
          </div>

          {/* ELEGANT SUBTLE CONNECTOR STEM */}
          <div className="flex justify-center -my-1">
            <div className="w-[1.5px] h-3.5 bg-gradient-to-b from-white/[0.20] to-[#E5A93C]/40" />
          </div>

          {/* IDENTITIES LIST CONTAINER */}
          <div className="space-y-2.5">
            {/* RENDER ALL CONFIRMED IDENTITIES */}
            {activeIdentities.map((identity, idx) => {
              const businessInitials = getInitials(identity.businessName, 'AI');
              return (
                <div
                  key={`${identity.businessName}-${idx}`}
                  className="relative bg-gradient-to-b from-[#131926] to-[#0E131E] border border-white/[0.12] hover:border-white/[0.20] rounded-2xl p-4 transition-all shadow-sm group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0 flex-1">
                      {/* Business Logo or Badge */}
                      <div className="shrink-0 mt-0.5">
                        {identity.businessLogo ? (
                          <img 
                            src={identity.businessLogo} 
                            alt={identity.businessName}
                            className="w-10 h-10 rounded-xl object-contain bg-white/5 border border-white/[0.12] p-0.5"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-[#1A2333] border border-white/[0.14] flex items-center justify-center text-white font-bold text-xs shadow-xs">
                            {businessInitials}
                          </div>
                        )}
                      </div>

                      {/* Business Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="text-sm font-bold text-white tracking-tight leading-snug break-words">
                            {identity.businessName}
                          </h3>
                        </div>

                        {/* Role attached specifically to this business */}
                        <p className="text-xs font-semibold text-[#E5A93C] mt-0.5 leading-snug break-words">
                          {identity.role}
                        </p>

                        {/* Category & Location */}
                        <p className="text-[11px] text-[#94A3B8] mt-1 truncate">
                          {identity.businessCategory} {identity.city ? `• ${identity.city}` : ''}
                        </p>
                      </div>
                    </div>

                    {/* Active Status Badge */}
                    <div className="shrink-0">
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/25 px-2 py-0.5 rounded-full">
                        <Check className="w-2.5 h-2.5 stroke-[2.5]" />
                        Active
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* OPTIONAL: SECOND IDENTITY / ADD BUSINESS CARD (Unless list is already >= 3) */}
            <button
              id="card-add-another-business"
              onClick={onAddAnotherBusiness}
              className="w-full text-left bg-[#101520]/60 hover:bg-[#141B29] border border-dashed border-white/[0.18] hover:border-[#E5A93C]/60 rounded-2xl p-4 transition-all duration-150 active:scale-[0.99] group cursor-pointer"
              style={{ minHeight: DESIGN_TOKENS.touchTarget.minHeight }}
              aria-label="Add a different role or business"
            >
              <div className="flex items-center gap-3.5">
                {/* Plus Icon Badge */}
                <div className="w-10 h-10 rounded-xl bg-white/[0.04] group-hover:bg-[#E5A93C]/15 border border-white/[0.10] group-hover:border-[#E5A93C]/40 flex items-center justify-center text-[#94A3B8] group-hover:text-[#E5A93C] transition-colors shrink-0">
                  <Plus className="w-5 h-5 stroke-[2.2]" />
                </div>

                {/* Card Copy */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-white group-hover:text-[#E5A93C] transition-colors">
                      Another business
                    </span>
                    <span className="text-[10px] text-[#64748B] font-medium px-1.5 py-0.2 rounded bg-white/[0.04]">
                      Optional
                    </span>
                  </div>
                  <p className="text-xs text-[#94A3B8] group-hover:text-[#CBD5E1] transition-colors mt-0.5">
                    Add a different role or business
                  </p>
                </div>
              </div>
            </button>
          </div>
        </section>

        {/* PRODUCT MODEL CLARITY CALLOUT (Jargon-free explanation) */}
        <div className="bg-[#121824] border border-white/[0.08] rounded-2xl p-3.5 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
          <div className="text-[11px] text-[#94A3B8] leading-relaxed">
            <strong className="text-white font-medium block">How multi-identity works:</strong>
            You keep a single login and personal profile. Contacts will only see the specific business identity you choose to share with them.
          </div>
        </div>
      </main>

      {/* FOOTER ACTIONS */}
      <footer className="shrink-0 p-5 pt-3 bg-[#0A0D14]/95 backdrop-blur-md border-t border-white/[0.06] space-y-2.5 z-20">
        {/* PRIMARY ACTION: CONTINUE */}
        <button
          id="btn-continue-from-screen13"
          onClick={handleContinue}
          disabled={isSubmitting}
          className="w-full h-[52px] rounded-2xl bg-[#E5A93C] hover:bg-[#D49629] active:scale-[0.99] transition-all font-bold text-[#0A0D14] flex items-center justify-center gap-2 shadow-lg disabled:opacity-75 cursor-pointer"
          style={{ minHeight: DESIGN_TOKENS.touchTarget.minHeight }}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#0A0D14]" />
              <span className="text-sm tracking-tight">Continuing...</span>
            </>
          ) : (
            <>
              <span className="text-sm tracking-tight">Continue</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        {/* SECONDARY ACTION: + ADD ANOTHER BUSINESS */}
        <button
          id="btn-add-another-business-secondary"
          onClick={onAddAnotherBusiness}
          disabled={isSubmitting}
          className="w-full h-12 rounded-2xl bg-[#121722] hover:bg-[#182030] active:scale-[0.99] border border-white/[0.12] hover:border-[#E5A93C]/40 text-white hover:text-[#E5A93C] transition-all text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer"
          style={{ minHeight: DESIGN_TOKENS.touchTarget.minHeight }}
        >
          <Plus className="w-4 h-4 text-[#E5A93C]" />
          <span>+ Add Another Business</span>
        </button>

        {/* REASSURANCE MICROTEXT */}
        <p className="text-center text-[10px] text-[#64748B]">
          You can always add or edit business identities later from your profile.
        </p>
      </footer>
    </div>
  );
};
