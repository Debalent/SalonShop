const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true,
    match: [/^\+?[\d\s-()]+$/, 'Please enter a valid phone number']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  role: {
    type: String,
    enum: ['customer', 'staff', 'technician', 'stylist', 'budtender', 'manager', 'admin', 'owner'],
    default: 'customer'
  },
  avatar: {
    public_id: String,
    url: String
  },
  dateOfBirth: {
    type: Date
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'USA' }
  },
  emergencyContact: {
    name: String,
    phone: String,
    relationship: String
  },
  preferences: {
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    },
    language: { type: String, default: 'en' },
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'light' },
    timezone: { type: String, default: 'America/New_York' }
  },
  // Staff-specific fields
  staffInfo: {
    employeeId: String,
    specialty: [String], // e.g., ['hair_coloring', 'hair_cutting', 'nails', 'massage']
    certifications: [{
      name: String,
      issuer: String,
      dateIssued: Date,
      expirationDate: Date,
      certificateUrl: String
    }],
    hourlyRate: Number,
    commissionRate: Number, // Percentage (0-100)
    hireDate: Date,
    isActive: { type: Boolean, default: true },
    schedule: {
      monday: { start: String, end: String, isWorking: Boolean },
      tuesday: { start: String, end: String, isWorking: Boolean },
      wednesday: { start: String, end: String, isWorking: Boolean },
      thursday: { start: String, end: String, isWorking: Boolean },
      friday: { start: String, end: String, isWorking: Boolean },
      saturday: { start: String, end: String, isWorking: Boolean },
      sunday: { start: String, end: String, isWorking: Boolean }
    },
    bio: String,
    portfolio: [{
      imageUrl: String,
      description: String,
      serviceType: String
    }]
  },
  // Customer-specific fields
  customerInfo: {
    loyaltyPoints: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    favoriteServices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ServiceType' }],
    preferredStaff: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    allergies: [String],
    skinType: String,
    hairType: String,
    notes: String
  },
  isEmailVerified: { type: Boolean, default: false },
  isPhoneVerified: { type: Boolean, default: false },
  lastLoginAt: Date,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  emailVerificationToken: String,
  phoneVerificationCode: String,
  phoneVerificationExpires: Date,
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ 'staffInfo.specialty': 1 });
userSchema.index({ isActive: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash password if it's been modified
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const hashedPassword = await bcrypt.hash(this.password, 12);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error);
  }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Instance method to get full name
userSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.resetPasswordToken;
    delete ret.resetPasswordExpires;
    delete ret.emailVerificationToken;
    delete ret.phoneVerificationCode;
    delete ret.phoneVerificationExpires;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);