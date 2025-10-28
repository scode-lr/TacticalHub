import { Injectable } from '@angular/core';
import { sharedTranslations } from '../../i18n/shared';

/**
 * Translation Service
 * 
 * This service provides translation functionality for the application.
 * It supports both shared (common) and project-specific translations.
 * 
 * Architecture:
 * - Shared translations: Common strings used across all projects
 * - Project translations: Unique strings per project (can override shared)
 * - Final translations = { ...shared, ...project } (project wins on conflicts)
 * 
 * Currently, it loads translations from local files, but it's designed
 * to be easily migrated to an external translation service/API.
 * 
 * Migration Path:
 * 1. Replace the import statements with API calls
 * 2. Implement caching strategy
 * 3. Add language switching functionality
 * 4. Add loading states for async translation loading
 */
@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private translations: any = {};
  private currentLanguage = 'en';
  private sharedTranslations: any = sharedTranslations;

  constructor() {
    // Shared translations are loaded automatically
  }

  /**
   * Set project-specific translations
   * These will be merged with shared translations
   * Project translations override shared ones if keys conflict
   */
  setTranslations(projectTranslations: any): void {
    // Deep merge: shared + project (project wins)
    this.translations = this.deepMerge(
      this.sharedTranslations,
      projectTranslations
    );
  }

  /**
   * Deep merge two objects
   * Second object (project) overrides first (shared)
   */
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

  /**
   * Get a translation by key path
   * Example: t('app.tagline') or t('welcome.signIn')
   * 
   * @param key - Dot notation path to translation
   * @param params - Optional parameters for interpolation
   * @returns Translated string
   */
  t(key: string, params?: Record<string, any>): string {
    const keys = key.split('.');
    let value = this.translations;

    // Navigate through the translation object
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key; // Return key if translation not found
      }
    }

    // Handle string interpolation if params provided
    if (params && typeof value === 'string') {
      return this.interpolate(value, params);
    }

    return typeof value === 'string' ? value : key;
  }

  /**
   * Interpolate parameters into translation string
   * Example: "Hello {name}" with {name: "John"} -> "Hello John"
   */
  private interpolate(text: string, params: Record<string, any>): string {
    return text.replace(/\{(\w+)\}/g, (match, key) => {
      return params[key] !== undefined ? String(params[key]) : match;
    });
  }

  /**
   * Change current language
   * Future: This will trigger loading translations from API
   */
  setLanguage(lang: string): void {
    this.currentLanguage = lang;
    // Future: Load translations for new language
    console.log(`Language changed to: ${lang}`);
  }

  /**
   * Get current language
   */
  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Get all loaded translations (for debugging)
   */
  getAllTranslations(): any {
    return this.translations;
  }
}
