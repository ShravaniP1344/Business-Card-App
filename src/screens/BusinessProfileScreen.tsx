import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  Phone,
  Mail,
  Globe,
  MapPin,
  MessageSquare,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Building2,
  Star,
  ExternalLink,
  ChevronRight,
  Sliders,
  Sparkles,
  Home as HomeIcon,
  Search,
  ScanLine,
  Users,
  User,
  X,
  Navigation,
  Check
} from 'lucide-react';
import { DESIGN_TOKENS } from '../design-system/tokens';

export interface AssociatedPerson {
  id: string;
  name: string;
  initials: string;
  role: string;
  avatarColor?: string;
  profilePhoto?: string | null;
  isInNetwork: boolean;
  additionStatus?: 'idle' | 'adding' | 'added' | 'failed';
  phonePreview?: string;
  emailPreview?: string;
}

export interface BusinessReview {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  date?: string;
}

export interface BusinessProfileData {
  id: string;
  businessName: string;
  monogram: string;
  logoUrl?: string | null;
  category: string;
  city: string;
  state: string;
  fullAddress?: string;
  rating: number;
  reviewCount: number;
  description: string;
  services: string[];
  website: string;
  generalPhone: string;
  generalEmail: string;
  hasWhatsApp?: boolean;
  people: AssociatedPerson[];
  reviews: BusinessReview[];
}

interface BusinessProfileScreenProps {
  businessId?: string;
  onBack: () => void;
  onNavigateToHome?: () => void;
  onNavigateToSearch?: () => void;
  onNavigateToScan?: (mode?: 'card' | 'qr') => void;
  onNavigateToMyNetwork?: () => void;
  onNavigateToProfile?: () => void;
  onOpenPersonProfile?: (personId: string, identityId?: string) => void;
  networkState?: Record<string, boolean>;
  onNetworkStateChange?: (personId: string, identityId: string, isInNetwork: boolean) => void;
  isLargeTextMode?: boolean;
}

