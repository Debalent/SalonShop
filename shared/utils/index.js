// Shared utility functions for mobile and web applications

// Date and time utilities
export const formatDate = (date, format = 'MM/DD/YYYY') => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const year = d.getFullYear();
  const shortYear = String(year).slice(2);
  
  switch (format) {
    case 'MM/DD/YYYY':
      return `${month}/${day}/${year}`;
    case 'MM/DD/YY':
      return `${month}/${day}/${shortYear}`;
    case 'DD/MM/YYYY':
      return `${day}/${month}/${year}`;
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'MMM DD, YYYY':
      return d.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
    case 'MMMM DD, YYYY':
      return d.toLocaleDateString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric' 
      });
    default:
      return d.toLocaleDateString();
  }
};

export const formatTime = (time, format = '12h') => {
  if (!time) return '';
  
  const [hours, minutes] = time.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) return '';
  
  if (format === '24h') {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
  
  // 12-hour format
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${displayHours}:${String(minutes).padStart(2, '0')} ${period}`;
};

export const formatDateTime = (dateTime, dateFormat = 'MM/DD/YYYY', timeFormat = '12h') => {
  if (!dateTime) return '';
  
  const date = new Date(dateTime);
  if (isNaN(date.getTime())) return '';
  
  const formattedDate = formatDate(date, dateFormat);
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const formattedTime = formatTime(`${hours}:${minutes}`, timeFormat);
  
  return `${formattedDate} ${formattedTime}`;
};

export const getRelativeTime = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const now = new Date();
  const diffMs = now - d;
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return formatDate(d, 'MMM DD, YYYY');
};

export const addMinutes = (date, minutes) => {
  const result = new Date(date);
  result.setMinutes(result.getMinutes() + minutes);
  return result;
};

export const isSameDay = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
};

export const isToday = (date) => {
  return isSameDay(date, new Date());
};

export const isTomorrow = (date) => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return isSameDay(date, tomorrow);
};

// Currency utilities
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  if (amount === null || amount === undefined || isNaN(amount)) return '$0.00';
  
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const parseCurrency = (currencyString) => {
  if (!currencyString) return 0;
  const cleaned = currencyString.replace(/[^0-9.-]+/g, '');
  return parseFloat(cleaned) || 0;
};

// String utilities
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

export const truncate = (str, length = 50, suffix = '...') => {
  if (!str || str.length <= length) return str;
  return str.substring(0, length) + suffix;
};

export const slugify = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const maskPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
};

export const maskEmail = (email) => {
  if (!email) return '';
  const [username, domain] = email.split('@');
  if (!username || !domain) return email;
  
  const maskedUsername = username.length > 2 
    ? `${username[0]}${'*'.repeat(username.length - 2)}${username[username.length - 1]}`
    : username;
  
  return `${maskedUsername}@${domain}`;
};

// Array utilities
export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const value = typeof key === 'function' ? key(item) : item[key];
    (groups[value] = groups[value] || []).push(item);
    return groups;
  }, {});
};

export const sortBy = (array, key, direction = 'asc') => {
  return [...array].sort((a, b) => {
    const aValue = typeof key === 'function' ? key(a) : a[key];
    const bValue = typeof key === 'function' ? key(b) : b[key];
    
    if (aValue < bValue) return direction === 'asc' ? -1 : 1;
    if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const removeDuplicates = (array, key = null) => {
  if (!key) return [...new Set(array)];
  
  const seen = new Set();
  return array.filter(item => {
    const value = typeof key === 'function' ? key(item) : item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
};

export const chunk = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

// Object utilities
export const pick = (obj, keys) => {
  const result = {};
  keys.forEach(key => {
    if (key in obj) result[key] = obj[key];
  });
  return result;
};

export const omit = (obj, keys) => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
};

export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

// Number utilities
export const formatNumber = (num, decimals = 0) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return Number(num).toFixed(decimals);
};

export const formatPercentage = (num, decimals = 1) => {
  if (num === null || num === undefined || isNaN(num)) return '0%';
  return `${Number(num).toFixed(decimals)}%`;
};

export const clamp = (num, min, max) => {
  return Math.min(Math.max(num, min), max);
};

export const randomBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Color utilities
export const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

export const rgbToHex = (r, g, b) => {
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
};

export const lightenColor = (color, amount) => {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  const r = Math.min(255, Math.floor(rgb.r + (255 - rgb.r) * amount));
  const g = Math.min(255, Math.floor(rgb.g + (255 - rgb.g) * amount));
  const b = Math.min(255, Math.floor(rgb.b + (255 - rgb.b) * amount));
  
  return rgbToHex(r, g, b);
};

export const darkenColor = (color, amount) => {
  const rgb = hexToRgb(color);
  if (!rgb) return color;
  
  const r = Math.max(0, Math.floor(rgb.r * (1 - amount)));
  const g = Math.max(0, Math.floor(rgb.g * (1 - amount)));
  const b = Math.max(0, Math.floor(rgb.b * (1 - amount)));
  
  return rgbToHex(r, g, b);
};

// Storage utilities
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
      return true;
    } catch {
      return false;
    }
  }
};

// Device utilities
export const getDeviceInfo = () => {
  const userAgent = navigator.userAgent;
  const platform = navigator.platform;
  
  return {
    isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
    isTablet: /iPad|Android/i.test(userAgent) && !/Mobile/i.test(userAgent),
    isDesktop: !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent),
    isIOS: /iPad|iPhone|iPod/.test(userAgent),
    isAndroid: /Android/.test(userAgent),
    isSafari: /Safari/.test(userAgent) && !/Chrome/.test(userAgent),
    isChrome: /Chrome/.test(userAgent),
    isFirefox: /Firefox/.test(userAgent),
    platform: platform,
    userAgent: userAgent,
  };
};

// Debounce and throttle
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// URL utilities
export const getQueryParams = (url = window.location.search) => {
  const params = new URLSearchParams(url);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
};

export const setQueryParams = (params) => {
  const url = new URL(window.location);
  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  });
  window.history.replaceState({}, '', url);
};

export default {
  // Date/Time
  formatDate,
  formatTime,
  formatDateTime,
  getRelativeTime,
  addMinutes,
  isSameDay,
  isToday,
  isTomorrow,
  
  // Currency
  formatCurrency,
  parseCurrency,
  
  // String
  capitalize,
  capitalizeWords,
  truncate,
  slugify,
  generateId,
  maskPhoneNumber,
  maskEmail,
  
  // Array
  groupBy,
  sortBy,
  removeDuplicates,
  chunk,
  
  // Object
  pick,
  omit,
  deepClone,
  isEmpty,
  
  // Number
  formatNumber,
  formatPercentage,
  clamp,
  randomBetween,
  
  // Color
  hexToRgb,
  rgbToHex,
  lightenColor,
  darkenColor,
  
  // Storage
  storage,
  
  // Device
  getDeviceInfo,
  
  // Performance
  debounce,
  throttle,
  
  // URL
  getQueryParams,
  setQueryParams,
};