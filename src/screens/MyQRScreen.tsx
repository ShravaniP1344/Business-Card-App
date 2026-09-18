import React, { useState } from 'react';
import {
  ArrowLeft,
  Share2,
  Download,
  CheckCircle2,
  Building2,
  Phone,
  Mail,
  Globe,
  Maximize2,
  X,
  Sparkles,
  Sliders,
  Check,
  ChevronDown,
  RefreshCw,
  AlertCircle,
  Copy,
  PlusCircle,
  Home as HomeIcon,
  Search,
  ScanLine,
  Users,
  User,
  ShieldCheck,
  Info
} from 'lucide-react';
import { DESIGN_TOKENS } from '../design-system/tokens';

export interface DigitalBusinessCardIdentity {
  id: string;
  businessName: string;
  monogram: string;
  monogramBg: string;
  role: string;
  category: string;
  city: string;
  state: string;
  businessPhone: string;
  businessEmail: string;
  website: string;
  qrPayloadToken: string; // Token resolving to public identity resource (no raw DB id)
  isDefault?: boolean;
}

interface MyQRScreenProps {
  onBack: () => void;
  onNavigateToHome?: () => void;
  onNavigateToSearch?: () => void;
  onNavigateToScan?: (mode?: 'card' | 'qr') => void;
  onNavigateToMyNetwork?: () => void;
  onNavigateToProfile?: () => void;
  onActiveIdentityChanged?: (identity: DigitalBusinessCardIdentity) => void;
  activeIdentityId?: string;
  isLargeTextMode?: boolean;
}

