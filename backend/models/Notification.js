const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Notification content
  title: {
    type: String,
    required: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: true,
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  shortMessage: {
    type: String,
    maxlength: [150, 'Short message cannot exceed 150 characters']
  },

  // Notification type and category
  type: {
    type: String,
    enum: ['appointment_reminder', 'appointment_confirmed', 'appointment_cancelled',
           'appointment_rescheduled', 'payment_success', 'payment_failed',
           'loyalty_earned', 'loyalty_expiring', 'review_request',
           'promotion', 'system_update', 'staff_message'],
    required: true
  },
  category: {
    type: String,
    enum: ['appointment', 'payment', 'loyalty', 'promotion', 'system', 'social'],
    required: true
  },

  // Related entities
  relatedEntities: {
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment' },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'ServiceType' },
    staff: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review' }
  },

  // Delivery channels
  channels: {
    push: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      token: String,
      success: Boolean,
      error: String
    },
    email: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      success: Boolean,
      error: String
    },
    sms: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      success: Boolean,
      error: String
    },
    inApp: {
      read: { type: Boolean, default: false },
      readAt: Date
    }
  },

  // Scheduling
  scheduledFor: Date,
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },

  // Status and tracking
  status: {
    type: String,
    enum: ['pending', 'sent', 'delivered', 'read', 'failed'],
    default: 'pending'
  },

  // User preferences and settings
  respectUserPreferences: {
    type: Boolean,
    default: true
  },

  // Actions (for interactive notifications)
  actions: [{
    label: String,
    action: String, // e.g., 'view_booking', 'reschedule', 'cancel'
    url: String,
    data: mongoose.Schema.Types.Mixed
  }],

  // Analytics and tracking
  metadata: {
    source: String,
    campaign: String,
    userAgent: String,
    ipAddress: String,
    deviceInfo: String
  },

  // Expiration
  expiresAt: Date,

  // Audit
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  sentBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
notificationSchema.index({ recipient: 1, createdAt: -1 });
notificationSchema.index({ type: 1, status: 1 });
notificationSchema.index({ scheduledFor: 1, status: 1 });
notificationSchema.index({ 'channels.push.sent': 1 });
notificationSchema.index({ 'channels.email.sent': 1 });
notificationSchema.index({ 'channels.sms.sent': 1 });
notificationSchema.index({ 'channels.inApp.read': 1 });
notificationSchema.index({ expiresAt: 1 });

// Pre-save middleware
notificationSchema.pre('save', function(next) {
  this.updatedAt = Date.now();

  // Set default expiration (30 days from creation if not set)
  if (!this.expiresAt) {
    this.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }

  next();
});

// Instance methods
notificationSchema.methods.markAsRead = function() {
  this.channels.inApp.read = true;
  this.channels.inApp.readAt = new Date();
  this.status = 'read';
  return this.save();
};

notificationSchema.methods.markAsSent = function(channel, success = true, error = null) {
  if (this.channels[channel]) {
    this.channels[channel].sent = true;
    this.channels[channel].sentAt = new Date();
    this.channels[channel].success = success;
    if (error) {
      this.channels[channel].error = error;
    }
  }

  // Update overall status
  this.updateStatus();
  return this.save();
};

notificationSchema.methods.updateStatus = function() {
  const channels = Object.keys(this.channels);
  const sentChannels = channels.filter(channel => this.channels[channel].sent);

  if (sentChannels.length === 0) {
    this.status = 'pending';
  } else if (this.channels.inApp && this.channels.inApp.read) {
    this.status = 'read';
  } else if (sentChannels.length === channels.length) {
    this.status = 'delivered';
  } else {
    this.status = 'sent';
  }
};

notificationSchema.methods.shouldSendToChannel = function(channel) {
  // Check user preferences if respectUserPreferences is true
  if (this.respectUserPreferences && this.recipient.preferences?.notifications) {
    const pref = this.recipient.preferences.notifications;
    switch (channel) {
      case 'push':
        return pref.push !== false;
      case 'email':
        return pref.email !== false;
      case 'sms':
        return pref.sms !== false;
    }
  }
  return true;
};

notificationSchema.methods.getDeliveryStatus = function() {
  return {
    id: this._id,
    status: this.status,
    channels: {
      push: this.channels.push,
      email: this.channels.email,
      sms: this.channels.sms,
      inApp: this.channels.inApp
    },
    sentAt: this.createdAt,
    readAt: this.channels.inApp?.readAt
  };
};

// Static methods
notificationSchema.statics.createAppointmentReminder = function(bookingId, hoursBefore = 24) {
  // This would be implemented to create appointment reminder notifications
  // based on booking data and user preferences
  return this.create({
    // Implementation would fetch booking details and create appropriate notification
  });
};

notificationSchema.statics.getUnreadCount = function(userId) {
  return this.countDocuments({
    recipient: userId,
    'channels.inApp.read': false,
    expiresAt: { $gt: new Date() }
  });
};

notificationSchema.statics.markAllAsRead = function(userId) {
  return this.updateMany(
    {
      recipient: userId,
      'channels.inApp.read': false
    },
    {
      $set: {
        'channels.inApp.read': true,
        'channels.inApp.readAt': new Date(),
        status: 'read'
      }
    }
  );
};

notificationSchema.statics.getPendingNotifications = function(limit = 100) {
  return this.find({
    status: 'pending',
    scheduledFor: { $lte: new Date() },
    expiresAt: { $gt: new Date() }
  })
  .populate('recipient', 'preferences.notifications')
  .limit(limit)
  .sort({ priority: -1, createdAt: 1 });
};

notificationSchema.statics.cleanupExpired = function() {
  return this.deleteMany({
    expiresAt: { $lt: new Date() }
  });
};

// Virtual for formatted message
notificationSchema.virtual('formattedMessage').get(function() {
  return {
    id: this._id,
    title: this.title,
    message: this.message,
    shortMessage: this.shortMessage || this.message.substring(0, 150),
    type: this.type,
    category: this.category,
    priority: this.priority,
    status: this.status,
    createdAt: this.createdAt,
    actions: this.actions
  };
});

// Ensure virtual fields are serialized
notificationSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Notification', notificationSchema);