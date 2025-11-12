import { Injectable, inject } from '@angular/core';
import { SHARED_TRANSLATIONS } from '../../i18n/shared';
import { StorageService } from '../storage.service';
import { STORAGE_KEYS } from '../../constants/storage-keys';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private readonly storageService = inject(StorageService);
  private translations: any = {};
  private currentLanguage = 'en';
  private projectTranslations: any = {};
  private supportedLanguages: string[] = ['en'];
  private defaultLanguage = 'en';

  constructor() {
    this.detectAndSetLanguage();
  }

  initialize(config: {
    translations: Record<string, any>;
    supportedLanguages: string[];
    defaultLanguage: string;
  }): void {
    this.projectTranslations = config.translations;
    this.supportedLanguages = config.supportedLanguages;
    this.defaultLanguage = config.defaultLanguage;
    this.detectAndSetLanguage();
  }

  private detectAndSetLanguage(): void {
    const browserLang = this.getBrowserLanguage();
    const storedLang = this.storageService.getString(STORAGE_KEYS.LANGUAGE);
    
    let targetLang = storedLang || browserLang || this.defaultLanguage;
    
    if (!this.supportedLanguages.includes(targetLang)) {
      const langPrefix = targetLang.split('-')[0];
      if (this.supportedLanguages.includes(langPrefix)) {
        targetLang = langPrefix;
      } else {
        targetLang = this.defaultLanguage;
      }
    }

    this.setLanguage(targetLang);
  }

  private getBrowserLanguage(): string {
    if (typeof window === 'undefined' || !window.navigator) {
      return 'en';
    }

    const nav = window.navigator as any;
    const browserLang = nav.language || nav.userLanguage || nav.browserLanguage;
    
    if (browserLang) {
      return browserLang.toLowerCase().split('-')[0];
    }

    return 'en';
  }

  setLanguage(lang: string): void {
    if (!this.supportedLanguages.includes(lang)) {
      lang = this.defaultLanguage;
    }

    this.currentLanguage = lang;
    this.storageService.setString(STORAGE_KEYS.LANGUAGE, lang);

    const sharedForLang = (SHARED_TRANSLATIONS as any)[lang] || (SHARED_TRANSLATIONS as any).en;
    const projectForLang = this.projectTranslations[lang] || this.projectTranslations.en || {};

    this.translations = this.deepMerge(sharedForLang, projectForLang);
  }

  private deepMerge(shared: any, project: any): any {
    const result = { ...shared };

    for (const key in project) {
      if (project.hasOwnProperty(key)) {
        if (
          typeof project[key] === 'object' &&
          !Array.isArray(project[key]) &&
          project[key] !== null
        ) {
          result[key] = this.deepMerge(
            result[key] || {},
            project[key]
          );
        } else {
          result[key] = project[key];
        }
      }
    }

    return result;
  }

  instant(key: string, params?: Record<string, any>): string {
    const keys = key.split('.');
    let value = this.translations;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }

    if (params && typeof value === 'string') {
      return this.interpolate(value, params);
    }

    return typeof value === 'string' ? value : key;
  }

  private interpolate(text: string, params: Record<string, any>): string {
    return text.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? String(params[key]) : match;
    });
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  getSupportedLanguages(): string[] {
    return this.supportedLanguages;
  }

  getAllTranslations(): any {
    return this.translations;
  }
}
