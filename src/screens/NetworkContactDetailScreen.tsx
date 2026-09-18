import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Star,
  MoreVertical,
  Phone,
  Mail,
  Globe,
  MessageSquare,
  CheckCircle2,
  Copy,
  Clock,
  Calendar,
  Tag as TagIcon,
  Plus,
  X,
  Edit2,
  Lock,
  ExternalLink,
  Building2,
  User,
  Search,
  AlertCircle,
  Sparkles,
  Sliders,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ScanLine,
  Home as HomeIcon,
  Users,
  ShieldCheck,
  RefreshCw,
  FileText
} from 'lucide-react';
import { DESIGN_TOKENS } from '../design-system/tokens';

export interface NetworkContactDetailData {
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
  dateAdded: string; // formatted e.g., "Sep 17, 2026"
  isRegistered: boolean; // Type A vs Type B
  isFavorite: boolean;
  businessId?: string;
  personId?: string;
  
  // Professional Contact Information
  phone?: string;
  secondaryPhone?: string;
  hasWhatsApp?: boolean;
  email?: string;
  secondaryEmail?: string;
  website?: string;
  address?: string;

  // Private Information (Owned 100% by Shravani)
  tags: string[];
  privateNote?: string;
  followUp?: {
    date: string; // e.g., "Sep 21, 2026"
    time?: string;
    note: string; // e.g., "Send product catalogue"
    status: 'today' | 'upcoming' | 'overdue' | 'completed';
  } | null;

  // Scanned Card Artifacts (Type B only)
  scannedCard?: {
    frontImageUrl?: string | null;
    capturedAt?: string;
    ocrQuality?: 'high' | 'medium';
    possiblePlatformMatch?: {
      personName: string;
      businessName: string;
      designation: string;
      city: string;
    } | null;
  } | null;
}

interface NetworkContactDetailScreenProps {
  contactId?: string;
  onBack: () => void;
  onNavigateToHome?: () => void;
  onNavigateToSearch?: () => void;
  onNavigateToScan?: (mode?: 'card' | 'qr') => void;
  onOpenPublicProfile?: (personId: string) => void;
  onOpenBusinessProfile?: (businessId: string) => void;
  onRemoveFromNetwork?: (contactId: string) => void;
  isLargeTextMode?: boolean;
}

