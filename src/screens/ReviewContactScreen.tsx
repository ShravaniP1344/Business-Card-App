import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Camera, 
  Eye, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Check, 
  CheckCircle2, 
  RefreshCw, 
  Tag, 
  FileText, 
  Globe, 
  Mail, 
  Phone, 
  Building2, 
  User, 
  Briefcase, 
  MapPin, 
  Instagram, 
  X, 
  ShieldCheck, 
  Search,
  ExternalLink
} from 'lucide-react';
import { DESIGN_TOKENS } from '../design-system/tokens';

interface ReviewContactScreenProps {
  onBackToScanner: () => void;
  onSaveSuccess: (contactData: ScannedContactData) => void;
  isLargeTextMode?: boolean;
}

export interface ScannedContactData {
  name: string;
  designation: string;
  company: string;
  category: string;
  categoryConfirmed: boolean;
  address: string;
  phones: string[];
  emails: string[];
  website: string;
  instagram: string;
  tags: string[];
  note: string;
}

const POPULAR_CATEGORIES = [
  'Industrial Solutions',
  'Manufacturing & Fabrication',
  'Precision Engineering',
  'Automotive Components',
  'Electrical & Automation',
  'Logistics & Warehousing',
  'IT & Enterprise Software',
  'Construction Materials',
];

