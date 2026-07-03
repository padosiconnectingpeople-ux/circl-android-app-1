import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Megaphone, ShoppingBag, ArrowRight } from 'lucide-react';
import useTranslation from '@i18n/useTranslation';

const RightSidebar = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <aside className="sticky top-[72px] h-[calc(100vh-80px)] space-y-4 py-4 select-none shrink-0 w-full overflow-y-auto hide-scrollbar">
      {/* Active emergency widget */}
      <div className="bg-red-50 rounded-2xl border border-red-100 p-4 space-y-3">
        <div className="flex items-center gap-2 text-danger">
          <AlertCircle className="w-5 h-5 animate-pulse" />
          <h4 className="font-extrabold text-body-md uppercase tracking-wider">Colony Alerts</h4>
        </div>
        <p className="text-body-md text-red-950 leading-[1.3]">
          Colony is currently safe. No active emergency SOS broadcasts.
        </p>
        <button
          onClick={() => navigate('/emergency')}
          className="text-label-md font-bold text-danger hover:underline flex items-center gap-0.5"
        >
          <span>Alert Board</span> <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Society announcements */}
      <div className="bg-surface-container-low rounded-2xl border border-outline-variant/10 p-4 space-y-3">
        <div className="flex items-center gap-2 text-primary">
          <Megaphone className="w-5 h-5" />
          <h4 className="font-extrabold text-body-md uppercase tracking-wider">Announcements</h4>
        </div>
        <div className="space-y-2">
          <div className="space-y-0.5">
            <span className="text-[9px] text-text-muted font-bold block">COLONY MANAGEMENT</span>
            <p className="text-body-md text-on-surface-variant font-medium leading-[1.3]">
              Monsoon Tree Plantation Drive starts at 8:30 AM this Saturday.
            </p>
          </div>
        </div>
        <button
          onClick={() => navigate('/events')}
          className="text-label-md font-bold text-primary hover:underline flex items-center gap-0.5"
        >
          <span>View Events</span> <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hyperlocal sponsored ad */}
      <div className="bg-card rounded-2xl border-2 border-secondary p-4 space-y-3 relative overflow-hidden">
        <div className="absolute top-2 right-2 bg-secondary text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
          Sponsored
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <h5 className="font-bold text-on-surface text-body-md">FreshBaskets</h5>
            <span className="text-[10px] text-secondary font-bold">Flat 20% OFF today</span>
          </div>
        </div>
        <p className="text-label-md text-on-surface-variant leading-[1.3]">
          Get fresh farm groceries delivered in 30 minutes. Use SUNSHINE20.
        </p>
        <button
          onClick={() => navigate('/directory')}
          className="w-full py-2 bg-secondary text-white rounded-lg font-bold text-label-md hover:bg-secondary/90 transition-colors"
        >
          Shop Now
        </button>
      </div>
    </aside>
  );
};

export default RightSidebar;
