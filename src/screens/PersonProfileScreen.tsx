import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  Phone,
  Mail,
  Globe,
  MessageSquare,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Building2,
  Star,
  MapPin,
  ExternalLink,
  ChevronRight,
  Sliders,
  Sparkles,
  Home as HomeIcon,
  Search,
  ScanLine,
  Users,
  User,
  X
} from 'lucide-react';
import { DESIGN_TOKENS } from '../design-system/tokens';

export interface BusinessIdentityDetail {
  id: string;
  businessName: string;
  role: string;
  category: string;
  city: string;
  state: string;
  monogram: string;
  logoUrl?: string | null;
  rating?: number;
  reviewCount?: number;
  phone: string;
  hasWhatsApp?: boolean;
  email: string;
  website?: string;
  isInNetwork: boolean;
  additionStatus?: 'idle' | 'adding' | 'added' | 'failed';
}

export interface PersonProfileData {
  id: string;
  name: string;
  initials: string;
  avatarColor?: string;
  profilePhoto?: string | null;
  supportingTitle?: string;
  identities: BusinessIdentityDetail[];
}

interface PersonProfileScreenProps {
  person?: PersonProfileData;
  onBack: () => void;
  onNavigateToHome?: () => void;
  onNavigateToSearch?: () => void;
  onNavigateToScan?: (mode?: 'card' | 'qr') => void;
  onNavigateToMyNetwork?: () => void;
  onNavigateToProfile?: () => void;
  onOpenBusinessProfile?: (businessId: string) => void;
  onNetworkStateChange?: (personId: string, identityId: string, isInNetwork: boolean) => void;
  isLargeTextMode?: boolean;
}

