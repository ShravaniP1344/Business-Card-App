import React from 'react';
import { ArrowLeft, Clock, ShieldAlert, Sparkles, UserPlus, LogIn } from 'lucide-react';
import { DESIGN_TOKENS } from '../design-system/tokens';

export type PlaceholderType = 'signup' | 'login' | 'demo-step1' | 'demo-step3' | 'demo-card-scan' | 'demo-camera-screen8' | 'demo-review-screen9' | 'demo-network-screen10' | 'business-setup' | 'business-preview-screen12' | 'multiple-businesses-screen13' | 'next-onboarding' | 'screen15-home';

interface PlaceholderScreenProps {
  type: PlaceholderType;
  onBack: () => void;
  registeredUserEmail?: string;
  previewData?: {
    personName?: string;
    businessName?: string;
    role?: string;
    category?: string;
    phone?: string;
    email?: string;
    website?: string;
    city?: string;
    state?: string;
  };
}

export const PlaceholderScreen: React.FC<PlaceholderScreenProps> = ({ 
  type, 
  onBack,
  registeredUserEmail,
  previewData
}) => {
  const isDemoStep1 = type === 'demo-step1';
  const isDemoStep3 = type === 'demo-step3';
  const isDemoCardScan = type === 'demo-card-scan';
  const isDemoCameraScreen8 = type === 'demo-camera-screen8';
  const isDemoReviewScreen9 = type === 'demo-review-screen9';
  const isDemoNetworkScreen10 = type === 'demo-network-screen10';
  const isBusinessSetup = type === 'business-setup';
  const isBusinessPreview12 = type === 'business-preview-screen12';
  const isMultipleBusinesses13 = type === 'multiple-businesses-screen13';
  const isNextOnboarding = type === 'next-onboarding';
  const isScreen15Home = type === 'screen15-home';
  const isSignUp = type === 'signup';
  const isLogin = type === 'login';

  const title = isDemoStep1 
    ? 'Interactive Demo (Step 1: Search)' 
    : isDemoStep3
      ? 'Screen 6 Placeholder • See What Happens Next'
      : isDemoCardScan
        ? 'Screen 7 • Physical Business Card Scanning'
        : isDemoCameraScreen8
          ? 'Screen 8 • Camera / Card Scanner'
          : isDemoReviewScreen9
            ? 'Screen 9 • Review Extracted Contact'
            : isDemoNetworkScreen10
              ? 'Screen 10 • My Network (Final Demo Payoff)'
              : isBusinessPreview12
                ? 'Screen 12 • Business Identity Preview'
                : isMultipleBusinesses13
                  ? 'Screen 13 • Do You Represent Another Business?'
                  : isNextOnboarding
                    ? 'Next Onboarding Step • Account Setup'
                    : isScreen15Home
                      ? 'Screen 15 • Home (The Real Application)'
                      : isBusinessSetup
                        ? 'Business Profile Setup'
                        : isSignUp 
                          ? 'Sign Up Screen' 
                          : 'Log In Screen';

  const stepBadge = isDemoStep1 
    ? 'Step 4 in Flow' 
    : isDemoStep3
      ? 'Screen 6 in Flow'
      : isDemoCardScan
        ? 'Screen 7 in Flow'
        : isDemoCameraScreen8
          ? 'Screen 8 in Flow'
          : isDemoReviewScreen9
            ? 'Screen 9 in Flow'
            : isDemoNetworkScreen10
              ? 'Screen 10 in Flow'
              : isBusinessPreview12
                ? 'Screen 12 in Flow'
                : isMultipleBusinesses13
                  ? 'Screen 13 in Flow'
                  : isNextOnboarding
                    ? 'Next Step'
                    : isScreen15Home
                      ? 'Screen 15 • App Entry'
                      : isBusinessSetup
                        ? 'Step 5 in Flow'
                        : isSignUp
                      ? 'Step 2 in Flow'
                      : 'Returning User';

  const description = isDemoStep1
    ? 'This is the planned first interactive demonstration screen (e.g. Discovery / Search) showing how connections are made.'
    : isDemoStep3
      ? 'This is Screen 6: Demonstrates Rahul receiving the notification ("Shravani added you to their network") and independently choosing whether to add Shravani back.'
    : isDemoCardScan
      ? 'This is Screen 7: Introducing physical business card scanning as another way of adding connections.'
      : isDemoCameraScreen8
        ? 'This will be Screen 8: Camera interface for card alignment, auto-shutter capture, crop framing, and gallery photo import.'
        : isDemoReviewScreen9
          ? 'This will be Screen 9: Reviewing structured fields extracted from the scanned business card (with check indicators and duplicate prevention).'
          : isDemoNetworkScreen10
            ? 'This will be Screen 10: Unifying Rahul (registered digital profile) and Arjun (scanned private business card) together inside My Network before proceeding to profile setup.'
            : isBusinessPreview12
              ? 'This will be Screen 12: Business Identity Preview showing your completed digital card (Person + Business + Role + Professional Contacts) with Edit and Confirm actions.'
              : isMultipleBusinesses13
                ? 'This will be Screen 13: "Do you represent another business?" introducing the multi-business capability where one account can manage multiple digital identities.'
                : isNextOnboarding
                  ? 'After business identity confirmation, onboarding moves to remaining account-level setup. (Pricing, trial duration, and plan limits have been intentionally excluded until commercial decisions are frozen).'
                  : isScreen15Home
                    ? 'Onboarding complete! This will be the first screen of the live application featuring the persistent bottom navigation: Home, Search, Scan, My Network, and Profile. (Do not create Screen 15 now).'
                    : isBusinessSetup
                      ? 'This is the planned Business Profile Setup where users enter business name, services, category, and digital card appearance.'
                      : isSignUp
                        ? 'This is the planned next screen for new user registration in the onboarding order.'
                        : 'This is the planned login entry for returning registered members.';

  return (
    <div
      id={`screen-placeholder-${type}`}
      className="h-full w-full flex flex-col justify-between overflow-y-auto px-5 py-4 text-[#F8FAFC]"
      style={{ backgroundColor: DESIGN_TOKENS.colors.background }}
    >
      {/* Top Navigation Bar with Back Button */}
      <div className="flex items-center justify-between pt-1">
        <button
          id={`btn-back-from-${type}`}
          onClick={onBack}
          className="h-10 px-3 rounded-xl bg-[#121722] border border-white/[0.08] hover:border-white/[0.2] flex items-center gap-2 text-xs font-medium text-[#94A3B8] hover:text-white transition-all active:scale-[0.98]"
          style={{ minHeight: DESIGN_TOKENS.touchTarget.minHeight }}
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4 text-[#E5A93C]" />
          <span>{isBusinessPreview12 ? 'Back to Setup' : isDemoStep1 || isBusinessSetup ? 'Back to Screen 3' : 'Back to Welcome'}</span>
        </button>

        <span className="text-[11px] font-semibold text-[#64748B] uppercase tracking-wider px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06]">
          {stepBadge}
        </span>
      </div>

      {/* Center Informational State */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 space-y-4 my-auto">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg"
          style={{
            backgroundColor: DESIGN_TOKENS.colors.surface,
            borderColor: 'rgba(229, 169, 60, 0.3)',
            color: DESIGN_TOKENS.colors.accent,
          }}
        >
          {isDemoStep1 ? (
            <Sparkles className="w-7 h-7" />
          ) : isBusinessPreview12 ? (
            <Sparkles className="w-7 h-7" />
          ) : isBusinessSetup ? (
            <UserPlus className="w-7 h-7" />
          ) : isSignUp ? (
            <UserPlus className="w-7 h-7" />
          ) : (
            <LogIn className="w-7 h-7" />
          )}
        </div>

        <div className="space-y-1.5 max-w-[290px]">
          <h2 className="text-lg font-bold text-white tracking-tight">
            {title}
          </h2>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            {description}
          </p>
        </div>

        {/* Protocol Confirmation Badge */}
        <div className="p-3 rounded-xl bg-[#121722] border border-white/[0.06] text-left w-full max-w-[300px] space-y-1.5">
          <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#E5A93C]">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>Reserved for Upcoming Prompt</span>
          </div>
          <p className="text-[10px] text-[#64748B] leading-normal">
            Adhering strictly to Rule #1: "We will design this application ONE SCREEN AT A TIME. Do NOT generate the entire application at once."
          </p>
        </div>
      </div>

      {/* Bottom Safe Action to Return */}
      <div className="pt-3 pb-1">
        <button
          id={`btn-return-${type}`}
          onClick={onBack}
          className="w-full h-[48px] rounded-xl font-medium border border-white/[0.12] bg-[#121722] hover:bg-[#182030] text-[#F8FAFC] text-xs flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
          style={{ minHeight: DESIGN_TOKENS.touchTarget.minHeight }}
        >
          <ArrowLeft className="w-4 h-4 text-[#94A3B8]" />
          <span>{isDemoStep1 || isBusinessSetup ? 'Return to Screen 3 (Get Started)' : 'Return to Welcome (Screen 1)'}</span>
        </button>
      </div>
    </div>
  );
};
