// useLang.js – language hook for V&F Rwanda
// Usage:
//   import { useLang } from '../i18n/useLang';
//   const { t, lang, toggle } = useLang();
//   <span>{t('home.heroTitle')}</span>

import { useAtom } from 'jotai';
import { langAtom } from '../store/atoms';
import { translations } from './translations';

// Resolve a dotted key like "home.heroTitle" into the en/rw object
function resolve(key) {
  return key.split('.').reduce((obj, k) => obj?.[k], translations);
}

export function useLang() {
  const [lang, setLang] = useAtom(langAtom);

  // t('home.heroTitle') => string in current language
  function t(key) {
    const entry = resolve(key);
    if (!entry) return key; // fallback: return key itself
    return entry[lang] ?? entry['en'] ?? key;
  }

  function toggle() {
    setLang((l) => (l === 'en' ? 'rw' : 'en'));
  }

  return { t, lang, toggle, setLang };
}
