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
    submittedAt: Date
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
bookingSchema.statics.findAvailableSlots = async function(staffId, date, serviceDuration) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  // Find existing bookings for the staff member on the given date
  const existingBookings = await this.find({
    staff: staffId,
    appointmentDate: {
      $gte: startOfDay,
      $lte: endOfDay
    },
    status: { $in: ['pending', 'confirmed', 'in-progress'] }
  }).sort({ startTime: 1 });
  
  // TODO: Implement slot availability logic based on staff schedule
  // This would check against the staff member's working hours and existing bookings
  
  return []; // Placeholder
};

// Ensure virtual fields are serialized
bookingSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Booking', bookingSchema);