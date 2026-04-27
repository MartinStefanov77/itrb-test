"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { LOCALE_EN } from "../public/locales/en.nested";
import { LOCALE_BG } from "../public/locales/bg.nested";
// Translation types
type TranslationKey = string;
type TranslationValue = string | { [key: string]: TranslationValue };
type TranslationDict = { [key: string]: TranslationValue };
type Translations = {
  en: TranslationDict;
  bg: TranslationDict;
};

type Language = "en" | "bg";

interface I18nContextType {
  currentLang: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  isLoaded: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Import translations (these will be loaded dynamically)
let translations: Translations | null = null;

function flatten(obj: object, prefix = ""): Record<string, string> {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      if (typeof value === "object" && value !== null) {
        Object.assign(acc, flatten(value, fullKey));
      } else {
        acc[fullKey] = value as string;
      }
      return acc;
    },
    {} as Record<string, string>,
  );
}
async function loadTranslations(): Promise<Translations> {
  if (translations) return translations;
  try {
    translations = {
      en: flatten(LOCALE_EN),
      bg: flatten(LOCALE_BG),
    };

    return translations;
  } catch (error) {
    console.error("Failed to load translations:", error);
    // Fallback translations
    return {
      en: {
        "nav.home": "Home",
        "nav.services": "Services",
        "nav.whoWeAre": "Who we are",
        "nav.careers": "Careers",
        "nav.contact": "Contact",
      },
      bg: {
        "nav.home": "Начало",
        "nav.services": "Услуги",
        "nav.whoWeAre": "Кои сме ние",
        "nav.careers": "Кариери",
        "nav.contact": "Контакт",
      },
    };
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [currentLang, setCurrentLang] = useState<Language>("en");
  const [isLoaded, setIsLoaded] = useState(false);
  const [dict, setDict] = useState<TranslationDict>(() => flatten(LOCALE_EN));

  // Load translations on mount
  useEffect(() => {
    loadTranslations().then((loadedTranslations) => {
      translations = loadedTranslations;
      setIsLoaded(true);
    });
  }, []);

  // Load current language from localStorage and update dictionary
  useEffect(() => {
    const savedLang = localStorage.getItem("itrb-lang") as Language;
    if (savedLang && (savedLang === "en" || savedLang === "bg")) {
      setCurrentLang(savedLang);
    }
  }, []);

  // Update dictionary when language changes
  useEffect(() => {
    if (translations) {
      setDict(translations[currentLang]);
    }
  }, [currentLang, isLoaded]);

  const setLanguage = (lang: Language) => {
    setCurrentLang(lang);
    localStorage.setItem("itrb-lang", lang);
    document.documentElement.setAttribute("lang", lang);
    document.body.className = `lang-${lang}`;
  };

  const t = (key: TranslationKey): string => {
    const value = dict[key];
    if (typeof value === "string") {
      return value;
    }
    return key;
  };

  const value: I18nContextType = {
    currentLang,
    setLanguage,
    t,
    isLoaded,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}
