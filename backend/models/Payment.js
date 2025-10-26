const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  // Payment details
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    uppercase: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['credit_card', 'debit_card', 'digital_wallet', 'bank_transfer', 'cash', 'loyalty_points', 'gift_card']
  },

  // Payment processor details
  paymentProcessor: {
    type: String,
    enum: ['stripe', 'paypal', 'square', 'apple_pay', 'google_pay', 'manual'],
    required: true
  },
  processorTransactionId: String,
  processorResponse: mongoose.Schema.Types.Mixed,

  // Status tracking
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'cancelled', 'refunded', 'partially_refunded'],
    default: 'pending'
  },

  // Payment breakdown
  breakdown: {
    serviceAmount: {
      type: Number,
      required: true
    },
    taxAmount: {
      type: Number,
      default: 0
    },
    tipAmount: {
      type: Number,
      default: 0
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    loyaltyPointsUsed: {
      type: Number,
      default: 0
    },
    loyaltyPointsEarned: {
      type: Number,
      default: 0
    }
  },

  // Card/payment method details (PCI compliant - tokenized)
  paymentToken: String,
  lastFourDigits: String,
  cardBrand: {
    type: String,
    enum: ['visa', 'mastercard', 'amex', 'discover', 'jcb', 'diners']
  },
  expiryMonth: Number,
  expiryYear: Number,

  // Digital wallet details
  walletType: {
    type: String,
    enum: ['apple_pay', 'google_pay', 'paypal', 'venmo']
  },

  // Refund information
  refunds: [{
    amount: {
      type: Number,
      required: true
    },
    reason: String,
    processedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    processorRefundId: String,
    refundDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending'
    }
  }],

  // Billing address
  billingAddress: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'USA'
    }
  },

  // Additional fees and charges
  processingFee: {
    type: Number,
    default: 0
  },
  convenienceFee: {
    type: Number,
    default: 0
  },

  // Metadata
  ipAddress: String,
  userAgent: String,
  deviceFingerprint: String,

  // Audit trail
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  processedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  processedAt: Date,
  completedAt: Date,

  // Webhook and notification tracking
  webhooksReceived: [{
    event: String,
    data: mongoose.Schema.Types.Mixed,
    receivedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Failure/retry information
  failureReason: String,
  retryCount: {
    type: Number,
    default: 0
  },
  maxRetries: {
    type: Number,
    default: 3
  },

  // Compliance and fraud prevention
  riskScore: Number,
  fraudIndicators: [String],
  complianceFlags: [String]
});

// Indexes
paymentSchema.index({ booking: 1 });
paymentSchema.index({ customer: 1 });
paymentSchema.index({ status: 1 });
paymentSchema.index({ paymentProcessor: 1 });
paymentSchema.index({ processorTransactionId: 1 });
paymentSchema.index({ createdAt: -1 });

// Pre-save middleware
paymentSchema.pre('save', function(next) {
  // Auto-set timestamps based on status
  if (this.isModified('status')) {
    if (this.status === 'processing' && !this.processedAt) {
      this.processedAt = new Date();
    } else if (this.status === 'completed' && !this.completedAt) {
      this.completedAt = new Date();
    }
  }
  next();
});

// Virtual for total refunded amount
paymentSchema.virtual('totalRefunded').get(function() {
  return this.refunds
    .filter(refund => refund.status === 'completed')
    .reduce((total, refund) => total + refund.amount, 0);
});

// Virtual for net amount (after refunds)
paymentSchema.virtual('netAmount').get(function() {
  return this.amount - this.totalRefunded;
});

// Instance methods
paymentSchema.methods.canRefund = function(amount = null) {
  const refundAmount = amount || this.amount;
  const availableForRefund = this.amount - this.totalRefunded;

  return this.status === 'completed' &&
         refundAmount > 0 &&
         refundAmount <= availableForRefund;
};

paymentSchema.methods.processRefund = function(amount, reason, processedBy) {
  if (!this.canRefund(amount)) {
    throw new Error('Refund not allowed');
  }

  this.refunds.push({
    amount,
    reason,
    processedBy,
    status: 'pending'
  });

  // Update payment status if fully refunded
  const totalRefunded = this.totalRefunded + amount;
  if (totalRefunded >= this.amount) {
    this.status = 'refunded';
  } else if (totalRefunded > 0) {
    this.status = 'partially_refunded';
  }

  return this.save();
};

paymentSchema.methods.markRefundCompleted = function(refundId, processorRefundId) {
  const refund = this.refunds.id(refundId);
  if (refund) {
    refund.status = 'completed';
    refund.processorRefundId = processorRefundId;
    refund.refundDate = new Date();
  }
  return this.save();
};

paymentSchema.methods.isSuccessful = function() {
  return ['completed', 'partially_refunded'].includes(this.status);
};

paymentSchema.methods.getPaymentSummary = function() {
  return {
    id: this._id,
    amount: this.amount,
    currency: this.currency,
    status: this.status,
    paymentMethod: this.paymentMethod,
    processedAt: this.processedAt,
    breakdown: this.breakdown,
    refunds: this.refunds.length,
    totalRefunded: this.totalRefunded
  };
};

// Static methods
paymentSchema.statics.getPaymentsByDateRange = function(startDate, endDate, status = null) {
  const query = {
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  };

  if (status) {
    query.status = status;
  }

  return this.find(query).populate('booking customer');
};

paymentSchema.statics.getTotalRevenue = async function(startDate, endDate) {
  const result = await this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: 'completed'
      }
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount' },
        totalRefunds: { $sum: { $ifNull: ['$totalRefunded', 0] } },
        netRevenue: { $sum: '$netAmount' }
      }
    }
  ]);

  return result.length > 0 ? result[0] : { totalRevenue: 0, totalRefunds: 0, netRevenue: 0 };
};

paymentSchema.statics.getPaymentMethodStats = async function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: 'completed'
      }
    },
    {
      $group: {
        _id: '$paymentMethod',
        count: { $sum: 1 },
        totalAmount: { $sum: '$amount' }
      }
    },
    {
      $sort: { totalAmount: -1 }
    }
  ]);
};

// Ensure virtual fields are serialized
paymentSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Payment', paymentSchema);