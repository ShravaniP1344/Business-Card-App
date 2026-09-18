import React, { useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Phone,
  Mail,
  Globe,
  MessageSquare,
  Building2,
  ExternalLink,
  UserPlus,
  QrCode,
  AlertCircle,
  RefreshCw,
  WifiOff,
  Clock,
  ShieldCheck,
  UserCheck,
  Share2,
  ChevronRight,
  Sparkles,
  Layers,
  HelpCircle,
  Sliders
} from 'lucide-react';
import { DESIGN_TOKENS } from '../design-system/tokens';

export interface ScannedBusinessIdentity {
  id: string;
  userId: string; // e.g., 'user-shravani'
  businessId: string; // e.g., 'biz-aikyam'
  personName: string;
  initials: string;
  profilePhoto?: string | null;
  designation: string;
  businessName: string;
  businessInitials: string;
  category: string;
  city: string;
  state: string;
  businessPhone?: string;
  businessEmail?: string;
  website?: string;
  isRegisteredPlatformUser: boolean;
}

export type QRScanResultState =
  | 'found_not_saved'   // Default scanned identity, awaiting user Add
  | 'adding'            // Add tapped, saving to network
  | 'added'             // Successfully added
  | 'already_saved'     // Exact user + business identity already in My Network
  | 'self_identity'     // User scanned their own QR code
  | 'invalid'           // Not a valid platform business identity QR
  | 'malformed'         // Couldn't read QR payload
  | 'expired'           // QR token expired or revoked
  | 'unavailable'       // Identity deactivated or removed
  | 'offline'           // Device offline when resolving
  | 'load_error'        // Failed to load identity profile
  | 'add_error'         // Failed to save to network (preserves identity)
  | 'resolving';        // Skeleton resolving state

interface QRScanResultScreenProps {
  onBackToScanner: (mode?: 'card' | 'qr') => void;
  onViewInMyNetwork: (contactId: string) => void;
  onViewFullPersonProfile?: (personId: string) => void;
  onViewBusinessProfile?: (businessId: string) => void;
  onViewMyQr?: () => void;
  onScanAnother: () => void;
  currentUserId?: string;
  initialIdentity?: ScannedBusinessIdentity;
  isInitiallyInNetwork?: boolean;
  onNetworkAddSuccess?: (identity: ScannedBusinessIdentity) => void;
  isLargeTextMode?: boolean;
}

