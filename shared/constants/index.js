// Shared constants across mobile and web applications

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://salonshop-api.herokuapp.com' 
    : 'http://localhost:3001',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
};

// Authentication
export const AUTH_CONSTANTS = {
  TOKEN_KEY: 'salonshop_token',
  REFRESH_TOKEN_KEY: 'salonshop_refresh_token',
  USER_KEY: 'salonshop_user',
  TOKEN_EXPIRY: 24 * 60 * 60 * 1000, // 24 hours
  REFRESH_THRESHOLD: 60 * 60 * 1000, // 1 hour before expiry
};

// User Roles and Permissions
export const USER_ROLES = {
  CUSTOMER: 'customer',
  STAFF: 'staff',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

export const PERMISSIONS = {
  // Booking permissions
  CREATE_BOOKING: ['customer', 'staff', 'admin'],
  EDIT_BOOKING: ['staff', 'admin'],
  CANCEL_BOOKING: ['customer', 'staff', 'admin'],
  VIEW_ALL_BOOKINGS: ['staff', 'admin'],
  
  // Service permissions
  CREATE_SERVICE: ['admin'],
  EDIT_SERVICE: ['admin'],
  DELETE_SERVICE: ['admin'],
  VIEW_SERVICES: ['customer', 'staff', 'admin'],
  
  // Staff permissions
  MANAGE_STAFF: ['admin'],
  VIEW_STAFF: ['staff', 'admin'],
  EDIT_PROFILE: ['customer', 'staff', 'admin'],
  
  // Financial permissions
  VIEW_PAYROLL: ['staff', 'admin'],
  MANAGE_PAYROLL: ['admin'],
  VIEW_TIPS: ['staff', 'admin'],
  MANAGE_TIPS: ['admin'],
  
  // Analytics permissions
  VIEW_ANALYTICS: ['admin'],
  EXPORT_DATA: ['admin'],
};

// Service Categories
export const SERVICE_CATEGORIES = {
  HAIR: {
    id: 'hair',
    name: 'Hair Services',
    icon: 'content-cut',
    color: '#E91E63',
    subcategories: [
      'Haircut',
      'Hair Color',
      'Hair Styling',
      'Hair Treatment',
      'Hair Extensions',
    ]
  },
  NAILS: {
    id: 'nails',
    name: 'Nail Services',
    icon: 'hand',
    color: '#9C27B0',
    subcategories: [
      'Manicure',
      'Pedicure',
      'Nail Art',
      'Gel Polish',
      'Acrylic Nails',
    ]
  },
  FACIAL: {
    id: 'facial',
    name: 'Facial Services',
    icon: 'face',
    color: '#FF9800',
    subcategories: [
      'Classic Facial',
      'Anti-Aging Facial',
      'Acne Treatment',
      'Hydrating Facial',
      'Chemical Peel',
    ]
  },
  MASSAGE: {
    id: 'massage',
    name: 'Massage Services',
    icon: 'spa',
    color: '#4CAF50',
    subcategories: [
      'Swedish Massage',
      'Deep Tissue',
      'Hot Stone',
      'Aromatherapy',
      'Chair Massage',
    ]
  },
  WAXING: {
    id: 'waxing',
    name: 'Waxing Services',
    icon: 'remove',
    color: '#FF5722',
    subcategories: [
      'Eyebrow Wax',
      'Leg Wax',
      'Arm Wax',
      'Bikini Wax',
      'Full Body Wax',
    ]
  },
  MAKEUP: {
    id: 'makeup',
    name: 'Makeup Services',
    icon: 'brush',
    color: '#F44336',
    subcategories: [
      'Bridal Makeup',
      'Event Makeup',
      'Everyday Makeup',
      'Special Occasion',
      'Makeup Lessons',
    ]
  }
};

// Booking Status
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
};

export const BOOKING_STATUS_COLORS = {
  [BOOKING_STATUS.PENDING]: '#FF9800',
  [BOOKING_STATUS.CONFIRMED]: '#2196F3',
  [BOOKING_STATUS.IN_PROGRESS]: '#9C27B0',
  [BOOKING_STATUS.COMPLETED]: '#4CAF50',
  [BOOKING_STATUS.CANCELLED]: '#F44336',
  [BOOKING_STATUS.NO_SHOW]: '#757575',
};

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  CREDIT_CARD: 'credit_card',
  DEBIT_CARD: 'debit_card',
  GIFT_CARD: 'gift_card',
  STORE_CREDIT: 'store_credit',
};

// Time Slots
export const TIME_SLOTS = {
  DURATION_MINUTES: 30,
  START_HOUR: 8, // 8 AM
  END_HOUR: 20,  // 8 PM
  BUFFER_MINUTES: 15, // Buffer between appointments
};