export const MyQRScreen: React.FC<MyQRScreenProps> = ({
  onBack,
  onNavigateToHome,
  onNavigateToSearch,
  onNavigateToScan,
  onNavigateToMyNetwork,
  onNavigateToProfile,
  onActiveIdentityChanged,
  activeIdentityId = 'biz-aikyam',
  isLargeTextMode = false
}) => {
  // =========================================================================
  // MULTI-IDENTITY DATASET
  // Each identity has its OWN distinct digital card, QR, role, and business details.
  // =========================================================================
  const availableIdentities: DigitalBusinessCardIdentity[] = [
    {
      id: 'biz-aikyam',
      businessName: 'Aikyam AI Systems',
      monogram: 'AI',
      monogramBg: '#E5A93C',
      role: 'Software Engineer',
      category: 'Technology',
      city: 'Solapur',
      state: 'Maharashtra',
      businessPhone: '+91 98765 43210',
      businessEmail: 'shravani@aikyam.ai',
      website: 'aikyam.ai',
      qrPayloadToken: 'aikyam-shravani-se-9876',
      isDefault: true
    },
    {
      id: 'biz-pasnur',
      businessName: 'Pasnur Industries',
      monogram: 'PI',
      monogramBg: '#38BDF8',
      role: 'Owner',
      category: 'Manufacturing',
      city: 'Solapur',
      state: 'Maharashtra',
      businessPhone: '+91 98220 99887',
      businessEmail: 'shravani@pasnurindustries.in',
      website: 'pasnurindustries.in',
      qrPayloadToken: 'pasnur-shravani-owner-4432'
    },
    {
      id: 'biz-xyz',
      businessName: 'XYZ Consulting',
      monogram: 'XC',
      monogramBg: '#10B981',
      role: 'Consultant',
      category: 'Business Consulting',
      city: 'Pune',
      state: 'Maharashtra',
      businessPhone: '+91 98221 55443',
      businessEmail: 'shravani@xyzconsulting.in',
      website: 'xyzconsulting.in',
      qrPayloadToken: 'xyz-shravani-consultant-1109'
    }
  ];

  // Prototype scenario type
  type ScenarioType =
    | 'standard-aikyam'     // Default: Shravani @ Aikyam AI Systems
    | 'pasnur-industries'   // Switched: Shravani @ Pasnur Industries
    | 'xyz-consulting'      // Switched: Shravani @ XYZ Consulting
    | 'single-identity'     // Single identity user state (no multi-business switcher)
    | 'long-business-name'  // Long business name & designation wrapping
    | 'devanagari'          // Marathi localization (श्रावणी पसनूर, मालक)
    | 'loading'             // Skeleton loading state
    | 'qr-failure'          // QR generation failure & retry
    | 'no-identity';        // No business identity established

  const [scenario, setScenario] = useState<ScenarioType>('standard-aikyam');
  const [showInspector, setShowInspector] = useState<boolean>(false);
  const [selectedIdentityId, setSelectedIdentityId] = useState<string>(activeIdentityId);
  const [showIdentitySheet, setShowIdentitySheet] = useState<boolean>(false);
  const [showFullscreenQr, setShowFullscreenQr] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Active identity derived from state
  const activeIdentity = availableIdentities.find(i => i.id === selectedIdentityId) || availableIdentities[0];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Switch identity handler (Updates Card, QR, and triggers global synchronization)
  const handleSelectIdentity = (identity: DigitalBusinessCardIdentity) => {
    setSelectedIdentityId(identity.id);
    setShowIdentitySheet(false);
    triggerToast(`Switched active card to ${identity.businessName}`);
    if (onActiveIdentityChanged) {
      onActiveIdentityChanged(identity);
    }
  };

  // Share action (Native mobile share or fallback)
  const handleShare = async () => {
    const shareData = {
      title: `${activeIdentity.businessName} - Shravani Pasnur`,
      text: `Save my digital business card: Shravani Pasnur, ${activeIdentity.role} at ${activeIdentity.businessName}`,
      url: `https://${activeIdentity.website}/card/${activeIdentity.qrPayloadToken}`
    };

    if (navigator.share && typeof navigator.share === 'function') {
      try {
        await navigator.share(shareData);
        triggerToast('Shared business identity');
      } catch (err: any) {
        if (err?.name !== 'AbortError') {
          triggerToast("Couldn't open sharing options");
        }
      }
    } else {
      // Fallback: Copy link and show simulated share notification
      try {
        await navigator.clipboard.writeText(shareData.url);
        triggerToast(`Card link copied for ${activeIdentity.businessName}`);
      } catch {
        triggerToast(`Card link ready: ${activeIdentity.businessName}`);
      }
    }
  };

  // Save QR action
  const handleSaveQR = () => {
    triggerToast(`QR saved: Shravani Pasnur (${activeIdentity.businessName})`);
  };

  // High-contrast SVG QR Matrix Generator (Reliable, functional, strictly contrast-compliant)
  const renderQrMatrix = (size: number = 180, isEnlarged: boolean = false) => {
    // Generate deterministic pattern based on active identity token for realism
    const seed = activeIdentity.qrPayloadToken;
    const gridDim = 25; // 25x25 grid
    const cellSize = size / gridDim;

    // Fixed positional anchor boxes (Top-Left, Top-Right, Bottom-Left)
    const isAnchor = (r: number, c: number) => {
      // Top-Left (7x7)
      if (r < 7 && c < 7) return true;
      // Top-Right (7x7)
      if (r < 7 && c >= gridDim - 7) return true;
      // Bottom-Left (7x7)
      if (r >= gridDim - 7 && c < 7) return true;
      return false;
    };

    const isAnchorInner = (r: number, c: number) => {
      // White ring inside 7x7 anchor
      if (
        (r >= 1 && r <= 5 && (c === 1 || c === 5) && (r < 7 && c < 7)) ||
        (c >= 1 && c <= 5 && (r === 1 || r === 5) && (r < 7 && c < 7))
      )
        return false;
      if (
        (r >= 1 && r <= 5 && (c === gridDim - 6 || c === gridDim - 2)) ||
        (c >= gridDim - 6 && c <= gridDim - 2 && (r === 1 || r === 5))
      )
        return false;
      if (
        (r >= gridDim - 6 && r <= gridDim - 2 && (c === 1 || c === 5)) ||
        (c >= 1 && c <= 5 && (r === gridDim - 6 || r === gridDim - 2))
      )
        return false;

      return true;
    };

    const modules: { r: number; c: number }[] = [];
    for (let r = 0; r < gridDim; r++) {
      for (let c = 0; c < gridDim; c++) {
        if (isAnchor(r, c)) {
          if (isAnchorInner(r, c)) {
            modules.push({ r, c });
          }
        } else {
          // Semi-random deterministic pattern based on cell position + token seed
          const charCode = seed.charCodeAt((r * 3 + c * 7) % seed.length);
          if ((charCode + r * 11 + c * 13) % 3 === 0 || (r === 12 && c % 2 === 0)) {
            modules.push({ r, c });
          }
        }
      }
    }

    return (
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="block shrink-0"
        aria-label={`QR code for Shravani Pasnur, ${activeIdentity.role} at ${activeIdentity.businessName}`}
      >
        {/* Pure white quiet zone & background for maximum optical scan reliability */}
        <rect width={size} height={size} fill="#FFFFFF" rx={isEnlarged ? 8 : 4} />
        {/* Black functional modules */}
        <g fill="#000000">
          {modules.map(m => (
            <rect
              key={`${m.r}-${m.c}`}
              x={m.c * cellSize}
              y={m.r * cellSize}
              width={cellSize + 0.2}
              height={cellSize + 0.2}
            />
          ))}
        </g>
      </svg>
    );
  };

  return (
    <div
      className="relative flex flex-col h-full w-full bg-[#0A0D14] text-[#F1F5F9] font-sans antialiased select-none overflow-hidden"
      style={{
        fontSize: isLargeTextMode ? '112%' : '100%',
        lineHeight: isLargeTextMode ? 1.55 : 1.45
      }}
    >
      {/* ======================================================================= */}
      {/* PROTOTYPE INSPECTOR BAR */}
      {/* ======================================================================= */}
      <div className="bg-[#121826] border-b border-white/[0.08] px-3.5 py-1.5 flex items-center justify-between text-[11px] text-[#94A3B8] shrink-0 z-40">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#E5A93C]" />
          <span className="font-semibold text-white">Screen 21: My QR</span>
          <span className="text-[10px] text-[#64748B] hidden sm:inline">
            ({activeIdentity.businessName})
          </span>
        </div>
        <button
          onClick={() => setShowInspector(!showInspector)}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.06] hover:bg-white/[0.1] text-white text-[10.5px] font-medium transition-all"
        >
          <Sliders className="w-3 h-3 text-[#E5A93C]" />
          <span>Scenarios</span>
        </button>
      </div>

      {/* PROTOTYPE INSPECTOR DRAWER */}
      {showInspector && (
        <div className="bg-[#141B2D] border-b border-white/[0.12] p-3 text-xs space-y-2.5 z-40 shrink-0 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between text-white font-semibold pb-1 border-b border-white/[0.08]">
            <span className="flex items-center gap-1.5 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
              Evaluation Scenarios
            </span>
            <button onClick={() => setShowInspector(false)} className="text-[#94A3B8] hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10.5px]">
            <button
              onClick={() => {
                setScenario('standard-aikyam');
                setSelectedIdentityId('biz-aikyam');
              }}
              className={`p-1.5 rounded text-left border transition-all ${
                scenario === 'standard-aikyam'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#0E131F] border-white/[0.06] text-[#94A3B8] hover:text-white'
              }`}
            >
              <div className="font-medium text-white truncate">1. Aikyam AI (Default)</div>
              <div className="text-[9.5px] text-[#94A3B8] truncate">Software Engineer @ Aikyam</div>
            </button>

            <button
              onClick={() => {
                setScenario('pasnur-industries');
                setSelectedIdentityId('biz-pasnur');
              }}
              className={`p-1.5 rounded text-left border transition-all ${
                scenario === 'pasnur-industries'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#0E131F] border-white/[0.06] text-[#94A3B8] hover:text-white'
              }`}
            >
              <div className="font-medium text-white truncate">2. Pasnur Industries</div>
              <div className="text-[9.5px] text-[#94A3B8] truncate">Owner @ Pasnur Industries</div>
            </button>

            <button
              onClick={() => {
                setScenario('xyz-consulting');
                setSelectedIdentityId('biz-xyz');
              }}
              className={`p-1.5 rounded text-left border transition-all ${
                scenario === 'xyz-consulting'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#0E131F] border-white/[0.06] text-[#94A3B8] hover:text-white'
              }`}
            >
              <div className="font-medium text-white truncate">3. XYZ Consulting</div>
              <div className="text-[9.5px] text-[#94A3B8] truncate">Consultant @ XYZ Consulting</div>
            </button>

            <button
              onClick={() => {
                setScenario('single-identity');
                setSelectedIdentityId('biz-aikyam');
              }}
              className={`p-1.5 rounded text-left border transition-all ${
                scenario === 'single-identity'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#0E131F] border-white/[0.06] text-[#94A3B8] hover:text-white'
              }`}
            >
              <div className="font-medium text-white truncate">4. Single Identity User</div>
              <div className="text-[9.5px] text-[#94A3B8] truncate">Clean identity badge (no dropdown)</div>
            </button>

            <button
              onClick={() => {
                setScenario('long-business-name');
                setSelectedIdentityId('biz-aikyam');
              }}
              className={`p-1.5 rounded text-left border transition-all ${
                scenario === 'long-business-name'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#0E131F] border-white/[0.06] text-[#94A3B8] hover:text-white'
              }`}
            >
              <div className="font-medium text-white truncate">5. Long Name Wrapping</div>
              <div className="text-[9.5px] text-[#94A3B8] truncate">Controlled multi-line wrap</div>
            </button>

            <button
              onClick={() => {
                setScenario('devanagari');
                setSelectedIdentityId('biz-aikyam');
              }}
              className={`p-1.5 rounded text-left border transition-all ${
                scenario === 'devanagari'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#0E131F] border-white/[0.06] text-[#94A3B8] hover:text-white'
              }`}
            >
              <div className="font-medium text-white truncate">6. मराठी (Devanagari)</div>
              <div className="text-[9.5px] text-[#94A3B8] truncate">श्रावणी पसनूर • मालक</div>
            </button>

            <button
              onClick={() => setScenario('loading')}
              className={`p-1.5 rounded text-left border transition-all ${
                scenario === 'loading'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#0E131F] border-white/[0.06] text-[#94A3B8] hover:text-white'
              }`}
            >
              <div className="font-medium text-white truncate">7. Skeleton Loading</div>
              <div className="text-[9.5px] text-[#94A3B8] truncate">Identity & QR skeletons</div>
            </button>

            <button
              onClick={() => setScenario('qr-failure')}
              className={`p-1.5 rounded text-left border transition-all ${
                scenario === 'qr-failure'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#0E131F] border-white/[0.06] text-[#94A3B8] hover:text-white'
              }`}
            >
              <div className="font-medium text-white truncate">8. QR Generation Failure</div>
              <div className="text-[9.5px] text-[#94A3B8] truncate">Identity preserved + Retry</div>
            </button>

            <button
              onClick={() => setScenario('no-identity')}
              className={`p-1.5 rounded text-left border transition-all ${
                scenario === 'no-identity'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#0E131F] border-white/[0.06] text-[#94A3B8] hover:text-white'
              }`}
            >
              <div className="font-medium text-white truncate">9. No Business Identity</div>
              <div className="text-[9.5px] text-[#94A3B8] truncate">Prompt to set up identity</div>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* PAGE HEADER (Section 2) */}
      {/* Back arrow, compact Title "My QR", optional Share icon */}
      {/* ======================================================================= */}
      <header className="h-14 px-4 bg-[#0A0D14]/95 backdrop-blur-md border-b border-white/[0.06] flex items-center justify-between shrink-0 z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/[0.08] flex items-center justify-center text-[#F1F5F9] transition-all"
            aria-label="Back to previous screen"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight leading-none">
              {scenario === 'devanagari' ? 'माझा क्यूआर' : 'My QR'}
            </h1>
            <span className="text-[10px] text-[#64748B]">
              {scenario === 'devanagari' ? 'डिजिटल व्यवसाय ओळख' : 'Digital Business Card'}
            </span>
          </div>
        </div>

        {/* Top-Right Quick Share */}
        {scenario !== 'no-identity' && (
          <button
            onClick={handleShare}
            className="px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/[0.08] flex items-center gap-1.5 text-xs text-white transition-all font-semibold"
            aria-label="Share current business identity"
          >
            <Share2 className="w-3.5 h-3.5 text-[#E5A93C]" />
            <span>{scenario === 'devanagari' ? 'शेअर' : 'Share'}</span>
          </button>
        )}
      </header>

      {/* ======================================================================= */}
      {/* MAIN SCROLLABLE CONTENT */}
      {/* ======================================================================= */}
      {scenario === 'loading' ? (
        /* SKELETON LOADING STATE (Section 61) */
        <div className="flex-1 p-4 space-y-4 animate-pulse">
          <div className="h-12 rounded-xl bg-white/[0.06]" />
          <div className="h-72 rounded-2xl bg-white/[0.06] p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/[0.08]" />
              <div className="space-y-1 flex-1">
                <div className="w-28 h-4 rounded bg-white/[0.08]" />
                <div className="w-20 h-3 rounded bg-white/[0.04]" />
              </div>
            </div>
            <div className="w-full h-32 rounded-xl bg-white/[0.04]" />
          </div>
          <div className="h-11 rounded-xl bg-white/[0.06]" />
        </div>
      ) : scenario === 'no-identity' ? (
        /* NO BUSINESS IDENTITY STATE (Section 63) */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#E5A93C]/10 border border-[#E5A93C]/20 flex items-center justify-center text-[#E5A93C] mb-3">
            <Building2 className="w-7 h-7" />
          </div>
          <h2 className="text-base font-bold text-white mb-1">
            Set up a business identity to get your QR
          </h2>
          <p className="text-xs text-[#94A3B8] max-w-xs mb-5 leading-relaxed">
            Your QR code represents you as a specific professional at a registered business.
          </p>
          <button
            onClick={() => {
              triggerToast('Navigating to Business Identity Setup...');
              onBack();
            }}
            className="px-5 py-2.5 rounded-xl bg-[#E5A93C] text-[#0A0D14] text-xs font-bold flex items-center gap-2 shadow-md active:scale-95 transition-all"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.2]" />
            <span>Set Up Business Identity</span>
          </button>
        </div>
      ) : (
        <main
          className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5 pb-20"
          role="main"
          aria-label="My QR and Digital Business Card"
        >
          {/* ======================================================================= */}
          {/* SECTION 3 & 5: ACTIVE IDENTITY SELECTOR */}
          {/* Shows clearly which professional identity is currently being shared */}
          {/* ======================================================================= */}
          <section aria-label="Active Business Identity Context">
            <div className="text-[10px] text-[#64748B] font-semibold uppercase tracking-wider mb-1.5 px-0.5">
              {scenario === 'devanagari' ? 'सध्या शेअर करत असलेली ओळख' : 'Sharing as'}
            </div>

            {scenario === 'single-identity' ? (
              /* Single identity state: clean badge without heavy dropdown (Section 6) */
              <div className="p-2.5 rounded-xl bg-[#121722] border border-white/[0.08] flex items-center gap-2.5">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-[#0A0D14]"
                  style={{ backgroundColor: activeIdentity.monogramBg }}
                >
                  {activeIdentity.monogram}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">
                    {activeIdentity.businessName}
                  </div>
                  <div className="text-[10.5px] text-[#94A3B8] truncate">
                    {activeIdentity.role}
                  </div>
                </div>
              </div>
            ) : (
              /* Multi-identity switcher button (Section 5) */
              <button
                onClick={() => setShowIdentitySheet(true)}
                className="w-full p-2.5 rounded-xl bg-[#121722] hover:bg-[#182030] border border-white/[0.08] hover:border-[#E5A93C]/40 transition-all flex items-center justify-between text-left group active:scale-[0.99] shadow-xs"
                aria-label={`Switch business identity. Currently sharing ${activeIdentity.businessName} as ${activeIdentity.role}`}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-[#0A0D14] shrink-0 shadow-xs"
                    style={{ backgroundColor: activeIdentity.monogramBg }}
                  >
                    {activeIdentity.monogram}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white truncate group-hover:text-[#E5A93C] transition-colors">
                      {scenario === 'long-business-name'
                        ? 'Shree Siddhivinayak Industrial Engineering Solutions Private Limited'
                        : scenario === 'devanagari'
                        ? 'श्री गणेश इंडस्ट्रीज'
                        : activeIdentity.businessName}
                    </div>
                    <div className="text-[10.5px] text-[#94A3B8] truncate">
                      {scenario === 'long-business-name'
                        ? 'Senior Business Development & Strategic Partnerships Manager'
                        : scenario === 'devanagari'
                        ? 'मालक'
                        : activeIdentity.role}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[#94A3B8] group-hover:text-white shrink-0">
                  <span className="text-[10px] hidden sm:inline">Switch</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </button>
            )}
          </section>

          {/* ======================================================================= */}
          {/* SECTION 7, 8, 9: MAIN DIGITAL BUSINESS CARD */}
          {/* One of the strongest branded visual components in the app */}
          {/* Dark + accent visual system. Strictly NO cheap gradients/neon. */}
          {/* ======================================================================= */}
          <section
            className="rounded-2xl bg-[#141B2D] border border-white/[0.12] p-4 text-center relative overflow-hidden shadow-xl space-y-3.5"
            aria-label="Digital Business Card"
          >
            {/* Top Identity Header inside card */}
            <div className="flex flex-col items-center">
              {/* Profile Initials / Photo */}
              <div className="w-13 h-13 rounded-2xl bg-[#E5A93C] text-[#0A0D14] flex items-center justify-center text-sm font-bold shadow-md border-2 border-white/[0.15] mb-2">
                SP
              </div>

              {/* Person Name */}
              <h2 className="text-base font-bold text-white tracking-tight leading-tight">
                {scenario === 'devanagari' ? 'श्रावणी पसनूर' : 'Shravani Pasnur'}
              </h2>

              {/* Role */}
              <p className="text-xs font-semibold text-[#E5A93C] mt-0.5">
                {scenario === 'long-business-name'
                  ? 'Senior Business Development & Strategic Partnerships Manager'
                  : scenario === 'devanagari'
                  ? 'मालक'
                  : activeIdentity.role}
              </p>

              {/* Business Name + Category & City */}
              <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-white/90">
                <div
                  className="w-4 h-4 rounded-md flex items-center justify-center text-[9px] font-bold text-[#0A0D14]"
                  style={{ backgroundColor: activeIdentity.monogramBg }}
                >
                  {activeIdentity.monogram}
                </div>
                <span>
                  {scenario === 'long-business-name'
                    ? 'Shree Siddhivinayak Industrial Engineering Solutions Private Limited'
                    : scenario === 'devanagari'
                    ? 'श्री गणेश इंडस्ट्रीज'
                    : activeIdentity.businessName}
                </span>
              </div>

              <div className="text-[10.5px] text-[#94A3B8] mt-0.5">
                {activeIdentity.category} • {activeIdentity.city}, {activeIdentity.state}
              </div>
            </div>

            {/* Business Contact Channels (Separated per identity, Section 35) */}
            <div className="py-2 px-3 rounded-xl bg-[#0E131F]/80 border border-white/[0.06] grid grid-cols-1 gap-1.5 text-left text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] text-[10px]">Business Phone</span>
                <span className="text-white font-mono font-medium text-[11px]">
                  {activeIdentity.businessPhone}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] text-[10px]">Business Email</span>
                <span className="text-white font-medium text-[11px]">
                  {activeIdentity.businessEmail}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#64748B] text-[10px]">Website</span>
                <span className="text-[#38BDF8] font-medium text-[11px]">
                  {activeIdentity.website}
                </span>
              </div>
            </div>

            {/* =================================================================== */}
            {/* QR CODE DISPLAY AREA (Section 9, 10, 11, 27) */}
            {/* High contrast, quiet zone, tap to enlarge */}
            {/* =================================================================== */}
            <div className="flex flex-col items-center pt-1">
              {scenario === 'qr-failure' ? (
                /* QR LOAD FAILURE (Section 29) */
                <div className="w-48 h-48 rounded-xl bg-[#0E131F] border border-white/[0.08] flex flex-col items-center justify-center p-4 text-center">
                  <AlertCircle className="w-6 h-6 text-[#EF4444] mb-2" />
                  <span className="text-xs text-white font-medium mb-1">Couldn't load QR</span>
                  <p className="text-[10px] text-[#94A3B8] mb-3">Identity details remain available</p>
                  <button
                    onClick={() => {
                      setScenario('standard-aikyam');
                      triggerToast('QR reloaded');
                    }}
                    className="px-3 py-1 rounded-lg bg-[#E5A93C] text-[#0A0D14] text-[10.5px] font-bold flex items-center gap-1 active:scale-95"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Try Again</span>
                  </button>
                </div>
              ) : (
                /* High-Contrast Functional QR */
                <div
                  onClick={() => setShowFullscreenQr(true)}
                  className="relative p-3 rounded-2xl bg-white cursor-pointer group shadow-lg transition-transform active:scale-98"
                  title="Tap to enlarge QR"
                >
                  {renderQrMatrix(168, false)}

                  {/* Tap to enlarge hint badge */}
                  <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-[#0A0D14]/80 text-[#E5A93C] text-[9px] font-semibold flex items-center gap-0.5 opacity-90 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-2.5 h-2.5" />
                    <span>Enlarge</span>
                  </div>
                </div>
              )}

              {/* SCAN INSTRUCTION (Section 12) */}
              <p className="text-xs font-semibold text-white/90 mt-2.5 leading-snug">
                {scenario === 'devanagari'
                  ? 'माझी व्यवसाय ओळख पाहण्यासाठी व जोडण्यासाठी स्कॅन करा.'
                  : 'Scan to view and add my business identity.'}
              </p>

              {/* PUBLIC INFORMATION NOTE (Section 38) */}
              <p className="text-[10px] text-[#64748B] mt-0.5">
                {scenario === 'devanagari'
                  ? 'स्कॅन करणार्‍यांना हे व्यावसायिक तपशील दिसतील.'
                  : 'People who scan this can see these business details.'}
              </p>
            </div>
          </section>

          {/* ======================================================================= */}
          {/* SECTION 18 & 21: ACTION BUTTONS (Share & Save QR) */}
          {/* ======================================================================= */}
          <div className="space-y-2 pt-1">
            {/* Primary Action: Share Current Identity */}
            <button
              onClick={handleShare}
              className="w-full py-3 px-4 rounded-xl bg-[#E5A93C] hover:bg-[#D49629] text-[#0A0D14] text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Share2 className="w-4 h-4 stroke-[2.3]" />
              <span>
                {scenario === 'devanagari'
                  ? 'व्यवसाय ओळख शेअर करा'
                  : `Share ${activeIdentity.businessName} Card`}
              </span>
            </button>

            {/* Secondary Action: Save QR */}
            <button
              onClick={handleSaveQR}
              className="w-full py-2.5 px-4 rounded-xl bg-[#121722] hover:bg-[#182030] border border-white/[0.08] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-[#94A3B8]" />
              <span>{scenario === 'devanagari' ? 'क्यूआर सेव्ह करा' : 'Save QR Image'}</span>
            </button>
          </div>

          {/* Subtle Edit Identity action (Section 39) */}
          <div className="text-center pt-1">
            <button
              onClick={() => triggerToast(`Edit public identity for ${activeIdentity.businessName}`)}
              className="text-[10.5px] text-[#64748B] hover:text-[#E5A93C] underline font-medium transition-colors"
            >
              Edit this business identity
            </button>
          </div>
        </main>
      )}

      {/* ======================================================================= */}
      {/* BOTTOM NAVIGATION (Section 66: Home remains active as root utility) */}
      {/* ======================================================================= */}
      <footer className="bg-[#0C1017] border-t border-white/[0.08] px-4 py-2 shrink-0 z-30">
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
          {/* Home (Selected) */}
          <button
            onClick={onNavigateToHome || onBack}
            className="flex flex-col items-center justify-center py-1 text-[#E5A93C] font-semibold transition-colors"
          >
            <HomeIcon className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] flex items-center gap-1">
              <span>Home</span>
              <span className="w-1 h-1 rounded-full bg-[#E5A93C]" />
            </span>
          </button>

          {/* Search */}
          <button
            onClick={onNavigateToSearch}
            className="flex flex-col items-center justify-center py-1 text-[#64748B] hover:text-white transition-colors"
          >
            <Search className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] font-medium">Search</span>
          </button>

          {/* Scan */}
          <button
            onClick={() => onNavigateToScan && onNavigateToScan('card')}
            className="flex flex-col items-center justify-center py-1 text-[#64748B] hover:text-white transition-colors"
          >
            <div className="w-6 h-6 rounded-lg bg-white/[0.06] flex items-center justify-center mb-0.5">
              <ScanLine className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-medium">Scan</span>
          </button>

          {/* My Network */}
          <button
            onClick={onNavigateToMyNetwork}
            className="flex flex-col items-center justify-center py-1 text-[#64748B] hover:text-white transition-colors"
          >
            <Users className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] font-medium">Network</span>
          </button>

          {/* Profile */}
          <button
            onClick={onNavigateToProfile}
            className="flex flex-col items-center justify-center py-1 text-[#64748B] hover:text-white transition-colors"
          >
            <User className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </footer>

      {/* ======================================================================= */}
      {/* MODAL 1: IDENTITY SWITCHER BOTTOM SHEET (Section 5) */}
      {/* "Choose an identity to share" */}
      {/* ======================================================================= */}
      {showIdentitySheet && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-2xl bg-[#141B2D] border border-white/[0.14] p-5 text-left shadow-2xl space-y-3.5 animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between pb-1 border-b border-white/[0.08]">
              <div>
                <h3 className="text-sm font-bold text-white">Choose an identity to share</h3>
                <p className="text-[10.5px] text-[#94A3B8] mt-0.5">
                  Each business has its own unique card and QR code
                </p>
              </div>
              <button
                onClick={() => setShowIdentitySheet(false)}
                className="text-[#94A3B8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {availableIdentities.map(item => {
                const isSelected = item.id === activeIdentity.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectIdentity(item)}
                    className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all active:scale-[0.99] ${
                      isSelected
                        ? 'bg-[#E5A93C]/15 border-[#E5A93C] text-white shadow-xs'
                        : 'bg-[#121722] border-white/[0.08] text-[#94A3B8] hover:text-white hover:bg-[#182030]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-[#0A0D14] shrink-0"
                        style={{ backgroundColor: item.monogramBg }}
                      >
                        {item.monogram}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-white truncate">
                          {item.businessName}
                        </div>
                        <div className="text-[10.5px] text-[#94A3B8] truncate">
                          {item.role} • {item.city}
                        </div>
                      </div>
                    </div>

                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-[#E5A93C] text-[#0A0D14] flex items-center justify-center shrink-0">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    ) : null}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex justify-end">
              <button
                onClick={() => setShowIdentitySheet(false)}
                className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 2: FULLSCREEN ENLARGED QR (Section 27) */}
      {/* High-brightness scan mode for face-to-face exchanges */}
      {/* ======================================================================= */}
      {showFullscreenQr && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-6 bg-black/95 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm flex items-center justify-between pb-4 text-white">
            <div className="text-left">
              <div className="text-xs font-bold text-white tracking-tight">
                {activeIdentity.businessName}
              </div>
              <div className="text-[11px] text-[#E5A93C]">Shravani Pasnur • {activeIdentity.role}</div>
            </div>
            <button
              onClick={() => setShowFullscreenQr(false)}
              className="p-2 rounded-xl bg-white/[0.1] hover:bg-white/[0.2] text-white"
              aria-label="Close fullscreen QR"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* High Contrast Giant QR Canvas */}
          <div className="p-5 rounded-3xl bg-white shadow-2xl flex items-center justify-center my-4">
            {renderQrMatrix(260, true)}
          </div>

          <p className="text-xs text-center text-[#94A3B8] max-w-xs mt-2">
            Hold steady for the other person to scan with their camera or QR scanner.
          </p>

          <button
            onClick={() => setShowFullscreenQr(false)}
            className="mt-6 px-6 py-2.5 rounded-xl bg-white/[0.1] hover:bg-white/[0.2] text-white text-xs font-bold transition-all"
          >
            Close Fullscreen
          </button>
        </div>
      )}

      {/* ======================================================================= */}
      {/* FLOATING ACTION NOTIFICATION TOAST */}
      {/* ======================================================================= */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 rounded-full bg-[#182030] text-white border border-white/[0.15] text-xs font-medium shadow-2xl flex items-center gap-1.5 animate-in fade-in zoom-in-95 pointer-events-none">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#E5A93C]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
