import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@config/firebase';
import useAuthStore from '@store/authStore';
import useTranslation from '@i18n/useTranslation';
import Button from '@components/common/Button';
import { ArrowLeft, Target, CreditCard } from 'lucide-react';

const CreateAdPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);

  const [headline, setHeadline] = useState('');
  const [description, setDescription] = useState('');
  const [targetLevel, setTargetLevel] = useState('society'); // 'society' | 'colony' | 'area'
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayAndCreate = async () => {
    if (!headline.trim() || !description.trim() || !budget) return;
    setLoading(true);

    // Simulated Razorpay transaction logic
    try {
      const adData = {
        businessId: user?.uid || 'guest',
        businessName: profile?.name || 'Local Business',
        headline,
        description,
        targetLevel,
        targetLocation: targetLevel === 'society' ? profile?.society : targetLevel === 'colony' ? profile?.colony : profile?.area,
        budget: Number(budget),
        status: 'active',
        impressions: 0,
        clicks: 0,
        whatsappTaps: 0,
        paid: true,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'ads'), adData);
      navigate('/');
    } catch (e) {
      console.warn('Error saving ad campaign, directing home');
      navigate('/');
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in p-md space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-3">
        <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-surface-container transition-colors">
          <ArrowLeft className="w-6 h-6 text-on-surface" />
        </button>
        <h2 className="text-headline-sm font-bold text-on-surface flex-1">Create Ad Campaign</h2>
      </div>

      <div className="space-y-4">
        {/* Headline */}
        <div>
          <label className="text-label-md font-semibold text-on-surface mb-1 block">Ad Headline *</label>
          <input
            type="text"
            placeholder="e.g. Free Home Delivery Today!"
            value={headline}
            onChange={(e) => setHeadline(e.target.value)}
            className="input-field"
            maxLength={50}
          />
        </div>

        {/* Description */}
        <div>
          <label className="text-label-md font-semibold text-on-surface mb-1 block">Ad Copy / Body *</label>
          <textarea
            placeholder="Describe the offer. Include promo code if any..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field h-24 resize-none"
            maxLength={150}
          />
        </div>

        {/* Target Level */}
        <div>
          <label className="text-label-md font-semibold text-on-surface mb-1 block">Target Audience *</label>
          <div className="grid grid-cols-3 gap-2 bg-surface-container p-1 rounded-xl">
            {[
              { id: 'society', label: 'My Society' },
              { id: 'colony', label: 'My Colony' },
              { id: 'area', label: 'My Area' }
            ].map((lvl) => (
              <button
                key={lvl.id}
                type="button"
                onClick={() => setTargetLevel(lvl.id)}
                className={`py-2 text-center rounded-lg text-label-md font-bold transition-all duration-200 ${
                  targetLevel === lvl.id
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Budget */}
        <div>
          <label className="text-label-md font-semibold text-on-surface mb-1 block">Campaign Budget (₹) *</label>
          <input
            type="number"
            placeholder="e.g. 500"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="input-field"
          />
          <p className="text-[10px] text-text-muted mt-1 leading-[1.3]">
            💡 Higher budgets will display your ad more frequently in the home feed. Minimum campaign cost: ₹100.
          </p>
        </div>

        {/* Pay button */}
        <Button
          variant="primary"
          size="full"
          icon={CreditCard}
          loading={loading}
          disabled={!headline.trim() || !description.trim() || !budget}
          onClick={handlePayAndCreate}
          className="h-14 !rounded-2xl mt-4"
        >
          Pay with Razorpay & Launch Ad
        </Button>
      </div>
    </div>
  );
};

export default CreateAdPage;
