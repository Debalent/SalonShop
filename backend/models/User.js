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
      monday: {
        start: String,
        end: String,
        isWorking: { type: Boolean, default: true },
        breaks: [{
          start: String,
          end: String,
          description: String
        }],
        availability: {
          type: String,
          enum: ['available', 'limited', 'unavailable'],
          default: 'available'
        }
      },
      tuesday: {
        start: String,
        end: String,
        isWorking: { type: Boolean, default: true },
        breaks: [{
          start: String,
          end: String,
          description: String
        }],
        availability: {
          type: String,
          enum: ['available', 'limited', 'unavailable'],
          default: 'available'
        }
      },
      wednesday: {
        start: String,
        end: String,
        isWorking: { type: Boolean, default: true },
        breaks: [{
          start: String,
          end: String,
          description: String
        }],
        availability: {
          type: String,
          enum: ['available', 'limited', 'unavailable'],
          default: 'available'
        }
      },
      thursday: {
        start: String,
        end: String,
        isWorking: { type: Boolean, default: true },
        breaks: [{
          start: String,
          end: String,
          description: String
        }],
        availability: {
          type: String,
          enum: ['available', 'limited', 'unavailable'],
          default: 'available'
        }
      },
      friday: {
        start: String,
        end: String,
        isWorking: { type: Boolean, default: true },
        breaks: [{
          start: String,
          end: String,
          description: String
        }],
        availability: {
          type: String,
          enum: ['available', 'limited', 'unavailable'],
          default: 'available'
        }
      },
      saturday: {
        start: String,
        end: String,
        isWorking: { type: Boolean, default: false },
        breaks: [{
          start: String,
          end: String,
          description: String
        }],
        availability: {
          type: String,
          enum: ['available', 'limited', 'unavailable'],
          default: 'available'
        }
      },
      sunday: {
        start: String,
        end: String,
        isWorking: { type: Boolean, default: false },
        breaks: [{
          start: String,
          end: String,
          description: String
        }],
        availability: {
          type: String,
          enum: ['available', 'limited', 'unavailable'],
          default: 'available'
        }
      }
    },
    // Advanced scheduling features
    schedulingPreferences: {
      maxDailyAppointments: { type: Number, default: 8 },
      preferredBreakDuration: { type: Number, default: 15 }, // minutes
      bufferBetweenAppointments: { type: Number, default: 15 }, // minutes
      advanceBookingLimit: { type: Number, default: 60 }, // days
      blackoutDates: [{
        startDate: Date,
        endDate: Date,
        reason: String,
        recurring: { type: Boolean, default: false }
      }],
      timeOffRequests: [{
        startDate: Date,
        endDate: Date,
        reason: String,
        status: {
          type: String,
          enum: ['pending', 'approved', 'rejected'],
          default: 'pending'
        },
        approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        approvedAt: Date
      }]
    },
    bio: String,
    portfolio: [{
      imageUrl: String,
      description: String,
      serviceType: String,
      beforeAfterImages: {
        before: String,
        after: String
      },
      clientFeedback: {
        rating: Number,
        comment: String
      },
      isPublic: { type: Boolean, default: true },
      likes: { type: Number, default: 0 },
      tags: [String],
      dateCreated: { type: Date, default: Date.now }
    }],
    socialStats: {
      totalLikes: { type: Number, default: 0 },
      totalViews: { type: Number, default: 0 },
      averageRating: { type: Number, default: 0 },
      reviewCount: { type: Number, default: 0 }
    }
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
    notes: String,
    socialFeatures: {
      beforeAfterPhotos: [{
        beforeImage: String,
        afterImage: String,
        serviceType: String,
        date: Date,
        staff: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        isPublic: { type: Boolean, default: false },
        likes: { type: Number, default: 0 },
        comments: [{
          user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
          text: String,
          date: Date
        }]
      }],
      favoriteStylists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      stylePreferences: [String],
      socialHandle: String,
      profileVisibility: { type: String, enum: ['public', 'friends', 'private'], default: 'private' }
    }
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

