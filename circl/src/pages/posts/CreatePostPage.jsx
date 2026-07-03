import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, BarChart2, ArrowLeft, Send } from 'lucide-react';
import Button from '@components/common/Button';
import useFeedStore from '@store/feedStore';
import useAuthStore from '@store/authStore';
import useTranslation from '@i18n/useTranslation';
import { POST_CATEGORIES } from '@config/constants';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);
  const createPost = useFeedStore((s) => s.createPost);

  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');
  const [anonymous, setAnonymous] = useState(false);
  const [postType, setPostType] = useState('text'); // 'text' | 'poll' | 'photo'
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!content.trim() && postType === 'text') return;
    setLoading(true);

    const postData = {
      authorId: user?.uid || 'guest',
      authorName: profile?.name || 'Neighbor',
      authorPhoto: profile?.photoURL || '',
      verified: profile?.verified || false,
      content,
      category,
      anonymous,
      type: postType,
      city: profile?.city || 'Mumbai',
      area: profile?.area || 'Bandra',
      colony: profile?.colony || 'Hill View',
      society: profile?.society || 'Sunshine Apts',
    };

    if (postType === 'poll') {
      postData.poll = {
        question: pollQuestion,
        options: pollOptions.filter(o => o.trim()).map((o, i) => ({ id: (i+1).toString(), text: o })),
        votes: {},
      };
    }

    const res = await createPost(postData);
    setLoading(false);
    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div className="animate-fade-in p-md space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-outline-variant/10 pb-3">
        <button onClick={() => navigate(-1)} className="p-1 rounded-full hover:bg-surface-container transition-colors">
          <ArrowLeft className="w-6 h-6 text-on-surface" />
        </button>
        <h2 className="text-headline-sm font-bold text-on-surface flex-1">{t('createPost')}</h2>
      </div>

      {/* Editor */}
      <div className="space-y-4">
        {/* Category Picker */}
        <div className="space-y-1">
          <label className="text-label-md font-semibold text-on-surface">{t('postCategories')}</label>
          <div className="flex overflow-x-auto gap-2 py-1 hide-scrollbar">
            {POST_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`chip whitespace-nowrap ${
                  category === cat.id ? 'chip-active' : 'chip-inactive'
                }`}
              >
                {cat.emoji} {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t('newPost')}
          className="w-full min-h-[150px] p-4 bg-surface-container rounded-xl border border-outline-variant/30 text-body-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
        />

        {/* Dynamic Poll Creator */}
        {postType === 'poll' && (
          <div className="bg-surface-container/50 p-4 rounded-xl border border-outline-variant/20 space-y-3">
            <input
              type="text"
              placeholder="Ask a question..."
              value={pollQuestion}
              onChange={(e) => setPollQuestion(e.target.value)}
              className="input-field font-semibold"
            />
            <div className="space-y-2">
              {pollOptions.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...pollOptions];
                    newOpts[i] = e.target.value;
                    setPollOptions(newOpts);
                  }}
                  className="input-field py-2"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setPollOptions([...pollOptions, ''])}
              className="text-label-md font-bold text-primary hover:underline"
            >
              + Add Option
            </button>
          </div>
        )}

        {/* Bottom Options bar */}
        <div className="flex items-center justify-between border-t border-outline-variant/10 pt-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPostType('text')}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl border transition-colors ${postType === 'text' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant/50 text-on-surface hover:border-primary hover:bg-surface-container'}`}
            >
              <MessageSquare className="w-5 h-5" />
              <span className="text-label-md font-semibold">{t('text')}</span>
            </button>

            <button
              type="button"
              onClick={() => setPostType('poll')}
              className={`flex items-center gap-2 px-3 py-2 rounded-2xl border transition-colors ${postType === 'poll' ? 'border-primary bg-primary/10 text-primary' : 'border-outline-variant/50 text-on-surface hover:border-primary hover:bg-surface-container'}`}
            >
              <BarChart2 className="w-5 h-5" />
              <span className="text-label-md font-semibold">{t('poll')}</span>
            </button>
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="rounded text-primary focus:ring-primary border-outline-variant"
            />
            <span className="text-label-md text-text-muted font-semibold">{t('anonymous')}</span>
          </label>
        </div>

        {/* Submit */}
        <Button
          variant="primary"
          size="full"
          icon={Send}
          loading={loading}
          onClick={handleCreate}
          className="h-14 !rounded-2xl mt-4"
        >
          Post to Circle
        </Button>
      </div>
    </div>
  );
};

export default CreatePostPage;
