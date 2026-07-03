import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, AlertTriangle, Plus, Store, User } from 'lucide-react';
import useTranslation from '@i18n/useTranslation';

const navItems = [
  { id: 'home', path: '/', icon: Home, label: 'home' },
  { id: 'issues', path: '/issues', icon: AlertTriangle, label: 'issues' },
  { id: 'create', path: '/create', icon: Plus, label: 'create', isFab: true },
  { id: 'directory', path: '/directory', icon: Store, label: 'directory' },
  { id: 'profile', path: '/profile', icon: User, label: 'profile' },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-card/95 backdrop-blur-lg shadow-nav rounded-t-2xl">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          if (item.isFab) {
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className="relative -top-5 w-14 h-14 bg-primary rounded-full shadow-fab flex items-center justify-center text-white transition-all duration-200 active:scale-90 border-4 border-background"
              >
                <Plus className="w-7 h-7" strokeWidth={2.5} />
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 min-w-[56px] ${
                active
                  ? 'text-primary'
                  : 'text-on-surface/40'
              }`}
            >
              <Icon
                className="w-6 h-6"
                fill={active ? 'currentColor' : 'none'}
                strokeWidth={active ? 2.5 : 2}
              />
              <span className={`text-[10px] mt-0.5 font-semibold ${active ? 'text-primary' : 'text-on-surface/40'}`}>
                {t(item.label)}
              </span>
            </button>
          );
        })}
      </div>
      {/* Safe area spacer */}
      <div className="pb-safe" />
    </nav>
  );
};

export default BottomNav;
