import React from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@store/authStore';
import useTranslation from '@i18n/useTranslation';
import Avatar from '@components/common/Avatar';
import Button from '@components/common/Button';
import { LogOut, Globe, Shield, Sparkles, Award } from 'lucide-react';

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const profile = useAuthStore((s) => s.profile);
  const signOut = useAuthStore((s) => s.signOut);

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  const roleLabels = {
    user: 'Colony Resident',
    society_admin: 'Society Committee Member',
    business_owner: 'Verified Business Owner',
    admin: 'Super Admin',
  };

  return (
    <div className="animate-fade-in p-md space-y-6">
      {/* Profile Card */}
      <div className="circl-card p-md border border-outline-variant/10 text-center space-y-3 relative overflow-hidden">
        {/* Cover ornament */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-primary" />

        <div className="pt-2">
          <Avatar
            name={profile?.name || 'Resident'}
            src={profile?.photoURL}
            size="3xl"
            verified={profile?.verified}
            className="mx-auto"
          />
        </div>

        <div>
          <h2 className="text-headline-md font-bold text-on-surface flex items-center justify-center gap-1">
            {profile?.name || 'Neighbor'}
          </h2>
          <p className="text-label-md font-bold text-primary mt-0.5">
            {roleLabels[profile?.role] || 'Resident'}
          </p>
          <span className="text-[10px] text-text-muted mt-0.5 block font-semibold uppercase tracking-wider">
            {profile?.society || 'Sunshine Apts'}, {profile?.colony || 'Hill View'}
          </span>
        </div>

        {/* Reputation Score */}
        <div className="bg-primary/5 rounded-2xl p-3 border border-primary/10 flex items-center justify-center gap-2 max-w-xs mx-auto">
          <Award className="w-5 h-5 text-primary" />
          <div>
            <span className="text-body-md font-extrabold text-primary">
              {profile?.reputation || 0} Points
            </span>
            <span className="text-label-sm text-text-muted block">Reputation reputation score</span>
          </div>
        </div>
      </div>

      {/* Account Settings Options */}
      <div className="space-y-2">
        <button
          onClick={() => navigate('/settings/language')}
          className="w-full flex items-center justify-between p-4 bg-card hover:bg-surface-container rounded-xl border border-outline-variant/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-primary" />
            <span className="text-body-lg font-semibold text-on-surface">Language (भाषा / Hinglish)</span>
          </div>
          <span className="text-label-md text-text-muted font-bold capitalize">{t('language')}</span>
        </button>

        {profile?.role === 'society_admin' && (
          <button
            onClick={() => navigate('/admin')}
            className="w-full flex items-center justify-between p-4 bg-card hover:bg-surface-container rounded-xl border border-outline-variant/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <span className="text-body-lg font-semibold text-on-surface">Society Admin Controls</span>
            </div>
          </button>
        )}

        <button
          onClick={() => navigate('/brandlaunch')}
          className="w-full flex items-center justify-between p-4 bg-card hover:bg-surface-container rounded-xl border border-outline-variant/10 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-body-lg font-semibold text-on-surface">{t('brandLaunch')}</span>
          </div>
        </button>
      </div>

      {/* Sign Out */}
      <Button
        variant="ghost"
        size="full"
        icon={LogOut}
        onClick={handleSignOut}
        className="h-12 !rounded-xl !border-danger !text-danger hover:!bg-red-50"
      >
        {t('signOut')}
      </Button>
    </div>
  );
};

export default UserProfilePage;
