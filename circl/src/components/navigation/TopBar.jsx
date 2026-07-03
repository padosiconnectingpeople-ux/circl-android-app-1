import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, ChevronDown, MapPin } from 'lucide-react';
import useAuthStore from '@store/authStore';
import useUIStore from '@store/uiStore';
import useTranslation from '@i18n/useTranslation';

const TopBar = () => {
  const navigate = useNavigate();
  const profile = useAuthStore((s) => s.profile);
  const { t } = useTranslation();

  const locationName = profile?.society || profile?.colony || profile?.area || 'Select Location';

  return (
    <header className="bg-card/95 backdrop-blur-lg sticky top-0 z-50 border-b border-outline-variant/10">
      <div className="flex justify-between items-center w-full px-container-margin py-2.5">
        {/* Logo */}
        <div className="flex items-center">
          <h1
            className="text-headline-md font-bold text-primary cursor-pointer"
            onClick={() => navigate('/')}
          >
            Circl
          </h1>
        </div>

        {/* Location Selector */}
        <button
          className="flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-surface-container transition-colors"
          onClick={() => navigate('/settings/location')}
        >
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span className="text-label-md font-medium text-on-surface max-w-[120px] truncate">
            {locationName}
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
        </button>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/search')}
            className="p-1.5 rounded-full hover:bg-surface-container transition-colors active:scale-95"
          >
            <Search className="w-5 h-5 text-on-surface/70" />
          </button>
          <button
            onClick={() => navigate('/notifications')}
            className="relative p-1.5 rounded-full hover:bg-surface-container transition-colors active:scale-95"
          >
            <Bell className="w-5 h-5 text-on-surface/70" />
            {/* Notification dot */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-secondary rounded-full border-2 border-card" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
