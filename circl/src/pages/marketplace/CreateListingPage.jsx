import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@config/firebase';
import useAuthStore from '@store/authStore';
import useTranslation from '@i18n/useTranslation';
import { ITEM_CONDITIONS } from '@config/constants';
import Button from '@components/common/Button';
import { ArrowLeft, Send } from 'lucide-react';

const MARKETPLACE_CATEGORIES = ['Electronics', 'Furniture', 'Vehicles', 'Books', 'Clothing', 'Kitchen', 'Other'];

const CreateListingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(MARKETPLACE_CATEGORIES[0]);
  const [price, setPrice] = useState('');
  const [free, setFree] = useState(false);
  const [condition, setCondition] = useState(ITEM_CONDITIONS[0]);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim() || !description.trim() || (!price && !free)) return;
    setLoading(true);

    try {
      await addDoc(collection(db, 'marketplace'), {
        title,
        description,
        category,
        price: free ? 0 : Number(price),
        free,
        condition,
        sellerId: user?.uid || 'guest',
        sellerName: profile?.name || 'Neighbor',
        sellerPhoto: profile?.photoURL || '',
        verified: profile?.verified || false,
        active: true,
        city: profile?.city || 'Mumbai',
        area: profile?.area || 'Bandra',
        colony: profile?.colony || 'Hill View',
        society: profile?.society || 'Sunshine Apts',
        createdAt: serverTimestamp(),
      });
      navigate('/marketplace');
    } catch (e) {
      console.error('Error creating marketplace listing:', e);
      navigate('/marketplace');
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in p-md space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-3">
        <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-surface-container transition-colors">
          <ArrowLeft className="w-6 h-6 text-on-surface" />
        </button>
        <h2 className="text-headline-sm font-bold text-on-surface flex-1">{t('sellItem')}</h2>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="text-label-md font-semibold text-on-surface mb-1 block">Item Title *</label>
          <input
            type="text"
            placeholder="e.g. Study Table for Sale"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
          />
        </div>

        {/* Category */}
        <div>
          <label className="text-label-md font-semibold text-on-surface mb-1 block">Category *</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input-field"
          >
            {MARKETPLACE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="text-label-md font-semibold text-on-surface mb-1 block">Condition *</label>
          <select
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            className="input-field"
          >
            {ITEM_CONDITIONS.map((cond) => (
              <option key={cond} value={cond}>{cond}</option>
            ))}
          </select>
        </div>

        {/* Price & Free flag */}
        <div className="grid grid-cols-2 gap-4 items-center">
          <div>
            <label className="text-label-md font-semibold text-on-surface mb-1 block">Price (₹) *</label>
            <input
              type="number"
              placeholder="e.g. 1500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={free}
              className="input-field"
            />
          </div>
          <div className="pt-6">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={free}
                onChange={(e) => {
                  setFree(e.target.checked);
                  if (e.target.checked) setPrice('');
                }}
                className="rounded text-primary focus:ring-primary border-outline-variant"
              />
              <span className="text-label-md text-text-muted font-bold">{t('free')} / Give Away</span>
            </label>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="text-label-md font-semibold text-on-surface mb-1 block">Describe the item *</label>
          <textarea
            placeholder="Specify details about condition, usage time, defects, pickup location..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field h-24 resize-none"
          />
        </div>

        {/* Submit */}
        <Button
          variant="primary"
          size="full"
          icon={Send}
          loading={loading}
          disabled={!title.trim() || !description.trim() || (!price && !free)}
          onClick={handleCreate}
          className="h-14 !rounded-2xl"
        >
          Publish Listing
        </Button>
      </div>
    </div>
  );
};

export default CreateListingPage;
