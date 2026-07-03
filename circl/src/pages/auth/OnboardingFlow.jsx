import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, ChevronRight, Check, Sparkles } from 'lucide-react';
import Button from '@components/common/Button';
import useAuthStore from '@store/authStore';
import useTranslation from '@i18n/useTranslation';
import { INTERESTS, BUSINESS_CATEGORIES } from '@config/constants';

const INDIAN_CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow',
  'Surat', 'Nagpur', 'Indore', 'Bhopal', 'Chandigarh',
  'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad', 'Thane',
];

const OnboardingFlow = () => {
  const navigate = useNavigate();
  const { completeOnboarding, loading } = useAuthStore();
  const { t } = useTranslation();

  const selectedRole = sessionStorage.getItem('role') || 'resident';

  // Tailor steps based on user role
  const stepsList = ['welcome', 'city', 'area'];
  if (selectedRole === 'resident') {
    stepsList.push('colony', 'interests');
  } else if (selectedRole === 'society') {
    stepsList.push('colony', 'society_details');
  } else if (selectedRole === 'business') {
    stepsList.push('business_details');
  }

  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    city: '',
    area: '',
    colony: '',
    society: '',
    flatNumber: '',
    interests: [],
    // Business specific
    businessName: '',
    businessCategory: 'Restaurant',
    businessAddress: '',
    businessDescription: '',
    businessWhatsapp: '',
    // Society specific
    societyDesignation: 'Committee Member',
    societyOfficeNumber: '',
    role: selectedRole === 'resident' ? 'user' : selectedRole === 'society' ? 'society_admin' : 'business_owner',
  });
  const [citySearch, setCitySearch] = useState('');

  const filteredCities = INDIAN_CITIES.filter(c =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  const handleNext = () => {
    if (step < stepsList.length - 1) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleComplete = async () => {
    const result = await completeOnboarding(data);
    if (result.success) {
      navigate('/', { replace: true });
    }
  };

  const toggleInterest = (interest) => {
    setData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const canProceed = () => {
    switch (stepsList[step]) {
      case 'city': return !!data.city;
      case 'area': return !!data.area;
      case 'colony': return !!data.colony && !!data.society;
      case 'interests': return data.interests.length >= 3;
      case 'society_details': return !!data.societyDesignation;
      case 'business_details': return !!data.businessName && !!data.businessCategory && !!data.businessWhatsapp;
      default: return true;
    }
  };

  const renderStep = () => {
    switch (stepsList[step]) {
      case 'welcome':
        return (
          <div className="flex flex-col items-center justify-center flex-1 px-8 text-center animate-fade-in">
            {/* Logo */}
            <div className="relative w-28 h-28 flex items-center justify-center mb-6">
              <svg width="112" height="112" viewBox="0 0 128 128" fill="none">
                <path
                  d="M100 30C115 45 120 70 110 95C95 125 55 128 30 110C5 92 0 50 20 25C35 5 65 0 85 10"
                  stroke="#5B4FE8" strokeWidth="12" strokeLinecap="round"
                />
              </svg>
              <div className="absolute w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_rgba(91,79,232,0.4)] animate-pulse-dot" />
            </div>
            <h1 className="text-display-lg font-extrabold text-primary">
              {selectedRole === 'resident' && 'Resident Signup 🏠'}
              {selectedRole === 'society' && 'Society Committee 🏢'}
              {selectedRole === 'business' && 'Local Business 💼'}
            </h1>
            <p className="text-body-lg text-text-muted mt-3 max-w-xs">
              {selectedRole === 'resident' && "Connect with your colony and society neighbors."}
              {selectedRole === 'society' && "Manage your colony boundary, verify residents, and maintain accounts."}
              {selectedRole === 'business' && "Promote your services, accept local orders, and grow."}
            </p>
            <p className="text-label-md text-primary font-semibold mt-6 uppercase tracking-[0.15em]">
              {t('tagline')}
            </p>
          </div>
        );

      case 'city':
        return (
          <div className="flex-1 px-6 animate-fade-in">
            <h2 className="text-headline-md font-bold text-on-surface mb-2">{t('selectCity')}</h2>
            <p className="text-body-md text-text-muted mb-6">Select your location city</p>

            {/* GPS button */}
            <button
              className="w-full flex items-center gap-3 p-4 rounded-2xl border-2 border-primary/20 bg-primary/5 mb-4 hover:bg-primary/10 transition-colors"
              onClick={() => {
                setData({ ...data, city: 'Mumbai' });
              }}
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Navigation className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-primary">{t('useGPS')}</p>
                <p className="text-label-md text-text-muted">Auto-detect your city</p>
              </div>
            </button>

            {/* Search */}
            <input
              type="text"
              placeholder="Search city..."
              value={citySearch}
              onChange={(e) => setCitySearch(e.target.value)}
              className="input-field mb-4"
            />

            {/* City list */}
            <div className="space-y-1 max-h-[40vh] overflow-y-auto">
              {filteredCities.map((city) => (
                <button
                  key={city}
                  onClick={() => setData({ ...data, city })}
                  className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
                    data.city === city
                      ? 'bg-primary text-white'
                      : 'hover:bg-surface-container'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium">{city}</span>
                  </div>
                  {data.city === city && <Check className="w-5 h-5" />}
                </button>
              ))}
            </div>
          </div>
        );

      case 'area':
        return (
          <div className="flex-1 px-6 animate-fade-in">
            <h2 className="text-headline-md font-bold text-on-surface mb-2">{t('enterArea')}</h2>
            <p className="text-body-md text-text-muted mb-6">
              In {data.city}, which area do you live or operate in?
            </p>
            <input
              type="text"
              placeholder="e.g., Bandra West, Koramangala..."
              value={data.area}
              onChange={(e) => setData({ ...data, area: e.target.value })}
              className="input-field text-lg"
              autoFocus
            />
            <p className="text-label-md text-text-muted mt-3">
              💡 Suggestions will appear based on Google Places API
            </p>
          </div>
        );

      case 'colony':
        return (
          <div className="flex-1 px-6 animate-fade-in">
            <h2 className="text-headline-md font-bold text-on-surface mb-2">{t('enterColony')}</h2>
            <p className="text-body-md text-text-muted mb-6">
              Society registration details
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-label-md font-semibold text-on-surface mb-1 block">
                  {t('colonyName')} *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Hill View Colony"
                  value={data.colony}
                  onChange={(e) => setData({ ...data, colony: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-label-md font-semibold text-on-surface mb-1 block">
                  {t('societyName')} *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Sunshine Apartments"
                  value={data.society}
                  onChange={(e) => setData({ ...data, society: e.target.value })}
                  className="input-field"
                />
              </div>
              {selectedRole === 'resident' && (
                <div>
                  <label className="text-label-md font-semibold text-on-surface mb-1 block">
                    {t('flatNumber')}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., A-301"
                    value={data.flatNumber}
                    onChange={(e) => setData({ ...data, flatNumber: e.target.value })}
                    className="input-field"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 'interests':
        return (
          <div className="flex-1 px-6 animate-fade-in">
            <h2 className="text-headline-md font-bold text-on-surface mb-2">{t('pickInterests')}</h2>
            <p className="text-body-md text-text-muted mb-1">
              Pick at least 3 topics you care about
            </p>
            <p className="text-label-md text-primary font-semibold mb-6">
              {data.interests.length} selected
            </p>
            <div className="flex flex-wrap gap-2 max-h-[50vh] overflow-y-auto">
              {INTERESTS.map((interest) => (
                <button
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`chip ${
                    data.interests.includes(interest)
                      ? 'chip-active'
                      : 'chip-inactive'
                  }`}
                >
                  {data.interests.includes(interest) && <Check className="w-3 h-3 mr-1" />}
                  {interest}
                </button>
              ))}
            </div>
          </div>
        );

      case 'society_details':
        return (
          <div className="flex-1 px-6 animate-fade-in">
            <h2 className="text-headline-md font-bold text-on-surface mb-2">Society Management</h2>
            <p className="text-body-md text-text-muted mb-6">
              Specify your position and management office details
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-label-md font-semibold text-on-surface mb-1 block">
                  Your Designation *
                </label>
                <select
                  value={data.societyDesignation}
                  onChange={(e) => setData({ ...data, societyDesignation: e.target.value })}
                  className="input-field"
                >
                  <option value="Committee Member">Committee Member</option>
                  <option value="President">President</option>
                  <option value="Secretary">Secretary</option>
                  <option value="Treasurer">Treasurer</option>
                  <option value="RWA Administrator">RWA Administrator</option>
                </select>
              </div>
              <div>
                <label className="text-label-md font-semibold text-on-surface mb-1 block">
                  Office / Flat Number
                </label>
                <input
                  type="text"
                  placeholder="e.g., Block B, Ground Floor Office"
                  value={data.societyOfficeNumber}
                  onChange={(e) => setData({ ...data, societyOfficeNumber: e.target.value })}
                  className="input-field"
                />
              </div>
              <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                <p className="text-label-sm text-primary leading-[1.4]">
                  ℹ️ As a Society Admin, you will moderate posts, verify residents, draw boundary maps, and manage society balances.
                </p>
              </div>
            </div>
          </div>
        );

      case 'business_details':
        return (
          <div className="flex-1 px-6 animate-fade-in">
            <h2 className="text-headline-md font-bold text-on-surface mb-2">Business Profile</h2>
            <p className="text-body-md text-text-muted mb-6">
              Set up your public business directory profile
            </p>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className="text-label-md font-semibold text-on-surface mb-1 block">
                  Business Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g., Sharma Grocery Store"
                  value={data.businessName}
                  onChange={(e) => setData({ ...data, businessName: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-label-md font-semibold text-on-surface mb-1 block">
                  Category *
                </label>
                <select
                  value={data.businessCategory}
                  onChange={(e) => setData({ ...data, businessCategory: e.target.value })}
                  className="input-field"
                >
                  {BUSINESS_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-label-md font-semibold text-on-surface mb-1 block">
                  WhatsApp Number (+91) *
                </label>
                <input
                  type="tel"
                  placeholder="e.g., 9876543210"
                  value={data.businessWhatsapp}
                  onChange={(e) => setData({ ...data, businessWhatsapp: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className="input-field"
                  maxLength={10}
                />
              </div>
              <div>
                <label className="text-label-md font-semibold text-on-surface mb-1 block">
                  Store / Shop Address
                </label>
                <input
                  type="text"
                  placeholder="e.g., Shop 4, Hill View Market"
                  value={data.businessAddress}
                  onChange={(e) => setData({ ...data, businessAddress: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="text-label-md font-semibold text-on-surface mb-1 block">
                  Short Description
                </label>
                <textarea
                  placeholder="e.g., Daily essentials, fresh milk, and delivery within society."
                  value={data.businessDescription}
                  onChange={(e) => setData({ ...data, businessDescription: e.target.value })}
                  className="input-field h-20"
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Progress bar */}
      {step > 0 && (
        <div className="px-6 pt-4">
          <div className="flex gap-2">
            {stepsList.slice(1).map((_, i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  i < step ? 'bg-primary' : 'bg-outline-variant/30'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Step content */}
      <div className="flex-1 flex flex-col pt-6 pb-4">
        {renderStep()}
      </div>

      {/* Bottom actions */}
      <div className="px-6 pb-8 pt-4 space-y-3">
        {step === stepsList.length - 1 ? (
          <Button
            variant="primary"
            size="full"
            onClick={handleComplete}
            loading={loading}
            disabled={!canProceed()}
            icon={Sparkles}
            className="h-14 !rounded-2xl"
          >
            {t('done')} — Join Your Circle!
          </Button>
        ) : (
          <Button
            variant="primary"
            size="full"
            onClick={handleNext}
            disabled={step > 0 && !canProceed()}
            iconRight={ChevronRight}
            className="h-14 !rounded-2xl"
          >
            {step === 0 ? "Let's Get Started" : t('next')}
          </Button>
        )}

        {step > 0 && (
          <button
            onClick={handleBack}
            className="w-full text-center text-body-md text-text-muted py-2"
          >
            ← {t('back')}
          </button>
        )}
      </div>
    </div>
  );
};

export default OnboardingFlow;
