import React from 'react';
import { WelcomeHeroIllustration } from '../components/WelcomeHeroIllustration';
import { DESIGN_TOKENS } from '../design-system/tokens';
import { ArrowRight, LogIn, UserPlus } from 'lucide-react';

interface WelcomeAuthScreenProps {
  onSignUp: () => void;
  onLogIn: () => void;
  isLargeTextMode?: boolean;
}

export const WelcomeAuthScreen: React.FC<WelcomeAuthScreenProps> = ({
  onSignUp,
  onLogIn,
  isLargeTextMode = false,
}) => {
  return (
    <div
      id="screen-welcome-auth"
      className="h-full w-full flex flex-col justify-between overflow-y-auto px-5 py-4 select-none relative"
      style={{
        backgroundColor: DESIGN_TOKENS.colors.background,
        fontFamily: DESIGN_TOKENS.typography.fontFamily,
      }}
    >
      {/* ========================================================= */}
      {/* ZONE 1: TOP / HERO (Scalable, responsive 45-50% visual area) */}
      {/* ========================================================= */}
      <div className="w-full flex-1 min-h-[160px] max-h-[320px] flex items-center justify-center pt-1 pb-2">
        <WelcomeHeroIllustration className="w-full h-full" />
      </div>

      {/* ========================================================= */}
      {/* ZONE 2: CONTENT (Large confident heading & concise value) */}
      {/* ========================================================= */}
      <div className="w-full shrink-0 flex flex-col space-y-2.5 my-auto py-2">
        {/* Main Heading (2-3 lines max, high contrast) */}
        <h1
          id="welcome-headline"
          className={`font-bold tracking-tight text-[#F8FAFC] leading-[1.18] ${
            isLargeTextMode ? 'text-2xl sm:text-3xl' : 'text-[26px] sm:text-[28px]'
          }`}
        >
          Every meeting can become a connection.
        </h1>

        {/* Supporting message */}
        <p
          id="welcome-subtext"
          className={`text-[#94A3B8] leading-relaxed ${
            isLargeTextMode ? 'text-base' : 'text-[14px] sm:text-[15px]'
          }`}
          style={{ maxWidth: '38ch' }}
        >
          Build and carry your business network, wherever business takes you.
        </p>
      </div>

      {/* ========================================================= */}
      {/* ZONE 3: ACTIONS (Sign Up & Log In near lower portion)     */}
      {/* ========================================================= */}
      <div className="w-full shrink-0 flex flex-col space-y-3 pt-3 pb-1">
        {/* Primary CTA: Sign Up */}
        <button
          id="btn-welcome-signup"
          onClick={onSignUp}
          className="w-full h-[52px] rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] shadow-lg focus:outline-hidden focus:ring-2 focus:ring-[#E5A93C] focus:ring-offset-2 focus:ring-offset-[#0A0D14]"
          style={{
            backgroundColor: DESIGN_TOKENS.colors.accent,
            color: DESIGN_TOKENS.colors.accentForeground,
            minHeight: DESIGN_TOKENS.touchTarget.minHeight,
            fontSize: '15px',
          }}
          aria-label="Sign Up for Business Network"
        >
          <UserPlus className="w-4 h-4 text-[#0A0D14]" />
          <span>Sign Up</span>
        </button>

        {/* Secondary CTA: Log In */}
        <button
          id="btn-welcome-login"
          onClick={onLogIn}
          className="w-full h-[52px] rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] border border-white/[0.12] bg-[#121722]/80 hover:bg-[#182030] hover:border-white/[0.2] text-[#F8FAFC] focus:outline-hidden focus:ring-2 focus:ring-[#E5A93C] focus:ring-offset-2 focus:ring-offset-[#0A0D14]"
          style={{
            minHeight: DESIGN_TOKENS.touchTarget.minHeight,
            fontSize: '15px',
          }}
          aria-label="Log In to existing account"
        >
          <LogIn className="w-4 h-4 text-[#94A3B8]" />
          <span>Log In</span>
        </button>

        {/* Microcopy footer */}
        <div className="pt-2 text-center">
          <p
            id="welcome-microcopy"
            className="text-[11px] text-[#64748B] tracking-wide font-medium"
          >
            Search • Exchange • Scan • Stay connected
          </p>
        </div>
      </div>
    </div>
  );
};
