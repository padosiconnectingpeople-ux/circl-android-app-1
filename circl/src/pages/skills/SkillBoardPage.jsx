import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@config/firebase';
import useAuthStore from '@store/authStore';
import useTranslation from '@i18n/useTranslation';
import Button from '@components/common/Button';
import Avatar from '@components/common/Avatar';
import { Search, Briefcase, Star, MessageCircle, Plus } from 'lucide-react';

const SKILL_CATEGORIES = ['All', 'Tutors', 'Carpentry', 'Electrician', 'Plumber', 'Cooking', 'Gardening', 'Tailoring', 'Other'];

const SkillBoardPage = () => {
  const { t } = useTranslation();
  const profile = useAuthStore((s) => s.profile);

  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  // Demo Skills listings
  const demoSkills = [
    {
      id: 'skill_1',
      userName: 'Jyoti Sharma',
      userPhoto: '',
      verified: true,
      skillName: 'Home Made Tiffin Service',
      category: 'Cooking',
      rate: 120,
      rateType: 'meal',
      rating: 4.9,
      description: 'Healthy, home-cooked pure vegetarian lunch and dinner tiffins. Delivery to society flats included.',
    },
    {
      id: 'skill_2',
      userName: 'Ramesh Kumar',
      userPhoto: '',
      verified: false,
      skillName: 'Maths Home Tuition (Class 6-10)',
      category: 'Tutors',
      rate: 500,
      rateType: 'hour',
      rating: 4.7,
      description: 'Experienced tutor offering class 6-10 Mathematics coaching in Sunshine Apartments.',
    }
  ];

  useEffect(() => {
    const fetchSkills = async () => {
      setLoading(true);
      try {
        const area = profile?.area || 'Bandra';
        let q = query(
          collection(db, 'skills'),
          where('area', '==', area),
          orderBy('createdAt', 'desc')
        );
        if (activeCategory !== 'All') {
          q = query(
            collection(db, 'skills'),
            where('area', '==', area),
            where('category', '==', activeCategory),
            orderBy('createdAt', 'desc')
          );
        }
        const snap = await getDocs(q);
        const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }));

        if (docs.length > 0) {
          setSkills(docs);
        } else {
          setSkills(
            activeCategory === 'All'
              ? demoSkills
              : demoSkills.filter(s => s.category === activeCategory)
          );
        }
      } catch (e) {
        console.warn('Firestore load failed, showing fallback skills:', e);
        setSkills(
          activeCategory === 'All'
            ? demoSkills
            : demoSkills.filter(s => s.category === activeCategory)
        );
      }
      setLoading(false);
    };

    fetchSkills();
  }, [profile, activeCategory]);

  return (
    <div className="animate-fade-in p-md space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-outline-variant/10 pb-3">
        <div>
          <h2 className="text-headline-sm font-bold text-on-surface">Skill Sharing</h2>
          <p className="text-label-md text-text-muted">Hire local talents or offer your services</p>
        </div>
      </div>

      {/* Category list */}
      <div className="flex overflow-x-auto gap-2 py-1 hide-scrollbar">
        {SKILL_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`chip whitespace-nowrap ${
              activeCategory === cat ? 'chip-active' : 'chip-inactive'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Skill List */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-6 text-text-muted">{t('loading')}</div>
        ) : skills.length === 0 ? (
          <div className="text-center py-8 bg-surface-container-low rounded-xl border border-outline-variant/10">
            <Briefcase className="w-10 h-10 text-primary/40 mx-auto mb-2" />
            <h4 className="font-bold text-on-surface text-body-md">No Talents Registered</h4>
            <p className="text-label-md text-text-muted mt-0.5">Be the first to list your local service!</p>
          </div>
        ) : (
          skills.map((skill) => (
            <div key={skill.id} className="circl-card p-md border border-outline-variant/10 flex gap-4">
              <Avatar name={skill.userName} src={skill.userPhoto} size="lg" verified={skill.verified} />
              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="font-bold text-on-surface text-body-lg truncate">{skill.skillName}</h3>
                    <div className="flex items-center gap-0.5 text-warning shrink-0">
                      <Star className="w-3.5 h-3.5 fill-warning text-warning" />
                      <span className="text-label-md font-bold text-on-surface">{skill.rating}</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-text-muted font-bold block mt-0.5">
                    By <strong className="text-on-surface">{skill.userName}</strong>
                  </span>
                  <p className="text-body-md text-on-surface-variant leading-[1.3] line-clamp-2 mt-1.5">
                    {skill.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-surface-container-high/40">
                  <span className="text-body-md font-extrabold text-primary">
                    ₹{skill.rate} / <span className="text-[10px] font-normal text-text-muted">{skill.rateType}</span>
                  </span>
                  <button className="flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2.5 py-1.5 rounded-lg active:scale-95 transition-all">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Contact</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SkillBoardPage;
