import React from 'react';

const Skeleton = ({ className = '', variant = 'rect', count = 1 }) => {
  const baseClass = 'skeleton rounded-lg';

  const variantClasses = {
    rect: 'w-full h-4',
    circle: 'w-10 h-10 rounded-full',
    card: 'w-full h-48 rounded-card',
    avatar: 'w-12 h-12 rounded-full',
    text: 'w-3/4 h-3',
    title: 'w-1/2 h-5',
    button: 'w-24 h-9 rounded-button',
    image: 'w-full aspect-video rounded-xl',
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${baseClass} ${variantClasses[variant]} ${className}`}
        />
      ))}
    </>
  );
};

// Post card skeleton
export const PostSkeleton = () => (
  <div className="bg-card rounded-card shadow-card p-md space-y-3 animate-fade-in">
    <div className="flex items-center gap-3">
      <Skeleton variant="avatar" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="title" />
        <Skeleton variant="text" className="w-2/3" />
      </div>
    </div>
    <Skeleton variant="rect" className="h-3" />
    <Skeleton variant="rect" className="h-3 w-4/5" />
    <Skeleton variant="image" />
    <div className="flex justify-between pt-2">
      <Skeleton variant="button" />
      <Skeleton variant="button" />
      <Skeleton variant="button" />
    </div>
  </div>
);

// Story bar skeleton
export const StorySkeleton = () => (
  <div className="flex gap-md px-container-margin py-md">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex flex-col items-center gap-xs">
        <Skeleton variant="circle" className="w-16 h-16" />
        <Skeleton variant="text" className="w-12" />
      </div>
    ))}
  </div>
);

// Profile skeleton
export const ProfileSkeleton = () => (
  <div className="space-y-4 p-md">
    <div className="flex items-center gap-4">
      <Skeleton variant="circle" className="w-20 h-20" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="title" />
        <Skeleton variant="text" />
      </div>
    </div>
    <div className="flex gap-4">
      <Skeleton variant="button" className="flex-1" />
      <Skeleton variant="button" className="flex-1" />
      <Skeleton variant="button" className="flex-1" />
    </div>
  </div>
);

export default Skeleton;
