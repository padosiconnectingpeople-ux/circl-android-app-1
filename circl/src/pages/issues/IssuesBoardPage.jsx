import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, orderBy, getDocs, updateDoc, arrayUnion, arrayRemove, doc } from 'firebase/firestore';
import { db } from '@config/firebase';
import useAuthStore from '@store/authStore';
import useTranslation from '@i18n/useTranslation';
import { ISSUE_CATEGORIES, ISSUE_STATUSES } from '@config/constants';
import Button from '@components/common/Button';
import Avatar from '@components/common/Avatar';
import { AlertTriangle, Plus, ThumbsUp, CheckCircle, MessageSquare } from 'lucide-react';

const IssuesBoardPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeStatus, setActiveStatus] = useState('open'); // 'open' | 'in_progress' | 'resolved'

  // Demo issues in case Firestore is empty (Mumbai/Bandra hyperlocal content)
  const demoIssues = [
    {
      id: 'issue_1',
      title: 'Water Leakage in Wing B Main Line',
      description: 'Water has been leaking from the main inlet of Wing B since morning. Requesting urgent plumber attention.',
      category: 'Water Supply',
      status: 'open',
      reporterName: 'Amit Shah',
      createdAt: new Date(),
      upvotes: [],
      commentsCount: 2,
    },
    {
      id: 'issue_2',
      title: 'Street Light Near Main Gate is Not Working',
      description: 'The street light is flickering and completely off after 8 PM, making it unsafe for residents walking at night.',
      category: 'Street Lights',
      status: 'in_progress',
      reporterName: 'Sneha Patil',
      createdAt: new Date(Date.now() - 86400000),
      upvotes: ['user1', 'user2'],
      commentsCount: 5,
    }
  ];

  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      try {
        const area = profile?.area || 'Bandra';
        const q = query(
          collection(db, 'issues'),
          where('area', '==', area),
          where('status', '==', activeStatus),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        if (docs.length > 0) {
          setIssues(docs);
        } else {
          setIssues(demoIssues.filter(i => i.status === activeStatus));
        }
      } catch (e) {
        console.warn('Firestore load failed, showing fallback demo issues:', e);
        setIssues(demoIssues.filter(i => i.status === activeStatus));
      }
      setLoading(false);
    };

    fetchIssues();
  }, [profile, activeStatus]);

  const handleUpvote = async (issueId) => {
    if (!user) return;
    const issue = issues.find(i => i.id === issueId);
    const hasUpvoted = issue?.upvotes?.includes(user.uid);

    try {
      const issueRef = doc(db, 'issues', issueId);
      await updateDoc(issueRef, {
        upvotes: hasUpvoted ? arrayRemove(user.uid) : arrayUnion(user.uid),
      });
    } catch (e) {
      console.warn('Real Firestore update failed, doing local update only.');
    }

    // Optimistic local state update
    setIssues(prev => prev.map(i => {
      if (i.id !== issueId) return i;
      const upvotes = i.upvotes || [];
      return {
        ...i,
        upvotes: hasUpvoted ? upvotes.filter(id => id !== user.uid) : [...upvotes, user.uid],
      };
    }));
  };

  return (
    <div className="animate-fade-in p-md space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-outline-variant/10 pb-3">
        <div>
          <h2 className="text-headline-sm font-bold text-on-surface">{t('issuesBoard')}</h2>
          <p className="text-label-md text-text-muted">Colony & Society issues directory</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => navigate('/issues/create')}
          className="h-10 rounded-xl"
        >
          {t('raiseIssue')}
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex bg-surface-container p-1 rounded-xl">
        {Object.entries(ISSUE_STATUSES).slice(0, 3).map(([key, value]) => (
          <button
            key={key}
            onClick={() => setActiveStatus(key)}
            className={`flex-1 py-2 text-center rounded-lg text-label-md font-bold transition-all duration-200 capitalize ${
              activeStatus === key
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {value.label}
          </button>
        ))}
      </div>

      {/* Issues list */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-6 text-text-muted">{t('loading')}</div>
        ) : issues.length === 0 ? (
          <div className="text-center py-8 bg-surface-container-low rounded-xl border border-outline-variant/20 p-md">
            <CheckCircle className="w-10 h-10 text-success mx-auto mb-2 opacity-50" />
            <h4 className="font-bold text-on-surface">All Clear!</h4>
            <p className="text-label-md text-text-muted mt-1">No active issues in this category.</p>
          </div>
        ) : (
          issues.map((issue) => {
            const hasVoted = issue.upvotes?.includes(user?.uid || '');
            return (
              <div key={issue.id} className="circl-card p-md border border-outline-variant/10 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[11px] font-extrabold text-primary uppercase tracking-wide">
                      {issue.category}
                    </span>
                    <h3 className="font-bold text-on-surface text-body-lg mt-0.5">{issue.title}</h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${ISSUE_STATUSES[issue.status]?.color}`}>
                    {ISSUE_STATUSES[issue.status]?.label}
                  </span>
                </div>

                <p className="text-body-md text-on-surface-variant leading-[1.4] line-clamp-2">
                  {issue.description}
                </p>

                <div className="flex items-center justify-between border-t border-surface-container-high/40 pt-3">
                  <div className="flex items-center gap-1.5">
                    <Avatar name={issue.reporterName} size="xs" />
                    <span className="text-label-sm text-text-muted">Reported by {issue.reporterName}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleUpvote(issue.id)}
                      className={`flex items-center gap-1 text-label-sm font-bold px-3 py-1.5 rounded-lg border transition-all ${
                        hasVoted
                          ? 'bg-primary/10 border-primary text-primary'
                          : 'border-outline-variant/30 text-on-surface-variant hover:bg-surface-container'
                      }`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span>{issue.upvotes?.length || 0}</span>
                    </button>
                    {issue.commentsCount > 0 && (
                      <div className="flex items-center gap-1 text-label-sm text-text-muted">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>{issue.commentsCount}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default IssuesBoardPage;
