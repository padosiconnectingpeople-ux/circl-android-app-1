import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, getDocs, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '@config/firebase';
import useAuthStore from '@store/authStore';
import useTranslation from '@i18n/useTranslation';
import Button from '@components/common/Button';
import Avatar from '@components/common/Avatar';
import { ArrowLeft, Star, Phone, MessageCircle, Globe, Plus, Check } from 'lucide-react';

const BusinessProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);

  const [biz, setBiz] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchBizData = async () => {
      setLoading(true);
      try {
        const bizRef = doc(db, 'businesses', id);
        const bizSnap = await getDoc(bizRef);

        if (bizSnap.exists()) {
          setBiz({ id: bizSnap.id, ...bizSnap.data() });

          // Load reviews
          const reviewsSnap = await getDocs(
            query(collection(db, 'businesses', id, 'reviews'), orderBy('createdAt', 'desc'))
          );
          setReviews(reviewsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        } else {
          // Fallback static mock matching Verma Kirana
          setBiz({
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
            services: ['Home Delivery', 'Monthly Credit Available', 'Fresh Vegetables'],
            timings: '8:00 AM - 10:00 PM',
            website: 'https://vermakirana.com',
          });
          setReviews([
            {
              id: 'rev_1',
              userName: 'Jyoti Mehta',
              rating: 5,
              comment: 'Verma ji always delivers on time. Very helpful behavior!',
              createdAt: { toDate: () => new Date() },
            }
          ]);
        }
      } catch (e) {
        console.warn('Error loading business details:', e);
      }
      setLoading(false);
    };

    fetchBizData();
  }, [id]);

  const handleAddReview = async () => {
    if (!reviewText.trim()) return;
    setSubmitting(true);

    const reviewData = {
      userId: user?.uid || 'guest',
      userName: profile?.name || 'Neighbor',
      rating,
      comment: reviewText,
      createdAt: new Date(),
    };

    try {
      await addDoc(collection(db, 'businesses', id, 'reviews'), {
        ...reviewData,
        createdAt: serverTimestamp(),
      });
    } catch (e) {
      console.warn('Error adding review to Firestore, updating locally');
    }

    setReviews(prev => [reviewData, ...prev]);
    setReviewText('');
    setSubmitting(false);
  };

  if (loading) {
    return <div className="text-center py-12 text-text-muted">{t('loading')}</div>;
  }

  if (!biz) {
    return <div className="text-center py-12 text-danger">Business not found</div>;
  }

  return (
    <div className="animate-fade-in p-md space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-3">
        <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-surface-container transition-colors">
          <ArrowLeft className="w-6 h-6 text-on-surface" />
        </button>
        <h2 className="text-headline-sm font-bold text-on-surface flex-1">Business Details</h2>
      </div>

      {/* Main Info */}
      <div className="flex items-start gap-4">
        <Avatar name={biz.name} src={biz.logo} size="2xl" verified={biz.verified} />
        <div className="flex-1 space-y-1">
          <h2 className="text-headline-md font-bold text-on-surface">{biz.name}</h2>
          <span className="text-label-md font-bold text-primary px-3 py-1 bg-primary/10 rounded-full inline-block">
            {biz.category}
          </span>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span className="text-body-md font-bold">{biz.rating}</span>
            <span className="text-label-md text-text-muted">({biz.reviewCount || reviews.length} reviews)</span>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-body-lg text-on-surface-variant leading-[1.4]">{biz.description}</p>

      {/* Services List */}
      {biz.services && biz.services.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-bold text-on-surface text-body-md">Services Offered:</h3>
          <div className="grid grid-cols-2 gap-2">
            {biz.services.map((srv, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-surface-container-low px-3 py-2 rounded-xl border border-outline-variant/10">
                <Check className="w-4 h-4 text-success" />
                <span className="text-body-md text-on-surface-variant">{srv}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <a
          href={`https://wa.me/${biz.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-green-600 text-white font-bold text-body-md hover:bg-green-700 active:scale-[0.98] transition-all"
        >
          <MessageCircle className="w-5 h-5 fill-white" />
          <span>{t('whatsapp')}</span>
        </a>
        <a
          href={`tel:${biz.whatsapp}`}
          className="flex items-center justify-center gap-2 h-14 rounded-2xl bg-primary text-white font-bold text-body-md hover:bg-primary/95 active:scale-[0.98] transition-all"
        >
          <Phone className="w-5 h-5 fill-white text-white" />
          <span>{t('callNow')}</span>
        </a>
      </div>

      {/* Reviews section */}
      <div className="border-t border-outline-variant/10 pt-4 space-y-4">
        <h3 className="font-bold text-on-surface text-headline-sm">Customer Reviews</h3>

        {/* Add Review */}
        <div className="bg-surface-container-low p-3 rounded-2xl border border-outline-variant/10 space-y-3">
          <div className="flex items-center gap-2">
            <span className="text-label-md text-text-muted font-bold">Your Rating:</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onClick={() => setRating(star)}>
                  <Star className={`w-6 h-6 ${star <= rating ? 'fill-warning text-warning' : 'text-outline-variant'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Write a public review..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="input-field flex-1"
            />
            <Button
              variant="primary"
              size="sm"
              loading={submitting}
              onClick={handleAddReview}
              className="rounded-xl px-4"
            >
              Post
            </Button>
          </div>
        </div>

        {/* Review list */}
        <div className="space-y-3">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-card p-3 rounded-xl border border-outline-variant/10 space-y-2">
              <div className="flex justify-between items-start">
                <span className="font-bold text-on-surface text-body-md">{rev.userName}</span>
                <div className="flex gap-0.5">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-warning text-warning" />
                  ))}
                </div>
              </div>
              <p className="text-body-md text-on-surface-variant leading-[1.3]">{rev.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BusinessProfilePage;
