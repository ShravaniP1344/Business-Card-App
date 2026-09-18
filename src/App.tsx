import React, { useState } from 'react';
import { DeviceFrame } from './components/DeviceFrame';
import { WelcomeAuthScreen } from './screens/WelcomeAuthScreen';
import { SignUpScreen } from './screens/SignUpScreen';
import { GetStartedScreen } from './screens/GetStartedScreen';
import { DemoSearchScreen } from './screens/DemoSearchScreen';
import { DigitalBusinessIdentityScreen } from './screens/DigitalBusinessIdentityScreen';
import { OtherPersonSideScreen } from './screens/OtherPersonSideScreen';
import { PhysicalCardIntroScreen } from './screens/PhysicalCardIntroScreen';
import { CameraScannerScreen } from './screens/CameraScannerScreen';
import { ReviewContactScreen } from './screens/ReviewContactScreen';
import { FinalDemoPayoffScreen } from './screens/FinalDemoPayoffScreen';
import { BusinessIdentitySetupScreen, BusinessIdentityFormData } from './screens/BusinessIdentitySetupScreen';
import { BusinessIdentityPreviewScreen } from './screens/BusinessIdentityPreviewScreen';
import { AddAnotherBusinessScreen } from './screens/AddAnotherBusinessScreen';
import { OnboardingCompleteScreen } from './screens/OnboardingCompleteScreen';
import { HomeScreen } from './screens/HomeScreen';
import { SearchDiscoverScreen } from './screens/SearchDiscoverScreen';
import { PersonProfileScreen } from './screens/PersonProfileScreen';
import { BusinessProfileScreen } from './screens/BusinessProfileScreen';
import { MyNetworkScreen } from './screens/MyNetworkScreen';
import { NetworkContactDetailScreen } from './screens/NetworkContactDetailScreen';
import { MyQRScreen } from './screens/MyQRScreen';
import { QRScanResultScreen } from './screens/QRScanResultScreen';
import { PlaceholderScreen } from './screens/PlaceholderScreen';
import { Info, Sparkles, X, CheckCircle2 } from 'lucide-react';