export const QRScanResultScreen: React.FC<QRScanResultScreenProps> = ({
  onBackToScanner,
  onViewInMyNetwork,
  onViewFullPersonProfile,
  onViewBusinessProfile,
  onViewMyQr,
  onScanAnother,
  currentUserId = 'user-current-session',
  initialIdentity,
  isInitiallyInNetwork = false,
  onNetworkAddSuccess,
  isLargeTextMode = false,
}) => {
  // 1. DEFAULT SCANNED IDENTITY (Shravani Pasnur @ Aikyam AI Systems)
  const defaultIdentity: ScannedBusinessIdentity = {
    id: 'identity-shravani-aikyam',
    userId: 'user-shravani',
    businessId: 'biz-aikyam',
    personName: 'Shravani Pasnur',
    initials: 'SP',
    profilePhoto: null,
    designation: 'Software Engineer',
    businessName: 'Aikyam AI Systems',
    businessInitials: 'AI',
    category: 'Technology',
    city: 'Solapur',
    state: 'Maharashtra',
    businessPhone: '+91 98765 43210',
    businessEmail: 'shravani@aikyam.ai',
    website: 'aikyam.ai',
    isRegisteredPlatformUser: true,
  };

  // State
  const [identity, setIdentity] = useState<ScannedBusinessIdentity>(initialIdentity || defaultIdentity);
  const [state, setState] = useState<QRScanResultState>(
    isInitiallyInNetwork ? 'already_saved' : 'found_not_saved'
  );
  const [showInspector, setShowInspector] = useState<boolean>(false);
  const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

  // Handle "Add to My Network"
  const handleAddToNetwork = () => {
    if (state === 'adding' || state === 'added' || state === 'already_saved') return;

    setState('adding');

    // Simulate reliable fast backend add without blocking UI
    setTimeout(() => {
      setState('added');
      if (onNetworkAddSuccess) {
        onNetworkAddSuccess(identity);
      }
    }, 600);
  };

  // Handle retry from add error
  const handleRetryAdd = () => {
    setState('adding');
    setTimeout(() => {
      setState('added');
      if (onNetworkAddSuccess) {
        onNetworkAddSuccess(identity);
      }
    }, 600);
  };

  // Handle copy helper
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard?.writeText(text);
    setCopyFeedback(`${label} copied`);
    setTimeout(() => setCopyFeedback(null), 2000);
  };

  // Preset scenarios for evaluator inspection
  const loadScenario = (scenarioKey: string) => {
    switch (scenarioKey) {
      case 'default':
        setIdentity(defaultIdentity);
        setState('found_not_saved');
        break;
      case 'added_success':
        setIdentity(defaultIdentity);
        setState('added');
        break;
      case 'already_in_network':
        setIdentity(defaultIdentity);
        setState('already_saved');
        break;
      case 'same_person_diff_biz':
        // Shravani Pasnur representing Pasnur Industries
        setIdentity({
          id: 'identity-shravani-pasnur-ind',
          userId: 'user-shravani',
          businessId: 'biz-pasnur-industries',
          personName: 'Shravani Pasnur',
          initials: 'SP',
          profilePhoto: null,
          designation: 'Owner',
          businessName: 'Pasnur Industries',
          businessInitials: 'PI',
          category: 'Textile & Manufacturing',
          city: 'Solapur',
          state: 'Maharashtra',
          businessPhone: '+91 94220 54321',
          businessEmail: 'contact@pasnurindustries.in',
          website: 'pasnurindustries.in',
          isRegisteredPlatformUser: true,
        });
        setState('found_not_saved');
        break;
      case 'self_scan':
        setIdentity(defaultIdentity);
        setState('self_identity');
        break;
      case 'long_names':
        setIdentity({
          id: 'identity-long-name',
          userId: 'user-shrinivas',
          businessId: 'biz-siddhivinayak',
          personName: 'Shrinivas Venkateshwara Rao Kulkarni',
          initials: 'SK',
          profilePhoto: null,
          designation: 'Senior Business Development & Strategic Partnerships Manager',
          businessName: 'Shree Siddhivinayak Industrial Engineering Solutions Private Limited',
          businessInitials: 'SS',
          category: 'Heavy Engineering & Industrial Fabrication',
          city: 'Solapur MIDC Chincholi',
          state: 'Maharashtra',
          businessPhone: '+91 98224 87654',
          businessEmail: 's.v.kulkarni@siddhivinayak-engineering.co.in',
          website: 'siddhivinayak-engineering.co.in',
          isRegisteredPlatformUser: true,
        });
        setState('found_not_saved');
        break;
      case 'devanagari':
        setIdentity({
          id: 'identity-devanagari',
          userId: 'user-shravani',
          businessId: 'biz-aikyam',
          personName: 'श्रावणी पसनूर',
          initials: 'शप',
          profilePhoto: null,
          designation: 'सॉफ्टवेअर इंजिनिअर',
          businessName: 'Aikyam AI Systems',
          businessInitials: 'AI',
          category: 'माहिती तंत्रज्ञान (Technology)',
          city: 'सोलापूर',
          state: 'महाराष्ट्र',
          businessPhone: '+91 98765 43210',
          businessEmail: 'shravani@aikyam.ai',
          website: 'aikyam.ai',
          isRegisteredPlatformUser: true,
        });
        setState('found_not_saved');
        break;
      case 'missing_fields':
        setIdentity({
          id: 'identity-minimal',
          userId: 'user-minimal',
          businessId: 'biz-minimal',
          personName: 'Vikram Joshi',
          initials: 'VJ',
          profilePhoto: null,
          designation: 'Independent Consultant',
          businessName: 'Joshi Advisory Services',
          businessInitials: 'JA',
          category: 'Financial Consulting',
          city: 'Pune',
          state: 'Maharashtra',
          // Phone, email, website omitted
          businessPhone: undefined,
          businessEmail: 'vikram@joshiconsult.in',
          website: undefined,
          isRegisteredPlatformUser: true,
        });
        setState('found_not_saved');
        break;
      case 'invalid_qr':
        setState('invalid');
        break;
      case 'malformed_qr':
        setState('malformed');
        break;
      case 'expired_qr':
        setState('expired');
        break;
      case 'unavailable_identity':
        setState('unavailable');
        break;
      case 'offline':
        setState('offline');
        break;
      case 'load_error':
        setState('load_error');
        break;
      case 'add_error':
        setIdentity(defaultIdentity);
        setState('add_error');
        break;
      case 'resolving':
        setState('resolving');
        break;
      default:
        break;
    }
  };

  return (
    <div
      id="screen22-qr-scan-result"
      className="relative flex flex-col h-full w-full bg-[#0A0D14] text-white select-none overflow-hidden"
    >
      {/* ============================================================= */}
      {/* 1. TOP APP BAR (Back Button + "Business Identity")            */}
      {/* ============================================================= */}
      <header className="shrink-0 h-14 px-4 flex items-center justify-between border-b border-white/[0.08] bg-[#0A0D14]/95 backdrop-blur-md z-20">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => onBackToScanner('qr')}
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-white/[0.08] active:scale-95 transition-all touch-manipulation"
            aria-label="Back to QR scanner"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-tight">
              Business Identity
            </h1>
            <p className="text-[10px] text-[#64748B] font-medium leading-none mt-0.5">
              Platform QR Result
            </p>
          </div>
        </div>

        {/* Top Right: Inspector Toggle & Status */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setShowInspector(!showInspector)}
            className={`px-2 py-1 rounded-full text-[10px] font-medium flex items-center gap-1 transition-all ${
              showInspector
                ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold shadow-xs'
                : 'bg-[#141B29] text-[#94A3B8] hover:text-white border border-white/[0.1]'
            }`}
            title="Toggle Scenario Inspector"
          >
            <Sliders className="w-3 h-3" />
            <span className="hidden sm:inline">Inspector</span>
          </button>
        </div>
      </header>

      {/* Copy Toast Feedback */}
      {copyFeedback && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-full bg-[#182030] text-[#E5A93C] border border-[#E5A93C]/30 text-xs font-semibold shadow-xl flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
          <span>{copyFeedback}</span>
        </div>
      )}

      {/* ============================================================= */}
      {/* 2. MAIN CONTENT AREA                                          */}
      {/* ============================================================= */}
      <main className="flex-1 overflow-y-auto px-4 py-4 flex flex-col justify-between">
        <div className="space-y-4 max-w-md mx-auto w-full">

          {/* ----------------------------------------------------------- */}
          {/* STATE A: SKELETON RESOLVING                                 */}
          {/* ----------------------------------------------------------- */}
          {state === 'resolving' && (
            <div className="space-y-4 animate-pulse">
              <div className="flex items-center justify-center gap-2 py-1">
                <RefreshCw className="w-3.5 h-3.5 text-[#E5A93C] animate-spin" />
                <span className="text-xs text-[#94A3B8] font-medium">Opening business identity...</span>
              </div>
              <div className="bg-[#121722] rounded-2xl p-6 border border-white/[0.08] space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-white/[0.06]" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-white/[0.08] rounded w-3/4" />
                    <div className="h-3 bg-white/[0.05] rounded w-1/2" />
                  </div>
                </div>
                <div className="pt-4 border-t border-white/[0.06] space-y-2">
                  <div className="h-3.5 bg-white/[0.06] rounded w-2/3" />
                  <div className="h-3 bg-white/[0.04] rounded w-1/3" />
                </div>
                <div className="pt-4 border-t border-white/[0.06] space-y-2">
                  <div className="h-3 bg-white/[0.05] rounded w-4/5" />
                  <div className="h-3 bg-white/[0.05] rounded w-3/5" />
                </div>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* STATE B: OFFLINE STATE                                      */}
          {/* ----------------------------------------------------------- */}
          {state === 'offline' && (
            <div className="bg-[#121722] rounded-2xl p-6 border border-white/[0.08] text-center space-y-4 mt-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-[#1E293B] border border-white/10 flex items-center justify-center text-[#94A3B8]">
                <WifiOff className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">You're offline.</h2>
                <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed max-w-xs mx-auto">
                  Connect to the internet to open this business identity.
                </p>
              </div>
              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  onClick={() => setState('found_not_saved')}
                  className="w-full py-3 rounded-xl bg-[#E5A93C] text-[#0A0D14] font-bold text-xs shadow-md active:scale-[0.98] transition-transform"
                >
                  Try Again
                </button>
                <button
                  type="button"
                  onClick={() => onBackToScanner('qr')}
                  className="w-full py-2.5 rounded-xl bg-[#141B29] text-[#94A3B8] hover:text-white border border-white/[0.08] font-semibold text-xs"
                >
                  Back to Scanner
                </button>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* STATE C: INVALID QR                                         */}
          {/* ----------------------------------------------------------- */}
          {state === 'invalid' && (
            <div className="bg-[#121722] rounded-2xl p-6 border border-white/[0.08] text-center space-y-4 mt-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-[#E5A93C]">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">QR not recognized</h2>
                <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed max-w-xs mx-auto">
                  This doesn't appear to be a valid business identity QR.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onBackToScanner('qr')}
                  className="w-full py-3 rounded-xl bg-[#E5A93C] text-[#0A0D14] font-bold text-xs shadow-md active:scale-[0.98] transition-transform"
                >
                  Scan Again
                </button>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* STATE D: MALFORMED QR                                       */}
          {/* ----------------------------------------------------------- */}
          {state === 'malformed' && (
            <div className="bg-[#121722] rounded-2xl p-6 border border-white/[0.08] text-center space-y-4 mt-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Couldn't read this QR.</h2>
                <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed max-w-xs mx-auto">
                  The QR payload could not be decoded. Hold steady and try scanning again.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onBackToScanner('qr')}
                  className="w-full py-3 rounded-xl bg-[#E5A93C] text-[#0A0D14] font-bold text-xs shadow-md active:scale-[0.98] transition-transform"
                >
                  Scan Again
                </button>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* STATE E: EXPIRED / REVOKED QR                               */}
          {/* ----------------------------------------------------------- */}
          {state === 'expired' && (
            <div className="bg-[#121722] rounded-2xl p-6 border border-white/[0.08] text-center space-y-4 mt-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <Clock className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">This QR is no longer active.</h2>
                <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed max-w-xs mx-auto">
                  Ask the person to open their current QR and try again.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onBackToScanner('qr')}
                  className="w-full py-3 rounded-xl bg-[#E5A93C] text-[#0A0D14] font-bold text-xs shadow-md active:scale-[0.98] transition-transform"
                >
                  Scan Again
                </button>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* STATE F: UNAVAILABLE IDENTITY                               */}
          {/* ----------------------------------------------------------- */}
          {state === 'unavailable' && (
            <div className="bg-[#121722] rounded-2xl p-6 border border-white/[0.08] text-center space-y-4 mt-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center text-[#94A3B8]">
                <Building2 className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">This business identity is no longer available.</h2>
                <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed max-w-xs mx-auto">
                  The profile or business representation has been deactivated or removed.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onBackToScanner('qr')}
                  className="w-full py-3 rounded-xl bg-[#E5A93C] text-[#0A0D14] font-bold text-xs shadow-md active:scale-[0.98] transition-transform"
                >
                  Scan Again
                </button>
              </div>
            </div>
          )}

          {/* ----------------------------------------------------------- */}
          {/* STATE G: PROFILE LOAD ERROR                                 */}
          {/* ----------------------------------------------------------- */}
          {state === 'load_error' && (
            <div className="bg-[#121722] rounded-2xl p-6 border border-white/[0.08] text-center space-y-4 mt-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Couldn't load this business identity.</h2>
                <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed max-w-xs mx-auto">
                  A temporary connection issue prevented loading the profile.
                </p>
              </div>
              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  onClick={() => setState('found_not_saved')}
                  className="w-full py-3 rounded-xl bg-[#E5A93C] text-[#0A0D14] font-bold text-xs shadow-md active:scale-[0.98] transition-transform"
                >
                  Try Again
                </button>
                <button
                  type="button"
                  onClick={() => onBackToScanner('qr')}
                  className="w-full py-2.5 rounded-xl bg-[#141B29] text-[#94A3B8] hover:text-white border border-white/[0.08] font-semibold text-xs"
                >
                  Scan Again
                </button>
              </div>
            </div>
          )}

          {/* =========================================================== */}
          {/* VALID IDENTITY PRESENTATION (found, adding, added,          */}
          {/* already_saved, self_identity, add_error)                   */}
          {/* =========================================================== */}
          {state !== 'resolving' &&
            state !== 'offline' &&
            state !== 'invalid' &&
            state !== 'malformed' &&
            state !== 'expired' &&
            state !== 'unavailable' &&
            state !== 'load_error' && (
              <>
                {/* 1. RESTRAINED SUCCESS / STATUS BANNER */}
                <div className="flex items-center justify-center">
                  {state === 'found_not_saved' && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Identity found</span>
                    </div>
                  )}

                  {state === 'adding' && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-[#E5A93C] text-xs font-semibold">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving to My Network...</span>
                    </div>
                  )}

                  {state === 'added' && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 text-[#10B981] text-xs font-semibold animate-in fade-in zoom-in-95">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Added to My Network</span>
                    </div>
                  )}

                  {state === 'already_saved' && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-xs font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Already in My Network</span>
                    </div>
                  )}

                  {state === 'self_identity' && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[#E5A93C] text-xs font-semibold">
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>This is your business identity</span>
                    </div>
                  )}

                  {state === 'add_error' && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-semibold">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Couldn't add to your network. Try again.</span>
                    </div>
                  )}
                </div>

                {/* 2. DIGITAL BUSINESS IDENTITY CARD */}
                {/* Visual language matches Screens 5, 12, 21 */}
                <section
                  aria-label="Digital Business Identity Card"
                  className="bg-[#121722] rounded-2xl border border-white/[0.08] shadow-2xl p-5 relative overflow-hidden"
                >
                  {/* Subtle decorative glow */}
                  <div className="absolute top-0 right-0 w-36 h-36 bg-[#E5A93C]/[0.03] rounded-full blur-2xl pointer-events-none" />

                  {/* Header: Person Profile Details */}
                  <div className="flex items-start gap-3.5">
                    {/* Person Monogram Avatar */}
                    <div className="w-14 h-14 rounded-2xl bg-[#182030] border border-amber-500/30 text-[#E5A93C] flex items-center justify-center font-bold text-lg shrink-0 shadow-md">
                      {identity.profilePhoto ? (
                        <img
                          src={identity.profilePhoto}
                          alt={identity.personName}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        <span>{identity.initials}</span>
                      )}
                    </div>

                    {/* Person Name & Role Hierarchy */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h2 className="text-base font-bold text-white tracking-tight leading-snug break-words">
                          {identity.personName}
                        </h2>
                        {identity.isRegisteredPlatformUser && (
                          <span
                            title="Verified platform identity"
                            className="shrink-0 text-[#10B981]"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-semibold text-[#E5A93C] mt-0.5 leading-snug break-words">
                        {identity.designation}
                      </p>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="my-4 border-t border-white/[0.06]" />

                  {/* Business Entity Block (Tappable to Business Profile) */}
                  <div
                    onClick={() => onViewBusinessProfile && onViewBusinessProfile(identity.businessId)}
                    className="p-3 rounded-xl bg-[#161D2B] border border-white/[0.06] hover:border-[#E5A93C]/30 cursor-pointer transition-all group"
                    role="button"
                    tabIndex={0}
                    title="View Business Profile"
                    aria-label={`View ${identity.businessName} profile`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Business Monogram */}
                      <div className="w-9 h-9 rounded-lg bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-[#E5A93C] flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                        {identity.businessInitials}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <p className="text-xs font-bold text-white group-hover:text-[#E5A93C] transition-colors leading-snug break-words">
                            {identity.businessName}
                          </p>
                          <ExternalLink className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#E5A93C] shrink-0 transition-colors" />
                        </div>
                        <p className="text-[11px] text-[#94A3B8] mt-0.5 font-medium leading-tight">
                          {identity.category} • {identity.city}, {identity.state}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Public Professional Contact Channels */}
                  <div className="mt-4 space-y-2 text-xs">
                    {identity.businessPhone && (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Phone className="w-3.5 h-3.5 text-[#E5A93C] shrink-0" />
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-[#64748B] font-semibold block leading-none">
                              Business Phone
                            </span>
                            <span className="text-xs text-white font-medium truncate mt-0.5 block">
                              {identity.businessPhone}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(identity.businessPhone!, 'Phone number')}
                          className="text-[10px] text-[#94A3B8] hover:text-white px-2 py-1 rounded bg-white/[0.04] border border-white/[0.08]"
                        >
                          Copy
                        </button>
                      </div>
                    )}

                    {identity.businessEmail && (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Mail className="w-3.5 h-3.5 text-[#E5A93C] shrink-0" />
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-[#64748B] font-semibold block leading-none">
                              Business Email
                            </span>
                            <span className="text-xs text-white font-medium truncate mt-0.5 block">
                              {identity.businessEmail}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(identity.businessEmail!, 'Email address')}
                          className="text-[10px] text-[#94A3B8] hover:text-white px-2 py-1 rounded bg-white/[0.04] border border-white/[0.08]"
                        >
                          Copy
                        </button>
                      </div>
                    )}

                    {identity.website && (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Globe className="w-3.5 h-3.5 text-[#E5A93C] shrink-0" />
                          <div>
                            <span className="text-[9px] uppercase tracking-wider text-[#64748B] font-semibold block leading-none">
                              Website
                            </span>
                            <span className="text-xs text-white font-medium truncate mt-0.5 block">
                              {identity.website}
                            </span>
                          </div>
                        </div>
                        <a
                          href={`https://${identity.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[10px] text-[#E5A93C] hover:underline px-2 py-1"
                        >
                          Open
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Subordinate Quick Contact Utilities (Call, WhatsApp, Email) */}
                  {identity.businessPhone && (
                    <div className="mt-3.5 pt-3 border-t border-white/[0.06] grid grid-cols-3 gap-2">
                      <a
                        href={`tel:${identity.businessPhone.replace(/\s+/g, '')}`}
                        className="py-2 px-1 rounded-xl bg-[#161D2B] hover:bg-[#1C2537] border border-white/[0.06] text-[#CBD5E1] hover:text-white flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#E5A93C]" />
                        <span>Call</span>
                      </a>

                      <a
                        href={`https://wa.me/${identity.businessPhone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-1 rounded-xl bg-[#161D2B] hover:bg-[#1C2537] border border-white/[0.06] text-[#CBD5E1] hover:text-white flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#10B981]" />
                        <span>WhatsApp</span>
                      </a>

                      {identity.businessEmail && (
                        <a
                          href={`mailto:${identity.businessEmail}`}
                          className="py-2 px-1 rounded-xl bg-[#161D2B] hover:bg-[#1C2537] border border-white/[0.06] text-[#CBD5E1] hover:text-white flex items-center justify-center gap-1.5 text-xs font-semibold transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5 text-[#38BDF8]" />
                          <span>Email</span>
                        </a>
                      )}
                    </div>
                  )}

                  {/* QR Source Badge */}
                  <div className="mt-3.5 pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-[10px] text-[#64748B]">
                    <span className="flex items-center gap-1">
                      <QrCode className="w-3 h-3 text-[#E5A93C]" />
                      <span>Platform Business QR</span>
                    </span>
                    <span>Directional Save</span>
                  </div>
                </section>

                {/* Supporting Success Copy when Added */}
                {state === 'added' && (
                  <div className="p-3 rounded-xl bg-[#10B981]/10 border border-[#10B981]/25 text-center animate-in fade-in">
                    <p className="text-xs text-[#E2E8F0] font-medium leading-relaxed">
                      <strong className="text-white">{identity.personName}'s</strong> {identity.businessName} identity is now in your network.
                    </p>
                    <p className="text-[10px] text-[#94A3B8] mt-1">
                      Saved under My Network with source labeled as QR.
                    </p>
                  </div>
                )}

                {/* Supporting Copy when Already in Network */}
                {state === 'already_saved' && (
                  <div className="p-3 rounded-xl bg-[#182030] border border-white/[0.08] text-center">
                    <p className="text-xs text-[#CBD5E1] font-medium leading-relaxed">
                      You already have <strong className="text-white">{identity.personName} @ {identity.businessName}</strong> saved in My Network.
                    </p>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      No duplicate entries are created.
                    </p>
                  </div>
                )}

                {/* Supporting Copy for Self-Scan */}
                {state === 'self_identity' && (
                  <div className="p-3 rounded-xl bg-[#182030] border border-amber-500/20 text-center">
                    <p className="text-xs text-[#CBD5E1] font-medium leading-relaxed">
                      This QR belongs to your current account.
                    </p>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      You cannot add your own business identity to your network.
                    </p>
                  </div>
                )}
              </>
            )}
        </div>

        {/* ============================================================= */}
        {/* 3. BOTTOM ACTION AREA                                         */}
        {/* ============================================================= */}
        <div className="mt-4 pt-3 border-t border-white/[0.08] space-y-2.5 max-w-md mx-auto w-full">
          {/* FRESH IDENTITY: ADD TO MY NETWORK */}
          {state === 'found_not_saved' && (
            <>
              <button
                type="button"
                id="btn-add-to-my-network"
                onClick={handleAddToNetwork}
                className="w-full h-13 py-3.5 px-4 rounded-xl bg-[#E5A93C] hover:bg-[#EDB856] text-[#0A0D14] font-bold text-sm shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all touch-manipulation cursor-pointer"
                aria-label={`Add ${identity.personName} at ${identity.businessName} to My Network`}
              >
                <UserPlus className="w-4 h-4 text-[#0A0D14]" />
                <span>Add to My Network</span>
              </button>

              {/* Secondary Action: View Full Profile */}
              <button
                type="button"
                onClick={() => onViewFullPersonProfile && onViewFullPersonProfile(identity.userId)}
                className="w-full py-2.5 text-xs text-[#94A3B8] hover:text-white font-medium flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Full Profile</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
              </button>
            </>
          )}

          {/* ADDING IN PROGRESS */}
          {state === 'adding' && (
            <button
              type="button"
              disabled
              className="w-full h-13 py-3.5 px-4 rounded-xl bg-[#E5A93C]/80 text-[#0A0D14] font-bold text-sm shadow-xl flex items-center justify-center gap-2 cursor-wait"
            >
              <RefreshCw className="w-4 h-4 animate-spin text-[#0A0D14]" />
              <span>Adding...</span>
            </button>
          )}

          {/* ADD ERROR (Preserves identity, restores CTA) */}
          {state === 'add_error' && (
            <>
              <button
                type="button"
                onClick={handleRetryAdd}
                className="w-full h-13 py-3.5 px-4 rounded-xl bg-[#E5A93C] hover:bg-[#EDB856] text-[#0A0D14] font-bold text-sm shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <RefreshCw className="w-4 h-4 text-[#0A0D14]" />
                <span>Retry Add to My Network</span>
              </button>

              <button
                type="button"
                onClick={() => onBackToScanner('qr')}
                className="w-full py-2 text-xs text-[#94A3B8] hover:text-white font-medium"
              >
                Back to Scanner
              </button>
            </>
          )}

          {/* SUCCESS STATE (Added) */}
          {state === 'added' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2">
              <button
                type="button"
                id="btn-view-in-my-network"
                onClick={() => onViewInMyNetwork(identity.id)}
                className="w-full h-13 py-3.5 px-4 rounded-xl bg-[#E5A93C] hover:bg-[#EDB856] text-[#0A0D14] font-bold text-sm shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <span>View in My Network</span>
                <ChevronRight className="w-4 h-4 text-[#0A0D14]" />
              </button>

              <button
                type="button"
                id="btn-scan-another"
                onClick={onScanAnother}
                className="w-full py-3 px-4 rounded-xl bg-[#141B29] hover:bg-[#1A2234] text-white border border-white/[0.12] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <QrCode className="w-3.5 h-3.5 text-[#E5A93C]" />
                <span>Scan Another</span>
              </button>
            </div>
          )}

          {/* ALREADY SAVED STATE */}
          {state === 'already_saved' && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onViewInMyNetwork(identity.id)}
                className="w-full h-13 py-3.5 px-4 rounded-xl bg-[#E5A93C] hover:bg-[#EDB856] text-[#0A0D14] font-bold text-sm shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <span>View in My Network</span>
                <ChevronRight className="w-4 h-4 text-[#0A0D14]" />
              </button>

              <button
                type="button"
                onClick={onScanAnother}
                className="w-full py-3 px-4 rounded-xl bg-[#141B29] hover:bg-[#1A2234] text-white border border-white/[0.12] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <QrCode className="w-3.5 h-3.5 text-[#E5A93C]" />
                <span>Scan Another</span>
              </button>
            </div>
          )}

          {/* SELF IDENTITY STATE */}
          {state === 'self_identity' && (
            <div className="space-y-2">
              <button
                type="button"
                onClick={onViewMyQr}
                className="w-full h-13 py-3.5 px-4 rounded-xl bg-[#E5A93C] hover:bg-[#EDB856] text-[#0A0D14] font-bold text-sm shadow-xl flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
              >
                <QrCode className="w-4 h-4 text-[#0A0D14]" />
                <span>View My QR</span>
              </button>

              <button
                type="button"
                onClick={onScanAnother}
                className="w-full py-3 px-4 rounded-xl bg-[#141B29] hover:bg-[#1A2234] text-white border border-white/[0.12] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <span>Scan Another</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ============================================================= */}
      {/* 4. PROTOTYPE SCENARIO INSPECTOR DRAWER                        */}
      {/* ============================================================= */}
      {showInspector && (
        <div className="absolute inset-x-0 bottom-0 z-40 bg-[#121722]/98 backdrop-blur-md border-t border-white/20 p-4 rounded-t-2xl shadow-2xl space-y-3 max-h-[75%] overflow-y-auto animate-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#E5A93C]" />
              <span className="text-xs font-bold text-white">Screen 22 Verification Scenarios</span>
            </div>
            <button
              onClick={() => setShowInspector(false)}
              className="text-xs text-[#94A3B8] hover:text-white px-2 py-0.5 rounded"
            >
              Close
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              onClick={() => loadScenario('default')}
              className={`p-2 rounded-xl text-left border transition-all ${
                state === 'found_not_saved' && identity.id === 'identity-shravani-aikyam'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/5 text-[#94A3B8] hover:text-white'
              }`}
            >
              <span className="block font-bold text-white">1. New Identity (Default)</span>
              <span className="text-[10px] text-[#64748B]">Shravani @ Aikyam AI</span>
            </button>

            <button
              onClick={() => loadScenario('added_success')}
              className={`p-2 rounded-xl text-left border transition-all ${
                state === 'added'
                  ? 'bg-[#10B981]/20 border-[#10B981] text-white font-semibold'
                  : 'bg-[#182030] border-white/5 text-[#94A3B8] hover:text-white'
              }`}
            >
              <span className="block font-bold text-white">2. Added Success</span>
              <span className="text-[10px] text-[#64748B]">View in Network / Scan</span>
            </button>

            <button
              onClick={() => loadScenario('already_in_network')}
              className={`p-2 rounded-xl text-left border transition-all ${
                state === 'already_saved'
                  ? 'bg-[#10B981]/20 border-[#10B981] text-white font-semibold'
                  : 'bg-[#182030] border-white/5 text-[#94A3B8] hover:text-white'
              }`}
            >
              <span className="block font-bold text-white">3. Already in Network</span>
              <span className="text-[10px] text-[#64748B]">Exact duplicate check</span>
            </button>

            <button
              onClick={() => loadScenario('same_person_diff_biz')}
              className={`p-2 rounded-xl text-left border transition-all ${
                identity.id === 'identity-shravani-pasnur-ind'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/5 text-[#94A3B8] hover:text-white'
              }`}
            >
              <span className="block font-bold text-white">4. Different Business</span>
              <span className="text-[10px] text-[#64748B]">Shravani @ Pasnur Ind.</span>
            </button>

            <button
              onClick={() => loadScenario('self_scan')}
              className={`p-2 rounded-xl text-left border transition-all ${
                state === 'self_identity'
                  ? 'bg-amber-500/20 border-amber-500 text-white font-semibold'
                  : 'bg-[#182030] border-white/5 text-[#94A3B8] hover:text-white'
              }`}
            >
              <span className="block font-bold text-white">5. Self-Scan Edge Case</span>
              <span className="text-[10px] text-[#64748B]">Own account QR detected</span>
            </button>

            <button
              onClick={() => loadScenario('long_names')}
              className={`p-2 rounded-xl text-left border transition-all ${
                identity.id === 'identity-long-name'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/5 text-[#94A3B8] hover:text-white'
              }`}
            >
              <span className="block font-bold text-white">6. Long Names & Titles</span>
              <span className="text-[10px] text-[#64748B]">Shrinivas Kulkarni multi-line</span>
            </button>

            <button
              onClick={() => loadScenario('devanagari')}
              className={`p-2 rounded-xl text-left border transition-all ${
                identity.id === 'identity-devanagari'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/5 text-[#94A3B8] hover:text-white'
              }`}
            >
              <span className="block font-bold text-white">7. मराठी Devanagari</span>
              <span className="text-[10px] text-[#64748B]">श्रावणी पसनूर • सोलापूर</span>
            </button>

            <button
              onClick={() => loadScenario('missing_fields')}
              className={`p-2 rounded-xl text-left border transition-all ${
                identity.id === 'identity-minimal'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/5 text-[#94A3B8] hover:text-white'
              }`}
            >
              <span className="block font-bold text-white">8. Missing Fields</span>
              <span className="text-[10px] text-[#64748B]">Omitted phone / website</span>
            </button>

            <button
              onClick={() => loadScenario('invalid_qr')}
              className={`p-2 rounded-xl text-left border transition-all ${
                state === 'invalid'
                  ? 'bg-amber-500/20 border-amber-500 text-white font-semibold'
                  : 'bg-[#182030] border-white/5 text-[#94A3B8] hover:text-white'
              }`}
            >
              <span className="block font-bold text-white">9. Invalid QR</span>
              <span className="text-[10px] text-[#64748B]">Unrecognized format</span>
            </button>

            <button
              onClick={() => loadScenario('expired_qr')}
              className={`p-2 rounded-xl text-left border transition-all ${
                state === 'expired'
                  ? 'bg-amber-500/20 border-amber-500 text-white font-semibold'
                  : 'bg-[#182030] border-white/5 text-[#94A3B8] hover:text-white'
              }`}
            >
              <span className="block font-bold text-white">10. Expired / Revoked</span>
              <span className="text-[10px] text-[#64748B]">Stale QR token</span>
            </button>

            <button
              onClick={() => loadScenario('unavailable_identity')}
              className={`p-2 rounded-xl text-left border transition-all ${
                state === 'unavailable'
                  ? 'bg-red-500/20 border-red-500 text-white font-semibold'
                  : 'bg-[#182030] border-white/5 text-[#94A3B8] hover:text-white'
              }`}
            >
              <span className="block font-bold text-white">11. Unavailable Profile</span>
              <span className="text-[10px] text-[#64748B]">Account deactivated</span>
            </button>

            <button
              onClick={() => loadScenario('offline')}
              className={`p-2 rounded-xl text-left border transition-all ${
                state === 'offline'
                  ? 'bg-white/20 border-white text-white font-semibold'
                  : 'bg-[#182030] border-white/5 text-[#94A3B8] hover:text-white'
              }`}
            >
              <span className="block font-bold text-white">12. Offline Mode</span>
              <span className="text-[10px] text-[#64748B]">No internet connection</span>
            </button>

            <button
              onClick={() => loadScenario('add_error')}
              className={`p-2 rounded-xl text-left border transition-all ${
                state === 'add_error'
                  ? 'bg-red-500/20 border-red-500 text-white font-semibold'
                  : 'bg-[#182030] border-white/5 text-[#94A3B8] hover:text-white'
              }`}
            >
              <span className="block font-bold text-white">13. Add Failure</span>
              <span className="text-[10px] text-[#64748B]">Preserves identity, retries</span>
            </button>

            <button
              onClick={() => loadScenario('resolving')}
              className={`p-2 rounded-xl text-left border transition-all ${
                state === 'resolving'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/5 text-[#94A3B8] hover:text-white'
              }`}
            >
              <span className="block font-bold text-white">14. Skeleton Resolving</span>
              <span className="text-[10px] text-[#64748B]">Loading placeholder</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
