"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

const defaultPreferences = {
  theme: "light",
  language: "en",
  currency: "usd",
  units: "metric",
  privacy: "public",
};

const PreferencesContext = createContext({
  preferences: defaultPreferences,
  setPreferences: () => {},
});

export function PreferencesProvider({ children }) {
  const [preferences, setPreferences] = useState(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("preferences");
      return stored ? JSON.parse(stored) : defaultPreferences;
    }
    return defaultPreferences;
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("preferences", JSON.stringify(preferences));
    }
  }, [preferences]);

  // Theme switching
  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.classList.remove("light", "dark");
      if (preferences.theme === "system") {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        document.documentElement.classList.add(isDark ? "dark" : "light");
      } else {
        document.documentElement.classList.add(preferences.theme);
      }
    }
  }, [preferences.theme]);

  return (
    <PreferencesContext.Provider value={{ preferences, setPreferences }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  return useContext(PreferencesContext);
}

export const translations = {
  en: {
    greeting_morning: "Good morning",
    greeting_afternoon: "Good afternoon",
    greeting_evening: "Good evening",
    welcome: "Welcome back!",
    emissions: "Your emissions by category this month",
    achievements: "Your eco-friendly milestones",
    preferences: "Preferences",
    theme: "Theme",
    language: "Language",
    currency: "Currency",
    units: "Measurement Units",
    privacy: "Profile Visibility",
    save: "Save Preferences",
    profile_private: "Your profile is private and cannot be viewed by others.",
    // ... add more as needed
  },
  hi: {
    greeting_morning: "शुभ प्रभात",
    greeting_afternoon: "शुभ अपराह्न",
    greeting_evening: "शुभ संध्या",
    welcome: "वापसी पर स्वागत है!",
    emissions: "इस महीने श्रेणी के अनुसार आपके उत्सर्जन",
    achievements: "आपकी पर्यावरण-अनुकूल उपलब्धियाँ",
    preferences: "वरीयताएँ",
    theme: "थीम",
    language: "भाषा",
    currency: "मुद्रा",
    units: "माप इकाइयाँ",
    privacy: "प्रोफ़ाइल दृश्यता",
    save: "वरीयताएँ सहेजें",
    profile_private: "आपकी प्रोफ़ाइल निजी है और अन्य द्वारा नहीं देखी जा सकती।",
    // ...
  },
  gu: {
    greeting_morning: "સુપ્રભાત",
    greeting_afternoon: "શુભ બપોર",
    greeting_evening: "શુભ સાંજ",
    welcome: "પાછા આવવા માટે સ્વાગત છે!",
    emissions: "આ મહિને કેટેગરી પ્રમાણે તમારા ઉત્સર્જન",
    achievements: "તમારી પર્યાવરણ-મૈત્રીપૂર્ણ સિદ્ધિઓ",
    preferences: "પસંદગીઓ",
    theme: "થીમ",
    language: "ભાષા",
    currency: "ચલણ",
    units: "માપ એકમો",
    privacy: "પ્રોફાઇલ દૃશ્યતા",
    save: "પસંદગીઓ સાચવો",
    profile_private: "તમારી પ્રોફાઇલ ખાનગી છે અને બીજાઓ દ્વારા જોઈ શકાતી નથી.",
    // ...
  },
};

export function useTranslation() {
  const { preferences } = usePreferences();
  const lang = preferences.language || 'en';
  const t = (key) => translations[lang]?.[key] || translations.en[key] || key;
  return { t };
} 