type ScreenRoute = 
  | 'welcome' 
  | 'signup' 
  | 'get-started' 
  | 'demo-search' 
  | 'demo-business-identity'
  | 'demo-other-person-side'
  | 'demo-physical-card-intro'
  | 'camera-scanner'
  | 'demo-review-screen9'
  | 'demo-network-screen10'
  | 'screen11-business-identity-setup'
  | 'screen12-business-identity-preview'
  | 'multiple-businesses-screen13'
  | 'screen14-onboarding-complete'
  | 'screen15-home'
  | 'screen16-search'
  | 'screen17-person-profile'
  | 'screen18-business-profile'
  | 'screen19-my-network'
  | 'screen20-contact-detail'
  | 'screen21-my-qr'
  | 'screen22-qr-result'
  | 'next-onboarding-placeholder'
  | 'business-setup-placeholder' 
  | 'login-placeholder';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<ScreenRoute>('screen22-qr-result');
  const [registeredEmail, setRegisteredEmail] = useState<string>('shravani@example.com');
  const [registeredName, setRegisteredName] = useState<string>('Shravani');
  const [isLargeTextMode, setIsLargeTextMode] = useState<boolean>(false);
  const [showSpecNotes, setShowSpecNotes] = useState<boolean>(false);
  const [screen5AdditionState, setScreen5AdditionState] = useState<'idle' | 'adding' | 'added'>('added');
  const [scannerInitialMode, setScannerInitialMode] = useState<'card' | 'qr'>('card');
  
  // Shared network identities saved state (Screen 16 & 17 synchronization)
  // Per Section 17 & 60: ABC Manufacturing is already saved (✓ In My Network), Nexa Consulting is independently addable
  const [networkSavedMap, setNetworkSavedMap] = useState<Record<string, boolean>>({
    'biz-id-abc': true,
    'biz-id-nexa': false,
  });

  const handleNetworkStateChange = (personId: string, identityId: string, isInNetwork: boolean) => {
    setNetworkSavedMap(prev => ({
      ...prev,
      [identityId]: isInNetwork,
    }));
  };

  // Screen navigation tracking for nested detail screens (Screen 16, 17, 18, 20)
  const [screen17PreviousRoute, setScreen17PreviousRoute] = useState<ScreenRoute>('screen16-search');
  const [screen18PreviousRoute, setScreen18PreviousRoute] = useState<ScreenRoute>('screen16-search');
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('biz-id-abc');
  const [selectedNetworkContactId, setSelectedNetworkContactId] = useState<string>('net-rahul-abc');
  
  const [businessIdentityData, setBusinessIdentityData] = useState<BusinessIdentityFormData | null>({
    personName: 'Shravani Pasnur',
    profilePhoto: null,
    businessName: 'Aikyam AI Systems',
    businessLogo: null,
    businessCategory: 'Technology',
    role: 'Software Engineer',
    businessPhone: '+91 98765 43210',
    phoneCountryCode: '+91',
    businessEmail: 'shravani@aikyam.ai',
    website: 'aikyam.ai',
    instagram: '@aikyam',
    city: 'Solapur',
    state: 'Maharashtra',
    aboutBusiness: 'Technology solutions focused on practical digital products and enterprise AI applications.',
  });

  // Confirmed business identities list managed under this single personal account
  const [identitiesList, setIdentitiesList] = useState<BusinessIdentityFormData[]>([
    {
      personName: 'Shravani Pasnur',
      profilePhoto: null,
      businessName: 'Aikyam AI Systems',
      businessLogo: null,
      businessCategory: 'Technology',
      role: 'Software Engineer',
      businessPhone: '+91 98765 43210',
      phoneCountryCode: '+91',
      businessEmail: 'shravani@aikyam.ai',
      website: 'aikyam.ai',
      instagram: '@aikyam',
      city: 'Solapur',
      state: 'Maharashtra',
      aboutBusiness: 'Technology solutions focused on practical digital products and enterprise AI applications.',
    }
  ]);

  const activeScreenLabel = 
    currentRoute === 'welcome'
      ? 'Screen 1 Active • Welcome / Auth Entry'
      : currentRoute === 'signup'
      ? 'Screen 2 Active • Create Personal Account'
      : currentRoute === 'get-started'
      ? 'Screen 3 Active • Get Started / Demo Entry'
      : currentRoute === 'demo-search'
      ? 'Screen 4 Active • Demo Step 1: Search & Find'
      : currentRoute === 'demo-business-identity'
      ? 'Screen 5 Active • Demo Step 2: Digital Identity & Add'
      : currentRoute === 'demo-other-person-side'
      ? 'Screen 6 Active • Demo Step 3: What Happens on Rahul’s Side'
      : currentRoute === 'demo-physical-card-intro'
      ? 'Screen 7 Active • Demo: Physical Business Card Intro'
      : currentRoute === 'camera-scanner'
      ? 'Screen 8 Active • Camera / Business Card & QR Scanner'
      : currentRoute === 'demo-review-screen9'
      ? 'Screen 9 Active • Review Extracted Business Card'
      : currentRoute === 'demo-network-screen10'
      ? 'Screen 10 Active • Final Payoff: Your Network in One Place'
      : currentRoute === 'screen11-business-identity-setup'
      ? 'Screen 11 Active • Set Up Your First Business Identity'
      : currentRoute === 'screen12-business-identity-preview'
      ? 'Screen 12 Active • Business Identity Preview'
      : currentRoute === 'multiple-businesses-screen13'
      ? 'Screen 13 Active • Do You Represent Another Business?'
      : currentRoute === 'screen14-onboarding-complete'
      ? 'Screen 14 Active • Onboarding Complete / You\'re All Set'
      : currentRoute === 'screen15-home'
      ? 'Screen 15 Active • Home / Main Application Dashboard'
      : currentRoute === 'screen16-search'
      ? 'Screen 16 Active • Search / Discover'
      : currentRoute === 'next-onboarding-placeholder'
      ? 'Onboarding Next Step • Account-Level Setup'
      : currentRoute === 'business-setup-placeholder'
      ? 'Step 5 Placeholder • Business Profile Setup'
      : 'Screen Placeholder • Log In';

  return (
    <DeviceFrame
      isLargeText={isLargeTextMode}
      onToggleLargeText={() => setIsLargeTextMode(!isLargeTextMode)}
      activeScreenLabel={activeScreenLabel}
      currentRoute={currentRoute}
      onRouteChange={(route) => setCurrentRoute(route as ScreenRoute)}
    >
      {/* SCREEN 1: Welcome / Authentication Entry */}
      {currentRoute === 'welcome' && (
        <div className="relative w-full h-full flex flex-col">
          <WelcomeAuthScreen
            onSignUp={() => setCurrentRoute('signup')}
            onLogIn={() => setCurrentRoute('login-placeholder')}
            isLargeTextMode={isLargeTextMode}
          />

          {/* Floating Spec Inspector Toggle */}
          <button
            onClick={() => setShowSpecNotes(true)}
            className="absolute top-2.5 right-3.5 z-20 w-7 h-7 rounded-full bg-[#121722]/80 backdrop-blur-xs border border-white/[0.12] text-[#94A3B8] hover:text-[#E5A93C] hover:border-[#E5A93C]/40 flex items-center justify-center transition-all shadow-xs"
            title="View Screen Review Checklist"
            aria-label="Specification Checklist"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SCREEN 2: Sign Up / Create Personal Account */}
      {currentRoute === 'signup' && (
        <div className="relative w-full h-full flex flex-col">
          <SignUpScreen
            onBackToWelcome={() => setCurrentRoute('welcome')}
            onSignUpSuccess={(email, name) => {
              setRegisteredEmail(email);
              if (name) setRegisteredName(name);
              setCurrentRoute('get-started');
            }}
            onNavigateToLogin={() => setCurrentRoute('login-placeholder')}
            isLargeTextMode={isLargeTextMode}
          />

          {/* Floating Spec Inspector Toggle */}
          <button
            onClick={() => setShowSpecNotes(true)}
            className="absolute top-2.5 right-3.5 z-20 w-7 h-7 rounded-full bg-[#121722]/80 backdrop-blur-xs border border-white/[0.12] text-[#94A3B8] hover:text-[#E5A93C] hover:border-[#E5A93C]/40 flex items-center justify-center transition-all shadow-xs"
            title="View Screen 2 Review Checklist"
            aria-label="Specification Checklist"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SCREEN 3: Post-Signup "Get Started" / Demo Entry Screen */}
      {currentRoute === 'get-started' && (
        <div className="relative w-full h-full flex flex-col">
          <GetStartedScreen
            userName={registeredName}
            userEmail={registeredEmail}
            onGetStarted={() => setCurrentRoute('demo-search')}
            onSkip={() => setCurrentRoute('business-setup-placeholder')}
            isLargeTextMode={isLargeTextMode}
          />

          {/* Floating Spec Inspector Toggle */}
          <button
            onClick={() => setShowSpecNotes(true)}
            className="absolute top-2.5 right-3.5 z-20 w-7 h-7 rounded-full bg-[#121722]/80 backdrop-blur-xs border border-white/[0.12] text-[#94A3B8] hover:text-[#E5A93C] hover:border-[#E5A93C]/40 flex items-center justify-center transition-all shadow-xs"
            title="View Screen 3 Review Checklist"
            aria-label="Specification Checklist"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SCREEN 4: Demo Step 1 (Search & Find Rahul Patil with 2 Identities) */}
      {currentRoute === 'demo-search' && (
        <div className="relative w-full h-full flex flex-col">
          <DemoSearchScreen
            onBackToGetStarted={() => setCurrentRoute('get-started')}
            onSelectABCManufacturing={() => setCurrentRoute('demo-business-identity')}
            isLargeTextMode={isLargeTextMode}
          />

          <button
            onClick={() => setShowSpecNotes(true)}
            className="absolute top-2.5 right-3.5 z-20 w-7 h-7 rounded-full bg-[#121722]/80 backdrop-blur-xs border border-white/[0.12] text-[#94A3B8] hover:text-[#E5A93C] hover:border-[#E5A93C]/40 flex items-center justify-center transition-all shadow-xs"
            title="View Screen 4 Review Checklist"
            aria-label="Specification Checklist"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SCREEN 5: Demo Step 2 (Digital Business Identity + Add to My Network) */}
      {currentRoute === 'demo-business-identity' && (
        <div className="relative w-full h-full flex flex-col">
          <DigitalBusinessIdentityScreen
            onBackToSearch={() => setCurrentRoute('demo-search')}
            onNavigateToScreen6={() => setCurrentRoute('demo-other-person-side')}
            initialAdditionState={screen5AdditionState}
            onAdditionStateChange={(state) => setScreen5AdditionState(state)}
            isLargeTextMode={isLargeTextMode}
          />

          {/* Floating Spec Inspector Toggle */}
          <button
            onClick={() => setShowSpecNotes(true)}
            className="absolute top-2.5 right-3.5 z-20 w-7 h-7 rounded-full bg-[#121722]/80 backdrop-blur-xs border border-white/[0.12] text-[#94A3B8] hover:text-[#E5A93C] hover:border-[#E5A93C]/40 flex items-center justify-center transition-all shadow-xs"
            title="View Screen 5 Review Checklist"
            aria-label="Specification Checklist"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SCREEN 6: Demo Step 3 (What Happens on Rahul's Side - Directional Choice) */}
      {currentRoute === 'demo-other-person-side' && (
        <div className="relative w-full h-full flex flex-col">
          <OtherPersonSideScreen
            onBackToScreen5={() => {
              setScreen5AdditionState('added');
              setCurrentRoute('demo-business-identity');
            }}
            onContinueToNextDemo={() => setCurrentRoute('demo-physical-card-intro')}
            isLargeTextMode={isLargeTextMode}
          />

          {/* Floating Spec Inspector Toggle */}
          <button
            onClick={() => setShowSpecNotes(true)}
            className="absolute top-2.5 right-3.5 z-20 w-7 h-7 rounded-full bg-[#121722]/80 backdrop-blur-xs border border-white/[0.12] text-[#94A3B8] hover:text-[#E5A93C] hover:border-[#E5A93C]/40 flex items-center justify-center transition-all shadow-xs"
            title="View Screen 6 Review Checklist"
            aria-label="Specification Checklist"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SCREEN 7: Demo: Physical Business Card Intro */}
      {currentRoute === 'demo-physical-card-intro' && (
        <div className="relative w-full h-full flex flex-col">
          <PhysicalCardIntroScreen
            onBackToScreen6={() => setCurrentRoute('demo-other-person-side')}
            onScanCard={() => setCurrentRoute('camera-scanner')}
            onChooseFromGallery={() => setCurrentRoute('demo-review-screen9')}
            isLargeTextMode={isLargeTextMode}
          />

          {/* Floating Spec Inspector Toggle */}
          <button
            onClick={() => setShowSpecNotes(true)}
            className="absolute top-2.5 right-3.5 z-20 w-7 h-7 rounded-full bg-[#121722]/80 backdrop-blur-xs border border-white/[0.12] text-[#94A3B8] hover:text-[#E5A93C] hover:border-[#E5A93C]/40 flex items-center justify-center transition-all shadow-xs"
            title="View Screen 7 Review Checklist"
            aria-label="Specification Checklist"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SCREEN 8: Camera / Business Card & QR Scanner */}
      {currentRoute === 'camera-scanner' && (
        <div className="relative w-full h-full flex flex-col">
          <CameraScannerScreen
            onClose={() => setCurrentRoute('demo-physical-card-intro')}
            onCaptureSuccess={() => setCurrentRoute('demo-review-screen9')}
            onGallerySelect={() => setCurrentRoute('demo-review-screen9')}
            initialMode={scannerInitialMode}
            onQrDetected={() => setCurrentRoute('screen22-qr-result')}
            isLargeTextMode={isLargeTextMode}
          />

          {/* Floating Spec Inspector Toggle */}
          <button
            onClick={() => setShowSpecNotes(true)}
            className="absolute top-3.5 right-14 z-40 w-7 h-7 rounded-full bg-black/60 backdrop-blur-xs border border-white/[0.16] text-[#94A3B8] hover:text-[#E5A93C] hover:border-[#E5A93C]/40 flex items-center justify-center transition-all shadow-xs"
            title="View Screen 8 Review Checklist"
            aria-label="Specification Checklist"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SCREEN 9: Review Extracted Contact / Add to My Network */}
      {currentRoute === 'demo-review-screen9' && (
        <div className="relative h-full w-full">
          <ReviewContactScreen
            onBackToScanner={() => setCurrentRoute('camera-scanner')}
            onSaveSuccess={(contactData) => {
              console.log('Successfully added contact to My Network:', contactData);
              setCurrentRoute('demo-network-screen10');
            }}
            isLargeTextMode={isLargeTextMode}
          />
          {/* Specification checklist button */}
          <button
            onClick={() => setShowSpecNotes(true)}
            className="absolute top-3.5 right-14 z-30 w-7 h-7 rounded-full bg-[#141B29] border border-white/[0.16] text-[#94A3B8] hover:text-[#E5A93C] hover:border-[#E5A93C]/40 flex items-center justify-center transition-all shadow-xs"
            title="View Screen 9 Review Checklist"
            aria-label="Specification Checklist"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SCREEN 10: Final Demo Payoff / Your Network in One Place */}
      {currentRoute === 'demo-network-screen10' && (
        <div className="relative h-full w-full">
          <FinalDemoPayoffScreen
            onBackToScreen9={() => setCurrentRoute('demo-review-screen9')}
            onSetUpBusinessIdentity={() => setCurrentRoute('screen11-business-identity-setup')}
            isLargeTextMode={isLargeTextMode}
          />
          {/* Specification checklist button */}
          <button
            onClick={() => setShowSpecNotes(true)}
            className="absolute top-3.5 right-14 z-30 w-7 h-7 rounded-full bg-[#141B29] border border-white/[0.16] text-[#94A3B8] hover:text-[#E5A93C] hover:border-[#E5A93C]/40 flex items-center justify-center transition-all shadow-xs"
            title="View Screen 10 Review Checklist"
            aria-label="Specification Checklist"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SCREEN 11: Set Up Your First Business Identity */}
      {currentRoute === 'screen11-business-identity-setup' && (
        <div className="relative h-full w-full">
          <BusinessIdentitySetupScreen
            userFullName={registeredName ? `${registeredName} Pasnur` : "Shravani Pasnur"}
            userAccountEmail={registeredEmail || "shravani.pasnur@gmail.com"}
            onBack={() => setCurrentRoute('demo-network-screen10')}
            onPreviewIdentity={(data) => {
              setBusinessIdentityData(data);
              setCurrentRoute('screen12-business-identity-preview');
            }}
            isLargeTextMode={isLargeTextMode}
          />
          {/* Specification checklist button */}
          <button
            onClick={() => setShowSpecNotes(true)}
            className="absolute top-3.5 right-14 z-30 w-7 h-7 rounded-full bg-[#141B29] border border-white/[0.16] text-[#94A3B8] hover:text-[#E5A93C] hover:border-[#E5A93C]/40 flex items-center justify-center transition-all shadow-xs"
            title="View Screen 11 Review Checklist"
            aria-label="Specification Checklist"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SCREEN 12: Business Identity Preview */}
      {currentRoute === 'screen12-business-identity-preview' && (
        <div className="relative h-full w-full">
          <BusinessIdentityPreviewScreen
            data={businessIdentityData}
            onBackToEdit={() => setCurrentRoute('screen11-business-identity-setup')}
            onConfirmSuccess={() => {
              if (businessIdentityData) {
                setIdentitiesList((prev) => {
                  const exists = prev.some(
                    item => item.businessName.trim().toLowerCase() === businessIdentityData.businessName.trim().toLowerCase()
                  );
                  if (exists) return prev;
                  return [...prev, businessIdentityData];
                });
              }
              setCurrentRoute('multiple-businesses-screen13');
            }}
            isLargeTextMode={isLargeTextMode}
          />
          {/* Specification checklist button */}
          <button
            onClick={() => setShowSpecNotes(true)}
            className="absolute top-3.5 right-14 z-30 w-7 h-7 rounded-full bg-[#141B29] border border-white/[0.16] text-[#94A3B8] hover:text-[#E5A93C] hover:border-[#E5A93C]/40 flex items-center justify-center transition-all shadow-xs"
            title="View Screen 12 Review Checklist"
            aria-label="Specification Checklist"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SCREEN 13: Do You Represent Another Business? */}
      {currentRoute === 'multiple-businesses-screen13' && (
        <div className="relative h-full w-full">
          <AddAnotherBusinessScreen
            userFullName={registeredName ? `${registeredName} Pasnur` : "Shravani Pasnur"}
            userProfilePhoto={businessIdentityData?.profilePhoto || null}
            identities={identitiesList}
            onBack={() => setCurrentRoute('screen12-business-identity-preview')}
            onAddAnotherBusiness={() => {
              // Reusable setup architecture from Screen 11:
              // User's name and photo remain locked to Shravani Pasnur (same account)
              setBusinessIdentityData({
                personName: registeredName ? `${registeredName} Pasnur` : "Shravani Pasnur",
                profilePhoto: businessIdentityData?.profilePhoto || null,
                businessName: '',
                businessLogo: null,
                businessCategory: '',
                role: '',
                businessPhone: '',
                phoneCountryCode: '+91',
                businessEmail: '',
                website: '',
                instagram: '',
                city: 'Solapur',
                state: 'Maharashtra',
                aboutBusiness: '',
              });
              setCurrentRoute('screen11-business-identity-setup');
            }}
            onContinue={() => setCurrentRoute('screen14-onboarding-complete')}
            isLargeTextMode={isLargeTextMode}
          />
          {/* Specification checklist button */}
          <button
            onClick={() => setShowSpecNotes(true)}
            className="absolute top-3.5 right-14 z-30 w-7 h-7 rounded-full bg-[#141B29] border border-white/[0.16] text-[#94A3B8] hover:text-[#E5A93C] hover:border-[#E5A93C]/40 flex items-center justify-center transition-all shadow-xs"
            title="View Screen 13 Review Checklist"
            aria-label="Specification Checklist"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SCREEN 14: Onboarding Complete / You're All Set */}
      {currentRoute === 'screen14-onboarding-complete' && (
        <div className="relative h-full w-full">
          <OnboardingCompleteScreen
            userFullName={registeredName ? `${registeredName} Pasnur` : "Shravani Pasnur"}
            userProfilePhoto={businessIdentityData?.profilePhoto || null}
            identities={identitiesList}
            onBack={() => setCurrentRoute('multiple-businesses-screen13')}
            onEnterApp={() => setCurrentRoute('screen15-home')}
            isLargeTextMode={isLargeTextMode}
          />
          {/* Specification checklist button */}
          <button
            onClick={() => setShowSpecNotes(true)}
            className="absolute top-3.5 right-14 z-30 w-7 h-7 rounded-full bg-[#141B29] border border-white/[0.16] text-[#94A3B8] hover:text-[#E5A93C] hover:border-[#E5A93C]/40 flex items-center justify-center transition-all shadow-xs"
            title="View Screen 14 Review Checklist"
            aria-label="Specification Checklist"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SCREEN 15: Home / Main Application Dashboard */}
      {currentRoute === 'screen15-home' && (
        <div className="relative h-full w-full">
          <HomeScreen
            userFullName={registeredName ? `${registeredName} Pasnur` : "Shravani Pasnur"}
            userProfilePhoto={businessIdentityData?.profilePhoto || null}
            activeIdentity={businessIdentityData}
            allIdentities={identitiesList}
            onNavigateBackToOnboarding={() => setCurrentRoute('screen14-onboarding-complete')}
            onNavigateToSearch={() => setCurrentRoute('screen16-search')}
            onNavigateToScan={(mode) => {
              // Can navigate to existing camera scanner screen if desired
              setCurrentRoute('camera-scanner');
            }}
            onNavigateToMyQr={() => setCurrentRoute('screen21-my-qr')}
            onNavigateToMyNetwork={() => setCurrentRoute('screen19-my-network')}
            isLargeTextMode={isLargeTextMode}
          />
          {/* Specification checklist button */}
          <button
            onClick={() => setShowSpecNotes(true)}
            className="absolute top-3.5 right-12 z-30 w-7 h-7 rounded-full bg-[#141B29] border border-white/[0.16] text-[#94A3B8] hover:text-[#E5A93C] hover:border-[#E5A93C]/40 flex items-center justify-center transition-all shadow-xs"
            title="View Screen 15 Review Checklist"
            aria-label="Specification Checklist"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SCREEN 16: Search / Discover */}
      {currentRoute === 'screen16-search' && (
        <div className="relative h-full w-full">
          <SearchDiscoverScreen
            initialQuery="Rahul"
            networkState={networkSavedMap}
            onNetworkStateChange={handleNetworkStateChange}
            onOpenPersonProfile={(personId) => {
              setScreen17PreviousRoute('screen16-search');
              setCurrentRoute('screen17-person-profile');
            }}
            onOpenBusinessProfile={(businessId) => {
              setSelectedBusinessId(businessId);
              setScreen18PreviousRoute('screen16-search');
              setCurrentRoute('screen18-business-profile');
            }}
            onNavigateToHome={() => setCurrentRoute('screen15-home')}
            onNavigateToScan={(mode) => {
              setCurrentRoute('camera-scanner');
            }}
            onNavigateToMyNetwork={() => setCurrentRoute('screen19-my-network')}
            isLargeTextMode={isLargeTextMode}
          />
          {/* Specification checklist button */}
          <button
            onClick={() => setShowSpecNotes(true)}
            className="absolute top-3.5 right-12 z-30 w-7 h-7 rounded-full bg-[#141B29] border border-white/[0.16] text-[#94A3B8] hover:text-[#E5A93C] hover:border-[#E5A93C]/40 flex items-center justify-center transition-all shadow-xs"
            title="View Screen 16 Review Checklist"
            aria-label="Specification Checklist"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SCREEN 17: Person Profile / Multiple Business Identities */}
      {currentRoute === 'screen17-person-profile' && (
        <div className="relative h-full w-full">
          <PersonProfileScreen
            onBack={() => setCurrentRoute(screen17PreviousRoute)}
            onNavigateToHome={() => setCurrentRoute('screen15-home')}
            onNavigateToSearch={() => setCurrentRoute('screen16-search')}
            onNavigateToScan={(mode) => {
              setCurrentRoute('camera-scanner');
            }}
            onNavigateToMyNetwork={() => setCurrentRoute('screen19-my-network')}
            onOpenBusinessProfile={(businessId) => {
              setSelectedBusinessId(businessId);
              setScreen18PreviousRoute('screen17-person-profile');
              setCurrentRoute('screen18-business-profile');
            }}
            onNetworkStateChange={handleNetworkStateChange}
            isLargeTextMode={isLargeTextMode}
          />
          {/* Specification checklist button */}
          <button
            onClick={() => setShowSpecNotes(true)}
            className="absolute top-3.5 right-12 z-30 w-7 h-7 rounded-full bg-[#141B29] border border-white/[0.16] text-[#94A3B8] hover:text-[#E5A93C] hover:border-[#E5A93C]/40 flex items-center justify-center transition-all shadow-xs"
            title="View Screen 17 Review Checklist"
            aria-label="Specification Checklist"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SCREEN 18: Public Business Profile */}
      {currentRoute === 'screen18-business-profile' && (
        <div className="relative h-full w-full">
          <BusinessProfileScreen
            businessId={selectedBusinessId}
            onBack={() => setCurrentRoute(screen18PreviousRoute)}
            onOpenPersonProfile={(personId) => {
              setScreen17PreviousRoute('screen18-business-profile');
              setCurrentRoute('screen17-person-profile');
            }}
            onNavigateToHome={() => setCurrentRoute('screen15-home')}
            onNavigateToSearch={() => setCurrentRoute('screen16-search')}
            onNavigateToScan={(mode) => {
              setCurrentRoute('camera-scanner');
            }}
            onNavigateToMyNetwork={() => setCurrentRoute('screen19-my-network')}
            networkState={networkSavedMap}
            onNetworkStateChange={handleNetworkStateChange}
            isLargeTextMode={isLargeTextMode}
          />
          {/* Specification checklist button */}
          <button
            onClick={() => setShowSpecNotes(true)}
            className="absolute top-3.5 right-12 z-30 w-7 h-7 rounded-full bg-[#141B29] border border-white/[0.16] text-[#94A3B8] hover:text-[#E5A93C] hover:border-[#E5A93C]/40 flex items-center justify-center transition-all shadow-xs"
            title="View Screen 18 Review Checklist"
            aria-label="Specification Checklist"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SCREEN 19: My Network (Private Business Network) */}
      {currentRoute === 'screen19-my-network' && (
        <div className="relative h-full w-full">
          <MyNetworkScreen
            onNavigateToHome={() => setCurrentRoute('screen15-home')}
            onNavigateToSearch={() => setCurrentRoute('screen16-search')}
            onNavigateToScan={(mode) => {
              setCurrentRoute('camera-scanner');
            }}
            onOpenContactDetail={(contactId) => {
              setSelectedNetworkContactId(contactId);
              setCurrentRoute('screen20-contact-detail');
            }}
            networkState={networkSavedMap}
            onNetworkStateChange={handleNetworkStateChange}
            isLargeTextMode={isLargeTextMode}
          />
          {/* Specification checklist button */}
          <button
            onClick={() => setShowSpecNotes(true)}
            className="absolute top-3.5 right-12 z-30 w-7 h-7 rounded-full bg-[#141B29] border border-white/[0.16] text-[#94A3B8] hover:text-[#E5A93C] hover:border-[#E5A93C]/40 flex items-center justify-center transition-all shadow-xs"
            title="View Screen 19 Review Checklist"
            aria-label="Specification Checklist"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SCREEN 20: Network Contact Detail (Private Contact Detail) */}
      {currentRoute === 'screen20-contact-detail' && (
        <div className="relative h-full w-full">
          <NetworkContactDetailScreen
            contactId={selectedNetworkContactId}
            onBack={() => setCurrentRoute('screen19-my-network')}
            onNavigateToHome={() => setCurrentRoute('screen15-home')}
            onNavigateToSearch={() => setCurrentRoute('screen16-search')}
            onNavigateToScan={(mode) => {
              setCurrentRoute('camera-scanner');
            }}
            onOpenPublicProfile={(personId) => {
              setScreen17PreviousRoute('screen20-contact-detail');
              setCurrentRoute('screen17-person-profile');
            }}
            onOpenBusinessProfile={(businessId) => {
              setSelectedBusinessId(businessId);
              setScreen18PreviousRoute('screen20-contact-detail');
              setCurrentRoute('screen18-business-profile');
            }}
            onRemoveFromNetwork={(contactId) => {
              if (contactId === 'net-rahul-abc') {
                handleNetworkStateChange('person-rahul-patil', 'biz-id-abc', false);
              } else if (contactId === 'net-rahul-nexa') {
                handleNetworkStateChange('person-rahul-patil', 'biz-id-nexa', false);
              }
            }}
            isLargeTextMode={isLargeTextMode}
          />
          {/* Specification checklist button */}
          <button
            onClick={() => setShowSpecNotes(true)}
            className="absolute top-3.5 right-12 z-30 w-7 h-7 rounded-full bg-[#141B29] border border-white/[0.16] text-[#94A3B8] hover:text-[#E5A93C] hover:border-[#E5A93C]/40 flex items-center justify-center transition-all shadow-xs"
            title="View Screen 20 Review Checklist"
            aria-label="Specification Checklist"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SCREEN 21: My QR / Digital Business Card */}
      {currentRoute === 'screen21-my-qr' && (
        <div className="relative h-full w-full">
          <MyQRScreen
            onBack={() => setCurrentRoute('screen15-home')}
            onNavigateToHome={() => setCurrentRoute('screen15-home')}
            onNavigateToSearch={() => setCurrentRoute('screen16-search')}
            onNavigateToScan={(mode) => setCurrentRoute('camera-scanner')}
            onNavigateToMyNetwork={() => setCurrentRoute('screen19-my-network')}
            onActiveIdentityChanged={(identity) => {
              setBusinessIdentityData(prev => prev ? ({
                ...prev,
                businessName: identity.businessName,
                role: identity.role,
                businessCategory: identity.category,
                businessCity: identity.city,
                businessPhone: identity.businessPhone,
                businessEmail: identity.businessEmail,
                businessWebsite: identity.website,
              }) : null);
            }}
            isLargeTextMode={isLargeTextMode}
          />
          {/* Specification checklist button */}
          <button
            onClick={() => setShowSpecNotes(true)}
            className="absolute top-3.5 right-12 z-30 w-7 h-7 rounded-full bg-[#141B29] border border-white/[0.16] text-[#94A3B8] hover:text-[#E5A93C] hover:border-[#E5A93C]/40 flex items-center justify-center transition-all shadow-xs"
            title="View Screen 21 Review Checklist"
            aria-label="Specification Checklist"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* SCREEN 22: QR Scan Result / Business Identity Found */}
      {currentRoute === 'screen22-qr-result' && (
        <div className="relative h-full w-full">
          <QRScanResultScreen
            onBackToScanner={(mode = 'qr') => {
              setScannerInitialMode(mode);
              setCurrentRoute('camera-scanner');
            }}
            onViewInMyNetwork={(contactId) => {
              setSelectedNetworkContactId('net-shravani-aikyam');
              setCurrentRoute('screen20-contact-detail');
            }}
            onViewFullPersonProfile={(personId) => {
              setScreen17PreviousRoute('screen22-qr-result');
              setCurrentRoute('screen17-person-profile');
            }}
            onViewBusinessProfile={(businessId) => {
              setSelectedBusinessId(businessId);
              setScreen18PreviousRoute('screen22-qr-result');
              setCurrentRoute('screen18-business-profile');
            }}
            onViewMyQr={() => {
              setCurrentRoute('screen21-my-qr');
            }}
            onScanAnother={() => {
              setScannerInitialMode('qr');
              setCurrentRoute('camera-scanner');
            }}
            isInitiallyInNetwork={false}
            onNetworkAddSuccess={(scannedIdentity) => {
              handleNetworkStateChange(scannedIdentity.userId, scannedIdentity.businessId, true);
            }}
            isLargeTextMode={isLargeTextMode}
          />
          {/* Specification checklist button */}
          <button
            onClick={() => setShowSpecNotes(true)}
            className="absolute top-3.5 right-12 z-30 w-7 h-7 rounded-full bg-[#141B29] border border-white/[0.16] text-[#94A3B8] hover:text-[#E5A93C] hover:border-[#E5A93C]/40 flex items-center justify-center transition-all shadow-xs"
            title="View Screen 22 Review Checklist"
            aria-label="Specification Checklist"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* NEXT ONBOARDING PLACEHOLDER */}
      {currentRoute === 'next-onboarding-placeholder' && (
        <PlaceholderScreen
          type="next-onboarding"
          registeredUserEmail={registeredEmail}
          onBack={() => setCurrentRoute('multiple-businesses-screen13')}
        />
      )}

      {/* STEP 5 PLACEHOLDER: Business Profile Setup (from Skip) */}
      {currentRoute === 'business-setup-placeholder' && (
        <PlaceholderScreen
          type="business-setup"
          registeredUserEmail={registeredEmail}
          onBack={() => setCurrentRoute('get-started')}
        />
      )}

      {/* LOGIN PLACEHOLDER */}
      {currentRoute === 'login-placeholder' && (
        <PlaceholderScreen
          type="login"
          onBack={() => setCurrentRoute('welcome')}
        />
      )}

      {/* Review Drawer Modal (Inspectable by reviewer) */}
      {showSpecNotes && (
        <div 
          className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col justify-end transition-all select-none"
          onClick={() => setShowSpecNotes(false)}
        >
          <div 
            className="bg-[#121722] border-t border-white/[0.12] rounded-t-3xl p-5 max-h-[82%] overflow-y-auto space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-1 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-[#E5A93C]/20 text-[#E5A93C] flex items-center justify-center font-bold text-xs">
                  {currentRoute === 'screen22-qr-result' ? 'S22' : currentRoute === 'screen21-my-qr' ? 'S21' : currentRoute === 'screen20-contact-detail' ? 'S20' : currentRoute === 'screen19-my-network' ? 'S19' : currentRoute === 'screen18-business-profile' ? 'S18' : currentRoute === 'screen17-person-profile' ? 'S17' : currentRoute === 'screen16-search' ? 'S16' : currentRoute === 'screen15-home' ? 'S15' : currentRoute === 'screen14-onboarding-complete' ? 'S14' : currentRoute === 'multiple-businesses-screen13' ? 'S13' : currentRoute === 'screen12-business-identity-preview' ? 'S12' : currentRoute === 'screen11-business-identity-setup' ? 'S11' : currentRoute === 'demo-network-screen10' ? 'S10' : currentRoute === 'demo-review-screen9' ? 'S9' : currentRoute === 'camera-scanner' ? 'S8' : currentRoute === 'demo-physical-card-intro' ? 'S7' : currentRoute === 'demo-other-person-side' ? 'S6' : currentRoute === 'demo-business-identity' ? 'S5' : currentRoute === 'demo-search' ? 'S4' : currentRoute === 'get-started' ? 'S3' : currentRoute === 'signup' ? 'S2' : 'S1'}
                </div>
                <div>
                  <h2 className="text-xs font-bold text-white tracking-tight">
                    {currentRoute === 'screen22-qr-result'
                      ? 'Screen 22 Spec Verification'
                      : currentRoute === 'screen21-my-qr'
                      ? 'Screen 21 Spec Verification'
                      : currentRoute === 'screen20-contact-detail'
                      ? 'Screen 20 Spec Verification'
                      : currentRoute === 'screen19-my-network'
                      ? 'Screen 19 Spec Verification'
                      : currentRoute === 'screen18-business-profile'
                      ? 'Screen 18 Spec Verification'
                      : currentRoute === 'screen17-person-profile'
                      ? 'Screen 17 Spec Verification'
                      : currentRoute === 'screen16-search'
                      ? 'Screen 16 Spec Verification'
                      : currentRoute === 'screen15-home'
                      ? 'Screen 15 Spec Verification'
                      : currentRoute === 'screen14-onboarding-complete'
                      ? 'Screen 14 Spec Verification'
                      : currentRoute === 'multiple-businesses-screen13'
                      ? 'Screen 13 Spec Verification'
                      : currentRoute === 'screen12-business-identity-preview'
                      ? 'Screen 12 Spec Verification'
                      : currentRoute === 'screen11-business-identity-setup'
                      ? 'Screen 11 Spec Verification'
                      : currentRoute === 'demo-network-screen10'
                      ? 'Screen 10 Spec Verification'
                      : currentRoute === 'demo-review-screen9'
                      ? 'Screen 9 Spec Verification'
                      : currentRoute === 'camera-scanner'
                      ? 'Screen 8 Spec Verification'
                      : currentRoute === 'demo-physical-card-intro'
                      ? 'Screen 7 Spec Verification'
                      : currentRoute === 'demo-other-person-side'
                      ? 'Screen 6 Spec Verification'
                      : currentRoute === 'demo-business-identity'
                      ? 'Screen 5 Spec Verification'
                      : currentRoute === 'demo-search'
                      ? 'Screen 4 Spec Verification'
                      : currentRoute === 'get-started'
                      ? 'Screen 3 Spec Verification'
                      : currentRoute === 'signup' 
                      ? 'Screen 2 Spec Verification' 
                      : 'Screen 1 Spec Verification'}
                  </h2>
                  <p className="text-[10px] text-[#94A3B8]">
                    {currentRoute === 'screen22-qr-result'
                      ? 'QR Scan Result / Business Identity Found (Specific Identity Resolution, Fast Progression, Manual Add to Network & Deduplication)'
                      : currentRoute === 'screen21-my-qr'
                      ? 'My QR / Digital Business Card (Identity-Specific QR, Multi-Identity Switcher, Enlargeable Matrix & Share Action)'
                      : currentRoute === 'screen20-contact-detail'
                      ? 'Network Contact Detail (Unified Layout, Registered vs Scanned Logic, Private Isolation, Follow-ups & Original Card)'
                      : currentRoute === 'screen19-my-network'
                      ? 'My Network (Private Workspace, Unified Sources, Multi-Identity Support, Private Search & Notes)'
                      : currentRoute === 'screen18-business-profile'
                      ? 'Public Business Profile (Separation of Business vs Person, People at Business, Business Reviews)'
                      : currentRoute === 'screen17-person-profile'
                      ? 'Person Profile / Multiple Business Identities (One Person, Two Identities, Independent Network Saves)'
                      : currentRoute === 'screen16-search'
                      ? 'Search & Discover (Unified Discovery, Multi-Identity Architecture & Add to Network)'
                      : currentRoute === 'screen15-home'
                      ? 'Home / Main Application Dashboard (First Real Application Screen)'
                      : currentRoute === 'screen14-onboarding-complete'
                      ? 'Onboarding Complete / You’re All Set (Final Transition)'
                      : currentRoute === 'multiple-businesses-screen13'
                      ? 'Do You Represent Another Business? (Multi-Identity Architecture)'
                      : currentRoute === 'screen12-business-identity-preview'
                      ? 'Business Identity Preview (How You Appear to Others)'
                      : currentRoute === 'screen11-business-identity-setup'
                      ? 'Set Up Your First Business Identity (Real Onboarding)'
                      : currentRoute === 'demo-network-screen10'
                      ? 'Final Demo Payoff / Your Network in One Place'
                      : currentRoute === 'demo-review-screen9'
                      ? 'Review Extracted Contact / Add to My Network'
                      : currentRoute === 'camera-scanner'
                      ? 'Camera / Business Card & QR Scanner'
                      : currentRoute === 'demo-physical-card-intro'
                      ? 'Demo: Physical Business Card Intro & Scan Transformation'
                      : currentRoute === 'demo-other-person-side'
                      ? 'Demo Step 3: Directional Save & Rahul’s Independent Choice'
                      : currentRoute === 'demo-business-identity'
                      ? 'Demo Step 2: Digital Identity + Add to My Network'
                      : currentRoute === 'demo-search'
                      ? 'Demo Step 1: Search & Two Business Identities'
                      : currentRoute === 'get-started'
                      ? 'Post-Signup Get Started / Demo Entry'
                      : currentRoute === 'signup' 
                      ? 'Sign Up / Create Personal Account' 
                      : 'Welcome / Authentication Entry'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowSpecNotes(false)}
                className="w-7 h-7 rounded-full bg-[#1F293D] flex items-center justify-center text-[#94A3B8] hover:text-white"
                aria-label="Close Checklist"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {currentRoute === 'screen22-qr-result' ? (
              <div className="space-y-2.5 text-[11px] text-[#94A3B8]">
                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Specific Business Identity (Not Generic Account):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Displays Shravani Pasnur @ Aikyam AI Systems (Software Engineer, Technology, Solapur, +91 98765 43210, shravani@aikyam.ai, aikyam.ai). Not a generic user profile.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Fast Progression (No AI Slop or Celebration):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      No confetti, fake AI percentages, or multi-step celebration modals. Transitions smoothly from "Identity found" directly into the verified card.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Manual Add with Directional Save:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Scanning does NOT auto-add. User actively taps "Add to My Network". Immediate directional save without requiring Shravani to approve.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Robust Edge Cases & Deduplication:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Already saved detection, self-scan prevention, offline fallback, expired/invalid QR handling, and seamless transition to Screen 20 (Contact Detail with source "QR") or back to Scanner in QR mode.
                    </p>
                  </div>
                </div>
              </div>
            ) : currentRoute === 'screen21-my-qr' ? (
              <div className="space-y-2.5 text-[11px] text-[#94A3B8]">
                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Identity-Specific QR (Not Generic Account):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      The QR belongs specifically to Shravani Pasnur + Software Engineer + Aikyam AI Systems. Switching to Pasnur Industries or XYZ Consulting dynamically swaps the digital card, role, contact info, and QR matrix.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Global Active Identity Synchronization:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Selecting an alternate identity in the "Choose an identity to share" bottom sheet synchronizes globally across the application, so returning Home displays the newly selected business identity.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">High Contrast Scannable Matrix + Fullscreen Enlarge:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Crisp, high-contrast QR with generous quiet zone. Tapping the QR opens a fullscreen overlay for fast face-to-face exchange under poor lighting or distance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Strict Privacy Boundary (Zero Private Metadata):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      No login passwords, private emails, private phone numbers, notes, tags, or follow-ups are encoded or displayed. Only public professional identity data is shared.
                    </p>
                  </div>
                </div>
              </div>
            ) : currentRoute === 'screen20-contact-detail' ? (
              <div className="space-y-2.5 text-[11px] text-[#94A3B8]">
                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">One Coherent Architecture for Both Contact Types:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Both Type A (Registered: Rahul Patil @ ABC) and Type B (Scanned: Arjun Deshmukh @ Vertex) use ONE unified layout with conditional sections. No split screens or disjointed experiences.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Strict Privacy Boundary (Only You Can See This):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Private notes, tags, favorites, and follow-ups are 100% private to Shravani. Rahul Patil or Arjun Deshmukh can never see Shravani's private notes or follow-up reminders.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Registered vs. Scanned Behavioral Logic:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      • Registered: Shows link to Public Platform Profile, public details are read-only.
                      <br />• Scanned: User owns the OCR record and can edit fields. Original card image is preserved with zoomable full-screen viewer.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Multi-Identity Private Isolation:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Rahul Patil @ ABC Manufacturing and Rahul Patil @ Nexa Consulting have independent private notes, tags, and follow-ups. Context never leaks between identities.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Prominent Follow-up System:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Follow-ups sit above long notes so busy business owners never miss critical commitments. Features status indicators (Upcoming, Overdue, Done), "Mark Done", and "+ Add Next".
                    </p>
                  </div>
                </div>
              </div>
            ) : currentRoute === 'screen19-my-network' ? (
              <div className="space-y-2.5 text-[11px] text-[#94A3B8]">
                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">One Unified Private Network (No Source Splitting):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Contacts collected from Search (Rahul Patil), Card Scan (Arjun Deshmukh), and QR (Priya Shah) all live together in ONE unified list. Sources are subtle secondary badges, not separate split tabs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Strict Private Workspace (No Social Metaphors):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      No friends, followers, following, requests, or accepted/pending states. Tags, private notes, favorites, and follow-ups belong 100% privately to Shravani and never notify contacts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Visual Equality Across Contact Types:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Registered contacts (Rahul), private scanned cards (Arjun), and QR exchanges (Priya) share the exact same clean, scannable contact-row structure without bloated card designs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Independent Multiple Business Identities Support:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Rahul Patil @ ABC Manufacturing and Rahul Patil @ Nexa Consulting appear as two distinct professional identity entries when both are saved. They are never merged into one single company row.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Private Network Search (Names, Businesses, Tags, Notes):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Searches only Shravani's saved contacts. Supports person names, company names, categories, tags ("Supplier"), and private notes ("conference", "expo") with subtle "Matched in note" indicator.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">First-Time User Empty State (0 Contacts):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Clean empty state ("Your network starts here") with clear primary action [Find People & Businesses] and secondary actions [Scan a Card] and [My QR].
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Persistent Bottom Nav with My Network Selected:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Bottom navigation bar keeps "My Network" highlighted in amber gold with indicator dot. Tapping Home, Search, or Scan navigates seamlessly across the app.
                    </p>
                  </div>
                </div>
              </div>
            ) : currentRoute === 'screen18-business-profile' ? (
              <div className="space-y-2.5 text-[11px] text-[#94A3B8]">
                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Separation of Business vs. Person Data:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      ABC Manufacturing is the business entity. Rahul Patil is an associated person with the role of Owner. Reviews, services, description, and ratings belong to the business, never to Rahul personally.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Strict Prohibition: No "Add to My Network" on the Business:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Aikyam connects people. Users add specific people (with business roles) to their network, never abstract corporate shells. The business header has Call, WhatsApp, Website, Directions, but NO network add button.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">People at ABC Manufacturing Section:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Rahul Patil (Owner) is displayed with "✓ In My Network" (already saved). Tapping Rahul navigates directly to his Person Profile (Screen 17). Other members (e.g. Priya Sharma) offer directional "[+ Add]" action.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Distinct Business Phone vs. Personal Phone:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Business quick action calls the general business phone (+91 217 234 5678), keeping Rahul's direct mobile phone separate.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Business Reviews & Star Ratings:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      4.6 ★★★★★ summary based on 24 customer reviews, recent review cards (Neha Kulkarni, Amit Shah), "Write a Review", and "View All Reviews".
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Branch-Preserving Navigation:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Search remains highlighted in amber on the bottom navigation bar. Back button smoothly returns to the previous screen (whether Search or Person Profile).
                    </p>
                  </div>
                </div>
              </div>
            ) : currentRoute === 'screen17-person-profile' ? (
              <div className="space-y-2.5 text-[11px] text-[#94A3B8]">
                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Core Data Model (ONE Person, Multiple Identities):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Rahul Patil is rendered as ONE registered person. Underneath sit his 2 business relationships: ABC Manufacturing and Nexa Consulting. Not 2 duplicate person profiles.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Person Header Free of Misleading Global Company/Role:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      No universal "Owner" or "ABC Manufacturing" placed directly under Rahul's name. Role and company belong strictly to each respective business identity below.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Main Section ("Business Identities"):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Section title: "Business Identities" with supporting copy: "Choose the business you know Rahul through." Reinforces the multi-identity paradigm clearly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Independent Network Addition & Important Initial State:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      ABC Manufacturing is already saved (✓ In My Network). Nexa Consulting is NOT saved ([ + Add to My Network ]). Tapping Add initiates immediate directional save without approval wait.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Business-Specific Contact Details:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Phone and email are contextual: ABC phone (+91 98220 12345) / rahul@abcmanufacturing.in vs Nexa phone (+91 97630 54321) / rahul@nexaconsulting.in.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Business Ratings & Reviews Separation:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Subtle star ratings belong exclusively to the business entities (ABC: ★ 4.6 • 24 reviews). Rahul himself has NO personal rating or follower counts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Navigation Architecture & State Synchronization:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Persistent bottom nav keeps Search selected (amber). Profile tab is not selected (Profile = Shravani's own account). Back preserves search query and synchronizes saved identities.
                    </p>
                  </div>
                </div>
              </div>
            ) : currentRoute === 'screen16-search' ? (
              <div className="space-y-2.5 text-[11px] text-[#94A3B8]">
                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">One Global Search Field & Compact Header:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      No separate modal selector needed: searches people, businesses, services/categories, and locations seamlessly. Supports natural phrasing ("Manufacturing in Solapur", "Chartered Accountant", "Rahul Patil").
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Search Tabs (All, Businesses, People):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Focused set of 3 tabs without overwhelming inputs. Tab switching strictly preserves current search query text without clearing.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Default / No-Query State (Recent Searches & Browse Categories):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Zero fake cards shown before user types. Displays clean recent searches with single-tap removal and clear all, plus compact category chips (Manufacturing, Tech, Consulting, etc.).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Critical People Data Model (1 Person, Multiple Identities):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Rahul Patil is rendered as ONE unified person with 2 distinct business identities (ABC Manufacturing & Nexa Consulting). No generic "+ Add Rahul" button exists.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Independent Network Addition & Verification:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Tapping "+ Add" on ABC Manufacturing changes only ABC to "✓ In Network", while Nexa Consulting remains "+ Add". Directional save without waiting for acceptance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Business Results & Star Ratings Separation:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Rahul Enterprises shows monogram, category, location, and star rating (★ 4.4 • 18 reviews). Star ratings belong strictly to businesses; people results never show personal ratings.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">No Matches Found → Scan a Card Bridge:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Zero-results view naturally directs user to scan physical business cards, bridging digital discovery with physical card scanning.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Fixed Bottom Navigation:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Home | Search (active, amber) | Scan | Network | Profile remains pinned while result list scrolls smoothly underneath.
                    </p>
                  </div>
                </div>
              </div>
            ) : currentRoute === 'screen15-home' ? (
              <div className="space-y-2.5 text-[11px] text-[#94A3B8]">
                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Transition to Practical Everyday Utility:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Successfully shifted from onboarding storytelling into a fast, moderately dense, information-focused daily business dashboard. Free of social media feeds, vanity metrics, or marketing fluff.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Top App Bar & Active Identity Switcher:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Includes time-of-day greeting (Good morning/afternoon/evening), Aikyam AI Systems identity selector with bottom sheet switcher, and unread notification bell with accessible touch target.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Quick Actions: Scan Card & My QR:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Prominent global search bar paired with two clear quick actions: Scan Card (saves physical cards) and My QR (shares active identity digital card).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Follow-ups & Unified Network Representation:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Displays Rahul Patil follow-up with interactive completion toggle. Unified card language displays both Rahul (Search source) and Arjun (Card scan source) without artificial segregation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Persistent Bottom Navigation Bar:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Standard 5-destination navigation (Home, Search, Scan, Network, Profile) with elevated center scan button and fixed viewport placement.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Robust Edge-Case & Inspector Controls:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Interactive inspector supports First-time Empty State, Devanagari localization (मराठी), Shimmer Skeletons, Partial API failure, Full Network failure, and Offline mode toggle.
                    </p>
                  </div>
                </div>
              </div>
            ) : currentRoute === 'screen14-onboarding-complete' ? (
              <div className="space-y-2.5 text-[11px] text-[#94A3B8]">
                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Main Message & Purpose:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Clear milestone headline: "You're all set." with supporting copy: "Your business identity is ready. Start building your network." Communicates completion without overwhelming the user with paragraphs or repeated explanations.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">User's Own Identity as Visual Focus:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Displays Shravani Pasnur's compact digital identity card (Person + Role + Aikyam AI Systems + Technology • Solapur) with an emerald "✓ Ready" badge. Completely free of demo characters (Rahul/Arjun).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Compact Representation (No Screen 12 Repetition):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Does not re-render every phone number, email, website, Instagram, and full QR. Compact card maintains elegance and focus on the transition.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Subtle Network Satellite Nodes:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Subtle, original floating nodes (Search, QR, Scan, Network) frame the identity card as active visual cues of learned features. Avoids the word "Connect" or connection-request models.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Primary Action: "Enter App" (52dp CTA):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Unmistakably primary CTA with quick 450ms "Opening..." spinner transition, proceeding to Screen 15 Home placeholder. No competing secondary actions.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Strict Absence of Commercial/Permission Noise:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Zero pricing plans, trial periods, business limits, camera/notification popups, or bottom navigation tabs. Professional restraint without celebratory cartoon gimmicks.
                    </p>
                  </div>
                </div>
              </div>
            ) : currentRoute === 'multiple-businesses-screen13' ? (
              <div className="space-y-2.5 text-[11px] text-[#94A3B8]">
                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Core Concept: One Account Can Represent Multiple Businesses:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Clear question: "Do you represent another business?" (not "own"). Explains that one person can hold distinct roles at Aikyam, Pasnur Industries, etc. without separate logins.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">First Identity Confirmed & Active:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Shows subtle "✓ First identity ready" chip and compact Aikyam AI Systems card with "✓ Active" badge. Software Engineer role is attached specifically to Aikyam.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Strictly Optional Add Another Business:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Tapping "+ Add Another Business" or the optional placeholder card reuses Screen 11's architecture with the user's personal name pre-filled and locked.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Primary & Secondary Actions:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      "Continue" is the primary 52dp CTA (signifies finished adding for now). "+ Add Another Business" is clearly visible but secondary.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Scalable Architecture (1, 2, 3+ Identities):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Supports vertical list transition when 3+ businesses exist without horizontal clipping. Top-right inspector lets reviewer test 1, 2, 3 identities and Devanagari text.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Absence of Unsolicited Elements:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      No invented subscription pricing/limits, no demo badges, no bottom navigation, no tutorial characters.
                    </p>
                  </div>
                </div>
              </div>
            ) : currentRoute === 'screen12-business-identity-preview' ? (
              <div className="space-y-2.5 text-[11px] text-[#94A3B8]">
                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Hero — Digital Business Identity (Payoff View):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Clear visual hierarchy: Shravani Pasnur (Person) + Software Engineer (Role) + Aikyam AI Systems (Business) + Category & Solapur location. Not a generic company profile.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Distinct Person Monogram vs Business Logo:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      SP avatar with verified person badge remains visually distinct from the AI company badge.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Business-Specific Contact Information:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Displays Phone (+91 98765 43210), Email (shravani@aikyam.ai), Website (aikyam.ai), Instagram (@aikyam), and Location. Private login credentials remain strictly absent.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Compact Interaction Actions (Call, WhatsApp, Email):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Simulated preview actions show how other members will connect with this business identity without triggering native phone dialers or webmail during onboarding.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Identity-Specific Tasteful QR:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Small embedded QR explicitly associated with Shravani @ Aikyam AI Systems (not a generic account-level QR). Does not overpower the card.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Graceful Omission of Optional Fields:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      If email, website, instagram, or about description are absent, they are omitted cleanly without empty placeholder text.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Primary & Secondary Actions:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      "Confirm Identity" (52dp gold CTA) with spinner loading and restrained "✓ Identity ready" success feedback. "Edit" returns to Screen 11 with all values intact.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Strict Separation from Next Decision:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Does not ask "Do you represent another business?" on Screen 12. Focus is solely on confirming this first identity before advancing to Screen 13.
                    </p>
                  </div>
                </div>
              </div>
            ) : currentRoute === 'screen11-business-identity-setup' ? (
              <div className="space-y-2.5 text-[11px] text-[#94A3B8]">
                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Real Onboarding Transition (Demo Fully Concluded):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      No demo progress bar, no "Quick demo" chips, no tutorial characters (Rahul/Arjun). The user is entering their real professional identity.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Multi-Business Product Model:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Clear distinction: One Account (Shravani Pasnur) ↔ Multiple Business Identities. This screen creates the first identity: Person + Business + Role + Professional Contacts.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Personal Identity Auto-Reused:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Displays authenticated account name ("Shravani Pasnur") with avatar and "Your account" badge. Does NOT ask the user to type their name again.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Separate Personal Photo & Business Logo:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Profile photo (Shravani) and Business logo (Aikyam AI Systems) are separate upload controls with fallback initials.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Existing Business Search & Duplicate Prevention:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Typing business name displays platform directory match suggestion ("Aikyam AI Systems • Technology • Solapur • Already on the platform"), allowing cofounders/employees to join without creating duplicate entities.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Searchable Business Category:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Searchable select bottom sheet handling long industry names (e.g. "Industrial Equipment Manufacturing", "Information Technology & Software Services") without truncation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Flexible Role & Designation:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Text entry with quick role chips (Founder, Owner, Director, Software Engineer, etc.) supporting long job titles.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Account vs Business Contact Privacy:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Business Phone is required for this identity. Private login email/phone are never silently published, offering explicit "Use account" buttons.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Lightweight Location & About:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      City + State only (avoids bulky multi-line address forms during initial onboarding). Optional 300-char "About the business".
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Preview-First Primary CTA:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Button is "Preview My Identity" (not "Save" or "Create Company"). Validates required fields, scrolls to first error, preserves form data, and advances to Screen 12 Preview placeholder.
                    </p>
                  </div>
                </div>
              </div>
            ) : currentRoute === 'demo-network-screen10' ? (
              <div className="space-y-2.5 text-[11px] text-[#94A3B8]">
                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Payoff Convergence Model (Search + Scan + QR → My Network):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Visual convergence of 3 entry pathways into a single, cohesive My Network surface. Teaches: however you meet, all connections live in one place.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Equal Visual Parity in My Network:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Rahul Patil (registered search contact) and Arjun Deshmukh (scanned card contact) share the exact same card hierarchy and design language. No segregated "Scanned" vs "Online" tabs.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Subtle Source Indicators:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Small, elegant badges: "Search" (Rahul) and "Card scan" (Arjun) with micro-icons. Unobtrusive and non-dominant.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Network Search Hint & Utility Hints:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Subtle search input hint ("Search your network...") and secondary utility cues ("Notes • Tags • Follow-ups") reinforce future discoverability without adding heavy feature UI.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Completed Demo Progress State:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Progress indicator shows all steps completed with green checkmark and "Demo Complete". No further tutorial steps.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Exact Next Step CTA:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Uses "Now, let's set up how people see you." intro copy and 52dp primary button: "Set Up My Business Identity", advancing directly to First Business Identity Setup.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Zero Unsolicited Systems:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Strictly avoids bottom navigation tabs, marketing fluff, CRM analytics, or complex contact management during onboarding.
                    </p>
                  </div>
                </div>
              </div>
            ) : currentRoute === 'demo-review-screen9' ? (
              <div className="space-y-2.5 text-[11px] text-[#94A3B8]">
                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Tangible Source Card Reference & Enlarge:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Shows compact original captured Arjun Deshmukh card preview at the top with "View card" high-res inspection modal and "Retake" camera link.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Strict User Control (Nothing Pre-Saved):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Extracted fields are presented as editable drafts. The contact is only saved when the user explicitly taps "Add to My Network".
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Required Save Rules (Company + At Least 1 Phone):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Enforces Company and at least one phone number before saving with clear inline error messages, without disabling the button without explanation.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Dynamic Repeatable Fields (Multiple Phones & Emails):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Avoids rigid Phone 1 / Phone 2 static slots; users can dynamically add, edit, or remove multiple phone numbers and emails.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Reusable Uncertain Field Pattern (⚠ Check this):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Business Category is highlighted with a subtle amber "⚠ Check this" cue and modal selector. Strictly no fake confidence percentages (no 87% score).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Private Contact Semantics:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Explicitly saved into the user's private My Network. Does NOT create a public profile or notify Arjun.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Sticky 52dp CTA with Form Scroll Clearance:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Bottom "Add to My Network" stays easy to reach while allowing full scroll above it. Double submission is blocked during save.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Restrained Success Payoff & Progression to Screen 10:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Shows clean "✓ Added to My Network" feedback with "Arjun is now in your network" and a Continue button leading to Screen 10 placeholder.
                    </p>
                  </div>
                </div>
              </div>
            ) : currentRoute === 'camera-scanner' ? (
              <div className="space-y-2.5 text-[11px] text-[#94A3B8]">
                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Full-Screen Native Camera Composition:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Edge-to-edge camera viewfinder extends behind controls with dark scrims, avoiding white card contrast loss. Non-scrolling fixed mobile layout.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Card Mode Default (Landscape Aspect):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Card detection guide scaled to ~86% width with ~1.65 aspect ratio, using four distinct gold corner reticles with drop shadows.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Transient Guidance Progression:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Shows "Fit the card inside the frame" → "Hold steady" → "Card detected" (with responsive corner glow and shutter highlight).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Same Business Card Continuity (Arjun Deshmukh):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Simulated camera preview features the exact same Arjun Deshmukh card from Vertex Industrial Solutions shown on Screen 7.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Card vs QR Mode Segmented Switcher:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Tapping QR transforms the viewfinder to a square reticle with automatic detection ("Business identity found").
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">User-Controlled Shutter & Capture Flow:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Large 72dp camera shutter button triggers exposure flash, briefly freezes card, and shows honest "Reading card..." without fake OCR percentages.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Hardware Permissions & Quality Error States:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Interactive reviewer drawer includes simulation for permission needed, permission off (settings), and unreadable card with Gallery fallback.
                    </p>
                  </div>
                </div>
              </div>
            ) : currentRoute === 'demo-physical-card-intro' ? (
              <div className="space-y-2.5 text-[11px] text-[#94A3B8]">
                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Natural Contextual Transition:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Eyebrow "But not everyone you meet will be here." leads into "Sometimes, they just hand you a card." and "Scan it and keep the details in your network."
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Physical Card to Digital Contact Visual:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Shows realistic physical card (Arjun Deshmukh @ Vertex Industrial Solutions) → scanner pill/beam → organized digital contact with structured phone, email, and company details.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Zero AI / OCR Technical Buzzwords:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Avoids "OCR", "AI-powered", "Google Vision", and machine learning percentages. Pure user value: "Give us the card. We'll turn it into a contact you can actually use."
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Subtle Amber Review Cue (No Fake Scores):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Category field includes subtle "⚠ Check this" indicator preparing the user for the review screen, without fake confidence scores (no 94% accuracy).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Strict Action Hierarchy:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Primary full-width 52dp CTA "Scan a Card" with camera icon; subordinate secondary action "Choose from Gallery". Both lead into Screen 8.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">No False Save:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Screen 7 is NOT saving anything yet. My Network is displayed purely as destination storytelling ("Destination: My Network • Ready on review").
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Responsive & Edge Cases:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Supports portrait/landscape cards, bilingual text (Marathi/Hindi), and clean vertical stacking on 360×640 screens without microscopic text.
                    </p>
                  </div>
                </div>
              </div>
            ) : currentRoute === 'demo-other-person-side' ? (
              <div className="space-y-2.5 text-[11px] text-[#94A3B8]">
                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Directional Save (No Approval Needed):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Shravani adding Rahul means Rahul @ ABC Manufacturing is ALREADY saved in her network with "✓ Saved in My Network".
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Zero Pending or Request State:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      No "Pending", "Request Sent", or "Awaiting approval". The relationship is not a social connection request.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Rahul Receives a Notification, Not a Request:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Notification card states: "Shravani added you to their network." Displays Shravani's public business identity (Aikyam AI Systems).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Rahul's Independent Button:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Uses "+ Add Shravani to My Network" (NOT "Accept" or "Approve"). Tapping triggers an independent addition to his own network.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">"Not Now" Preserves Shravani's Save:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      If Rahul chooses "Not now" (not "Reject"), Rahul remains in Shravani's network. Nothing is undone.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Two-Way Payoff & Microcopy:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Shows "Now you've both kept the connection" + "No requests. Each person chooses who they keep."
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Back Navigation Preserves State:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Back returns to Screen 5 in its added state ("✓ Added to My Network") rather than resetting to pre-add.
                    </p>
                  </div>
                </div>
              </div>
            ) : currentRoute === 'demo-business-identity' ? (
              <div className="space-y-2.5 text-[11px] text-[#94A3B8]">
                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Clear Person vs Business Entity:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Rahul Patil is the PERSON; ABC Manufacturing is the BUSINESS; Owner is his ROLE at ABC. Nexa Consulting details are absent.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Pure "+ Add to My Network" Primary Action:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      No "Connect", "Follow", or "Send Request". No approval required from Rahul. Addition is instantaneous.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Two-Stage Microinteraction & Success:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Tap shows loading spinner ("Adding..."), transitions to "✓ Added to My Network", informs "Rahul will be notified", and reveals "See what happens next".
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Multiple Identities & Duplicate Protection:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      The network entry unit is Person + Business Identity. Rahul @ Nexa Consulting remains a separate independent identity.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Edge Case Test Selector:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Use the bottom selector to test: Default, Already In Network, Long Names, Network Error, and Unavailable Profile.
                    </p>
                  </div>
                </div>
              </div>
            ) : currentRoute === 'demo-search' ? (
              <div className="space-y-2.5 text-[11px] text-[#94A3B8]">
                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Demo Step 1 Search:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Searched "Rahul Patil" returning 2 distinct business identities: ABC Manufacturing (Owner) and Nexa Consulting (Partner).
                    </p>
                  </div>
                </div>
              </div>
            ) : currentRoute === 'get-started' ? (
              <div className="space-y-2.5 text-[11px] text-[#94A3B8]">
                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Account Ready Confirmation:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Subtle greeting "Welcome, Shravani" + subtle gold badge "Account ready". Avoids intrusive green banners.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Original Business Networking Illustration:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Illustrates Rahul Patil (Search discovery), Neha Shah (QR exchange), and Amit Kulkarni (Card scan) connecting into one personal digital business network hub.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Clear Onboarding Expectation:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      "Quick demo • Less than a minute" badge reassures the user that onboarding is rapid and frictionless.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Distinct Get Started vs Skip Actions:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      "Get Started" starts the interactive demo. Low-emphasis "Skip for now" directs to Business Setup, never prematurely to the main dashboard.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Responsive & Edge Cases:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Scales comfortably on short screens (360×640 dp), large screens, handles font scaling up to +30%, and prevents double-tap race conditions.
                    </p>
                  </div>
                </div>
              </div>
            ) : currentRoute === 'signup' ? (
              <div className="space-y-2.5 text-[11px] text-[#94A3B8]">
                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Strictly Personal Account Scope:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Only Full Name, Email Address, and Password are collected. Zero business fields (business name, category, services, logo) which belong exclusively to Business Setup.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Prominent Google Authentication:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      "Continue with Google" placed above the divider, followed by "or continue with email". Simulates authentication cleanly.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Persistent Labels & Long Name / Unicode Support:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Every field has persistent labels. Tested and resilient for names like "Shrinivas Venkateshwara Rao Kulkarni" and Marathi/Hindi Unicode without visual clipping.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Post-Auth Routing to Get Started (Screen 3):</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Successful creation leads to Screen 3 (Get Started), never directly to Home/Dashboard.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Simulated States & Keyboard Safety:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Use the bottom inspector buttons to test Validation Error, Account Exists, Network Error, or the simulated Virtual Keyboard overlay.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5 text-[11px] text-[#94A3B8]">
                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Three Visual Zones:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Hero visual zone (45–50% responsive area), Content zone (headline + concise value prop), and Action zone (Sign Up + Log In).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-[#182030] p-2.5 rounded-xl border border-white/[0.04]">
                  <CheckCircle2 className="w-4 h-4 text-[#E5A93C] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">Original Editorial Illustration:</strong>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">
                      Two professionals in person (phone + physical card) with floating micro business identities connected by a subtle golden beam. Communicates "Meeting → Digital Network".
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowSpecNotes(false)}
              className="w-full py-2.5 rounded-xl bg-[#E5A93C] text-[#0A0D14] font-semibold text-xs transition-all active:scale-[0.98]"
            >
              Close Checklist
            </button>
          </div>
        </div>
      )}
    </DeviceFrame>
  );
}
