import React, { useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useFeedStore from '@store/feedStore';
import useAuthStore from '@store/authStore';
import useTranslation from '@i18n/useTranslation';
import { LOCATION_LEVELS } from '@config/constants';
import PostCard from '@components/feed/PostCard';
import StoryBar from '@components/feed/StoryBar';
import { PostSkeleton } from '@components/common/Skeleton';
import { EmptyState } from '@components/common/ErrorBoundary';
import { PenSquare, RefreshCw } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const profile = useAuthStore((s) => s.profile);
  const user = useAuthStore((s) => s.user);
  const {
    posts, loading, loadingMore, hasMore, activeFilter,
    setActiveFilter, fetchPosts, subscribeFeed
  } = useFeedStore();

  const observerRef = useRef(null);
  const loadMoreRef = useRef(null);

  const activeProfile = profile || {
    city: 'Mumbai',
    area: 'Bandra',
    colony: 'Hill View',
    society: 'Sunshine Apts',
  };

  // Subscribe to real-time feed
  useEffect(() => {
    subscribeFeed(activeProfile);
    return () => useFeedStore.getState().cleanup();
  }, [profile, activeFilter]);

  // Infinite scroll observer
  const lastPostRef = useCallback((node) => {
    if (loadingMore) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore) {
        fetchPosts(activeProfile);
      }
    });
    if (node) observerRef.current.observe(node);
  }, [loadingMore, hasMore, activeProfile]);

  // Pull to refresh
  const handleRefresh = () => {
    useFeedStore.setState({ posts: [], lastDoc: null, hasMore: true });
    subscribeFeed(activeProfile);
  };

  return (
    <div className="pb-24">
      {/* Story Bar */}
      <StoryBar />

      {/* Location Filter Tabs */}
      <nav className="sticky top-[52px] bg-background/95 backdrop-blur-lg z-40 border-b border-outline-variant/15">
        <div className="flex overflow-x-auto hide-scrollbar px-container-margin gap-1">
          {LOCATION_LEVELS.map((level) => (
            <button
              key={level.id}
              onClick={() => setActiveFilter(level.id)}
              className={`py-3 px-4 whitespace-nowrap font-semibold text-body-md transition-all duration-200 border-b-2 ${
                activeFilter === level.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface/40 hover:text-on-surface/70'
              }`}
            >
              {t(level.id) || level.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Feed */}
      <div className="px-container-margin mt-3 flex flex-col gap-3">
        {/* Quick post prompt */}
        <button
          onClick={() => navigate('/create')}
          className="circl-card p-4 flex items-center gap-3 active:scale-[0.99] transition-transform"
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <PenSquare className="w-5 h-5 text-primary" />
          </div>
          <span className="text-body-md text-text-muted flex-1 text-left">
            {t('newPost')}
          </span>
          <span className="text-label-md text-primary font-semibold">{t('createPost')}</span>
        </button>

        {/* Loading state */}
        {loading && posts.length === 0 && (
          <div className="space-y-3">
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </div>
        )}

        {/* Posts */}
        {posts.map((post, index) => (
          <div
            key={post.id}
            ref={index === posts.length - 1 ? lastPostRef : null}
          >
            <PostCard post={post} userId={user?.uid} />
          </div>
        ))}

        {/* Loading more */}
        {loadingMore && (
          <div className="flex justify-center py-4">
            <RefreshCw className="w-5 h-5 text-primary animate-spin" />
          </div>
        )}

        {/* Empty state */}
        {!loading && posts.length === 0 && (
          <EmptyState
            icon={PenSquare}
            title={t('emptyFeed')}
            message="Start a conversation in your community"
            action={() => navigate('/create')}
            actionLabel={t('createPost')}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