export const BusinessProfileScreen: React.FC<BusinessProfileScreenProps> = ({
  businessId = 'biz-id-abc',
  onBack,
  onNavigateToHome,
  onNavigateToSearch,
  onNavigateToScan,
  onNavigateToMyNetwork,
  onNavigateToProfile,
  onOpenPersonProfile,
  networkState,
  onNetworkStateChange,
  isLargeTextMode = false,
}) => {
  // Default prototype business data: ABC Manufacturing (Section 4, 10, 18, 20, 29, 65)
  // Rahul Patil is associated as Owner and is ALREADY in My Network (✓ In My Network)
  const defaultABC: BusinessProfileData = {
    id: 'biz-id-abc',
    businessName: 'ABC Manufacturing',
    monogram: 'AM',
    category: 'Manufacturing',
    city: 'Solapur',
    state: 'Maharashtra',
    fullAddress: 'Plot 42, MIDC Industrial Area, Solapur, Maharashtra 413006',
    rating: 4.6,
    reviewCount: 24,
    description: 'Industrial manufacturing and engineering solutions for businesses.',
    services: [
      'Industrial Fabrication',
      'Precision Components',
      'Engineering Solutions',
      'Custom Manufacturing'
    ],
    website: 'abcmanufacturing.in',
    generalPhone: '+91 217 234 5678', // Business landline/general phone (distinct from Rahul's phone!)
    generalEmail: 'contact@abcmanufacturing.in',
    hasWhatsApp: true,
    people: [
      {
        id: 'person-rahul-patil',
        name: 'Rahul Patil',
        initials: 'RP',
        role: 'Owner',
        avatarColor: '#E5A93C',
        isInNetwork: networkState?.['biz-id-abc'] ?? true, // Already saved per spec (Section 21, 24, 65)
        additionStatus: 'added',
        phonePreview: '+91 98220 12345',
        emailPreview: 'rahul@abcmanufacturing.in',
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        reviewerName: 'Neha Kulkarni',
        rating: 5,
        comment: 'Reliable service and good communication.',
        date: '2 weeks ago',
      },
      {
        id: 'rev-2',
        reviewerName: 'Amit Shah',
        rating: 4,
        comment: 'Good experience working with the team.',
        date: '1 month ago',
      }
    ]
  };

  // Multiple people scenario dataset (Rahul Patil + Priya Sharma + Amit Kulkarni)
  const multiplePeopleABC: BusinessProfileData = {
    ...defaultABC,
    people: [
      {
        id: 'person-rahul-patil',
        name: 'Rahul Patil',
        initials: 'RP',
        role: 'Owner',
        avatarColor: '#E5A93C',
        isInNetwork: networkState?.['biz-id-abc'] ?? true,
        additionStatus: 'added',
        phonePreview: '+91 98220 12345',
        emailPreview: 'rahul@abcmanufacturing.in',
      },
      {
        id: 'person-priya-sharma',
        name: 'Priya Sharma',
        initials: 'PS',
        role: 'Sales Manager',
        avatarColor: '#38BDF8',
        isInNetwork: networkState?.['biz-id-abc-priya'] ?? false,
        additionStatus: networkState?.['biz-id-abc-priya'] ? 'added' : 'idle',
        phonePreview: '+91 98220 54321',
        emailPreview: 'priya@abcmanufacturing.in',
      },
      {
        id: 'person-amit-kulkarni',
        name: 'Amit Kulkarni',
        initials: 'AK',
        role: 'Technical Director',
        avatarColor: '#10B981',
        isInNetwork: false,
        additionStatus: 'idle',
        phonePreview: '+91 98220 98765',
        emailPreview: 'amit@abcmanufacturing.in',
      }
    ]
  };

  // Zero people dataset
  const zeroPeopleABC: BusinessProfileData = {
    ...defaultABC,
    people: []
  };

  // Zero reviews dataset
  const zeroReviewsABC: BusinessProfileData = {
    ...defaultABC,
    rating: 0,
    reviewCount: 0,
    reviews: []
  };

  // Long name & text dataset
  const longTextBusiness: BusinessProfileData = {
    ...defaultABC,
    businessName: 'Shree Siddhivinayak Industrial Engineering Solutions Private Limited',
    monogram: 'SS',
    category: 'Industrial Equipment Manufacturing & Turnkey Engineering Services',
    description:
      'We are a leading specialized precision machining, automated conveyor fabrication, and heavy metal engineering enterprise servicing national and international industrial manufacturing plants across Maharashtra and South India. Our state-of-the-art MIDC Solapur facility houses high-precision 5-axis CNC machines and robotic welding systems.',
    services: [
      'Custom Industrial Automation & Control System Integration',
      'High-Precision 5-Axis CNC Milling',
      'Heavy Structural Heavy-Duty Fabrication',
      'Turnkey Factory Commissioning Solutions'
    ]
  };

  // Marathi / Devanagari dataset
  const devanagariBusiness: BusinessProfileData = {
    ...defaultABC,
    businessName: 'एबीसी मॅन्युफॅक्चरिंग',
    monogram: 'एम',
    category: 'औद्योगिक उत्पादन',
    city: 'सोलापूर',
    state: 'महाराष्ट्र',
    fullAddress: 'प्लॉट ४२, एमआयडीसी औद्योगिक क्षेत्र, सोलापूर, महाराष्ट्र',
    description: 'व्यवसायांसाठी औद्योगिक उत्पादन आणि अभियांत्रिकी उपाय.',
    services: [
      'औद्योगिक फॅब्रिकेशन',
      'अचूक घटक',
      'अभियांत्रिकी उपाय',
      'सानुकूल उत्पादन'
    ],
    people: [
      {
        id: 'person-rahul-patil',
        name: 'राहुल पाटील',
        initials: 'रापा',
        role: 'मालक (Owner)',
        avatarColor: '#E5A93C',
        isInNetwork: true,
        additionStatus: 'added',
      }
    ],
    reviews: [
      {
        id: 'rev-1',
        reviewerName: 'नेहा कुलकर्णी',
        rating: 5,
        comment: 'विश्वसनीय सेवा आणि उत्तम संभाषण.',
        date: '२ आठवड्यांपूर्वी',
      }
    ]
  };

  // Scenario state
  type ScenarioType =
    | 'default'
    | 'multiple-people'
    | 'zero-people'
    | 'zero-reviews'
    | 'long-text'
    | 'devanagari'
    | 'loading'
    | 'partial-error'
    | 'unavailable'
    | 'add-failure';

  const [scenario, setScenario] = useState<ScenarioType>('default');
  const [businessData, setBusinessData] = useState<BusinessProfileData>(defaultABC);
  const [showInspector, setShowInspector] = useState<boolean>(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);
  const [hasUserReviewed, setHasUserReviewed] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'info' | 'success' | 'error'>('info');

  const triggerToast = (msg: string, type: 'info' | 'success' | 'error' = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Sync scenario changes
  const applyScenario = (target: ScenarioType) => {
    setScenario(target);
    if (target === 'default') setBusinessData(defaultABC);
    else if (target === 'multiple-people') setBusinessData(multiplePeopleABC);
    else if (target === 'zero-people') setBusinessData(zeroPeopleABC);
    else if (target === 'zero-reviews') setBusinessData(zeroReviewsABC);
    else if (target === 'long-text') setBusinessData(longTextBusiness);
    else if (target === 'devanagari') setBusinessData(devanagariBusiness);
    else if (target === 'loading' || target === 'partial-error' || target === 'unavailable' || target === 'add-failure') {
      setBusinessData(defaultABC);
    }
    triggerToast(`Switched scenario to: ${target}`, 'info');
  };

  // Network state synchronization for associated person
  const handleAddPersonToNetwork = (personId: string, personName: string) => {
    // If testing simulated failure
    if (scenario === 'add-failure') {
      setBusinessData(prev => ({
        ...prev,
        people: prev.people.map(p =>
          p.id === personId ? { ...p, additionStatus: 'adding' } : p
        )
      }));

      setTimeout(() => {
        setBusinessData(prev => ({
          ...prev,
          people: prev.people.map(p =>
            p.id === personId ? { ...p, additionStatus: 'failed', isInNetwork: false } : p
          )
        }));
        triggerToast("Couldn't add to your network. Try again.", 'error');
      }, 500);
      return;
    }

    // Optimistic directional add (no connection request/approval barrier)
    setBusinessData(prev => ({
      ...prev,
      people: prev.people.map(p =>
        p.id === personId ? { ...p, additionStatus: 'adding' } : p
      )
    }));

    setTimeout(() => {
      setBusinessData(prev => ({
        ...prev,
        people: prev.people.map(p =>
          p.id === personId
            ? { ...p, additionStatus: 'added', isInNetwork: true }
            : p
        )
      }));

      if (onNetworkStateChange) {
        onNetworkStateChange(personId, 'biz-id-abc', true);
      }

      triggerToast(`Added ${personName} @ ABC Manufacturing to your network`, 'success');
    }, 450);
  };

  // Render Stars Helper
  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${
            i <= Math.floor(rating)
              ? 'text-[#E5A93C] fill-[#E5A93C]'
              : i - rating < 1 && i - rating > 0
              ? 'text-[#E5A93C] fill-[#E5A93C]/40'
              : 'text-[#475569]'
          }`}
          aria-hidden="true"
        />
      );
    }
    return stars;
  };

  return (
    <div
      id="screen-18-business-profile"
      className="relative flex flex-col h-full w-full bg-[#0A0D14] text-[#F8FAFC] select-none overflow-hidden"
    >
      {/* Dynamic Toast Feedback */}
      {toastMessage && (
        <div
          className={`absolute top-14 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 rounded-full backdrop-blur-md border text-[11px] font-medium shadow-xl flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200 ${
            toastType === 'error'
              ? 'bg-[#EF4444]/95 border-[#EF4444]/30 text-white'
              : toastType === 'success'
              ? 'bg-[#10B981]/95 border-[#10B981]/30 text-white'
              : 'bg-[#182030]/95 border-white/[0.15] text-[#F8FAFC]'
          }`}
          role="status"
          aria-live="polite"
        >
          {toastType === 'error' ? (
            <AlertCircle className="w-3.5 h-3.5 text-white shrink-0" />
          ) : toastType === 'success' ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-[#E5A93C] shrink-0" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TOP APP BAR (Section 2, 38) */}
      {/* Back arrow | "Business" | Top-right Share */}
      {/* ========================================================================= */}
      <header className="relative z-20 bg-[#0A0D14]/95 backdrop-blur-md border-b border-white/[0.06] px-4 pt-3 pb-2.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-white/[0.06] transition-colors active:scale-95"
            aria-label="Back to previous screen"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <span className="text-[13px] font-semibold text-white/90">
            {scenario === 'devanagari' ? 'व्यवसाय (Business)' : 'Business'}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Share Business Profile (Section 38 - Shares ABC Manufacturing public profile, NOT Rahul's card) */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: businessData.businessName,
                  text: `${businessData.businessName} - ${businessData.category} in ${businessData.city}, ${businessData.state}`,
                  url: `https://${businessData.website}`
                }).catch(() => {});
              } else {
                triggerToast(`Copied public link for ${businessData.businessName}`, 'success');
              }
            }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#94A3B8] hover:text-[#E5A93C] hover:bg-white/[0.06] transition-colors active:scale-95"
            title={`Share ${businessData.businessName}`}
            aria-label={`Share ${businessData.businessName}`}
          >
            <Share2 className="w-4 h-4" />
          </button>

          {/* Prototype Inspector & Scenario Toggle */}
          <button
            onClick={() => setShowInspector(!showInspector)}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
              showInspector
                ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-[#E5A93C]'
                : 'bg-[#121722] border-white/[0.08] text-[#94A3B8] hover:text-white'
            }`}
            title="Screen 18 Prototype Scenarios & Verification"
            aria-label="Toggle Screen 18 scenario inspector"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* PROTOTYPE INSPECTOR DRAWER */}
      {/* Allows testing edge cases: Multiple people, 0 people, 0 reviews, long text, मराठी, loading, errors */}
      {/* ========================================================================= */}
      {showInspector && (
        <div className="relative z-30 bg-[#141B29] border-b border-white/[0.12] p-3 shadow-2xl animate-in slide-in-from-top duration-200 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                Screen 18 Test Scenarios
              </span>
            </div>
            <button
              onClick={() => setShowInspector(false)}
              className="text-[#94A3B8] hover:text-white text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[10.5px]">
            <button
              onClick={() => applyScenario('default')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'default'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Default: ABC (Rahul Saved)
            </button>

            <button
              onClick={() => applyScenario('multiple-people')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'multiple-people'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Multiple People (+Priya Sharma)
            </button>

            <button
              onClick={() => applyScenario('zero-people')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'zero-people'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              0 People (No Reps Yet)
            </button>

            <button
              onClick={() => applyScenario('zero-reviews')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'zero-reviews'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              0 Reviews (Be First)
            </button>

            <button
              onClick={() => applyScenario('long-text')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'long-text'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Long Names & Read More
            </button>

            <button
              onClick={() => applyScenario('devanagari')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'devanagari'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              मराठी (Devanagari)
            </button>

            <button
              onClick={() => applyScenario('loading')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'loading'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Skeleton Loading
            </button>

            <button
              onClick={() => applyScenario('partial-error')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'partial-error'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Partial Failure (Reviews)
            </button>

            <button
              onClick={() => applyScenario('unavailable')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'unavailable'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Business Unavailable
            </button>

            <button
              onClick={() => applyScenario('add-failure')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'add-failure'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Simulate Add Fail
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA */}
      {/* ========================================================================= */}
      {scenario === 'unavailable' ? (
        /* 1. BUSINESS UNAVAILABLE STATE (Section 53) */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#121722] border border-white/[0.08] flex items-center justify-center text-[#94A3B8] mb-3">
            <Building2 className="w-7 h-7" />
          </div>
          <h2 className="text-base font-bold text-white mb-1">
            This business is no longer available.
          </h2>
          <p className="text-xs text-[#94A3B8] max-w-xs mb-5">
            The requested business profile has been removed or deactivated by its administrators.
          </p>
          <button
            onClick={onBack}
            className="px-4 py-2 rounded-xl bg-[#182030] hover:bg-[#202B40] text-white border border-white/[0.1] text-xs font-semibold transition-all active:scale-95"
          >
            Go Back
          </button>
        </div>
      ) : scenario === 'loading' ? (
        /* 2. SKELETON LOADING STATE (Section 50) */
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Hero skeleton */}
          <div className="flex flex-col items-center gap-2 pt-2 pb-3">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.06] animate-pulse" />
            <div className="w-48 h-5 rounded-md bg-white/[0.06] animate-pulse mt-1" />
            <div className="w-32 h-3.5 rounded bg-white/[0.04] animate-pulse" />
            <div className="w-24 h-4 rounded bg-white/[0.04] animate-pulse mt-1" />
          </div>
          {/* Quick actions skeleton */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-14 rounded-xl bg-white/[0.04] animate-pulse" />
            ))}
          </div>
          {/* About skeleton */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-2">
            <div className="w-20 h-3 rounded bg-white/[0.06] animate-pulse" />
            <div className="w-full h-3 rounded bg-white/[0.04] animate-pulse" />
            <div className="w-4/5 h-3 rounded bg-white/[0.04] animate-pulse" />
          </div>
          {/* People skeleton */}
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-3">
            <div className="w-36 h-3 rounded bg-white/[0.06] animate-pulse" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] animate-pulse" />
              <div className="flex-1 space-y-1.5">
                <div className="w-28 h-3.5 rounded bg-white/[0.06] animate-pulse" />
                <div className="w-16 h-3 rounded bg-white/[0.04] animate-pulse" />
              </div>
              <div className="w-20 h-7 rounded-lg bg-white/[0.04] animate-pulse" />
            </div>
          </div>
        </div>
      ) : (
        /* 3. NORMAL BUSINESS PROFILE CONTENT */
        <main className="flex-1 overflow-y-auto px-4 py-3 space-y-5">
          {/* ======================================================================= */}
          {/* BUSINESS HERO (Section 4, 5, 6, 7, 8, 45, 46) */}
          {/* Compact professional business header. Business name is strongest element. */}
          {/* No random corporate stock image. No fake verification badge. */}
          {/* Rating belongs to ABC Manufacturing, NEVER Rahul! */}
          {/* ======================================================================= */}
          <section
            aria-labelledby="heading-business-name"
            className="flex flex-col items-center text-center pt-1 pb-1"
          >
            {/* Business Logo / Initials Monogram (Section 5) */}
            <div
              className="w-16 h-16 rounded-2xl bg-[#182030] border-2 border-white/[0.14] text-xl font-bold flex items-center justify-center text-[#E5A93C] shadow-md mb-2.5 transition-transform"
              aria-hidden="true"
            >
              {businessData.monogram}
            </div>

            {/* Business Name (Semantic H1 - Strongest Element) */}
            <h1
              id="heading-business-name"
              className="text-lg font-bold text-white tracking-tight leading-snug px-2 max-w-sm"
            >
              {businessData.businessName}
            </h1>

            {/* Category & Location */}
            <p className="text-[12px] font-medium text-[#94A3B8] mt-1 flex items-center justify-center gap-1.5 flex-wrap">
              <span className="text-white/90">{businessData.category}</span>
              <span className="text-[#64748B]">•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#E5A93C] shrink-0" />
                <span>{businessData.city}, {businessData.state}</span>
              </span>
            </p>

            {/* Business Rating & Review Count (Section 7, 8, 60) */}
            {/* Announced as "4.6 out of 5, based on 24 reviews for ABC Manufacturing" */}
            {businessData.reviewCount > 0 ? (
              <a
                href="#reviews-section"
                className="mt-2 inline-flex items-center gap-1.5 bg-[#182030] hover:bg-[#1E293B] border border-white/[0.1] px-2.5 py-1 rounded-full text-[11px] font-medium transition-all group active:scale-95"
                aria-label={`${businessData.rating} out of 5 stars, based on ${businessData.reviewCount} reviews for ${businessData.businessName}`}
              >
                <div className="flex items-center gap-0.5 text-[#E5A93C]">
                  <Star className="w-3 h-3 fill-[#E5A93C]" />
                  <span className="font-bold text-white ml-0.5">{businessData.rating}</span>
                </div>
                <span className="text-[#64748B]">•</span>
                <span className="text-[#94A3B8] group-hover:text-white transition-colors">
                  {businessData.reviewCount} {scenario === 'devanagari' ? 'पुनरावलोकने' : 'reviews'}
                </span>
                <ChevronRight className="w-3 h-3 text-[#64748B] group-hover:text-white" />
              </a>
            ) : (
              <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/[0.04] text-[10.5px] text-[#94A3B8]">
                <span>{scenario === 'devanagari' ? 'अद्याप पुनरावलोकने नाहीत' : 'No reviews yet'}</span>
              </div>
            )}
          </section>

          {/* ======================================================================= */}
          {/* PRIMARY QUICK ACTIONS (Section 9, 10, 11, 12, 57) */}
          {/* Call (business general phone) | WhatsApp | Website | Directions */}
          {/* NOTE: No "Add to My Network" for the business itself! (Section 9, 71) */}
          {/* ======================================================================= */}
          <section aria-label="Business Quick Actions">
            <div className="grid grid-cols-4 gap-2">
              {/* 1. CALL (Uses business general phone +91 217 234 5678, NOT Rahul's phone! - Section 10, 11) */}
              <button
                onClick={() => {
                  triggerToast(`Calling ${businessData.businessName}: ${businessData.generalPhone}`, 'info');
                }}
                className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-[#121722] hover:bg-[#182030] border border-white/[0.08] hover:border-[#E5A93C]/40 text-white transition-all active:scale-95 group"
                aria-label={`Call ${businessData.businessName} at ${businessData.generalPhone}`}
              >
                <div className="w-8 h-8 rounded-full bg-[#182030] group-hover:bg-[#E5A93C]/20 border border-white/[0.08] flex items-center justify-center text-[#E5A93C] transition-colors">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-medium text-white/90">
                  {scenario === 'devanagari' ? 'कॉल' : 'Call'}
                </span>
              </button>

              {/* 2. WHATSAPP (Only if available - Section 11, 12) */}
              {businessData.hasWhatsApp ? (
                <button
                  onClick={() => {
                    triggerToast(`Opening WhatsApp for ${businessData.businessName}...`, 'info');
                  }}
                  className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-[#121722] hover:bg-[#182030] border border-white/[0.08] hover:border-[#10B981]/40 text-white transition-all active:scale-95 group"
                  aria-label={`Message ${businessData.businessName} on WhatsApp`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#182030] group-hover:bg-[#10B981]/20 border border-white/[0.08] flex items-center justify-center text-[#10B981] transition-colors">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-medium text-white/90">
                    WhatsApp
                  </span>
                </button>
              ) : null}

              {/* 3. WEBSITE */}
              {businessData.website ? (
                <button
                  onClick={() => {
                    triggerToast(`Navigating to https://${businessData.website}`, 'info');
                  }}
                  className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-[#121722] hover:bg-[#182030] border border-white/[0.08] hover:border-[#38BDF8]/40 text-white transition-all active:scale-95 group"
                  aria-label={`Visit ${businessData.businessName} website`}
                >
                  <div className="w-8 h-8 rounded-full bg-[#182030] group-hover:bg-[#38BDF8]/20 border border-white/[0.08] flex items-center justify-center text-[#38BDF8] transition-colors">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[11px] font-medium text-white/90">
                    {scenario === 'devanagari' ? 'वेबसाइट' : 'Website'}
                  </span>
                </button>
              ) : null}

              {/* 4. DIRECTIONS */}
              <button
                onClick={() => {
                  triggerToast(`Opening directions to ${businessData.city}, ${businessData.state}`, 'info');
                }}
                className="flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl bg-[#121722] hover:bg-[#182030] border border-white/[0.08] hover:border-[#E5A93C]/40 text-white transition-all active:scale-95 group"
                aria-label={`Get directions to ${businessData.businessName}`}
              >
                <div className="w-8 h-8 rounded-full bg-[#182030] group-hover:bg-[#E5A93C]/20 border border-white/[0.08] flex items-center justify-center text-[#E5A93C] transition-colors">
                  <Navigation className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-medium text-white/90">
                  {scenario === 'devanagari' ? 'दिशानिर्देश' : 'Directions'}
                </span>
              </button>
            </div>
          </section>

          {/* ======================================================================= */}
          {/* ABOUT SECTION (Section 13, 47) */}
          {/* Supports clean 3-5 line preview with Read more / Show less */}
          {/* ======================================================================= */}
          <section aria-labelledby="heading-about" className="space-y-1.5">
            <h2
              id="heading-about"
              className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider"
            >
              {scenario === 'devanagari' ? 'माहिती (About)' : 'About'}
            </h2>
            <div className="text-[12.5px] leading-relaxed text-white/90 font-normal">
              <p className={!isDescriptionExpanded && businessData.description.length > 140 ? 'line-clamp-3' : ''}>
                {businessData.description}
              </p>
              {businessData.description.length > 140 && (
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="text-[#E5A93C] text-[11px] font-semibold hover:underline mt-1 focus:outline-none"
                >
                  {isDescriptionExpanded
                    ? (scenario === 'devanagari' ? 'कमी दाखवा (Show less)' : 'Show less')
                    : (scenario === 'devanagari' ? 'अधिक वाचा (Read more)' : 'Read more')}
                </button>
              )}
            </div>
          </section>

          {/* ======================================================================= */}
          {/* SERVICES SECTION (Section 14, 15, 48) */}
          {/* Representative service chips belonging to BUSINESS, not to Rahul personally! */}
          {/* ======================================================================= */}
          {businessData.services && businessData.services.length > 0 && (
            <section aria-labelledby="heading-services" className="space-y-2">
              <h2
                id="heading-services"
                className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider"
              >
                {scenario === 'devanagari' ? 'सेवा (Services)' : 'Services'}
              </h2>
              <div className="flex flex-wrap gap-1.5">
                {businessData.services.map((service, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-1 rounded-lg bg-[#121722] border border-white/[0.08] text-[11px] text-white/90 font-medium leading-snug"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* ======================================================================= */}
          {/* PEOPLE AT ABC MANUFACTURING — CRITICAL (Section 20, 21, 22, 23, 24, 25, 26, 63, 64) */}
          {/* How the business connects to people/networking. Prominent placement. */}
          {/* Rahul Patil (Owner) is ALREADY in My Network: shows ✓ In My Network */}
          {/* Tapping Rahul opens Rahul's Person Profile (Screen 17) */}
          {/* If other members exist (e.g. Priya Sharma), provides [+ Add] to My Network */}
          {/* ======================================================================= */}
          <section aria-labelledby="heading-people" className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <h2
                id="heading-people"
                className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5"
              >
                <Users className="w-3.5 h-3.5 text-[#E5A93C]" />
                <span>
                  {scenario === 'devanagari'
                    ? `${businessData.businessName} मधील लोक`
                    : `People at ${businessData.businessName}`}
                </span>
              </h2>
              {businessData.people.length > 0 && (
                <span className="text-[10.5px] text-[#64748B]">
                  {businessData.people.length} {businessData.people.length === 1 ? 'member' : 'members'}
                </span>
              )}
            </div>

            {businessData.people.length === 0 ? (
              /* Graceful state: No public representatives yet (Section 28) */
              <div className="p-4 rounded-xl bg-[#121722] border border-white/[0.06] text-center">
                <p className="text-xs text-white/80 font-medium">
                  {scenario === 'devanagari'
                    ? 'अद्याप कोणतेही सार्वजनिक प्रतिनिधी नाहीत.'
                    : 'No public representatives yet.'}
                </p>
                <p className="text-[10.5px] text-[#64748B] mt-0.5">
                  Associated team members will appear here once their business identity is published.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {businessData.people.map(person => (
                  <article
                    key={person.id}
                    id={`person-card-${person.id}`}
                    className="p-3 rounded-xl bg-[#121722] border border-white/[0.08] flex items-center justify-between gap-3 hover:border-white/[0.14] transition-all group"
                  >
                    {/* Person Avatar + Name + Designation (Tappable to Person Profile - Section 25, 26) */}
                    <button
                      onClick={() => {
                        if (onOpenPersonProfile) {
                          onOpenPersonProfile(person.id, businessData.id);
                        } else {
                          triggerToast(`Opening ${person.name}'s Person Profile`, 'info');
                        }
                      }}
                      className="flex items-center gap-2.5 min-w-0 flex-1 text-left active:opacity-80"
                      aria-label={`View ${person.name}'s person profile`}
                    >
                      {/* Initials Avatar */}
                      <div
                        className="w-10 h-10 rounded-xl bg-[#182030] border border-white/[0.12] text-xs font-bold flex items-center justify-center shrink-0 group-hover:border-[#E5A93C]/40 transition-colors"
                        style={{ color: person.avatarColor || '#E5A93C' }}
                      >
                        {person.initials}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1">
                          <span className="text-[13px] font-bold text-white group-hover:text-[#E5A93C] transition-colors truncate">
                            {person.name}
                          </span>
                          <ChevronRight className="w-3 h-3 text-[#64748B] group-hover:text-white shrink-0" />
                        </div>
                        <div className="text-[11px] font-medium text-[#94A3B8] truncate mt-0.5">
                          {person.role}
                        </div>
                      </div>
                    </button>

                    {/* Network Action (Section 21, 23, 24, 71) */}
                    {/* If Rahul @ ABC is saved: shows ✓ In My Network */}
                    {/* If other person is NOT saved: shows [+ Add] */}
                    <div className="shrink-0">
                      {person.isInNetwork ? (
                        <span
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-[10.5px] font-semibold"
                          title={`${person.name} @ ${businessData.businessName} is in your network`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>In My Network</span>
                        </span>
                      ) : person.additionStatus === 'adding' ? (
                        <button
                          disabled
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.06] text-[#94A3B8] text-[10.5px] font-medium border border-white/[0.08]"
                        >
                          <RefreshCw className="w-3 h-3 animate-spin text-[#E5A93C]" />
                          <span>Adding...</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddPersonToNetwork(person.id, person.name)}
                          className="px-2.5 py-1 rounded-lg bg-[#E5A93C]/15 hover:bg-[#E5A93C] text-[#E5A93C] hover:text-[#0A0D14] border border-[#E5A93C]/30 text-[10.5px] font-semibold transition-all active:scale-95"
                          aria-label={`Add ${person.name} at ${businessData.businessName} to My Network`}
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          {/* ======================================================================= */}
          {/* LOCATION & GENERAL CONTACT SECTION (Section 16, 17, 18, 69) */}
          {/* General business phone (+91 217 234 5678), email, and website. */}
          {/* Distinct from Rahul's person-at-business contact info! */}
          {/* ======================================================================= */}
          <section aria-labelledby="heading-contact" className="space-y-2.5 pt-1">
            <h2
              id="heading-contact"
              className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider"
            >
              {scenario === 'devanagari' ? 'संपर्क आणि स्थान' : 'Contact & Location'}
            </h2>

            <div className="p-3.5 rounded-xl bg-[#121722] border border-white/[0.08] space-y-3">
              {/* Address */}
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase font-bold text-[#64748B]">
                    Location
                  </div>
                  <div className="text-[12px] text-white/90 font-medium mt-0.5 leading-snug">
                    {businessData.fullAddress || `${businessData.city}, ${businessData.state}`}
                  </div>
                </div>
              </div>

              {/* General Business Phone */}
              <div className="flex items-start gap-2.5 pt-2 border-t border-white/[0.04]">
                <Phone className="w-4 h-4 text-[#64748B] shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase font-bold text-[#64748B]">
                    Business Phone
                  </div>
                  <div className="text-[12px] text-white/90 font-mono mt-0.5">
                    {businessData.generalPhone}
                  </div>
                </div>
              </div>

              {/* General Business Email */}
              <div className="flex items-start gap-2.5 pt-2 border-t border-white/[0.04]">
                <Mail className="w-4 h-4 text-[#64748B] shrink-0 mt-0.5" />
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase font-bold text-[#64748B]">
                    Business Email
                  </div>
                  <div className="text-[12px] text-white/90 font-mono mt-0.5 truncate">
                    {businessData.generalEmail}
                  </div>
                </div>
              </div>

              {/* Website */}
              {businessData.website && (
                <div className="flex items-start gap-2.5 pt-2 border-t border-white/[0.04]">
                  <Globe className="w-4 h-4 text-[#64748B] shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase font-bold text-[#64748B]">
                      Website
                    </div>
                    <div className="text-[12px] text-[#38BDF8] font-medium mt-0.5 truncate hover:underline cursor-pointer">
                      {businessData.website}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ======================================================================= */}
          {/* REVIEWS SECTION (Section 29, 30, 31, 32, 33, 34, 35, 36, 51, 55, 70) */}
          {/* Reviews belong strictly to ABC Manufacturing & Reviewer, NOT Rahul! */}
          {/* Summary: 4.6 ★★★★★ 24 reviews */}
          {/* 2 recent reviews: Neha Kulkarni (5★) & Amit Shah (4★) */}
          {/* Actions: [Write a Review] and [View All Reviews] */}
          {/* ======================================================================= */}
          <section id="reviews-section" aria-labelledby="heading-reviews" className="space-y-3 pt-1 pb-4">
            <div className="flex items-center justify-between">
              <h2
                id="heading-reviews"
                className="text-[11px] font-bold text-white uppercase tracking-wider flex items-center gap-1.5"
              >
                <Star className="w-3.5 h-3.5 text-[#E5A93C]" />
                <span>{scenario === 'devanagari' ? 'पुनरावलोकने (Reviews)' : 'Reviews'}</span>
              </h2>
              {businessData.reviewCount > 0 && (
                <span className="text-[10.5px] text-[#94A3B8]">
                  {businessData.reviewCount} {businessData.reviewCount === 1 ? 'review' : 'reviews'}
                </span>
              )}
            </div>

            {/* PARTIAL ERROR: Reviews fail to load (Section 51) */}
            {scenario === 'partial-error' ? (
              <div className="p-4 rounded-xl bg-[#121722] border border-[#EF4444]/30 text-center space-y-2">
                <AlertCircle className="w-5 h-5 text-[#EF4444] mx-auto" />
                <p className="text-xs text-white font-medium">Couldn't load reviews.</p>
                <button
                  onClick={() => applyScenario('default')}
                  className="px-3 py-1 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-xs text-white border border-white/[0.1] font-medium"
                >
                  Try Again
                </button>
              </div>
            ) : businessData.reviews.length === 0 ? (
              /* EMPTY REVIEWS STATE (Section 35) */
              <div className="p-4 rounded-xl bg-[#121722] border border-white/[0.06] text-center space-y-2">
                <p className="text-xs text-white/90 font-medium">No reviews yet.</p>
                <p className="text-[10.5px] text-[#64748B]">Be the first to share your experience.</p>
                <button
                  onClick={() => {
                    setHasUserReviewed(true);
                    triggerToast('Review submission dialog opens here (V2)', 'info');
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#E5A93C]/15 hover:bg-[#E5A93C] text-[#E5A93C] hover:text-[#0A0D14] border border-[#E5A93C]/30 text-xs font-semibold transition-all active:scale-95"
                >
                  Write a Review
                </button>
              </div>
            ) : (
              /* NORMAL REVIEWS CONTENT */
              <div className="space-y-3">
                {/* Rating Summary Card (Section 29) */}
                <div className="p-3.5 rounded-xl bg-[#121722] border border-white/[0.08] flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-white tracking-tight">
                        {businessData.rating}
                      </span>
                      <div className="flex items-center gap-0.5" aria-hidden="true">
                        {renderStars(businessData.rating)}
                      </div>
                    </div>
                    <p className="text-[10.5px] text-[#94A3B8] mt-0.5">
                      Based on {businessData.reviewCount} customer reviews
                    </p>
                  </div>

                  {/* Write/Edit Review Button (Section 32, 34) */}
                  <button
                    onClick={() => {
                      setHasUserReviewed(true);
                      triggerToast('Review submission form opens here (V2)', 'info');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#182030] hover:bg-[#202B40] text-white border border-white/[0.12] hover:border-[#E5A93C]/40 text-[11px] font-semibold transition-all active:scale-95 shrink-0"
                  >
                    {hasUserReviewed ? 'Edit Your Review' : 'Write a Review'}
                  </button>
                </div>

                {/* 2 Recent Reviews (Section 29, 30) */}
                <div className="space-y-2">
                  {businessData.reviews.map(rev => (
                    <article
                      key={rev.id}
                      className="p-3 rounded-xl bg-[#121722] border border-white/[0.06] space-y-1.5"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[12px] font-bold text-white">
                            {rev.reviewerName}
                          </span>
                          {rev.date && (
                            <span className="text-[10px] text-[#64748B]">• {rev.date}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-0.5">
                          {renderStars(rev.rating)}
                        </div>
                      </div>
                      <p className="text-[11.5px] text-white/80 leading-snug">
                        "{rev.comment}"
                      </p>
                    </article>
                  ))}
                </div>

                {/* View All Reviews Button (Section 36) */}
                <div className="text-center pt-1">
                  <button
                    onClick={() => {
                      triggerToast(`Opening all ${businessData.reviewCount} reviews for ${businessData.businessName}`, 'info');
                    }}
                    className="text-[11.5px] font-semibold text-[#E5A93C] hover:underline"
                  >
                    View All {businessData.reviewCount} Reviews →
                  </button>
                </div>
              </div>
            )}
          </section>
        </main>
      )}

      {/* ========================================================================= */}
      {/* PERSISTENT BOTTOM NAVIGATION (Section 3, 56, 66) */}
      {/* Persistent bottom navigation preserves originating branch (Search is selected). */}
      {/* Profile tab is NOT selected (Profile means Shravani's own account area). */}
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

        {/* Search is SELECTED in Amber because user is in the Search/Discovery branch (Section 3) */}
        <button
          onClick={onNavigateToSearch || onBack}
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

        {/* Profile is NOT selected! Profile represents user's own profile (Section 3) */}
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
