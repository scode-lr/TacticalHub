import { sharedTranslations as sharedTranslationsEn } from './en';
import { sharedTranslations as sharedTranslationsEs } from './es';
import { sharedTranslations as sharedTranslationsCa } from './ca';

export { sharedTranslationsEn, sharedTranslationsEs, sharedTranslationsCa };
export type { SharedTranslationKeys } from './en';

export const SHARED_TRANSLATIONS: Record<string, any> = {
  en: sharedTranslationsEn,
  es: sharedTranslationsEs,
  ca: sharedTranslationsCa
};
