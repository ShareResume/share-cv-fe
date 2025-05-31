import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type SupportedLanguage = 'en' | 'uk';

export interface LanguageOption {
  code: SupportedLanguage;
  name: string;
  flag: string;
}

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private translateService = inject(TranslateService);
  
  private readonly STORAGE_KEY = 'selectedLanguage';
  private readonly DEFAULT_LANGUAGE: SupportedLanguage = 'en';
  
  // Available languages
  readonly availableLanguages: LanguageOption[] = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'uk', name: 'Українська', flag: '🇺🇦' }
  ];
  
  // Current language signal
  currentLanguage = signal<SupportedLanguage>(this.DEFAULT_LANGUAGE);
  
  constructor() {
    this.initializeLanguage();
  }
  
  private initializeLanguage(): void {
    // Get saved language from localStorage or use default
    const savedLanguage = localStorage.getItem(this.STORAGE_KEY) as SupportedLanguage;
    const languageToUse = this.isValidLanguage(savedLanguage) ? savedLanguage : this.DEFAULT_LANGUAGE;
    
    // Set up translate service
    this.translateService.addLangs(['en', 'uk']);
    this.translateService.setDefaultLang(this.DEFAULT_LANGUAGE);
    
    // Apply the language
    this.changeLanguage(languageToUse);
  }
  
  private isValidLanguage(language: string): language is SupportedLanguage {
    return ['en', 'uk'].includes(language);
  }
  
  changeLanguage(language: SupportedLanguage): void {
    if (!this.isValidLanguage(language)) {
      console.warn(`Invalid language: ${language}. Using default: ${this.DEFAULT_LANGUAGE}`);
      language = this.DEFAULT_LANGUAGE;
    }
    
    // Update translate service
    this.translateService.use(language);
    
    // Update signal
    this.currentLanguage.set(language);
    
    // Save to localStorage
    localStorage.setItem(this.STORAGE_KEY, language);
    
    // Update document language attribute
    document.documentElement.lang = language;
  }
  
  toggleLanguage(): void {
    const newLanguage: SupportedLanguage = this.currentLanguage() === 'en' ? 'uk' : 'en';
    this.changeLanguage(newLanguage);
  }
  
  getCurrentLanguageOption(): LanguageOption {
    return this.availableLanguages.find(lang => lang.code === this.currentLanguage()) 
           || this.availableLanguages[0];
  }
  
  getOtherLanguageOption(): LanguageOption {
    return this.availableLanguages.find(lang => lang.code !== this.currentLanguage()) 
           || this.availableLanguages[1];
  }
  
  // Utility method to get translated text directly (for use in TypeScript)
  getTranslation(key: string, params?: any): string {
    return this.translateService.instant(key, params);
  }
} 