// Working Days
export const WORKING_DAYS = {
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
  SUNDAY: 0,
};

export const DEFAULT_WORKING_HOURS = {
  [WORKING_DAYS.MONDAY]: { start: '09:00', end: '18:00', isWorking: true },
  [WORKING_DAYS.TUESDAY]: { start: '09:00', end: '18:00', isWorking: true },
  [WORKING_DAYS.WEDNESDAY]: { start: '09:00', end: '18:00', isWorking: true },
  [WORKING_DAYS.THURSDAY]: { start: '09:00', end: '18:00', isWorking: true },
  [WORKING_DAYS.FRIDAY]: { start: '09:00', end: '20:00', isWorking: true },
  [WORKING_DAYS.SATURDAY]: { start: '08:00', end: '19:00', isWorking: true },
  [WORKING_DAYS.SUNDAY]: { start: '10:00', end: '17:00', isWorking: false },
};

// Notification Types
export const NOTIFICATION_TYPES = {
  BOOKING_CONFIRMED: 'booking_confirmed',
  BOOKING_REMINDER: 'booking_reminder',
  BOOKING_CANCELLED: 'booking_cancelled',
  PAYMENT_SUCCESS: 'payment_success',
  PAYMENT_FAILED: 'payment_failed',
  STAFF_SCHEDULE: 'staff_schedule',
  PROMOTION: 'promotion',
  SYSTEM: 'system',
};

// Image Sizes
export const IMAGE_SIZES = {
  THUMBNAIL: { width: 150, height: 150 },
  SMALL: { width: 300, height: 300 },
  MEDIUM: { width: 600, height: 600 },
  LARGE: { width: 1200, height: 1200 },
};

// File Upload Limits
export const FILE_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_FILES: 10,
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 5,
};

// Search
export const SEARCH_CONFIG = {
  MIN_QUERY_LENGTH: 2,
  DEBOUNCE_DELAY: 300,
  MAX_RESULTS: 50,
};

// Validation Rules
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBERS: true,
    REQUIRE_SYMBOLS: false,
  },
  PHONE: {
    PATTERN: /^[\+]?[1-9][\d]{0,15}$/,
  },
  EMAIL: {
    PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
    PATTERN: /^[a-zA-Z\s\-'\.]+$/,
  },
};

// Theme Colors (Hideaway Pizza inspired)
export const COLORS = {
  primary: '#D32F2F',      // Deep red
  primaryDark: '#B71C1C',   // Darker red
  primaryLight: '#FFCDD2',  // Light red
  secondary: '#FFC107',     // Amber/Gold
  secondaryDark: '#FF8F00', // Dark amber
  secondaryLight: '#FFF8E1', // Light amber
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
  info: '#2196F3',
  background: '#FAFAFA',
  surface: '#FFFFFF',
  text: '#212121',
  textSecondary: '#757575',
  border: '#E0E0E0',
  divider: '#BDBDBD',
};

// Font Sizes
export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border Radius
export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  pill: 50,
};

// Z-Index Levels
export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modalBackdrop: 1040,
  modal: 1050,
  popover: 1060,
  tooltip: 1070,
};

// Animation Durations
export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
  extraSlow: 1000,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'The requested resource was not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Something went wrong. Please try again later.',
  SESSION_EXPIRED: 'Your session has expired. Please log in again.',
  BOOKING_CONFLICT: 'This time slot is not available.',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this transaction.',
  SERVICE_UNAVAILABLE: 'This service is currently unavailable.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  BOOKING_CREATED: 'Your appointment has been booked successfully!',
  BOOKING_UPDATED: 'Your appointment has been updated.',
  BOOKING_CANCELLED: 'Your appointment has been cancelled.',
  PROFILE_UPDATED: 'Your profile has been updated.',
  PASSWORD_CHANGED: 'Your password has been changed successfully.',
  PAYMENT_SUCCESS: 'Payment completed successfully.',
  EMAIL_SENT: 'Email sent successfully.',
  SMS_SENT: 'SMS sent successfully.',
};

export default {
  API_CONFIG,
  AUTH_CONSTANTS,
  USER_ROLES,
  PERMISSIONS,
  SERVICE_CATEGORIES,
  BOOKING_STATUS,
  BOOKING_STATUS_COLORS,
  PAYMENT_METHODS,
  TIME_SLOTS,
  WORKING_DAYS,
  DEFAULT_WORKING_HOURS,
  NOTIFICATION_TYPES,
  IMAGE_SIZES,
  FILE_LIMITS,
  PAGINATION,
  SEARCH_CONFIG,
  VALIDATION,
  COLORS,
  FONT_SIZES,
  SPACING,
  BORDER_RADIUS,
  Z_INDEX,
  ANIMATION,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};