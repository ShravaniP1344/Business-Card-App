import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  X,
  SlidersHorizontal,
  History,
  Clock,
  Building2,
  User,
  Users,
  Home as HomeIcon,
  ScanLine,
  Star,
  MapPin,
  CheckCircle2,
  AlertCircle,
  WifiOff,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Sliders,
  Briefcase,
  ArrowRight
} from 'lucide-react';
import { DESIGN_TOKENS } from '../design-system/tokens';

export interface BusinessIdentityItem {
  id: string;
  businessName: string;
  role: string;
  category: string;
  city: string;
  state?: string;
  isInNetwork: boolean;
  additionStatus?: 'idle' | 'adding' | 'added' | 'failed';
}

export interface PersonSearchResult {
  id: string;
  name: string;
  initials: string;
  avatarColor?: string;
  profilePhoto?: string | null;
  businessIdentities: BusinessIdentityItem[];
  totalIdentitiesCount?: number;
}

export interface BusinessSearchResult {
  id: string;
  businessName: string;
  category: string;
  city: string;
  state: string;
  monogram: string;
  logoUrl?: string | null;
  rating: number;
  reviewCount: number;
  description: string;
}

interface SearchDiscoverScreenProps {
  initialQuery?: string;
  initialFocus?: boolean;
  onNavigateToHome?: () => void;
  onNavigateToScan?: (mode?: 'card' | 'qr') => void;
  onNavigateToMyNetwork?: () => void;
  onNavigateToProfile?: () => void;
  onOpenPersonProfile?: (personId: string, identityId?: string) => void;
  onOpenBusinessProfile?: (businessId: string) => void;
  isLargeTextMode?: boolean;
  networkState?: Record<string, boolean>;
  onNetworkStateChange?: (personId: string, identityId: string, isInNetwork: boolean) => void;
}

