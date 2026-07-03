import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@config/firebase';
import useAuthStore from '@store/authStore';
import useTranslation from '@i18n/useTranslation';
import { EMERGENCY_TYPES } from '@config/constants';
import Button from '@components/common/Button';
import Avatar from '@components/common/Avatar';
import { AlertOctagon, ShieldAlert, CheckCircle, MessageSquare } from 'lucide-react';

const EmergencyAlertPage = () => {
  const { t } = useTranslation();
  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('medical');
  const [desc, setDesc] = useState('');
  const [reporting, setReporting] = useState(false);

  // Demo Alerts
  const demoAlerts = [
    {
      id: 'alert_1',
      reporterName: 'Anish Kapoor',
      type: 'theft',
      description: 'Suspicious individual spotted lingering around the parking lot near Gate 2. Guard has been notified.',
      location: 'Sunshine Apartments parking area',
      createdAt: new Date(),
      safeUsers: ['user1'],
    }
  ];

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const colony = profile?.colony || 'Hill View';
        const q = query(
          collection(db, 'emergencyAlerts'),
          where('colony', '==', colony),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        if (docs.length > 0) {
          setAlerts(docs);
        } else {
          setAlerts(demoAlerts);
        }
      } catch (e) {
        console.warn('Firestore load failed, showing fallback alerts:', e);
        setAlerts(demoAlerts);
      }
      setLoading(false);
    };

    fetchAlerts();
  }, [profile]);

  const handleReportEmergency = async () => {
    if (!desc.trim()) return;
    setReporting(true);

    try {
      await addDoc(collection(db, 'emergencyAlerts'), {
        reporterId: user?.uid || 'guest',
        reporterName: profile?.name || 'Neighbor',
        type: selectedType,
        description: desc,
        location: profile?.society || 'Sunshine Apts',
        city: profile?.city || 'Mumbai',
        area: profile?.area || 'Bandra',
        colony: profile?.colony || 'Hill View',
        society: profile?.society || 'Sunshine Apts',
        safeUsers: [],
        resolved: false,
        createdAt: serverTimestamp(),
      });
      setDesc('');
    } catch (e) {
      console.warn('Error reporting emergency to Firestore');
    }

    setReporting(false);
  };

  return (
    <div className="animate-fade-in p-md space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-3">
        <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center">
          <ShieldAlert className="w-5 h-5 text-danger animate-pulse" />
        </div>
        <h2 className="text-headline-sm font-bold text-on-surface flex-1">{t('emergencyAlert')}</h2>
      </div>

      {/* Quick Alert Creator */}
      <div className="bg-red-50 rounded-2xl border border-red-200 p-md space-y-4">
        <h3 className="font-bold text-red-800 text-body-lg flex items-center gap-1.5">
          <AlertOctagon className="w-5 h-5" /> Broadcast Emergency
        </h3>

        {/* Emojis list */}
        <div className="grid grid-cols-4 gap-2">
          {EMERGENCY_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                selectedType === type.id
                  ? 'bg-danger border-danger text-white scale-105 shadow-sm'
                  : 'bg-white border-red-200 text-red-950 hover:bg-red-100'
              }`}
            >
              <span className="text-xl">{type.emoji}</span>
              <span className="text-[10px] font-bold">{type.label}</span>
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <textarea
            placeholder="What is the emergency? Include flat/block number so neighbors can help instantly..."
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full h-20 p-3 rounded-xl border border-red-200 focus:outline-none focus:ring-2 focus:ring-danger/20 text-body-md text-red-950"
          />
          <Button
            variant="danger"
            size="full"
            loading={reporting}
            disabled={!desc.trim()}
            onClick={handleReportEmergency}
            className="h-12 !rounded-xl"
          >
            Send SOS Broadcast 🚨
          </Button>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="space-y-3">
        <h3 className="font-bold text-on-surface text-body-lg">{t('activeAlerts')}</h3>
        {loading ? (
          <div className="text-center py-6 text-text-muted">{t('loading')}</div>
        ) : alerts.length === 0 ? (
          <div className="text-center py-8 bg-surface-container-low rounded-xl border border-outline-variant/10">
            <CheckCircle className="w-10 h-10 text-success mx-auto mb-2 opacity-50" />
            <h4 className="font-bold text-on-surface text-body-md">colony is safe</h4>
            <p className="text-label-md text-text-muted mt-0.5">No active emergencies reported.</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const typeDetails = EMERGENCY_TYPES.find(t => t.id === alert.type) || EMERGENCY_TYPES[7];
            return (
              <div key={alert.id} className="bg-red-50/50 border border-red-100 rounded-xl p-md space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{typeDetails.emoji}</span>
                    <div>
                      <h4 className="font-bold text-red-800 text-body-md capitalize">
                        {typeDetails.label} Alert
                      </h4>
                      <span className="text-[9px] text-text-muted">Location: {alert.location}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-red-100 text-danger rounded-full animate-pulse">
                    SOS ACTIVE
                  </span>
                </div>
                <p className="text-body-md text-red-950 leading-[1.3]">{alert.description}</p>
                <div className="pt-2 border-t border-red-200/50 flex justify-between items-center">
                  <span className="text-[10px] text-text-muted">By {alert.reporterName}</span>
                  <button className="text-label-sm font-bold text-green-600 bg-white border border-green-200 px-3 py-1.5 rounded-lg active:scale-95 transition-all">
                    I'm Safe 👍
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default EmergencyAlertPage;
