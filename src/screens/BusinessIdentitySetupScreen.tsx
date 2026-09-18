import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Camera, 
  Upload, 
  Building2, 
  User, 
  Briefcase, 
  Phone, 
  Mail, 
  Globe, 
  Instagram, 
  MapPin, 
  ChevronDown, 
  Search, 
  Check, 
  AlertCircle, 
  ShieldCheck, 
  HelpCircle, 
  Sparkles,
  RotateCcw,
  Plus,
  X
} from 'lucide-react';
import { DESIGN_TOKENS } from '../design-system/tokens';

export interface BusinessIdentityFormData {
  personName: string;
  profilePhoto: string | null;
  businessName: string;
  businessLogo: string | null;
  businessCategory: string;
  role: string;
  businessPhone: string;
  phoneCountryCode: string;
  businessEmail: string;
  website: string;
  instagram: string;
  city: string;
  state: string;
  aboutBusiness: string;
  isExistingBusinessMatch?: boolean;
}

interface BusinessIdentitySetupScreenProps {
  userFullName?: string;
  userAccountEmail?: string;
  onBack: () => void;
  onPreviewIdentity: (data: BusinessIdentityFormData) => void;
  isLargeTextMode?: boolean;
}

const CATEGORY_OPTIONS = [
  'Technology',
  'Information Technology & Software Services',
  'Industrial Equipment Manufacturing',
  'Textile & Apparel Manufacturing',
  'Healthcare & Medical Services',
  'Retail & Wholesale Trade',
  'Consulting & Professional Services',
  'Logistics & Freight Services',
  'Construction & Real Estate',
  'Agriculture & Food Processing',
  'Automotive & Mechanical',
  'Education & Training',
  'Hospitality & Tourism'
];

const INDIAN_STATES = [
  'Maharashtra',
  'Karnataka',
  'Gujarat',
  'Delhi',
  'Telangana',
  'Tamil Nadu',
  'Andhra Pradesh',
  'Madhya Pradesh',
  'Rajasthan',
  'Uttar Pradesh',
  'West Bengal',
  'Punjab',
  'Kerala',
  'Goa',
  'Haryana',
  'Other State / UT'
];

const QUICK_ROLES = [
  'Software Engineer',
  'Owner',
  'Founder',
  'Director',
  'Partner',
  'Sales Manager',
  'Consultant'
];

