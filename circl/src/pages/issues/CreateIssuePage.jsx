import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@config/firebase';
import useAuthStore from '@store/authStore';
import useTranslation from '@i18n/useTranslation';
import { ISSUE_CATEGORIES } from '@config/constants';
import Button from '@components/common/Button';
import { ArrowLeft, Send } from 'lucide-react';

const CreateIssuePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(ISSUE_CATEGORIES[0]);
  const [anonymous, setAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!title.trim() || !description.trim()) return;
    setLoading(true);

    try {
      await addDoc(collection(db, 'issues'), {
        title,
        description,
        category,
        anonymous,
        status: 'open',
        reporterId: user?.uid || 'guest',
        reporterName: profile?.name || 'Neighbor',
        upvotes: [],
        commentsCount: 0,
        city: profile?.city || 'Mumbai',
        area: profile?.area || 'Bandra',
        colony: profile?.colony || 'Hill View',
        society: profile?.society || 'Sunshine Apts',
        createdAt: serverTimestamp(),
      });
      navigate('/issues');
    } catch (e) {
      console.error('Error creating issue:', e);
      // Fallback redirect if offline or no DB permission
      navigate('/issues');
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
        <h2 className="text-headline-sm font-bold text-on-surface flex-1">{t('raiseIssue')}</h2>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="text-label-md font-semibold text-on-surface mb-1 block">Issue Title *</label>
          <input
            type="text"
            placeholder="e.g. Lift in Wing A is making noise"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            maxLength={100}
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
            {ISSUE_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="text-label-md font-semibold text-on-surface mb-1 block">Describe the issue *</label>
          <textarea
            placeholder="Provide details about the issue so society committee or maintenance can check..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-field h-32 resize-none"
          />
        </div>

        {/* Anonymous check */}
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
            className="rounded text-primary focus:ring-primary border-outline-variant"
          />
          <span className="text-label-md text-text-muted font-semibold">{t('anonymous')}</span>
        </label>

        {/* Submit */}
        <Button
          variant="primary"
          size="full"
          icon={Send}
          loading={loading}
          disabled={!title.trim() || !description.trim()}
          onClick={handleCreate}
          className="h-14 !rounded-2xl"
        >
          Submit Issue
        </Button>
      </div>
    </div>
  );
};

export default CreateIssuePage;
