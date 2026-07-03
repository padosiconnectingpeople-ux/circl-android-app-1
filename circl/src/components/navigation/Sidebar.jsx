import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, AlertTriangle, Plus, Store, User, MessageSquare, Shield, Sparkles } from 'lucide-react';
import useTranslation from '@i18n/useTranslation';
import useAuthStore from '@store/authStore';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const profile = useAuthStore((s) => s.profile);

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navItems = [
    { id: 'home', path: '/', icon: Home, label: 'home' },
    { id: 'issues', path: '/issues', icon: AlertTriangle, label: 'issues' },
    { id: 'directory', path: '/directory', icon: Store, label: 'directory' },
    { id: 'chat', path: '/chat', icon: MessageSquare, label: 'chat' },
    { id: 'profile', path: '/profile', icon: User, label: 'profile' },
  ];

  return (
    <aside className="sticky top-[72px] h-[calc(100vh-80px)] flex flex-col justify-between py-4 select-none shrink-0 w-full">
      <div className="space-y-6">
        {/* Navigation links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const active = isActive(item.path);
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-body-lg transition-all duration-200 ${
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={active ? 2.5 : 2} />
                <span className="capitalize">{t(item.label)}</span>
              </button>
            );
          })}

          {profile?.role === 'society_admin' && (
            <button
              onClick={() => navigate('/admin')}
              className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-bold text-body-lg transition-all duration-200 ${
                isActive('/admin')
                  ? 'bg-primary/10 text-primary'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span>Admin Panel</span>
            </button>
          )}
        </nav>

        {/* Create Post FAB */}
        <button
          onClick={() => navigate('/create')}
          className="w-full h-14 bg-primary text-white rounded-2xl font-extrabold text-body-lg flex items-center justify-center gap-2 shadow-fab hover:bg-primary-dark transition-all active:scale-[0.98]"
        >
          <Plus className="w-5 h-5" strokeWidth={3} />
          <span>New Post</span>
        </button>
      </div>

      {/* Arjun business health mini-badge */}
      <div
        onClick={() => navigate('/arjun')}
        className="bg-primary/5 rounded-2xl p-4 border border-primary/10 cursor-pointer hover:bg-primary/10 transition-colors space-y-2"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <h4 className="font-extrabold text-on-surface text-body-md">Ask Arjun</h4>
        </div>
        <p className="text-[10px] text-text-muted leading-[1.3]">
          Get instant Hinglish AI advice for business growth and colony management.
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;
