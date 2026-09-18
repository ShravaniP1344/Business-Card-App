import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home as HomeIcon,
  Search, 
  ScanLine, 
  Users, 
  User, 
  Bell, 
  QrCode, 
  ChevronDown, 
  Check, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Sparkles, 
  AlertCircle, 
  WifiOff, 
  Building2, 
  X,
  Sliders,
  RefreshCw,
  ArrowRight,
  Send,
  Calendar,
  Layers,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import { DESIGN_TOKENS } from '../design-system/tokens';
import { BusinessIdentityFormData } from './BusinessIdentitySetupScreen';

export interface NetworkContact {
  id: string;
  name: string;
  role: string;
  businessName: string;
  category: string;
  source: 'Search' | 'Card scan' | 'QR';
  avatarInitials: string;
  isRegisteredIdentity: boolean;
  avatarColor?: string;
  city?: string;
}

export interface FollowUpItem {
  id: string;
  contactName: string;
  contactInitials: string;
  task: string;
  dueDate: string;
  isCompleted: boolean;
}

export interface ActivityItem {
  id: string;
  actorName: string;
  message: string;
  timeAgo: string;
  source: 'Search' | 'Card scan' | 'QR';
}

export interface BusinessIdentityOption {
  id: string;
  businessName: string;
  role: string;
  category: string;
  city: string;
  monogram: string;
  isDefault?: boolean;
}

