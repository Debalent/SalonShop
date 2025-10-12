// i18n configuration and setup for mobile and web apps

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import en from './en.json';
import es from './es.json';
import ko from './ko.json';
import zh from './zh.json';
import vi from './vi.json';

// Language resources
const resources = {
  en: { translation: en },
  es: { translation: es },
  ko: { translation: ko },
  zh: { translation: zh },
  vi: { translation: vi },
};

// Language configuration
const i18nConfig = {
  resources,
  lng: 'en', // default language
  fallbackLng: 'en',
  debug: process.env.NODE_ENV === 'development',
  
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  
  // Namespace configuration
  defaultNS: 'translation',
  ns: ['translation'],
  
  // Detection options (for web)
  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage'],
    lookupLocalStorage: 'i18nextLng',
  },
  
  // React specific options
  react: {
    bindI18n: 'languageChanged',
    bindI18nStore: '',
    transEmptyNodeValue: '',
    transSupportBasicHtmlNodes: true,
    transKeepBasicHtmlNodesFor: ['br', 'strong', 'i'],
    useSuspense: false,
  },
};

// Initialize i18n
i18n
  .use(initReactI18next)
  .init(i18nConfig);

// Language utilities
export const languages = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'ko', name: 'Korean', nativeName: '한국어' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
];

export const getLanguageName = (code) => {
  const language = languages.find(lang => lang.code === code);
  return language ? language.name : code;
};

export const getNativeLanguageName = (code) => {
  const language = languages.find(lang => lang.code === code);
  return language ? language.nativeName : code;
};

export const isRTL = (languageCode) => {
  const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
  return rtlLanguages.includes(languageCode);
};

export const getCurrentLanguage = () => {
  return i18n.language || 'en';
};

export const changeLanguage = (languageCode) => {
  return i18n.changeLanguage(languageCode);
};

// Translation helpers
export const t = (key, options = {}) => {
  return i18n.t(key, options);
};

export const formatMessage = (key, values = {}) => {
  return i18n.t(key, values);
};

// Date and time formatting with localization
export const formatLocalizedDate = (date, format = 'short') => {
  if (!date) return '';
  
  const locale = getCurrentLanguage();
  const dateObj = new Date(date);
  
  const options = {
    short: { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    },
    long: { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      weekday: 'long'
    },
    time: {
      hour: '2-digit',
      minute: '2-digit'
    },
    datetime: {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  };
  
  return dateObj.toLocaleDateString(locale, options[format] || options.short);
};

export const formatLocalizedTime = (time) => {
  if (!time) return '';
  
  const locale = getCurrentLanguage();
  const [hours, minutes] = time.split(':');
  const date = new Date();
  date.setHours(parseInt(hours), parseInt(minutes));
  
  return date.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatLocalizedCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '';
  
  const locale = getCurrentLanguage();
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  } catch (error) {
    // Fallback to USD if currency is not supported
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  }
};

export const formatLocalizedNumber = (number, options = {}) => {
  if (number === null || number === undefined) return '';
  
  const locale = getCurrentLanguage();
  
  return new Intl.NumberFormat(locale, options).format(number);
};

// Pluralization helpers
export const pluralize = (key, count, options = {}) => {
  return i18n.t(key, { count, ...options });
};

// Namespace helpers for organized translations
export const createNamespaceTranslator = (namespace) => {
  return (key, options = {}) => {
    return i18n.t(`${namespace}:${key}`, options);
  };
};

// Common translation functions for specific domains
export const auth = createNamespaceTranslator('auth');
export const booking = createNamespaceTranslator('booking');
export const services = createNamespaceTranslator('services');
export const payment = createNamespaceTranslator('payment');
export const errors = createNamespaceTranslator('errors');
export const success = createNamespaceTranslator('success');

// Validation message helpers
export const getValidationMessage = (field, validationType, options = {}) => {
  const key = `validation.${validationType}`;
  return i18n.t(key, { field, ...options });
};

export const getErrorMessage = (errorCode, options = {}) => {
  const key = `errors.${errorCode}`;
  return i18n.t(key, options);
};

export const getSuccessMessage = (successCode, options = {}) => {
  const key = `success.${successCode}`;
  return i18n.t(key, options);
};

// Accessibility helpers
export const getAccessibilityLabel = (key, options = {}) => {
  return i18n.t(`accessibility.${key}`, options);
};

// React Native specific helpers
export const setupReactNativeLocalization = () => {
  // Get device language
  let deviceLanguage = 'en';
  
  try {
    // For React Native
    if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
      const { NativeModules, Platform } = require('react-native');
      
      if (Platform.OS === 'ios') {
        deviceLanguage = NativeModules.SettingsManager?.settings?.AppleLocale || 
                        NativeModules.SettingsManager?.settings?.AppleLanguages?.[0] || 'en';
      } else {
        deviceLanguage = NativeModules.I18nManager?.localeIdentifier || 'en';
      }
      
      // Extract language code (e.g., 'en-US' -> 'en')
      deviceLanguage = deviceLanguage.split('-')[0];
    }
  } catch (error) {
    console.warn('Could not detect device language:', error);
  }
  
  // Set language if supported
  if (resources[deviceLanguage]) {
    i18n.changeLanguage(deviceLanguage);
  }
  
  return deviceLanguage;
};

// Web specific helpers
export const setupWebLocalization = () => {
  // Get browser language
  const browserLanguage = navigator.language.split('-')[0];
  
  // Set language if supported
  if (resources[browserLanguage]) {
    i18n.changeLanguage(browserLanguage);
  }
  
  return browserLanguage;
};

// Language detection utility
export const detectLanguage = () => {
  if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    return setupReactNativeLocalization();
  } else if (typeof window !== 'undefined') {
    return setupWebLocalization();
  }
  return 'en';
};

// Auto-setup based on environment
if (typeof window === 'undefined' && typeof navigator !== 'undefined') {
  // React Native environment
  setupReactNativeLocalization();
} else if (typeof window !== 'undefined') {
  // Web environment
  setupWebLocalization();
}

export default i18n;