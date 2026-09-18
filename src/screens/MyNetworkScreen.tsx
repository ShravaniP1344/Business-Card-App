import React, { useState, useMemo, useRef } from 'react';
import {
  Search,
  SlidersHorizontal,
  X,
  Star,
  Calendar,
  Clock,
  QrCode,
  ScanLine,
  UserCheck,
  AlertCircle,
  Sparkles,
  Home as HomeIcon,
  Users,
  User,
  CheckCircle2,
  ChevronDown,
  RefreshCw,
  Sliders,
  Filter,
  ArrowUpDown,
  Tag as TagIcon,
  WifiOff,
  PlusCircle,
  Phone,
  Mail,
  Building2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { DESIGN_TOKENS } from '../design-system/tokens';

export interface NetworkContactItem {
  id: string;
  personName: string;
  initials: string;
  avatarColor?: string;
  profilePhoto?: string | null;
  designation: string;
  businessName: string;
  category: string;
  city: string;
  state: string;
  source: 'Search' | 'Card Scan' | 'QR';
  isRegistered: boolean;
  isFavorite: boolean;
  tags: string[];
  privateNote?: string;
  followUpLabel?: string;
  followUpStatus?: 'today' | 'upcoming' | 'overdue' | 'none';
  dateAdded: string; // ISO or relative timestamp
  businessId?: string;
  personId?: string;
  phone?: string;
  email?: string;
}

interface MyNetworkScreenProps {
  onNavigateToHome?: () => void;
  onNavigateToSearch?: () => void;
  onNavigateToScan?: (mode?: 'card' | 'qr') => void;
  onNavigateToProfile?: () => void;
  onOpenContactDetail?: (contactId: string) => void;
  networkState?: Record<string, boolean>;
  onNetworkStateChange?: (personId: string, identityId: string, isInNetwork: boolean) => void;
  isLargeTextMode?: boolean;
}

export const MyNetworkScreen: React.FC<MyNetworkScreenProps> = ({
  onNavigateToHome,
  onNavigateToSearch,
  onNavigateToScan,
  onNavigateToProfile,
  onOpenContactDetail,
  networkState,
  onNetworkStateChange,
  isLargeTextMode = false,
}) => {
  // Prototype scenarios
  type ScenarioType =
    | 'default'
    | 'multi-identity'
    | 'empty'
    | 'no-search-results'
    | 'offline'
    | 'loading'
    | 'error'
    | 'long-names'
    | 'devanagari';

  const [scenario, setScenario] = useState<ScenarioType>('default');
  const [showInspector, setShowInspector] = useState<boolean>(false);
  const [showFilterSheet, setShowFilterSheet] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'info' | 'success' | 'error'>('info');

  // Filter state
  const [selectedSource, setSelectedSource] = useState<'all' | 'Search' | 'Card Scan' | 'QR'>('all');
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState<'all' | 'today' | 'upcoming' | 'overdue'>('all');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<'recent' | 'name-asc' | 'name-desc' | 'follow-up'>('recent');

  const searchInputRef = useRef<HTMLInputElement>(null);

  const triggerToast = (msg: string, type: 'info' | 'success' | 'error' = 'info') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // BASE DATASET (Section 15, 16, 17, 18, 82)
  // Representative verified contacts:
  // 1. Rahul Patil @ ABC Manufacturing (Search, Registered, In Network, Favorite, Supplier, Follow-up Today)
  // 2. Arjun Deshmukh @ Vertex Industrial Solutions (Card Scan, Scanned, Potential Client)
  // 3. Priya Shah @ PixelCraft Studio (QR, Registered, Follow-up Sep 21)
  // 4. Additional contacts to evaluate 24-contact network density
  const baseContactsList: NetworkContactItem[] = [
    {
      id: 'net-rahul-abc',
      personName: 'Rahul Patil',
      initials: 'RP',
      avatarColor: '#E5A93C',
      designation: 'Owner',
      businessName: 'ABC Manufacturing',
      category: 'Manufacturing',
      city: 'Solapur',
      state: 'Maharashtra',
      source: 'Search',
      isRegistered: true,
      isFavorite: true,
      tags: ['Supplier'],
      privateNote: 'Met at Solapur industrial conference. Discussed precision metal fabrication.',
      followUpLabel: 'Follow up today',
      followUpStatus: 'today',
      dateAdded: '2026-09-15T10:00:00Z',
      businessId: 'biz-id-abc',
      personId: 'person-rahul-patil',
      phone: '+91 98220 12345',
      email: 'rahul@abcmanufacturing.in'
    },
    {
      id: 'net-arjun-vertex',
      personName: 'Arjun Deshmukh',
      initials: 'AD',
      avatarColor: '#38BDF8',
      designation: 'Sales Manager',
      businessName: 'Vertex Industrial Solutions',
      category: 'Industrial Solutions',
      city: 'Pune',
      state: 'Maharashtra',
      source: 'Card Scan',
      isRegistered: false, // Private scanned contact (Section 17, 24)
      isFavorite: false,
      tags: ['Potential Client'],
      privateNote: 'Scanned business card at Pune Auto Expo. Need industrial conveyor quote.',
      followUpStatus: 'none',
      dateAdded: '2026-09-14T14:30:00Z',
      phone: '+91 98230 45678',
      email: 'arjun@vertexsolutions.in'
    },
    {
      id: 'net-priya-pixelcraft',
      personName: 'Priya Shah',
      initials: 'PS',
      avatarColor: '#10B981',
      designation: 'Founder',
      businessName: 'PixelCraft Studio',
      category: 'Design Services',
      city: 'Pune',
      state: 'Maharashtra',
      source: 'QR',
      isRegistered: true, // QR exchange contact (Section 18, 48)
      isFavorite: false,
      tags: ['Partner'],
      privateNote: 'Exchanged QR at co-working hub. Potential brand identity partner.',
      followUpLabel: 'Sep 21',
      followUpStatus: 'upcoming',
      dateAdded: '2026-09-12T09:15:00Z',
      phone: '+91 98221 67890',
      email: 'priya@pixelcraft.studio'
    },
    {
      id: 'net-vikram-apex',
      personName: 'Vikram Joshi',
      initials: 'VJ',
      avatarColor: '#F59E0B',
      designation: 'Managing Director',
      businessName: 'Apex Logistics & Freight',
      category: 'Logistics & Supply Chain',
      city: 'Mumbai',
      state: 'Maharashtra',
      source: 'Card Scan',
      isRegistered: false,
      isFavorite: false,
      tags: ['Supplier', 'Logistics'],
      privateNote: 'Card scanned at warehousing summit. Multi-hub distribution partner.',
      followUpLabel: 'Follow-up overdue',
      followUpStatus: 'overdue',
      dateAdded: '2026-09-08T11:20:00Z',
      phone: '+91 98200 11223',
      email: 'v.joshi@apexlogistics.in'
    },
    {
      id: 'net-anita-blueprint',
      personName: 'Anita Sen',
      initials: 'AS',
      avatarColor: '#EC4899',
      designation: 'Principal Architect',
      businessName: 'Studio Blueprint Architects',
      category: 'Architecture',
      city: 'Solapur',
      state: 'Maharashtra',
      source: 'QR',
      isRegistered: true,
      isFavorite: true,
      tags: ['Vendor'],
      privateNote: 'Commercial interior planning and factory spatial layout consultant.',
      followUpStatus: 'none',
      dateAdded: '2026-09-05T16:45:00Z',
      phone: '+91 98211 44556',
      email: 'anita@studioblueprint.in'
    },
    {
      id: 'net-deepak-textiles',
      personName: 'Deepak More',
      initials: 'DM',
      avatarColor: '#8B5CF6',
      designation: 'Head of Procurement',
      businessName: 'Solapur Traditional Textiles',
      category: 'Textiles & Handlooms',
      city: 'Solapur',
      state: 'Maharashtra',
      source: 'Search',
      isRegistered: true,
      isFavorite: false,
      tags: ['Potential Client'],
      privateNote: 'Interested in digital inventory cataloging for export chadder orders.',
      followUpLabel: 'Sep 25',
      followUpStatus: 'upcoming',
      dateAdded: '2026-09-02T13:10:00Z',
      phone: '+91 98222 77889',
      email: 'deepak@solapurtextiles.org'
    },
    {
      id: 'net-rohan-bharat',
      personName: 'Rohan Kadam',
      initials: 'RK',
      avatarColor: '#06B6D4',
      designation: 'Senior Director',
      businessName: 'Bharat Tech Labs',
      category: 'Software & Cloud',
      city: 'Bengaluru',
      state: 'Karnataka',
      source: 'QR',
      isRegistered: true,
      isFavorite: false,
      tags: ['Partner'],
      privateNote: 'Discussed cloud migration framework and edge IoT sensors.',
      followUpStatus: 'none',
      dateAdded: '2026-08-28T10:00:00Z',
      phone: '+91 98450 33445',
      email: 'rohan.kadam@bharattech.io'
    },
    {
      id: 'net-sunita-kreston',
      personName: 'Sunita Deshpande',
      initials: 'SD',
      avatarColor: '#14B8A6',
      designation: 'Chartered Accountant',
      businessName: 'Deshpande & Associates',
      category: 'Financial Services & Tax',
      city: 'Pune',
      state: 'Maharashtra',
      source: 'Card Scan',
      isRegistered: false,
      isFavorite: true,
      tags: ['Advisor'],
      privateNote: 'GST compliance, industrial subsidies, and tax planning advisor.',
      followUpStatus: 'none',
      dateAdded: '2026-08-20T15:30:00Z',
      phone: '+91 97630 11990',
      email: 'sunita@deshpandeca.com'
    }
  ];

  // Identity 2 for Rahul Patil: Nexa Consulting (Section 25, 26)
  // When both are saved, Rahul appears TWICE as two independent business identities!
  const rahulNexaIdentity: NetworkContactItem = {
    id: 'net-rahul-nexa',
    personName: 'Rahul Patil',
    initials: 'RP',
    avatarColor: '#E5A93C',
    designation: 'Partner',
    businessName: 'Nexa Consulting',
    category: 'Business Consulting',
    city: 'Pune',
    state: 'Maharashtra',
    source: 'Search',
    isRegistered: true,
    isFavorite: false,
    tags: ['Advisor'],
    privateNote: 'Rahul’s strategic advisory practice in Pune. Meets bi-weekly.',
    followUpLabel: 'Sep 28',
    followUpStatus: 'upcoming',
    dateAdded: '2026-09-16T18:00:00Z',
    businessId: 'biz-id-nexa',
    personId: 'person-rahul-patil',
    phone: '+91 97630 54321',
    email: 'rahul@nexaconsulting.in'
  };

  // Long names dataset
  const longNameContacts: NetworkContactItem[] = [
    {
      id: 'net-long-1',
      personName: 'Shrinivas Venkateshwara Rao Kulkarni',
      initials: 'SK',
      avatarColor: '#E5A93C',
      designation: 'Senior Business Development & Strategic Partnerships Manager',
      businessName: 'Shree Siddhivinayak Industrial Engineering Solutions Private Limited',
      category: 'Industrial Equipment Manufacturing & Turnkey Solutions',
      city: 'Solapur',
      state: 'Maharashtra',
      source: 'Search',
      isRegistered: true,
      isFavorite: true,
      tags: ['Supplier', 'Strategic Partner'],
      privateNote: 'Lead engineering consultant for Maharashtra industrial corridor development.',
      followUpLabel: 'Follow up today',
      followUpStatus: 'today',
      dateAdded: '2026-09-17T08:00:00Z'
    }
  ];

  // Devanagari / Marathi dataset
  const marathiContacts: NetworkContactItem[] = [
    {
      id: 'net-mr-1',
      personName: 'राहुल पाटील',
      initials: 'रापा',
      avatarColor: '#E5A93C',
      designation: 'मालक (Owner)',
      businessName: 'एबीसी मॅन्युफॅक्चरिंग',
      category: 'औद्योगिक उत्पादन',
      city: 'सोलापूर',
      state: 'महाराष्ट्र',
      source: 'Search',
      isRegistered: true,
      isFavorite: true,
      tags: ['पुरवठादार (Supplier)'],
      privateNote: 'सोलापूर परिषद येथे भेट झाली. अचूक फॅब्रिकेशन बद्दल चर्चा केली.',
      followUpLabel: 'आज संपर्क साधा (Today)',
      followUpStatus: 'today',
      dateAdded: '2026-09-15T10:00:00Z'
    },
    {
      id: 'net-mr-2',
      personName: 'अर्जुन देशमुख',
      initials: 'अदे',
      avatarColor: '#38BDF8',
      designation: 'विक्री व्यवस्थापक (Sales Manager)',
      businessName: 'व्हर्टेक्स इंडस्ट्रियल सोल्युशन्स',
      category: 'औद्योगिक उपाय',
      city: 'पुणे',
      state: 'महाराष्ट्र',
      source: 'Card Scan',
      isRegistered: false,
      isFavorite: false,
      tags: ['संभाव्य ग्राहक'],
      privateNote: 'पुणे ऑटो एक्स्पो मध्ये कार्ड स्कॅन केले.',
      followUpStatus: 'none',
      dateAdded: '2026-09-14T14:30:00Z'
    }
  ];

  // Live Contacts in local state
  const [contacts, setContacts] = useState<NetworkContactItem[]>(() => {
    // If Nexa is saved in networkSavedMap, include it
    if (networkState?.['biz-id-nexa']) {
      return [rahulNexaIdentity, ...baseContactsList];
    }
    return baseContactsList;
  });

  // Switch scenarios
  const applyScenario = (target: ScenarioType) => {
    setScenario(target);
    if (target === 'default') {
      setContacts(baseContactsList);
      setSearchQuery('');
    } else if (target === 'multi-identity') {
      // Include BOTH Rahul identities to evaluate Section 25 & 26
      setContacts([baseContactsList[0], rahulNexaIdentity, ...baseContactsList.slice(1)]);
      setSearchQuery('');
    } else if (target === 'empty') {
      setContacts([]);
      setSearchQuery('');
    } else if (target === 'no-search-results') {
      setContacts(baseContactsList);
      setSearchQuery('NonExistentContactXYZ');
    } else if (target === 'long-names') {
      setContacts(longNameContacts);
      setSearchQuery('');
    } else if (target === 'devanagari') {
      setContacts(marathiContacts);
      setSearchQuery('');
    }
    triggerToast(`Switched scenario to: ${target}`, 'info');
  };

  // Toggle favorite (Optimistic per Section 28 & 29)
  const handleToggleFavorite = (e: React.MouseEvent, contactId: string) => {
    e.stopPropagation();
    setContacts(prev =>
      prev.map(c => {
        if (c.id === contactId) {
          const newFav = !c.isFavorite;
          triggerToast(newFav ? 'Added to favorites (private)' : 'Removed from favorites', 'info');
          return { ...c, isFavorite: newFav };
        }
        return c;
      })
    );
  };

  // Filtering & Sorting (Section 5, 6, 9-14, 38-43)
  const filteredAndSortedContacts = useMemo(() => {
    let result = [...contacts];

    // 1. Search Query filter (searches Name, Business, Category, Location, Tags, and Private Notes)
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter(contact => {
        const matchesName = contact.personName.toLowerCase().includes(q);
        const matchesBusiness = contact.businessName.toLowerCase().includes(q);
        const matchesDesignation = contact.designation.toLowerCase().includes(q);
        const matchesCategory = contact.category.toLowerCase().includes(q);
        const matchesCity = contact.city.toLowerCase().includes(q);
        const matchesTag = contact.tags.some(t => t.toLowerCase().includes(q));
        const matchesNote = contact.privateNote ? contact.privateNote.toLowerCase().includes(q) : false;
        return (
          matchesName ||
          matchesBusiness ||
          matchesDesignation ||
          matchesCategory ||
          matchesCity ||
          matchesTag ||
          matchesNote
        );
      });
    }

    // 2. Source filter
    if (selectedSource !== 'all') {
      result = result.filter(c => c.source === selectedSource);
    }

    // 3. Favorites Only filter
    if (favoritesOnly) {
      result = result.filter(c => c.isFavorite);
    }

    // 4. Follow-up status filter
    if (selectedFollowUp !== 'all') {
      result = result.filter(c => c.followUpStatus === selectedFollowUp);
    }

    // 5. Tag filter
    if (selectedTag) {
      result = result.filter(c => c.tags.includes(selectedTag));
    }

    // 6. Sorting
    if (sortOption === 'name-asc') {
      result.sort((a, b) => a.personName.localeCompare(b.personName));
    } else if (sortOption === 'name-desc') {
      result.sort((a, b) => b.personName.localeCompare(a.personName));
    } else if (sortOption === 'follow-up') {
      // Follow-up due first
      const priority = { today: 0, overdue: 1, upcoming: 2, none: 3 };
      result.sort((a, b) => (priority[a.followUpStatus || 'none'] ?? 3) - (priority[b.followUpStatus || 'none'] ?? 3));
    } else {
      // Default: Recently Added
      result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    }

    return result;
  }, [contacts, searchQuery, selectedSource, favoritesOnly, selectedFollowUp, selectedTag, sortOption]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (selectedSource !== 'all') count++;
    if (favoritesOnly) count++;
    if (selectedFollowUp !== 'all') count++;
    if (selectedTag) count++;
    return count;
  }, [selectedSource, favoritesOnly, selectedFollowUp, selectedTag]);

  const clearAllFilters = () => {
    setSelectedSource('all');
    setFavoritesOnly(false);
    setSelectedFollowUp('all');
    setSelectedTag(null);
    triggerToast('Filters cleared', 'info');
  };

  // Helper to check if search matched private note
  const checkMatchedInNote = (contact: NetworkContactItem, queryStr: string) => {
    if (!queryStr.trim() || !contact.privateNote) return false;
    const q = queryStr.toLowerCase();
    const inNote = contact.privateNote.toLowerCase().includes(q);
    const inNameOrBiz =
      contact.personName.toLowerCase().includes(q) ||
      contact.businessName.toLowerCase().includes(q) ||
      contact.category.toLowerCase().includes(q);
    return inNote && !inNameOrBiz;
  };

  return (
    <div
      id="screen-19-my-network"
      className="relative flex flex-col h-full w-full bg-[#0A0D14] text-[#F8FAFC] select-none overflow-hidden"
    >
      {/* Toast Feedback */}
      {toastMessage && (
        <div
          className={`absolute top-14 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 rounded-full backdrop-blur-md border text-[11px] font-medium shadow-xl flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200 ${
            toastType === 'error'
              ? 'bg-[#EF4444]/95 border-[#EF4444]/30 text-white'
              : toastType === 'success'
              ? 'bg-[#10B981]/95 border-[#10B981]/30 text-white'
              : 'bg-[#182030]/95 border-white/[0.15] text-[#F8FAFC]'
          }`}
          role="status"
          aria-live="polite"
        >
          {toastType === 'error' ? (
            <AlertCircle className="w-3.5 h-3.5 text-white shrink-0" />
          ) : toastType === 'success' ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-white shrink-0" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-[#E5A93C] shrink-0" />
          )}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* COMPACT APP HEADER (Section 4, 46) */}
      {/* "My Network" | subtle "24 contacts" | Top-right Filter/Sort trigger + Prototype Inspector */}
      {/* ========================================================================= */}
      <header className="relative z-20 bg-[#0A0D14]/95 backdrop-blur-md border-b border-white/[0.06] px-4 pt-3 pb-2.5 flex items-center justify-between shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white tracking-tight">
              {scenario === 'devanagari' ? 'माझे नेटवर्क (My Network)' : 'My Network'}
            </h1>
            {/* Subtle contact count (not overly prominent, Section 4, 46) */}
            <span className="text-[11px] font-medium text-[#64748B] bg-white/[0.04] px-2 py-0.5 rounded-full">
              {contacts.length} {scenario === 'devanagari' ? 'संपर्क' : 'contacts'}
            </span>
          </div>
          <p className="text-[10px] text-[#94A3B8] mt-0.5">
            {scenario === 'devanagari' ? 'तुमचा खाजगी संपर्क संग्रह' : 'Your private business contacts'}
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Filter / Sort Sheet Trigger */}
          <button
            onClick={() => setShowFilterSheet(true)}
            className={`h-8 px-2.5 rounded-full border flex items-center gap-1.5 text-xs font-semibold transition-all active:scale-95 ${
              activeFiltersCount > 0
                ? 'bg-[#E5A93C] text-[#0A0D14] border-[#E5A93C]'
                : 'bg-[#121722] border-white/[0.08] text-[#94A3B8] hover:text-white'
            }`}
            aria-label="Open filter and sort sheet"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
            {activeFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#0A0D14] text-[#E5A93C] text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Prototype Scenario Switcher */}
          <button
            onClick={() => setShowInspector(!showInspector)}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all ${
              showInspector
                ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-[#E5A93C]'
                : 'bg-[#121722] border-white/[0.08] text-[#94A3B8] hover:text-white'
            }`}
            title="Screen 19 Prototype Scenarios & Verification"
            aria-label="Toggle Screen 19 inspector"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* PROTOTYPE SCENARIO INSPECTOR DRAWER */}
      {/* Allows instant live testing of all 93 requirements */}
      {/* ========================================================================= */}
      {showInspector && (
        <div className="relative z-30 bg-[#141B29] border-b border-white/[0.12] p-3 shadow-2xl animate-in slide-in-from-top duration-200 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-white">
                Screen 19 Test Scenarios
              </span>
            </div>
            <button
              onClick={() => setShowInspector(false)}
              className="text-[#94A3B8] hover:text-white text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5 text-[10.5px]">
            <button
              onClick={() => applyScenario('default')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'default'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Default: 24 Contacts
            </button>

            <button
              onClick={() => applyScenario('multi-identity')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'multi-identity'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Multi-Identity (Rahul ABC + Nexa)
            </button>

            <button
              onClick={() => applyScenario('empty')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'empty'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              0 Contacts (Empty State)
            </button>

            <button
              onClick={() => applyScenario('no-search-results')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'no-search-results'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              No Search Matches
            </button>

            <button
              onClick={() => applyScenario('offline')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'offline'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Offline State
            </button>

            <button
              onClick={() => applyScenario('loading')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'loading'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Skeleton Loading
            </button>

            <button
              onClick={() => applyScenario('error')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'error'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Load Failure State
            </button>

            <button
              onClick={() => applyScenario('long-names')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'long-names'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Long Names & Wrapping
            </button>

            <button
              onClick={() => applyScenario('devanagari')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all text-left truncate ${
                scenario === 'devanagari'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              मराठी (Devanagari)
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* OFFLINE BANNER (Section 65) */}
      {/* ========================================================================= */}
      {scenario === 'offline' && (
        <div className="bg-[#141B29] border-b border-[#F59E0B]/30 px-3 py-1.5 flex items-center justify-between text-[11px] text-[#F59E0B] shrink-0 animate-in fade-in">
          <div className="flex items-center gap-1.5">
            <WifiOff className="w-3.5 h-3.5" />
            <span className="font-medium">You're offline — showing cached network contacts</span>
          </div>
          <span className="text-[10px] text-[#94A3B8]">Cached</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* STICKY SEARCH & QUICK FILTERS BAR (Section 5, 6, 7, 85) */}
      {/* Private search field: "Search your network" */}
      {/* ========================================================================= */}
      <div className="relative z-10 bg-[#0A0D14] px-4 pt-2.5 pb-2 space-y-2 shrink-0 border-b border-white/[0.04]">
        {/* Prominent Private Search Input */}
        <div className="relative flex items-center h-10 px-3 rounded-xl bg-[#121722] border border-white/[0.1] focus-within:border-[#E5A93C] transition-all shadow-xs">
          <Search className="w-4 h-4 text-[#94A3B8] shrink-0 mr-2" />
          <input
            ref={searchInputRef}
            id="network-search-input"
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={
              scenario === 'devanagari'
                ? 'तुमच्या नेटवर्कमध्ये शोधा...'
                : 'Search your network (name, business, tag, note)...'
            }
            className="w-full bg-transparent text-[12.5px] text-white placeholder-[#64748B] outline-hidden truncate"
            autoComplete="off"
            spellCheck="false"
            aria-label="Search your network"
          />
          {searchQuery.length > 0 && (
            <button
              onClick={() => {
                setSearchQuery('');
                if (searchInputRef.current) searchInputRef.current.focus();
              }}
              className="w-5 h-5 rounded-full bg-white/[0.08] hover:bg-white/[0.16] text-[#94A3B8] hover:text-white flex items-center justify-center transition-colors ml-1"
              aria-label="Clear search input"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Quick Filter Chips (Section 8, 9, 44) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {/* Favorites Filter Chip */}
          <button
            onClick={() => setFavoritesOnly(!favoritesOnly)}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1 shrink-0 transition-all active:scale-95 ${
              favoritesOnly
                ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-[#E5A93C] font-semibold'
                : 'bg-[#121722] border-white/[0.08] text-[#94A3B8] hover:text-white'
            }`}
          >
            <Star className={`w-3 h-3 ${favoritesOnly ? 'fill-[#E5A93C]' : ''}`} />
            <span>Favorites</span>
          </button>

          {/* Follow-up Due Chip */}
          <button
            onClick={() => setSelectedFollowUp(selectedFollowUp === 'today' ? 'all' : 'today')}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1 shrink-0 transition-all active:scale-95 ${
              selectedFollowUp === 'today'
                ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-[#E5A93C] font-semibold'
                : 'bg-[#121722] border-white/[0.08] text-[#94A3B8] hover:text-white'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>Follow-up Due</span>
          </button>

          {/* Tag: Supplier Chip */}
          <button
            onClick={() => setSelectedTag(selectedTag === 'Supplier' ? null : 'Supplier')}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1 shrink-0 transition-all active:scale-95 ${
              selectedTag === 'Supplier'
                ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-[#E5A93C] font-semibold'
                : 'bg-[#121722] border-white/[0.08] text-[#94A3B8] hover:text-white'
            }`}
          >
            <TagIcon className="w-3 h-3" />
            <span>Supplier</span>
          </button>

          {/* Tag: Potential Client Chip */}
          <button
            onClick={() => setSelectedTag(selectedTag === 'Potential Client' ? null : 'Potential Client')}
            className={`px-2.5 py-1 rounded-lg border text-[11px] font-medium flex items-center gap-1 shrink-0 transition-all active:scale-95 ${
              selectedTag === 'Potential Client'
                ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-[#E5A93C] font-semibold'
                : 'bg-[#121722] border-white/[0.08] text-[#94A3B8] hover:text-white'
            }`}
          >
            <TagIcon className="w-3 h-3" />
            <span>Potential Client</span>
          </button>

          {/* Clear All Active Filters Button (Section 45) */}
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="px-2 py-1 rounded-lg text-[10.5px] font-semibold text-[#EF4444] hover:underline shrink-0"
            >
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN LIST & CONTENT VIEW */}
      {/* ========================================================================= */}
      {scenario === 'error' ? (
        /* ERROR / LOAD FAILURE STATE (Section 64) */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[#121722] border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444] mb-3 shadow-md">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="text-base font-bold text-white mb-1">
            Couldn't load your network.
          </h2>
          <p className="text-xs text-[#94A3B8] max-w-xs mb-5">
            Check your connection and try again.
          </p>
          <button
            onClick={() => applyScenario('default')}
            className="px-4 py-2 rounded-xl bg-[#182030] hover:bg-[#202B40] text-[#E5A93C] border border-[#E5A93C]/30 text-xs font-semibold transition-all active:scale-95 flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      ) : scenario === 'loading' ? (
        /* SKELETON LOADING STATE (Section 62) */
        <div className="flex-1 p-4 space-y-3 overflow-y-auto">
          {[1, 2, 3, 4, 5].map(i => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-[#121722] border border-white/[0.04] flex items-start gap-3 animate-pulse"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.06] shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="w-36 h-3.5 rounded bg-white/[0.06]" />
                <div className="w-24 h-3 rounded bg-white/[0.04]" />
                <div className="w-48 h-3 rounded bg-white/[0.04]" />
                <div className="flex gap-2 pt-1">
                  <div className="w-14 h-4 rounded bg-white/[0.04]" />
                  <div className="w-20 h-4 rounded bg-white/[0.04]" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : contacts.length === 0 ? (
        /* ======================================================================= */
        /* EMPTY NETWORK STATE (Section 34, 35, 36, 92) */
        /* Real first-time user starts with 0 contacts! */
        /* Primary: Find People & Businesses | Secondary: Scan a Card, My QR */
        /* ======================================================================= */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center overflow-y-auto">
          <div className="w-16 h-16 rounded-2xl bg-[#121722] border border-white/[0.1] flex items-center justify-center text-[#E5A93C] mb-4 shadow-lg">
            <Users className="w-8 h-8" />
          </div>

          <h2 className="text-lg font-bold text-white mb-1.5">
            {scenario === 'devanagari' ? 'तुमचे नेटवर्क येथून सुरू होते.' : 'Your network starts here.'}
          </h2>

          <p className="text-xs text-[#94A3B8] max-w-xs mb-6 leading-relaxed">
            {scenario === 'devanagari'
              ? 'व्यक्ती शोधा, व्यवसाय कार्ड स्कॅन करा किंवा तुमचा QR शेअर करा.'
              : 'Find someone, scan a business card or exchange your QR.'}
          </p>

          <div className="w-full max-w-xs space-y-2.5">
            {/* Primary Action: Find People & Businesses (Section 35) */}
            <button
              onClick={() => {
                if (onNavigateToSearch) onNavigateToSearch();
                else triggerToast('Navigating to Search tab...', 'info');
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#E5A93C] hover:bg-[#D49629] text-[#0A0D14] text-xs font-bold shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Search className="w-4 h-4 stroke-[2.5]" />
              <span>Find People & Businesses</span>
            </button>

            {/* Secondary Compact Actions: Scan a Card & My QR (Section 35) */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  if (onNavigateToScan) onNavigateToScan('card');
                  else triggerToast('Opening Scanner (Card mode)...', 'info');
                }}
                className="py-2.5 px-3 rounded-xl bg-[#121722] hover:bg-[#182030] border border-white/[0.08] text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <ScanLine className="w-3.5 h-3.5 text-[#E5A93C]" />
                <span>Scan a Card</span>
              </button>

              <button
                onClick={() => {
                  triggerToast('My QR modal opens here (V2)', 'info');
                }}
                className="py-2.5 px-3 rounded-xl bg-[#121722] hover:bg-[#182030] border border-white/[0.08] text-white text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <QrCode className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span>My QR</span>
              </button>
            </div>
          </div>
        </div>
      ) : filteredAndSortedContacts.length === 0 ? (
        /* ======================================================================= */
        /* NO SEARCH RESULTS INSIDE PRIVATE NETWORK (Section 37) */
        /* ======================================================================= */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#121722] border border-white/[0.08] flex items-center justify-center text-[#94A3B8] mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h2 className="text-sm font-bold text-white mb-1">
            {scenario === 'devanagari' ? 'कोणतेही संपर्क आढळले नाहीत' : 'No contacts found'}
          </h2>
          <p className="text-xs text-[#94A3B8] max-w-xs mb-4 leading-relaxed">
            {scenario === 'devanagari'
              ? 'दुसरे नाव, व्यवसाय, टॅग किंवा टीप शोधा.'
              : 'Try another name, business, tag or note.'}
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="px-3.5 py-1.5 rounded-lg bg-[#182030] hover:bg-[#202B40] text-[#E5A93C] border border-white/[0.1] text-xs font-semibold transition-all active:scale-95"
          >
            Clear Search
          </button>
        </div>
      ) : (
        /* ======================================================================= */
        /* POPULATED NETWORK LIST (Section 15, 19, 21, 59, 83, 84) */
        /* Clean list surfaces, subtle separators, equal visual treatment for Search, QR & Card Scan */
        /* Information priority: Person Name > Designation > Business Name > Category • Location */
        /* ======================================================================= */
        <main
          className="flex-1 overflow-y-auto px-4 py-2 space-y-2.5"
          role="feed"
          aria-label="Private business contacts list"
        >
          {filteredAndSortedContacts.map(contact => {
            const matchedInNote = checkMatchedInNote(contact, searchQuery);

            return (
              <article
                key={contact.id}
                id={`network-row-${contact.id}`}
                onClick={() => {
                  if (onOpenContactDetail) onOpenContactDetail(contact.id);
                  else triggerToast(`Network Contact Detail for ${contact.personName} (V2 stub)`, 'info');
                }}
                className="p-3 rounded-xl bg-[#121722] border border-white/[0.07] hover:border-white/[0.15] transition-all cursor-pointer active:scale-[0.99] group shadow-xs relative"
                tabIndex={0}
                aria-label={`${contact.personName}, ${contact.designation} at ${contact.businessName}, ${contact.category}, ${contact.city}. ${contact.isFavorite ? 'Favorite.' : ''} ${contact.followUpLabel ? contact.followUpLabel : ''}`}
              >
                <div className="flex items-start gap-3">
                  {/* Contact Avatar (Initials monogram, Section 19, 66) */}
                  <div
                    className="w-10 h-10 rounded-xl bg-[#182030] border border-white/[0.12] text-xs font-bold flex items-center justify-center shrink-0 group-hover:border-[#E5A93C]/40 transition-colors shadow-xs"
                    style={{ color: contact.avatarColor || '#E5A93C' }}
                    aria-hidden="true"
                  >
                    {contact.initials}
                  </div>

                  {/* Main Contact Identity Information */}
                  <div className="min-w-0 flex-1">
                    {/* Person Name + Favorite Star Action */}
                    <div className="flex items-center justify-between gap-1">
                      <h2 className="text-[13.5px] font-bold text-white tracking-tight group-hover:text-[#E5A93C] transition-colors truncate">
                        {contact.personName}
                      </h2>

                      {/* Small Private Star Favorite Toggle (Section 28, 29) */}
                      <button
                        onClick={e => handleToggleFavorite(e, contact.id)}
                        className="w-7 h-7 -mr-1 rounded-full flex items-center justify-center text-[#64748B] hover:text-[#E5A93C] transition-colors active:scale-90"
                        title={contact.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                        aria-label={contact.isFavorite ? `Remove ${contact.personName} from favorites` : `Favorite ${contact.personName}`}
                      >
                        <Star
                          className={`w-3.5 h-3.5 transition-all ${
                            contact.isFavorite
                              ? 'text-[#E5A93C] fill-[#E5A93C] scale-110'
                              : 'hover:text-[#E5A93C]'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Designation / Role */}
                    <div className="text-[11.5px] font-medium text-[#94A3B8] truncate leading-tight">
                      {contact.designation}
                    </div>

                    {/* Business Name (Section 21) */}
                    <div className="text-[12px] font-semibold text-white/90 truncate leading-snug mt-0.5">
                      {contact.businessName}
                    </div>

                    {/* Category • Location */}
                    <div className="text-[10.5px] font-medium text-[#64748B] truncate mt-0.5">
                      {contact.category} • {contact.city}
                    </div>

                    {/* Badges, Tags, Follow-ups, and Source (Section 20, 21, 30, 31) */}
                    <div className="flex items-center gap-1.5 flex-wrap mt-2 pt-1 border-t border-white/[0.04]">
                      {/* Private Tags (Max 1-2 chips, Section 30) */}
                      {contact.tags && contact.tags.length > 0 && (
                        <>
                          <span className="px-2 py-0.5 rounded-md bg-white/[0.05] border border-white/[0.06] text-[10px] text-white/80 font-medium truncate max-w-[120px]">
                            {contact.tags[0]}
                          </span>
                          {contact.tags.length > 1 && (
                            <span className="text-[10px] text-[#64748B]">
                              +{contact.tags.length - 1}
                            </span>
                          )}
                        </>
                      )}

                      {/* Follow-up Indicator (Section 31, 32) */}
                      {contact.followUpLabel && (
                        <div
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium ${
                            contact.followUpStatus === 'overdue'
                              ? 'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/20'
                              : contact.followUpStatus === 'today'
                              ? 'bg-[#E5A93C]/15 text-[#E5A93C] border border-[#E5A93C]/20'
                              : 'bg-white/[0.04] text-[#94A3B8]'
                          }`}
                        >
                          <Clock className="w-2.5 h-2.5" />
                          <span>{contact.followUpLabel}</span>
                        </div>
                      )}

                      {/* Matched in Notes indicator (Section 38) */}
                      {matchedInNote && (
                        <span className="px-1.5 py-0.5 rounded bg-[#38BDF8]/15 border border-[#38BDF8]/20 text-[#38BDF8] text-[9.5px] font-medium">
                          Matched in note
                        </span>
                      )}

                      {/* Source Indicator (Subtle, Section 20, 47, 48, 49) */}
                      <span className="ml-auto text-[9.5px] font-medium text-[#64748B] flex items-center gap-1">
                        {contact.source === 'QR' ? (
                          <QrCode className="w-2.5 h-2.5" />
                        ) : contact.source === 'Card Scan' ? (
                          <ScanLine className="w-2.5 h-2.5" />
                        ) : (
                          <Search className="w-2.5 h-2.5" />
                        )}
                        <span>{contact.source}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          {/* Infinite Scroll / Loading More Footer (Section 59, 60) */}
          <div className="py-3 text-center text-[10.5px] text-[#475569] flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3 h-3 text-[#10B981]" />
            <span>All {filteredAndSortedContacts.length} private contacts synced</span>
          </div>
        </main>
      )}

      {/* ========================================================================= */}
      {/* FILTER & SORT BOTTOM SHEET (Section 8, 9, 10, 11, 12, 13, 14) */}
      {/* ========================================================================= */}
      {showFilterSheet && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-150"
          onClick={() => setShowFilterSheet(false)}
        >
          <div
            className="bg-[#121722] border-t border-white/[0.12] rounded-t-2xl p-4 max-h-[75%] overflow-y-auto space-y-4 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Sheet Header */}
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <div className="flex items-center gap-1.5">
                <Filter className="w-4 h-4 text-[#E5A93C]" />
                <h3 className="text-sm font-bold text-white">Filter & Sort Network</h3>
              </div>
              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs font-semibold text-[#EF4444] hover:underline"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={() => setShowFilterSheet(false)}
                  className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center text-[#94A3B8] hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Sort Options (Section 14) */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3 text-[#E5A93C]" />
                <span>Sort By</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                <button
                  onClick={() => setSortOption('recent')}
                  className={`p-2 rounded-lg border text-left font-medium transition-all ${
                    sortOption === 'recent'
                      ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                      : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
                  }`}
                >
                  Recently Added
                </button>
                <button
                  onClick={() => setSortOption('name-asc')}
                  className={`p-2 rounded-lg border text-left font-medium transition-all ${
                    sortOption === 'name-asc'
                      ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                      : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
                  }`}
                >
                  Name (A–Z)
                </button>
                <button
                  onClick={() => setSortOption('name-desc')}
                  className={`p-2 rounded-lg border text-left font-medium transition-all ${
                    sortOption === 'name-desc'
                      ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                      : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
                  }`}
                >
                  Name (Z–A)
                </button>
                <button
                  onClick={() => setSortOption('follow-up')}
                  className={`p-2 rounded-lg border text-left font-medium transition-all ${
                    sortOption === 'follow-up'
                      ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                      : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
                  }`}
                >
                  Upcoming Follow-up
                </button>
              </div>
            </div>

            {/* Source Filter (Section 10) */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                Contact Source
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {(['all', 'Search', 'Card Scan', 'QR'] as const).map(src => (
                  <button
                    key={src}
                    onClick={() => setSelectedSource(src)}
                    className={`py-1.5 px-2 rounded-lg border font-medium text-center transition-all ${
                      selectedSource === src
                        ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                        : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
                    }`}
                  >
                    {src === 'all' ? 'All' : src}
                  </button>
                ))}
              </div>
            </div>

            {/* Follow-up Filter (Section 13) */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider">
                Follow-up Reminder
              </label>
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {(['all', 'today', 'upcoming', 'overdue'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setSelectedFollowUp(st)}
                    className={`py-1.5 px-2 rounded-lg border font-medium text-center capitalize transition-all ${
                      selectedFollowUp === st
                        ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                        : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
                    }`}
                  >
                    {st === 'all' ? 'All' : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Done Action */}
            <button
              onClick={() => setShowFilterSheet(false)}
              className="w-full py-2.5 rounded-xl bg-[#E5A93C] text-[#0A0D14] font-bold text-xs shadow-md active:scale-95 transition-all"
            >
              Show {filteredAndSortedContacts.length} Contacts
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PERSISTENT BOTTOM NAVIGATION (Section 78) */}
      {/* MY NETWORK IS SELECTED in Amber gold! (Section 78) */}
      {/* ========================================================================= */}
      <nav
        id="persistent-bottom-navigation"
        className="relative z-20 bg-[#0A0D14]/95 backdrop-blur-md border-t border-white/[0.08] px-3 py-2 flex items-center justify-around shrink-0"
        role="navigation"
        aria-label="Application Bottom Navigation"
      >
        <button
          onClick={onNavigateToHome}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[#94A3B8] hover:text-white transition-all active:scale-95"
          aria-label="Home"
        >
          <HomeIcon className="w-4 h-4" />
          <span className="text-[10px] font-medium">Home</span>
        </button>

        <button
          onClick={onNavigateToSearch}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[#94A3B8] hover:text-white transition-all active:scale-95"
          aria-label="Search"
        >
          <Search className="w-4 h-4" />
          <span className="text-[10px] font-medium">Search</span>
        </button>

        <button
          onClick={() => {
            if (onNavigateToScan) onNavigateToScan('card');
            else triggerToast('Opening Scanner (Card mode)...');
          }}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[#94A3B8] hover:text-white transition-all active:scale-95"
          aria-label="Scan"
        >
          <ScanLine className="w-4 h-4" />
          <span className="text-[10px] font-medium">Scan</span>
        </button>

        {/* MY NETWORK IS SELECTED (Section 78) */}
        <button
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[#E5A93C] font-semibold transition-all relative"
          aria-label="My Network (Current Page)"
          aria-current="page"
        >
          <Users className="w-4 h-4" />
          <span className="text-[10px] font-bold">My Network</span>
          <span className="w-1 h-1 rounded-full bg-[#E5A93C] absolute -bottom-0.5" />
        </button>

        <button
          onClick={onNavigateToProfile || (() => triggerToast('Your Own Profile'))}
          className="flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-[#94A3B8] hover:text-white transition-all active:scale-95"
          aria-label="My Account Profile"
        >
          <User className="w-4 h-4" />
          <span className="text-[10px] font-medium">Profile</span>
        </button>
      </nav>
    </div>
  );
};