export const SearchDiscoverScreen: React.FC<SearchDiscoverScreenProps> = ({
  initialQuery = 'Rahul',
  initialFocus = false,
  onNavigateToHome,
  onNavigateToScan,
  onNavigateToMyNetwork,
  onNavigateToProfile,
  onOpenPersonProfile,
  onOpenBusinessProfile,
  isLargeTextMode = false,
  networkState,
  onNetworkStateChange,
}) => {
  // Search query & active tab states
  const [query, setQuery] = useState<string>(initialQuery);
  const [activeTab, setActiveTab] = useState<'all' | 'businesses' | 'people'>('all');
  
  // Navigation bottom bar selection
  const [activeNavTab, setActiveNavTab] = useState<'home' | 'search' | 'scan' | 'network' | 'profile'>('search');

  // Interactive prototype test inspector state
  const [showInspector, setShowInspector] = useState<boolean>(false);
  const [prototypeScenario, setPrototypeScenario] = useState<
    'populated' | 'empty-discovery' | 'no-results' | 'devanagari' | 'loading' | 'offline' | 'partial-failure' | 'network-error'
  >('populated');

  // Filter bottom sheet & active filters
  const [showFilterSheet, setShowFilterSheet] = useState<boolean>(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedLocationFilter, setSelectedLocationFilter] = useState<string>('all');
  
  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  // Focus reference
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus logic
  useEffect(() => {
    if (initialFocus && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [initialFocus]);

  // Toast trigger helper
  const triggerToast = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Recent searches state (Private to current user)
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Rahul Patil',
    'Manufacturing',
    'Solapur',
  ]);

  // Browse categories list
  const browseCategories = [
    { label: 'Manufacturing', icon: '🏭' },
    { label: 'Technology', icon: '💻' },
    { label: 'Consulting', icon: '📊' },
    { label: 'Healthcare', icon: '🏥' },
    { label: 'Real Estate', icon: '🏢' },
    { label: 'Finance', icon: '📈' },
  ];

  // People Dataset: Rahul Patil with 2 business identities + other profiles
  // Note: ABC Manufacturing is already saved (✓ In Network) by default per Screen 16 & 17 specifications
  const [peopleData, setPeopleData] = useState<PersonSearchResult[]>([
    {
      id: 'person-rahul-patil',
      name: 'Rahul Patil',
      initials: 'RP',
      avatarColor: '#E5A93C',
      businessIdentities: [
        {
          id: 'biz-id-abc',
          businessName: 'ABC Manufacturing',
          role: 'Owner',
          category: 'Manufacturing',
          city: 'Solapur',
          state: 'Maharashtra',
          isInNetwork: true,
          additionStatus: 'added',
        },
        {
          id: 'biz-id-nexa',
          businessName: 'Nexa Consulting',
          role: 'Partner',
          category: 'Business Consulting',
          city: 'Pune',
          state: 'Maharashtra',
          isInNetwork: false,
          additionStatus: 'idle',
        },
      ],
      totalIdentitiesCount: 2,
    },
    {
      id: 'person-rahul-deshpande',
      name: 'Rahul Deshpande',
      initials: 'RD',
      avatarColor: '#38BDF8',
      businessIdentities: [
        {
          id: 'biz-id-rp-tech',
          businessName: 'RP Technologies',
          role: 'Director',
          category: 'Technology',
          city: 'Pune',
          state: 'Maharashtra',
          isInNetwork: false,
          additionStatus: 'idle',
        },
      ],
      totalIdentitiesCount: 1,
    },
    {
      id: 'person-shrinivas-long',
      name: 'Shrinivas Venkateshwara Rao Kulkarni',
      initials: 'SK',
      avatarColor: '#A78BFA',
      businessIdentities: [
        {
          id: 'biz-id-siddhivinayak',
          businessName: 'Shree Siddhivinayak Industrial Engineering Solutions Private Limited',
          role: 'Senior Business Development & Strategic Partnerships Manager',
          category: 'Engineering',
          city: 'Solapur',
          state: 'Maharashtra',
          isInNetwork: false,
          additionStatus: 'idle',
        },
      ],
      totalIdentitiesCount: 1,
    },
  ]);

  // Business Dataset: Distinct from people, includes ratings & reviews
  const [businessData, setBusinessData] = useState<BusinessSearchResult[]>([
    {
      id: 'biz-rahul-enterprises',
      businessName: 'Rahul Enterprises',
      category: 'Retail & Wholesale',
      city: 'Solapur',
      state: 'Maharashtra',
      monogram: 'RE',
      rating: 4.4,
      reviewCount: 18,
      description: 'Wholesale merchandise, hardware supplies and retail distribution in Solapur.',
    },
    {
      id: 'biz-abc-manufacturing',
      businessName: 'ABC Manufacturing',
      category: 'Manufacturing',
      city: 'Solapur',
      state: 'Maharashtra',
      monogram: 'AM',
      rating: 4.6,
      reviewCount: 24,
      description: 'Industrial manufacturing, custom fabrication, and precision engineering solutions.',
    },
    {
      id: 'biz-precision-tools',
      businessName: 'Precision Tools India',
      category: 'Manufacturing',
      city: 'Pune',
      state: 'Maharashtra',
      monogram: 'PT',
      rating: 4.8,
      reviewCount: 42,
      description: 'Heavy duty cutting tools, lathe components, and CNC equipment supplies.',
    },
    {
      id: 'biz-aikyam-systems',
      businessName: 'Aikyam AI Systems',
      category: 'Technology',
      city: 'Solapur',
      state: 'Maharashtra',
      monogram: 'AI',
      rating: 4.9,
      reviewCount: 31,
      description: 'Enterprise AI workflows, automated verification, and modern web application development.',
    },
  ]);

  // Devanagari (मराठी) Sample Dataset
  const devanagariPeopleData: PersonSearchResult[] = [
    {
      id: 'person-dev-rahul',
      name: 'राहुल पाटील',
      initials: 'रा',
      avatarColor: '#E5A93C',
      businessIdentities: [
        {
          id: 'dev-biz-abc',
          businessName: 'एबीसी मॅन्युफॅक्चरिंग',
          role: 'मालक / व्यवस्थापक',
          category: 'उत्पादन (Manufacturing)',
          city: 'सोलापूर',
          state: 'महाराष्ट्र',
          isInNetwork: false,
          additionStatus: 'idle',
        },
        {
          id: 'dev-biz-nexa',
          businessName: 'नेक्सा कन्सल्टिंग',
          role: 'भागीदार (Partner)',
          category: 'व्यवसाय सल्लागार',
          city: 'पुणे',
          state: 'महाराष्ट्र',
          isInNetwork: false,
          additionStatus: 'idle',
        },
      ],
      totalIdentitiesCount: 2,
    },
  ];

  const devanagariBusinessData: BusinessSearchResult[] = [
    {
      id: 'biz-dev-rahul-ent',
      businessName: 'राहुल एंटरप्रायझेस',
      category: 'किरकोळ व ठोक विक्री',
      city: 'सोलापूर',
      state: 'महाराष्ट्र',
      monogram: 'रा',
      rating: 4.4,
      reviewCount: 18,
      description: 'सोलापूर परिसरातील ठोक आणि किरकोळ व्यापार व पुरवठा केंद्र.',
    },
    {
      id: 'biz-dev-abc',
      businessName: 'एबीसी मॅन्युफॅक्चरिंग',
      category: 'औद्योगिक उत्पादने',
      city: 'सोलापूर',
      state: 'महाराष्ट्र',
      monogram: 'ए',
      rating: 4.6,
      reviewCount: 24,
      description: 'औद्योगिक यंत्रसामग्री आणि अचूक अभियांत्रिकी घटक.',
    },
  ];

  // Synchronize scenario with dataset
  useEffect(() => {
    if (prototypeScenario === 'empty-discovery') {
      setQuery('');
    } else if (prototypeScenario === 'no-results') {
      setQuery('xyz999unmatched');
    } else if (prototypeScenario === 'devanagari') {
      setQuery('राहुल');
    } else if (prototypeScenario === 'populated') {
      setQuery('Rahul');
    }
  }, [prototypeScenario]);

  // Synchronize external network state across screens (Screen 16 & 17 synchronization)
  useEffect(() => {
    if (networkState) {
      setPeopleData(prev =>
        prev.map(p => ({
          ...p,
          businessIdentities: p.businessIdentities.map(b => {
            if (networkState[b.id] !== undefined) {
              return {
                ...b,
                isInNetwork: networkState[b.id],
                additionStatus: networkState[b.id] ? 'added' : 'idle',
              };
            }
            return b;
          }),
        }))
      );
    }
  }, [networkState]);

  // Active dataset choice based on scenario
  const currentPeopleData = useMemo(() => {
    if (prototypeScenario === 'devanagari') return devanagariPeopleData;
    return peopleData;
  }, [prototypeScenario, peopleData]);

  const currentBusinessData = useMemo(() => {
    if (prototypeScenario === 'devanagari') return devanagariBusinessData;
    return businessData;
  }, [prototypeScenario, businessData]);

  // Calculate active filters count
  const activeFiltersCount = (selectedCategoryFilter !== 'all' ? 1 : 0) + (selectedLocationFilter !== 'all' ? 1 : 0);

  // Search filtering logic (Single global search across Person name, Business name, Category/Service, Location)
  const filteredResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return { people: [], businesses: [], totalMatches: 0 };
    }

    // Filter People by name, role, associated business name, category, or city
    const matchedPeople = currentPeopleData.filter(person => {
      // Category filter check
      if (selectedCategoryFilter !== 'all') {
        const matchesCategory = person.businessIdentities.some(b => 
          b.category.toLowerCase().includes(selectedCategoryFilter.toLowerCase())
        );
        if (!matchesCategory) return false;
      }
      // Location filter check
      if (selectedLocationFilter !== 'all') {
        const matchesLocation = person.businessIdentities.some(b => 
          b.city.toLowerCase().includes(selectedLocationFilter.toLowerCase())
        );
        if (!matchesLocation) return false;
      }

      // Query match check
      const nameMatch = person.name.toLowerCase().includes(trimmed);
      const identityMatch = person.businessIdentities.some(b => 
        b.businessName.toLowerCase().includes(trimmed) ||
        b.role.toLowerCase().includes(trimmed) ||
        b.category.toLowerCase().includes(trimmed) ||
        b.city.toLowerCase().includes(trimmed)
      );

      return nameMatch || identityMatch;
    });

    // Filter Businesses by business name, category, city, or description
    const matchedBusinesses = currentBusinessData.filter(biz => {
      // Category filter check
      if (selectedCategoryFilter !== 'all' && !biz.category.toLowerCase().includes(selectedCategoryFilter.toLowerCase())) {
        return false;
      }
      // Location filter check
      if (selectedLocationFilter !== 'all' && !biz.city.toLowerCase().includes(selectedLocationFilter.toLowerCase())) {
        return false;
      }

      // Query match check
      const nameMatch = biz.businessName.toLowerCase().includes(trimmed);
      const catMatch = biz.category.toLowerCase().includes(trimmed);
      const cityMatch = biz.city.toLowerCase().includes(trimmed);
      const descMatch = biz.description.toLowerCase().includes(trimmed);

      return nameMatch || catMatch || cityMatch || descMatch;
    });

    return {
      people: matchedPeople,
      businesses: matchedBusinesses,
      totalMatches: matchedPeople.length + matchedBusinesses.length,
    };
  }, [query, currentPeopleData, currentBusinessData, selectedCategoryFilter, selectedLocationFilter]);

  // Execute addition of a specific business identity to My Network
  const handleAddIdentityToNetwork = (personId: string, identityId: string) => {
    // Set adding status
    setPeopleData(prev =>
      prev.map(p => {
        if (p.id !== personId) return p;
        return {
          ...p,
          businessIdentities: p.businessIdentities.map(b => {
            if (b.id !== identityId) return b;
            return { ...b, additionStatus: 'adding' };
          }),
        };
      })
    );

    // Simulate backend network addition delay (immediate directional save, no approval request)
    setTimeout(() => {
      if (prototypeScenario === 'partial-failure') {
        // Demonstrate failure resilience
        setPeopleData(prev =>
          prev.map(p => {
            if (p.id !== personId) return p;
            return {
              ...p,
              businessIdentities: p.businessIdentities.map(b => {
                if (b.id !== identityId) return b;
                return { ...b, additionStatus: 'idle' };
              }),
            };
          })
        );
        triggerToast("Couldn't add to your network. Try again.", 'error');
        return;
      }

      // Success transition: only this specific identity is marked in network!
      setPeopleData(prev =>
        prev.map(p => {
          if (p.id !== personId) return p;
          return {
            ...p,
            businessIdentities: p.businessIdentities.map(b => {
              if (b.id !== identityId) return b;
              return { ...b, additionStatus: 'added', isInNetwork: true };
            }),
          };
        })
      );
      if (onNetworkStateChange) {
        onNetworkStateChange(personId, identityId, true);
      }
      triggerToast('Added to your network', 'success');
    }, 450);
  };

  // Clear search field
  const handleClearQuery = () => {
    setQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  // Remove an individual recent search
  const handleRemoveRecentSearch = (itemToRemove: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches(prev => prev.filter(item => item !== itemToRemove));
  };

  // Clear all recent searches
  const handleClearAllRecentSearches = () => {
    setRecentSearches([]);
    triggerToast('Recent searches cleared');
  };

  // Tapping a category chip executes category search
  const handleSelectCategory = (cat: string) => {
    setQuery(cat);
    setActiveTab('all');
  };

  // Tapping recent search item executes search
  const handleSelectRecentSearch = (item: string) => {
    setQuery(item);
    setActiveTab('all');
  };

  return (
    <div
      id="screen-16-search-discover"
      className="relative flex flex-col h-full w-full bg-[#0A0D14] text-[#F8FAFC] select-none overflow-hidden font-sans"
      style={{ fontFamily: DESIGN_TOKENS.typography.fontFamily }}
    >
      {/* OFFLINE STATUS BANNER (Section 52) */}
      {(prototypeScenario === 'offline') && (
        <div className="relative z-40 bg-[#1F293D] border-b border-[#F59E0B]/30 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-[#F59E0B]">
          <div className="flex items-center gap-1.5">
            <WifiOff className="w-3.5 h-3.5" />
            <span className="font-medium">You're offline • Search needs an internet connection</span>
          </div>
          <button
            onClick={() => {
              setPrototypeScenario('populated');
              triggerToast('Reconnected to network', 'info');
            }}
            className="text-[10px] underline font-semibold hover:text-white"
          >
            Retry
          </button>
        </div>
      )}

      {/* TOAST NOTIFICATION (Fixed overlay) */}
      {toastMessage && (
        <div 
          className={`absolute top-14 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 rounded-full backdrop-blur-md border text-[11px] font-medium shadow-xl flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200 ${
            toastType === 'error'
              ? 'bg-[#EF4444]/95 border-[#EF4444]/30 text-white'
              : toastType === 'success'
              ? 'bg-[#10B981]/95 border-[#10B981]/30 text-white'
              : 'bg-[#182030]/95 border-white/[0.15] text-[#F8FAFC]'
          }`}
        >
          {toastType === 'error' ? (
            <AlertCircle className="w-3.5 h-3.5 text-white" />
          ) : toastType === 'success' ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* COMPACT APPLICATION HEADER: Title "Search" (Section 2) */}
      <header className="relative z-20 bg-[#0A0D14]/95 backdrop-blur-md border-b border-white/[0.06] px-4 pt-3 pb-2.5 shrink-0">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h1 className="text-base font-bold text-white tracking-tight leading-tight">
              {prototypeScenario === 'devanagari' ? 'शोध (Search)' : 'Search'}
            </h1>
          </div>

          {/* Prototype Inspector & Diagnostics Toggle */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowInspector(!showInspector)}
              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
                showInspector
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-[#E5A93C]'
                  : 'bg-[#121722] border-white/[0.08] text-[#94A3B8] hover:text-white'
              }`}
              title="Screen 16 Prototype Scenarios & Verification"
              aria-label="Toggle Screen 16 inspector"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* PROMINENT GLOBAL SEARCH FIELD + FILTER BUTTON (Section 3, 12, 13) */}
        <div className="mt-2.5 flex items-center gap-2">
          {/* Main Search Input Container */}
          <div className="relative flex-1 flex items-center h-11 px-3 rounded-xl bg-[#121722] border border-white/[0.12] focus-within:border-[#E5A93C] transition-all shadow-xs">
            <Search className="w-4 h-4 text-[#94A3B8] shrink-0 mr-2" />
            <input
              ref={searchInputRef}
              id="global-search-input"
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={
                prototypeScenario === 'devanagari'
                  ? 'व्यक्ती, व्यवसाय किंवा सेवा शोधा'
                  : 'Search people, businesses or services'
              }
              className="w-full bg-transparent text-[13px] text-white placeholder-[#64748B] outline-hidden truncate"
              autoComplete="off"
              spellCheck="false"
              aria-label="Search people, businesses or services"
            />
            {/* Clear X Action (when text exists) */}
            {query.length > 0 && (
              <button
                id="btn-clear-search-query"
                onClick={handleClearQuery}
                className="w-6 h-6 rounded-full flex items-center justify-center text-[#94A3B8] hover:text-white hover:bg-white/[0.06] transition-all shrink-0 ml-1"
                aria-label="Clear search text"
                title="Clear"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Compact Filter Button (Section 13, 46) */}
          <button
            id="btn-open-search-filters"
            onClick={() => setShowFilterSheet(true)}
            className={`h-11 px-3 rounded-xl border flex items-center justify-center gap-1.5 transition-all shrink-0 active:scale-95 ${
              activeFiltersCount > 0
                ? 'bg-[#E5A93C]/15 border-[#E5A93C] text-[#E5A93C] font-semibold'
                : 'bg-[#121722] border-white/[0.12] text-[#94A3B8] hover:text-white hover:border-white/[0.2]'
            }`}
            aria-label={`Filters. ${activeFiltersCount > 0 ? `${activeFiltersCount} applied` : 'None applied'}`}
            title="Filter search"
          >
            <SlidersHorizontal className="w-4 h-4" />
            {activeFiltersCount > 0 && (
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#E5A93C] text-[#0A0D14]">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* SEARCH TABS: All, Businesses, People (Section 4, 5) */}
        {/* Switching tabs preserves the current search query! */}
        <div 
          className="flex items-center gap-1.5 mt-2.5 pt-0.5 border-t border-white/[0.04]"
          role="tablist"
          aria-label="Search category tabs"
        >
          <button
            id="tab-search-all"
            role="tab"
            aria-selected={activeTab === 'all'}
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-[11.5px] font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-[#E5A93C] text-[#0A0D14] shadow-xs'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {prototypeScenario === 'devanagari' ? 'सर्व (All)' : 'All'}
          </button>
          <button
            id="tab-search-businesses"
            role="tab"
            aria-selected={activeTab === 'businesses'}
            onClick={() => setActiveTab('businesses')}
            className={`px-3 py-1.5 rounded-lg text-[11.5px] font-semibold transition-all ${
              activeTab === 'businesses'
                ? 'bg-[#E5A93C] text-[#0A0D14] shadow-xs'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {prototypeScenario === 'devanagari' ? 'व्यवसाय (Businesses)' : 'Businesses'}
          </button>
          <button
            id="tab-search-people"
            role="tab"
            aria-selected={activeTab === 'people'}
            onClick={() => setActiveTab('people')}
            className={`px-3 py-1.5 rounded-lg text-[11.5px] font-semibold transition-all ${
              activeTab === 'people'
                ? 'bg-[#E5A93C] text-[#0A0D14] shadow-xs'
                : 'text-[#94A3B8] hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            {prototypeScenario === 'devanagari' ? 'व्यक्ती (People)' : 'People'}
          </button>
        </div>
      </header>

      {/* INSPECTOR SLIDEOUT / TEST SCENARIOS FOR SCREEN 16 */}
      {showInspector && (
        <div className="relative z-30 mx-4 mt-2 p-3 rounded-xl bg-[#121722] border border-[#E5A93C]/40 shadow-xl shrink-0">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/[0.08]">
            <span className="text-[11px] font-bold text-[#E5A93C] flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Screen 16 Architecture Test Controls
            </span>
            <button
              onClick={() => setShowInspector(false)}
              className="text-[#94A3B8] hover:text-white text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Query & Scenario Switcher */}
          <div className="grid grid-cols-3 gap-1.5 text-[10px] mb-2">
            <button
              onClick={() => {
                setPrototypeScenario('populated');
                setQuery('Rahul');
              }}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all ${
                prototypeScenario === 'populated' && query === 'Rahul'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Populated ("Rahul")
            </button>
            <button
              onClick={() => {
                setPrototypeScenario('empty-discovery');
                setQuery('');
              }}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all ${
                prototypeScenario === 'empty-discovery'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Empty Discovery
            </button>
            <button
              onClick={() => {
                setPrototypeScenario('no-results');
                setQuery('xyz999unmatched');
              }}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all ${
                prototypeScenario === 'no-results'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              No Results State
            </button>
            <button
              onClick={() => {
                setPrototypeScenario('devanagari');
                setQuery('राहुल');
              }}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all ${
                prototypeScenario === 'devanagari'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              मराठी (Devanagari)
            </button>
            <button
              onClick={() => setPrototypeScenario('loading')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all ${
                prototypeScenario === 'loading'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Skeleton Loading
            </button>
            <button
              onClick={() => setPrototypeScenario('partial-failure')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all ${
                prototypeScenario === 'partial-failure'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Partial API Fail
            </button>
            <button
              onClick={() => setPrototypeScenario('offline')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all ${
                prototypeScenario === 'offline'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Offline State
            </button>
            <button
              onClick={() => setPrototypeScenario('network-error')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all ${
                prototypeScenario === 'network-error'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Full Error State
            </button>
            <button
              onClick={() => {
                setQuery('Manufacturing');
                setActiveTab('all');
              }}
              className="px-2 py-1.5 rounded-lg border font-medium bg-[#182030] border-white/[0.06] text-[#94A3B8] hover:text-white"
            >
              Query: "Manufacturing"
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-white/[0.06] text-[10px]">
            <span className="text-[#64748B]">Query: "{query}" • Tab: {activeTab}</span>
            <button
              onClick={() => {
                // Reset all to defaults
                setPeopleData(prev =>
                  prev.map(p => ({
                    ...p,
                    businessIdentities: p.businessIdentities.map(b => ({
                      ...b,
                      isInNetwork: false,
                      additionStatus: 'idle',
                    })),
                  }))
                );
                triggerToast('Network states reset');
              }}
              className="text-[#E5A93C] hover:underline"
            >
              Reset Network States
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MAIN BODY CONTENT AREA */}
      {/* ========================================================================= */}
      {prototypeScenario === 'network-error' ? (
        /* FULL NETWORK FAILURE STATE (Section 50) */
        <main className="relative z-10 flex-1 px-5 flex flex-col items-center justify-center text-center p-6">
          <div className="w-12 h-12 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444] mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-white mb-1">Couldn't load results.</h2>
          <p className="text-xs text-[#94A3B8] max-w-[260px] mb-4">
            Check your connection and try again.
          </p>
          <button
            onClick={() => setPrototypeScenario('populated')}
            className="px-4 py-2 rounded-xl bg-[#E5A93C] text-[#0A0D14] text-xs font-semibold hover:bg-[#D49629] transition-all"
          >
            Try Again
          </button>
        </main>
      ) : query.trim().length === 0 ? (
        /* ======================================================================= */
        /* DEFAULT / NO QUERY DISCOVERY STATE (Section 6, 7, 8, 9, 10, 72) */
        /* ======================================================================= */
        <main className="relative z-10 flex-1 overflow-y-auto min-h-0 px-4 pt-3.5 pb-24 space-y-5">
          
          {/* 1. RECENT SEARCHES (Section 7, 8, 48, 49) */}
          {recentSearches.length > 0 && (
            <section aria-labelledby="heading-recent-searches">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#94A3B8]" />
                  <h2 id="heading-recent-searches" className="text-[12px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    Recent Searches
                  </h2>
                </div>
                <button
                  id="btn-clear-all-recent-searches"
                  onClick={handleClearAllRecentSearches}
                  className="text-[11px] font-medium text-[#94A3B8] hover:text-[#E5A93C] transition-colors"
                >
                  Clear
                </button>
              </div>

              <div className="space-y-1.5">
                {recentSearches.map(item => (
                  <div
                    key={item}
                    onClick={() => handleSelectRecentSearch(item)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-[#121722] border border-white/[0.06] hover:border-white/[0.14] cursor-pointer transition-all active:scale-[0.99] group"
                    role="button"
                    tabIndex={0}
                    aria-label={`Search again for ${item}`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <History className="w-3.5 h-3.5 text-[#64748B] group-hover:text-[#E5A93C] transition-colors shrink-0" />
                      <span className="text-[12.5px] font-medium text-white truncate">
                        {item}
                      </span>
                    </div>
                    <button
                      onClick={(e) => handleRemoveRecentSearch(item, e)}
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[#64748B] hover:text-white hover:bg-white/[0.06] transition-colors"
                      aria-label={`Remove ${item} from recent searches`}
                      title="Remove"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 2. BROWSE BY CATEGORY (Section 9, 10) */}
          <section aria-labelledby="heading-browse-category">
            <div className="flex items-center justify-between mb-2">
              <h2 id="heading-browse-category" className="text-[12px] font-bold uppercase tracking-wider text-[#94A3B8]">
                Browse by Category
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {browseCategories.map(cat => (
                <button
                  key={cat.label}
                  onClick={() => handleSelectCategory(cat.label)}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-[#121722] border border-white/[0.08] hover:border-[#E5A93C]/40 text-left transition-all active:scale-[0.98] group"
                  aria-label={`Browse ${cat.label}`}
                >
                  <span className="text-base shrink-0">{cat.icon}</span>
                  <div className="min-w-0 flex-1">
                    <span className="text-[12px] font-bold text-white group-hover:text-[#E5A93C] transition-colors truncate block">
                      {cat.label}
                    </span>
                    <span className="text-[10.5px] text-[#64748B] truncate block">
                      Discover services
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Natural Search Prompt Reminder (Section 11) */}
          <div className="p-3.5 rounded-xl bg-[#121722]/50 border border-white/[0.05] text-left">
            <p className="text-[11.5px] font-medium text-[#94A3B8] leading-relaxed">
              💡 <span className="text-white font-semibold">Natural search tip:</span> You can type a person's name, a company, a service ("Chartered Accountant"), or a city like "Solapur" directly.
            </p>
          </div>

        </main>
      ) : prototypeScenario === 'loading' ? (
        /* ======================================================================= */
        /* SKELETON SEARCHING STATE (Section 14) */
        /* ======================================================================= */
        <main className="relative z-10 flex-1 overflow-y-auto min-h-0 px-4 pt-3.5 pb-24 space-y-4 animate-pulse">
          {/* Skeleton People Result */}
          <div className="space-y-2">
            <div className="h-3 w-20 bg-white/[0.08] rounded" />
            <div className="h-32 w-full bg-[#121722] rounded-xl border border-white/[0.06]" />
          </div>
          {/* Skeleton Business Result */}
          <div className="space-y-2">
            <div className="h-3 w-24 bg-white/[0.08] rounded" />
            <div className="h-28 w-full bg-[#121722] rounded-xl border border-white/[0.06]" />
          </div>
        </main>
      ) : (
        /* ======================================================================= */
        /* ACTIVE SEARCH RESULTS VIEW (Section 15-34) */
        /* ======================================================================= */
        <main className="relative z-10 flex-1 overflow-y-auto min-h-0 px-4 pt-3 pb-24 space-y-4">
          
          {/* PARTIAL FAILURE BANNER (Section 51) */}
          {prototypeScenario === 'partial-failure' && (
            <div className="p-3 rounded-xl bg-[#121722] border border-[#EF4444]/25 flex items-center justify-between gap-2 text-[11.5px]">
              <div className="flex items-center gap-2 text-[#EF4444] min-w-0">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span className="text-white truncate">Couldn't refresh People network status.</span>
              </div>
              <button
                onClick={() => {
                  setPrototypeScenario('populated');
                  triggerToast('Network status refreshed');
                }}
                className="px-2.5 py-1 rounded-lg bg-[#182030] text-[#E5A93C] font-semibold text-[10.5px] border border-white/[0.08] shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          {/* NO RESULTS STATE (Section 35, 36, 73) */}
          {filteredResults.totalMatches === 0 ? (
            <div className="py-10 px-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#121722] border border-white/[0.1] flex items-center justify-center text-[#94A3B8] mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-white mb-1">
                {prototypeScenario === 'devanagari' ? 'काहीही सापडले नाही' : 'No matches found'}
              </h2>
              <p className="text-xs text-[#94A3B8] max-w-[260px] mx-auto mb-4 leading-relaxed">
                {prototypeScenario === 'devanagari'
                  ? 'दुसरे नाव, व्यवसाय, सेवा किंवा स्थान शोधून पहा.'
                  : 'Try another name, business, service or location.'
                }
              </p>

              {/* Natural Bridge: Scan a Card (Section 36) */}
              <button
                id="btn-no-results-scan-card"
                onClick={() => {
                  if (onNavigateToScan) onNavigateToScan('card');
                  else triggerToast('Opening Scanner in Card mode...');
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#182030] hover:bg-[#1F293D] border border-white/[0.14] text-white text-xs font-semibold shadow-xs transition-all active:scale-95 group"
              >
                <ScanLine className="w-4 h-4 text-[#E5A93C] group-hover:scale-110 transition-transform" />
                <span>Scan a Business Card</span>
              </button>
              <p className="text-[10px] text-[#64748B] mt-2">
                Can't find them digitally? Save their physical card instead.
              </p>
            </div>
          ) : (
            <>
              {/* ================================================================= */}
              {/* SECTION: PEOPLE RESULTS (Shown on 'all' or 'people' tab) */}
              {/* ONE PERSON CAN HAVE MULTIPLE BUSINESS IDENTITIES (Section 16-24) */}
              {/* ================================================================= */}
              {(activeTab === 'all' || activeTab === 'people') && filteredResults.people.length > 0 && (
                <section aria-labelledby="heading-people-results">
                  {activeTab === 'all' && (
                    <div className="flex items-center justify-between mb-2">
                      <h2 id="heading-people-results" className="text-[11.5px] font-bold uppercase tracking-wider text-[#94A3B8]">
                        People ({filteredResults.people.length})
                      </h2>
                    </div>
                  )}

                  <div className="space-y-3">
                    {filteredResults.people.map(person => (
                      <div
                        key={person.id}
                        className="p-3.5 rounded-xl bg-[#121722] border border-white/[0.08] shadow-xs"
                      >
                        {/* Person Header Area: Represents ONE PERSON */}
                        <div 
                          onClick={() => {
                            if (onOpenPersonProfile) onOpenPersonProfile(person.id);
                            else triggerToast(`Viewing ${person.name} profile (stub)`);
                          }}
                          className="flex items-start gap-3 cursor-pointer group mb-2.5"
                        >
                          {/* Person Initials Avatar (No generated fake faces - Section 55) */}
                          <div 
                            className="w-10 h-10 rounded-xl bg-[#182030] border border-white/[0.12] font-bold text-xs flex items-center justify-center shrink-0 shadow-xs"
                            style={{ color: person.avatarColor || '#E5A93C' }}
                          >
                            {person.initials}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <h3 className="text-[13.5px] font-bold text-white tracking-tight group-hover:text-[#E5A93C] transition-colors truncate">
                                {person.name}
                              </h3>
                              <ChevronRight className="w-3.5 h-3.5 text-[#64748B] group-hover:text-white transition-colors shrink-0" />
                            </div>
                            <p className="text-[10.5px] font-semibold text-[#94A3B8]">
                              {person.businessIdentities.length} business {person.businessIdentities.length === 1 ? 'identity' : 'identities'}
                            </p>
                          </div>
                        </div>

                        {/* Associated Business Identities: Each exposes its OWN independent "+ Add" action! (Section 19, 20, 21) */}
                        <div className="space-y-2 pt-1 border-t border-white/[0.06]">
                          {person.businessIdentities.map(biz => (
                            <div
                              key={biz.id}
                              className="p-2.5 rounded-lg bg-[#182030]/60 border border-white/[0.04] flex items-center justify-between gap-2.5"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="text-[12px] font-bold text-white truncate leading-snug">
                                  {biz.businessName}
                                </div>
                                <div className="text-[10.5px] text-[#94A3B8] truncate leading-tight mt-0.5">
                                  <span className="text-white/80 font-medium">{biz.role}</span> • {biz.category} • {biz.city}
                                </div>
                              </div>

                              {/* INDEPENDENT ADD TO MY NETWORK ACTION (Section 19, 20, 21, 23, 70) */}
                              <div className="shrink-0">
                                {biz.isInNetwork ? (
                                  <span 
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 text-[#10B981] text-[10.5px] font-semibold"
                                    title="Already in your network"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>In Network</span>
                                  </span>
                                ) : biz.additionStatus === 'adding' ? (
                                  <button
                                    disabled
                                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.06] text-[#94A3B8] text-[10.5px] font-medium border border-white/[0.08]"
                                  >
                                    <RefreshCw className="w-3 h-3 animate-spin text-[#E5A93C]" />
                                    <span>Adding...</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleAddIdentityToNetwork(person.id, biz.id)}
                                    className="px-2.5 py-1 rounded-lg bg-[#E5A93C]/15 hover:bg-[#E5A93C] text-[#E5A93C] hover:text-[#0A0D14] border border-[#E5A93C]/30 text-[10.5px] font-semibold transition-all active:scale-95"
                                    aria-label={`Add ${person.name} at ${biz.businessName} to My Network`}
                                  >
                                    + Add
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* ================================================================= */}
              {/* SECTION: BUSINESS RESULTS (Shown on 'all' or 'businesses' tab) */}
              {/* BUSINESS REVIEWS & RATINGS (Section 25-28) */}
              {/* ================================================================= */}
              {(activeTab === 'all' || activeTab === 'businesses') && filteredResults.businesses.length > 0 && (
                <section aria-labelledby="heading-business-results" className="pt-1">
                  {activeTab === 'all' && (
                    <div className="flex items-center justify-between mb-2">
                      <h2 id="heading-business-results" className="text-[11.5px] font-bold uppercase tracking-wider text-[#94A3B8]">
                        Businesses ({filteredResults.businesses.length})
                      </h2>
                    </div>
                  )}

                  <div className="space-y-2.5">
                    {filteredResults.businesses.map(biz => (
                      <div
                        key={biz.id}
                        onClick={() => {
                          if (onOpenBusinessProfile) onOpenBusinessProfile(biz.id);
                          else triggerToast(`Viewing ${biz.businessName} Profile (stub)`);
                        }}
                        className="p-3.5 rounded-xl bg-[#121722] border border-white/[0.08] hover:border-white/[0.15] cursor-pointer transition-all active:scale-[0.99] shadow-xs group"
                        role="button"
                        tabIndex={0}
                        aria-label={`View business profile for ${biz.businessName}`}
                      >
                        <div className="flex items-start gap-3">
                          {/* Business Logo / Monogram (Section 54) */}
                          <div className="w-10 h-10 rounded-xl bg-[#182030] border border-white/[0.12] text-[#E5A93C] font-bold text-xs flex items-center justify-center shrink-0 shadow-xs group-hover:border-[#E5A93C]/40">
                            {biz.monogram}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-1">
                              <h3 className="text-[13.5px] font-bold text-white tracking-tight group-hover:text-[#E5A93C] transition-colors truncate">
                                {biz.businessName}
                              </h3>
                              {/* Rating & Reviews (Belongs to businesses only! Section 28) */}
                              <div className="flex items-center gap-1 shrink-0 bg-white/[0.04] px-1.5 py-0.5 rounded text-[10.5px]">
                                <Star className="w-3 h-3 text-[#E5A93C] fill-[#E5A93C]" />
                                <span className="font-bold text-white">{biz.rating}</span>
                                <span className="text-[#64748B]">({biz.reviewCount})</span>
                              </div>
                            </div>

                            <p className="text-[11px] font-medium text-[#94A3B8] truncate leading-tight mt-0.5">
                              {biz.category} • {biz.city}, {biz.state}
                            </p>

                            <p className="text-[10.5px] text-[#64748B] line-clamp-2 mt-1.5 leading-snug">
                              {biz.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* End of results footer */}
              <div className="pt-2 text-center text-[10.5px] text-[#475569]">
                Showing relevant verified network results
              </div>

            </>
          )}

        </main>
      )}

      {/* ========================================================================= */}
      {/* 5. PERSISTENT BOTTOM NAVIGATION BAR (Section 64) */}
      {/* 5 Destinations: Home | Search (Selected) | Scan | My Network | Profile */}
      {/* ========================================================================= */}
      <nav
        id="bottom-navigation-bar"
        className="fixed bottom-0 left-0 right-0 z-30 bg-[#0E131E]/95 backdrop-blur-md border-t border-white/[0.08] px-2 py-1.5"
        aria-label="Main application navigation"
      >
        <div className="max-w-[480px] mx-auto flex items-center justify-around">
          
          {/* Destination 1: Home */}
          <button
            onClick={() => {
              if (onNavigateToHome) onNavigateToHome();
              else triggerToast('Navigating to Home...');
            }}
            className="flex flex-col items-center justify-center w-14 py-1 rounded-lg text-[#64748B] hover:text-[#94A3B8] transition-all"
            aria-label="Home"
          >
            <HomeIcon className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px] font-medium mt-1">Home</span>
          </button>

          {/* Destination 2: Search (Selected) */}
          <button
            onClick={() => {
              // Already on Search, scroll to top or focus
              if (searchInputRef.current) searchInputRef.current.focus();
            }}
            className="flex flex-col items-center justify-center w-14 py-1 rounded-lg text-[#E5A93C] transition-all"
            aria-current="page"
            aria-label="Search - Current tab"
          >
            <Search className="w-5 h-5 stroke-[2.5]" />
            <span className="text-[10px] font-bold mt-1">Search</span>
          </button>

          {/* Destination 3: Scan (Key action) */}
          <button
            onClick={() => {
              if (onNavigateToScan) onNavigateToScan('card');
              else triggerToast('Opening Scanner in Card mode...');
            }}
            className="flex flex-col items-center justify-center w-14 -mt-2.5 transition-all group"
            aria-label="Scan business card"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#E5A93C] to-[#D49629] text-[#0A0D14] flex items-center justify-center shadow-lg shadow-[#E5A93C]/20 group-active:scale-95 transition-transform">
              <ScanLine className="w-5 h-5 stroke-[2.4]" />
            </div>
            <span className="text-[10px] font-semibold text-[#E5A93C] mt-0.5">Scan</span>
          </button>

          {/* Destination 4: My Network */}
          <button
            onClick={() => {
              if (onNavigateToMyNetwork) onNavigateToMyNetwork();
              else triggerToast('My Network screen will open in future step');
            }}
            className="flex flex-col items-center justify-center w-14 py-1 rounded-lg text-[#64748B] hover:text-[#94A3B8] transition-all"
            aria-label="My Network"
          >
            <Users className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px] font-medium mt-1 truncate">Network</span>
          </button>

          {/* Destination 5: Profile */}
          <button
            onClick={() => {
              if (onNavigateToProfile) onNavigateToProfile();
              else triggerToast('Profile screen will open in future step');
            }}
            className="flex flex-col items-center justify-center w-14 py-1 rounded-lg text-[#64748B] hover:text-[#94A3B8] transition-all"
            aria-label="Profile"
          >
            <User className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px] font-medium mt-1">Profile</span>
          </button>

        </div>
      </nav>

      {/* ========================================================================= */}
      {/* FILTER BOTTOM SHEET (Section 43, 44, 45, 46, 47) */}
      {/* ========================================================================= */}
      {showFilterSheet && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200"
          onClick={() => setShowFilterSheet(false)}
        >
          <div
            className="w-full max-w-[480px] mx-auto bg-[#121722] border-t border-white/[0.14] rounded-t-2xl p-4 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-250"
            onClick={e => e.stopPropagation()}
          >
            {/* Handle */}
            <div className="w-10 h-1 rounded-full bg-white/[0.2] mx-auto mb-1" />

            {/* Header */}
            <div className="flex items-center justify-between pb-1 border-b border-white/[0.08]">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Search Filters
                </h3>
                <p className="text-[11px] text-[#94A3B8]">
                  Narrow down people and businesses
                </p>
              </div>
              <button
                onClick={() => {
                  setSelectedCategoryFilter('all');
                  setSelectedLocationFilter('all');
                  triggerToast('Filters reset');
                }}
                className="text-[11px] text-[#E5A93C] font-semibold hover:underline"
              >
                Reset
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['all', 'Manufacturing', 'Technology', 'Consulting', 'Retail'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      selectedCategoryFilter === cat
                        ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold'
                        : 'bg-[#182030] text-[#94A3B8] hover:text-white border border-white/[0.06]'
                    }`}
                  >
                    {cat === 'all' ? 'All Categories' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Filter (City / State V1 - Section 45) */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                Location (City)
              </label>
              <div className="flex flex-wrap gap-1.5">
                {['all', 'Solapur', 'Pune', 'Mumbai'].map(loc => (
                  <button
                    key={loc}
                    onClick={() => setSelectedLocationFilter(loc)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                      selectedLocationFilter === loc
                        ? 'bg-[#E5A93C] text-[#0A0D14] font-semibold'
                        : 'bg-[#182030] text-[#94A3B8] hover:text-white border border-white/[0.06]'
                    }`}
                  >
                    {loc === 'all' ? 'All Locations' : loc}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => setShowFilterSheet(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#E5A93C] hover:bg-[#D49629] text-[#0A0D14] font-bold text-xs transition-all active:scale-[0.98] shadow-xs"
              >
                Apply Filters {activeFiltersCount > 0 ? `(${activeFiltersCount})` : ''}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