interface HomeScreenProps {
  userFullName?: string;
  userProfilePhoto?: string | null;
  activeIdentity?: BusinessIdentityFormData | null;
  allIdentities?: BusinessIdentityFormData[];
  onNavigateToSearch?: () => void;
  onNavigateToScan?: (mode?: 'card' | 'qr') => void;
  onNavigateToMyQr?: () => void;
  onNavigateToMyNetwork?: () => void;
  onNavigateToProfile?: () => void;
  onNavigateBackToOnboarding?: () => void;
  isLargeTextMode?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userFullName = 'Shravani Pasnur',
  userProfilePhoto = null,
  activeIdentity = null,
  allIdentities = [],
  onNavigateToSearch,
  onNavigateToScan,
  onNavigateToMyQr,
  onNavigateToMyNetwork,
  onNavigateToProfile,
  onNavigateBackToOnboarding,
  isLargeTextMode = false,
}) => {
  // Navigation tab state (Home is selected destination)
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'scan' | 'network' | 'profile'>('home');

  // Interactive prototype test inspector state
  const [showInspector, setShowInspector] = useState(false);
  const [prototypeScenario, setPrototypeScenario] = useState<
    'populated' | 'first-time-empty' | 'loading' | 'partial-failure' | 'network-error' | 'devanagari'
  >('populated');
  const [isOffline, setIsOffline] = useState(false);
  const [hasUnreadNotification, setHasUnreadNotification] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Identity switcher bottom sheet state
  const [showIdentitySheet, setShowIdentitySheet] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Partial failure retry states
  const [followUpFailed, setFollowUpFailed] = useState(false);

  // Business Identities list
  const [identitiesList, setIdentitiesList] = useState<BusinessIdentityOption[]>([
    {
      id: 'biz-1',
      businessName: activeIdentity?.businessName || 'Aikyam AI Systems',
      role: activeIdentity?.role || 'Software Engineer',
      category: activeIdentity?.businessCategory || 'Technology',
      city: activeIdentity?.city || 'Solapur',
      monogram: 'AI',
      isDefault: true,
    },
    {
      id: 'biz-2',
      businessName: 'Pasnur Industries',
      role: 'Director & Owner',
      category: 'Manufacturing & Textiles',
      city: 'Solapur',
      monogram: 'PI',
    },
    {
      id: 'biz-3',
      businessName: 'Solapur Tech Consultants',
      role: 'Advisory Member',
      category: 'Professional Services',
      city: 'Solapur',
      monogram: 'ST',
    },
  ]);

  const [selectedIdentityId, setSelectedIdentityId] = useState<string>('biz-1');

  // Update active identity if props change
  useEffect(() => {
    if (activeIdentity?.businessName) {
      setIdentitiesList(prev => [
        {
          id: 'biz-1',
          businessName: activeIdentity.businessName,
          role: activeIdentity.role || 'Software Engineer',
          category: activeIdentity.businessCategory || 'Technology',
          city: activeIdentity.city || 'Solapur',
          monogram: activeIdentity.businessName.slice(0, 2).toUpperCase(),
          isDefault: true,
        },
        ...prev.filter(item => item.id !== 'biz-1'),
      ]);
    }
  }, [activeIdentity]);

  // Derived current active business identity
  const currentIdentity = useMemo(() => {
    if (prototypeScenario === 'devanagari') {
      return {
        id: 'biz-dev',
        businessName: 'ऐक्यम एआय सिस्टीम्स',
        role: 'सॉफ्टवेअर इंजिनिअर',
        category: 'तंत्रज्ञान',
        city: 'सोलापूर',
        monogram: 'ऐ',
      };
    }
    return identitiesList.find(b => b.id === selectedIdentityId) || identitiesList[0];
  }, [identitiesList, selectedIdentityId, prototypeScenario]);

  // Dynamic local time-based greeting (morning, afternoon, evening)
  const greeting = useMemo(() => {
    if (prototypeScenario === 'devanagari') {
      const hour = new Date().getHours();
      if (hour < 12) return 'शुभ सकाळ';
      if (hour < 17) return 'शुभ दुपार';
      return 'शुभ संध्याकाळ';
    }
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }, [prototypeScenario]);

  // User First Name extraction
  const userFirstName = useMemo(() => {
    if (prototypeScenario === 'devanagari') return 'श्रावणी';
    const trimmed = userFullName.trim();
    if (!trimmed) return 'Shravani';
    return trimmed.split(/\s+/)[0];
  }, [userFullName, prototypeScenario]);

  // User Monogram
  const userInitials = useMemo(() => {
    if (prototypeScenario === 'devanagari') return 'श्रा';
    const parts = userFullName.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (parts[0] ? parts[0].slice(0, 2) : 'SP').toUpperCase();
  }, [userFullName, prototypeScenario]);

  // Network Contacts (Prototype default content)
  const initialContacts: NetworkContact[] = [
    {
      id: 'c-1',
      name: 'Rahul Patil',
      role: 'Owner',
      businessName: 'ABC Manufacturing',
      category: 'Industrial Goods',
      source: 'Search',
      avatarInitials: 'RP',
      isRegisteredIdentity: true,
      avatarColor: '#E5A93C',
      city: 'Solapur',
    },
    {
      id: 'c-2',
      name: 'Arjun Deshmukh',
      role: 'Sales Manager',
      businessName: 'Vertex Industrial Solutions',
      category: 'Machinery & Equipment',
      source: 'Card scan',
      avatarInitials: 'AD',
      isRegisteredIdentity: false,
      avatarColor: '#64748B',
      city: 'Pune',
    },
  ];

  const devanagariContacts: NetworkContact[] = [
    {
      id: 'c-1',
      name: 'राहुल पाटील',
      role: 'मालक / व्यवस्थापक',
      businessName: 'एबीसी मॅन्युफॅक्चरिंग',
      category: 'औद्योगिक उत्पादने',
      source: 'Search',
      avatarInitials: 'रा',
      isRegisteredIdentity: true,
      avatarColor: '#E5A93C',
      city: 'सोलापूर',
    },
    {
      id: 'c-2',
      name: 'अर्जुन देशमुख',
      role: 'विक्री व्यवस्थापक',
      businessName: 'व्हर्टेक्स इंडस्ट्रियल सोल्युशन्स',
      category: 'यंत्रसामग्री व उपकरणे',
      source: 'Card scan',
      avatarInitials: 'अ',
      isRegisteredIdentity: false,
      avatarColor: '#64748B',
      city: 'पुणे',
    },
  ];

  const [contacts, setContacts] = useState<NetworkContact[]>(initialContacts);

  // Follow-ups state
  const [followUps, setFollowUps] = useState<FollowUpItem[]>([
    {
      id: 'fu-1',
      contactName: 'Rahul Patil',
      contactInitials: 'RP',
      task: 'Send product catalogue',
      dueDate: 'Today',
      isCompleted: false,
    },
  ]);

  // Recent Activity state
  const initialActivities: ActivityItem[] = [
    {
      id: 'act-1',
      actorName: 'Rahul Patil',
      message: 'added you to their network.',
      timeAgo: '2h ago',
      source: 'Search',
    },
    {
      id: 'act-2',
      actorName: 'Arjun Deshmukh',
      message: 'was added from a card scan.',
      timeAgo: 'Yesterday',
      source: 'Card scan',
    },
  ];

  const devanagariActivities: ActivityItem[] = [
    {
      id: 'act-1',
      actorName: 'राहुल पाटील',
      message: 'यांनी तुम्हाला त्यांच्या नेटवर्कमध्ये जोडले.',
      timeAgo: '२ तासांपूर्वी',
      source: 'Search',
    },
    {
      id: 'act-2',
      actorName: 'अर्जुन देशमुख',
      message: 'व्हिजिटिंग कार्ड स्कॅन करून जोडले गेले.',
      timeAgo: 'काल',
      source: 'Card scan',
    },
  ];

  const [activities, setActivities] = useState<ActivityItem[]>(initialActivities);

  // Sync with test scenario
  useEffect(() => {
    if (prototypeScenario === 'first-time-empty') {
      setContacts([]);
      setFollowUps([]);
      setActivities([]);
      setFollowUpFailed(false);
    } else if (prototypeScenario === 'partial-failure') {
      setContacts(initialContacts);
      setActivities(initialActivities);
      setFollowUpFailed(true);
    } else if (prototypeScenario === 'devanagari') {
      setContacts(devanagariContacts);
      setFollowUps([
        {
          id: 'fu-dev',
          contactName: 'राहुल पाटील',
          contactInitials: 'रा',
          task: 'उत्पादन कॅटलॉग पाठवा',
          dueDate: 'आज',
          isCompleted: false,
        },
      ]);
      setActivities(devanagariActivities);
      setFollowUpFailed(false);
    } else {
      setContacts(initialContacts);
      setFollowUps([
        {
          id: 'fu-1',
          contactName: 'Rahul Patil',
          contactInitials: 'RP',
          task: 'Send product catalogue',
          dueDate: 'Today',
          isCompleted: false,
        },
      ]);
      setActivities(initialActivities);
      setFollowUpFailed(false);
    }
  }, [prototypeScenario]);

  // Toast notifier
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Toggle follow-up completion
  const handleToggleFollowUp = (id: string) => {
    setFollowUps(prev =>
      prev.map(item => {
        if (item.id === id) {
          const nextState = !item.isCompleted;
          triggerToast(nextState ? 'Follow-up marked done' : 'Follow-up reopened');
          return { ...item, isCompleted: nextState };
        }
        return item;
      })
    );
  };

  // Pull-to-refresh simulation
  const handlePullToRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      triggerToast('Home dashboard refreshed');
    }, 700);
  };

  // Active pending follow-ups count
  const pendingFollowUpsCount = followUps.filter(f => !f.isCompleted).length;

  return (
    <div 
      id="screen-15-home"
      className="relative flex flex-col h-full w-full bg-[#0A0D14] text-[#F8FAFC] select-none overflow-hidden font-sans"
      style={{ fontFamily: DESIGN_TOKENS.typography.fontFamily }}
    >
      {/* OFFLINE STATUS BANNER (if offline mode active) */}
      {isOffline && (
        <div className="relative z-40 bg-[#1F293D] border-b border-[#F59E0B]/30 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-[#F59E0B]">
          <div className="flex items-center gap-1.5">
            <WifiOff className="w-3.5 h-3.5" />
            <span className="font-medium">You're offline • Showing cached network</span>
          </div>
          <button
            onClick={() => {
              setIsOffline(false);
              triggerToast('Reconnected to network');
            }}
            className="text-[10px] underline font-semibold hover:text-white"
          >
            Retry
          </button>
        </div>
      )}

      {/* TOAST NOTIFICATION (Fixed overlay) */}
      {toastMessage && (
        <div className="absolute top-14 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 rounded-full bg-[#182030]/95 border border-white/[0.15] text-[#F8FAFC] text-[11px] font-medium shadow-xl flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP APP BAR: Greeting + Active Business Identity Control + Notification Bell */}
      <header className="relative z-20 bg-[#0A0D14]/95 backdrop-blur-md border-b border-white/[0.06] px-4 pt-3 pb-2.5 shrink-0">
        <div className="flex items-start justify-between gap-2">
          
          {/* Greeting & Active Business Switcher */}
          <div className="min-w-0 flex-1">
            {/* Small dynamic time-based greeting */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11.5px] font-medium text-[#94A3B8] tracking-tight truncate">
                {greeting}, <span className="text-white font-semibold">{userFirstName}</span>
              </span>
              
              {/* Back to Onboarding Link for reviewer/testing */}
              {onNavigateBackToOnboarding && (
                <button
                  onClick={onNavigateBackToOnboarding}
                  className="text-[10px] text-[#64748B] hover:text-[#E5A93C] underline ml-1"
                  title="Return to Onboarding screen 14"
                >
                  (S14)
                </button>
              )}
            </div>

            {/* Active Business Identity Switcher Control */}
            <button
              id="btn-active-identity-switcher"
              onClick={() => setShowIdentitySheet(true)}
              className="group mt-1 flex items-center gap-2 max-w-full text-left p-1 -ml-1 rounded-lg hover:bg-white/[0.04] transition-all active:scale-[0.99]"
              aria-label={`Active Business: ${currentIdentity.businessName}. Tap to switch business identity.`}
              title="Switch business identity"
            >
              {/* Business Monogram / Logo */}
              <div className="w-7 h-7 rounded-md bg-[#182030] border border-white/[0.12] text-[#E5A93C] font-bold text-[11px] flex items-center justify-center shrink-0 shadow-xs group-hover:border-[#E5A93C]/40">
                {currentIdentity.monogram}
              </div>

              {/* Business Name & Role (Controlled truncation for long names) */}
              <div className="min-w-0 flex-1 pr-1">
                <div className="flex items-center gap-1">
                  <h1 className="text-[13px] font-bold text-white tracking-tight truncate leading-tight group-hover:text-[#E5A93C] transition-colors">
                    {currentIdentity.businessName}
                  </h1>
                  <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] shrink-0 group-hover:text-white transition-transform group-hover:translate-y-0.5" />
                </div>
                <p className="text-[10.5px] font-medium text-[#94A3B8] truncate leading-tight">
                  {currentIdentity.role}
                </p>
              </div>
            </button>
          </div>

          {/* Right Action: Notification Bell & Prototype Inspector Toggle */}
          <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
            {/* Notification Bell */}
            <button
              id="btn-notifications-bell"
              onClick={() => {
                setHasUnreadNotification(false);
                triggerToast('Notifications: No pending system alerts');
              }}
              className="relative w-9 h-9 rounded-full bg-[#121722] hover:bg-[#182030] border border-white/[0.08] flex items-center justify-center text-[#94A3B8] hover:text-white transition-all active:scale-95"
              aria-label="Notifications"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {hasUnreadNotification && (
                <span 
                  className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E5A93C] ring-2 ring-[#0A0D14]"
                  aria-label="Unread notifications indicator" 
                />
              )}
            </button>

            {/* Prototype Control / Test Scenarios */}
            <button
              onClick={() => setShowInspector(!showInspector)}
              className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all ${
                showInspector 
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-[#E5A93C]' 
                  : 'bg-[#121722] border-white/[0.08] text-[#94A3B8] hover:text-white'
              }`}
              title="Screen 15 Prototype Scenarios & Verification"
              aria-label="Toggle Screen 15 inspector"
            >
              <Sliders className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </header>

      {/* INSPECTOR SLIDEOUT / TEST CONTROLS */}
      {showInspector && (
        <div className="relative z-30 mx-4 mt-2 p-3 rounded-xl bg-[#121722] border border-[#E5A93C]/40 shadow-xl shrink-0">
          <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-white/[0.08]">
            <span className="text-[11px] font-bold text-[#E5A93C] flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Screen 15 Architecture Test Controls
            </span>
            <button 
              onClick={() => setShowInspector(false)}
              className="text-[#94A3B8] hover:text-white text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1.5 text-[10px] mb-2">
            <button
              onClick={() => setPrototypeScenario('populated')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all ${
                prototypeScenario === 'populated'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Populated (Demo)
            </button>
            <button
              onClick={() => setPrototypeScenario('first-time-empty')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all ${
                prototypeScenario === 'first-time-empty'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Empty (Real User)
            </button>
            <button
              onClick={() => setPrototypeScenario('devanagari')}
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
              Loading Skeletons
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
              onClick={() => setPrototypeScenario('network-error')}
              className={`px-2 py-1.5 rounded-lg border font-medium transition-all ${
                prototypeScenario === 'network-error'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#182030] border-white/[0.06] text-[#94A3B8]'
              }`}
            >
              Full Error State
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-white/[0.06] text-[10px]">
            <button
              onClick={() => setIsOffline(!isOffline)}
              className={`flex items-center gap-1 px-2 py-1 rounded border ${
                isOffline ? 'bg-[#F59E0B]/20 border-[#F59E0B] text-[#F59E0B]' : 'bg-[#182030] border-white/[0.08] text-[#94A3B8]'
              }`}
            >
              <WifiOff className="w-3 h-3" />
              <span>Offline: {isOffline ? 'ON' : 'OFF'}</span>
            </button>
            <button
              onClick={() => setHasUnreadNotification(!hasUnreadNotification)}
              className="text-[#94A3B8] hover:text-white underline"
            >
              Toggle Unread Bell
            </button>
            <button
              onClick={handlePullToRefresh}
              className="flex items-center gap-1 text-[#E5A93C] font-semibold"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Simulate Refresh</span>
            </button>
          </div>
        </div>
      )}

      {/* MAIN SCROLLABLE CONTENT */}
      {prototypeScenario === 'network-error' ? (
        /* FULL NETWORK FAILURE STATE (Section 49) */
        <main className="relative z-10 flex-1 px-5 flex flex-col items-center justify-center text-center p-6">
          <div className="w-12 h-12 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444] mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-white mb-1">Couldn't refresh Home.</h2>
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
      ) : (
        <main className="relative z-10 flex-1 overflow-y-auto min-h-0 px-4 pt-3 pb-24 space-y-4">
          
          {/* PULL TO REFRESH INDICATOR (Native mobile feel) */}
          {isRefreshing && (
            <div className="flex items-center justify-center gap-2 py-1 text-[11px] text-[#E5A93C] font-medium">
              <RefreshCw className="w-3 h-3 animate-spin" />
              <span>Refreshing your workspace...</span>
            </div>
          )}

          {/* 1. PROMINENT COMPACT GLOBAL SEARCH BAR (Section 28) */}
          <div className="relative w-full">
            <div 
              onClick={() => {
                if (onNavigateToSearch) onNavigateToSearch();
                else triggerToast('Opening Global Search...');
              }}
              className="flex items-center gap-2.5 w-full h-11 px-3.5 rounded-xl bg-[#121722] border border-white/[0.12] hover:border-[#E5A93C]/40 text-[#94A3B8] cursor-pointer transition-all shadow-xs group"
              role="search"
              tabIndex={0}
              aria-label="Search people, businesses or services"
            >
              <Search className="w-4 h-4 text-[#94A3B8] group-hover:text-[#E5A93C] transition-colors shrink-0" />
              <span className="text-[12.5px] font-normal text-[#64748B] group-hover:text-[#94A3B8] truncate select-none">
                {prototypeScenario === 'devanagari' 
                  ? 'व्यक्ती, व्यवसाय किंवा सेवा शोधा...'
                  : 'Search people, businesses or services'
                }
              </span>
            </div>
          </div>

          {/* 2. QUICK ACTIONS: Scan Card & My QR (Section 9-13) */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Scan Card Quick Action */}
            <button
              id="btn-quick-action-scan"
              onClick={() => {
                if (onNavigateToScan) onNavigateToScan('card');
                else triggerToast('Opening Scanner in Card Mode...');
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#121722] border border-white/[0.08] hover:border-[#E5A93C]/40 text-left transition-all active:scale-[0.98] shadow-xs group"
              aria-label="Scan Card - Save a physical card"
            >
              <div className="w-9 h-9 rounded-lg bg-[#E5A93C]/15 border border-[#E5A93C]/30 flex items-center justify-center text-[#E5A93C] shrink-0 group-hover:bg-[#E5A93C] group-hover:text-[#0A0D14] transition-colors">
                <ScanLine className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-bold text-white tracking-tight truncate leading-snug">
                  {prototypeScenario === 'devanagari' ? 'कार्ड स्कॅन' : 'Scan Card'}
                </div>
                <div className="text-[10.5px] text-[#94A3B8] truncate leading-tight">
                  {prototypeScenario === 'devanagari' ? 'व्हिजिटिंग कार्ड सेव्ह करा' : 'Save a physical card'}
                </div>
              </div>
            </button>

            {/* My QR Quick Action */}
            <button
              id="btn-quick-action-qr"
              onClick={() => {
                if (onNavigateToMyQr) {
                  onNavigateToMyQr();
                } else {
                  setShowQrModal(true);
                }
              }}
              className="flex items-center gap-3 p-3 rounded-xl bg-[#121722] border border-white/[0.08] hover:border-[#E5A93C]/40 text-left transition-all active:scale-[0.98] shadow-xs group"
              aria-label={`My QR - Share your identity for ${currentIdentity.businessName}`}
            >
              <div className="w-9 h-9 rounded-lg bg-[#182030] border border-white/[0.14] flex items-center justify-center text-white shrink-0 group-hover:border-[#E5A93C]/40 group-hover:text-[#E5A93C] transition-colors">
                <QrCode className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12.5px] font-bold text-white tracking-tight truncate leading-snug">
                  {prototypeScenario === 'devanagari' ? 'माझा क्यूआर' : 'My QR'}
                </div>
                <div className="text-[10.5px] text-[#94A3B8] truncate leading-tight">
                  {prototypeScenario === 'devanagari' ? 'डिजिटल कार्ड शेअर करा' : 'Share your identity'}
                </div>
              </div>
            </button>
          </div>

          {/* 3. SKELETON LOADING STATE (Section 47) */}
          {prototypeScenario === 'loading' ? (
            <div className="space-y-4 pt-1 animate-pulse">
              {/* Skeleton Follow-ups */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="h-3 w-20 bg-white/[0.08] rounded" />
                  <div className="h-3 w-12 bg-white/[0.08] rounded" />
                </div>
                <div className="h-16 w-full bg-[#121722] rounded-xl border border-white/[0.06]" />
              </div>
              {/* Skeleton Network */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="h-3 w-24 bg-white/[0.08] rounded" />
                  <div className="h-3 w-12 bg-white/[0.08] rounded" />
                </div>
                <div className="h-16 w-full bg-[#121722] rounded-xl border border-white/[0.06]" />
                <div className="h-16 w-full bg-[#121722] rounded-xl border border-white/[0.06]" />
              </div>
            </div>
          ) : (
            <>
              {/* 4. FOLLOW-UPS SECTION (Section 18-20, 48) */}
              <section aria-labelledby="heading-follow-ups" className="pt-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h2 id="heading-follow-ups" className="text-[12px] font-bold uppercase tracking-wider text-[#94A3B8]">
                      {prototypeScenario === 'devanagari' ? 'फॉलो-अप्स' : 'Follow-ups'}
                    </h2>
                    {pendingFollowUpsCount > 0 && !followUpFailed && (
                      <span className="px-1.5 py-0.2 rounded-full bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-[10px] font-semibold text-[#E5A93C]">
                        {pendingFollowUpsCount} {prototypeScenario === 'devanagari' ? 'आज प्रलंबित' : 'due today'}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => triggerToast('Follow-ups manager will open in future step')}
                    className="text-[11px] font-medium text-[#94A3B8] hover:text-[#E5A93C] transition-colors"
                  >
                    View All
                  </button>
                </div>

                {/* Partial Failure State for Follow-ups (Section 48) */}
                {followUpFailed ? (
                  <div className="p-3 rounded-xl bg-[#121722] border border-[#EF4444]/25 flex items-center justify-between gap-2 text-[11.5px]">
                    <div className="flex items-center gap-2 text-[#EF4444] min-w-0">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span className="text-white truncate">Couldn't load follow-ups.</span>
                    </div>
                    <button
                      onClick={() => setFollowUpFailed(false)}
                      className="px-2.5 py-1 rounded-lg bg-[#182030] hover:bg-[#1F293D] text-[#E5A93C] font-semibold text-[10.5px] border border-white/[0.08] shrink-0"
                    >
                      Try Again
                    </button>
                  </div>
                ) : followUps.length > 0 && pendingFollowUpsCount > 0 ? (
                  /* Active Follow-up Items */
                  <div className="space-y-2">
                    {followUps.map(item => (
                      <div
                        key={item.id}
                        className={`p-3 rounded-xl bg-[#121722] border transition-all flex items-center justify-between gap-3 ${
                          item.isCompleted 
                            ? 'border-white/[0.04] opacity-60' 
                            : 'border-white/[0.08] hover:border-white/[0.14]'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0 flex-1">
                          {/* Person Initials */}
                          <div className="w-8 h-8 rounded-lg bg-[#182030] border border-white/[0.1] text-[#E5A93C] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                            {item.contactInitials}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[12.5px] font-semibold truncate ${item.isCompleted ? 'line-through text-[#64748B]' : 'text-white'}`}>
                                {item.contactName}
                              </span>
                              <span className="px-1.5 py-0.2 rounded text-[9.5px] font-medium bg-[#E5A93C]/10 text-[#E5A93C]">
                                {item.dueDate}
                              </span>
                            </div>
                            <p className={`text-[11.5px] truncate mt-0.5 ${item.isCompleted ? 'text-[#475569]' : 'text-[#94A3B8]'}`}>
                              {item.task}
                            </p>
                          </div>
                        </div>

                        {/* Actionable Checkbox Button */}
                        <button
                          onClick={() => handleToggleFollowUp(item.id)}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-[#94A3B8] hover:text-[#10B981] hover:bg-[#10B981]/10 transition-colors shrink-0"
                          aria-label={item.isCompleted ? 'Mark as incomplete' : 'Mark as done'}
                          title={item.isCompleted ? 'Reopen' : 'Mark done'}
                        >
                          {item.isCompleted ? (
                            <CheckCircle2 className="w-5 h-5 text-[#10B981]" />
                          ) : (
                            <Circle className="w-5 h-5 text-[#64748B] hover:text-[#10B981]" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Empty Follow-ups State (Section 20) */
                  <div className="p-3.5 rounded-xl bg-[#121722]/60 border border-white/[0.05] text-left">
                    <p className="text-[12px] font-medium text-white">
                      {prototypeScenario === 'devanagari'
                        ? 'सध्या कोणतेही फॉलो-अप प्रलंबित नाहीत.'
                        : 'Nothing to follow up on right now.'
                      }
                    </p>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      {prototypeScenario === 'devanagari'
                        ? 'तुम्ही जोडलेल्या संपर्कांसाठी ठरवलेले फॉलो-अप्स येथे दिसतील.'
                        : 'Follow-ups you set for your contacts will appear here.'
                      }
                    </p>
                  </div>
                )}
              </section>

              {/* 5. MY NETWORK SUMMARY (Section 14-17, 25) */}
              <section aria-labelledby="heading-my-network" className="pt-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h2 id="heading-my-network" className="text-[12px] font-bold uppercase tracking-wider text-[#94A3B8]">
                      {prototypeScenario === 'devanagari' ? 'माझे नेटवर्क' : 'My Network'}
                    </h2>
                    {contacts.length > 0 && (
                      <span className="text-[11px] font-medium text-[#64748B]">
                        {contacts.length} {prototypeScenario === 'devanagari' ? 'संपर्क' : 'contacts'}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      if (onNavigateToMyNetwork) onNavigateToMyNetwork();
                      else triggerToast('My Network screen will open in future step');
                    }}
                    className="text-[11px] font-medium text-[#94A3B8] hover:text-[#E5A93C] transition-colors"
                  >
                    View All
                  </button>
                </div>

                {contacts.length > 0 ? (
                  /* Contact Cards Preview (Unified language for registered & scanned) */
                  <div className="space-y-2">
                    {contacts.map(contact => (
                      <div
                        key={contact.id}
                        onClick={() => triggerToast(`Contact detail: ${contact.name}`)}
                        className="p-3 rounded-xl bg-[#121722] border border-white/[0.08] hover:border-white/[0.15] cursor-pointer transition-all active:scale-[0.99] flex items-center justify-between gap-3 shadow-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          {/* Avatar Monogram */}
                          <div 
                            className="w-10 h-10 rounded-xl bg-[#182030] border border-white/[0.1] font-bold text-xs flex items-center justify-center shrink-0 shadow-xs"
                            style={{ color: contact.avatarColor || '#E5A93C' }}
                          >
                            {contact.avatarInitials}
                          </div>

                          {/* Person Details */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <h3 className="text-[13px] font-bold text-white tracking-tight truncate">
                                {contact.name}
                              </h3>
                              {/* Source Indicator (subtle, not dominant) */}
                              <span className="shrink-0 text-[10px] text-[#64748B] px-1.5 py-0.5 rounded bg-white/[0.04]">
                                {contact.source}
                              </span>
                            </div>
                            <p className="text-[11.5px] font-medium text-[#94A3B8] truncate leading-snug">
                              {contact.role} • {contact.businessName}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* FIRST-TIME EMPTY MY NETWORK STATE (Section 25, 65) */
                  <div className="p-4 rounded-xl bg-[#121722] border border-white/[0.08] text-center">
                    <div className="w-10 h-10 rounded-full bg-[#182030] border border-white/[0.1] flex items-center justify-center text-[#E5A93C] mx-auto mb-2">
                      <Users className="w-5 h-5" />
                    </div>
                    <h3 className="text-[13px] font-bold text-white mb-1">
                      {prototypeScenario === 'devanagari' ? 'तुमचे नेटवर्क येथून सुरू होते.' : 'Your network starts here.'}
                    </h3>
                    <p className="text-[11.5px] text-[#94A3B8] max-w-[260px] mx-auto mb-3 leading-relaxed">
                      {prototypeScenario === 'devanagari' 
                        ? 'व्यक्ती शोधा, व्हिजिटिंग कार्ड स्कॅन करा किंवा तुमचा क्यूआर शेअर करा.'
                        : 'Search someone, scan a card or share your QR.'
                      }
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          if (onNavigateToSearch) onNavigateToSearch();
                          else triggerToast('Opening Search...');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#182030] hover:bg-[#1F293D] border border-white/[0.1] text-[11px] font-semibold text-white transition-colors"
                      >
                        Search
                      </button>
                      <button
                        onClick={() => {
                          if (onNavigateToScan) onNavigateToScan('card');
                          else triggerToast('Opening Scanner...');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#182030] hover:bg-[#1F293D] border border-white/[0.1] text-[11px] font-semibold text-white transition-colors"
                      >
                        Scan Card
                      </button>
                      <button
                        onClick={() => setShowQrModal(true)}
                        className="px-3 py-1.5 rounded-lg bg-[#E5A93C]/15 border border-[#E5A93C]/30 text-[11px] font-semibold text-[#E5A93C] transition-colors"
                      >
                        My QR
                      </button>
                    </div>
                  </div>
                )}
              </section>

              {/* 6. RECENT ACTIVITY (Section 21-23, 26) */}
              {activities.length > 0 && (
                <section aria-labelledby="heading-recent-activity" className="pt-1">
                  <div className="flex items-center justify-between mb-2">
                    <h2 id="heading-recent-activity" className="text-[12px] font-bold uppercase tracking-wider text-[#94A3B8]">
                      {prototypeScenario === 'devanagari' ? 'अलिकडील घडामोडी' : 'Recent Activity'}
                    </h2>
                  </div>

                  <div className="p-3 rounded-xl bg-[#121722]/70 border border-white/[0.06] divide-y divide-white/[0.06]">
                    {activities.map(act => (
                      <div key={act.id} className="py-2 first:pt-0 last:pb-0 flex items-start justify-between gap-2 text-[11.5px]">
                        <p className="text-[#94A3B8] leading-snug min-w-0 flex-1">
                          <strong className="text-white font-semibold">{act.actorName}</strong>{' '}
                          <span>{act.message}</span>
                        </p>
                        <span className="text-[10px] text-[#64748B] shrink-0 pt-0.5">
                          {act.timeAgo}
                        </span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Subtle Private Workspace Reminder (Section 56) */}
              <div className="pt-2 text-center text-[10.5px] text-[#475569]">
                Private user workspace • Public actions represent {currentIdentity.businessName}
              </div>
            </>
          )}

        </main>
      )}

      {/* ========================================================================= */}
      {/* 7. PERSISTENT BOTTOM NAVIGATION BAR (Section 35-39) */}
      {/* 5 Destinations: Home (Selected), Search, Scan (Elevated), My Network, Profile */}
      {/* ========================================================================= */}
      <nav 
        id="bottom-navigation-bar"
        className="fixed bottom-0 left-0 right-0 z-30 bg-[#0E131E]/95 backdrop-blur-md border-t border-white/[0.08] px-2 py-1.5"
        aria-label="Main application navigation"
      >
        <div className="max-w-[480px] mx-auto flex items-center justify-around">
          
          {/* Destination 1: Home (Selected) */}
          <button
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center justify-center w-14 py-1 rounded-lg transition-all ${
              activeTab === 'home'
                ? 'text-[#E5A93C]'
                : 'text-[#64748B] hover:text-[#94A3B8]'
            }`}
            aria-current={activeTab === 'home' ? 'page' : undefined}
          >
            <HomeIcon className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            <span className={`text-[10px] mt-1 ${activeTab === 'home' ? 'font-bold' : 'font-medium'}`}>
              Home
            </span>
          </button>

          {/* Destination 2: Search */}
          <button
            onClick={() => {
              setActiveTab('search');
              if (onNavigateToSearch) onNavigateToSearch();
              else triggerToast('Search screen will open in future step');
            }}
            className={`flex flex-col items-center justify-center w-14 py-1 rounded-lg transition-all ${
              activeTab === 'search'
                ? 'text-[#E5A93C]'
                : 'text-[#64748B] hover:text-[#94A3B8]'
            }`}
          >
            <Search className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px] font-medium mt-1">Search</span>
          </button>

          {/* Destination 3: Scan (Subtly elevated key action) */}
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

          {/* Destination 4: My Network (or Network if width is tight) */}
          <button
            onClick={() => {
              setActiveTab('network');
              if (onNavigateToMyNetwork) onNavigateToMyNetwork();
              else triggerToast('My Network screen will open in future step');
            }}
            className={`flex flex-col items-center justify-center w-14 py-1 rounded-lg transition-all ${
              activeTab === 'network'
                ? 'text-[#E5A93C]'
                : 'text-[#64748B] hover:text-[#94A3B8]'
            }`}
          >
            <Users className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px] font-medium mt-1 truncate">Network</span>
          </button>

          {/* Destination 5: Profile */}
          <button
            onClick={() => {
              setActiveTab('profile');
              if (onNavigateToProfile) onNavigateToProfile();
              else triggerToast('Profile screen will open in future step');
            }}
            className={`flex flex-col items-center justify-center w-14 py-1 rounded-lg transition-all ${
              activeTab === 'profile'
                ? 'text-[#E5A93C]'
                : 'text-[#64748B] hover:text-[#94A3B8]'
            }`}
          >
            <User className="w-5 h-5 stroke-[1.8]" />
            <span className="text-[10px] font-medium mt-1">Profile</span>
          </button>

        </div>
      </nav>

      {/* ========================================================================= */}
      {/* 8. ACTIVE IDENTITY SWITCHER BOTTOM SHEET (Section 6-7) */}
      {/* Reusable component state variant */}
      {/* ========================================================================= */}
      {showIdentitySheet && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex flex-col justify-end animate-in fade-in duration-200"
          onClick={() => setShowIdentitySheet(false)}
        >
          <div 
            className="w-full max-w-[480px] mx-auto bg-[#121722] border-t border-white/[0.14] rounded-t-2xl p-4 shadow-2xl space-y-3 animate-in slide-in-from-bottom duration-250"
            onClick={e => e.stopPropagation()}
          >
            {/* Sheet Handle */}
            <div className="w-10 h-1 rounded-full bg-white/[0.2] mx-auto mb-1" />

            {/* Header */}
            <div className="flex items-center justify-between pb-1 border-b border-white/[0.08]">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Switch Business Identity
                </h3>
                <p className="text-[11px] text-[#94A3B8]">
                  Who are you representing right now?
                </p>
              </div>
              <button 
                onClick={() => setShowIdentitySheet(false)}
                className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center text-[#94A3B8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Identities Options */}
            <div className="space-y-2 py-1 max-h-[260px] overflow-y-auto">
              {identitiesList.map(biz => {
                const isCurrent = biz.id === selectedIdentityId;
                return (
                  <button
                    key={biz.id}
                    onClick={() => {
                      setSelectedIdentityId(biz.id);
                      setShowIdentitySheet(false);
                      triggerToast(`Switched active identity to ${biz.businessName}`);
                    }}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between gap-3 transition-all ${
                      isCurrent
                        ? 'bg-[#E5A93C]/10 border-[#E5A93C] text-white'
                        : 'bg-[#182030] border-white/[0.06] text-[#94A3B8] hover:border-white/[0.14] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {/* Monogram */}
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                        isCurrent 
                          ? 'bg-[#E5A93C] text-[#0A0D14]' 
                          : 'bg-[#1F293D] text-[#E5A93C] border border-white/[0.1]'
                      }`}>
                        {biz.monogram}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[12.5px] font-bold text-white truncate">
                          {biz.businessName}
                        </div>
                        <div className="text-[11px] text-[#94A3B8] truncate">
                          {biz.role} • {biz.category}
                        </div>
                      </div>
                    </div>

                    {/* Active Check Indicator */}
                    {isCurrent && (
                      <Check className="w-4 h-4 text-[#E5A93C] stroke-[2.5] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Add Business Shortcut */}
            <button
              onClick={() => {
                setShowIdentitySheet(false);
                triggerToast('Add business flow opened');
              }}
              className="w-full py-2.5 rounded-xl border border-dashed border-white/[0.16] hover:border-[#E5A93C]/50 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#E5A93C] hover:bg-[#E5A93C]/5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Another Business Identity</span>
            </button>

            {/* Architecture Privacy Reassurance Note (Section 7) */}
            <p className="text-[10px] text-[#64748B] text-center px-2 pt-1">
              Switching identity changes your active digital card and public representation. Your private network, notes, and tags remain securely in your account.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. ACTIVE IDENTITY MY QR MODAL (Section 12) */}
      {/* Belongs to the CURRENT ACTIVE BUSINESS IDENTITY */}
      {/* ========================================================================= */}
      {showQrModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowQrModal(false)}
        >
          <div 
            className="w-full max-w-[320px] bg-[#121722] border border-white/[0.14] rounded-2xl p-5 shadow-2xl text-center space-y-3 animate-in zoom-in-95 duration-200"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-1 border-b border-white/[0.08]">
              <div className="text-left">
                <span className="text-[10px] font-bold text-[#E5A93C] uppercase tracking-wider">
                  Active Digital Identity
                </span>
                <h3 className="text-sm font-bold text-white truncate max-w-[220px]">
                  {currentIdentity.businessName}
                </h3>
              </div>
              <button 
                onClick={() => setShowQrModal(false)}
                className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center text-[#94A3B8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* QR Card Mockup */}
            <div className="p-4 rounded-xl bg-white flex flex-col items-center justify-center shadow-inner mx-auto">
              {/* Simulated High-Res QR code pattern */}
              <div className="w-36 h-36 bg-white p-2 flex items-center justify-center">
                <QrCode className="w-32 h-32 text-[#0A0D14]" />
              </div>
              <div className="text-[10px] font-semibold text-[#0A0D14] tracking-tight mt-1 truncate max-w-[200px]">
                {userFullName} • {currentIdentity.role}
              </div>
            </div>

            <p className="text-[11px] text-[#94A3B8]">
              Scan to save {userFirstName}'s verified card for{' '}
              <strong className="text-white">{currentIdentity.businessName}</strong>.
            </p>

            <button
              onClick={() => {
                setShowQrModal(false);
                triggerToast('Identity QR link copied to clipboard');
              }}
              className="w-full py-2.5 rounded-xl bg-[#E5A93C] hover:bg-[#D49629] text-[#0A0D14] font-semibold text-xs transition-colors"
            >
              Share QR Link
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
