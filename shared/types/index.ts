// Shared TypeScript type definitions for mobile and web applications

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  preferences: UserPreferences;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'customer' | 'staff' | 'admin' | 'super_admin';

export interface UserPreferences {
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
  theme: 'light' | 'dark' | 'auto';
}

export interface NotificationPreferences {
  email: boolean;
  sms: boolean;
  push: boolean;
  bookingReminders: boolean;
  promotions: boolean;
  staffUpdates: boolean;
}

// Staff types
export interface Staff extends User {
  specialties: string[];
  workingHours: WorkingHours;
  hourlyRate?: number;
  commissionRate?: number;
  isAvailable: boolean;
  bio?: string;
  experience?: number;
  certifications?: string[];
  totalBookings?: number;
  averageRating?: number;
}

export interface WorkingHours {
  [key: number]: DaySchedule; // 0-6 for Sunday-Saturday
}

export interface DaySchedule {
  isWorking: boolean;
  start: string; // HH:MM format
  end: string;   // HH:MM format
  breaks?: TimeSlot[];
}

export interface TimeSlot {
  start: string;
  end: string;
}

// Service types
export interface Service {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  subcategory?: string;
  duration: number; // in minutes
  price: number;
  isActive: boolean;
  images?: string[];
  requirements?: string[];
  aftercareInstructions?: string;
  popularity: number;
  averageRating?: number;
  totalBookings?: number;
  createdAt: Date;
  updatedAt: Date;
}

export type ServiceCategory = 'hair' | 'nails' | 'facial' | 'massage' | 'waxing' | 'makeup';

export interface ServiceType {
  id: string;
  name: string;
  description: string;
  category: ServiceCategory;
  subcategory?: string;
  basePrice: number;
  baseDuration: number;
  variations?: ServiceVariation[];
  addOns?: ServiceAddOn[];
  isActive: boolean;
  staffIds?: string[];
  images?: string[];
  requirements?: string[];
  aftercare?: string;
  popularity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceVariation {
  id: string;
  name: string;
  priceModifier: number; // amount to add/subtract from base price
  durationModifier: number; // minutes to add/subtract
  description?: string;
}

export interface ServiceAddOn {
  id: string;
  name: string;
  price: number;
  duration: number;
  description?: string;
  isRequired?: boolean;
}

// Booking types
export interface Booking {
  id: string;
  customerId: string;
  customer?: User;
  staffId: string;
  staff?: Staff;
  serviceId: string;
  service?: Service;
  date: Date;
  time: string;
  duration: number;
  status: BookingStatus;
  price: number;
  notes?: string;
  cancellationReason?: string;
  reminderSent: boolean;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  rating?: number;
  review?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingStatus = 
  | 'pending'
  | 'confirmed'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

export type PaymentStatus = 
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'partial_refund';

export interface BookingRequest {
  serviceId: string;
  staffId: string;
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format
  customerInfo: CustomerInfo;
  notes?: string;
  variations?: string[];
  addOns?: string[];
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// Payment types
export interface Payment {
  id: string;
  bookingId: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  processorResponse?: any;
  refundAmount?: number;
  refundReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type PaymentMethod = 
  | 'cash'
  | 'credit_card'
  | 'debit_card'
  | 'gift_card'
  | 'store_credit';

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret?: string;
}

// Analytics types
export interface DashboardStats {
  todayBookings: number;
  todayRevenue: number;
  weeklyBookings: number;
  weeklyRevenue: number;
  monthlyBookings: number;
  monthlyRevenue: number;
  activeCustomers: number;
  popularServices: PopularService[];
  recentBookings: Booking[];
  upcomingAppointments: Booking[];
}

export interface PopularService {
  service: Service;
  bookingCount: number;
  revenue: number;
}

export interface BookingAnalytics {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  noShowBookings: number;
  averageRating: number;
  bookingsByDay: DayStats[];
  bookingsByService: ServiceStats[];
  bookingsByStaff: StaffStats[];
}

export interface DayStats {
  date: string;
  bookings: number;
  revenue: number;
}

export interface ServiceStats {
  serviceId: string;
  serviceName: string;
  bookings: number;
  revenue: number;
  averageRating: number;
}

export interface StaffStats {
  staffId: string;
  staffName: string;
  bookings: number;
  revenue: number;
  averageRating: number;
  hoursWorked: number;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  data?: any;
  isRead: boolean;
  createdAt: Date;
}

export type NotificationType = 
  | 'booking_confirmed'
  | 'booking_reminder'
  | 'booking_cancelled'
  | 'payment_success'
  | 'payment_failed'
  | 'staff_schedule'
  | 'promotion'
  | 'system';

// Form types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface BookingForm {
  serviceId: string;
  staffId: string;
  date: string;
  time: string;
  customerInfo: CustomerInfo;
  notes?: string;
}

export interface ServiceForm {
  name: string;
  description: string;
  category: ServiceCategory;
  subcategory?: string;
  price: number;
  duration: number;
  requirements?: string[];
  aftercareInstructions?: string;
}

export interface StaffForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialties: string[];
  bio?: string;
  hourlyRate?: number;
  commissionRate?: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface SearchResponse<T = any> {
  results: T[];
  total: number;
  query: string;
  filters?: any;
  suggestions?: string[];
}

// Error types
export interface ApiError {
  code: string;
  message: string;
  details?: any;
  field?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Settings types
export interface BusinessSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  timezone: string;
  currency: string;
  workingHours: WorkingHours;
  bookingSettings: BookingSettings;
  paymentSettings: PaymentSettings;
  notificationSettings: BusinessNotificationSettings;
}

export interface BookingSettings {
  advanceBookingDays: number;
  cancellationPolicy: number; // hours before appointment
  bufferTime: number; // minutes between appointments
  allowWalkIns: boolean;
  requireDeposit: boolean;
  depositAmount?: number;
  depositPercentage?: number;
}

export interface PaymentSettings {
  acceptCash: boolean;
  acceptCards: boolean;
  stripePublicKey?: string;
  taxRate: number;
  tipSuggestions: number[];
}

export interface BusinessNotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  bookingConfirmations: boolean;
  reminderHours: number[];
  staffNotifications: boolean;
}

// Theme types
export interface Theme {
  colors: ThemeColors;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  shadows: Shadows;
  animations: Animations;
}

export interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  secondaryDark: string;
  secondaryLight: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
  divider: string;
}

