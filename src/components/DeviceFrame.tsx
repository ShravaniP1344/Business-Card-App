import React, { useState } from 'react';
import { Smartphone, RotateCw, ShieldCheck, CheckCircle2, ChevronRight, Layers, SmartphoneCharging, Sparkles } from 'lucide-react';
import { DESIGN_TOKENS } from '../design-system/tokens';

export type DevicePreset = 'small-phone' | 'iphone-standard' | 'iphone-large' | 'fluid';

interface DeviceFrameProps {
  children?: React.ReactNode;
  isLargeText?: boolean;
  onToggleLargeText?: () => void;
  activeScreenLabel?: string;
  currentRoute?: string;
  onRouteChange?: (route: any) => void;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ 
  children, 
  isLargeText = false, 
  onToggleLargeText,
  activeScreenLabel = 'Screen 3 Active • Get Started / Demo Entry',
  currentRoute,
  onRouteChange
}) => {
  const [device, setDevice] = useState<DevicePreset>('iphone-standard');
  const [showSafeAreas, setShowSafeAreas] = useState<boolean>(true);

  const deviceDimensions: Record<DevicePreset, { width: string; height: string; label: string; sub: string }> = {
    'small-phone': { width: '360px', height: '640px', label: 'Small (360×640)', sub: '360 × 640 dp' },
    'iphone-standard': { width: '390px', height: '844px', label: 'Standard (390×844)', sub: '390 × 844 dp' },
    'iphone-large': { width: '430px', height: '932px', label: 'Large (430×932)', sub: '430 × 932 dp' },
    'fluid': { width: '100%', height: '100%', label: 'Fluid Mobile', sub: 'Adaptive 100%' },
  };

  const current = deviceDimensions[device] || deviceDimensions['iphone-standard'];

  return (
    <div className="min-h-screen w-full bg-[#07090E] text-[#F1F5F9] flex flex-col items-center select-none">
      {/* Top Prototype Control Bar (For UX Review and Device Testing) */}
      <header className="w-full border-b border-white/[0.08] bg-[#0C1019]/90 backdrop-blur-md px-4 py-2.5 z-50 sticky top-0 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C] font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>Business Network Prototype</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#E5A93C]/20 text-[#E5A93C] border border-[#E5A93C]/30">
                Flutter Spec
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              {activeScreenLabel}
            </p>
          </div>
        </div>

        {/* Screen Quick-Navigation for Prototype Testing */}
        {onRouteChange && (
          <div className="flex items-center gap-1 bg-[#141A27] p-1 rounded-xl border border-white/[0.08]">
            <button
              onClick={() => onRouteChange('welcome')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                currentRoute === 'welcome'
                  ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold shadow-xs'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Screen 1: Welcome
            </button>
            <button
              onClick={() => onRouteChange('signup')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                currentRoute === 'signup'
                  ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold shadow-xs'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Screen 2: Sign Up
            </button>
            <button
              onClick={() => onRouteChange('get-started')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                currentRoute === 'get-started'
                  ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold shadow-xs'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Screen 3: Get Started
            </button>
            <button
              onClick={() => onRouteChange('demo-search')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                currentRoute === 'demo-search'
                  ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold shadow-xs'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Screen 4: Demo 1
            </button>
            <button
              onClick={() => onRouteChange('demo-business-identity')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                currentRoute === 'demo-business-identity'
                  ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold shadow-xs'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Screen 5: Demo 2
            </button>
            <button
              onClick={() => onRouteChange('demo-other-person-side')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                currentRoute === 'demo-other-person-side'
                  ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold shadow-xs'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Screen 6: Mutual
            </button>
            <button
              onClick={() => onRouteChange('demo-physical-card-intro')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                currentRoute === 'demo-physical-card-intro'
                  ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold shadow-xs'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Screen 7: Card Intro
            </button>
            <button
              onClick={() => onRouteChange('camera-scanner')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                currentRoute === 'camera-scanner'
                  ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold shadow-xs'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Screen 8: Camera
            </button>
            <button
              onClick={() => onRouteChange('demo-review-screen9')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                currentRoute === 'demo-review-screen9'
                  ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold shadow-xs'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Screen 9: Review
            </button>
            <button
              onClick={() => onRouteChange('demo-network-screen10')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                currentRoute === 'demo-network-screen10'
                  ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold shadow-xs'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Screen 10: Payoff
            </button>
            <button
              onClick={() => onRouteChange('screen11-business-identity-setup')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                currentRoute === 'screen11-business-identity-setup'
                  ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold shadow-xs'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Screen 11: Setup
            </button>
            <button
              onClick={() => onRouteChange('screen12-business-identity-preview')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                currentRoute === 'screen12-business-identity-preview'
                  ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold shadow-xs'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Screen 12: Preview
            </button>
            <button
              onClick={() => onRouteChange('multiple-businesses-screen13')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                currentRoute === 'multiple-businesses-screen13'
                  ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold shadow-xs'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Screen 13: Multi-Biz
            </button>
            <button
              onClick={() => onRouteChange('screen14-onboarding-complete')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                currentRoute === 'screen14-onboarding-complete'
                  ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold shadow-xs'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Screen 14: You're All Set
            </button>
            <button
              onClick={() => onRouteChange('screen15-home')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                currentRoute === 'screen15-home'
                  ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold shadow-xs'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Screen 15: Home
            </button>
            <button
              onClick={() => onRouteChange('screen16-search')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                currentRoute === 'screen16-search'
                  ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold shadow-xs'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Screen 16: Search
            </button>
            <button
              onClick={() => onRouteChange('screen17-person-profile')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                currentRoute === 'screen17-person-profile'
                  ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold shadow-xs'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Screen 17: Person Profile
            </button>
            <button
              onClick={() => onRouteChange('screen18-business-profile')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                currentRoute === 'screen18-business-profile'
                  ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold shadow-xs'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Screen 18: Business Profile
            </button>
            <button
              onClick={() => onRouteChange('screen19-my-network')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                currentRoute === 'screen19-my-network'
                  ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold shadow-xs'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Screen 19: My Network
            </button>
            <button
              onClick={() => onRouteChange('screen20-contact-detail')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                currentRoute === 'screen20-contact-detail'
                  ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold shadow-xs'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Screen 20: Contact Detail
            </button>
            <button
              onClick={() => onRouteChange('screen21-my-qr')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                currentRoute === 'screen21-my-qr'
                  ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold shadow-xs'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Screen 21: My QR
            </button>
            <button
              onClick={() => onRouteChange('screen22-qr-result')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                currentRoute === 'screen22-qr-result'
                  ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold shadow-xs'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              Screen 22: QR Result
            </button>
          </div>
        )}

        {/* Viewport Dimension Switcher */}
        <div className="flex items-center gap-1.5 bg-[#141A27] p-1 rounded-xl border border-white/[0.08]">
          {(['small-phone', 'iphone-standard', 'iphone-large', 'fluid'] as DevicePreset[]).map((preset) => (
            <button
              key={preset}
              onClick={() => setDevice(preset)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-all flex items-center gap-1.5 text-[11px] ${
                device === preset
                  ? 'bg-[#E5A93C] text-[#0A0D14] shadow-sm font-semibold'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{deviceDimensions[preset]?.label ?? preset}</span>
            </button>
          ))}
        </div>

        {/* Safe Area & Accessibility Guideline Controls */}
        <div className="flex items-center gap-2 text-[#94A3B8]">
          {onToggleLargeText && (
            <button
              onClick={onToggleLargeText}
              className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 text-[11px] ${
                isLargeText
                  ? 'border-[#E5A93C]/40 text-[#E5A93C] bg-[#E5A93C]/10'
                  : 'border-white/[0.08] text-[#64748B] hover:text-white'
              }`}
              title="Toggle Large Accessibility Font Scale (Testing Edge Case)"
            >
              <span>Aa Scale {isLargeText ? '+20%' : '100%'}</span>
            </button>
          )}

          <button
            onClick={() => setShowSafeAreas(!showSafeAreas)}
            className={`px-2.5 py-1 rounded-lg border transition-all flex items-center gap-1.5 text-[11px] ${
              showSafeAreas
                ? 'border-[#E5A93C]/40 text-[#E5A93C] bg-[#E5A93C]/10'
                : 'border-white/[0.08] text-[#64748B] hover:text-white'
            }`}
            title="Toggle Safe Area Inset Guidelines"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Safe Areas {showSafeAreas ? 'ON' : 'OFF'}</span>
          </button>
          <span className="text-[10px] text-[#64748B] font-mono px-2 py-0.5 bg-[#141A27] rounded border border-white/[0.05]">
            {current.sub}
          </span>
        </div>
      </header>

      {/* Device Viewport Canvas */}
      <main className="flex-1 w-full flex items-center justify-center p-2 sm:p-6 overflow-auto">
        <div
          className={`transition-all duration-300 relative flex flex-col shadow-2xl overflow-hidden ${
            device === 'fluid'
              ? 'w-full max-w-[430px] h-[860px] rounded-[44px] border-[8px] border-[#1C2436]'
              : 'rounded-[44px] border-[8px] border-[#1C2436]'
          }`}
          style={{
            width: device === 'fluid' ? undefined : current.width,
            height: device === 'fluid' ? undefined : current.height,
            backgroundColor: DESIGN_TOKENS.colors.background,
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255,255,255,0.06)',
          }}
        >
          {/* Simulated Mobile Status Bar (iOS / Android Safe Inset) */}
          <div className="h-11 w-full flex-shrink-0 flex items-center justify-between px-6 select-none z-30 pt-1 text-white">
            <span className="text-[13px] font-semibold tracking-tight text-white/90">9:41</span>

            {/* Dynamic Island / Camera Notch */}
            <div className="w-24 h-5 bg-black rounded-full flex items-center justify-center gap-1.5 border border-white/[0.08]">
              <div className="w-2.5 h-2.5 rounded-full bg-[#10141E]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#1A263A]" />
            </div>

            <div className="flex items-center gap-1.5 text-[11px] text-white/90">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L12 22l7.03-4.39C20.26 16.07 21 14.12 21 12c0-4.97-4.03-9-9-9z"/>
              </svg>
              <div className="w-5 h-2.5 border border-white/80 rounded-sm p-[1px] flex items-center">
                <div className="w-3.5 h-full bg-white rounded-2xs" />
              </div>
            </div>
          </div>

          {/* Active Screen Slot */}
          <div className="flex-1 w-full overflow-hidden flex flex-col relative">
            {children}
          </div>

          {/* Simulated Bottom Gesture Indicator (Home Bar) */}
          <div className="h-6 w-full flex-shrink-0 flex items-center justify-center select-none z-30 pb-1">
            <div className="w-32 h-1 bg-white/30 rounded-full" />
          </div>

          {/* Visual Safe Area Guideline Overlays when enabled */}
          {showSafeAreas && (
            <div className="pointer-events-none absolute inset-0 z-40 border border-dashed border-[#E5A93C]/20 flex flex-col justify-between">
              <div className="h-11 border-b border-dashed border-[#E5A93C]/30 bg-[#E5A93C]/[0.02]" />
              <div className="h-6 border-t border-dashed border-[#E5A93C]/30 bg-[#E5A93C]/[0.02]" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