// Instance method to check staff availability for a specific day and time
userSchema.methods.isAvailableOn = function(date, startTime, endTime) {
  if (!this.staffInfo || !this.staffInfo.schedule) {
    return false;
  }

  const dayOfWeek = date.toLowerCase();
  const daySchedule = this.staffInfo.schedule[dayOfWeek];

  if (!daySchedule || !daySchedule.isWorking || daySchedule.availability === 'unavailable') {
    return false;
  }

  // Check if the requested time falls within working hours
  const workStart = daySchedule.start;
  const workEnd = daySchedule.end;

  if (startTime < workStart || endTime > workEnd) {
    return false;
  }

  // Check for breaks
  if (daySchedule.breaks) {
    for (const breakPeriod of daySchedule.breaks) {
      if ((startTime < breakPeriod.end && endTime > breakPeriod.start)) {
        return false; // Overlaps with break
      }
    }
  }

  // Check blackout dates
  if (this.staffInfo.schedulingPreferences?.blackoutDates) {
    for (const blackout of this.staffInfo.schedulingPreferences.blackoutDates) {
      if (date >= blackout.startDate && date <= blackout.endDate) {
        return false;
      }
    }
  }

  // Check time off requests
  if (this.staffInfo.schedulingPreferences?.timeOffRequests) {
    for (const timeOff of this.staffInfo.schedulingPreferences.timeOffRequests) {
      if (timeOff.status === 'approved' && date >= timeOff.startDate && date <= timeOff.endDate) {
        return false;
      }
    }
  }

  return true;
};

// Instance method to get available time slots for a specific date
userSchema.methods.getAvailableSlots = function(date, serviceDuration = 60, bufferTime = 15) {
  if (!this.isAvailableOn(date, '00:00', '23:59')) {
    return [];
  }

  const dayOfWeek = date.toLowerCase();
  const daySchedule = this.staffInfo.schedule[dayOfWeek];
  const slots = [];

  const workStart = daySchedule.start;
  const workEnd = daySchedule.end;

  // Parse working hours
  const [startHour, startMinute] = workStart.split(':').map(Number);
  const [endHour, endMinute] = workEnd.split(':').map(Number);

  let currentTime = new Date(date);
  currentTime.setHours(startHour, startMinute, 0, 0);

  const endTime = new Date(date);
  endTime.setHours(endHour, endMinute, 0, 0);

  // Generate slots
  while (currentTime < endTime) {
    const slotEnd = new Date(currentTime.getTime() + serviceDuration * 60000);

    if (slotEnd <= endTime) {
      // Check if slot doesn't overlap with breaks
      let overlapsBreak = false;
      if (daySchedule.breaks) {
        for (const breakPeriod of daySchedule.breaks) {
          const breakStart = new Date(date);
          const [bHour, bMinute] = breakPeriod.start.split(':').map(Number);
          breakStart.setHours(bHour, bMinute, 0, 0);

          const breakEnd = new Date(date);
          const [beHour, beMinute] = breakPeriod.end.split(':').map(Number);
          breakEnd.setHours(beHour, beMinute, 0, 0);

          if (currentTime < breakEnd && slotEnd > breakStart) {
            overlapsBreak = true;
            break;
          }
        }
      }

      if (!overlapsBreak) {
        slots.push({
          startTime: currentTime.toTimeString().substring(0, 5),
          endTime: slotEnd.toTimeString().substring(0, 5),
          available: true
        });
      }
    }

    // Move to next slot (30-minute intervals)
    currentTime = new Date(currentTime.getTime() + 30 * 60000);
  }

  return slots;
};

// Instance method to request time off
userSchema.methods.requestTimeOff = function(startDate, endDate, reason) {
  if (!this.staffInfo || !this.staffInfo.schedulingPreferences) {
    throw new Error('Staff scheduling preferences not configured');
  }

  this.staffInfo.schedulingPreferences.timeOffRequests.push({
    startDate,
    endDate,
    reason,
    status: 'pending'
  });

  return this.save();
};

// Static method to get staff available on a specific date
userSchema.statics.getAvailableStaff = function(date, startTime, endTime) {
  return this.find({
    role: { $in: ['staff', 'technician', 'stylist'] },
    'staffInfo.isActive': true
  }).then(staff => {
    return staff.filter(member => member.isAvailableOn(date, startTime, endTime));
  });
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