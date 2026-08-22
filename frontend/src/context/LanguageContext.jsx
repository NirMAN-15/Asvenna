import React, { createContext, useState } from 'react';
import en from '../locales/en.json';
import si from '../locales/si.json';
import ta from '../locales/ta.json';

const translations = { en, si, ta };

export const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('asvanna_lang') || 'en');

  const setLanguage = (newLang) => {
    localStorage.setItem('asvanna_lang', newLang);
    setLang(newLang);
  };

  const t = (key) => {
    return translations[lang]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
