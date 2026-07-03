import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { BadgeCheck, MoreVertical, Share2 } from 'lucide-react';
import Avatar from '@components/common/Avatar';
import ReactionBar from './ReactionBar';
import PollCard from './PollCard';
import useFeedStore from '@store/feedStore';
import useTranslation from '@i18n/useTranslation';
import { POST_CATEGORIES } from '@config/constants';

const PostCard = ({ post = {}, userId }) => {
  const { toggleReaction, toggleSave } = useFeedStore();
  const { t } = useTranslation();

  const {
    id,
    authorName = 'Neighbor',
    authorPhoto = '',
    verified = false,
    content = '',
    photos = [],
    video = '',
    category = 'general',
    createdAt = new Date(),
    likes = [],
    saves = [],
    reactions = {},
    commentsCount = 0,
    poll = null,
    anonymous = false,
    city = '',
    area = '',
    colony = '',
    society = '',
  } = post;

  const handleReact = (type) => {
    if (!userId) return;
    toggleReaction(id, userId, type);
  };

  const getCategoryDetails = () => {
    return POST_CATEGORIES.find((cat) => cat.id === category) || POST_CATEGORIES[7]; // Default to general
  };

  const catDetails = getCategoryDetails();

  // Format breadcrumbs: Mumbai › Bandra › Hill View › Sunshine
  const breadcrumbs = [city, area, colony, society]
    .filter(Boolean)
    .join(' › ');

  return (
    <article className="bg-card rounded-xl shadow-card overflow-hidden border border-outline-variant/10 animate-fade-in">
      {/* Header */}
      <div className="p-md flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar
            src={anonymous ? '' : authorPhoto}
            name={anonymous ? 'Anonymous' : authorName}
            verified={!anonymous && verified}
            size="md"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <h3 className="font-bold text-on-surface text-body-md">
                {anonymous ? 'Anonymous Neighbor' : authorName}
              </h3>
              {!anonymous && verified && (
                <BadgeCheck className="w-4 h-4 text-primary fill-primary stroke-white" />
              )}
              {/* Category Badge */}
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ml-2 ${catDetails.color}`}>
                {catDetails.emoji} {catDetails.label}
              </span>
            </div>
            <span className="text-[10px] text-text-muted font-medium mt-0.5 truncate max-w-[250px]">
              {breadcrumbs}
            </span>
          </div>
        </div>

        <button className="text-text-muted hover:text-on-surface p-1 rounded-full hover:bg-surface-container transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="px-md pb-md">
        <p className="font-body-lg text-body-lg leading-[1.5] text-on-surface-variant whitespace-pre-wrap">
          {content}
        </p>

        {/* Custom Poll content if present */}
        {poll && <PollCard poll={poll} postId={id} userId={userId} />}
      </div>

      {/* Media elements */}
      {photos && photos.length > 0 && (
        <div className="w-full bg-surface-container overflow-hidden">
          <img
            src={photos[0]}
            alt="Post attachment"
            className="w-full h-auto max-h-[300px] object-cover"
            loading="lazy"
          />
        </div>
      )}

      {/* Footer */}
      <div className="px-md py-2 flex items-center justify-between text-label-sm text-text-muted border-t border-surface-container-high/40">
        <span>
          {createdAt instanceof Date
            ? formatDistanceToNow(createdAt, { addSuffix: true })
            : 'Just now'}
        </span>
        {commentsCount > 0 && (
          <span>
            {commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}
          </span>
        )}
      </div>

      {/* Reaction Bar */}
      <ReactionBar
        reactions={reactions}
        onReact={handleReact}
        userId={userId}
      />
    </article>
  );
};

export default PostCard;
