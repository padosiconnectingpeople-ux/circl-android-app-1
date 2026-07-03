import React from 'react';
import { ShoppingBag } from 'lucide-react';
import useTranslation from '@i18n/useTranslation';

const SponsoredAd = ({ ad = {} }) => {
  const { t } = useTranslation();

  const {
    businessName = 'FreshBaskets',
    headline = 'Flat 20% OFF today',
    description = 'Get fresh farm-to-table groceries delivered to Sunshine Apts in under 30 minutes. Use code SUNSHINE20.',
    ctaType = 'Shop Now',
  } = ad;

  return (
    <article className="bg-card rounded-xl border-2 border-secondary overflow-hidden shadow-card relative p-md animate-fade-in">
      <div className="absolute top-3 right-3 bg-secondary text-white text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider">
        {t('sponsored')}
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-secondary/15 flex items-center justify-center text-secondary">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-bold text-on-surface text-body-md">{businessName}</h4>
            <span className="text-label-md text-secondary font-bold">{headline}</span>
          </div>
        </div>
        <p className="text-body-md text-on-surface-variant leading-[1.4]">
          {description}
        </p>
        <button className="w-full py-2 bg-secondary text-white rounded-lg font-bold text-label-md hover:bg-secondary/90 active:scale-[0.98] transition-all duration-200">
          {ctaType}
        </button>
      </div>
    </article>
  );
};

export default SponsoredAd;
