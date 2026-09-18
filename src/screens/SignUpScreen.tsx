import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Loader2, 
  CheckCircle2, 
  RefreshCw, 
  ShieldAlert,
  Keyboard as KeyboardIcon,
  X,
  FileText
} from 'lucide-react';
import { DESIGN_TOKENS } from '../design-system/tokens';

export type SignUpSimulationState = 
  | 'default' 
  | 'validation-error' 
  | 'loading' 
  | 'account-exists' 
  | 'network-error';

interface SignUpScreenProps {
  onBackToWelcome: () => void;
  onSignUpSuccess: (email: string, fullName?: string) => void;
  onNavigateToLogin: () => void;
  isLargeTextMode?: boolean;
}

export const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onBackToWelcome,
  onSignUpSuccess,
  onNavigateToLogin,
  isLargeTextMode = false,
}) => {
  // Form input states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Field interaction tracking for natural validation
  const [touched, setTouched] = useState<{ fullName?: boolean; email?: boolean; password?: boolean }>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Submission & error states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleSubmitting, setIsGoogleSubmitting] = useState(false);
  const [activeErrorState, setActiveErrorState] = useState<SignUpSimulationState>('default');
  const [showTermsModal, setShowTermsModal] = useState<'terms' | 'privacy' | null>(null);
  const [simulateKeyboard, setSimulateKeyboard] = useState(false);

  // Validation rules
  const isEmailValid = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());
  const isPasswordValid = (val: string) => val.length >= 8;

  const fullNameError = touched.fullName && !fullName.trim() ? 'Please enter your full name.' : null;
  const emailError = touched.email && (!email.trim() ? 'Email address is required.' : !isEmailValid(email) ? 'Enter a valid email address.' : null);
  const passwordError = touched.password && (!password ? 'Password is required.' : !isPasswordValid(password) ? 'Use at least 8 characters.' : null);

  const isFormValid = fullName.trim().length > 0 && isEmailValid(email) && isPasswordValid(password);

  // Handle Form Submission
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    setTouched({ fullName: true, email: true, password: true });

    if (!fullName.trim() || !isEmailValid(email) || !isPasswordValid(password)) {
      setActiveErrorState('validation-error');
      return;
    }

    // Trigger loading state
    setIsSubmitting(true);
    setActiveErrorState('loading');

    // Simulate network authentication request
    setTimeout(() => {
      setIsSubmitting(false);

      if (email.toLowerCase().includes('exist')) {
        setActiveErrorState('account-exists');
        return;
      }

      if (email.toLowerCase().includes('fail')) {
        setActiveErrorState('network-error');
        return;
      }

      // Success
      setActiveErrorState('default');
      onSignUpSuccess(email || 'shravani@example.com', fullName.trim() || 'Shravani');
    }, 1200);
  };

  // Handle Google Sign-In simulation
  const handleGoogleSignIn = () => {
    setIsGoogleSubmitting(true);
    setTimeout(() => {
      setIsGoogleSubmitting(false);
      onSignUpSuccess('google.user@businessnetwork.app', 'Shravani');
    }, 1000);
  };

  // State tester helper for prototype inspection
  const applyPresetState = (state: SignUpSimulationState) => {
    setActiveErrorState(state);
    if (state === 'validation-error') {
      setFullName('');
      setEmail('invalid-email-format');
      setPassword('123');
      setTouched({ fullName: true, email: true, password: true });
    } else if (state === 'account-exists') {
      setFullName('Shravani Pasnur');
      setEmail('shravani.existing@business.com');
      setPassword('SecurePassword123');
      setTouched({ fullName: true, email: true, password: true });
    } else if (state === 'network-error') {
      setFullName('Shrinivas Venkateshwara Rao Kulkarni');
      setEmail('shrinivas.kulkarni@enterprise.in');
      setPassword('StrongPass2026!');
      setTouched({ fullName: true, email: true, password: true });
    } else if (state === 'default') {
      setTouched({});
    }
  };

  return (
    <div 
      id="screen-signup"
      className="h-full w-full flex flex-col justify-between select-none relative overflow-hidden"
      style={{
        backgroundColor: DESIGN_TOKENS.colors.background,
        fontFamily: DESIGN_TOKENS.typography.fontFamily,
      }}
    >
      {/* ========================================================= */}
      {/* TOP BAR: Safe Area Back Navigation + Subtle Brand Mark    */}
      {/* ========================================================= */}
      <div className="w-full px-5 pt-3 pb-2 flex items-center justify-between z-10 shrink-0">
        <button
          id="btn-signup-back"
          onClick={onBackToWelcome}
          disabled={isSubmitting || isGoogleSubmitting}
          className="h-10 px-3 -ml-2 rounded-xl bg-[#121722]/80 hover:bg-[#182030] border border-white/[0.08] hover:border-white/[0.2] flex items-center gap-1.5 text-xs font-medium text-[#94A3B8] hover:text-white transition-all active:scale-[0.98] disabled:opacity-50"
          style={{ minHeight: DESIGN_TOKENS.touchTarget.minHeight }}
          aria-label="Back to Welcome screen"
        >
          <ArrowLeft className="w-4 h-4 text-[#E5A93C]" />
          <span>Back</span>
        </button>

        {/* Small subtle brand mark */}
        <div className="flex items-center gap-1.5 opacity-85">
          <div 
            className="w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] shadow-sm"
            style={{ 
              backgroundColor: DESIGN_TOKENS.colors.accent, 
              color: DESIGN_TOKENS.colors.accentForeground 
            }}
          >
            BN
          </div>
          <span className="text-xs font-semibold text-white/90 tracking-tight">Business Network</span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SCROLLABLE MAIN CONTENT (Keyboard-safe flex container)    */}
      {/* ========================================================= */}
      <div 
        className="flex-1 w-full overflow-y-auto px-5 pt-1 pb-6 space-y-4 transition-all"
        style={{
          paddingBottom: simulateKeyboard ? '220px' : '32px'
        }}
      >
        {/* Header Titles */}
        <div className="space-y-1.5 pt-1">
          <h1 
            id="signup-heading"
            className={`font-bold tracking-tight text-[#F8FAFC] leading-[1.2] ${
              isLargeTextMode ? 'text-2xl sm:text-3xl' : 'text-[24px] sm:text-[26px]'
            }`}
          >
            Create your account
          </h1>
          <p 
            id="signup-subtext"
            className={`text-[#94A3B8] leading-relaxed ${
              isLargeTextMode ? 'text-sm' : 'text-xs sm:text-[13px]'
            }`}
          >
            Start building a business network you can actually keep.
          </p>
        </div>

        {/* ------------------------------------------------------- */}
        {/* PRIMARY SIGN-UP OPTION: CONTINUE WITH GOOGLE            */}
        {/* ------------------------------------------------------- */}
        <div className="pt-1">
          <button
            id="btn-google-signup"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isSubmitting || isGoogleSubmitting}
            className="w-full h-[50px] rounded-xl font-medium flex items-center justify-center gap-3 transition-all duration-150 active:scale-[0.98] border border-white/[0.12] bg-[#121722] hover:bg-[#182030] hover:border-white/[0.22] text-[#F8FAFC] shadow-sm focus:outline-hidden focus:ring-2 focus:ring-[#E5A93C] focus:ring-offset-1 focus:ring-offset-[#0A0D14] disabled:opacity-60"
            style={{ minHeight: DESIGN_TOKENS.touchTarget.minHeight }}
          >
            {isGoogleSubmitting ? (
              <Loader2 className="w-4 h-4 text-[#E5A93C] animate-spin" />
            ) : (
              /* Standard 4-color Google 'G' icon in clean SVG */
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.37 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 10.03 0 12c0 1.97.46 3.83 1.26 5.42l4.02-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.63 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            <span className="text-xs font-semibold tracking-wide">
              {isGoogleSubmitting ? 'Signing in with Google...' : 'Continue with Google'}
            </span>
          </button>
        </div>

        {/* ------------------------------------------------------- */}
        {/* SUBTLE DIVIDER: or continue with email                  */}
        {/* ------------------------------------------------------- */}
        <div className="flex items-center gap-3 py-1">
          <div className="h-px flex-1 bg-white/[0.08]" />
          <span className="text-[11px] text-[#64748B] font-medium tracking-wide">
            or continue with email
          </span>
          <div className="h-px flex-1 bg-white/[0.08]" />
        </div>

        {/* ------------------------------------------------------- */}
        {/* CONTEXTUAL ERROR BANNERS (Account Exists / Network)     */}
        {/* ------------------------------------------------------- */}
        {activeErrorState === 'account-exists' && (
          <div 
            id="banner-account-exists"
            className="p-3.5 rounded-xl border bg-[#1F1914] border-[#F59E0B]/30 flex flex-col gap-2 transition-all animate-in fade-in duration-200"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-white">An account already exists with this email.</p>
                <p className="text-[11px] text-[#94A3B8]">
                  Would you like to log in instead or use another address?
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pl-6">
              <button
                type="button"
                onClick={onNavigateToLogin}
                className="px-3 py-1 rounded-lg bg-[#E5A93C] text-[#0A0D14] text-xs font-semibold active:scale-[0.98] transition-all"
              >
                Log in instead
              </button>
              <button
                type="button"
                onClick={() => setActiveErrorState('default')}
                className="px-2 py-1 text-xs text-[#94A3B8] hover:text-white"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {activeErrorState === 'network-error' && (
          <div 
            id="banner-network-error"
            className="p-3.5 rounded-xl border bg-[#1F1417] border-[#EF4444]/30 flex flex-col gap-2 transition-all animate-in fade-in duration-200"
          >
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="text-xs font-semibold text-white">Couldn't create your account.</p>
                <p className="text-[11px] text-[#94A3B8]">
                  Check your connection and try again. Your information has been preserved.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pl-6">
              <button
                type="button"
                onClick={() => handleSubmit()}
                className="px-3 py-1 rounded-lg bg-[#182030] border border-white/[0.12] text-xs font-medium text-white hover:border-[#E5A93C] flex items-center gap-1.5 active:scale-[0.98]"
              >
                <RefreshCw className="w-3 h-3 text-[#E5A93C]" />
                <span>Try Again</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveErrorState('default')}
                className="px-2 py-1 text-xs text-[#94A3B8] hover:text-white"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* ------------------------------------------------------- */}
        {/* EMAIL SIGN-UP FORM                                      */}
        {/* ------------------------------------------------------- */}
        <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
          {/* FIELD 1: Full Name */}
          <div className="space-y-1.5">
            <label 
              htmlFor="input-fullname" 
              className="block text-xs font-medium text-[#CBD5E1]"
            >
              Full Name
            </label>
            <div className="relative">
              <input
                id="input-fullname"
                type="text"
                autoComplete="name"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (touched.fullName) setTouched({ ...touched, fullName: true });
                }}
                onFocus={() => setFocusedField('fullname')}
                onBlur={() => {
                  setFocusedField(null);
                  setTouched({ ...touched, fullName: true });
                }}
                placeholder="Enter your full name"
                disabled={isSubmitting}
                className={`w-full h-12 px-3.5 rounded-xl text-sm transition-all outline-hidden text-[#F8FAFC] placeholder-[#64748B] bg-[#121722] border ${
                  fullNameError
                    ? 'border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]'
                    : focusedField === 'fullname'
                    ? 'border-[#E5A93C] ring-1 ring-[#E5A93C]/40 bg-[#151C2A]'
                    : 'border-white/[0.10] hover:border-white/[0.18]'
                }`}
                style={{ minHeight: DESIGN_TOKENS.touchTarget.minHeight }}
              />
            </div>
            {fullNameError && (
              <p className="text-[11px] text-[#EF4444] flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{fullNameError}</span>
              </p>
            )}
          </div>

          {/* FIELD 2: Email Address */}
          <div className="space-y-1.5">
            <label 
              htmlFor="input-email" 
              className="block text-xs font-medium text-[#CBD5E1]"
            >
              Email Address
            </label>
            <div className="relative">
              <input
                id="input-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (touched.email) setTouched({ ...touched, email: true });
                }}
                onFocus={() => setFocusedField('email')}
                onBlur={() => {
                  setFocusedField(null);
                  setTouched({ ...touched, email: true });
                }}
                placeholder="name@example.com"
                disabled={isSubmitting}
                className={`w-full h-12 px-3.5 rounded-xl text-sm transition-all outline-hidden text-[#F8FAFC] placeholder-[#64748B] bg-[#121722] border ${
                  emailError
                    ? 'border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]'
                    : focusedField === 'email'
                    ? 'border-[#E5A93C] ring-1 ring-[#E5A93C]/40 bg-[#151C2A]'
                    : 'border-white/[0.10] hover:border-white/[0.18]'
                }`}
                style={{ minHeight: DESIGN_TOKENS.touchTarget.minHeight }}
              />
            </div>
            {emailError && (
              <p className="text-[11px] text-[#EF4444] flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{emailError}</span>
              </p>
            )}
          </div>

          {/* FIELD 3: Password */}
          <div className="space-y-1.5">
            <label 
              htmlFor="input-password" 
              className="block text-xs font-medium text-[#CBD5E1]"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="input-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (touched.password) setTouched({ ...touched, password: true });
                }}
                onFocus={() => setFocusedField('password')}
                onBlur={() => {
                  setFocusedField(null);
                  setTouched({ ...touched, password: true });
                }}
                placeholder="Create password"
                disabled={isSubmitting}
                className={`w-full h-12 pl-3.5 pr-11 rounded-xl text-sm transition-all outline-hidden text-[#F8FAFC] placeholder-[#64748B] bg-[#121722] border ${
                  passwordError
                    ? 'border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]'
                    : focusedField === 'password'
                    ? 'border-[#E5A93C] ring-1 ring-[#E5A93C]/40 bg-[#151C2A]'
                    : 'border-white/[0.10] hover:border-white/[0.18]'
                }`}
                style={{ minHeight: DESIGN_TOKENS.touchTarget.minHeight }}
              />
              <button
                type="button"
                id="btn-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 h-12 w-11 flex items-center justify-center text-[#94A3B8] hover:text-white transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Password guidance or inline error */}
            {passwordError ? (
              <p className="text-[11px] text-[#EF4444] flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{passwordError}</span>
              </p>
            ) : (
              <p className="text-[11px] text-[#64748B]">
                Use at least 8 characters.
              </p>
            )}
          </div>

          {/* ------------------------------------------------------- */}
          {/* PRIMARY ACTION: CREATE ACCOUNT                          */}
          {/* ------------------------------------------------------- */}
          <div className="pt-2 space-y-3">
            <button
              id="btn-create-account-submit"
              type="submit"
              disabled={isSubmitting || isGoogleSubmitting}
              className={`w-full h-[52px] rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] shadow-lg focus:outline-hidden focus:ring-2 focus:ring-[#E5A93C] focus:ring-offset-2 focus:ring-offset-[#0A0D14] ${
                isSubmitting
                  ? 'opacity-85 cursor-not-allowed'
                  : 'hover:brightness-105'
              }`}
              style={{
                backgroundColor: DESIGN_TOKENS.colors.accent,
                color: DESIGN_TOKENS.colors.accentForeground,
                minHeight: DESIGN_TOKENS.touchTarget.minHeight,
                fontSize: '15px',
              }}
              aria-label="Create your personal account"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 text-[#0A0D14] animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account</span>
              )}
            </button>

            {/* Terms of Service & Privacy Policy Note */}
            <p className="text-[11px] text-[#64748B] text-center leading-normal px-2">
              By creating an account, you agree to our{' '}
              <button
                type="button"
                onClick={() => setShowTermsModal('terms')}
                className="text-[#94A3B8] hover:text-[#E5A93C] underline underline-offset-2 transition-colors inline font-medium"
              >
                Terms of Service
              </button>{' '}
              and{' '}
              <button
                type="button"
                onClick={() => setShowTermsModal('privacy')}
                className="text-[#94A3B8] hover:text-[#E5A93C] underline underline-offset-2 transition-colors inline font-medium"
              >
                Privacy Policy
              </button>
              .
            </p>
          </div>
        </form>

        {/* ------------------------------------------------------- */}
        {/* LOGIN ALTERNATIVE                                       */}
        {/* ------------------------------------------------------- */}
        <div className="pt-2 text-center">
          <p className="text-xs text-[#94A3B8]">
            Already have an account?{' '}
            <button
              type="button"
              id="btn-goto-login"
              onClick={onNavigateToLogin}
              className="text-[#E5A93C] font-semibold hover:underline underline-offset-2 transition-colors p-1"
            >
              Log in
            </button>
          </p>
        </div>

        {/* ------------------------------------------------------- */}
        {/* PROTOTYPE REVIEW CONTROL DRAWER (For inspecting states)  */}
        {/* ------------------------------------------------------- */}
        <div className="mt-4 pt-3 border-t border-white/[0.06] space-y-2">
          <div className="flex items-center justify-between text-[10px] text-[#64748B]">
            <span className="font-semibold uppercase tracking-wider">Screen 2 State Inspector</span>
            <button
              type="button"
              onClick={() => setSimulateKeyboard(!simulateKeyboard)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded border transition-all ${
                simulateKeyboard 
                  ? 'bg-[#E5A93C]/20 text-[#E5A93C] border-[#E5A93C]/30' 
                  : 'bg-white/[0.03] border-white/[0.06] text-[#64748B] hover:text-white'
              }`}
            >
              <KeyboardIcon className="w-3 h-3" />
              <span>Keyboard: {simulateKeyboard ? 'Simulated Open' : 'Closed'}</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-[10px]">
            <button
              type="button"
              onClick={() => applyPresetState('default')}
              className={`py-1 px-1.5 rounded-lg border text-center font-medium transition-all ${
                activeErrorState === 'default'
                  ? 'bg-[#182030] text-[#E5A93C] border-[#E5A93C]/30'
                  : 'bg-[#121722] text-[#94A3B8] border-white/[0.05]'
              }`}
            >
              Default
            </button>
            <button
              type="button"
              onClick={() => applyPresetState('validation-error')}
              className={`py-1 px-1.5 rounded-lg border text-center font-medium transition-all ${
                activeErrorState === 'validation-error'
                  ? 'bg-[#182030] text-[#EF4444] border-[#EF4444]/30'
                  : 'bg-[#121722] text-[#94A3B8] border-white/[0.05]'
              }`}
            >
              Validation Error
            </button>
            <button
              type="button"
              onClick={() => applyPresetState('account-exists')}
              className={`py-1 px-1.5 rounded-lg border text-center font-medium transition-all ${
                activeErrorState === 'account-exists'
                  ? 'bg-[#182030] text-[#F59E0B] border-[#F59E0B]/30'
                  : 'bg-[#121722] text-[#94A3B8] border-white/[0.05]'
              }`}
            >
              Account Exists
            </button>
            <button
              type="button"
              onClick={() => applyPresetState('network-error')}
              className={`py-1 px-1.5 rounded-lg border text-center font-medium transition-all ${
                activeErrorState === 'network-error'
                  ? 'bg-[#182030] text-[#EF4444] border-[#EF4444]/30'
                  : 'bg-[#121722] text-[#94A3B8] border-white/[0.05]'
              }`}
            >
              Network Error
            </button>
            <button
              type="button"
              onClick={() => {
                setFullName('Shrinivas Venkateshwara Rao Kulkarni');
                setEmail('shrinivas.kulkarni@enterprise.in');
                setPassword('ValidPassword123');
              }}
              className="py-1 px-1.5 rounded-lg bg-[#121722] text-[#94A3B8] hover:text-white border border-white/[0.05] text-center"
            >
              Long Name Test
            </button>
            <button
              type="button"
              onClick={() => {
                setFullName('श्रावणी पासनूर');
                setEmail('shravani.pasnur@gmail.com');
                setPassword('MarathiPass123');
              }}
              className="py-1 px-1.5 rounded-lg bg-[#121722] text-[#94A3B8] hover:text-white border border-white/[0.05] text-center"
            >
              Unicode Test
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* SIMULATED VIRTUAL KEYBOARD OVERLAY (If testing keyboard)  */}
      {/* ========================================================= */}
      {simulateKeyboard && (
        <div className="w-full bg-[#182030] border-t border-white/[0.12] p-2 flex flex-col items-center justify-center shrink-0 z-30 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between w-full px-3 py-1 text-[10px] text-[#94A3B8] border-b border-white/[0.06]">
            <span>Simulated Keyboard Active (Safe Area Check)</span>
            <button
              onClick={() => setSimulateKeyboard(false)}
              className="text-[#E5A93C] font-semibold"
            >
              Done / Hide
            </button>
          </div>
          <div className="w-full h-36 flex flex-col justify-center items-center gap-1 text-[#64748B] text-xs">
            <div className="flex gap-1">
              {['Q','W','E','R','T','Y','U','I','O','P'].map((k) => (
                <div key={k} className="w-7 h-8 rounded bg-[#121722] flex items-center justify-center text-[10px] text-white/80 font-mono">
                  {k}
                </div>
              ))}
            </div>
            <div className="flex gap-1">
              {['A','S','D','F','G','H','J','K','L'].map((k) => (
                <div key={k} className="w-7 h-8 rounded bg-[#121722] flex items-center justify-center text-[10px] text-white/80 font-mono">
                  {k}
                </div>
              ))}
            </div>
            <div className="flex gap-1 items-center">
              <div className="w-8 h-8 rounded bg-[#1E293B] text-[9px] flex items-center justify-center text-white">⇧</div>
              {['Z','X','C','V','B','N','M'].map((k) => (
                <div key={k} className="w-7 h-8 rounded bg-[#121722] flex items-center justify-center text-[10px] text-white/80 font-mono">
                  {k}
                </div>
              ))}
              <div className="w-8 h-8 rounded bg-[#1E293B] text-[9px] flex items-center justify-center text-white">⌫</div>
            </div>
            <div className="w-40 h-7 rounded bg-[#1E293B] mt-1 text-[10px] text-center text-[#94A3B8] flex items-center justify-center">
              space
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* LIGHTWEIGHT TERMS / PRIVACY MODAL BOTTOM SHEET            */}
      {/* ========================================================= */}
      {showTermsModal && (
        <div 
          className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col justify-end transition-all select-none"
          onClick={() => setShowTermsModal(null)}
        >
          <div 
            className="bg-[#121722] border-t border-white/[0.12] rounded-t-3xl p-5 max-h-[75%] overflow-y-auto space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-1 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#E5A93C]" />
                <h2 className="text-sm font-bold text-white tracking-tight">
                  {showTermsModal === 'terms' ? 'Terms of Service' : 'Privacy Policy'}
                </h2>
              </div>
              <button
                onClick={() => setShowTermsModal(null)}
                className="w-7 h-7 rounded-full bg-[#1F293D] flex items-center justify-center text-[#94A3B8] hover:text-white"
                aria-label="Close modal"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="text-xs text-[#94A3B8] space-y-2 leading-relaxed">
              {showTermsModal === 'terms' ? (
                <>
                  <p>
                    Welcome to Business Network. By creating your personal account, you agree to build and maintain professional interactions respectfully.
                  </p>
                  <p>
                    Your personal account allows you to create and represent business identities, exchange digital cards, and manage your private contact network.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    Your privacy is central to our platform. Your "My Network" contact list, private notes, tags, and follow-ups are strictly private and never published publicly.
                  </p>
                  <p>
                    Only information you designate within a public Business Identity is discoverable by other verified professionals.
                  </p>
                </>
              )}
            </div>

            <button
              onClick={() => setShowTermsModal(null)}
              className="w-full py-2.5 rounded-xl bg-[#E5A93C] text-[#0A0D14] font-semibold text-xs active:scale-[0.98] transition-all"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