export const PersonProfileScreen: React.FC<PersonProfileScreenProps> = ({
  person: initialPerson,
  onBack,
  onNavigateToHome,
  onNavigateToSearch,
  onNavigateToScan,
  onNavigateToMyNetwork,
  onNavigateToProfile,
  onOpenBusinessProfile,
  onNetworkStateChange,
  isLargeTextMode = false,
}) => {
  // Default Rahul Patil Data Model: ONE Person, TWO Business Identities
  // ABC Manufacturing is already saved (✓ In My Network)
  // Nexa Consulting is not saved ([ Add to My Network ])
  const defaultRahul: PersonProfileData = {
    id: 'person-rahul-patil',
    name: 'Rahul Patil',
    initials: 'RP',
    avatarColor: '#E5A93C',
    supportingTitle: 'Business Professional',
    identities: [
      {
        id: 'biz-id-abc',
        businessName: 'ABC Manufacturing',
        role: 'Owner',
        category: 'Manufacturing',
        city: 'Solapur',
        state: 'Maharashtra',
        monogram: 'AM',
        rating: 4.6,
        reviewCount: 24,
        phone: '+91 98220 12345',
        hasWhatsApp: true,
        email: 'rahul@abcmanufacturing.in',
        website: 'abcmanufacturing.in',
        isInNetwork: true, // Already saved in network (Section 17, 60, 61)
        additionStatus: 'added',
      },
      {
        id: 'biz-id-nexa',
        businessName: 'Nexa Consulting',
        role: 'Partner',
        category: 'Business Consulting',
        city: 'Pune',
        state: 'Maharashtra',
        monogram: 'NC',
        rating: 4.8,
        reviewCount: 16,
        phone: '+91 97630 54321',
        hasWhatsApp: true,
        email: 'rahul@nexaconsulting.in',
        website: 'nexaconsulting.in',
        isInNetwork: false, // Not yet in network (Section 17, 60, 61)
        additionStatus: 'idle',
      },
    ],
  };

  // State
  const [profileData, setProfileData] = useState<PersonProfileData>(initialPerson || defaultRahul);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'info' | 'success' | 'error'>('info');

  // Inspector & Diagnostic Scenarios
  const [showInspector, setShowInspector] = useState<boolean>(false);
  const [scenario, setScenario] = useState<
    'default' | 'both-saved' | 'single-identity' | 'zero-identities' | 'long-names' | 'devanagari' | 'loading' | 'partial-error' | 'unavailable' | 'simulate-add-failure'
  >('default');

  // Toast Helper
  const triggerToast = (msg: string, type: 'info' | 'success' | 'error' = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Switch Scenarios
  const applyScenario = (target: typeof scenario) => {
    setScenario(target);
    if (target === 'default') {
      setProfileData(defaultRahul);
    } else if (target === 'both-saved') {
      setProfileData({
        ...defaultRahul,
        identities: defaultRahul.identities.map(i => ({ ...i, isInNetwork: true, additionStatus: 'added' }))
      });
    } else if (target === 'single-identity') {
      setProfileData({
        id: 'person-priya-shah',
        name: 'Priya Shah',
        initials: 'PS',
        avatarColor: '#38BDF8',
        supportingTitle: 'Founder & Managing Director',
        identities: [
          {
            id: 'biz-id-xyz',
            businessName: 'XYZ Technologies',
            role: 'Founder',
            category: 'Technology & Cloud',
            city: 'Pune',
            state: 'Maharashtra',
            monogram: 'XT',
            rating: 4.9,
            reviewCount: 38,
            phone: '+91 99210 98765',
            hasWhatsApp: true,
            email: 'priya@xyztech.io',
            website: 'xyztech.io',
            isInNetwork: false,
            additionStatus: 'idle',
          }
        ]
      });
    } else if (target === 'zero-identities') {
      setProfileData({
        id: 'person-amit-none',
        name: 'Amit Joshi',
        initials: 'AJ',
        avatarColor: '#94A3B8',
        supportingTitle: 'Platform Member',
        identities: []
      });
    } else if (target === 'long-names') {
      setProfileData({
        id: 'person-shrinivas-long',
        name: 'Shrinivas Venkateshwara Rao Kulkarni',
        initials: 'SK',
        avatarColor: '#A78BFA',
        supportingTitle: 'Senior Business Professional',
        identities: [
          {
            id: 'biz-id-siddhivinayak',
            businessName: 'Shree Siddhivinayak Industrial Engineering Solutions Private Limited',
            role: 'Senior Business Development & Strategic Partnerships Manager',
            category: 'Industrial Engineering & Fabrication',
            city: 'Solapur',
            state: 'Maharashtra',
            monogram: 'SS',
            rating: 4.7,
            reviewCount: 52,
            phone: '+91 94220 55443',
            hasWhatsApp: true,
            email: 'shrinivas.kulkarni@siddhivinayak-engg.com',
            website: 'siddhivinayak-engg.com',
            isInNetwork: false,
            additionStatus: 'idle',
          }
        ]
      });
    } else if (target === 'devanagari') {
      setProfileData({
        id: 'person-rahul-mr',
        name: 'राहुल पाटील',
        initials: 'रा',
        avatarColor: '#E5A93C',
        supportingTitle: 'व्यावसायिक प्रतिनिधी',
        identities: [
          {
            id: 'biz-id-abc-mr',
            businessName: 'एबीसी मॅन्युफॅक्चरिंग',
            role: 'मालक (Owner)',
            category: 'औद्योगिक उत्पादन',
            city: 'सोलापूर',
            state: 'महाराष्ट्र',
            monogram: 'ए',
            rating: 4.6,
            reviewCount: 24,
            phone: '+91 98220 12345',
            hasWhatsApp: true,
            email: 'rahul@abcmanufacturing.in',
            website: 'abcmanufacturing.in',
            isInNetwork: true,
            additionStatus: 'added',
          },
          {
            id: 'biz-id-nexa-mr',
            businessName: 'नेक्सा कन्सल्टिंग',
            role: 'भागीदार (Partner)',
            category: 'व्यवसाय सल्लागार',
            city: 'पुणे',
            state: 'महाराष्ट्र',
            monogram: 'ने',
            rating: 4.8,
            reviewCount: 16,
            phone: '+91 97630 54321',
            hasWhatsApp: true,
            email: 'rahul@nexaconsulting.in',
            website: 'nexaconsulting.in',
            isInNetwork: false,
            additionStatus: 'idle',
          }
        ]
      });
    }
  };

  // ADD TO MY NETWORK HANDLER (Section 15, 16, 19, 20, 21)
  // Directional save: Shravani saves Rahul's selected business identity in HER My Network.
  // Rahul does NOT need to approve. No request/approval/friend wording.
  const handleAddIdentity = (identityId: string) => {
    // Check if simulate failure scenario is active
    if (scenario === 'simulate-add-failure') {
      setProfileData(prev => ({
        ...prev,
        identities: prev.identities.map(item =>
          item.id === identityId ? { ...item, additionStatus: 'adding' } : item
        )
      }));

      setTimeout(() => {
        setProfileData(prev => ({
          ...prev,
          identities: prev.identities.map(item =>
            item.id === identityId ? { ...item, additionStatus: 'idle' } : item
          )
        }));
        triggerToast("Couldn't add to your network. Try again.", 'error');
      }, 500);
      return;
    }

    // Set state to Adding...
    setProfileData(prev => ({
      ...prev,
      identities: prev.identities.map(item =>
        item.id === identityId ? { ...item, additionStatus: 'adding' } : item
      )
    }));

    // Simulate swift backend save
    setTimeout(() => {
      setProfileData(prev => ({
        ...prev,
        identities: prev.identities.map(item =>
          item.id === identityId ? { ...item, additionStatus: 'added', isInNetwork: true } : item
        )
      }));

      // Notify parent to synchronize state with Search screen! (Section 65)
      if (onNetworkStateChange) {
        onNetworkStateChange(profileData.id, identityId, true);
      }

      triggerToast('Added to your network', 'success');
    }, 450);
  };

  // Contact Action Handlers (Section 22, 67)
  const handleCall = (phone: string, businessName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerToast(`Opening dialer for ${phone} (${businessName})`, 'info');
  };

  const handleWhatsApp = (phone: string, businessName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerToast(`Opening WhatsApp for ${phone} (${businessName})`, 'info');
  };

  const handleEmail = (email: string, businessName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    triggerToast(`Composing email to ${email} (${businessName})`, 'info');
  };

  // Share profile action (Section 3, 26)
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${profileData.name} • Aikyam Profile`,
        text: `View ${profileData.name}'s business identities on Aikyam`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      triggerToast(`Link to ${profileData.name}'s profile copied to clipboard`, 'success');
    }
  };

  return (
    <div
      id="screen-17-person-profile"
      className="relative flex flex-col h-full w-full bg-[#0A0D14] text-[#F8FAFC] select-none overflow-hidden font-sans"
      style={{ fontFamily: DESIGN_TOKENS.typography.fontFamily }}
    >
      {/* TOAST OVERLAY */}
      {toastMessage && (
        <div
          className={`absolute top-14 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 rounded-full backdrop-blur-md border text-[11px] font-medium shadow-xl flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200 ${
            toastType === 'error'
              ? 'bg-[#EF4444]/95 border-[#EF4444]/30 text-white'
              : toastType === 'success'
              ? 'bg-[#10B981]/95 border-[#10B981]/30 text-white'
              : 'bg-[#182030]/95 border-white/[0.15] text-[#F8FAFC]'
          }`}
        >
          {toastType === 'error' ? (
            <AlertCircle className="w-3.5 h-3.5 text-white" />
          ) : toastType === 'success' ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP APP BAR (Section 3): Back arrow, "Profile", Share action */}
      <header className="relative z-20 bg-[#0A0D14]/95 backdrop-blur-md border-b border-white/[0.06] px-4 pt-3 pb-2.5 shrink-0 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            id="btn-back-to-search"
            onClick={onBack}
            className="w-8 h-8 -ml-1.5 rounded-full flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-white/[0.06] transition-colors active:scale-95"
            aria-label="Back to Search results"
            title="Back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-sm font-bold text-white tracking-tight">
            {scenario === 'devanagari' ? 'प्रोफाइल (Profile)' : 'Profile'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Share Action */}
          <button
            id="btn-share-person-profile"
            onClick={handleShare}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-white/[0.06] transition-colors active:scale-95"
            aria-label={`Share ${profileData.name}'s profile`}
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Prototype Diagnostic Toggle */}
          <button
            onClick={() => setShowInspector(!showInspector)}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
              showInspector
                ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-[#E5A93C]'
                : 'bg-[#121722] border-white/[0.08] text-[#94A3B8] hover:text-white'
            }`}
            title="Screen 17 Architecture Test Controls"
            aria-label="Toggle Screen 17 diagnostic controls"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* INSPECTOR SLIDEOUT / TEST SCENARIOS FOR SCREEN 17 */}
      {showInspector && (
        <div className="relative z-30 mx-4 mt-2 p-3 rounded-xl bg-[#121722] border border-[#E5A93C]/40 shadow-xl shrink-0 text-left">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/[0.08]">
            <span className="text-[11px] font-bold text-[#E5A93C] flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Screen 17 Architecture Verification
            </span>
            <button
              onClick={() => setShowInspector(false)}
              className="text-[#94A3B8] hover:text-white text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[10px] mb-2">
            <button
              onClick={() => applyScenario('default')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'default'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Default (ABC saved, Nexa addable)
            </button>
            <button
              onClick={() => applyScenario('both-saved')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'both-saved'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Both Identities In Network
            </button>
            <button
              onClick={() => applyScenario('single-identity')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'single-identity'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              1 Business Identity (Priya Shah)
            </button>
            <button
              onClick={() => applyScenario('zero-identities')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'zero-identities'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              0 Business Identities Graceful
            </button>
            <button
              onClick={() => applyScenario('long-names')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'long-names'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Long Names & Titles Test
            </button>
            <button
              onClick={() => applyScenario('devanagari')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'devanagari'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              मराठी (Devanagari UI)
            </button>
            <button
              onClick={() => setScenario('loading')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'loading'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Skeleton Loading State
            </button>
            <button
              onClick={() => setScenario('partial-error')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'partial-error'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Partial Error (Identities fail)
            </button>
            <button
              onClick={() => setScenario('unavailable')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'unavailable'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Profile Unavailable State
            </button>
            <button
              onClick={() => setScenario('simulate-add-failure')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'simulate-add-failure'
                  ? 'bg-[#EF4444]/20 border-[#EF4444] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Simulate Add Failure
            </button>
          </div>

          <p className="text-[9.5px] text-[#64748B] pt-1 border-t border-white/[0.06]">
            Active: <span className="text-[#E5A93C] font-semibold">{scenario}</span> • Back synchronizes state with Screen 16.
          </p>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN BODY CONTENT AREA */}
      {/* ========================================================================= */}
      {scenario === 'unavailable' ? (
        /* REMOVED / UNAVAILABLE PROFILE STATE (Section 49) */
        <main className="relative z-10 flex-1 px-5 flex flex-col items-center justify-center text-center p-6">
          <div className="w-12 h-12 rounded-2xl bg-[#121722] border border-white/[0.1] flex items-center justify-center text-[#94A3B8] mb-3">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-white mb-1">
            This profile is no longer available.
          </h2>
          <p className="text-xs text-[#94A3B8] max-w-[260px] mb-4">
            The user may have deactivated their profile or updated their privacy settings.
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-[#182030] border border-white/[0.12] text-white text-xs font-semibold hover:bg-[#1F293D] transition-all"
          >
            Back to Search
          </button>
        </main>
      ) : scenario === 'loading' ? (
        /* SKELETON LOADING STATE (Section 45) */
        <main className="relative z-10 flex-1 overflow-y-auto min-h-0 px-4 pt-4 pb-24 space-y-4 animate-pulse">
          {/* Skeleton Header */}
          <div className="flex flex-col items-center justify-center py-4 space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.08]" />
            <div className="h-4 w-32 bg-white/[0.08] rounded" />
            <div className="h-3 w-20 bg-white/[0.05] rounded" />
          </div>
          {/* Skeleton Cards */}
          <div className="space-y-3 pt-2">
            <div className="h-3 w-36 bg-white/[0.08] rounded" />
            <div className="h-44 w-full bg-[#121722] rounded-xl border border-white/[0.06]" />
            <div className="h-44 w-full bg-[#121722] rounded-xl border border-white/[0.06]" />
          </div>
        </main>
      ) : (
        <main className="relative z-10 flex-1 overflow-y-auto min-h-0 px-4 pt-3 pb-24 space-y-4">
          
          {/* ======================================================================= */}
          {/* PERSON HEADER (Section 5, 6, 7, 8) */}
          {/* CRITICAL: Rahul is ONE PERSON. */}
          {/* NO GLOBAL DESIGNATION (e.g. no "Owner" directly under Rahul's name!) */}
          {/* NO GLOBAL COMPANY (e.g. no "ABC Manufacturing" directly under Rahul's name!) */}
          {/* NO FAKE PERSONAL RATING OR FOLLOWERS */}
          {/* ======================================================================= */}
          <div className="flex flex-col items-center text-center pt-2 pb-1">
            {/* Person Initials Avatar (No random generated stock faces - Section 6) */}
            <div
              className="w-16 h-16 rounded-2xl bg-[#182030] border-2 border-white/[0.14] text-xl font-bold flex items-center justify-center shadow-md mb-2.5 transition-transform"
              style={{ color: profileData.avatarColor || '#E5A93C' }}
              aria-hidden="true"
            >
              {profileData.initials}
            </div>

            {/* Rahul's Name (Semantic H1) */}
            <h1 className="text-lg font-bold text-white tracking-tight leading-snug">
              {profileData.name}
            </h1>

            {/* Optional subtle supporting info ONLY - No fake global company or role */}
            {profileData.supportingTitle && (
              <p className="text-[11.5px] font-medium text-[#94A3B8] mt-0.5">
                {profileData.supportingTitle}
              </p>
            )}
          </div>

          {/* ======================================================================= */}
          {/* MAIN SECTION: BUSINESS IDENTITIES (Section 9, 10, 11, 12, 13, 14, 31) */}
          {/* "Choose the business you know Rahul through." */}
          {/* ======================================================================= */}
          <section aria-labelledby="heading-business-identities">
            <div className="mb-2.5">
              <h2
                id="heading-business-identities"
                className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5 text-[#E5A93C]" />
                <span>{scenario === 'devanagari' ? 'व्यावसायिक ओळख (Business Identities)' : 'Business Identities'}</span>
              </h2>
              <p className="text-[11px] text-[#94A3B8] mt-0.5 leading-relaxed">
                {scenario === 'devanagari'
                  ? 'तुम्ही ज्या व्यवसायामार्फत राहुलला ओळखता तो निवडा.'
                  : 'Choose the business you know Rahul through.'}
              </p>
            </div>

            {/* PARTIAL ERROR STATE (Section 48) */}
            {scenario === 'partial-error' ? (
              <div className="p-4 rounded-xl bg-[#121722] border border-[#EF4444]/30 text-center space-y-2">
                <AlertCircle className="w-5 h-5 text-[#EF4444] mx-auto" />
                <p className="text-xs font-bold text-white">Couldn't load business identities.</p>
                <p className="text-[10.5px] text-[#94A3B8]">
                  Network timeout while fetching business associations.
                </p>
                <button
                  onClick={() => applyScenario('default')}
                  className="px-3 py-1.5 rounded-lg bg-[#182030] border border-white/[0.12] text-xs font-semibold text-[#E5A93C] hover:bg-white/[0.04]"
                >
                  Try Again
                </button>
              </div>
            ) : profileData.identities.length === 0 ? (
              /* ZERO BUSINESS IDENTITIES GRACEFUL STATE (Section 40) */
              <div className="p-5 rounded-xl bg-[#121722] border border-white/[0.08] text-center space-y-2">
                <Building2 className="w-6 h-6 text-[#64748B] mx-auto" />
                <p className="text-xs font-bold text-white">No active business identity available.</p>
                <p className="text-[10.5px] text-[#94A3B8]">
                  This user has not listed any public business identities yet.
                </p>
              </div>
            ) : (
              /* VERTICAL LIST OF BUSINESS IDENTITY CARDS (Section 10-14, 31, 51) */
              <div className="space-y-3">
                {profileData.identities.map((identity) => (
                  <article
                    key={identity.id}
                    id={`identity-card-${identity.id}`}
                    className="p-3.5 rounded-xl bg-[#121722] border border-white/[0.08] shadow-xs hover:border-white/[0.14] transition-all"
                  >
                    {/* Header: Business Name (Tappable to Business Profile stub) + Monogram + Rating */}
                    <div className="flex items-start gap-3 pb-2.5 border-b border-white/[0.05]">
                      {/* Business Monogram / Logo (Section 10, 11) */}
                      <button
                        onClick={() => {
                          if (onOpenBusinessProfile) onOpenBusinessProfile(identity.id);
                          else triggerToast(`Opening Business Profile for ${identity.businessName}`, 'info');
                        }}
                        className="w-10 h-10 rounded-xl bg-[#182030] border border-white/[0.12] text-[#E5A93C] font-bold text-xs flex items-center justify-center shrink-0 hover:border-[#E5A93C]/40 transition-colors"
                        aria-label={`View ${identity.businessName} profile`}
                      >
                        {identity.monogram}
                      </button>

                      <div className="min-w-0 flex-1">
                        {/* Business Name (Link to Business Profile - Section 24, 63) */}
                        <div className="flex items-center justify-between gap-1">
                          <button
                            onClick={() => {
                              if (onOpenBusinessProfile) onOpenBusinessProfile(identity.id);
                              else triggerToast(`Opening Business Profile for ${identity.businessName}`, 'info');
                            }}
                            className="text-[13.5px] font-bold text-white hover:text-[#E5A93C] transition-colors truncate text-left group flex items-center gap-1"
                          >
                            <span className="truncate">{identity.businessName}</span>
                            <ChevronRight className="w-3 h-3 text-[#64748B] group-hover:text-white shrink-0" />
                          </button>

                          {/* Business-Only Rating (Section 28) - Never belongs to Rahul */}
                          {identity.rating && (
                            <div
                              className="flex items-center gap-1 shrink-0 text-[10px] text-[#E5A93C] font-semibold bg-[#E5A93C]/10 px-1.5 py-0.5 rounded-md border border-[#E5A93C]/20"
                              title={`${identity.rating} stars from ${identity.reviewCount} reviews`}
                            >
                              <Star className="w-2.5 h-2.5 fill-[#E5A93C]" />
                              <span>{identity.rating}</span>
                              <span className="text-[#94A3B8] font-normal">({identity.reviewCount})</span>
                            </div>
                          )}
                        </div>

                        {/* Role (Owner / Partner) — Belongs STRICTLY to this identity! */}
                        <div className="text-[12px] font-semibold text-white/90 mt-0.5">
                          {identity.role}
                        </div>

                        {/* Category & Location Context */}
                        <div className="text-[10.5px] text-[#94A3B8] truncate mt-0.5">
                          <span>{identity.category}</span> • <span>{identity.city}, {identity.state}</span>
                        </div>
                      </div>
                    </div>

                    {/* Business-Specific Contact Details (Section 10, 11, 12) */}
                    {/* Different phones, emails, websites per business identity! */}
                    <div className="py-2.5 space-y-1.5 text-[11px] border-b border-white/[0.05]">
                      <div className="flex items-center gap-2 text-[#94A3B8]">
                        <Phone className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                        <span className="text-white/90 font-mono tracking-tight">{identity.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[#94A3B8]">
                        <Mail className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                        <span className="text-white/90 truncate">{identity.email}</span>
                      </div>
                      {identity.website && (
                        <div className="flex items-center gap-2 text-[#94A3B8]">
                          <Globe className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                          <span className="text-white/90 truncate">{identity.website}</span>
                        </div>
                      )}
                    </div>

                    {/* Quick Communication Actions (Call, WhatsApp, Email - Section 22, 23, 25) */}
                    <div className="pt-2.5 pb-3 flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleCall(identity.phone, identity.businessName, e)}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-[#182030] hover:bg-[#1F293D] border border-white/[0.08] text-[#94A3B8] hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                        aria-label={`Call ${profileData.name} at ${identity.businessName}`}
                      >
                        <Phone className="w-3 h-3 text-[#E5A93C]" />
                        <span>Call</span>
                      </button>

                      {identity.hasWhatsApp && (
                        <button
                          onClick={(e) => handleWhatsApp(identity.phone, identity.businessName, e)}
                          className="flex-1 py-1.5 px-2 rounded-lg bg-[#182030] hover:bg-[#1F293D] border border-white/[0.08] text-[#94A3B8] hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                          aria-label={`WhatsApp ${profileData.name} at ${identity.businessName}`}
                        >
                          <MessageSquare className="w-3 h-3 text-[#10B981]" />
                          <span>WhatsApp</span>
                        </button>
                      )}

                      <button
                        onClick={(e) => handleEmail(identity.email, identity.businessName, e)}
                        className="flex-1 py-1.5 px-2 rounded-lg bg-[#182030] hover:bg-[#1F293D] border border-white/[0.08] text-[#94A3B8] hover:text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
                        aria-label={`Email ${profileData.name} at ${identity.businessName}`}
                      >
                        <Mail className="w-3 h-3 text-[#38BDF8]" />
                        <span>Email</span>
                      </button>
                    </div>

                    {/* INDEPENDENT "ADD TO MY NETWORK" ACTION (Section 15-21, 60, 61) */}
                    {/* ABC Manufacturing: ✓ In My Network (Already saved) */}
                    {/* Nexa Consulting: [ Add to My Network ] (Independently addable) */}
                    <div>
                      {identity.isInNetwork ? (
                        <div
                          className="w-full py-2 px-3 rounded-xl bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
                          aria-label={`${profileData.name} at ${identity.businessName} is in your network`}
                        >
                          <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                          <span>In My Network</span>
                        </div>
                      ) : identity.additionStatus === 'adding' ? (
                        <button
                          disabled
                          className="w-full py-2 px-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-[#94A3B8] text-xs font-semibold flex items-center justify-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#E5A93C]" />
                          <span>Adding to My Network...</span>
                        </button>
                      ) : (
                        <button
                          id={`btn-add-identity-${identity.id}`}
                          onClick={() => handleAddIdentity(identity.id)}
                          className="w-full py-2 px-3 rounded-xl bg-[#E5A93C] hover:bg-[#D49629] text-[#0A0D14] text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-[0.98] shadow-xs cursor-pointer"
                          aria-label={`Add ${profileData.name} at ${identity.businessName} to My Network`}
                        >
                          <span>+ Add to My Network</span>
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* Privacy Distinction Footnote (Section 36, 37) */}
          <div className="pt-2 px-1 text-center">
            <p className="text-[10px] text-[#64748B] leading-relaxed">
              Public business profile • Private notes and tags are managed in your Network Contact Details.
            </p>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* PERSISTENT BOTTOM NAVIGATION (Section 4, 56, 57) */}
      {/* Search remains selected because user is inside the Search navigation branch! */}
      {/* Profile nav is NOT selected (Profile means Shravani's own account area). */}
      {/* ========================================================================= */}
      <nav 
        id="persistent-bottom-navigation"
        className="relative z-20 bg-[#0A0D14]/95 backdrop-blur-md border-t border-white/[0.08] px-3 py-2 flex items-center justify-around shrink-0"
        role="navigation"
        aria-label="Application Bottom Navigation"
      >
        <button
          onClick={onNavigateToHome || onBack}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[#94A3B8] hover:text-white transition-all active:scale-95"
          aria-label="Home"
        >
          <HomeIcon className="w-4 h-4" />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        {/* Search is SELECTED in Amber (Section 4, 56) */}
        <button
          onClick={onBack}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[#E5A93C] font-semibold transition-all relative"
          aria-label="Search (Current branch)"
          aria-current="page"
        >
          <Search className="w-4 h-4" />
          <span className="text-[10px] font-bold">Search</span>
          <span className="w-1 h-1 rounded-full bg-[#E5A93C] absolute -bottom-0.5" />
        </button>

        <button
          onClick={() => {
            if (onNavigateToScan) onNavigateToScan('card');
            else triggerToast('Opening Scanner...');
          }}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[#94A3B8] hover:text-white transition-all active:scale-95"
          aria-label="Scan"
        >
          <ScanLine className="w-4 h-4" />
          <span className="text-[10px] font-medium">Scan</span>
        </button>

        <button
          onClick={onNavigateToMyNetwork || (() => triggerToast('My Network tab'))}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[#94A3B8] hover:text-white transition-all active:scale-95"
          aria-label="My Network"
        >
          <Users className="w-4 h-4" />
          <span className="text-[10px] font-medium">My Network</span>
        </button>

        {/* Profile is NOT selected for Rahul! It represents user's own profile (Section 56, 57) */}
        <button
          onClick={onNavigateToProfile || (() => triggerToast('Your Own Profile'))}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[#94A3B8] hover:text-white transition-all active:scale-95"
          aria-label="My Account Profile"
        >
          <User className="w-4 h-4" />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>
    </div>
  );
};
