import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Zap, 
  ZapOff, 
  Image as ImageIcon, 
  QrCode, 
  CreditCard, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Settings, 
  Sparkles,
  Camera,
  Sun,
  ShieldAlert,
  HelpCircle,
  Crop
} from 'lucide-react';
import { DESIGN_TOKENS } from '../design-system/tokens';

export type ScannerMode = 'card' | 'qr';
export type FlashMode = 'off' | 'on' | 'auto';
export type DetectionState = 
  | 'fit-card' 
  | 'partly-outside' 
  | 'too-far' 
  | 'too-close' 
  | 'hold-steady' 
  | 'low-light' 
  | 'glare' 
  | 'detected';

export type CameraSystemState = 
  | 'ready' 
  | 'permission-first-use' 
  | 'permission-denied' 
  | 'camera-unavailable' 
  | 'processing' 
  | 'capture-frozen' 
  | 'error-unreadable' 
  | 'error-cropped' 
  | 'qr-success' 
  | 'qr-invalid';

interface CameraScannerScreenProps {
  onClose: () => void;
  onCaptureSuccess: () => void;
  onGallerySelect: () => void;
  onQrDetected?: () => void;
  initialMode?: ScannerMode;
  isLargeTextMode?: boolean;
}

export const CameraScannerScreen: React.FC<CameraScannerScreenProps> = ({
  onClose,
  onCaptureSuccess,
  onGallerySelect,
  onQrDetected,
  initialMode = 'card',
  isLargeTextMode = false,
}) => {
  // Scanner state
  const [mode, setMode] = useState<ScannerMode>(initialMode);
  const [flash, setFlash] = useState<FlashMode>('off');
  const [detectionState, setDetectionState] = useState<DetectionState>('fit-card');
  const [systemState, setSystemState] = useState<CameraSystemState>('ready');
  const [isShutterActive, setIsShutterActive] = useState<boolean>(false);
  const [shutterFlashEffect, setShutterFlashEffect] = useState<boolean>(false);
  const [simulatedCardPosition, setSimulatedCardPosition] = useState<'entering' | 'centered'>('entering');

  // Timers ref for cleanup
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Guided demo simulation sequence when camera opens in Card mode
  useEffect(() => {
    if (systemState !== 'ready') return;

    if (mode === 'card') {
      // 1. Initial entering state
      setDetectionState('fit-card');
      setSimulatedCardPosition('entering');

      // 2. Card moves into alignment after 900ms
      const t1 = setTimeout(() => {
        setSimulatedCardPosition('centered');
        setDetectionState('hold-steady');
      }, 1000);

      // 3. Card detected after another 900ms
      const t2 = setTimeout(() => {
        setDetectionState('detected');
      }, 2000);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    } else {
      // In QR mode: auto-detects QR without requiring shutter press
      setDetectionState('fit-card');
      const tQR = setTimeout(() => {
        setSystemState('qr-success');
        if (onQrDetected) {
          const tNav = setTimeout(() => {
            onQrDetected();
          }, 800);
          return () => clearTimeout(tNav);
        }
      }, 1600);

      return () => {
        clearTimeout(tQR);
      };
    }
  }, [mode, systemState, onQrDetected]);

  // Flash cycle toggle (Off -> On -> Auto)
  const handleToggleFlash = () => {
    setFlash((prev) => {
      if (prev === 'off') return 'on';
      if (prev === 'on') return 'auto';
      return 'off';
    });
  };

  // User taps shutter button
  const handleShutterPress = () => {
    if (isShutterActive || systemState !== 'ready') return;

    setIsShutterActive(true);
    setShutterFlashEffect(true);

    // Trigger brief screen flash
    setTimeout(() => {
      setShutterFlashEffect(false);
      setSystemState('capture-frozen');
    }, 180);

    // Transition to indeterminate processing "Reading card..."
    setTimeout(() => {
      setSystemState('processing');
    }, 900);

    // Navigate to Screen 9 (Review Extracted Contact)
    setTimeout(() => {
      setIsShutterActive(false);
      onCaptureSuccess();
    }, 2400);
  };

  // Guidance copy mapping
  const getGuidanceText = () => {
    if (mode === 'qr') {
      return 'Position the QR code inside the frame';
    }

    switch (detectionState) {
      case 'fit-card':
        return 'Fit the card inside the frame';
      case 'partly-outside':
        return 'Move the card into the frame';
      case 'too-far':
        return 'Move closer';
      case 'too-close':
        return 'Move back slightly';
      case 'hold-steady':
        return 'Hold steady';
      case 'low-light':
        return 'More light needed';
      case 'glare':
        return 'Reduce glare';
      case 'detected':
        return 'Card detected';
      default:
        return 'Fit the card inside the frame';
    }
  };

  return (
    <div
      id="screen-8-camera-scanner"
      className="relative h-full w-full select-none overflow-hidden bg-black text-[#F8FAFC] flex flex-col justify-between"
      style={{
        fontFamily: DESIGN_TOKENS.typography.fontFamily,
      }}
    >
      {/* ============================================================= */}
      {/* 1. SIMULATED CAMERA FEED BACKGROUND (FULL BLEED)             */}
      {/* ============================================================= */}
      <div 
        className="absolute inset-0 pointer-events-none overflow-hidden"
        style={{
          background: 'radial-gradient(circle at 50% 45%, #182030 0%, #0D121D 60%, #05070B 100%)',
        }}
      >
        {/* Subtle camera lens vignette & sensor grid simulation */}
        <div 
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.2) 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Ambient lighting gradient */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-[#E5A93C]/[0.04] blur-3xl" />
        <div className="absolute bottom-1/3 -right-20 w-80 h-80 rounded-full bg-blue-500/[0.03] blur-3xl" />

        {/* Camera exposure / shutter flash effect */}
        {shutterFlashEffect && (
          <div className="absolute inset-0 z-50 bg-white animate-fade-out transition-opacity duration-150" />
        )}
      </div>

      {/* ============================================================= */}
      {/* 2. TOP CONTROLS (SAFE AREA OVERLAY)                           */}
      {/* ============================================================= */}
      <div className="relative z-30 pt-3 px-4 flex items-center justify-between">
        {/* Close Button (Exits to Screen 7) */}
        <button
          id="btn-camera-close"
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white hover:bg-black/80 flex items-center justify-center transition-all active:scale-95 shadow-md"
          aria-label="Close scanner"
          title="Close scanner and return to previous screen"
        >
          <X className="w-5 h-5 stroke-[2.2]" />
        </button>

        {/* Minimal Mode/Status Badge */}
        <div className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-semibold text-[#CBD5E1] tracking-wide flex items-center gap-1.5 shadow-sm">
          <span 
            className={`w-2 h-2 rounded-full ${
              detectionState === 'detected' ? 'bg-[#10B981]' : 'bg-[#E5A93C] animate-pulse'
            }`} 
          />
          <span>{mode === 'card' ? 'Business Card Scan' : 'Digital QR Scan'}</span>
        </div>

        {/* Flash Toggle Button (Off -> On -> Auto) */}
        <button
          id="btn-camera-flash"
          type="button"
          onClick={handleToggleFlash}
          className={`h-10 px-3 rounded-full backdrop-blur-md border transition-all flex items-center gap-1.5 active:scale-95 shadow-md ${
            flash === 'on'
              ? 'bg-[#E5A93C] border-[#E5A93C] text-[#0A0D14] font-bold'
              : flash === 'auto'
              ? 'bg-black/60 border-amber-400/50 text-amber-300 font-semibold'
              : 'bg-black/60 border-white/20 text-[#CBD5E1] hover:text-white'
          }`}
          aria-label={`Flash mode: ${flash}`}
          title={`Flash: ${flash.toUpperCase()}`}
        >
          {flash === 'off' ? (
            <>
              <ZapOff className="w-4 h-4" />
              <span className="text-[10px] font-medium">Off</span>
            </>
          ) : flash === 'on' ? (
            <>
              <Zap className="w-4 h-4 fill-current" />
              <span className="text-[10px]">On</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4" />
              <span className="text-[10px]">Auto</span>
            </>
          )}
        </button>
      </div>

      {/* ============================================================= */}
      {/* 3. CENTRAL VIEWFINDER & DETECTION CORNERS                     */}
      {/* ============================================================= */}
      <div className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 my-auto">
        
        {/* Dynamic Guidance Pill above viewfinder */}
        <div className="mb-3 px-4 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-center shadow-lg transition-all duration-200">
          <p 
            className={`text-xs font-semibold flex items-center gap-1.5 ${
              detectionState === 'detected'
                ? 'text-[#10B981]'
                : detectionState === 'low-light' || detectionState === 'glare'
                ? 'text-amber-300'
                : 'text-white'
            }`}
          >
            {detectionState === 'detected' ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
            ) : detectionState === 'low-light' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : detectionState === 'glare' ? (
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
            ) : null}
            <span>{getGuidanceText()}</span>
          </p>
        </div>

        {/* =========================================================== */}
        {/* DETECTION FRAME CONTAINER (CARD VS QR ASPECT RATIO)         */}
        {/* =========================================================== */}
        <div
          id="scanner-detection-frame"
          className={`relative transition-all duration-300 ease-out flex items-center justify-center ${
            mode === 'card' 
              ? 'w-[86%] max-w-[340px] aspect-[1.65/1]' 
              : 'w-[74%] max-w-[260px] aspect-square'
          }`}
        >
          {/* CORNER DETECTION MARKERS (High-contrast gold accent with drop shadow) */}
          {/* Top-Left Corner */}
          <div 
            className={`absolute top-0 left-0 w-6 h-6 border-t-[3.5px] border-l-[3.5px] rounded-tl-lg transition-all duration-300 ${
              detectionState === 'detected'
                ? 'border-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                : 'border-[#E5A93C] shadow-[0_2px_8px_rgba(0,0,0,0.8)]'
            }`}
          />

          {/* Top-Right Corner */}
          <div 
            className={`absolute top-0 right-0 w-6 h-6 border-t-[3.5px] border-r-[3.5px] rounded-tr-lg transition-all duration-300 ${
              detectionState === 'detected'
                ? 'border-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                : 'border-[#E5A93C] shadow-[0_2px_8px_rgba(0,0,0,0.8)]'
            }`}
          />

          {/* Bottom-Left Corner */}
          <div 
            className={`absolute bottom-0 left-0 w-6 h-6 border-b-[3.5px] border-l-[3.5px] rounded-bl-lg transition-all duration-300 ${
              detectionState === 'detected'
                ? 'border-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                : 'border-[#E5A93C] shadow-[0_2px_8px_rgba(0,0,0,0.8)]'
            }`}
          />

          {/* Bottom-Right Corner */}
          <div 
            className={`absolute bottom-0 right-0 w-6 h-6 border-b-[3.5px] border-r-[3.5px] rounded-br-lg transition-all duration-300 ${
              detectionState === 'detected'
                ? 'border-[#10B981] shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                : 'border-[#E5A93C] shadow-[0_2px_8px_rgba(0,0,0,0.8)]'
            }`}
          />

          {/* Subtle Viewfinder Center Reticle */}
          <div className="absolute w-2 h-2 rounded-full bg-white/20 pointer-events-none" />

          {/* ========================================================= */}
          {/* SIMULATED CARD / QR CONTENT INSIDE CAMERA FEED           */}
          {/* ========================================================= */}
          {mode === 'card' ? (
            /* Physical Business Card (Arjun Deshmukh from Screen 7) */
            <div 
              className={`w-[94%] h-[92%] rounded-lg p-3 text-[#0F172A] shadow-2xl relative overflow-hidden transition-all duration-500 transform ${
                simulatedCardPosition === 'entering'
                  ? 'translate-y-4 rotate-1 scale-95 opacity-80'
                  : 'translate-y-0 rotate-0 scale-100 opacity-95'
              }`}
              style={{
                background: 'linear-gradient(135deg, #F8FAFC 0%, #EDEFEA 100%)',
                boxShadow: '0 12px 32px -4px rgba(0, 0, 0, 0.7)',
              }}
            >
              {/* Gold foil edge line on card */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B]" />
              
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-extrabold text-xs sm:text-sm tracking-tight text-[#0F172A] uppercase">
                    Arjun Deshmukh
                  </p>
                  <p className="text-[10px] font-semibold text-[#B45309]">
                    Sales Manager
                  </p>
                </div>

                <div className="w-6 h-6 rounded bg-[#0F172A] text-amber-400 flex items-center justify-center font-bold text-[10px] shrink-0">
                  V
                </div>
              </div>

              <div className="mt-1.5 pt-1.5 border-t border-black/[0.08]">
                <p className="font-bold text-[11px] text-[#1E293B] truncate">
                  Vertex Industrial Solutions
                </p>
                <div className="mt-1 grid grid-cols-2 gap-x-1 text-[9px] text-[#475569] font-medium">
                  <span className="truncate">+91 98220 45871</span>
                  <span className="truncate">arjun@vertexindustrial.in</span>
                </div>
              </div>

              {/* Subtly animated scanning alignment line */}
              {detectionState !== 'detected' && (
                <div className="absolute left-0 right-0 h-[1.5px] bg-[#E5A93C]/70 shadow-[0_0_8px_#E5A93C] animate-pulse pointer-events-none top-1/2 -translate-y-1/2" />
              )}
            </div>
          ) : (
            /* QR Mode: Simulated QR Code Pattern */
            <div className="w-[84%] h-[84%] bg-white rounded-xl p-3 shadow-2xl flex flex-col items-center justify-center relative">
              {/* Stylized QR Matrix Pattern */}
              <div className="w-full h-full border-4 border-black p-2 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-8 h-8 border-4 border-black flex items-center justify-center">
                    <div className="w-3.5 h-3.5 bg-black" />
                  </div>
                  <div className="w-8 h-8 border-4 border-black flex items-center justify-center">
                    <div className="w-3.5 h-3.5 bg-black" />
                  </div>
                </div>

                <div className="text-center font-mono text-[9px] font-bold text-black tracking-widest uppercase">
                  AIKYAM•ID
                </div>

                <div className="flex justify-between">
                  <div className="w-8 h-8 border-4 border-black flex items-center justify-center">
                    <div className="w-3.5 h-3.5 bg-black" />
                  </div>
                  <div className="w-6 h-6 border-2 border-black flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-black" />
                  </div>
                </div>
              </div>

              {/* Subtle Scanning Beam */}
              <div className="absolute inset-x-2 h-1 bg-[#E5A93C] shadow-[0_0_12px_#E5A93C] animate-pulse top-1/2" />
            </div>
          )}

        </div>

      </div>

      {/* ============================================================= */}
      {/* 4. BOTTOM CONTROLS: MODE TOGGLE + SHUTTER + GALLERY           */}
      {/* ============================================================= */}
      <div className="relative z-30 pb-5 pt-2 px-6 flex flex-col items-center gap-3 bg-gradient-to-t from-black via-black/80 to-transparent">
        
        {/* =========================================================== */}
        {/* MODE SELECTOR (CARD VS QR)                                  */}
        {/* =========================================================== */}
        <div 
          id="scanner-mode-selector"
          className="flex items-center p-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 shadow-md"
        >
          <button
            type="button"
            onClick={() => setMode('card')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mode === 'card'
                ? 'bg-[#E5A93C] text-[#0A0D14] shadow-sm'
                : 'text-[#94A3B8] hover:text-white'
            }`}
            aria-label="Card scanning mode"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Card</span>
          </button>

          <button
            type="button"
            onClick={() => setMode('qr')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
              mode === 'qr'
                ? 'bg-[#E5A93C] text-[#0A0D14] shadow-sm'
                : 'text-[#94A3B8] hover:text-white'
            }`}
            aria-label="QR scanning mode"
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>QR</span>
          </button>
        </div>

        {/* =========================================================== */}
        {/* SHUTTER & GALLERY CONTROL BAR                               */}
        {/* =========================================================== */}
        <div className="w-full max-w-[340px] flex items-center justify-between pt-1">
          
          {/* Gallery Button (Secondary Action on the left) */}
          <button
            id="btn-scanner-gallery"
            type="button"
            onClick={onGallerySelect}
            className="w-12 h-12 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 text-[#CBD5E1] hover:text-white hover:border-white/40 flex flex-col items-center justify-center gap-0.5 transition-all active:scale-95 shadow-md"
            aria-label="Choose card from gallery"
            title="Import card image from photo gallery"
          >
            <ImageIcon className="w-5 h-5 text-[#CBD5E1]" />
            <span className="text-[8px] font-medium tracking-tight">Gallery</span>
          </button>

          {/* Central Circular Camera Shutter Button */}
          <div className="relative flex items-center justify-center">
            {/* Pulsing Guide Ring when card is detected */}
            {detectionState === 'detected' && mode === 'card' && (
              <div className="absolute -inset-2 rounded-full border-2 border-[#E5A93C] animate-ping opacity-30 pointer-events-none" />
            )}

            <button
              id="btn-camera-shutter"
              type="button"
              onClick={handleShutterPress}
              disabled={isShutterActive}
              className={`w-[72px] h-[72px] rounded-full p-1 border-4 transition-all duration-150 flex items-center justify-center active:scale-90 shadow-2xl ${
                detectionState === 'detected'
                  ? 'border-[#E5A93C] hover:border-amber-300'
                  : 'border-white/80 hover:border-white'
              }`}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
              }}
              aria-label="Capture business card"
              title="Tap to capture card photo"
            >
              {/* Inner Solid Shutter Disc */}
              <div 
                className={`w-[56px] h-[56px] rounded-full transition-all duration-150 flex items-center justify-center ${
                  detectionState === 'detected'
                    ? 'bg-[#E5A93C] text-[#0A0D14]'
                    : 'bg-white text-black'
                } ${isShutterActive ? 'scale-85' : 'scale-100'}`}
              >
                <Camera className="w-5 h-5 opacity-40" />
              </div>
            </button>
          </div>

          {/* Right Spacer / Crop Orientation Indicator for Balance */}
          <div className="w-12 h-12 flex items-center justify-center">
            <button
              type="button"
              onClick={() => {
                // Toggle between entering and centered state for quick reviewer inspection
                setSimulatedCardPosition(prev => prev === 'centered' ? 'entering' : 'centered');
                setDetectionState(prev => prev === 'detected' ? 'hold-steady' : 'detected');
              }}
              className="w-9 h-9 rounded-full bg-black/40 border border-white/10 flex items-center justify-center text-[#94A3B8] hover:text-white transition-all text-xs"
              title="Test card positioning alignment"
              aria-label="Toggle card position"
            >
              <Crop className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* ============================================================= */}
      {/* 5. OVERLAY MODALS FOR SYSTEM STATES / PERMISSIONS / ERRORS     */}
      {/* ============================================================= */}

      {/* STATE A: PROCESSING CAPTURE ("Reading card...") */}
      {systemState === 'processing' && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center px-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-[#141B29] border border-[#E5A93C]/40 flex items-center justify-center text-[#E5A93C] mb-4 shadow-xl">
            <RefreshCw className="w-8 h-8 animate-spin" />
          </div>

          <h3 className="text-base font-bold text-white tracking-tight">
            Reading card...
          </h3>

          <p className="text-xs text-[#94A3B8] mt-1 max-w-[240px]">
            Organizing contact details for review.
          </p>

          <div className="mt-5 w-44 h-1 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#E5A93C] to-amber-200 animate-pulse w-3/4 rounded-full" />
          </div>
        </div>
      )}

      {/* STATE B: QR SUCCESS ("Identity found") */}
      {systemState === 'qr-success' && (
        <div className="absolute inset-0 z-50 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center px-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] mb-4 shadow-xl">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <h3 className="text-base font-bold text-white tracking-tight">
            Identity found
          </h3>

          <p className="text-xs text-[#94A3B8] mt-1 max-w-[240px]">
            Opening business identity details...
          </p>

          <button
            type="button"
            onClick={() => {
              if (onQrDetected) {
                onQrDetected();
              } else {
                setSystemState('ready');
                setMode('card');
              }
            }}
            className="mt-6 px-5 py-2.5 rounded-xl bg-[#E5A93C] text-[#0A0D14] font-bold text-xs shadow-lg active:scale-95 transition-transform"
          >
            {onQrDetected ? 'View Identity' : 'Return to Card Scanner'}
          </button>
        </div>
      )}

      {/* STATE C: PERMISSION FIRST USE */}
      {systemState === 'permission-first-use' && (
        <div className="absolute inset-0 z-50 bg-[#0A0D14]/95 backdrop-blur-md flex flex-col items-center justify-center px-6 text-center animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-[#141B29] border border-white/15 flex items-center justify-center text-[#E5A93C] mb-4">
            <Camera className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">Camera access is needed</h3>
          <p className="text-xs text-[#94A3B8] mt-1.5 max-w-[260px]">
            Allow camera access to scan business cards and QR codes.
          </p>
          <div className="mt-6 w-full max-w-[260px] space-y-2">
            <button
              onClick={() => setSystemState('ready')}
              className="w-full py-3 rounded-xl bg-[#E5A93C] text-[#0A0D14] font-bold text-xs shadow-md"
            >
              Allow Camera
            </button>
            <button
              onClick={() => {
                setSystemState('ready');
                onGallerySelect();
              }}
              className="w-full py-2.5 rounded-xl bg-[#141B29] text-[#CBD5E1] border border-white/10 font-semibold text-xs"
            >
              Choose from Gallery
            </button>
          </div>
        </div>
      )}

      {/* STATE D: PERMISSION DENIED */}
      {systemState === 'permission-denied' && (
        <div className="absolute inset-0 z-50 bg-[#0A0D14]/95 backdrop-blur-md flex flex-col items-center justify-center px-6 text-center animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">Camera access is off</h3>
          <p className="text-xs text-[#94A3B8] mt-1.5 max-w-[260px]">
            Turn it on in Settings to scan cards and QR codes.
          </p>
          <div className="mt-6 w-full max-w-[260px] space-y-2">
            <button
              onClick={() => setSystemState('ready')}
              className="w-full py-3 rounded-xl bg-[#E5A93C] text-[#0A0D14] font-bold text-xs shadow-md flex items-center justify-center gap-2"
            >
              <Settings className="w-4 h-4" />
              <span>Open Settings</span>
            </button>
            <button
              onClick={() => {
                setSystemState('ready');
                onGallerySelect();
              }}
              className="w-full py-2.5 rounded-xl bg-[#141B29] text-[#CBD5E1] border border-white/10 font-semibold text-xs"
            >
              Choose from Gallery
            </button>
          </div>
        </div>
      )}

      {/* STATE E: UNREADABLE IMAGE ERROR */}
      {systemState === 'error-unreadable' && (
        <div className="absolute inset-0 z-50 bg-[#0A0D14]/95 backdrop-blur-md flex flex-col items-center justify-center px-6 text-center animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-white">Card isn’t clear enough</h3>
          <p className="text-xs text-[#94A3B8] mt-1.5 max-w-[260px]">
            Hold steady and make sure the details are visible and well lit.
          </p>
          <div className="mt-6 w-full max-w-[260px] space-y-2">
            <button
              onClick={() => setSystemState('ready')}
              className="w-full py-3 rounded-xl bg-[#E5A93C] text-[#0A0D14] font-bold text-xs shadow-md"
            >
              Retake
            </button>
            <button
              onClick={() => {
                setSystemState('ready');
                onGallerySelect();
              }}
              className="w-full py-2.5 rounded-xl bg-[#141B29] text-[#CBD5E1] border border-white/10 font-semibold text-xs"
            >
              Choose from Gallery
            </button>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 6. PROTOTYPE REVIEWER STATE SWITCHER (BOTTOM SHEET DRAWER)   */}
      {/* ============================================================= */}
      <div className="absolute top-14 inset-x-4 z-40 flex items-center justify-center pointer-events-auto">
        <details className="group">
          <summary className="list-none cursor-pointer bg-black/70 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-full text-[10px] text-[#94A3B8] hover:text-white flex items-center gap-1 shadow-md">
            <span>Reviewer States</span>
            <span className="text-[#E5A93C]">▾</span>
          </summary>
          <div className="mt-1 bg-[#121722] border border-white/20 rounded-xl p-2.5 shadow-2xl space-y-2 text-[10px] w-64 max-h-56 overflow-y-auto">
            <div>
              <p className="text-[#94A3B8] font-semibold mb-1">Detection Guidance States:</p>
              <div className="grid grid-cols-2 gap-1">
                {(['fit-card', 'hold-steady', 'detected', 'low-light', 'glare'] as DetectionState[]).map(s => (
                  <button
                    key={s}
                    onClick={() => { setDetectionState(s); setSystemState('ready'); }}
                    className={`px-1.5 py-1 rounded text-left border ${
                      detectionState === s ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold' : 'border-white/5 text-[#94A3B8]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-1.5 border-t border-white/10">
              <p className="text-[#94A3B8] font-semibold mb-1">System & Error Variants:</p>
              <div className="grid grid-cols-2 gap-1">
                <button
                  onClick={() => setSystemState('permission-first-use')}
                  className="px-1.5 py-1 rounded text-left border border-white/5 text-[#94A3B8] hover:text-white"
                >
                  Perm: Needed
                </button>
                <button
                  onClick={() => setSystemState('permission-denied')}
                  className="px-1.5 py-1 rounded text-left border border-white/5 text-[#94A3B8] hover:text-white"
                >
                  Perm: Off
                </button>
                <button
                  onClick={() => setSystemState('error-unreadable')}
                  className="px-1.5 py-1 rounded text-left border border-white/5 text-[#94A3B8] hover:text-white"
                >
                  Card Unreadable
                </button>
                <button
                  onClick={() => setSystemState('ready')}
                  className="px-1.5 py-1 rounded text-left border border-[#10B981]/30 text-[#10B981]"
                >
                  Reset Ready
                </button>
              </div>
            </div>
          </div>
        </details>
      </div>

    </div>
  );
};
