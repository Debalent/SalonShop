const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer is required']
  },
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Staff member is required']
  },
  services: [{
    serviceType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceType',
      required: true
    },
    customizations: [{
      name: String,
      value: String,
      additionalCost: { type: Number, default: 0 }
    }],
    price: {
      type: Number,
      required: true
    },
    duration: {
      type: Number, // in minutes
      required: true
    }
  }],
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  startTime: {
    type: String, // HH:MM format
    required: [true, 'Start time is required']
  },
  endTime: {
    type: String, // HH:MM format
    required: [true, 'End time is required']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  depositAmount: {
    type: Number,
    default: 0
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  discountReason: String,
  tipAmount: {
    type: Number,
    default: 0
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  finalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'digital_wallet', 'bank_transfer', 'loyalty_points'],
    default: 'card'
  },
  notes: {
    customer: String,
    staff: String,
    internal: String
  },
  remindersSent: [{
    type: { type: String, enum: ['email', 'sms', 'push'] },
    sentAt: Date,
    successful: Boolean
  }],
  cancellationReason: String,
  cancelledBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  cancelledAt: Date,
  rescheduledFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  rescheduledTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    submittedAt: Date,
    photos: [String], // Before/after photos uploaded by customer
    wouldRecommend: Boolean,
    serviceQuality: {
      type: Number,
      min: 1,
      max: 5
    },
    staffRating: {
      type: Number,
      min: 1,
      max: 5
    },
    valueForMoney: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  loyaltyPoints: {
    earned: { type: Number, default: 0 },
    redeemed: { type: Number, default: 0 },
    bonusMultiplier: { type: Number, default: 1 } // For special promotions
  },
  metadata: {
    source: { type: String, enum: ['mobile_app', 'web_app', 'phone', 'walk_in'], default: 'mobile_app' },
    deviceInfo: String,
    ipAddress: String
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
bookingSchema.index({ customer: 1, appointmentDate: 1 });
bookingSchema.index({ staff: 1, appointmentDate: 1 });
bookingSchema.index({ status: 1 });
bookingSchema.index({ appointmentDate: 1, startTime: 1 });
bookingSchema.index({ paymentStatus: 1 });

// Pre-save middleware to update timestamps
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for appointment duration in minutes
bookingSchema.virtual('totalDuration').get(function() {
  return this.services.reduce((total, service) => total + service.duration, 0);
});

// Virtual for formatted appointment time
bookingSchema.virtual('appointmentTimeFormatted').get(function() {
  const date = new Date(this.appointmentDate);
  return `${date.toLocaleDateString()} ${this.startTime} - ${this.endTime}`;
});

// Method to check if booking can be cancelled
bookingSchema.methods.canBeCancelled = function() {
  const now = new Date();
  const appointmentDateTime = new Date(this.appointmentDate);
  const [hours, minutes] = this.startTime.split(':').map(Number);
  appointmentDateTime.setHours(hours, minutes);
  
  // Can cancel if appointment is more than 24 hours away and status allows
  const hoursUntilAppointment = (appointmentDateTime - now) / (1000 * 60 * 60);
  const cancellableStatuses = ['pending', 'confirmed'];
  
  return hoursUntilAppointment > 24 && cancellableStatuses.includes(this.status);
};

// Method to check if booking can be rescheduled
bookingSchema.methods.canBeRescheduled = function() {
  const now = new Date();
  const appointmentDateTime = new Date(this.appointmentDate);
  const [hours, minutes] = this.startTime.split(':').map(Number);
  appointmentDateTime.setHours(hours, minutes);
  
  // Can reschedule if appointment is more than 12 hours away and status allows
  const hoursUntilAppointment = (appointmentDateTime - now) / (1000 * 60 * 60);
  const reschedulableStatuses = ['pending', 'confirmed'];
  
  return hoursUntilAppointment > 12 && reschedulableStatuses.includes(this.status);
};

// Static method to find available time slots
bookingSchema.statics.findAvailableSlots = async function(staffId, date, serviceDuration, bufferTime = 15) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Get staff member's schedule for the day
  const User = mongoose.model('User');
  const staff = await User.findById(staffId);

  if (!staff || !staff.staffInfo?.schedule) {
    return [];
  }

  // Check if staff is working on this day
  const dayOfWeek = date.toLowerCase();
  const daySchedule = staff.staffInfo.schedule[dayOfWeek];

  if (!daySchedule || !daySchedule.isWorking) {
    return [];
  }

  // Parse working hours
  const [startHour, startMinute] = daySchedule.start.split(':').map(Number);
  const [endHour, endMinute] = daySchedule.end.split(':').map(Number);

  const workStart = new Date(date);
  workStart.setHours(startHour, startMinute, 0, 0);

  const workEnd = new Date(date);
  workEnd.setHours(endHour, endMinute, 0, 0);

  // Find existing bookings for the staff member on the given date
  const existingBookings = await this.find({
    staff: staffId,
    appointmentDate: {
      $gte: startOfDay,
      $lte: endOfDay
    },
    status: { $in: ['pending', 'confirmed', 'in-progress'] }
  }).sort({ startTime: 1 });

  // Generate all possible time slots
  const slots = [];
  let currentTime = new Date(workStart);

  while (currentTime < workEnd) {
    const slotEnd = new Date(currentTime.getTime() + (serviceDuration + bufferTime) * 60000);

    // Check if slot fits within working hours
    if (slotEnd <= workEnd) {
      // Check for conflicts with existing bookings
      const hasConflict = existingBookings.some(booking => {
        const bookingStart = new Date(date);
        const [bHour, bMinute] = booking.startTime.split(':').map(Number);
        bookingStart.setHours(bHour, bMinute, 0, 0);

        const bookingEnd = new Date(date);
        const [beHour, beMinute] = booking.endTime.split(':').map(Number);
        bookingEnd.setHours(beHour, beMinute, 0, 0);

        // Check for overlap
        return (currentTime < bookingEnd && slotEnd > bookingStart);
      });

      if (!hasConflict) {
        slots.push({
          startTime: currentTime.toTimeString().substring(0, 5),
          endTime: slotEnd.toTimeString().substring(0, 5),
          available: true,
          staff: staffId
        });
      }
    }

    // Move to next slot (30-minute intervals)
    currentTime = new Date(currentTime.getTime() + 30 * 60000);
  }

  return slots;
};

// Static method to get real-time availability for multiple staff
bookingSchema.statics.getRealtimeAvailability = async function(staffIds, date, serviceDuration) {
  const availability = {};

  for (const staffId of staffIds) {
    const slots = await this.findAvailableSlots(staffId, date, serviceDuration);
    availability[staffId] = {
      staffId,
      availableSlots: slots.length,
      nextAvailable: slots.length > 0 ? slots[0].startTime : null,
      allSlots: slots
    };
  }

  return availability;
};

// Static method to check if a specific time slot is available
bookingSchema.statics.isSlotAvailable = async function(staffId, date, startTime, serviceDuration) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  // Parse the requested time
  const [hour, minute] = startTime.split(':').map(Number);
  const requestedStart = new Date(date);
  requestedStart.setHours(hour, minute, 0, 0);

  const requestedEnd = new Date(requestedStart.getTime() + serviceDuration * 60000);

  // Check staff schedule
  const User = mongoose.model('User');
  const staff = await User.findById(staffId);

  if (!staff || !staff.staffInfo?.schedule) {
    return false;
  }

  const dayOfWeek = date.toLowerCase();
  const daySchedule = staff.staffInfo.schedule[dayOfWeek];

  if (!daySchedule || !daySchedule.isWorking) {
    return false;
  }

  // Check if requested time is within working hours
  const [startHour, startMinute] = daySchedule.start.split(':').map(Number);
  const [endHour, endMinute] = daySchedule.end.split(':').map(Number);

  const workStart = new Date(date);
  workStart.setHours(startHour, startMinute, 0, 0);

  const workEnd = new Date(date);
  workEnd.setHours(endHour, endMinute, 0, 0);

  if (requestedStart < workStart || requestedEnd > workEnd) {
    return false;
  }

  // Check for booking conflicts
  const conflictingBookings = await this.find({
    staff: staffId,
    appointmentDate: {
      $gte: startOfDay,
      $lte: endOfDay
    },
    status: { $in: ['pending', 'confirmed', 'in-progress'] },
    $or: [
      {
        startTime: { $lt: requestedEnd.toTimeString().substring(0, 5) },
        endTime: { $gt: requestedStart.toTimeString().substring(0, 5) }
      }
    ]
  });

  return conflictingBookings.length === 0;
};

// Ensure virtual fields are serialized
bookingSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Booking', bookingSchema);