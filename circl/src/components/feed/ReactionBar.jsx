import React, { useState } from 'react';
import { REACTIONS } from '@config/constants';

const ReactionBar = ({ reactions = {}, onReact, userId }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Group reactions count
  const reactionCounts = Object.values(reactions).reduce((acc, current) => {
    if (current) acc[current] = (acc[current] || 0) + 1;
    return acc;
  }, {});

  const sortedReactions = Object.entries(reactionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2); // Show top 2 reaction emojis

  const totalReactions = Object.values(reactionCounts).reduce((a, b) => a + b, 0);
  const userReaction = userId ? reactions[userId] : null;

  return (
    <div className="flex items-center justify-between px-md py-sm border-t border-surface-container-high relative">
      {/* Active reaction counts */}
      <div className="flex items-center gap-2">
        {totalReactions > 0 ? (
          <>
            <div className="flex -space-x-1.5">
              {sortedReactions.map(([type]) => {
                const item = REACTIONS.find((r) => r.id === type);
                return (
                  <span key={type} className="text-[16px] filter drop-shadow">
                    {item?.emoji}
                  </span>
                );
              })}
            </div>
            <span className="text-label-sm text-text-muted">
              {totalReactions} {totalReactions === 1 ? 'reaction' : 'reactions'}
            </span>
          </>
        ) : (
          <span className="text-label-sm text-text-muted">Be the first to react</span>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-6 text-on-surface-variant relative">
        {/* Quick Reaction Button */}
        <div
          className="relative"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <button
            onClick={() => onReact(userReaction ? userReaction : 'love')}
            className={`transition-all duration-200 active:scale-125 flex items-center gap-1 ${
              userReaction ? 'text-primary' : 'hover:text-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {userReaction ? 'favorite' : 'favorite'}
            </span>
          </button>

          {/* Emojis selector tooltip */}
          {showTooltip && (
            <div className="absolute bottom-full right-0 mb-2 bg-card border border-outline-variant/20 rounded-full shadow-modal px-2 py-1.5 flex gap-2.5 animate-scale-in z-30">
              {REACTIONS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onReact(item.id);
                    setShowTooltip(false);
                  }}
                  className="text-lg hover:scale-130 active:scale-90 transition-transform"
                  title={item.label}
                >
                  {item.emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="hover:text-primary transition-colors flex items-center">
          <span className="material-symbols-outlined text-[20px]">comment</span>
        </button>

        <button className="hover:text-primary transition-colors flex items-center">
          <span className="material-symbols-outlined text-[20px]">share</span>
        </button>
      </div>
    </div>
  );
};

export default ReactionBar;
