import React from 'react';
import Avatar from '@components/common/Avatar';
import { Plus } from 'lucide-react';
import useAuthStore from '@store/authStore';

const StoryBar = () => {
  const profile = useAuthStore((s) => s.profile);

  // Demo stories matching realistic Indian content & images from Stitch exports
  const demoStories = [
    {
      id: 'story_1',
      user: {
        name: 'Society Admin',
        photoURL: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA7WtJeH5UpHw_n4FXiI-01ed-SyWqCoWMIcP_gFYLKIuteyVpYPyiyP5XWqauDAwaNU9uNCh2AEbKafA1BFKzzd2ctOyieNdmU9jiO4FXYAPyciQyI3kmYgvs5kn2ErOTx9RDP8uXVehUX2_L8-2pQHaQwzUqO0GKP_aVVenValgo970_0AaykWVNqUayyDx5kb2524h-dsbqHP56mHsdKvqOh4JL8cMoqY5V5KbrgpHrAYtMag9nMTPY7teSxXpIbsWnBog1PbSVX',
        verified: true,
      },
      label: 'Society',
    },
    {
      id: 'story_2',
      user: {
        name: 'Priya Sharma',
        photoURL: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCVcv-Coo0vcg6MBf1UH4nbvqQD28t1DBrobYbMH3B6SOJONzyrWWLW2RFYd33n6eRLO0TEpymUN8GibosmKJvTfV0ahohl2MeOrmIfP95s4Pe9hHQY8q_4ORv4LeIaGn9ZFvz6zi8rkU4x9zWs4tHUpgumId3eFKvRJVR-qORt41oALb45tofFgVcbO366avT6LpPFv9Zq72qkTjl4dqv10DWS3dWQi9P478Oc1ilxEKx2xMDmkzsvgAbwxB_VJVjTmO-8FjOy6iIW',
        verified: true,
      },
      label: 'Events',
    },
    {
      id: 'story_3',
      user: {
        name: 'Garden Club',
        photoURL: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpd-WhuCz8_4G10vss5W6yVYnroxKMx5inOk6ndU0AOqrNhgLtgVq7L92ldHj3m_bP9MWiQjzfNn9wmHRo8WewYaIoB9iZMqjejA4jCCaEy8fL1qT5Vs0DLdHv7ijwvJek5tJboCLpRG_0D2kwv65eyyRYgn8rE6eR5gzd6-ceWIOnXoAfmJdUASMBJrUIcoRMSVYMSEJ1B38TX_mLo65aVqi2EieHSdlrPRVNchRStsdU7qvS9Tr-OJ5ope7SWFgisncRgEjZZM3s',
        verified: false,
      },
      label: 'Gardens',
    },
  ];

  return (
    <section className="py-3 overflow-x-auto hide-scrollbar flex gap-4 px-container-margin bg-card">
      {/* Add Story */}
      <div className="flex flex-col items-center gap-1 shrink-0">
        <div className="w-16 h-16 rounded-full border-2 border-dashed border-outline-variant/60 flex items-center justify-center bg-surface-container-low cursor-pointer active:scale-95 transition-transform">
          <Plus className="w-6 h-6 text-primary" />
        </div>
        <span className="text-label-sm text-on-surface-variant font-medium">You</span>
      </div>

      {/* Stories list */}
      {demoStories.map((story) => (
        <div key={story.id} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer active:scale-95 transition-transform">
          <div className="story-gradient rounded-full p-[2px]">
            <div className="w-[60px] h-[60px] rounded-full border-2 border-card overflow-hidden bg-surface-container">
              <img
                src={story.user.photoURL}
                alt={story.user.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <span className="text-label-sm text-on-surface font-medium">{story.label}</span>
        </div>
      ))}
    </section>
  );
};

export default StoryBar;
