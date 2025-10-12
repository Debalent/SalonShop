// Common validation functions for forms across mobile and web apps

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'Email is required';
  }
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  return null;
};

// Password validation
export const validatePassword = (password) => {
  if (!password) {
    return 'Password is required';
  }
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!/(?=.*\d)/.test(password)) {
    return 'Password must contain at least one number';
  }
  return null;
};

// Phone number validation
export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phone) {
    return 'Phone number is required';
  }
  if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
    return 'Please enter a valid phone number';
  }
  return null;
};

// Name validation
export const validateName = (name, fieldName = 'Name') => {
  const nameRegex = /^[a-zA-Z\s\-'\.]+$/;
  if (!name) {
    return `${fieldName} is required`;
  }
  if (name.length < 2) {
    return `${fieldName} must be at least 2 characters long`;
  }
  if (name.length > 50) {
    return `${fieldName} must be less than 50 characters`;
  }
  if (!nameRegex.test(name)) {
    return `${fieldName} can only contain letters, spaces, hyphens, apostrophes, and periods`;
  }
  return null;
};

// Required field validation
export const validateRequired = (value, fieldName) => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`;
  }
  return null;
};

// Date validation
export const validateDate = (date, fieldName = 'Date') => {
  if (!date) {
    return `${fieldName} is required`;
  }
  const selectedDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    return `${fieldName} cannot be in the past`;
  }
  return null;
};

// Time validation
export const validateTime = (time, fieldName = 'Time') => {
  if (!time) {
    return `${fieldName} is required`;
  }
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(time)) {
    return 'Please enter a valid time in HH:MM format';
  }
  return null;
};

// Price validation
export const validatePrice = (price, fieldName = 'Price') => {
  if (!price && price !== 0) {
    return `${fieldName} is required`;
  }
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) {
    return `${fieldName} must be a valid number`;
  }
  if (numPrice < 0) {
    return `${fieldName} cannot be negative`;
  }
  if (numPrice > 10000) {
    return `${fieldName} cannot exceed $10,000`;
  }
  return null;
};

// Duration validation (in minutes)
export const validateDuration = (duration, fieldName = 'Duration') => {
  if (!duration) {
    return `${fieldName} is required`;
  }
  const numDuration = parseInt(duration);
  if (isNaN(numDuration)) {
    return `${fieldName} must be a valid number`;
  }
  if (numDuration < 15) {
    return `${fieldName} must be at least 15 minutes`;
  }
  if (numDuration > 480) {
    return `${fieldName} cannot exceed 8 hours`;
  }
  if (numDuration % 15 !== 0) {
    return `${fieldName} must be in 15-minute intervals`;
  }
  return null;
};

// Percentage validation
export const validatePercentage = (percentage, fieldName = 'Percentage') => {
  if (!percentage && percentage !== 0) {
    return `${fieldName} is required`;
  }
  const numPercentage = parseFloat(percentage);
  if (isNaN(numPercentage)) {
    return `${fieldName} must be a valid number`;
  }
  if (numPercentage < 0) {
    return `${fieldName} cannot be negative`;
  }
  if (numPercentage > 100) {
    return `${fieldName} cannot exceed 100%`;
  }
  return null;
};

// URL validation
export const validateUrl = (url, fieldName = 'URL') => {
  if (!url) {
    return null; // URL is optional in most cases
  }
  try {
    new URL(url);
    return null;
  } catch {
    return `Please enter a valid ${fieldName}`;
  }
};

// Credit card validation (basic)
export const validateCreditCard = (cardNumber) => {
  if (!cardNumber) {
    return 'Card number is required';
  }
  const cleanCardNumber = cardNumber.replace(/\s/g, '');
  if (!/^\d{13,19}$/.test(cleanCardNumber)) {
    return 'Please enter a valid card number';
  }
  
  // Luhn algorithm
  let sum = 0;
  let shouldDouble = false;
  for (let i = cleanCardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanCardNumber.charAt(i));
    if (shouldDouble) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    shouldDouble = !shouldDouble;
  }
  
  if (sum % 10 !== 0) {
    return 'Please enter a valid card number';
  }
  return null;
};

// CVV validation
export const validateCvv = (cvv) => {
  if (!cvv) {
    return 'CVV is required';
  }
  if (!/^\d{3,4}$/.test(cvv)) {
    return 'CVV must be 3 or 4 digits';
  }
  return null;
};

// Expiry date validation
export const validateExpiryDate = (expiryDate) => {
  if (!expiryDate) {
    return 'Expiry date is required';
  }
  const [month, year] = expiryDate.split('/');
  if (!month || !year) {
    return 'Please enter expiry date in MM/YY format';
  }
  
  const numMonth = parseInt(month);
  const numYear = parseInt(year);
  
  if (numMonth < 1 || numMonth > 12) {
    return 'Invalid month';
  }
  
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;
  
  if (numYear < currentYear || (numYear === currentYear && numMonth < currentMonth)) {
    return 'Card has expired';
  }
  
  return null;
};

// Form validation helper
export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  for (const field in validationRules) {
    const rules = validationRules[field];
    const value = formData[field];
    
    for (const rule of rules) {
      const error = rule(value);
      if (error) {
        errors[field] = error;
        break; // Stop at first error for this field
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Booking validation
export const validateBooking = (bookingData) => {
  const validationRules = {
    serviceId: [value => validateRequired(value, 'Service')],
    staffId: [value => validateRequired(value, 'Staff member')],
    date: [value => validateDate(value, 'Appointment date')],
    time: [value => validateTime(value, 'Appointment time')],
    customerName: [value => validateName(value, 'Customer name')],
    customerPhone: [value => validatePhone(value)],
    customerEmail: [value => validateEmail(value)],
  };
  
  return validateForm(bookingData, validationRules);
};

// Service validation
export const validateService = (serviceData) => {
  const validationRules = {
    name: [value => validateName(value, 'Service name')],
    description: [value => validateRequired(value, 'Description')],
    price: [value => validatePrice(value)],
    duration: [value => validateDuration(value)],
    category: [value => validateRequired(value, 'Category')],
  };
  
  return validateForm(serviceData, validationRules);
};

// Staff validation
export const validateStaff = (staffData) => {
  const validationRules = {
    firstName: [value => validateName(value, 'First name')],
    lastName: [value => validateName(value, 'Last name')],
    email: [value => validateEmail(value)],
    phone: [value => validatePhone(value)],
    specialties: [value => validateRequired(value, 'Specialties')],
  };
  
  return validateForm(staffData, validationRules);
};

// Customer validation
export const validateCustomer = (customerData) => {
  const validationRules = {
    firstName: [value => validateName(value, 'First name')],
    lastName: [value => validateName(value, 'Last name')],
    email: [value => validateEmail(value)],
    phone: [value => validatePhone(value)],
  };
  
  return validateForm(customerData, validationRules);
};

export default {
  validateEmail,
  validatePassword,
  validatePhone,
  validateName,
  validateRequired,
  validateDate,
  validateTime,
  validatePrice,
  validateDuration,
  validatePercentage,
  validateUrl,
  validateCreditCard,
  validateCvv,
  validateExpiryDate,
  validateForm,
  validateBooking,
  validateService,
  validateStaff,
  validateCustomer,
};