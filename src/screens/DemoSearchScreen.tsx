import React, { useState } from 'react';
import { 
  Search, 
  ArrowLeft, 
  Building2, 
  Briefcase, 
  MapPin, 
  ChevronRight, 
  Sparkles,
  CheckCircle2,
  Users
} from 'lucide-react';
import { DESIGN_TOKENS } from '../design-system/tokens';

interface DemoSearchScreenProps {
  onBackToGetStarted: () => void;
  onSelectABCManufacturing: () => void;
  onSelectNexaConsulting?: () => void;
  isLargeTextMode?: boolean;
}

export const DemoSearchScreen: React.FC<DemoSearchScreenProps> = ({
  onBackToGetStarted,
  onSelectABCManufacturing,
  onSelectNexaConsulting,
  isLargeTextMode = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('Rahul Patil');

  return (
    <div
      id="screen-demo-step1-search"
      className="h-full w-full flex flex-col justify-between overflow-y-auto px-5 py-3 text-[#F8FAFC] select-none relative"
      style={{
        backgroundColor: DESIGN_TOKENS.colors.background,
        fontFamily: DESIGN_TOKENS.typography.fontFamily,
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* TOP BAR: Back Navigation + Demo Progress Indicator           */}
      {/* ------------------------------------------------------------- */}
      <div className="pt-2 pb-2 shrink-0 flex items-center justify-between border-b border-white/[0.06]">
        <button
          id="btn-demo1-back"
          onClick={onBackToGetStarted}
          className="h-9 px-2.5 -ml-1 rounded-xl flex items-center gap-1.5 text-xs text-[#94A3B8] hover:text-white hover:bg-white/[0.04] transition-colors"
          aria-label="Back to Get Started"
        >
          <ArrowLeft className="w-4 h-4 text-[#E5A93C]" />
          <span className="font-medium">Get Started</span>
        </button>

        {/* Demo Progress Component */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-[#141A27] px-2.5 py-1 rounded-full border border-white/[0.08]">
            <span className="w-2 h-2 rounded-full bg-[#E5A93C] animate-pulse" />
            <span className="text-[11px] font-semibold text-white">Step 1 of 3</span>
            <span className="text-[11px] text-[#64748B]">•</span>
            <span className="text-[11px] text-[#E5A93C] font-medium">Find</span>
          </div>
          <span className="text-[10px] text-[#64748B] font-medium hidden sm:inline">Quick demo</span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MAIN CONTENT: Search Simulation & Two Business Identities     */}
      {/* ------------------------------------------------------------- */}
      <div className="flex-1 py-3 flex flex-col gap-3">
        {/* Short Concept Explanation */}
        <div className="space-y-1">
          <h2 className={`font-bold tracking-tight text-white ${isLargeTextMode ? 'text-xl' : 'text-lg'}`}>
            Find the person you met
          </h2>
          <p className="text-xs text-[#94A3B8] leading-relaxed">
            One person can have multiple business identities. Choose the business you know them through.
          </p>
        </div>

        {/* Simulated Search Input */}
        <div className="relative">
          <div className="w-full h-11 rounded-xl bg-[#121722] border border-[#E5A93C]/50 px-3.5 flex items-center gap-2.5 shadow-sm">
            <Search className="w-4 h-4 text-[#E5A93C] shrink-0" />
            <span className="text-sm font-semibold text-white tracking-wide flex-1">
              {searchQuery}
            </span>
            <span className="text-[10px] font-medium text-[#64748B] bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06]">
              Search
            </span>
          </div>
        </div>

        {/* Search Results Section Header */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[11px] font-semibold text-[#94A3B8] tracking-wider uppercase">
            2 Business Identities Found
          </span>
          <span className="text-[11px] text-[#E5A93C] font-medium">
            Same Person • Different Roles
          </span>
        </div>

        {/* Two Business Identities List */}
        <div className="space-y-2.5">
          {/* Identity 1: ABC Manufacturing (TARGET FOR STEP 2) */}
          <button
            id="btn-select-identity-abc"
            onClick={onSelectABCManufacturing}
            className="w-full text-left p-3.5 rounded-2xl bg-[#121722] border-2 border-[#E5A93C]/60 hover:border-[#E5A93C] hover:bg-[#182030] transition-all duration-200 group relative shadow-md"
          >
            {/* Target Selection Pulse Badge */}
            <div className="absolute -top-2.5 right-3 bg-[#E5A93C] text-[#0A0D14] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 fill-[#0A0D14]" />
              <span>Tap to Continue</span>
            </div>

            <div className="flex items-start gap-3">
              {/* Person Avatar */}
              <div className="w-11 h-11 rounded-xl bg-[#E5A93C]/15 border border-[#E5A93C]/40 flex items-center justify-center text-[#E5A93C] font-bold text-sm shrink-0">
                RP
              </div>

              <div className="flex-1 min-w-0">
                {/* Person + Role */}
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-white truncate">Rahul Patil</h3>
                  <span className="text-xs text-[#E5A93C] font-semibold">• Owner</span>
                </div>

                {/* Company Name */}
                <div className="flex items-center gap-1 text-xs font-semibold text-[#CBD5E1] mt-0.5">
                  <Building2 className="w-3.5 h-3.5 text-[#E5A93C] shrink-0" />
                  <span className="truncate">ABC Manufacturing</span>
                </div>

                {/* Industry & Location */}
                <div className="flex items-center gap-1 text-[11px] text-[#64748B] mt-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">Manufacturing • Solapur, Maharashtra</span>
                </div>
              </div>

              <div className="self-center pl-1">
                <div className="w-8 h-8 rounded-full bg-[#E5A93C]/10 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C] group-hover:bg-[#E5A93C] group-hover:text-[#0A0D14] transition-all">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </button>

          {/* Identity 2: Nexa Consulting (Alternate Business Identity) */}
          <div
            className="w-full text-left p-3.5 rounded-2xl bg-[#121722]/70 border border-white/[0.08] relative opacity-85"
          >
            <div className="flex items-start gap-3">
              {/* Person Avatar */}
              <div className="w-11 h-11 rounded-xl bg-white/[0.05] border border-white/[0.1] flex items-center justify-center text-[#94A3B8] font-bold text-sm shrink-0">
                RP
              </div>

              <div className="flex-1 min-w-0">
                {/* Person + Role */}
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-[#CBD5E1] truncate">Rahul Patil</h3>
                  <span className="text-xs text-[#94A3B8] font-medium">• Partner</span>
                </div>

                {/* Company Name */}
                <div className="flex items-center gap-1 text-xs font-semibold text-[#94A3B8] mt-0.5">
                  <Briefcase className="w-3.5 h-3.5 text-[#64748B] shrink-0" />
                  <span className="truncate">Nexa Consulting</span>
                </div>

                {/* Industry & Location */}
                <div className="flex items-center gap-1 text-[11px] text-[#64748B] mt-1">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">Management Consulting • Pune</span>
                </div>
              </div>

              <div className="self-center pl-1">
                <span className="text-[10px] text-[#64748B] px-2 py-1 rounded bg-white/[0.03] border border-white/[0.06]">
                  Separate ID
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* BOTTOM FOOTER: Teaching Hint for Demo Step 1                  */}
      {/* ------------------------------------------------------------- */}
      <div className="pt-2 pb-1 border-t border-white/[0.06] text-center shrink-0">
        <p className="text-[11px] text-[#94A3B8]">
          Select <strong className="text-[#E5A93C]">ABC Manufacturing</strong> to see Rahul's specific business identity.
        </p>
      </div>
    </div>
  );
};
