'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState('ko');

  useEffect(() => {
    // Read language from cookie on initial load
    const cookies = document.cookie.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=');
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);
    
    const transCookie = cookies['googtrans'];
    if (transCookie) {
      const lang = transCookie.split('/')[2];
      setLanguageState(lang);
    }
  }, []);

  const setLanguage = (lang: string) => {
    // Set cookie for Google Translate and reload to apply
    document.cookie = `googtrans=/ko/${lang}; path=/`;
    setLanguageState(lang);
    window.location.reload();
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};