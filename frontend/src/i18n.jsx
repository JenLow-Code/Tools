import React, { createContext, useContext, useState, useCallback } from "react";
import fr from "./locales/fr.js";
import de from "./locales/de.js";
import pt from "./locales/pt.js";

// Source strings are written in English in the components and wrapped in t().
// For a target locale we look the English source up in that locale's dictionary;
// "en" is the source itself. French is the current default and is complete.
// de / pt are stubs and fall back to the English source until filled.
const DICTS = { en: {}, fr, de, pt };
export const LOCALES = [
  ["fr", "Français"],
  ["en", "English"],
  ["de", "Deutsch"],
  ["pt", "Português"],
];
const STORAGE_KEY = "jenlow-tools-locale";
const read = () => {
  try { return localStorage.getItem(STORAGE_KEY) || "fr"; } catch { return "fr"; }
};

const LocaleContext = createContext({ locale: "fr", t: (s) => s, setLocale: () => {} });

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(read);
  const setLocale = useCallback((l) => {
    setLocaleState(l);
    try { localStorage.setItem(STORAGE_KEY, l); } catch { /* ignore */ }
    try { document.documentElement.lang = l; } catch { /* ignore */ }
  }, []);
  // t(source, vars?) — translate an English source string; {name} placeholders are filled from vars.
  const t = useCallback((s, vars) => {
    const dict = DICTS[locale] || {};
    let out = dict[s] != null ? dict[s] : s;
    if (vars) for (const k of Object.keys(vars)) out = out.replaceAll("{" + k + "}", vars[k]);
    return out;
  }, [locale]);
  return <LocaleContext.Provider value={{ locale, t, setLocale }}>{children}</LocaleContext.Provider>;
}

export const useT = () => useContext(LocaleContext);
