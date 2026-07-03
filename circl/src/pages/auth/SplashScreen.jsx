import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '@store/authStore';

const SplashScreen = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isOnboarded, loading } = useAuthStore();
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimating(false);
      if (!loading) {
        if (isAuthenticated && isOnboarded) {
          navigate('/', { replace: true });
        } else if (isAuthenticated && !isOnboarded) {
          navigate('/onboarding', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [loading, isAuthenticated, isOnboarded, navigate]);

  return (
    <div className="h-screen w-full flex flex-col overflow-hidden bg-surface">
      {/* Main Content */}
      <main className="flex-grow flex flex-col items-center justify-center relative">
        {/* Logo */}
        <div className="flex flex-col items-center gap-4 animate-fade-in-up">
          {/* Custom C Logo - Incomplete circle with center dot */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg
              className="absolute inset-0"
              width="128"
              height="128"
              viewBox="0 0 128 128"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 30C115 45 120 70 110 95C95 125 55 128 30 110C5 92 0 50 20 25C35 5 65 0 85 10"
                stroke="#5B4FE8"
                strokeWidth="12"
                strokeLinecap="round"
                className="animate-[draw_1.5s_ease-in-out_forwards]"
                style={{
                  strokeDasharray: 350,
                  strokeDashoffset: animating ? 350 : 0,
                  transition: 'stroke-dashoffset 1.5s ease-in-out',
                }}
              />
            </svg>
            {/* Center dot */}
            <div className="w-4 h-4 bg-primary rounded-full shadow-[0_0_15px_rgba(91,79,232,0.4)] animate-pulse-dot" />
          </div>

          {/* Brand name */}
          <h1 className="text-3xl font-extrabold tracking-tighter text-primary">
            Circl
          </h1>
        </div>

        {/* Tagline */}
        <div className="mt-6 opacity-0 animate-[fadeInUp_0.8s_0.6s_forwards]">
          <p className="text-label-md font-medium uppercase tracking-[0.2em] text-on-surface">
            Every Colony Has A Circle
          </p>
        </div>

        {/* India flag */}
        <div className="mt-2 opacity-0 animate-[fadeInUp_0.8s_0.8s_forwards]">
          <span className="text-2xl">🇮🇳</span>
        </div>

        {/* Waving Tree SVGs */}
        <svg className="absolute bottom-0 left-4 w-24 h-36 animate-tree-left opacity-80" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M45 150 C45 130 48 100 50 80 C52 100 55 130 55 150 Z" fill="#78350F" />
          <path d="M50 20 C25 50 15 80 50 100 C85 80 75 50 50 20 Z" fill="#22C55E" />
          <path d="M50 40 C35 60 25 80 50 95 C75 80 65 60 50 40 Z" fill="#16A34A" />
          <path d="M50 10 C35 35 25 60 50 80 C75 60 65 35 50 10 Z" fill="#4ADE80" opacity="0.8" />
        </svg>

        <svg className="absolute bottom-0 right-4 w-28 h-40 animate-tree-right opacity-80" viewBox="0 0 100 150" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M46 150 C46 125 48 90 50 70 C52 90 54 125 54 150 Z" fill="#78350F" />
          <path d="M50 10 C20 45 10 75 50 95 C90 75 80 45 50 10 Z" fill="#15803D" />
          <path d="M50 30 C30 55 20 75 50 90 C80 75 70 55 50 30 Z" fill="#16A34A" />
          <path d="M50 0 C30 25 20 50 50 70 C80 50 70 25 50 0 Z" fill="#22C55E" opacity="0.9" />
        </svg>
      </main>

      {/* Bottom gradient bar */}
      <footer className="w-full flex flex-col items-center pb-4">
        <div className="w-full h-1 gradient-bar mb-6" />
        <div className="w-[134px] h-[5px] bg-on-surface/20 rounded-full" />
      </footer>
    </div>
  );
};

export default SplashScreen;
