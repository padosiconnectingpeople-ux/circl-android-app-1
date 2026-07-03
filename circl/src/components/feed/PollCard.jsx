import React, { useState } from 'react';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '@config/firebase';

const PollCard = ({ poll = {}, postId, userId }) => {
  const [votedOption, setVotedOption] = useState(null);

  const {
    question = 'Should we change the society security timing to 10 PM?',
    options = [
      { id: '1', text: 'Yes, 10 PM is better' },
      { id: '2', text: 'No, keep it 11 PM' },
    ],
    votes = {}, // map of optionId -> array of userIds
  } = poll;

  const totalVotes = Object.values(votes).reduce((sum, vArr) => sum + (vArr?.length || 0), 0);

  // Find if user has already voted
  const userVoteOptionId = Object.entries(votes).find(([_, uids]) =>
    uids?.includes(userId)
  )?.[0];

  const handleVote = async (optionId) => {
    if (userVoteOptionId || votedOption) return; // Prevent double vote
    setVotedOption(optionId);

    try {
      const postRef = doc(db, 'posts', postId);
      await updateDoc(postRef, {
        [`poll.votes.${optionId}`]: arrayUnion(userId),
      });
    } catch (e) {
      console.error('Error submitting vote:', e);
    }
  };

  return (
    <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/20 mt-2 space-y-3">
      <h4 className="font-semibold text-body-md text-on-surface">{question}</h4>
      <div className="space-y-2">
        {options.map((opt) => {
          const optVotes = votes[opt.id]?.length || 0;
          const percentage = totalVotes > 0 ? Math.round((optVotes / totalVotes) * 100) : 0;
          const isUserVote = userVoteOptionId === opt.id || votedOption === opt.id;

          return (
            <button
              key={opt.id}
              onClick={() => handleVote(opt.id)}
              disabled={!!userVoteOptionId || !!votedOption}
              className="w-full relative text-left p-3 rounded-lg border border-outline-variant/30 overflow-hidden hover:bg-surface-container transition-colors disabled:hover:bg-transparent"
            >
              {/* Progress bar background */}
              {(!!userVoteOptionId || !!votedOption) && (
                <div
                  className="absolute inset-y-0 left-0 bg-primary/10 transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              )}

              <div className="relative flex justify-between items-center text-body-md font-medium">
                <span className={isUserVote ? 'text-primary font-bold' : 'text-on-surface'}>
                  {opt.text}
                </span>
                {(!!userVoteOptionId || !!votedOption) && (
                  <span className="text-label-md text-text-muted">{percentage}%</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
      {(!!userVoteOptionId || !!votedOption) && (
        <p className="text-label-sm text-text-muted text-right">
          {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
        </p>
      )}
    </div>
  );
};

export default PollCard;
