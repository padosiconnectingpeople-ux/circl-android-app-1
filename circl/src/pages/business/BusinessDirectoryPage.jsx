import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@config/firebase';
import useAuthStore from '@store/authStore';
import useTranslation from '@i18n/useTranslation';
import { BUSINESS_CATEGORIES } from '@config/constants';
import Button from '@components/common/Button';
import Avatar from '@components/common/Avatar';
import { Search, MapPin, Star, MessageCircle, Phone, Sparkles } from 'lucide-react';

const BusinessDirectoryPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const profile = useAuthStore((s) => s.profile);

  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  // Demo local businesses (realistic Indian hyperlocal content)
  const demoBusinesses = [
    {
      id: 'biz_1',
      name: 'Verma Kirana & General Store',
      category: 'Grocery',
      rating: 4.8,
      reviewCount: 34,
      address: 'Shop 2, Hill View Market, Bandra',
      whatsapp: '919876543210',
      logo: '',
      verified: true,
      description: 'Free home delivery within Sunshine Apartments. Fresh milk, bread, vegetables, and daily household items.',
    },
    {
      id: 'biz_2',
      name: 'Deluxe Hair Salon & Spa',
      category: 'Salon',
      rating: 4.5,
      reviewCount: 19,
      address: 'Shop 5, Building 4, Bandra West',
      whatsapp: '919876543211',
      logo: '',
      verified: false,
      description: 'Expert haircut, massage, hair styling and facial services at affordable prices.',
    }
  ];

  useEffect(() => {
    const fetchBusinesses = async () => {
      setLoading(true);
      try {
        const area = profile?.area || 'Bandra';
        let q = query(
          collection(db, 'businesses'),
          where('area', '==', area),
          orderBy('createdAt', 'desc')
        );
        if (activeCategory !== 'All') {
          q = query(
            collection(db, 'businesses'),
            where('area', '==', area),
            where('category', '==', activeCategory),
            orderBy('createdAt', 'desc')
          );
        }
        const snap = await getDocs(q);
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        if (docs.length > 0) {
          setBusinesses(docs);
        } else {
          setBusinesses(
            activeCategory === 'All'
              ? demoBusinesses
              : demoBusinesses.filter(b => b.category === activeCategory)
          );
        }
      } catch (e) {
        console.warn('Firestore load failed, showing fallback businesses:', e);
        setBusinesses(
          activeCategory === 'All'
            ? demoBusinesses
            : demoBusinesses.filter(b => b.category === activeCategory)
        );
      }
      setLoading(false);
    };

    fetchBusinesses();
  }, [profile, activeCategory]);

  const filteredBusinesses = businesses.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="animate-fade-in p-md space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-outline-variant/10 pb-3">
        <div>
          <h2 className="text-headline-sm font-bold text-on-surface">{t('businessDirectory')}</h2>
          <p className="text-label-md text-text-muted">Local services and shops near you</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          icon={Sparkles}
          onClick={() => navigate('/brandlaunch')}
          className="h-10 rounded-xl"
        >
          {t('brandLaunch')}
        </Button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search business or service..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-10"
        />
        <Search className="absolute left-3.5 top-3 w-4 h-4 text-text-muted" />
      </div>

      {/* Category List */}
      <div className="flex overflow-x-auto gap-2 py-1 hide-scrollbar">
        {['All', ...BUSINESS_CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`chip whitespace-nowrap ${
              activeCategory === cat ? 'chip-active' : 'chip-inactive'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Directory list */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-6 text-text-muted">{t('loading')}</div>
        ) : filteredBusinesses.length === 0 ? (
          <div className="text-center py-8 bg-surface-container-low rounded-xl border border-outline-variant/20 p-md">
            <Search className="w-10 h-10 text-primary/40 mx-auto mb-2" />
            <h4 className="font-bold text-on-surface">No Businesses Found</h4>
            <p className="text-label-md text-text-muted mt-1">Try another category or search term.</p>
          </div>
        ) : (
          filteredBusinesses.map((biz) => (
            <div
              key={biz.id}
              onClick={() => navigate(`/directory/${biz.id}`)}
              className="circl-card p-md border border-outline-variant/10 flex gap-4 cursor-pointer hover:border-primary/30 active:scale-[0.99] transition-all"
            >
              {/* Logo */}
              <Avatar name={biz.name} src={biz.logo} size="lg" verified={biz.verified} />

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-bold text-on-surface text-body-lg truncate">{biz.name}</h3>
                    <div className="flex items-center gap-0.5 text-warning">
                      <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                      <span className="text-label-md font-bold text-on-surface">{biz.rating}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-primary px-2 py-0.5 bg-primary/10 rounded-full inline-block mt-0.5">
                    {biz.category}
                  </span>
                  <p className="text-body-md text-on-surface-variant line-clamp-2 mt-1.5 leading-[1.3]">
                    {biz.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-surface-container-high/40">
                  <span className="text-[10px] text-text-muted flex-1 truncate flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-primary" /> {biz.address}
                  </span>

                  <a
                    href={`https://wa.me/${biz.whatsapp}`}
                    onClick={(e) => e.stopPropagation()}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-[11px] font-bold text-green-600 bg-green-50 px-2.5 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 fill-green-600" />
                    <span>Chat</span>
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BusinessDirectoryPage;
