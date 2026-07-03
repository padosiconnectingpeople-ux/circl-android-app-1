import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@config/firebase';
import useAuthStore from '@store/authStore';
import useTranslation from '@i18n/useTranslation';
import Button from '@components/common/Button';
import Avatar from '@components/common/Avatar';
import { Calendar, MapPin, Users, Plus, Check } from 'lucide-react';

const EventsPage = () => {
  const { t } = useTranslation();
  const profile = useAuthStore((s) => s.profile);

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Demo Events
  const demoEvents = [
    {
      id: 'event_1',
      title: 'Monsoon Tree Plantation Drive',
      description: 'Join us this Saturday for our annual green drive. Planting 100 saplings in the society park.',
      date: '12/07/2026',
      time: '08:30 AM',
      location: 'Central Lawn, Sunshine Apartments',
      category: 'Announcements',
      attendeesCount: 45,
      coverPhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpd-WhuCz8_4G10vss5W6yVYnroxKMx5inOk6ndU0AOqrNhgLtgVq7L92ldHj3m_bP9MWiQjzfNn9wmHRo8WewYaIoB9iZMqjejA4jCCaEy8fL1qT5Vs0DLdHv7ijwvJek5tJboCLpRG_0D2kwv65eyyRYgn8rE6eR5gzd6-ceWIOnXoAfmJdUASMBJrUIcoRMSVYMSEJ1B38TX_mLo65aVqi2EieHSdlrPRVNchRStsdU7qvS9Tr-OJ5ope7SWFgisncRgEjZZM3s',
    },
    {
      id: 'event_2',
      title: 'Sunday Morning Yoga Session',
      description: 'Weekly yoga and meditation session led by professional instructor resident Priya Sharma.',
      date: '05/07/2026',
      time: '06:30 AM',
      location: 'Clubhouse Rooftop, Sunshine Apts',
      category: 'Events',
      attendeesCount: 22,
      coverPhoto: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEc25BNa_b3IXSKKJtVDmVqLF2_Hz487OXc9K8r3V8wyqitnZbAMTQEZBOEgddE8urR-WgKLyDMnwzbkuo0ZiAIJptdh0Lu08xlvsOOiCLqQc-bdPYD1CjB8thVlegfBm5yUd_vnq5uVB3HQ0U9VdrQKNOU18YIAKSNhqN4ycgxGOphVA_tYsCWOWOM_ev3N_q64eP0KuOls7skEcL2aerI1ndWu8BYWiOMkiyyBeASEC5_wDS6vW8teg6reDzIR49NkdN7AhIsgp6',
    }
  ];

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const colony = profile?.colony || 'Hill View';
        const q = query(
          collection(db, 'events'),
          where('colony', '==', colony),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        if (docs.length > 0) {
          setEvents(docs);
        } else {
          setEvents(demoEvents);
        }
      } catch (e) {
        console.warn('Firestore load failed, showing fallback events:', e);
        setEvents(demoEvents);
      }
      setLoading(false);
    };

    fetchEvents();
  }, [profile]);

  return (
    <div className="animate-fade-in p-md space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-outline-variant/10 pb-3">
        <div>
          <h2 className="text-headline-sm font-bold text-on-surface">{t('events')}</h2>
          <p className="text-label-md text-text-muted">Colony programs and meetups</p>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-6 text-text-muted">{t('loading')}</div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="circl-card overflow-hidden border border-outline-variant/10 flex flex-col">
              {/* Event Image */}
              <div className="aspect-video w-full bg-surface-container overflow-hidden">
                <img src={event.coverPhoto} alt={event.title} className="w-full h-full object-cover" />
              </div>

              {/* Event Details */}
              <div className="p-md space-y-3">
                <div>
                  <h3 className="font-bold text-on-surface text-headline-sm leading-[1.2]">{event.title}</h3>
                  <p className="text-body-md text-on-surface-variant leading-[1.4] mt-1.5 line-clamp-2">
                    {event.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-surface-container-high/40 text-body-md text-on-surface-variant font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-primary shrink-0" />
                    <span>{event.date} at {event.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary shrink-0" />
                    <span className="truncate">{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-primary shrink-0" />
                    <span>{event.attendeesCount} residents attending</span>
                  </div>
                </div>

                <div className="pt-2 flex gap-3">
                  <button className="flex-1 py-2.5 bg-primary text-white rounded-xl text-label-md font-bold hover:bg-primary/95 transition-all flex items-center justify-center gap-1">
                    <Check className="w-4 h-4" />
                    <span>Attending</span>
                  </button>
                  <button className="px-4 py-2.5 rounded-xl border border-outline-variant/30 text-label-md font-bold hover:bg-surface-container transition-all">
                    Maybe
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventsPage;
