import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@config/firebase';
import useAuthStore from '@store/authStore';
import useTranslation from '@i18n/useTranslation';
import Button from '@components/common/Button';
import Avatar from '@components/common/Avatar';
import { Plus, Tag, Search, MessageSquare, Phone } from 'lucide-react';

const MARKETPLACE_CATEGORIES = ['All', 'Electronics', 'Furniture', 'Vehicles', 'Books', 'Clothing', 'Kitchen', 'Other'];

const MarketplacePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const profile = useAuthStore((s) => s.profile);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  // Demo marketplace items
  const demoListings = [
    {
      id: 'listing_1',
      title: 'Wooden Study Table',
      description: 'Solid wood study table in excellent condition. Dimensions: 4x2 feet. Has 2 drawers.',
      price: 2500,
      free: false,
      condition: 'Like New',
      category: 'Furniture',
      sellerName: 'Rohan Gupta',
      sellerPhoto: '',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD57y22yep_dAf1pa-x-40iow6s5oCbCUPl2WCK_7iJz_6g21pyA3EVs1HLXgsx0oAlCgi8iev7q8hbw0iG_r7E5nzkqxDflVbqBj03GLYuN71omGJgNE2zYT56OkiILQtwkkH75jh7Xygtm_WBQmwALZPmPP2kZe1U2KyiA4muV2S24l71L864w9DxSmArn5ohltpdEi99J_z_rEUBgkivn1cH-QylcxBjhMz7crpoIcDR5LF_h82i7Fbrgd-A6V7et3pxa5k1ktlG',
      createdAt: new Date(),
    },
    {
      id: 'listing_2',
      title: 'Vikas Grammar Class 10 Book',
      description: 'English grammar book by Vikas Publication. Clean pages, no markings.',
      price: 0,
      free: true,
      condition: 'Good',
      category: 'Books',
      sellerName: 'Jyoti Mehta',
      sellerPhoto: '',
      photo: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpd-WhuCz8_4G10vss5W6yVYnroxKMx5inOk6ndU0AOqrNhgLtgVq7L92ldHj3m_bP9MWiQjzfNn9wmHRo8WewYaIoB9iZMqjejA4jCCaEy8fL1qT5Vs0DLdHv7ijwvJek5tJboCLpRG_0D2kwv65eyyRYgn8rE6eR5gzd6-ceWIOnXoAfmJdUASMBJrUIcoRMSVYMSEJ1B38TX_mLo65aVqi2EieHSdlrPRVNchRStsdU7qvS9Tr-OJ5ope7SWFgisncRgEjZZM3s',
      createdAt: new Date(Date.now() - 172800000),
    }
  ];

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const colony = profile?.colony || 'Hill View';
        let q = query(
          collection(db, 'marketplace'),
          where('colony', '==', colony),
          orderBy('createdAt', 'desc')
        );
        if (activeCategory !== 'All') {
          q = query(
            collection(db, 'marketplace'),
            where('colony', '==', colony),
            where('category', '==', activeCategory),
            orderBy('createdAt', 'desc')
          );
        }
        const snap = await getDocs(q);
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        if (docs.length > 0) {
          setListings(docs);
        } else {
          setListings(
            activeCategory === 'All'
              ? demoListings
              : demoListings.filter(l => l.category === activeCategory)
          );
        }
      } catch (e) {
        console.warn('Firestore load failed, showing fallback marketplace listings:', e);
        setListings(
          activeCategory === 'All'
            ? demoListings
            : demoListings.filter(l => l.category === activeCategory)
        );
      }
      setLoading(false);
    };

    fetchListings();
  }, [profile, activeCategory]);

  return (
    <div className="animate-fade-in p-md space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-outline-variant/10 pb-3">
        <div>
          <h2 className="text-headline-sm font-bold text-on-surface">{t('marketplace')}</h2>
          <p className="text-label-md text-text-muted">Buy or sell within your colony</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => navigate('/marketplace/create')}
          className="h-10 rounded-xl"
        >
          {t('sellItem')}
        </Button>
      </div>

      {/* Category Chips */}
      <div className="flex overflow-x-auto gap-2 py-1 hide-scrollbar">
        {MARKETPLACE_CATEGORIES.map((cat) => (
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

      {/* Grid */}
      {loading ? (
        <div className="text-center py-6 text-text-muted">{t('loading')}</div>
      ) : listings.length === 0 ? (
        <div className="text-center py-8 bg-surface-container-low rounded-xl border border-outline-variant/20 p-md">
          <Tag className="w-10 h-10 text-primary/40 mx-auto mb-2" />
          <h4 className="font-bold text-on-surface">No Listings Found</h4>
          <p className="text-label-md text-text-muted mt-1">Be the first to put up an item for sale!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {listings.map((item) => (
            <div key={item.id} className="circl-card overflow-hidden border border-outline-variant/15 flex flex-col">
              {/* Product Image */}
              <div className="aspect-square bg-surface-container overflow-hidden relative">
                {item.photo ? (
                  <img src={item.photo} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-text-muted bg-surface-container-high/40">
                    <Tag className="w-8 h-8 opacity-30" />
                  </div>
                )}
                {/* Price tag */}
                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-lg text-label-md font-bold">
                  {item.free ? t('free') : `₹${item.price}`}
                </div>
              </div>

              {/* Title & Details */}
              <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="font-bold text-on-surface text-body-md line-clamp-1">{item.title}</h3>
                  <span className="text-[10px] text-text-muted mt-0.5 inline-block">
                    Condition: <strong className="text-on-surface-variant">{item.condition}</strong>
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-surface-container-high/40 pt-2">
                  <div className="flex items-center gap-1">
                    <Avatar name={item.sellerName} src={item.sellerPhoto} size="xs" />
                    <span className="text-[9px] text-text-muted truncate max-w-[60px]">{item.sellerName}</span>
                  </div>
                  <button className="p-1 rounded-lg bg-primary/10 text-primary active:scale-95 transition-transform">
                    <Phone className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MarketplacePage;
