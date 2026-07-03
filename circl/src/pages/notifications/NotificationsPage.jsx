import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@config/firebase';
import useAuthStore from '@store/authStore';
import useTranslation from '@i18n/useTranslation';
import { Bell, Heart, MessageSquare, AlertOctagon, UserPlus, Info } from 'lucide-react';
import Button from '@components/common/Button';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Demo Notifications
  const demoNotifications = [
    {
      id: 'notif_1',
      type: 'emergency',
      title: '🚨 Urgent: Theft reported!',
      body: 'Anish Kapoor reported suspicious activity near parking Gate 2. Guard notified.',
      createdAt: new Date(),
    },
    {
      id: 'notif_2',
      type: 'like',
      title: '❤️ Rahul Malhotra liked your post',
      body: 'Rahul and 3 others reacted to your broadband query.',
      createdAt: new Date(Date.now() - 3600000),
    },
    {
      id: 'notif_3',
      type: 'verification',
      title: '🟢 Society verified your profile!',
      body: 'Congratulations! You are now a verified resident of Sunshine Apartments.',
      createdAt: new Date(Date.now() - 86400000),
    }
  ];

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        if (user) {
          const q = query(
            collection(db, 'notifications', user.uid, 'notifications'),
            orderBy('createdAt', 'desc')
          );
          const snap = await getDocs(q);
          const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));

          if (docs.length > 0) {
            setNotifications(docs);
          } else {
            setNotifications(demoNotifications);
          }
        } else {
          setNotifications(demoNotifications);
        }
      } catch (e) {
        console.warn('Firestore load failed, showing fallback notifications:', e);
        setNotifications(demoNotifications);
      }
      setLoading(false);
    };

    fetchNotifications();
  }, [user]);

  const getNotifIcon = (type) => {
    switch (type) {
      case 'emergency': return <AlertOctagon className="w-5 h-5 text-danger animate-bounce" />;
      case 'like': return <Heart className="w-5 h-5 text-red-500 fill-red-500" />;
      case 'comment': return <MessageSquare className="w-5 h-5 text-primary" />;
      case 'verification': return <UserPlus className="w-5 h-5 text-success" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="animate-fade-in p-md space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-outline-variant/10 pb-3">
        <div>
          <h2 className="text-headline-sm font-bold text-on-surface">{t('notifications')}</h2>
          <p className="text-label-md text-text-muted">Updates from your colony circle</p>
        </div>
      </div>

      {/* Notifications list */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-6 text-text-muted">{t('loading')}</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-8 bg-surface-container-low rounded-xl border border-outline-variant/10">
            <Bell className="w-10 h-10 text-primary/40 mx-auto mb-2" />
            <h4 className="font-bold text-on-surface text-body-md">All caught up</h4>
            <p className="text-label-md text-text-muted mt-0.5">No new notifications.</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-xl border flex gap-3.5 transition-all ${
                notif.type === 'emergency'
                  ? 'bg-red-50/50 border-red-200'
                  : 'bg-card border-outline-variant/10 hover:border-primary/20'
              }`}
            >
              <div className="shrink-0 mt-0.5">{getNotifIcon(notif.type)}</div>
              <div>
                <h4 className={`font-bold text-body-md ${notif.type === 'emergency' ? 'text-danger' : 'text-on-surface'}`}>
                  {notif.title}
                </h4>
                <p className="text-body-md text-on-surface-variant leading-[1.3] mt-1">
                  {notif.body}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