export interface Typography {
  fontFamily: string;
  fontSize: FontSizes;
  fontWeight: FontWeights;
  lineHeight: LineHeights;
}

export interface FontSizes {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
  xxxl: number;
}

export interface FontWeights {
  light: number;
  normal: number;
  medium: number;
  semibold: number;
  bold: number;
}

export interface LineHeights {
  tight: number;
  normal: number;
  relaxed: number;
}

export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
}

export interface BorderRadius {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  pill: number;
}

export interface Shadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface Animations {
  fast: number;
  normal: number;
  slow: number;
  extraSlow: number;
}

// Navigation types
export interface NavigationRoute {
  name: string;
  component: React.ComponentType<any>;
  options?: any;
}

export interface TabRoute {
  name: string;
  title: string;
  icon: string;
  component: React.ComponentType<any>;
}

// Component Props types
export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  style?: any;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: string;
  disabled?: boolean;
  secureTextEntry?: boolean;
  keyboardType?: string;
  multiline?: boolean;
  numberOfLines?: number;
  style?: any;
}

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
}

// Redux/State types
export interface RootState {
  auth: AuthState;
  bookings: BookingState;
  services: ServiceState;
  staff: StaffState;
  notifications: NotificationState;
  ui: UiState;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface BookingState {
  bookings: Booking[];
  currentBooking: Booking | null;
  isLoading: boolean;
  error: string | null;
}

export interface ServiceState {
  services: Service[];
  categories: ServiceCategory[];
  isLoading: boolean;
  error: string | null;
}

export interface StaffState {
  staff: Staff[];
  currentStaff: Staff | null;
  isLoading: boolean;
  error: string | null;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
}

export interface UiState {
  theme: 'light' | 'dark';
  language: string;
  isOnline: boolean;
  currentRoute: string;
}

export default {};