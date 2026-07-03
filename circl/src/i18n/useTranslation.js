import { useCallback } from 'react';
import useUIStore from '@store/uiStore';
import translations from './translations';

export const useTranslation = () => {
  const language = useUIStore((state) => state.language);

  const t = useCallback((key) => {
    return translations[language]?.[key] || translations.en[key] || key;
  }, [language]);

  return { t, language };
};

export default useTranslation;
