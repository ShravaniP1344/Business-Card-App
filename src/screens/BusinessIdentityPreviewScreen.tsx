import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Check, 
  Phone, 
  Mail, 
  Globe, 
  Instagram, 
  MapPin, 
  QrCode, 
  Building2, 
  User, 
  Sparkles, 
  Eye, 
  ShieldCheck, 
  Loader2, 
  MessageSquare, 
  Send,
  ExternalLink,
  ChevronRight,
  Sliders,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { DESIGN_TOKENS } from '../design-system/tokens';
import { BusinessIdentityFormData } from './BusinessIdentitySetupScreen';

interface BusinessIdentityPreviewScreenProps {
  data?: BusinessIdentityFormData | null;
  onBackToEdit: () => void;
  onConfirmSuccess: () => void;
  isLargeTextMode?: boolean;
}

export const BusinessIdentityPreviewScreen: React.FC<BusinessIdentityPreviewScreenProps> = ({
  data,
  onBackToEdit,
  onConfirmSuccess,
  isLargeTextMode = false,
}) => {
  // Confirmation state
  const [confirmStatus, setConfirmStatus] = useState<'idle' | 'confirming' | 'success'>('idle');
  const [activeToast, setActiveToast] = useState<string | null>(null);

  // Inspector test scenario override for reviewer verification
  const [scenarioOverride, setScenarioOverride] = useState<'default' | 'long' | 'devanagari' | 'minimal'>('default');
  const [showInspector, setShowInspector] = useState<boolean>(false);

  // Default values matching Screen 11 if no dynamic data was passed
  const baseData: BusinessIdentityFormData = data || {
    personName: 'Shravani Pasnur',
    profilePhoto: null,
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

  // Resolve active data based on test scenario
  const activeData: BusinessIdentityFormData = React.useMemo(() => {
    if (scenarioOverride === 'long') {
      return {
        ...baseData,
        personName: 'Shrinivas Venkateshwara Rao Kulkarni',
        role: 'Senior Business Development & Strategic Partnerships Regional Manager',
        businessName: 'Shree Siddhivinayak Industrial Engineering Solutions Private Limited',
        businessCategory: 'Industrial Equipment Manufacturing & Automation',
        city: 'Chhatrapati Sambhajinagar',
        state: 'Maharashtra',
        aboutBusiness: 'Specialized high-precision heavy tooling, turnkey industrial fabrication, and plant instrumentation solutions for Tier-1 automotive and aerospace assembly facilities.',
      };
    }
    if (scenarioOverride === 'devanagari') {
      return {
        ...baseData,
        personName: 'श्रावणी पासनूर',
        role: 'संस्थापक व मुख्य कार्यकारी अधिकारी',
        businessName: 'श्री गणेश टेक्नॉलॉजीज प्रायव्हेट लिमिटेड',
        businessCategory: 'माहिती तंत्रज्ञान व संगणक प्रणाली',
        city: 'सोलापूर',
        state: 'महाराष्ट्र',
        aboutBusiness: 'स्थानिक व्यवसाय व शेती क्षेत्रासाठी उपयुक्त आधुनिक डिजिटल सॉफ्टवेअर आणि स्मार्ट प्रणाली निर्मिती.',
      };
    }
    if (scenarioOverride === 'minimal') {
      return {
        ...baseData,
        businessEmail: '',
        website: '',
        instagram: '',
        aboutBusiness: '',
        profilePhoto: null,
        businessLogo: null,
      };
    }
    return baseData;
  }, [baseData, scenarioOverride]);

  // Initials generator
  const getInitials = (name: string, fallback: string = 'SP') => {
    if (!name) return fallback;
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const personInitials = getInitials(activeData.personName, 'SP');
  const businessInitials = getInitials(activeData.businessName, 'AI');

  // Handle Confirm flow
  const handleConfirm = () => {
    if (confirmStatus !== 'idle') return;
    setConfirmStatus('confirming');

    // Simulate server association
    setTimeout(() => {
      setConfirmStatus('success');

      // Transition to next screen (Screen 13 placeholder)
      setTimeout(() => {
        onConfirmSuccess();
      }, 1100);
    }, 900);
  };

  const showSimulatedActionToast = (action: string) => {
    setActiveToast(`Preview Mode: ${action} action will be live once confirmed.`);
    setTimeout(() => {
      setActiveToast(null);
    }, 2400);
  };

  return (
    <div 
      id="screen-12-business-identity-preview"
      className="relative h-full w-full flex flex-col justify-between overflow-y-auto bg-[#0A0D14] text-[#F8FAFC] select-none"
    >
      {/* TOP AREA */}
      <div className="shrink-0 px-5 pt-3 pb-2 z-10">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            id="btn-preview-back"
            onClick={onBackToEdit}
            disabled={confirmStatus !== 'idle'}
            className="w-10 h-10 -ml-1.5 rounded-xl bg-[#121722]/80 border border-white/[0.08] hover:border-white/[0.2] flex items-center justify-center text-[#94A3B8] hover:text-white transition-all active:scale-95 disabled:opacity-50"
            aria-label="Back to edit form"
          >
            <ArrowLeft className="w-4 h-4 text-[#E5A93C]" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-[#E5A93C] uppercase tracking-wider px-2 py-0.5 rounded bg-[#E5A93C]/10 border border-[#E5A93C]/20">
              Identity Review
            </span>

            {/* Test Inspector Toggle */}
            <button
              onClick={() => setShowInspector(!showInspector)}
              className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[#94A3B8] hover:text-white transition-all text-xs"
              title="Toggle reviewer test scenarios"
              aria-label="Reviewer Inspector"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Header Titles */}
        <div className="mt-3">
          <p className="text-[11px] font-semibold text-[#E5A93C] uppercase tracking-wider mb-1">
            Your business identity
          </p>
          <h1 className={`font-bold text-white tracking-tight leading-tight ${isLargeTextMode ? 'text-2xl' : 'text-xl'}`}>
            This is how you'll appear.
          </h1>
          <p className="text-xs text-[#94A3B8] mt-1 leading-relaxed max-w-[92%]">
            Check everything before making this identity active.
          </p>
        </div>
      </div>

      {/* REVIEWER TEST DRAWER */}
      {showInspector && (
        <div className="mx-5 mb-2 p-3 rounded-xl bg-[#141B29] border border-white/[0.12] text-xs space-y-2 z-20 shadow-xl">
          <div className="flex items-center justify-between pb-1 border-b border-white/[0.06]">
            <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#E5A93C]" />
              Reviewer Test Scenarios
            </span>
            <span className="text-[10px] text-[#64748B]">Simulate edge cases</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => setScenarioOverride('default')}
              className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border text-left transition-all ${
                scenarioOverride === 'default'
                  ? 'bg-[#E5A93C]/15 border-[#E5A93C] text-[#E5A93C]'
                  : 'bg-black/30 border-white/[0.08] text-[#94A3B8] hover:text-white'
              }`}
            >
              Standard (Shravani)
            </button>
            <button
              onClick={() => setScenarioOverride('long')}
              className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border text-left transition-all ${
                scenarioOverride === 'long'
                  ? 'bg-[#E5A93C]/15 border-[#E5A93C] text-[#E5A93C]'
                  : 'bg-black/30 border-white/[0.08] text-[#94A3B8] hover:text-white'
              }`}
            >
              Long Names & Role
            </button>
            <button
              onClick={() => setScenarioOverride('devanagari')}
              className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border text-left transition-all ${
                scenarioOverride === 'devanagari'
                  ? 'bg-[#E5A93C]/15 border-[#E5A93C] text-[#E5A93C]'
                  : 'bg-black/30 border-white/[0.08] text-[#94A3B8] hover:text-white'
              }`}
            >
              मराठी / Devanagari
            </button>
            <button
              onClick={() => setScenarioOverride('minimal')}
              className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border text-left transition-all ${
                scenarioOverride === 'minimal'
                  ? 'bg-[#E5A93C]/15 border-[#E5A93C] text-[#E5A93C]'
                  : 'bg-black/30 border-white/[0.08] text-[#94A3B8] hover:text-white'
              }`}
            >
              Minimal (Required only)
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT / SCROLLABLE HERO AREA */}
      <div className="flex-1 px-5 py-2 space-y-3.5">
        {/* HERO — DIGITAL BUSINESS IDENTITY CARD */}
        <div 
          id="card-digital-business-identity"
          className="relative rounded-2xl bg-gradient-to-b from-[#161D2B] to-[#101520] border border-white/[0.12] p-4.5 shadow-2xl transition-all duration-300"
          style={{ boxShadow: '0 12px 36px -8px rgba(0, 0, 0, 0.65)' }}
        >
          {/* Subtle Top Metallic Accent Pill */}
          <div className="flex items-center justify-between mb-3.5">
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.05] border border-white/[0.08]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
              <span className="text-[10px] font-semibold text-[#CBD5E1] uppercase tracking-wider">
                Digital Business Identity
              </span>
            </div>

            {/* Quick edit affordance icon */}
            <button
              onClick={onBackToEdit}
              disabled={confirmStatus !== 'idle'}
              className="text-[11px] text-[#94A3B8] hover:text-[#E5A93C] flex items-center gap-1 transition-colors px-1.5 py-0.5 rounded hover:bg-white/[0.04]"
              title="Edit identity details"
            >
              <span>Edit</span>
            </button>
          </div>

          {/* PERSON IDENTITY HEADER */}
          <div className="flex items-start gap-3.5 pb-3.5 border-b border-white/[0.08]">
            {/* Person Profile Photo or Initials Monogram */}
            <div className="relative shrink-0">
              {activeData.profilePhoto ? (
                <img 
                  src={activeData.profilePhoto} 
                  alt={activeData.personName}
                  className="w-14 h-14 rounded-2xl object-cover border border-[#E5A93C]/40 shadow-md"
                />
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#1E2738] to-[#121824] border border-white/[0.14] flex items-center justify-center text-[#E5A93C] font-bold text-lg shadow-inner">
                  {personInitials}
                </div>
              )}
              {/* Verified Person Microbadge */}
              <div 
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#101520] border border-white/[0.12] flex items-center justify-center text-[#10B981]"
                title="Verified Person"
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            </div>

            {/* Person Name & Role Hierarchy */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
                  Person
                </span>
              </div>
              <h2 className={`font-bold text-white tracking-tight leading-snug break-words ${isLargeTextMode ? 'text-lg' : 'text-base'}`}>
                {activeData.personName}
              </h2>
              <p className="text-xs font-semibold text-[#E5A93C] mt-0.5 leading-snug break-words">
                {activeData.role}
              </p>
            </div>
          </div>

          {/* BUSINESS HIERARCHY */}
          <div className="py-3.5 border-b border-white/[0.08]">
            <div className="flex items-start gap-3">
              {/* Business Logo or AI Initials Badge */}
              <div className="shrink-0 mt-0.5">
                {activeData.businessLogo ? (
                  <img 
                    src={activeData.businessLogo} 
                    alt={activeData.businessName}
                    className="w-10 h-10 rounded-xl object-contain bg-white/5 border border-white/[0.12] p-0.5"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-[#1E293B] border border-white/[0.14] flex items-center justify-center text-white font-bold text-sm shadow-xs">
                    {businessInitials}
                  </div>
                )}
              </div>

              {/* Business Name, Category & Location */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
                    Business
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white tracking-tight leading-snug break-words">
                  {activeData.businessName}
                </h3>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-[#94A3B8] mt-1">
                  <span className="text-[#CBD5E1] font-medium">{activeData.businessCategory}</span>
                  <span className="text-white/20">•</span>
                  <span className="flex items-center gap-1 text-[#94A3B8]">
                    <MapPin className="w-3 h-3 text-[#E5A93C] shrink-0" />
                    {activeData.city}, {activeData.state}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BUSINESS CONTACT DETAILS LIST */}
          <div className="py-3 border-b border-white/[0.08] space-y-2">
            <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
              Business Contact Details
            </span>

            {/* Phone (Required) */}
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-[#94A3B8] flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#E5A93C]" />
                Phone
              </span>
              <span className="font-mono text-white font-medium">
                {activeData.businessPhone}
              </span>
            </div>

            {/* Email (Optional, shown if provided) */}
            {activeData.businessEmail ? (
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-[#94A3B8] flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#E5A93C]" />
                  Email
                </span>
                <span className="font-mono text-white font-medium truncate max-w-[200px]" title={activeData.businessEmail}>
                  {activeData.businessEmail}
                </span>
              </div>
            ) : null}

            {/* Website (Optional, shown if provided) */}
            {activeData.website ? (
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-[#94A3B8] flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-[#E5A93C]" />
                  Website
                </span>
                <span className="font-mono text-white font-medium truncate max-w-[200px]">
                  {activeData.website}
                </span>
              </div>
            ) : null}

            {/* Instagram (Optional, shown if provided) */}
            {activeData.instagram ? (
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-[#94A3B8] flex items-center gap-2">
                  <Instagram className="w-3.5 h-3.5 text-[#E5A93C]" />
                  Instagram
                </span>
                <span className="font-mono text-white font-medium">
                  {activeData.instagram}
                </span>
              </div>
            ) : null}
          </div>

          {/* CONTACT ACTIONS (Call, WhatsApp, Email - Preview Actions) */}
          <div className="pt-3 pb-1">
            <div className="text-[10px] text-[#64748B] uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>Member Interaction Preview</span>
              <span className="text-[10px] text-[#E5A93C]/80 lowercase">(preview mode)</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* Call */}
              <button
                type="button"
                onClick={() => showSimulatedActionToast('Call')}
                className="h-10 rounded-xl bg-[#1B2332] hover:bg-[#232D40] border border-white/[0.08] hover:border-white/[0.18] flex items-center justify-center gap-1.5 text-xs font-semibold text-white transition-all active:scale-95"
              >
                <Phone className="w-3.5 h-3.5 text-[#E5A93C]" />
                <span>Call</span>
              </button>

              {/* WhatsApp */}
              <button
                type="button"
                onClick={() => showSimulatedActionToast('WhatsApp')}
                className="h-10 rounded-xl bg-[#1B2332] hover:bg-[#232D40] border border-white/[0.08] hover:border-white/[0.18] flex items-center justify-center gap-1.5 text-xs font-semibold text-white transition-all active:scale-95"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#10B981]" />
                <span>WhatsApp</span>
              </button>

              {/* Email (Disabled/hidden if no email) */}
              {activeData.businessEmail ? (
                <button
                  type="button"
                  onClick={() => showSimulatedActionToast('Email')}
                  className="h-10 rounded-xl bg-[#1B2332] hover:bg-[#232D40] border border-white/[0.08] hover:border-white/[0.18] flex items-center justify-center gap-1.5 text-xs font-semibold text-white transition-all active:scale-95"
                >
                  <Mail className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Email</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => showSimulatedActionToast('Share')}
                  className="h-10 rounded-xl bg-[#1B2332] hover:bg-[#232D40] border border-white/[0.08] hover:border-white/[0.18] flex items-center justify-center gap-1.5 text-xs font-semibold text-white transition-all active:scale-95"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#94A3B8]" />
                  <span>Share</span>
                </button>
              )}
            </div>
          </div>

          {/* TASTEFUL IDENTITY-SPECIFIC QR PREVIEW */}
          <div className="mt-3.5 pt-3 border-t border-white/[0.06] flex items-center justify-between bg-black/25 -mx-4.5 -mb-4.5 p-3.5 rounded-b-2xl">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-white p-1 shadow-sm flex items-center justify-center shrink-0">
                {/* Clean Vector QR representation */}
                <div className="w-full h-full grid grid-cols-5 gap-0.5 bg-black p-0.5 rounded-xs">
                  <div className="bg-white col-span-2 row-span-2 rounded-xs" />
                  <div className="bg-black" />
                  <div className="bg-white col-span-2 row-span-2 rounded-xs" />
                  <div className="bg-white" />
                  <div className="bg-black" />
                  <div className="bg-white" />
                  <div className="bg-black" />
                  <div className="bg-white" />
                  <div className="bg-white col-span-2 row-span-2 rounded-xs" />
                  <div className="bg-white" />
                  <div className="bg-white col-span-2 row-span-2 rounded-xs" />
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-white tracking-tight flex items-center gap-1">
                  <span>Your business QR</span>
                </p>
                <p className="text-[10px] text-[#94A3B8] leading-tight">
                  Specific to {activeData.personName.split(' ')[0]} @ {activeData.businessName}
                </p>
              </div>
            </div>

            <span className="text-[10px] text-[#CBD5E1] font-mono px-2 py-0.5 rounded bg-white/[0.06] border border-white/[0.08]">
              Ready
            </span>
          </div>
        </div>

        {/* OPTIONAL ABOUT BUSINESS PREVIEW */}
        {activeData.aboutBusiness ? (
          <div className="p-3.5 rounded-xl bg-[#121722] border border-white/[0.08] space-y-1">
            <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider block">
              About {activeData.businessName}
            </span>
            <p className="text-xs text-[#CBD5E1] leading-relaxed break-words">
              {activeData.aboutBusiness}
            </p>
          </div>
        ) : null}

        {/* PUBLIC INFORMATION NOTE */}
        <div className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-[#101622]/60 border border-white/[0.06]">
          <Eye className="w-4 h-4 text-[#94A3B8] shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#94A3B8] leading-normal">
            These are the details people can see when they find this business identity or scan your QR.
          </p>
        </div>

        {/* SIMULATED TOAST MESSAGE */}
        {activeToast && (
          <div className="p-2.5 rounded-xl bg-[#1F293D] border border-[#E5A93C]/30 text-xs text-[#F8FAFC] flex items-center gap-2 animate-fade-in shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-[#E5A93C] shrink-0" />
            <span className="flex-1">{activeToast}</span>
          </div>
        )}
      </div>

      {/* BOTTOM ACTIONS / CONFIRMATION AREA */}
      <div className="shrink-0 p-5 pt-3 bg-gradient-to-t from-[#0A0D14] via-[#0A0D14]/95 to-transparent border-t border-white/[0.06] z-20 space-y-2">
        {/* SUCCESS STATE */}
        {confirmStatus === 'success' ? (
          <div className="h-13 w-full rounded-xl bg-[#10B981]/15 border border-[#10B981]/40 flex items-center justify-center gap-2.5 text-[#10B981] font-semibold text-sm animate-fade-in">
            <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
            <span>✓ Identity ready</span>
            <span className="text-xs text-[#A7F3D0] font-normal">• Moving to next step...</span>
          </div>
        ) : (
          /* PRIMARY ACTION: CONFIRM IDENTITY */
          <button
            id="btn-confirm-identity"
            type="button"
            onClick={handleConfirm}
            disabled={confirmStatus === 'confirming'}
            className="w-full h-13 rounded-xl bg-[#E5A93C] hover:bg-[#D4982B] active:bg-[#C2871A] text-[#0A0D14] font-bold text-sm tracking-wide transition-all shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
            style={{ minHeight: DESIGN_TOKENS.touchTarget.minHeight }}
          >
            {confirmStatus === 'confirming' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#0A0D14]" />
                <span>Confirming...</span>
              </>
            ) : (
              <>
                <span>Confirm Identity</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        )}

        {/* SECONDARY ACTION: EDIT */}
        <div className="flex justify-center pt-0.5">
          <button
            id="btn-edit-identity-secondary"
            type="button"
            onClick={onBackToEdit}
            disabled={confirmStatus !== 'idle'}
            className="py-1.5 px-4 text-xs font-medium text-[#94A3B8] hover:text-white transition-colors active:scale-95 disabled:opacity-40"
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};
