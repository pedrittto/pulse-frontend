'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const setLanguage = () => {
    // No-op since we only support English
  };

  const t = (key: string): string => {
    // Simple English translations
    const translations: Record<string, string> = {
      'topNews': 'Top News',
      'credibility': 'Credibility',
      'readMore': 'Read more',
      'readLess': 'Read less',
      'noArticlesAvailable': 'No articles available',
      'loading': 'Loading...',
      'error': 'Error'
    };
    return translations[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language: 'en', setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}; 