export const NetworkContactDetailScreen: React.FC<NetworkContactDetailScreenProps> = ({
  contactId = 'net-rahul-abc',
  onBack,
  onNavigateToHome,
  onNavigateToSearch,
  onNavigateToScan,
  onOpenPublicProfile,
  onOpenBusinessProfile,
  onRemoveFromNetwork,
  isLargeTextMode = false
}) => {
  // Prototype Scenarios for Verification
  type ScenarioType =
    | 'default-rahul-abc' // TYPE A: Rahul Patil @ ABC Manufacturing (Registered, Search)
    | 'arjun-scanned'     // TYPE B: Arjun Deshmukh @ Vertex (Scanned Card, OCR Editable)
    | 'shravani-qr'       // QR Scanned: Shravani Pasnur @ Aikyam AI Systems (Registered, QR Source)
    | 'rahul-nexa'        // Multi-Identity: Rahul Patil @ Nexa Consulting (Independent Private Context)
    | 'missing-contacts'  // Missing Phone/Email/Website reflow test
    | 'overdue-followup'  // Overdue follow-up state
    | 'completed-followup'// Completed follow-up state
    | 'devanagari'        // Marathi note/tags testing
    | 'loading'           // Skeleton loading state
    | 'error';            // Contact load error state

  const [scenario, setScenario] = useState<ScenarioType>(
    contactId === 'net-shravani-aikyam'
      ? 'shravani-qr'
      : contactId === 'net-arjun-vertex'
      ? 'arjun-scanned'
      : 'default-rahul-abc'
  );
  const [showInspector, setShowInspector] = useState<boolean>(false);

  // PRESET DATASETS
  const presetContacts: Record<string, NetworkContactDetailData> = {
    'shravani-qr': {
      id: 'net-shravani-aikyam',
      personName: 'Shravani Pasnur',
      initials: 'SP',
      avatarColor: '#E5A93C',
      designation: 'Software Engineer',
      businessName: 'Aikyam AI Systems',
      category: 'Technology',
      city: 'Solapur',
      state: 'Maharashtra',
      source: 'QR',
      dateAdded: 'Sep 17, 2026',
      isRegistered: true,
      isFavorite: false,
      businessId: 'biz-id-aikyam',
      personId: 'person-shravani-pasnur',
      phone: '+91 98765 43210',
      hasWhatsApp: true,
      email: 'shravani@aikyam.ai',
      website: 'aikyam.ai',
      address: 'Plot 18, IT Park, Solapur, Maharashtra',
      tags: ['Tech Partner'],
      privateNote: 'Scanned QR code during networking session.',
      followUp: null
    },
    'default-rahul-abc': {
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
      dateAdded: 'Sep 17, 2026',
      isRegistered: true,
      isFavorite: true,
      businessId: 'biz-id-abc',
      personId: 'person-rahul-patil',
      phone: '+91 98220 12345',
      hasWhatsApp: true,
      email: 'rahul@abcmanufacturing.in',
      website: 'abcmanufacturing.in',
      address: 'Plot 42, MIDC Chincholi, Solapur, Maharashtra',
      tags: ['Supplier'],
      privateNote: 'Met at the Saturday Club meeting. Interested in discussing packaging requirements.',
      followUp: {
        date: 'Sep 21, 2026',
        time: '11:00 AM',
        note: 'Send product catalogue',
        status: 'upcoming'
      }
    },
    'arjun-scanned': {
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
      dateAdded: 'Sep 14, 2026',
      isRegistered: false, // Scanned card, private OCR copy
      isFavorite: false,
      phone: '+91 98220 45871',
      secondaryPhone: '+91 20 2740 8899',
      hasWhatsApp: true,
      email: 'arjun@vertexindustrial.in',
      website: 'vertexindustrial.in',
      address: 'Sector 10, Bhosari Industrial Area, Pune 411026',
      tags: ['Potential Client'],
      privateNote: 'Scanned business card at Pune Auto Expo. Follow up for industrial conveyor quotation.',
      followUp: null,
      scannedCard: {
        frontImageUrl: '/assets/cards/vertex-card.png',
        capturedAt: 'Sep 14, 2026 at 2:30 PM',
        ocrQuality: 'high',
        possiblePlatformMatch: {
          personName: 'Arjun Deshmukh',
          businessName: 'Vertex Industrial Solutions',
          designation: 'Sales Manager',
          city: 'Pune'
        }
      }
    },
    'rahul-nexa': {
      id: 'net-rahul-nexa',
      personName: 'Rahul Patil',
      initials: 'RP',
      avatarColor: '#10B981',
      designation: 'Managing Partner',
      businessName: 'Nexa Consulting',
      category: 'Management & IT Consulting',
      city: 'Pune',
      state: 'Maharashtra',
      source: 'Search',
      dateAdded: 'Sep 10, 2026',
      isRegistered: true,
      isFavorite: false,
      businessId: 'biz-id-nexa',
      personId: 'person-rahul-patil',
      phone: '+91 98221 98765',
      hasWhatsApp: true,
      email: 'rahul.patil@nexaconsulting.in',
      website: 'nexaconsulting.in',
      address: 'Pride Icon, Tower B, Senapati Bapat Road, Pune',
      tags: ['Partner', 'Consulting'],
      privateNote: 'Met during Pune Tech Leadership roundtable. Discussing digital advisory for SME export compliance.',
      followUp: {
        date: 'Oct 02, 2026',
        time: '3:30 PM',
        note: 'Review draft consulting engagement proposal',
        status: 'upcoming'
      }
    },
    'missing-contacts': {
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
      dateAdded: 'Sep 05, 2026',
      isRegistered: true,
      isFavorite: false,
      businessId: 'biz-id-blueprint',
      personId: 'person-anita-sen',
      phone: undefined, // No phone provided
      hasWhatsApp: false,
      email: 'anita@studioblueprint.in',
      website: undefined, // No website provided
      address: 'Old Employment Chowk, Solapur',
      tags: ['Vendor'],
      privateNote: 'Interior space planning for new branch office.',
      followUp: null
    },
    'overdue-followup': {
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
      dateAdded: 'Sep 08, 2026',
      isRegistered: false,
      isFavorite: false,
      phone: '+91 98200 11223',
      hasWhatsApp: true,
      email: 'v.joshi@apexlogistics.in',
      website: 'apexlogistics.in',
      address: 'Bandra Kurla Complex, Mumbai',
      tags: ['Supplier', 'Logistics'],
      privateNote: 'Card scanned at warehousing summit. Multi-hub distribution partner.',
      followUp: {
        date: 'Sep 15, 2026', // Past date
        note: 'Call regarding freight rates for Solapur-JNPT corridor',
        status: 'overdue'
      },
      scannedCard: {
        frontImageUrl: null, // Test fallback unavailable image
        capturedAt: 'Sep 08, 2026',
        ocrQuality: 'high'
      }
    },
    'completed-followup': {
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
      dateAdded: 'Sep 17, 2026',
      isRegistered: true,
      isFavorite: true,
      businessId: 'biz-id-abc',
      personId: 'person-rahul-patil',
      phone: '+91 98220 12345',
      hasWhatsApp: true,
      email: 'rahul@abcmanufacturing.in',
      website: 'abcmanufacturing.in',
      address: 'Plot 42, MIDC Chincholi, Solapur',
      tags: ['Supplier'],
      privateNote: 'Met at the Saturday Club meeting. Interested in discussing packaging requirements.',
      followUp: {
        date: 'Sep 17, 2026',
        note: 'Initial WhatsApp outreach sent with business intro',
        status: 'completed'
      }
    },
    'devanagari': {
      id: 'net-rahul-abc',
      personName: 'राहुल पाटील',
      initials: 'RP',
      avatarColor: '#E5A93C',
      designation: 'संस्थापक व मालक',
      businessName: 'एबीसी मॅन्युफॅक्चरिंग',
      category: 'मॅन्युफॅक्चरिंग व फॅब्रिकेशन',
      city: 'सोलापूर',
      state: 'महाराष्ट्र',
      source: 'Search',
      dateAdded: '१७ सप्टेंबर २०२६',
      isRegistered: true,
      isFavorite: true,
      businessId: 'biz-id-abc',
      personId: 'person-rahul-patil',
      phone: '+91 98220 12345',
      hasWhatsApp: true,
      email: 'rahul@abcmanufacturing.in',
      website: 'abcmanufacturing.in',
      address: 'प्लॉट क्र. ४२, एमआयडीसी चिंचोळी, सोलापूर',
      tags: ['पुरवठादार (Supplier)'],
      privateNote: 'शनिवारी शनिवार क्लबच्या बैठकीत भेट झाली. पॅकेजिंग साहित्याबद्दल चर्चा करायची आहे.',
      followUp: {
        date: '२१ सप्टेंबर २०२६',
        note: 'उत्पादन कॅटलॉग पाठवणे व दरपत्रक विचारणे',
        status: 'upcoming'
      }
    }
  };

  // Active contact state (cloned from preset to allow real interactive editing)
  const [currentContact, setCurrentContact] = useState<NetworkContactDetailData>(
    presetContacts[scenario] || presetContacts['default-rahul-abc']
  );

  // UI state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showOverflowMenu, setShowOverflowMenu] = useState<boolean>(false);
  const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState<boolean>(false);
  const [showAddTagSheet, setShowAddTagSheet] = useState<boolean>(false);
  const [tagInputSearch, setTagInputSearch] = useState<string>('');
  const [showFollowUpModal, setShowFollowUpModal] = useState<boolean>(false);
  const [followUpDateInput, setFollowUpDateInput] = useState<string>('2026-09-21');
  const [followUpTimeInput, setFollowUpTimeInput] = useState<string>('11:00');
  const [followUpNoteInput, setFollowUpNoteInput] = useState<string>('');
  const [followUpJustCompleted, setFollowUpJustCompleted] = useState<boolean>(false);
  const [showCardModal, setShowCardModal] = useState<boolean>(false);
  const [cardZoomLevel, setCardZoomLevel] = useState<number>(1);
  const [isEditingNote, setIsEditingNote] = useState<boolean>(false);
  const [noteEditDraft, setNoteEditDraft] = useState<string>('');
  const [isNoteExpanded, setIsNoteExpanded] = useState<boolean>(false);
  const [showEditContactModal, setShowEditContactModal] = useState<boolean>(false);

  // Editable Scanned Contact Fields (Arjun / Type B)
  const [editForm, setEditForm] = useState({
    personName: '',
    designation: '',
    businessName: '',
    category: '',
    city: '',
    phone: '',
    email: '',
    website: ''
  });

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Switch scenario helper
  const handleSelectScenario = (newScenario: ScenarioType) => {
    setScenario(newScenario);
    if (newScenario !== 'loading' && newScenario !== 'error') {
      const data = presetContacts[newScenario] || presetContacts['default-rahul-abc'];
      setCurrentContact(data);
      setNoteEditDraft(data.privateNote || '');
    }
  };

  // Favorite toggle (Private to Shravani)
  const handleToggleFavorite = () => {
    const nextState = !currentContact.isFavorite;
    setCurrentContact(prev => ({ ...prev, isFavorite: nextState }));
    triggerToast(nextState ? 'Added to private favorites' : 'Removed from private favorites');
  };

  // Copy helper
  const handleCopy = (text: string, label: string) => {
    try {
      navigator.clipboard.writeText(text);
      triggerToast(`${label} copied`);
    } catch {
      triggerToast(`${label} copied`);
    }
  };

  // Note save
  const handleSaveNote = () => {
    setCurrentContact(prev => ({ ...prev, privateNote: noteEditDraft }));
    setIsEditingNote(false);
    triggerToast('Private note saved');
  };

  // Remove Tag
  const handleRemoveTag = (tagToRemove: string) => {
    setCurrentContact(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tagToRemove)
    }));
    triggerToast(`Tag "${tagToRemove}" removed`);
  };

  // Add Tag
  const handleAddTag = (tagToAdd: string) => {
    const trimmed = tagToAdd.trim();
    if (!trimmed) return;
    if (currentContact.tags.includes(trimmed)) {
      triggerToast(`Tag "${trimmed}" already added`);
      return;
    }
    setCurrentContact(prev => ({
      ...prev,
      tags: [...prev.tags, trimmed]
    }));
    setTagInputSearch('');
    setShowAddTagSheet(false);
    triggerToast(`Tag "${trimmed}" added`);
  };

  // Available tag suggestions
  const suggestedTags = [
    'Supplier',
    'Potential Client',
    'Partner',
    'Vendor',
    'Met at Expo',
    'Important',
    'Solapur Cluster',
    'Follow Up Needed'
  ].filter(t => !currentContact.tags.includes(t));

  // Follow-up Mark Done
  const handleMarkFollowUpDone = () => {
    setFollowUpJustCompleted(true);
    setCurrentContact(prev => ({
      ...prev,
      followUp: prev.followUp ? { ...prev.followUp, status: 'completed' } : null
    }));
    triggerToast('Follow-up marked as completed');
    setTimeout(() => {
      setFollowUpJustCompleted(false);
    }, 3000);
  };

  // Follow-up Save
  const handleSaveFollowUp = () => {
    if (!followUpNoteInput.trim()) {
      triggerToast('Please enter a follow-up reminder');
      return;
    }
    const formattedDate = followUpDateInput
      ? new Date(followUpDateInput).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      : 'Upcoming';

    setCurrentContact(prev => ({
      ...prev,
      followUp: {
        date: formattedDate,
        time: followUpTimeInput,
        note: followUpNoteInput.trim(),
        status: 'upcoming'
      }
    }));
    setShowFollowUpModal(false);
    setFollowUpNoteInput('');
    triggerToast('Follow-up reminder set');
  };

  // Save Scanned Contact Edit
  const handleSaveScannedEdit = () => {
    setCurrentContact(prev => ({
      ...prev,
      personName: editForm.personName,
      designation: editForm.designation,
      businessName: editForm.businessName,
      category: editForm.category,
      city: editForm.city,
      phone: editForm.phone,
      email: editForm.email,
      website: editForm.website
    }));
    setShowEditContactModal(false);
    triggerToast('Contact details updated');
  };

  // Open Edit Scanned Contact
  const handleOpenEditContact = () => {
    setEditForm({
      personName: currentContact.personName,
      designation: currentContact.designation,
      businessName: currentContact.businessName,
      category: currentContact.category,
      city: currentContact.city,
      phone: currentContact.phone || '',
      email: currentContact.email || '',
      website: currentContact.website || ''
    });
    setShowEditContactModal(true);
    setShowOverflowMenu(false);
  };

  // Confirm Removal from Network
  const handleConfirmRemoval = () => {
    setShowRemoveConfirmModal(false);
    triggerToast(`Removed ${currentContact.personName.split(' ')[0]} from My Network`);
    if (onRemoveFromNetwork) {
      onRemoveFromNetwork(currentContact.id);
    }
    setTimeout(() => {
      onBack();
    }, 600);
  };

  return (
    <div
      className="relative flex flex-col h-full w-full bg-[#0A0D14] text-[#F1F5F9] font-sans antialiased select-none overflow-hidden"
      style={{
        fontSize: isLargeTextMode ? '112%' : '100%',
        lineHeight: isLargeTextMode ? 1.55 : 1.45
      }}
    >
      {/* ======================================================================= */}
      {/* PROTOTYPE INSPECTOR BAR (For Verification of Section 1–92 Specs) */}
      {/* ======================================================================= */}
      <div className="bg-[#121826] border-b border-white/[0.08] px-3.5 py-1.5 flex items-center justify-between text-[11px] text-[#94A3B8] shrink-0 z-40">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#E5A93C]" />
          <span className="font-semibold text-white">Screen 20: Contact Detail</span>
          <span className="text-[10px] text-[#64748B] hidden sm:inline">
            ({currentContact.isRegistered ? 'Type A: Registered' : 'Type B: Scanned Card'})
          </span>
        </div>
        <button
          onClick={() => setShowInspector(!showInspector)}
          className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/[0.06] hover:bg-white/[0.1] text-white text-[10.5px] font-medium transition-all"
        >
          <Sliders className="w-3 h-3 text-[#E5A93C]" />
          <span>Scenarios</span>
        </button>
      </div>

      {/* PROTOTYPE INSPECTOR DRAWER */}
      {showInspector && (
        <div className="bg-[#141B2D] border-b border-white/[0.12] p-3 text-xs space-y-2.5 z-40 shrink-0 shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between text-white font-semibold pb-1 border-b border-white/[0.08]">
            <span className="flex items-center gap-1.5 text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-[#E5A93C]" />
              Evaluation Scenarios
            </span>
            <button
              onClick={() => setShowInspector(false)}
              className="text-[#94A3B8] hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[10.5px]">
            <button
              onClick={() => handleSelectScenario('default-rahul-abc')}
              className={`p-1.5 rounded text-left border transition-all ${
                scenario === 'default-rahul-abc'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#0E131F] border-white/[0.06] text-[#94A3B8] hover:text-white'
              }`}
            >
              <div className="font-medium text-white truncate">1. Rahul @ ABC (Default)</div>
              <div className="text-[9.5px] text-[#94A3B8] truncate">Registered, Search, Follow-up</div>
            </button>

            <button
              onClick={() => handleSelectScenario('arjun-scanned')}
              className={`p-1.5 rounded text-left border transition-all ${
                scenario === 'arjun-scanned'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#0E131F] border-white/[0.06] text-[#94A3B8] hover:text-white'
              }`}
            >
              <div className="font-medium text-white truncate">2. Arjun @ Vertex (Scanned)</div>
              <div className="text-[9.5px] text-[#94A3B8] truncate">Card Scan, Original Card, OCR</div>
            </button>

            <button
              onClick={() => handleSelectScenario('shravani-qr')}
              className={`p-1.5 rounded text-left border transition-all ${
                scenario === 'shravani-qr'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#0E131F] border-white/[0.06] text-[#94A3B8] hover:text-white'
              }`}
            >
              <div className="font-medium text-white truncate">3. Shravani @ Aikyam (QR)</div>
              <div className="text-[9.5px] text-[#94A3B8] truncate">Source: QR, Platform Verified</div>
            </button>

            <button
              onClick={() => handleSelectScenario('rahul-nexa')}
              className={`p-1.5 rounded text-left border transition-all ${
                scenario === 'rahul-nexa'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#0E131F] border-white/[0.06] text-[#94A3B8] hover:text-white'
              }`}
            >
              <div className="font-medium text-white truncate">3. Rahul @ Nexa (Multi-ID)</div>
              <div className="text-[9.5px] text-[#94A3B8] truncate">Independent private context</div>
            </button>

            <button
              onClick={() => handleSelectScenario('missing-contacts')}
              className={`p-1.5 rounded text-left border transition-all ${
                scenario === 'missing-contacts'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#0E131F] border-white/[0.06] text-[#94A3B8] hover:text-white'
              }`}
            >
              <div className="font-medium text-white truncate">4. Missing Quick Actions</div>
              <div className="text-[9.5px] text-[#94A3B8] truncate">No phone/website reflow test</div>
            </button>

            <button
              onClick={() => handleSelectScenario('overdue-followup')}
              className={`p-1.5 rounded text-left border transition-all ${
                scenario === 'overdue-followup'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#0E131F] border-white/[0.06] text-[#94A3B8] hover:text-white'
              }`}
            >
              <div className="font-medium text-white truncate">5. Overdue Follow-up</div>
              <div className="text-[9.5px] text-[#94A3B8] truncate">Semantic warning highlight</div>
            </button>

            <button
              onClick={() => handleSelectScenario('completed-followup')}
              className={`p-1.5 rounded text-left border transition-all ${
                scenario === 'completed-followup'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#0E131F] border-white/[0.06] text-[#94A3B8] hover:text-white'
              }`}
            >
              <div className="font-medium text-white truncate">6. Completed Follow-up</div>
              <div className="text-[9.5px] text-[#94A3B8] truncate">Checked state + next reminder</div>
            </button>

            <button
              onClick={() => handleSelectScenario('devanagari')}
              className={`p-1.5 rounded text-left border transition-all ${
                scenario === 'devanagari'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#0E131F] border-white/[0.06] text-[#94A3B8] hover:text-white'
              }`}
            >
              <div className="font-medium text-white truncate">7. मराठी (Devanagari)</div>
              <div className="text-[9.5px] text-[#94A3B8] truncate">मराठी नोट्स व टॅग्ज</div>
            </button>

            <button
              onClick={() => setScenario('loading')}
              className={`p-1.5 rounded text-left border transition-all ${
                scenario === 'loading'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#0E131F] border-white/[0.06] text-[#94A3B8] hover:text-white'
              }`}
            >
              <div className="font-medium text-white truncate">8. Skeleton Loading</div>
              <div className="text-[9.5px] text-[#94A3B8] truncate">Section loading states</div>
            </button>

            <button
              onClick={() => setScenario('error')}
              className={`p-1.5 rounded text-left border transition-all ${
                scenario === 'error'
                  ? 'bg-[#E5A93C]/20 border-[#E5A93C] text-white font-semibold'
                  : 'bg-[#0E131F] border-white/[0.06] text-[#94A3B8] hover:text-white'
              }`}
            >
              <div className="font-medium text-white truncate">9. Network Error</div>
              <div className="text-[9.5px] text-[#94A3B8] truncate">Offline/Failure recovery</div>
            </button>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* TOP APP BAR (Section 3) */}
      {/* Back arrow, contextual Title, Favorite star, 3-dot overflow */}
      {/* ======================================================================= */}
      <header className="h-14 px-4 bg-[#0A0D14]/95 backdrop-blur-md border-b border-white/[0.06] flex items-center justify-between shrink-0 z-30 sticky top-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/[0.08] flex items-center justify-center text-[#F1F5F9] transition-all"
            aria-label="Back to My Network"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight leading-none">
              Contact
            </h1>
            <span className="text-[10px] text-[#64748B]">My Network</span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {/* Favorite Star (Section 4 - Private to Shravani) */}
          <button
            onClick={handleToggleFavorite}
            className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-all active:scale-95 ${
              currentContact.isFavorite
                ? 'bg-[#E5A93C]/15 border-[#E5A93C]/40 text-[#E5A93C]'
                : 'bg-white/[0.04] border-white/[0.08] text-[#94A3B8] hover:text-white'
            }`}
            title={currentContact.isFavorite ? 'Saved in Private Favorites' : 'Add to Private Favorites'}
            aria-label={currentContact.isFavorite ? 'Favorited' : 'Not favorited'}
          >
            <Star
              className={`w-4 h-4 ${
                currentContact.isFavorite ? 'fill-[#E5A93C] text-[#E5A93C]' : ''
              }`}
            />
          </button>

          {/* Three-Dot Overflow Menu (Section 5) */}
          <div className="relative">
            <button
              onClick={() => setShowOverflowMenu(!showOverflowMenu)}
              className="w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] active:scale-95 border border-white/[0.08] flex items-center justify-center text-[#94A3B8] hover:text-white transition-all"
              aria-label="More options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* Overflow Dropdown */}
            {showOverflowMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowOverflowMenu(false)}
                />
                <div className="absolute right-0 top-11 w-52 rounded-xl bg-[#141B2D] border border-white/[0.12] py-1.5 shadow-2xl z-50 text-xs animate-in fade-in zoom-in-95">
                  {currentContact.isRegistered ? (
                    <button
                      onClick={() => {
                        setShowOverflowMenu(false);
                        if (onOpenPublicProfile && currentContact.personId) {
                          onOpenPublicProfile(currentContact.personId);
                        } else {
                          triggerToast(`Opening public profile for ${currentContact.personName}`);
                        }
                      }}
                      className="w-full px-3.5 py-2 text-left text-white hover:bg-white/[0.06] flex items-center gap-2.5 transition-colors"
                    >
                      <User className="w-3.5 h-3.5 text-[#E5A93C]" />
                      <span>View Public Profile</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleOpenEditContact}
                      className="w-full px-3.5 py-2 text-left text-white hover:bg-white/[0.06] flex items-center gap-2.5 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>Edit Contact Details</span>
                    </button>
                  )}

                  <div className="my-1 border-t border-white/[0.08]" />

                  {/* Remove from My Network (Destructive - Section 6) */}
                  <button
                    onClick={() => {
                      setShowOverflowMenu(false);
                      setShowRemoveConfirmModal(true);
                    }}
                    className="w-full px-3.5 py-2 text-left text-[#EF4444] hover:bg-[#EF4444]/10 flex items-center gap-2.5 transition-colors"
                  >
                    <X className="w-3.5 h-3.5 text-[#EF4444]" />
                    <span>Remove from My Network</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ======================================================================= */}
      {/* MAIN SCROLLABLE CONTENT */}
      {/* ======================================================================= */}
      {scenario === 'loading' ? (
        /* SKELETON LOADING STATE (Section 71) */
        <div className="flex-1 p-4 space-y-4 animate-pulse">
          <div className="flex flex-col items-center py-6 space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.06]" />
            <div className="w-32 h-4 rounded bg-white/[0.06]" />
            <div className="w-24 h-3 rounded bg-white/[0.04]" />
            <div className="w-40 h-3 rounded bg-white/[0.04]" />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <div className="h-14 rounded-xl bg-white/[0.06]" />
            <div className="h-14 rounded-xl bg-white/[0.06]" />
            <div className="h-14 rounded-xl bg-white/[0.06]" />
            <div className="h-14 rounded-xl bg-white/[0.06]" />
          </div>
          <div className="h-32 rounded-2xl bg-white/[0.06]" />
          <div className="h-28 rounded-2xl bg-white/[0.06]" />
        </div>
      ) : scenario === 'error' ? (
        /* CONTACT LOAD FAILURE (Section 74) */
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center text-[#EF4444] mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-sm font-bold text-white mb-1">Couldn't load this contact</h2>
          <p className="text-xs text-[#94A3B8] max-w-xs mb-4">
            Please check your network connection and try again.
          </p>
          <button
            onClick={() => handleSelectScenario('default-rahul-abc')}
            className="px-4 py-2 rounded-xl bg-[#E5A93C] text-[#0A0D14] text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      ) : (
        <main
          className="flex-1 overflow-y-auto px-4 py-3 space-y-4 pb-20"
          role="main"
          aria-label="Contact Detail Workspace"
        >
          {/* ======================================================================= */}
          {/* SECTION 7: CONTACT HERO */}
          {/* Hierarchy: PERSON -> ROLE -> BUSINESS */}
          {/* ======================================================================= */}
          <section
            className="flex flex-col items-center text-center pt-2 pb-1"
            aria-label="Contact Identity"
          >
            {/* Initials Avatar */}
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-bold text-[#0A0D14] shadow-md border-2 border-white/[0.12] mb-2.5"
              style={{
                backgroundColor: currentContact.avatarColor || '#E5A93C'
              }}
            >
              {currentContact.initials}
            </div>

            {/* Person Name (Semantic Heading) */}
            <h2 className="text-base font-bold text-white tracking-tight leading-tight">
              {currentContact.personName}
            </h2>

            {/* Designation / Role */}
            <p className="text-xs font-medium text-[#E5A93C] mt-0.5">
              {currentContact.designation}
            </p>

            {/* Business Name (Tappable to Screen 18 if registered) */}
            {currentContact.isRegistered && currentContact.businessId ? (
              <button
                onClick={() => {
                  if (onOpenBusinessProfile && currentContact.businessId) {
                    onOpenBusinessProfile(currentContact.businessId);
                  } else {
                    triggerToast(`Opening business profile for ${currentContact.businessName}`);
                  }
                }}
                className="text-xs font-semibold text-white/90 hover:text-[#E5A93C] flex items-center gap-1 mt-0.5 group transition-colors"
                title="View Business Profile"
              >
                <Building2 className="w-3 h-3 text-[#94A3B8] group-hover:text-[#E5A93C] transition-colors" />
                <span>{currentContact.businessName}</span>
                <ExternalLink className="w-2.5 h-2.5 text-[#64748B] group-hover:text-[#E5A93C]" />
              </button>
            ) : (
              <div className="text-xs font-semibold text-white/90 flex items-center gap-1 mt-0.5">
                <Building2 className="w-3 h-3 text-[#94A3B8]" />
                <span>{currentContact.businessName}</span>
              </div>
            )}

            {/* Category • Location */}
            <p className="text-[11px] text-[#94A3B8] mt-0.5">
              {currentContact.category} • {currentContact.city}
            </p>

            {/* Subtle Metadata Pill: Registered Status & Source (Sections 8, 9, 10) */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
              {currentContact.isRegistered ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#182236] border border-white/[0.08] text-[10px] text-[#38BDF8] font-medium">
                  <ShieldCheck className="w-3 h-3 text-[#38BDF8]" />
                  <span>Platform profile</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#182236] border border-white/[0.08] text-[10px] text-[#A78BFA] font-medium">
                  <ScanLine className="w-3 h-3 text-[#A78BFA]" />
                  <span>Private card record</span>
                </span>
              )}

              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[10px] text-[#94A3B8]">
                Added from {currentContact.source}
              </span>

              {currentContact.dateAdded && (
                <span className="text-[10px] text-[#64748B]">
                  • {currentContact.dateAdded}
                </span>
              )}
            </div>
          </section>

          {/* ======================================================================= */}
          {/* SECTION 11, 12, 13: COMMUNICATION ACTIONS */}
          {/* Prominent compact buttons: Call, WhatsApp, Email, Website */}
          {/* Gracefully reflows if any action is missing (Sections 56, 57, 58) */}
          {/* ======================================================================= */}
          <section className="pt-1" aria-label="Quick Communication Actions">
            <div className="grid grid-cols-4 gap-2">
              {/* Call */}
              {currentContact.phone ? (
                <button
                  onClick={() => triggerToast(`Dialing ${currentContact.phone}...`)}
                  className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-[#141B2D] border border-white/[0.08] hover:border-[#E5A93C]/40 text-white hover:text-[#E5A93C] transition-all active:scale-95 group shadow-xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#E5A93C]/10 border border-[#E5A93C]/20 flex items-center justify-center text-[#E5A93C] group-hover:bg-[#E5A93C] group-hover:text-[#0A0D14] transition-all">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10.5px] font-semibold">Call</span>
                </button>
              ) : null}

              {/* WhatsApp */}
              {currentContact.phone && currentContact.hasWhatsApp !== false ? (
                <button
                  onClick={() => triggerToast(`Opening WhatsApp chat with ${currentContact.phone}...`)}
                  className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-[#141B2D] border border-white/[0.08] hover:border-[#10B981]/40 text-white hover:text-[#10B981] transition-all active:scale-95 group shadow-xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981] group-hover:bg-[#10B981] group-hover:text-[#0A0D14] transition-all">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10.5px] font-semibold">WhatsApp</span>
                </button>
              ) : null}

              {/* Email */}
              {currentContact.email ? (
                <button
                  onClick={() => triggerToast(`Opening email composer to ${currentContact.email}...`)}
                  className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-[#141B2D] border border-white/[0.08] hover:border-[#38BDF8]/40 text-white hover:text-[#38BDF8] transition-all active:scale-95 group shadow-xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#38BDF8]/10 border border-[#38BDF8]/20 flex items-center justify-center text-[#38BDF8] group-hover:bg-[#38BDF8] group-hover:text-[#0A0D14] transition-all">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10.5px] font-semibold">Email</span>
                </button>
              ) : null}

              {/* Website */}
              {currentContact.website ? (
                <button
                  onClick={() => triggerToast(`Opening ${currentContact.website}...`)}
                  className="flex flex-col items-center justify-center gap-1 p-2 rounded-xl bg-[#141B2D] border border-white/[0.08] hover:border-white/[0.25] text-white hover:text-[#E5A93C] transition-all active:scale-95 group shadow-xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.1] flex items-center justify-center text-[#F1F5F9] group-hover:bg-white group-hover:text-[#0A0D14] transition-all">
                    <Globe className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10.5px] font-semibold">Website</span>
                </button>
              ) : null}
            </div>
          </section>

          {/* ======================================================================= */}
          {/* POSSIBLE REGISTERED MATCH (Section 49, 50 - Scanned Arjun variant) */}
          {/* Subtle candidate indicator; NEVER silently merged */}
          {/* ======================================================================= */}
          {!currentContact.isRegistered && currentContact.scannedCard?.possiblePlatformMatch && (
            <div className="p-3 rounded-xl bg-[#18233C] border border-[#38BDF8]/30 flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#38BDF8] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-white">Possible platform profile found</div>
                  <p className="text-[10.5px] text-[#94A3B8] mt-0.5 leading-snug">
                    Matches "{currentContact.scannedCard.possiblePlatformMatch.personName}" at {currentContact.scannedCard.possiblePlatformMatch.businessName} on the platform.
                  </p>
                </div>
              </div>
              <button
                onClick={() => triggerToast('Link profile preview (Requires user approval - never merged silently)')}
                className="px-2.5 py-1 rounded-lg bg-[#38BDF8]/15 hover:bg-[#38BDF8]/25 text-[#38BDF8] border border-[#38BDF8]/30 text-[10.5px] font-semibold shrink-0 transition-all active:scale-95"
              >
                Review
              </button>
            </div>
          )}

          {/* ======================================================================= */}
          {/* SECTION 14: CONTACT INFORMATION */}
          {/* Professional contact details; Copy feedback */}
          {/* ======================================================================= */}
          <section
            className="p-3.5 rounded-2xl bg-[#121722] border border-white/[0.07] space-y-3 shadow-xs"
            aria-label="Professional Contact Details"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Contact Details
              </h3>
              {/* If Scanned (Type B): Edit Contact (Section 41, 43) */}
              {!currentContact.isRegistered ? (
                <button
                  onClick={handleOpenEditContact}
                  className="text-[11px] font-semibold text-[#38BDF8] hover:underline flex items-center gap-1"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit Details</span>
                </button>
              ) : null}
            </div>

            <div className="space-y-2.5 text-xs">
              {/* Phone */}
              {currentContact.phone ? (
                <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
                  <div>
                    <div className="text-[10px] text-[#64748B]">Business Phone</div>
                    <div className="text-white font-medium text-xs mt-0.5">{currentContact.phone}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(currentContact.phone!, 'Phone number')}
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#94A3B8] hover:text-white transition-all active:scale-90"
                    title="Copy phone"
                    aria-label="Copy phone"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : null}

              {/* Secondary Phone if available */}
              {currentContact.secondaryPhone ? (
                <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
                  <div>
                    <div className="text-[10px] text-[#64748B]">Office Landline</div>
                    <div className="text-white font-medium text-xs mt-0.5">{currentContact.secondaryPhone}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(currentContact.secondaryPhone!, 'Secondary phone')}
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#94A3B8] hover:text-white transition-all active:scale-90"
                    title="Copy secondary phone"
                    aria-label="Copy secondary phone"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : null}

              {/* Email */}
              {currentContact.email ? (
                <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
                  <div>
                    <div className="text-[10px] text-[#64748B]">Business Email</div>
                    <div className="text-white font-medium text-xs mt-0.5">{currentContact.email}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(currentContact.email!, 'Email address')}
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#94A3B8] hover:text-white transition-all active:scale-90"
                    title="Copy email"
                    aria-label="Copy email"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : null}

              {/* Website */}
              {currentContact.website ? (
                <div className="flex items-center justify-between py-1 border-b border-white/[0.04]">
                  <div>
                    <div className="text-[10px] text-[#64748B]">Website</div>
                    <a
                      href={`https://${currentContact.website}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#38BDF8] hover:underline font-medium text-xs mt-0.5 flex items-center gap-1"
                    >
                      <span>{currentContact.website}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                  <button
                    onClick={() => handleCopy(currentContact.website!, 'Website link')}
                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#94A3B8] hover:text-white transition-all active:scale-90"
                    title="Copy website"
                    aria-label="Copy website"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : null}

              {/* Location / Address */}
              <div className="py-1">
                <div className="text-[10px] text-[#64748B]">Location</div>
                <div className="text-white font-medium text-xs mt-0.5">
                  {currentContact.address || `${currentContact.city}, ${currentContact.state}`}
                </div>
              </div>
            </div>

            {/* Public Profile Shortcut (Section 17, 66 - for Registered only) */}
            {currentContact.isRegistered && currentContact.personId && (
              <div className="pt-2 border-t border-white/[0.06]">
                <button
                  onClick={() => {
                    if (onOpenPublicProfile && currentContact.personId) {
                      onOpenPublicProfile(currentContact.personId);
                    } else {
                      triggerToast(`Viewing ${currentContact.personName}'s Public Profile`);
                    }
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/[0.08] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all active:scale-[0.99]"
                >
                  <User className="w-3.5 h-3.5 text-[#E5A93C]" />
                  <span>View Public Profile</span>
                </button>
              </div>
            )}
          </section>

          {/* ======================================================================= */}
          {/* SECTION 19, 20: PUBLIC VS PRIVATE WORKSPACE DIVISION */}
          {/* Header with subtle privacy badge: "Only you can see this" */}
          {/* ======================================================================= */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#E5A93C]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                My Private Information
              </h3>
            </div>
            <span className="text-[10px] text-[#64748B] flex items-center gap-1">
              Only you can see this
            </span>
          </div>

          {/* ======================================================================= */}
          {/* SECTION 29–36, 86: FOLLOW-UP SECTION (PROMINENT!) */}
          {/* Must be prominent, not buried below long notes */}
          {/* ======================================================================= */}
          <section
            className="p-3.5 rounded-2xl bg-[#121722] border border-white/[0.07] space-y-2.5 shadow-xs"
            aria-label="Private Follow-up"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#E5A93C]" />
                <h4 className="text-xs font-bold text-white">Follow-up</h4>
              </div>

              {currentContact.followUp && currentContact.followUp.status !== 'completed' ? (
                <button
                  onClick={() => {
                    setFollowUpNoteInput(currentContact.followUp?.note || '');
                    setShowFollowUpModal(true);
                  }}
                  className="text-[11px] font-semibold text-[#E5A93C] hover:underline"
                >
                  Edit
                </button>
              ) : null}
            </div>

            {currentContact.followUp ? (
              <div
                className={`p-3 rounded-xl border transition-all ${
                  currentContact.followUp.status === 'completed'
                    ? 'bg-[#10B981]/10 border-[#10B981]/25'
                    : currentContact.followUp.status === 'overdue'
                    ? 'bg-[#EF4444]/10 border-[#EF4444]/30'
                    : 'bg-[#182030] border-white/[0.08]'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {currentContact.followUp.date}
                      </span>
                      {currentContact.followUp.time && (
                        <span className="text-[10px] text-[#94A3B8]">
                          • {currentContact.followUp.time}
                        </span>
                      )}

                      {/* Status Badge */}
                      {currentContact.followUp.status === 'completed' ? (
                        <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>Done</span>
                        </span>
                      ) : currentContact.followUp.status === 'overdue' ? (
                        <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-[#EF4444]/20 text-[#EF4444] border border-[#EF4444]/30">
                          Overdue
                        </span>
                      ) : (
                        <span className="px-1.5 py-0.5 rounded text-[9.5px] font-bold bg-[#E5A93C]/20 text-[#E5A93C] border border-[#E5A93C]/30">
                          Upcoming
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-[#F1F5F9] leading-snug">
                      "{currentContact.followUp.note}"
                    </p>
                  </div>
                </div>

                {/* Actions: Mark Done / Add Next */}
                <div className="pt-2.5 mt-2 border-t border-white/[0.08] flex items-center justify-between">
                  {currentContact.followUp.status !== 'completed' ? (
                    <button
                      onClick={handleMarkFollowUpDone}
                      className="px-3 py-1.5 rounded-lg bg-[#10B981] hover:bg-[#059669] text-[#0A0D14] text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Done</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-[#10B981] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Follow-up completed</span>
                    </div>
                  )}

                  {/* Add next follow up */}
                  {currentContact.followUp.status === 'completed' && (
                    <button
                      onClick={() => {
                        setFollowUpNoteInput('');
                        setShowFollowUpModal(true);
                      }}
                      className="text-xs font-semibold text-[#E5A93C] hover:underline flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Next Follow-up</span>
                    </button>
                  )}
                </div>
              </div>
            ) : (
              /* Empty Follow-up State (Section 31) */
              <div className="p-3 rounded-xl bg-[#141B2A] border border-white/[0.06] flex items-center justify-between">
                <span className="text-xs text-[#94A3B8]">No active reminder</span>
                <button
                  onClick={() => {
                    setFollowUpNoteInput('');
                    setShowFollowUpModal(true);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-[#E5A93C]/15 hover:bg-[#E5A93C]/25 text-[#E5A93C] border border-[#E5A93C]/30 text-xs font-semibold flex items-center gap-1 transition-all active:scale-95"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Follow-up</span>
                </button>
              </div>
            )}
          </section>

          {/* ======================================================================= */}
          {/* SECTION 21–24: PRIVATE NOTE */}
          {/* Multiline, inline edit, read more toggle, 100% private */}
          {/* ======================================================================= */}
          <section
            className="p-3.5 rounded-2xl bg-[#121722] border border-white/[0.07] space-y-2 shadow-xs"
            aria-label="Private Notes"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#E5A93C]" />
                <h4 className="text-xs font-bold text-white">Private Note</h4>
              </div>

              {!isEditingNote && currentContact.privateNote && (
                <button
                  onClick={() => {
                    setNoteEditDraft(currentContact.privateNote || '');
                    setIsEditingNote(true);
                  }}
                  className="text-[11px] font-semibold text-[#E5A93C] hover:underline"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditingNote ? (
              /* Inline Note Editor (Section 22) */
              <div className="space-y-2 pt-1">
                <textarea
                  value={noteEditDraft}
                  onChange={e => setNoteEditDraft(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl bg-[#0E131F] border border-white/[0.15] focus:border-[#E5A93C] p-2.5 text-xs text-white placeholder-[#64748B] focus:outline-hidden transition-all resize-none"
                  placeholder="Keep context you'll want to remember..."
                  autoFocus
                />
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => setIsEditingNote(false)}
                    className="px-3 py-1.5 rounded-lg bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-medium transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveNote}
                    className="px-3.5 py-1.5 rounded-lg bg-[#E5A93C] text-[#0A0D14] text-xs font-bold transition-all shadow-xs active:scale-95"
                  >
                    Save Note
                  </button>
                </div>
              </div>
            ) : currentContact.privateNote ? (
              /* Note Display (with Read More if long) */
              <div className="space-y-1.5">
                <p
                  className={`text-xs text-[#E2E8F0] leading-relaxed whitespace-pre-line ${
                    !isNoteExpanded && currentContact.privateNote.length > 140
                      ? 'line-clamp-3'
                      : ''
                  }`}
                >
                  {currentContact.privateNote}
                </p>
                {currentContact.privateNote.length > 140 && (
                  <button
                    onClick={() => setIsNoteExpanded(!isNoteExpanded)}
                    className="text-[11px] font-semibold text-[#E5A93C] hover:underline"
                  >
                    {isNoteExpanded ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>
            ) : (
              /* Empty Note State (Section 23) */
              <div className="p-3 rounded-xl bg-[#141B2A] border border-white/[0.06] flex items-center justify-between">
                <div>
                  <div className="text-xs text-white font-medium">Add a private note</div>
                  <div className="text-[10px] text-[#64748B]">Keep context you'll want to remember.</div>
                </div>
                <button
                  onClick={() => {
                    setNoteEditDraft('');
                    setIsEditingNote(true);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-[#E5A93C]/15 hover:bg-[#E5A93C]/25 text-[#E5A93C] border border-[#E5A93C]/30 text-xs font-semibold flex items-center gap-1 transition-all active:scale-95"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Note</span>
                </button>
              </div>
            )}
          </section>

          {/* ======================================================================= */}
          {/* SECTION 25–28: TAGS */}
          {/* Private chips; Add Tag sheet; No duplicates */}
          {/* ======================================================================= */}
          <section
            className="p-3.5 rounded-2xl bg-[#121722] border border-white/[0.07] space-y-2.5 shadow-xs"
            aria-label="Private Tags"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <TagIcon className="w-3.5 h-3.5 text-[#E5A93C]" />
                <h4 className="text-xs font-bold text-white">Tags</h4>
              </div>
              <button
                onClick={() => setShowAddTagSheet(true)}
                className="text-[11px] font-semibold text-[#E5A93C] hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Tag</span>
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {currentContact.tags.length > 0 ? (
                currentContact.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#182030] text-white border border-white/[0.1] text-xs font-medium group"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="text-[#64748B] hover:text-[#EF4444] transition-colors"
                      title={`Remove tag ${tag}`}
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))
              ) : (
                <span className="text-xs text-[#64748B]">No tags assigned</span>
              )}
            </div>
          </section>

          {/* ======================================================================= */}
          {/* SECTION 44–48: ORIGINAL BUSINESS CARD (Scanned Contacts only - Arjun) */}
          {/* Compact thumbnail preview; Full-screen viewer modal */}
          {/* ======================================================================= */}
          {!currentContact.isRegistered && (
            <section
              className="p-3.5 rounded-2xl bg-[#121722] border border-white/[0.07] space-y-2.5 shadow-xs"
              aria-label="Original Scanned Business Card"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <ScanLine className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <h4 className="text-xs font-bold text-white">Original Business Card</h4>
                </div>
                {currentContact.scannedCard?.frontImageUrl && (
                  <button
                    onClick={() => setShowCardModal(true)}
                    className="text-[11px] font-semibold text-[#38BDF8] hover:underline flex items-center gap-1"
                  >
                    <Maximize2 className="w-3 h-3" />
                    <span>View Card</span>
                  </button>
                )}
              </div>

              {currentContact.scannedCard?.frontImageUrl ? (
                /* Compact Card Thumbnail */
                <div
                  onClick={() => setShowCardModal(true)}
                  className="relative rounded-xl overflow-hidden border border-white/[0.12] bg-[#0E1422] p-3 cursor-pointer group hover:border-[#38BDF8]/40 transition-all shadow-md"
                >
                  <div className="w-full h-24 rounded-lg bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#020617] border border-white/[0.08] p-3 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-[11px] font-bold text-white tracking-wide">
                          {currentContact.personName}
                        </div>
                        <div className="text-[9.5px] text-[#38BDF8]">
                          {currentContact.designation}
                        </div>
                      </div>
                      <div className="px-1.5 py-0.5 rounded bg-white/[0.08] text-[8.5px] text-white/70 font-mono">
                        VERTEX
                      </div>
                    </div>

                    <div className="flex justify-between items-end text-[8.5px] text-[#94A3B8]">
                      <div>
                        <div>{currentContact.phone}</div>
                        <div>{currentContact.email}</div>
                      </div>
                      <div className="font-semibold text-white/80">
                        {currentContact.businessName}
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-[#38BDF8]/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                      <span className="px-2.5 py-1 rounded-md bg-[#0A0D14]/90 text-[#38BDF8] text-[10px] font-bold flex items-center gap-1 border border-[#38BDF8]/30">
                        <ZoomIn className="w-3 h-3" /> Tap to enlarge
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#64748B] mt-2 px-0.5">
                    <span>Captured on physical card scanner</span>
                    <span>OCR: High confidence</span>
                  </div>
                </div>
              ) : (
                /* Card Image Unavailable Fallback (Section 47) */
                <div className="p-3 rounded-xl bg-[#141B2A] border border-white/[0.06] text-center text-xs text-[#64748B]">
                  Card image unavailable. Contact details remain fully preserved.
                </div>
              )}
            </section>
          )}

          {/* Bottom spacer for comfortable scroll above navigation */}
          <div className="h-6" />
        </main>
      )}

      {/* ======================================================================= */}
      {/* PERSISTENT BOTTOM NAVIGATION (Section 82) */}
      {/* My Network remains active in amber gold ● */}
      {/* ======================================================================= */}
      <footer className="bg-[#0C1017] border-t border-white/[0.08] px-4 py-2 shrink-0 z-30">
        <div className="max-w-md mx-auto grid grid-cols-5 gap-1">
          {/* Home */}
          <button
            onClick={onNavigateToHome}
            className="flex flex-col items-center justify-center py-1 text-[#64748B] hover:text-white transition-colors"
          >
            <HomeIcon className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] font-medium">Home</span>
          </button>

          {/* Search */}
          <button
            onClick={onNavigateToSearch}
            className="flex flex-col items-center justify-center py-1 text-[#64748B] hover:text-white transition-colors"
          >
            <Search className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] font-medium">Search</span>
          </button>

          {/* Scan */}
          <button
            onClick={() => onNavigateToScan && onNavigateToScan('card')}
            className="flex flex-col items-center justify-center py-1 text-[#64748B] hover:text-white transition-colors"
          >
            <div className="w-6 h-6 rounded-lg bg-white/[0.06] flex items-center justify-center mb-0.5">
              <ScanLine className="w-3.5 h-3.5" />
            </div>
            <span className="text-[10px] font-medium">Scan</span>
          </button>

          {/* My Network (ACTIVE) */}
          <button
            onClick={onBack}
            className="flex flex-col items-center justify-center py-1 text-[#E5A93C] font-semibold transition-colors"
          >
            <Users className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] flex items-center gap-1">
              <span>My Network</span>
              <span className="w-1 h-1 rounded-full bg-[#E5A93C]" />
            </span>
          </button>

          {/* Profile */}
          <button
            onClick={() => triggerToast('My Profile & QR (V2 preview)')}
            className="flex flex-col items-center justify-center py-1 text-[#64748B] hover:text-white transition-colors"
          >
            <User className="w-4 h-4 mb-0.5" />
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </footer>

      {/* ======================================================================= */}
      {/* MODAL 1: REMOVE FROM MY NETWORK CONFIRMATION (Section 6) */}
      {/* Destructive confirmation; Never says "Delete Rahul" */}
      {/* ======================================================================= */}
      {showRemoveConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-[#141B2D] border border-white/[0.14] p-4 text-left shadow-2xl space-y-3 animate-in zoom-in-95">
            <div className="w-10 h-10 rounded-xl bg-[#EF4444]/15 border border-[#EF4444]/30 flex items-center justify-center text-[#EF4444] mb-1">
              <X className="w-5 h-5" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">
                Remove {currentContact.personName.split(' ')[0]} from My Network?
              </h3>
              <p className="text-xs text-[#94A3B8] mt-1.5 leading-relaxed">
                Your private notes, tags, and follow-ups for this saved identity will also be removed.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.08]">
              <button
                onClick={() => setShowRemoveConfirmModal(false)}
                className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRemoval}
                className="px-4 py-2 rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white text-xs font-bold transition-all shadow-md active:scale-95"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 2: ADD / EDIT FOLLOW-UP (Section 31) */}
      {/* Date, Time, Reminder Note; Strictly private */}
      {/* ======================================================================= */}
      {showFollowUpModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-2xl bg-[#141B2D] border border-white/[0.14] p-5 text-left shadow-2xl space-y-4 animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between pb-1 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#E5A93C]" />
                <h3 className="text-sm font-bold text-white">Set Follow-up Reminder</h3>
              </div>
              <button
                onClick={() => setShowFollowUpModal(false)}
                className="text-[#94A3B8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10.5px] text-[#94A3B8] font-medium block mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={followUpDateInput}
                    onChange={e => setFollowUpDateInput(e.target.value)}
                    className="w-full rounded-xl bg-[#0E131F] border border-white/[0.1] p-2.5 text-xs text-white focus:outline-hidden focus:border-[#E5A93C]"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] text-[#94A3B8] font-medium block mb-1">
                    Time (Optional)
                  </label>
                  <input
                    type="time"
                    value={followUpTimeInput}
                    onChange={e => setFollowUpTimeInput(e.target.value)}
                    className="w-full rounded-xl bg-[#0E131F] border border-white/[0.1] p-2.5 text-xs text-white focus:outline-hidden focus:border-[#E5A93C]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10.5px] text-[#94A3B8] font-medium block mb-1">
                  Reminder Note
                </label>
                <input
                  type="text"
                  value={followUpNoteInput}
                  onChange={e => setFollowUpNoteInput(e.target.value)}
                  placeholder="e.g. Send product catalogue"
                  className="w-full rounded-xl bg-[#0E131F] border border-white/[0.1] p-2.5 text-xs text-white focus:outline-hidden focus:border-[#E5A93C]"
                />
              </div>

              <div className="p-2 rounded-lg bg-white/[0.03] text-[10.5px] text-[#64748B] flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-[#E5A93C]" />
                <span>This reminder is private and does NOT message the contact.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.08]">
              <button
                onClick={() => setShowFollowUpModal(false)}
                className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFollowUp}
                className="px-4 py-2 rounded-xl bg-[#E5A93C] text-[#0A0D14] text-xs font-bold transition-all shadow-md active:scale-95"
              >
                Save Reminder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 3: ADD TAG BOTTOM SHEET (Section 27) */}
      {/* Suggestions + Custom tag creation + Duplicate prevention */}
      {/* ======================================================================= */}
      {showAddTagSheet && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md rounded-t-3xl sm:rounded-2xl bg-[#141B2D] border border-white/[0.14] p-5 text-left shadow-2xl space-y-3.5 animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between pb-1 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <TagIcon className="w-4 h-4 text-[#E5A93C]" />
                <h3 className="text-sm font-bold text-white">Add Private Tag</h3>
              </div>
              <button
                onClick={() => setShowAddTagSheet(false)}
                className="text-[#94A3B8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Input / Search */}
            <div className="relative">
              <input
                type="text"
                value={tagInputSearch}
                onChange={e => setTagInputSearch(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleAddTag(tagInputSearch);
                }}
                placeholder="Search or create a custom tag..."
                className="w-full rounded-xl bg-[#0E131F] border border-white/[0.1] pl-3 pr-10 py-2.5 text-xs text-white placeholder-[#64748B] focus:outline-hidden focus:border-[#E5A93C]"
                autoFocus
              />
              {tagInputSearch.trim() && (
                <button
                  onClick={() => handleAddTag(tagInputSearch)}
                  className="absolute right-1.5 top-1.5 px-2 py-1 rounded-lg bg-[#E5A93C] text-[#0A0D14] text-[10.5px] font-bold"
                >
                  Add
                </button>
              )}
            </div>

            {/* Suggested Tags */}
            <div className="space-y-1.5">
              <span className="text-[10px] text-[#64748B] font-semibold uppercase tracking-wider block">
                Suggested Tags
              </span>
              <div className="flex flex-wrap gap-1.5">
                {suggestedTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleAddTag(tag)}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.06] hover:bg-[#E5A93C]/20 hover:text-[#E5A93C] border border-white/[0.08] text-xs text-[#94A3B8] transition-all flex items-center gap-1 active:scale-95"
                  >
                    <Plus className="w-3 h-3" />
                    <span>{tag}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-white/[0.08] flex justify-end">
              <button
                onClick={() => setShowAddTagSheet(false)}
                className="px-4 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 4: FULL-SCREEN ORIGINAL CARD VIEWER (Section 45) */}
      {/* Zoom + Close; Strict privacy guarantee */}
      {/* ======================================================================= */}
      {showCardModal && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in">
          {/* Top Bar */}
          <div className="w-full max-w-lg flex items-center justify-between pb-3 text-white">
            <div className="flex items-center gap-2">
              <ScanLine className="w-4 h-4 text-[#38BDF8]" />
              <span className="text-xs font-bold">Captured Business Card</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCardZoomLevel(prev => Math.max(0.8, prev - 0.2))}
                className="p-2 rounded-lg bg-white/[0.1] hover:bg-white/[0.2] text-white"
                title="Zoom out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono text-[#94A3B8]">
                {Math.round(cardZoomLevel * 100)}%
              </span>
              <button
                onClick={() => setCardZoomLevel(prev => Math.min(2.0, prev + 0.2))}
                className="p-2 rounded-lg bg-white/[0.1] hover:bg-white/[0.2] text-white"
                title="Zoom in"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setShowCardModal(false);
                  setCardZoomLevel(1);
                }}
                className="p-2 rounded-lg bg-white/[0.1] hover:bg-white/[0.2] text-white ml-2"
                title="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Interactive Card Canvas */}
          <div className="w-full max-w-lg overflow-auto flex items-center justify-center p-4 bg-[#0A0D14] rounded-2xl border border-white/[0.1]">
            <div
              className="w-full aspect-[1.75/1] rounded-xl bg-gradient-to-br from-[#1E293B] via-[#0F172A] to-[#020617] border border-white/[0.15] p-6 flex flex-col justify-between shadow-2xl transition-transform duration-200"
              style={{
                transform: `scale(${cardZoomLevel})`,
                transformOrigin: 'center center'
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-lg font-bold text-white tracking-wider">
                    {currentContact.personName}
                  </div>
                  <div className="text-xs font-medium text-[#38BDF8] mt-0.5">
                    {currentContact.designation}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-white tracking-tight">VERTEX</div>
                  <div className="text-[10px] text-[#64748B]">INDUSTRIAL SOLUTIONS</div>
                </div>
              </div>

              <div className="my-4 border-t border-white/[0.08]" />

              <div className="grid grid-cols-2 gap-3 text-[10px] text-[#94A3B8]">
                <div>
                  <div className="text-white font-medium">Direct: {currentContact.phone}</div>
                  <div>Office: {currentContact.secondaryPhone || '+91 20 2740 8899'}</div>
                  <div>Email: {currentContact.email}</div>
                </div>
                <div className="text-right">
                  <div className="text-white font-medium">{currentContact.website}</div>
                  <div>{currentContact.address || 'Bhosari Industrial Area, Pune'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 text-center text-[10.5px] text-[#64748B] flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-[#E5A93C]" />
            <span>This physical card scan is private to your account and never shared publicly.</span>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* MODAL 5: EDIT SCANNED CONTACT DETAILS (Section 41, 43 - Arjun / Type B) */}
      {/* Allows Shravani to correct extracted OCR fields */}
      {/* ======================================================================= */}
      {showEditContactModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-md max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-2xl bg-[#141B2D] border border-white/[0.14] p-5 text-left shadow-2xl space-y-3.5 animate-in slide-in-from-bottom-4">
            <div className="flex items-center justify-between pb-1 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-[#38BDF8]" />
                <h3 className="text-sm font-bold text-white">Edit Scanned Contact Details</h3>
              </div>
              <button
                onClick={() => setShowEditContactModal(false)}
                className="text-[#94A3B8] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[10.5px] text-[#94A3B8]">
              You own this private contact record extracted from the scanned card. You can correct any OCR field.
            </p>

            <div className="space-y-2.5 text-xs">
              <div>
                <label className="text-[10.5px] text-[#94A3B8] font-medium block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editForm.personName}
                  onChange={e => setEditForm({ ...editForm, personName: e.target.value })}
                  className="w-full rounded-xl bg-[#0E131F] border border-white/[0.1] p-2.5 text-xs text-white focus:outline-hidden focus:border-[#38BDF8]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10.5px] text-[#94A3B8] font-medium block mb-1">
                    Designation
                  </label>
                  <input
                    type="text"
                    value={editForm.designation}
                    onChange={e => setEditForm({ ...editForm, designation: e.target.value })}
                    className="w-full rounded-xl bg-[#0E131F] border border-white/[0.1] p-2.5 text-xs text-white focus:outline-hidden focus:border-[#38BDF8]"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] text-[#94A3B8] font-medium block mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={editForm.businessName}
                    onChange={e => setEditForm({ ...editForm, businessName: e.target.value })}
                    className="w-full rounded-xl bg-[#0E131F] border border-white/[0.1] p-2.5 text-xs text-white focus:outline-hidden focus:border-[#38BDF8]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10.5px] text-[#94A3B8] font-medium block mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={e => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full rounded-xl bg-[#0E131F] border border-white/[0.1] p-2.5 text-xs text-white focus:outline-hidden focus:border-[#38BDF8]"
                  />
                </div>
                <div>
                  <label className="text-[10.5px] text-[#94A3B8] font-medium block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={editForm.city}
                    onChange={e => setEditForm({ ...editForm, city: e.target.value })}
                    className="w-full rounded-xl bg-[#0E131F] border border-white/[0.1] p-2.5 text-xs text-white focus:outline-hidden focus:border-[#38BDF8]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10.5px] text-[#94A3B8] font-medium block mb-1">
                  Business Phone
                </label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={e => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full rounded-xl bg-[#0E131F] border border-white/[0.1] p-2.5 text-xs text-white focus:outline-hidden focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="text-[10.5px] text-[#94A3B8] font-medium block mb-1">
                  Business Email
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                  className="w-full rounded-xl bg-[#0E131F] border border-white/[0.1] p-2.5 text-xs text-white focus:outline-hidden focus:border-[#38BDF8]"
                />
              </div>

              <div>
                <label className="text-[10.5px] text-[#94A3B8] font-medium block mb-1">
                  Website
                </label>
                <input
                  type="text"
                  value={editForm.website}
                  onChange={e => setEditForm({ ...editForm, website: e.target.value })}
                  className="w-full rounded-xl bg-[#0E131F] border border-white/[0.1] p-2.5 text-xs text-white focus:outline-hidden focus:border-[#38BDF8]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/[0.08]">
              <button
                onClick={() => setShowEditContactModal(false)}
                className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/[0.1] text-white text-xs font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveScannedEdit}
                className="px-4 py-2 rounded-xl bg-[#38BDF8] text-[#0A0D14] text-xs font-bold transition-all shadow-md active:scale-95"
              >
                Save Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================================= */}
      {/* FLOATING ACTION NOTIFICATION TOAST */}
      {/* ======================================================================= */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 rounded-full bg-[#182030] text-white border border-white/[0.15] text-xs font-medium shadow-2xl flex items-center gap-1.5 animate-in fade-in zoom-in-95 pointer-events-none">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#E5A93C]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
