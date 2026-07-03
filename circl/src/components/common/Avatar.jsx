import React from 'react';
import { BadgeCheck } from 'lucide-react';

const sizeMap = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  '2xl': 'w-20 h-20',
  '3xl': 'w-24 h-24',
};

const badgeSizeMap = {
  xs: 'w-3 h-3',
  sm: 'w-3.5 h-3.5',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-5 h-5',
  '2xl': 'w-6 h-6',
  '3xl': 'w-7 h-7',
};

const Avatar = ({
  src,
  name = '',
  size = 'md',
  verified = false,
  online = false,
  className = '',
  onClick,
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`relative inline-flex shrink-0 ${className}`} onClick={onClick}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeMap[size]} rounded-full object-cover bg-surface-container`}
          loading="lazy"
        />
      ) : (
        <div
          className={`${sizeMap[size]} rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold`}
          style={{ fontSize: size === 'xs' ? '10px' : size === 'sm' ? '12px' : '14px' }}
        >
          {initials || '?'}
        </div>
      )}

      {/* Verified badge */}
      {verified && (
        <div className="absolute -bottom-0.5 -right-0.5">
          <BadgeCheck
            className={`${badgeSizeMap[size]} text-primary fill-primary stroke-white`}
          />
        </div>
      )}

      {/* Online indicator */}
      {online && (
        <div className="absolute bottom-0 right-0">
          <div className={`w-3 h-3 bg-green-500 rounded-full border-2 border-white`} />
        </div>
      )}
    </div>
  );
};

export default Avatar;
