import { Injectable, inject } from '@angular/core';
import { SHARED_TRANSLATIONS } from '../../i18n/shared';
import { StorageService } from '../storage.service';
import { STORAGE_KEYS } from '../../constants/storage-keys';
import { Device } from '@capacitor/device';

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
  private initialized = false;

  async initialize(config: {
    translations: Record<string, any>;
    supportedLanguages: string[];
    defaultLanguage: string;
  }): Promise<void> {
    this.projectTranslations = config.translations;
    this.supportedLanguages = config.supportedLanguages;
    this.defaultLanguage = config.defaultLanguage;
    this.initialized = true;
    await this.detectAndSetLanguage();
  }

  private async detectAndSetLanguage(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    const forcedLang = this.storageService.getString(STORAGE_KEYS.FORCE_LANGUAGE);
    const deviceLang = await this.getDeviceLanguage();
    const storedLang = this.storageService.getString(STORAGE_KEYS.LANGUAGE);
    
    let targetLang = forcedLang || deviceLang || storedLang || this.defaultLanguage;
    
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

  private async getDeviceLanguage(): Promise<string> {
    try {
      const languageInfo = await Device.getLanguageCode();
      if (languageInfo && languageInfo.value) {
        return languageInfo.value.toLowerCase().split('-')[0];
      }
    } catch (error) {
    }

    return this.getBrowserLanguage();
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

  setLanguage(lang: string, fromSettings: boolean = false): void {
    if (!this.supportedLanguages.includes(lang)) {
      lang = this.defaultLanguage;
    }

    this.currentLanguage = lang;
    
    if (fromSettings) {
      this.storageService.setString(STORAGE_KEYS.FORCE_LANGUAGE, lang);
    }
    
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
