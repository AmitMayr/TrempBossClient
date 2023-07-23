import React, { createContext, useState } from 'react';

import enTranslations from './en.json';//json of the english variables
import hebTranslations from './heb.json';//json of the heb variables

import { } from '../../types/types';

import AsyncStorage from '@react-native-async-storage/async-storage';




type Translation = { //מילון מפתח וערך
  [key: string]: string;
};

type NestedDictionary = { //מילון בתוך מילון מפתח וערך שהוא עוד מילון
  [key: string]: Translation;
};

type Translations = {
  [lang: string]: NestedDictionary;
};

type TranslationContextType = {
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  GetWordByLangAndKeys: (key: string, key2: string) => string;
  GetDictByLangAndKey: (key: string) => Translation;
  LanguageWords: () => NestedDictionary;
  getLanguageKey: (key: string) => string;
};

const translations: Translations = {
  en: enTranslations,
  heb: hebTranslations,
};

const TranslationContext = createContext<TranslationContextType>({
  currentLanguage: 'en',
  setLanguage: () => { },
  GetWordByLangAndKeys: (key: string, innerKey: string) => key,
  GetDictByLangAndKey: (key: string) => translations[key][key],
  LanguageWords: () => translations['en'],
  getLanguageKey: (key: string) => key,

});

type TranslationProviderProps = {
  children: React.ReactNode;
};

const TranslationProvider: React.FC<TranslationProviderProps> = ({
  children,
}) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const SetLanguageFromAsyncStorage = async () => {
    const language = await AsyncStorage.getItem('language');
    if (language) {
      setCurrentLanguage(language);
    }
    

  }
  SetLanguageFromAsyncStorage();

  const setLanguage = (lang: string) => {
    setCurrentLanguage(lang);
  };

  const GetWordByLangAndKeys = (key: string, key2: string) => {
    const translation: Translation = GetDictByLangAndKey(key);

    return translation[key2] || key;
  };

  const GetDictByLangAndKey = (key: string) => {
    const translation: NestedDictionary = translations[currentLanguage];
    const wordsDict: Translation = translation[key];
    return wordsDict;
  };


  const LanguageWords = () => {
    const translation = translations[currentLanguage];
    return translation;
  };
  const getLanguageKey = (key: string) => {
    return key;
  };

  return (
    <TranslationContext.Provider
      value={{ currentLanguage, setLanguage, GetWordByLangAndKeys, getLanguageKey, LanguageWords, GetDictByLangAndKey }}
    >
      {children}
    </TranslationContext.Provider>
  );
};

export { TranslationContext, TranslationProvider };