export const BusinessIdentitySetupScreen: React.FC<BusinessIdentitySetupScreenProps> = ({
  userFullName = 'Shravani Pasnur',
  userAccountEmail = 'shravani.pasnur@gmail.com',
  onBack,
  onPreviewIdentity,
  isLargeTextMode = false,
}) => {
  // Form State
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [businessLogo, setBusinessLogo] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState<string>('Aikyam AI Systems');
  const [businessCategory, setBusinessCategory] = useState<string>('Technology');
  const [role, setRole] = useState<string>('Software Engineer');
  const [phoneCountryCode, setPhoneCountryCode] = useState<string>('+91');
  const [businessPhone, setBusinessPhone] = useState<string>('98765 43210');
  const [businessEmail, setBusinessEmail] = useState<string>('shravani@aikyam.ai');
  const [website, setWebsite] = useState<string>('aikyam.ai');
  const [instagram, setInstagram] = useState<string>('@aikyam');
  const [city, setCity] = useState<string>('Solapur');
  const [selectedState, setSelectedState] = useState<string>('Maharashtra');
  const [aboutBusiness, setAboutBusiness] = useState<string>(
    'Enterprise AI solutions and modern automation software for manufacturing and logistics.'
  );

  // Existing Business Association State
  const [isExistingBusinessSelected, setIsExistingBusinessSelected] = useState<boolean>(false);
  const [showBusinessSuggestions, setShowBusinessSuggestions] = useState<boolean>(false);

  // Modals & Bottom Sheets
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState<boolean>(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState<string>('');
  const [isStateSheetOpen, setIsStateSheetOpen] = useState<boolean>(false);
  const [stateSearchQuery, setStateSearchQuery] = useState<string>('');

  // Validation Errors state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Field refs for scrolling to invalid field
  const businessNameRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const cityRef = useRef<HTMLInputElement>(null);
  const formContainerRef = useRef<HTMLDivElement>(null);

  // Demo Inspector states
  const [inspectorOpen, setInspectorOpen] = useState<boolean>(false);

  // Filtered categories
  const filteredCategories = CATEGORY_OPTIONS.filter((c) =>
    c.toLowerCase().includes(categorySearchQuery.toLowerCase())
  );

  // Filtered states
  const filteredStates = INDIAN_STATES.filter((s) =>
    s.toLowerCase().includes(stateSearchQuery.toLowerCase())
  );

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!businessName.trim()) {
      newErrors.businessName = 'Enter your business name.';
    }

    if (!businessCategory.trim()) {
      newErrors.businessCategory = 'Choose a business category.';
    }

    if (!role.trim()) {
      newErrors.role = 'Enter your role.';
    }

    if (!businessPhone.trim()) {
      newErrors.businessPhone = 'Add a business phone number.';
    } else if (businessPhone.replace(/\D/g, '').length < 7) {
      newErrors.businessPhone = 'Enter a valid phone number.';
    }

    if (businessEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(businessEmail.trim())) {
      newErrors.businessEmail = 'Enter a valid email address.';
    }

    if (!city.trim()) {
      newErrors.city = 'Enter your city.';
    }

    if (!selectedState.trim()) {
      newErrors.state = 'Select your state.';
    }

    setErrors(newErrors);

    // Scroll to first invalid field
    if (Object.keys(newErrors).length > 0) {
      if (newErrors.businessName && businessNameRef.current) {
        businessNameRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        businessNameRef.current.focus();
      } else if (newErrors.role && roleRef.current) {
        roleRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        roleRef.current.focus();
      } else if (newErrors.businessPhone && phoneRef.current) {
        phoneRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        phoneRef.current.focus();
      } else if (newErrors.city && cityRef.current) {
        cityRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        cityRef.current.focus();
      }
      return false;
    }

    return true;
  };

  // Handle CTA Submit
  const handlePreviewSubmit = () => {
    if (validateForm()) {
      onPreviewIdentity({
        personName: userFullName,
        profilePhoto,
        businessName: businessName.trim(),
        businessLogo,
        businessCategory,
        role: role.trim(),
        businessPhone: businessPhone.trim(),
        phoneCountryCode,
        businessEmail: businessEmail.trim(),
        website: website.trim(),
        instagram: instagram.trim(),
        city: city.trim(),
        state: selectedState,
        aboutBusiness: aboutBusiness.trim(),
        isExistingBusinessMatch: isExistingBusinessSelected,
      });
    }
  };

  // Helper to handle demo photo upload
  const handleTogglePhoto = () => {
    if (!profilePhoto) {
      setProfilePhoto('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80');
    } else {
      setProfilePhoto(null);
    }
  };

  // Helper to handle demo logo upload
  const handleToggleLogo = () => {
    if (!businessLogo) {
      setBusinessLogo('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80');
    } else {
      setBusinessLogo(null);
    }
  };

  // Helper to get initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0].toUpperCase())
      .join('');
  };

  return (
    <div
      id="screen-11-business-identity-setup"
      className="relative h-full w-full select-none overflow-hidden flex flex-col justify-between bg-[#0A0D14] text-[#F8FAFC]"
      style={{ fontFamily: DESIGN_TOKENS.typography.fontFamily }}
    >
      {/* ============================================================= */}
      {/* 1. TOP APP BAR (NO DEMO PROGRESS / REAL ONBOARDING ENTRY)     */}
      {/* ============================================================= */}
      <header className="shrink-0 pt-3.5 pb-3 px-4 bg-[#0A0D14]/95 backdrop-blur-md border-b border-white/[0.06] z-20 flex items-center justify-between">
        <button
          id="btn-s11-back"
          type="button"
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-[#141B29] border border-white/[0.08] hover:border-white/[0.2] flex items-center justify-center text-[#94A3B8] hover:text-white transition-all active:scale-95 shadow-sm"
          aria-label="Back to Screen 10"
        >
          <ArrowLeft className="w-4 h-4 text-[#E5A93C]" />
        </button>

        <div className="text-center">
          <span className="text-[10px] font-bold text-[#E5A93C] uppercase tracking-wider">
            Your First Business Identity
          </span>
        </div>

        {/* Balance spacer */}
        <div className="w-9" />
      </header>

      {/* ============================================================= */}
      {/* 2. SCROLLABLE FORM BODY                                        */}
      {/* ============================================================= */}
      <div 
        ref={formContainerRef}
        className="flex-1 overflow-y-auto px-4 py-3.5 space-y-5"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* Screen Header Introduction */}
        <div className="space-y-1">
          <h1 className="text-lg font-bold text-white tracking-tight">
            How do you show up in business?
          </h1>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            Add the business and role people should know you by.
          </p>
        </div>

        {/* =========================================================== */}
        {/* SECTION A: PERSONAL IDENTITY (LINKED ACCOUNT)               */}
        {/* =========================================================== */}
        <div className="bg-[#121722] rounded-2xl p-3.5 border border-white/[0.08] flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-3 min-w-0">
            {/* Avatar with Camera Badge */}
            <div className="relative shrink-0">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt={userFullName}
                  className="w-12 h-12 rounded-xl object-cover border border-white/[0.15]"
                />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] border border-white/[0.15] flex items-center justify-center font-bold text-sm text-[#E5A93C] shadow-xs">
                  {getInitials(userFullName)}
                </div>
              )}
              <button
                type="button"
                onClick={handleTogglePhoto}
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#E5A93C] text-[#0A0D14] flex items-center justify-center shadow-sm hover:scale-105 transition-all"
                title={profilePhoto ? 'Remove photo' : 'Add photo'}
                aria-label="Upload personal profile photo"
              >
                <Camera className="w-3 h-3 stroke-[2.5]" />
              </button>
            </div>

            {/* Authenticated Person Info */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="text-sm font-bold text-white truncate">
                  {userFullName}
                </p>
                <span className="text-[9px] font-semibold text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded border border-[#10B981]/20">
                  Your account
                </span>
              </div>
              <p className="text-[11px] text-[#94A3B8] truncate mt-0.5">
                {userAccountEmail}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTogglePhoto}
            className="text-[11px] text-[#E5A93C] hover:underline font-medium shrink-0"
          >
            {profilePhoto ? 'Remove photo' : '+ Add photo'}
          </button>
        </div>

        {/* =========================================================== */}
        {/* SECTION B: BUSINESS DETAILS (NAME, LOGO, CATEGORY)          */}
        {/* =========================================================== */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#CBD5E1] flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>Business</span>
            </h2>
            <span className="text-[10px] text-[#94A3B8]">
              * Required fields
            </span>
          </div>

          {/* Business Logo & Name Row */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-white">
              Business Name <span className="text-[#E5A93C]">*</span>
            </label>

            <div className="flex items-start gap-2.5">
              {/* Logo Upload Box */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={handleToggleLogo}
                  className="w-11 h-11 rounded-xl bg-[#141B29] border border-white/[0.12] hover:border-[#E5A93C]/50 flex flex-col items-center justify-center text-[#94A3B8] hover:text-white transition-all overflow-hidden"
                  title="Upload Business Logo"
                  aria-label="Upload Business Logo"
                >
                  {businessLogo ? (
                    <img src={businessLogo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center">
                      <Upload className="w-3.5 h-3.5 text-[#E5A93C]" />
                      <span className="text-[8px] text-[#94A3B8] mt-0.5">Logo</span>
                    </div>
                  )}
                </button>
              </div>

              {/* Name Input with Autocomplete & Duplicate Prevention */}
              <div className="flex-1 relative">
                <input
                  ref={businessNameRef}
                  id="input-business-name"
                  type="text"
                  value={businessName}
                  onChange={(e) => {
                    setBusinessName(e.target.value);
                    if (errors.businessName) {
                      setErrors((prev) => ({ ...prev, businessName: '' }));
                    }
                    setShowBusinessSuggestions(e.target.value.length > 2);
                  }}
                  onFocus={() => {
                    if (businessName.length > 2) setShowBusinessSuggestions(true);
                  }}
                  placeholder="Enter business name"
                  className={`w-full h-11 px-3 rounded-xl bg-[#141B29] border text-xs text-white placeholder-[#64748B] focus:outline-hidden transition-all ${
                    errors.businessName
                      ? 'border-red-500/70 focus:border-red-500'
                      : 'border-white/[0.12] focus:border-[#E5A93C]'
                  }`}
                />
              </div>
            </div>

            {errors.businessName && (
              <p className="text-[10px] text-red-400 flex items-center gap-1 mt-1 pl-13">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.businessName}</span>
              </p>
            )}

            {/* Existing Business Search / Association Drawer Simulation */}
            {showBusinessSuggestions && (
              <div className="bg-[#121722] border border-white/[0.12] rounded-xl p-2.5 shadow-xl space-y-2 mt-1">
                <div className="flex items-center justify-between text-[10px] text-[#94A3B8]">
                  <span className="font-semibold text-white">Platform Directory Match:</span>
                  <button
                    type="button"
                    onClick={() => setShowBusinessSuggestions(false)}
                    className="text-[#94A3B8] hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>

                {/* Existing Business Card Suggestion */}
                <div
                  onClick={() => {
                    setBusinessName('Aikyam AI Systems');
                    setBusinessCategory('Technology');
                    setCity('Solapur');
                    setSelectedState('Maharashtra');
                    setIsExistingBusinessSelected(true);
                    setShowBusinessSuggestions(false);
                  }}
                  className="p-2 rounded-lg bg-[#182030] hover:bg-[#1E293B] border border-white/[0.08] hover:border-[#E5A93C]/40 cursor-pointer transition-all flex items-start gap-2.5"
                >
                  <div className="w-7 h-7 rounded-md bg-[#E5A93C]/20 text-[#E5A93C] flex items-center justify-center font-bold text-xs shrink-0">
                    AI
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="text-xs font-bold text-white truncate">Aikyam AI Systems</p>
                      <span className="text-[9px] font-semibold text-[#10B981] bg-[#10B981]/15 px-1 rounded">
                        Already on platform
                      </span>
                    </div>
                    <p className="text-[10px] text-[#94A3B8]">Technology • Solapur, Maharashtra</p>
                    <p className="text-[9px] text-[#E5A93C] mt-0.5">Tap to join this existing company</p>
                  </div>
                </div>

                {/* New Business Option */}
                <button
                  type="button"
                  onClick={() => {
                    setIsExistingBusinessSelected(false);
                    setShowBusinessSuggestions(false);
                  }}
                  className="w-full py-1 text-center text-[10px] text-[#94A3B8] hover:text-white border-t border-white/[0.06] pt-1.5"
                >
                  Create as a brand-new business instead
                </button>
              </div>
            )}
          </div>

          {/* Business Category (Searchable Select) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-white">
              Business Category <span className="text-[#E5A93C]">*</span>
            </label>
            <button
              id="btn-select-category"
              type="button"
              onClick={() => setIsCategorySheetOpen(true)}
              className={`w-full h-11 px-3 rounded-xl bg-[#141B29] border text-xs text-left flex items-center justify-between transition-all ${
                errors.businessCategory
                  ? 'border-red-500/70 text-red-400'
                  : 'border-white/[0.12] hover:border-white/[0.2] text-white'
              }`}
            >
              <span className="truncate">
                {businessCategory || 'Search & select category...'}
              </span>
              <ChevronDown className="w-4 h-4 text-[#94A3B8] shrink-0" />
            </button>
            {errors.businessCategory && (
              <p className="text-[10px] text-red-400 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.businessCategory}</span>
              </p>
            )}
          </div>
        </div>

        {/* =========================================================== */}
        {/* SECTION C: YOUR ROLE AT THIS BUSINESS                       */}
        {/* =========================================================== */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#CBD5E1] flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>Your Role</span>
            </h2>
            <span className="text-[10px] text-[#94A3B8]">
              Person ↔ Business connection
            </span>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-white">
              Designation / Role <span className="text-[#E5A93C]">*</span>
            </label>
            <input
              ref={roleRef}
              id="input-user-role"
              type="text"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                if (errors.role) setErrors((prev) => ({ ...prev, role: '' }));
              }}
              placeholder="e.g. Software Engineer, Owner, Director"
              className={`w-full h-11 px-3 rounded-xl bg-[#141B29] border text-xs text-white placeholder-[#64748B] focus:outline-hidden transition-all ${
                errors.role
                  ? 'border-red-500/70 focus:border-red-500'
                  : 'border-white/[0.12] focus:border-[#E5A93C]'
              }`}
            />
            {errors.role && (
              <p className="text-[10px] text-red-400 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.role}</span>
              </p>
            )}

            {/* Quick Role Suggestions */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {QUICK_ROLES.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
                    if (errors.role) setErrors((prev) => ({ ...prev, role: '' }));
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition-all ${
                    role === r
                      ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-[#E5A93C]'
                      : 'bg-[#141B29] border-white/[0.08] text-[#94A3B8] hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* =========================================================== */}
        {/* SECTION D: BUSINESS CONTACT DETAILS                         */}
        {/* =========================================================== */}
        <div className="space-y-3 pt-1">
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#CBD5E1] flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>Business Contact</span>
            </h2>
            <p className="text-[10px] text-[#94A3B8] mt-0.5">
              Use the details you'd share professionally. Private login details are never published.
            </p>
          </div>

          {/* Business Phone (*) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-white">
                Business Phone <span className="text-[#E5A93C]">*</span>
              </label>
              <button
                type="button"
                onClick={() => setBusinessPhone('98765 43210')}
                className="text-[10px] text-[#E5A93C] hover:underline"
              >
                Use account phone
              </button>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-16 h-11 px-2 rounded-xl bg-[#141B29] border border-white/[0.12] flex items-center justify-center text-xs font-medium text-white shrink-0">
                {phoneCountryCode}
              </div>
              <input
                ref={phoneRef}
                id="input-business-phone"
                type="tel"
                value={businessPhone}
                onChange={(e) => {
                  setBusinessPhone(e.target.value);
                  if (errors.businessPhone) {
                    setErrors((prev) => ({ ...prev, businessPhone: '' }));
                  }
                }}
                placeholder="e.g. 98765 43210"
                className={`flex-1 h-11 px-3 rounded-xl bg-[#141B29] border text-xs text-white placeholder-[#64748B] focus:outline-hidden transition-all ${
                  errors.businessPhone
                    ? 'border-red-500/70 focus:border-red-500'
                    : 'border-white/[0.12] focus:border-[#E5A93C]'
                }`}
              />
            </div>
            {errors.businessPhone && (
              <p className="text-[10px] text-red-400 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.businessPhone}</span>
              </p>
            )}
          </div>

          {/* Business Email (Optional) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-white">
                Business Email <span className="text-[#94A3B8] font-normal">(Optional)</span>
              </label>
              <button
                type="button"
                onClick={() => setBusinessEmail(userAccountEmail)}
                className="text-[10px] text-[#E5A93C] hover:underline"
              >
                Use account email
              </button>
            </div>
            <div className="relative">
              <input
                id="input-business-email"
                type="email"
                value={businessEmail}
                onChange={(e) => {
                  setBusinessEmail(e.target.value);
                  if (errors.businessEmail) {
                    setErrors((prev) => ({ ...prev, businessEmail: '' }));
                  }
                }}
                placeholder="e.g. shravani@aikyam.ai"
                className={`w-full h-11 pl-9 pr-3 rounded-xl bg-[#141B29] border text-xs text-white placeholder-[#64748B] focus:outline-hidden transition-all ${
                  errors.businessEmail
                    ? 'border-red-500/70 focus:border-red-500'
                    : 'border-white/[0.12] focus:border-[#E5A93C]'
                }`}
              />
              <Mail className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-3.5" />
            </div>
            {errors.businessEmail && (
              <p className="text-[10px] text-red-400 flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                <span>{errors.businessEmail}</span>
              </p>
            )}
          </div>

          {/* Website & Instagram Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Website */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-white">
                Website <span className="text-[#94A3B8] font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  id="input-website"
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="yourbusiness.com"
                  className="w-full h-11 pl-9 pr-2 rounded-xl bg-[#141B29] border border-white/[0.12] text-xs text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#E5A93C]"
                />
                <Globe className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-3.5" />
              </div>
            </div>

            {/* Instagram */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-white">
                Instagram <span className="text-[#94A3B8] font-normal">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  id="input-instagram"
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="@yourbusiness"
                  className="w-full h-11 pl-9 pr-2 rounded-xl bg-[#141B29] border border-white/[0.12] text-xs text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#E5A93C]"
                />
                <Instagram className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================== */}
        {/* SECTION E: LOCATION (CITY & STATE - LIGHTWEIGHT ONBOARDING)  */}
        {/* =========================================================== */}
        <div className="space-y-3 pt-1">
          <div>
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#CBD5E1] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span>Location</span>
            </h2>
            <p className="text-[10px] text-[#94A3B8] mt-0.5">
              Full street addresses can be completed later in your business profile.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* City */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-white">
                City <span className="text-[#E5A93C]">*</span>
              </label>
              <input
                ref={cityRef}
                id="input-city"
                type="text"
                value={city}
                onChange={(e) => {
                  setCity(e.target.value);
                  if (errors.city) setErrors((prev) => ({ ...prev, city: '' }));
                }}
                placeholder="e.g. Solapur"
                className={`w-full h-11 px-3 rounded-xl bg-[#141B29] border text-xs text-white placeholder-[#64748B] focus:outline-hidden transition-all ${
                  errors.city
                    ? 'border-red-500/70 focus:border-red-500'
                    : 'border-white/[0.12] focus:border-[#E5A93C]'
                }`}
              />
              {errors.city && (
                <p className="text-[10px] text-red-400 mt-1">{errors.city}</p>
              )}
            </div>

            {/* State */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-white">
                State <span className="text-[#E5A93C]">*</span>
              </label>
              <button
                id="btn-select-state"
                type="button"
                onClick={() => setIsStateSheetOpen(true)}
                className={`w-full h-11 px-3 rounded-xl bg-[#141B29] border text-xs text-left flex items-center justify-between transition-all ${
                  errors.state
                    ? 'border-red-500/70 text-red-400'
                    : 'border-white/[0.12] hover:border-white/[0.2] text-white'
                }`}
              >
                <span className="truncate">{selectedState || 'Select state...'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] shrink-0" />
              </button>
              {errors.state && (
                <p className="text-[10px] text-red-400 mt-1">{errors.state}</p>
              )}
            </div>
          </div>
        </div>

        {/* =========================================================== */}
        {/* SECTION F: ABOUT THE BUSINESS (OPTIONAL CONCISE SUMMARY)    */}
        {/* =========================================================== */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-extrabold uppercase tracking-wider text-[#CBD5E1]">
              About the Business <span className="text-[#94A3B8] font-normal lowercase">(optional)</span>
            </h2>
            <span className="text-[10px] text-[#64748B]">
              {aboutBusiness.length}/300
            </span>
          </div>

          <textarea
            id="textarea-about-business"
            value={aboutBusiness}
            maxLength={300}
            rows={3}
            onChange={(e) => setAboutBusiness(e.target.value)}
            placeholder="What does your business do?"
            className="w-full p-3 rounded-xl bg-[#141B29] border border-white/[0.12] text-xs text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#E5A93C] resize-none"
          />
        </div>

        {/* Clearance for sticky CTA */}
        <div className="h-20" />
      </div>

      {/* ============================================================= */}
      {/* 3. STICKY BOTTOM PRIMARY CTA (PREVIEW MY IDENTITY)            */}
      {/* ============================================================= */}
      <div className="shrink-0 p-4 bg-gradient-to-t from-[#0A0D14] via-[#0A0D14]/95 to-transparent border-t border-white/[0.06] z-20">
        <button
          id="btn-preview-my-identity"
          type="button"
          onClick={handlePreviewSubmit}
          className="w-full h-[52px] rounded-xl bg-[#E5A93C] hover:bg-amber-400 text-[#0A0D14] font-bold text-sm tracking-tight transition-all active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg"
          style={{ minHeight: DESIGN_TOKENS.touchTarget.minHeight }}
        >
          <span>Preview My Identity</span>
          <ArrowLeft className="w-4 h-4 rotate-180 text-[#0A0D14] stroke-[2.5]" />
        </button>
      </div>

      {/* ============================================================= */}
      {/* 4. CATEGORY SELECTION BOTTOM SHEET                            */}
      {/* ============================================================= */}
      {isCategorySheetOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex flex-col justify-end"
          onClick={() => setIsCategorySheetOpen(false)}
        >
          <div
            className="bg-[#121722] border-t border-white/[0.15] rounded-t-3xl max-h-[75vh] flex flex-col p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-1 border-b border-white/[0.08]">
              <h3 className="text-sm font-bold text-white">Select Business Category</h3>
              <button
                type="button"
                onClick={() => setIsCategorySheetOpen(false)}
                className="w-7 h-7 rounded-full bg-[#1F293D] flex items-center justify-center text-[#94A3B8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Category Search Filter */}
            <div className="relative">
              <input
                type="text"
                value={categorySearchQuery}
                onChange={(e) => setCategorySearchQuery(e.target.value)}
                placeholder="Search categories..."
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#182030] border border-white/[0.1] text-xs text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#E5A93C]"
              />
              <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-3.5" />
            </div>

            {/* Category List */}
            <div className="flex-1 overflow-y-auto max-h-[45vh] space-y-1 pr-1">
              {filteredCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setBusinessCategory(cat);
                    if (errors.businessCategory) {
                      setErrors((prev) => ({ ...prev, businessCategory: '' }));
                    }
                    setIsCategorySheetOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between ${
                    businessCategory === cat
                      ? 'bg-[#E5A93C]/20 text-[#E5A93C] font-bold border border-[#E5A93C]/30'
                      : 'text-[#CBD5E1] hover:bg-[#182030]'
                  }`}
                >
                  <span className="leading-snug">{cat}</span>
                  {businessCategory === cat && (
                    <Check className="w-4 h-4 text-[#E5A93C] shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 5. STATE SELECTION BOTTOM SHEET                               */}
      {/* ============================================================= */}
      {isStateSheetOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex flex-col justify-end"
          onClick={() => setIsStateSheetOpen(false)}
        >
          <div
            className="bg-[#121722] border-t border-white/[0.15] rounded-t-3xl max-h-[75vh] flex flex-col p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-1 border-b border-white/[0.08]">
              <h3 className="text-sm font-bold text-white">Select State</h3>
              <button
                type="button"
                onClick={() => setIsStateSheetOpen(false)}
                className="w-7 h-7 rounded-full bg-[#1F293D] flex items-center justify-center text-[#94A3B8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* State Search Filter */}
            <div className="relative">
              <input
                type="text"
                value={stateSearchQuery}
                onChange={(e) => setStateSearchQuery(e.target.value)}
                placeholder="Search states..."
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#182030] border border-white/[0.1] text-xs text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#E5A93C]"
              />
              <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-3 top-3.5" />
            </div>

            {/* State List */}
            <div className="flex-1 overflow-y-auto max-h-[45vh] space-y-1 pr-1">
              {filteredStates.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => {
                    setSelectedState(st);
                    if (errors.state) {
                      setErrors((prev) => ({ ...prev, state: '' }));
                    }
                    setIsStateSheetOpen(false);
                  }}
                  className={`w-full p-2.5 rounded-xl text-left text-xs transition-all flex items-center justify-between ${
                    selectedState === st
                      ? 'bg-[#E5A93C]/20 text-[#E5A93C] font-bold border border-[#E5A93C]/30'
                      : 'text-[#CBD5E1] hover:bg-[#182030]'
                  }`}
                >
                  <span>{st}</span>
                  {selectedState === st && (
                    <Check className="w-4 h-4 text-[#E5A93C] shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 6. REVIEWER TEST DRAWER                                       */}
      {/* ============================================================= */}
      <div className="absolute top-14 right-4 z-30 pointer-events-auto">
        <details className="group" open={inspectorOpen} onToggle={(e) => setInspectorOpen(e.currentTarget.open)}>
          <summary className="list-none cursor-pointer bg-[#121722]/90 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-full text-[10px] text-[#94A3B8] hover:text-white flex items-center gap-1 shadow-md">
            <span>Inspector</span>
            <span className="text-[#E5A93C]">▾</span>
          </summary>
          <div className="mt-1 bg-[#121722] border border-white/20 rounded-xl p-2.5 shadow-2xl space-y-2 text-[10px] w-60">
            <p className="text-[#94A3B8] font-semibold">Form Testing Scenarios:</p>

            <button
              type="button"
              onClick={() => {
                setBusinessName('');
                setRole('');
                setBusinessPhone('');
                setCity('');
                validateForm();
              }}
              className="w-full px-2 py-1 rounded text-left border border-white/10 hover:border-white/20 text-[#CBD5E1] hover:text-white"
            >
              Trigger Required Validation Errors
            </button>

            <button
              type="button"
              onClick={() => {
                setBusinessName('Shree Siddhivinayak Industrial Engineering Solutions Private Limited');
                setRole('Senior Business Development & Strategic Partnerships Manager');
                setBusinessCategory('Information Technology & Software Services');
              }}
              className="w-full px-2 py-1 rounded text-left border border-white/10 hover:border-white/20 text-[#CBD5E1] hover:text-white"
            >
              Stress Test Long Name & Role
            </button>

            <button
              type="button"
              onClick={() => {
                setBusinessName('श्री गणेश ट्रेडर्स');
                setRole('मालक व संचालक');
                setBusinessCategory('Retail & Wholesale Trade');
                setCity('सोलापूर');
                setSelectedState('Maharashtra');
              }}
              className="w-full px-2 py-1 rounded text-left border border-white/10 hover:border-white/20 text-[#CBD5E1] hover:text-white"
            >
              Devanagari (मराठी / हिन्दी) Text
            </button>

            <button
              type="button"
              onClick={() => {
                setBusinessName('Aikyam AI Systems');
                setBusinessCategory('Technology');
                setRole('Software Engineer');
                setBusinessPhone('98765 43210');
                setCity('Solapur');
                setSelectedState('Maharashtra');
                setErrors({});
              }}
              className="w-full px-2 py-1 rounded text-left border border-[#E5A93C]/40 text-[#E5A93C] font-semibold flex items-center justify-between"
            >
              <span>Reset Default Prototype State</span>
              <RotateCcw className="w-3 h-3 text-[#E5A93C]" />
            </button>
          </div>
        </details>
      </div>

    </div>
  );
};