export const ReviewContactScreen: React.FC<ReviewContactScreenProps> = ({
  onBackToScanner,
  onSaveSuccess,
  isLargeTextMode = false,
}) => {
  // Form State initialized with simulated extraction from Arjun's card
  const [name, setName] = useState<string>('Arjun Deshmukh');
  const [designation, setDesignation] = useState<string>('Sales Manager');
  const [company, setCompany] = useState<string>('Vertex Industrial Solutions');
  const [category, setCategory] = useState<string>('Industrial Solutions');
  const [categoryConfirmed, setCategoryConfirmed] = useState<boolean>(false);
  const [address, setAddress] = useState<string>('Pune, Maharashtra');
  const [phones, setPhones] = useState<string[]>(['+91 98220 45871']);
  const [emails, setEmails] = useState<string[]>(['arjun@vertexindustrial.in']);
  const [website, setWebsite] = useState<string>('vertexindustrial.in');
  const [instagram, setInstagram] = useState<string>('');
  const [showInstagramField, setShowInstagramField] = useState<boolean>(false);
  const [tags, setTags] = useState<string[]>([]);
  const [showTagInput, setShowTagInput] = useState<boolean>(false);
  const [customTag, setCustomTag] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [showNoteField, setShowNoteField] = useState<boolean>(false);

  // Validation & Submission States
  const [errors, setErrors] = useState<{ company?: string; phone?: string; email?: string }>({});
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [hasUnsavedEdits, setHasUnsavedEdits] = useState<boolean>(false);

  // Modals & Bottom Sheets
  const [showCardModal, setShowCardModal] = useState<boolean>(false);
  const [showCategorySheet, setShowCategorySheet] = useState<boolean>(false);
  const [categorySearch, setCategorySearch] = useState<string>('');
  const [showDiscardConfirm, setShowDiscardConfirm] = useState<boolean>(false);

  // Inspector / Reviewer variants
  const [simulatedDuplicateMatch, setSimulatedDuplicateMatch] = useState<boolean>(false);
  const [simulatedSaveError, setSimulatedSaveError] = useState<boolean>(false);

  // Mark edits as dirty
  const handleFieldChange = () => {
    if (!hasUnsavedEdits) setHasUnsavedEdits(true);
  };

  // Back Navigation handler
  const handleBack = () => {
    if (hasUnsavedEdits && !isSaved) {
      setShowDiscardConfirm(true);
    } else {
      onBackToScanner();
    }
  };

  // Dynamic Phone handlers
  const handleAddPhone = () => {
    setPhones(prev => [...prev, '']);
    handleFieldChange();
  };

  const handlePhoneChange = (index: number, val: string) => {
    const updated = [...phones];
    updated[index] = val;
    setPhones(updated);
    if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
    handleFieldChange();
  };

  const handleRemovePhone = (index: number) => {
    if (phones.length <= 1) {
      setErrors(prev => ({ ...prev, phone: 'At least one phone number is required.' }));
      return;
    }
    setPhones(prev => prev.filter((_, i) => i !== index));
    handleFieldChange();
  };

  // Dynamic Email handlers
  const handleAddEmail = () => {
    setEmails(prev => [...prev, '']);
    handleFieldChange();
  };

  const handleEmailChange = (index: number, val: string) => {
    const updated = [...emails];
    updated[index] = val;
    setEmails(updated);
    if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
    handleFieldChange();
  };

  const handleRemoveEmail = (index: number) => {
    setEmails(prev => prev.filter((_, i) => i !== index));
    handleFieldChange();
  };

  // Tag helper
  const handleAddTag = (tagName: string) => {
    if (tagName.trim() && !tags.includes(tagName.trim())) {
      setTags(prev => [...prev, tagName.trim()]);
      setCustomTag('');
      handleFieldChange();
    }
  };

  const handleRemoveTag = (tagName: string) => {
    setTags(prev => prev.filter(t => t !== tagName));
    handleFieldChange();
  };

  // Primary Submission
  const handleSaveContact = () => {
    const newErrors: { company?: string; phone?: string; email?: string } = {};

    // 1. Company required
    if (!company.trim()) {
      newErrors.company = 'Company is required.';
    }

    // 2. At least one non-empty phone required
    const validPhones = phones.filter(p => p.trim().length > 0);
    if (validPhones.length === 0) {
      newErrors.phone = 'Add at least one phone number.';
    }

    // 3. Email structure check if present
    const invalidEmail = emails.find(e => e.trim().length > 0 && !/^\S+@\S+\.\S+$/.test(e.trim()));
    if (invalidEmail) {
      newErrors.email = 'Enter a valid email address.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Clear errors & begin save transition
    setErrors({});
    setIsSaving(true);

    if (simulatedSaveError) {
      setTimeout(() => {
        setIsSaving(false);
      }, 800);
      return;
    }

    // State 1: Adding spinner (800ms)
    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
    }, 900);
  };

  // Filtered categories
  const filteredCategories = POPULAR_CATEGORIES.filter(cat => 
    cat.toLowerCase().includes(categorySearch.toLowerCase())
  );

  return (
    <div
      id="screen-9-review-contact"
      className="relative h-full w-full select-none overflow-hidden flex flex-col justify-between bg-[#0A0D14] text-[#F8FAFC]"
      style={{ fontFamily: DESIGN_TOKENS.typography.fontFamily }}
    >
      {/* ============================================================= */}
      {/* 1. TOP HEADER (STICKY NAVIGATION)                             */}
      {/* ============================================================= */}
      <header className="shrink-0 pt-3 pb-2.5 px-4 bg-[#0A0D14]/95 backdrop-blur-md border-b border-white/[0.06] z-20 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            id="btn-review-back"
            type="button"
            onClick={handleBack}
            className="w-9 h-9 rounded-xl bg-[#141B29] border border-white/[0.08] hover:border-white/[0.2] flex items-center justify-center text-[#94A3B8] hover:text-white transition-all active:scale-95 shadow-sm"
            aria-label="Back to scanner"
            title="Back to camera scanner"
          >
            <ArrowLeft className="w-4 h-4 text-[#E5A93C]" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight leading-tight">
              Review contact
            </h1>
            <p className="text-[10px] text-[#94A3B8]">
              Check the details before adding them to your network.
            </p>
          </div>
        </div>

        {/* Private Contact Indicator */}
        <div className="flex items-center gap-1 text-[10px] text-[#94A3B8] bg-white/[0.04] px-2 py-1 rounded-md border border-white/[0.06]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#10B981]" />
          <span>Private</span>
        </div>
      </header>

      {/* ============================================================= */}
      {/* 2. SCROLLABLE FORM CONTENT BODY                               */}
      {/* ============================================================= */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-3.5 space-y-4 text-xs"
        style={{ scrollBehavior: 'smooth' }}
      >
        {/* =========================================================== */}
        {/* A. CAPTURED PHYSICAL CARD PREVIEW (COMPACT & TAPPABLE)      */}
        {/* =========================================================== */}
        <div className="bg-[#121722] rounded-2xl p-3 border border-white/[0.08] shadow-md space-y-2.5">
          <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
            <span className="font-semibold uppercase tracking-wider text-[9px] text-[#64748B]">
              Captured Card Source
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCardModal(true)}
                className="text-[11px] font-medium text-[#E5A93C] hover:underline flex items-center gap-1 active:scale-95"
                title="Inspect original business card image"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View card</span>
              </button>
              <span className="text-white/20">•</span>
              <button
                type="button"
                onClick={onBackToScanner}
                className="text-[11px] font-medium text-[#94A3B8] hover:text-white flex items-center gap-1 active:scale-95"
                title="Retake card photo in camera"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Retake</span>
              </button>
            </div>
          </div>

          {/* Tangible Card Miniature Preview (Arjun Deshmukh from S7 & S8) */}
          <div
            onClick={() => setShowCardModal(true)}
            className="cursor-pointer group relative rounded-xl p-3 text-[#0F172A] shadow-inner transition-all hover:scale-[1.01] overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #F8FAFC 0%, #EDEFEA 100%)',
              boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B]" />
            <div className="flex items-start justify-between">
              <div>
                <p className="font-extrabold text-xs tracking-tight text-[#0F172A] uppercase">
                  Arjun Deshmukh
                </p>
                <p className="text-[10px] font-semibold text-[#B45309]">
                  Sales Manager
                </p>
                <p className="text-[10px] font-bold text-[#1E293B] mt-0.5">
                  Vertex Industrial Solutions
                </p>
              </div>
              <div className="w-6 h-6 rounded bg-[#0F172A] text-amber-400 flex items-center justify-center font-bold text-[10px]">
                V
              </div>
            </div>

            <div className="mt-1 pt-1 border-t border-black/[0.08] flex items-center justify-between text-[9px] text-[#475569]">
              <span className="truncate">+91 98220 45871</span>
              <span className="truncate">Pune, Maharashtra</span>
            </div>

            {/* Hover visual cue */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all flex items-center justify-center">
              <span className="opacity-0 group-hover:opacity-100 bg-black/75 backdrop-blur-xs text-white text-[9px] font-medium px-2 py-0.5 rounded-full transition-all">
                Tap to inspect full card
              </span>
            </div>
          </div>
        </div>

        {/* Future Edge Case Banner: Profile Match found */}
        {simulatedDuplicateMatch && (
          <div className="bg-[#182338] border border-[#3B82F6]/40 rounded-xl p-3 flex items-start gap-2.5 text-blue-200">
            <Building2 className="w-4 h-4 text-[#3B82F6] shrink-0 mt-0.5" />
            <div className="flex-1 text-[11px]">
              <p className="font-bold text-white">Registered Profile Match</p>
              <p className="text-[#94A3B8] text-[10px] mt-0.5">
                We found a matching registered identity for Vertex Industrial Solutions. You can connect with their digital profile or keep this private scanned card.
              </p>
              <div className="mt-2 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => alert('Future feature: View registered profile')}
                  className="px-2.5 py-1 rounded-md bg-[#3B82F6] text-white font-semibold text-[10px]"
                >
                  View Profile
                </button>
                <button
                  type="button"
                  onClick={() => setSimulatedDuplicateMatch(false)}
                  className="px-2.5 py-1 rounded-md bg-white/10 text-white text-[10px]"
                >
                  Keep Private Contact
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Save error alert if simulated */}
        {simulatedSaveError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex items-start gap-2 text-red-200 text-[11px]">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white">Couldn't add this contact</strong>
              <p className="text-[10px] text-red-300 mt-0.5">
                Your changes are still here. Please check your network connection and try again.
              </p>
            </div>
          </div>
        )}

        {/* =========================================================== */}
        {/* B. CONTACT DETAILS SECTION                                   */}
        {/* =========================================================== */}
        <section className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
            <User className="w-3 h-3 text-[#E5A93C]" />
            <span>Contact Details</span>
          </div>

          <div className="bg-[#121722] rounded-xl p-3 border border-white/[0.08] space-y-3 shadow-xs">
            {/* Field: Name */}
            <div>
              <label 
                htmlFor="input-contact-name" 
                className="block text-[11px] font-semibold text-[#CBD5E1] mb-1"
              >
                Name
              </label>
              <input
                id="input-contact-name"
                type="text"
                value={name}
                onChange={(e) => { setName(e.target.value); handleFieldChange(); }}
                placeholder="Full Name"
                className="w-full h-10 px-3 rounded-lg bg-[#182030] border border-white/[0.1] text-white text-xs placeholder-[#64748B] focus:outline-none focus:border-[#E5A93C] transition-all"
              />
            </div>

            {/* Field: Designation */}
            <div>
              <label 
                htmlFor="input-contact-designation" 
                className="block text-[11px] font-semibold text-[#CBD5E1] mb-1"
              >
                Designation
              </label>
              <input
                id="input-contact-designation"
                type="text"
                value={designation}
                onChange={(e) => { setDesignation(e.target.value); handleFieldChange(); }}
                placeholder="e.g. Sales Manager, Director"
                className="w-full h-10 px-3 rounded-lg bg-[#182030] border border-white/[0.1] text-white text-xs placeholder-[#64748B] focus:outline-none focus:border-[#E5A93C] transition-all"
              />
            </div>
          </div>
        </section>

        {/* =========================================================== */}
        {/* C. BUSINESS & ORGANIZATION SECTION                          */}
        {/* =========================================================== */}
        <section className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
            <Building2 className="w-3 h-3 text-[#E5A93C]" />
            <span>Business</span>
          </div>

          <div className="bg-[#121722] rounded-xl p-3 border border-white/[0.08] space-y-3 shadow-xs">
            {/* Field: Company (REQUIRED) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label 
                  htmlFor="input-contact-company" 
                  className="text-[11px] font-semibold text-[#CBD5E1] flex items-center gap-1"
                >
                  <span>Company</span>
                  <span className="text-[#E5A93C] font-bold">*</span>
                </label>
                {errors.company && (
                  <span className="text-[10px] text-red-400 font-medium">
                    {errors.company}
                  </span>
                )}
              </div>
              <input
                id="input-contact-company"
                type="text"
                value={company}
                onChange={(e) => { 
                  setCompany(e.target.value); 
                  if (errors.company) setErrors(prev => ({ ...prev, company: undefined }));
                  handleFieldChange(); 
                }}
                placeholder="Company Name"
                className={`w-full h-10 px-3 rounded-lg bg-[#182030] border text-white text-xs placeholder-[#64748B] focus:outline-none transition-all ${
                  errors.company ? 'border-red-500/80' : 'border-white/[0.1] focus:border-[#E5A93C]'
                }`}
              />
            </div>

            {/* Field: Business Category (UNCERTAIN EXTRACTED FIELD PATTERN) */}
            <div>
              <label className="block text-[11px] font-semibold text-[#CBD5E1] mb-1">
                Business Category
              </label>

              <button
                type="button"
                onClick={() => setShowCategorySheet(true)}
                className={`w-full h-10 px-3 rounded-lg bg-[#182030] border flex items-center justify-between text-xs text-left transition-all ${
                  categoryConfirmed 
                    ? 'border-white/[0.1] text-white'
                    : 'border-[#E5A93C]/50 hover:border-[#E5A93C] text-white'
                }`}
              >
                <span className="truncate">{category || 'Select Business Category'}</span>
                <span className="text-[10px] text-[#E5A93C] font-semibold">Change</span>
              </button>

              {/* Subtle Amber "Check this" Cue (Strictly no fake AI confidence scores) */}
              {!categoryConfirmed ? (
                <div className="mt-1.5 flex items-center justify-between text-[10px] text-amber-400 bg-amber-400/[0.08] px-2.5 py-1 rounded-md border border-amber-400/20">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                    <span>⚠ Check this category suggestion</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setCategoryConfirmed(true);
                      handleFieldChange();
                    }}
                    className="text-[10px] font-bold text-amber-300 hover:text-amber-200 underline"
                  >
                    Confirm
                  </button>
                </div>
              ) : (
                <div className="mt-1 flex items-center gap-1 text-[10px] text-[#10B981]">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Category confirmed</span>
                </div>
              )}
            </div>

            {/* Field: Address (Multiline) */}
            <div>
              <label 
                htmlFor="input-contact-address" 
                className="block text-[11px] font-semibold text-[#CBD5E1] mb-1"
              >
                Address
              </label>
              <textarea
                id="input-contact-address"
                rows={2}
                value={address}
                onChange={(e) => { setAddress(e.target.value); handleFieldChange(); }}
                placeholder="Full street address, city, state"
                className="w-full px-3 py-2 rounded-lg bg-[#182030] border border-white/[0.1] text-white text-xs placeholder-[#64748B] focus:outline-none focus:border-[#E5A93C] transition-all resize-none"
              />
            </div>
          </div>
        </section>

        {/* =========================================================== */}
        {/* D. CONTACT METHODS SECTION (REPEATABLE PHONE & EMAIL)        */}
        {/* =========================================================== */}
        <section className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
            <Phone className="w-3 h-3 text-[#E5A93C]" />
            <span>Contact Methods</span>
          </div>

          <div className="bg-[#121722] rounded-xl p-3 border border-white/[0.08] space-y-3.5 shadow-xs">
            
            {/* Field: Phone Numbers (Dynamic List, at least 1 required) */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-[#CBD5E1] flex items-center gap-1">
                  <span>Phone</span>
                  <span className="text-[#E5A93C] font-bold">*</span>
                </label>
                {errors.phone && (
                  <span className="text-[10px] text-red-400 font-medium">
                    {errors.phone}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {phones.map((p, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <input
                      type="tel"
                      value={p}
                      onChange={(e) => handlePhoneChange(idx, e.target.value)}
                      placeholder="+91 00000 00000"
                      className={`flex-1 h-10 px-3 rounded-lg bg-[#182030] border text-white text-xs placeholder-[#64748B] focus:outline-none transition-all ${
                        errors.phone && !p.trim() ? 'border-red-500/80' : 'border-white/[0.1] focus:border-[#E5A93C]'
                      }`}
                    />
                    {phones.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemovePhone(idx)}
                        className="w-9 h-10 rounded-lg bg-[#182030] border border-white/[0.08] text-[#94A3B8] hover:text-red-400 hover:border-red-400/40 flex items-center justify-center transition-all"
                        title="Remove phone number"
                        aria-label="Remove phone"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddPhone}
                className="mt-2 text-[11px] font-semibold text-[#E5A93C] hover:text-amber-300 flex items-center gap-1 py-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add phone</span>
              </button>
            </div>

            {/* Field: Email Addresses (Dynamic List, Optional) */}
            <div className="pt-2 border-t border-white/[0.06]">
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-[#CBD5E1]">
                  Email
                </label>
                {errors.email && (
                  <span className="text-[10px] text-red-400 font-medium">
                    {errors.email}
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {emails.map((em, idx) => (
                  <div key={idx} className="flex items-center gap-1.5">
                    <input
                      type="email"
                      value={em}
                      onChange={(e) => handleEmailChange(idx, e.target.value)}
                      placeholder="name@company.com"
                      className={`flex-1 h-10 px-3 rounded-lg bg-[#182030] border text-white text-xs placeholder-[#64748B] focus:outline-none transition-all ${
                        errors.email ? 'border-red-500/80' : 'border-white/[0.1] focus:border-[#E5A93C]'
                      }`}
                    />
                    {emails.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveEmail(idx)}
                        className="w-9 h-10 rounded-lg bg-[#182030] border border-white/[0.08] text-[#94A3B8] hover:text-red-400 hover:border-red-400/40 flex items-center justify-center transition-all"
                        title="Remove email"
                        aria-label="Remove email"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleAddEmail}
                className="mt-2 text-[11px] font-semibold text-[#E5A93C] hover:text-amber-300 flex items-center gap-1 py-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add email</span>
              </button>
            </div>

            {/* Field: Website (Optional) */}
            <div className="pt-2 border-t border-white/[0.06]">
              <label 
                htmlFor="input-contact-website" 
                className="block text-[11px] font-semibold text-[#CBD5E1] mb-1"
              >
                Website
              </label>
              <input
                id="input-contact-website"
                type="text"
                value={website}
                onChange={(e) => { setWebsite(e.target.value); handleFieldChange(); }}
                placeholder="e.g. company.com"
                className="w-full h-10 px-3 rounded-lg bg-[#182030] border border-white/[0.1] text-white text-xs placeholder-[#64748B] focus:outline-none focus:border-[#E5A93C] transition-all"
              />
            </div>

            {/* Field: Instagram (Card did not contain it - Add optionally) */}
            <div className="pt-2 border-t border-white/[0.06]">
              {!showInstagramField && !instagram ? (
                <button
                  type="button"
                  onClick={() => setShowInstagramField(true)}
                  className="text-[11px] font-medium text-[#94A3B8] hover:text-white flex items-center gap-1.5 py-1"
                >
                  <Plus className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span>Add Instagram handle</span>
                </button>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label 
                      htmlFor="input-contact-instagram" 
                      className="text-[11px] font-semibold text-[#CBD5E1]"
                    >
                      Instagram
                    </label>
                    <button
                      type="button"
                      onClick={() => { setInstagram(''); setShowInstagramField(false); }}
                      className="text-[10px] text-[#64748B] hover:text-[#94A3B8]"
                    >
                      Cancel
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-[#64748B] text-xs">@</span>
                    <input
                      id="input-contact-instagram"
                      type="text"
                      value={instagram}
                      onChange={(e) => { setInstagram(e.target.value); handleFieldChange(); }}
                      placeholder="username"
                      className="w-full h-10 pl-7 pr-3 rounded-lg bg-[#182030] border border-white/[0.1] text-white text-xs placeholder-[#64748B] focus:outline-none focus:border-[#E5A93C] transition-all"
                    />
                  </div>
                </div>
              )}
            </div>

          </div>
        </section>

        {/* =========================================================== */}
        {/* E. OPTIONAL QUICK DETAILS (PRIVATE TAGS & NOTES)            */}
        {/* =========================================================== */}
        <section className="space-y-2.5">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#94A3B8] uppercase tracking-wider">
            <Tag className="w-3 h-3 text-[#E5A93C]" />
            <span>Private Notes & Tags</span>
          </div>

          <div className="bg-[#121722] rounded-xl p-3 border border-white/[0.08] space-y-3 shadow-xs">
            {/* Tags area */}
            <div>
              <label className="block text-[11px] font-semibold text-[#CBD5E1] mb-1.5">
                Tags (Visible only to you)
              </label>

              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                {tags.map((t) => (
                  <span 
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-[#E5A93C] text-[10px] font-semibold"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(t)}
                      className="hover:text-white"
                      aria-label={`Remove tag ${t}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}

                {/* Preset Tag suggestions */}
                {['Supplier', 'Client', 'Event', 'Follow-up'].map((preset) => (
                  !tags.includes(preset) && (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handleAddTag(preset)}
                      className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.2] text-[#94A3B8] hover:text-white text-[10px]"
                    >
                      + {preset}
                    </button>
                  )
                ))}
              </div>

              {/* Custom tag input */}
              {showTagInput ? (
                <div className="flex items-center gap-1.5 mt-2">
                  <input
                    type="text"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag(customTag);
                      }
                    }}
                    placeholder="Custom tag name"
                    className="flex-1 h-8 px-2.5 rounded-md bg-[#182030] border border-white/[0.1] text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddTag(customTag)}
                    className="px-2.5 h-8 rounded-md bg-[#E5A93C] text-[#0A0D14] font-bold text-xs"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTagInput(false)}
                    className="px-2 h-8 text-xs text-[#94A3B8]"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowTagInput(true)}
                  className="text-[10px] text-[#E5A93C] font-semibold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add custom tag</span>
                </button>
              )}
            </div>

            {/* Note Area */}
            <div className="pt-2 border-t border-white/[0.06]">
              {!showNoteField && !note ? (
                <button
                  type="button"
                  onClick={() => setShowNoteField(true)}
                  className="text-[11px] font-medium text-[#94A3B8] hover:text-white flex items-center gap-1.5 py-1"
                >
                  <FileText className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span>Add a private note</span>
                </button>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label 
                      htmlFor="input-private-note" 
                      className="text-[11px] font-semibold text-[#CBD5E1]"
                    >
                      Private Note
                    </label>
                    <span className="text-[10px] text-[#64748B]">Only you can see this</span>
                  </div>
                  <textarea
                    id="input-private-note"
                    rows={2}
                    value={note}
                    onChange={(e) => { setNote(e.target.value); handleFieldChange(); }}
                    placeholder="Where did you meet this person? Key discussion points..."
                    className="w-full px-3 py-2 rounded-lg bg-[#182030] border border-white/[0.1] text-white text-xs placeholder-[#64748B] focus:outline-none focus:border-[#E5A93C] transition-all resize-none"
                  />
                </div>
              )}
            </div>

          </div>
        </section>

        {/* Bottom padding so sticky CTA never covers form inputs */}
        <div className="h-16" />
      </div>

      {/* ============================================================= */}
      {/* 3. STICKY BOTTOM PRIMARY CTA (ADD TO MY NETWORK)              */}
      {/* ============================================================= */}
      <div className="shrink-0 p-4 bg-gradient-to-t from-[#0A0D14] via-[#0A0D14]/95 to-transparent border-t border-white/[0.06] z-20">
        <button
          id="btn-add-to-network"
          type="button"
          onClick={handleSaveContact}
          disabled={isSaving || isSaved}
          className="w-full h-[52px] rounded-xl bg-[#E5A93C] hover:bg-amber-400 text-[#0A0D14] font-bold text-sm tracking-tight transition-all active:scale-[0.99] flex items-center justify-center gap-2 shadow-lg disabled:opacity-80"
          style={{ minHeight: DESIGN_TOKENS.touchTarget.minHeight }}
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-[#0A0D14]" />
              <span>Adding to My Network...</span>
            </>
          ) : isSaved ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Added to My Network</span>
            </>
          ) : (
            <>
              <span>Add to My Network</span>
            </>
          )}
        </button>
      </div>

      {/* ============================================================= */}
      {/* 4. CARD INSPECTION MODAL ("View card")                        */}
      {/* ============================================================= */}
      {showCardModal && (
        <div 
          className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-4 animate-fade-in select-none"
          onClick={() => setShowCardModal(false)}
        >
          <div className="flex items-center justify-between text-white pb-2 border-b border-white/10">
            <span className="text-xs font-bold">Original Captured Card</span>
            <button
              onClick={() => setShowCardModal(false)}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white"
              aria-label="Close card preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* High-Resolution Full Card Simulation */}
          <div 
            className="my-auto w-full max-w-[340px] mx-auto rounded-2xl p-5 text-[#0F172A] shadow-2xl relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #F8FAFC 0%, #EDEFEA 100%)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#B45309] via-[#D97706] to-[#F59E0B]" />
            
            <div className="flex items-start justify-between">
              <div>
                <p className="font-extrabold text-base tracking-tight text-[#0F172A] uppercase">
                  Arjun Deshmukh
                </p>
                <p className="text-xs font-semibold text-[#B45309]">
                  Sales Manager
                </p>
              </div>

              <div className="w-8 h-8 rounded-lg bg-[#0F172A] text-amber-400 flex items-center justify-center font-bold text-xs">
                V
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-black/[0.1] space-y-1.5 text-xs text-[#334155]">
              <p className="font-bold text-sm text-[#0F172A]">
                Vertex Industrial Solutions
              </p>
              <p className="text-[11px] font-medium">
                Plot 48, MIDC Bhosari Industrial Estate
              </p>
              <p className="text-[11px]">
                Pune, Maharashtra 411026
              </p>
              <div className="pt-2 space-y-1 text-[11px]">
                <p className="font-medium text-[#0F172A]">M: +91 98220 45871</p>
                <p>E: arjun@vertexindustrial.in</p>
                <p>W: vertexindustrial.in</p>
              </div>
            </div>
          </div>

          <div className="text-center pb-2">
            <button
              onClick={() => setShowCardModal(false)}
              className="px-6 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 5. CATEGORY SELECTION BOTTOM SHEET                            */}
      {/* ============================================================= */}
      {showCategorySheet && (
        <div 
          className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end animate-fade-in select-none"
          onClick={() => setShowCategorySheet(false)}
        >
          <div 
            className="bg-[#121722] border-t border-white/15 rounded-t-3xl p-5 max-h-[75%] flex flex-col space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-1 border-b border-white/10">
              <div>
                <h3 className="text-xs font-bold text-white">Business Category</h3>
                <p className="text-[10px] text-[#94A3B8]">Select or confirm industry category</p>
              </div>
              <button
                onClick={() => setShowCategorySheet(false)}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-[#94A3B8] hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Search filter */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#64748B]" />
              <input
                type="text"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                placeholder="Search categories..."
                className="w-full h-8 pl-8 pr-3 rounded-lg bg-[#182030] border border-white/10 text-xs text-white placeholder-[#64748B] focus:outline-none"
              />
            </div>

            {/* List */}
            <div className="overflow-y-auto space-y-1 max-h-52 pr-1">
              {filteredCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setCategory(cat);
                    setCategoryConfirmed(true);
                    setShowCategorySheet(false);
                    handleFieldChange();
                  }}
                  className={`w-full px-3 py-2 rounded-lg text-left text-xs flex items-center justify-between transition-all ${
                    category === cat 
                      ? 'bg-[#E5A93C]/20 text-[#E5A93C] font-bold border border-[#E5A93C]/40'
                      : 'hover:bg-white/5 text-[#CBD5E1]'
                  }`}
                >
                  <span>{cat}</span>
                  {category === cat && <Check className="w-3.5 h-3.5 text-[#E5A93C]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 6. DISCARD CHANGES CONFIRMATION MODAL                         */}
      {/* ============================================================= */}
      {showDiscardConfirm && (
        <div 
          className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-5 select-none animate-fade-in"
          onClick={() => setShowDiscardConfirm(false)}
        >
          <div 
            className="bg-[#141B29] border border-white/15 rounded-2xl p-5 max-w-[280px] w-full text-center space-y-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold text-white">Discard changes?</h4>
            <p className="text-xs text-[#94A3B8]">
              Your edited contact fields will be lost if you return to the scanner.
            </p>
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={() => setShowDiscardConfirm(false)}
                className="w-full py-2.5 rounded-xl bg-[#E5A93C] text-[#0A0D14] font-bold text-xs"
              >
                Keep Editing
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDiscardConfirm(false);
                  onBackToScanner();
                }}
                className="w-full py-2 rounded-xl bg-transparent text-[#94A3B8] hover:text-white text-xs font-semibold"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* 7. COMPACT SUCCESS PAYOFF MODAL (AFTER SAVE CONFIRMATION)     */}
      {/* ============================================================= */}
      {isSaved && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center px-6 text-center animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981] mb-4 shadow-xl">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <p className="text-[11px] font-semibold text-[#10B981] uppercase tracking-wider mb-1">
            ✓ Added to My Network
          </p>

          <h3 className="text-lg font-bold text-white tracking-tight">
            {name || 'Contact'} is now in your network.
          </h3>

          <p className="text-xs text-[#94A3B8] mt-1.5 max-w-[250px]">
            You can find his details, company info, and direct phone number anytime.
          </p>

          {/* Quick summary chip */}
          <div className="mt-4 bg-[#141B29] border border-white/10 rounded-xl p-3 w-full max-w-[260px] text-left text-[11px] text-[#CBD5E1] space-y-1">
            <p className="font-bold text-white truncate">{name}</p>
            <p className="text-[10px] text-[#94A3B8] truncate">{designation} • {company}</p>
            <p className="text-[10px] text-[#E5A93C]">{phones[0] || 'Phone saved'}</p>
          </div>

          <button
            id="btn-continue-to-screen10"
            type="button"
            onClick={() => {
              onSaveSuccess({
                name,
                designation,
                company,
                category,
                categoryConfirmed,
                address,
                phones,
                emails,
                website,
                instagram,
                tags,
                note,
              });
            }}
            className="mt-6 w-full max-w-[260px] h-12 rounded-xl bg-[#E5A93C] text-[#0A0D14] font-bold text-xs shadow-lg transition-all active:scale-95"
          >
            Continue
          </button>
        </div>
      )}

      {/* ============================================================= */}
      {/* 8. REVIEWER INSPECTION CONTROLS (COLLAPSIBLE TEST DRAWER)     */}
      {/* ============================================================= */}
      <div className="absolute top-14 right-4 z-30 pointer-events-auto">
        <details className="group">
          <summary className="list-none cursor-pointer bg-[#121722]/90 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-full text-[10px] text-[#94A3B8] hover:text-white flex items-center gap-1 shadow-md">
            <span>Inspector</span>
            <span className="text-[#E5A93C]">▾</span>
          </summary>
          <div className="mt-1 bg-[#121722] border border-white/20 rounded-xl p-2.5 shadow-2xl space-y-2 text-[10px] w-56">
            <p className="text-[#94A3B8] font-semibold">Test Variants:</p>
            <button
              onClick={() => setSimulatedDuplicateMatch(!simulatedDuplicateMatch)}
              className={`w-full px-2 py-1 rounded text-left border ${
                simulatedDuplicateMatch ? 'bg-blue-500/20 border-blue-400 text-white' : 'border-white/5 text-[#94A3B8]'
              }`}
            >
              Toggle Profile Match Banner
            </button>
            <button
              onClick={() => setSimulatedSaveError(!simulatedSaveError)}
              className={`w-full px-2 py-1 rounded text-left border ${
                simulatedSaveError ? 'bg-red-500/20 border-red-400 text-white' : 'border-white/5 text-[#94A3B8]'
              }`}
            >
              Toggle Save Failure Alert
            </button>
            <button
              onClick={() => {
                setName('Shrinivas Venkateshwara Rao Kulkarni');
                setCompany('Shree Siddhivinayak Industrial Engineering Solutions Private Limited');
                setAddress('Plot No. 124/B, General Block, Bhosari Industrial Area, Pune 411026, Maharashtra, India');
              }}
              className="w-full px-2 py-1 rounded text-left border border-white/5 text-[#94A3B8] hover:text-white"
            >
              Test Long Text Fields
            </button>
            <button
              onClick={() => {
                setName('अर्जुन देशमुख');
                setDesignation('विक्री व्यवस्थापक');
                setCompany('व्हर्टेक्स इंडस्ट्रियल सोल्युशन्स');
                setAddress('पुणे, महाराष्ट्र');
              }}
              className="w-full px-2 py-1 rounded text-left border border-white/5 text-[#94A3B8] hover:text-white"
            >
              Test Devanagari (Marathi)
            </button>
          </div>
        </details>
      </div>

    </div>
  );
};
