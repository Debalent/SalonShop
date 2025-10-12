const mongoose = require('mongoose');

const tipSchema = new mongoose.Schema({
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking is required']
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Customer is required']
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Tip recipient is required']
  },
  amount: {
    type: Number,
    required: [true, 'Tip amount is required'],
    min: [0, 'Tip amount cannot be negative']
  },
  percentage: {
    type: Number,
    min: [0, 'Tip percentage cannot be negative'],
    max: [100, 'Tip percentage cannot exceed 100%']
  },
  method: {
    type: String,
    enum: ['cash', 'card', 'digital_wallet', 'app'],
    required: [true, 'Tip method is required']
  },
  source: {
    type: String,
    enum: ['booking_payment', 'separate_transaction', 'cash_tip'],
    default: 'booking_payment'
  },
  status: {
    type: String,
    enum: ['pending', 'distributed', 'failed', 'refunded'],
    default: 'pending'
  },
  distributionRule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DispersalRule'
  },
  distributions: [{
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    },
    role: {
      type: String,
      enum: ['primary', 'assistant', 'support', 'house']
    },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    },
    paidAt: Date,
    paymentMethod: String,
    transactionId: String
  }],
  originalAmount: {
    type: Number,
    required: true
  },
  processingFee: {
    type: Number,
    default: 0
  },
  netAmount: {
    type: Number,
    required: true
  },
  paymentTransactionId: String,
  paymentProcessor: {
    type: String,
    enum: ['stripe', 'square', 'paypal', 'cash']
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    deviceInfo: String
  },
  notes: {
    customer: String,
    staff: String,
    admin: String
  },
  distributedAt: Date,
  refundedAt: Date,
  refundReason: String,
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
tipSchema.index({ booking: 1 });
tipSchema.index({ customer: 1 });
tipSchema.index({ recipient: 1, status: 1 });
tipSchema.index({ status: 1, createdAt: -1 });
tipSchema.index({ distributedAt: 1 });

// Pre-save middleware
tipSchema.pre('save', function(next) {
  // Calculate net amount after processing fees
  this.netAmount = this.originalAmount - this.processingFee;
  this.amount = this.netAmount;
  
  this.updatedAt = Date.now();
  next();
});

// Virtual for total distributed amount
tipSchema.virtual('totalDistributed').get(function() {
  return this.distributions.reduce((sum, dist) => sum + dist.amount, 0);
});

// Method to distribute tip according to rules
tipSchema.methods.distributeTip = async function(ruleId) {
  const DispersalRule = mongoose.model('DispersalRule');
  
  if (!ruleId) {
    // Default distribution - 100% to primary recipient
    this.distributions = [{
      recipient: this.recipient,
      amount: this.netAmount,
      percentage: 100,
      role: 'primary',
      status: 'pending'
    }];
  } else {
    const rule = await DispersalRule.findById(ruleId);
    if (!rule) {
      throw new Error('Dispersal rule not found');
    }
    
    this.distributionRule = ruleId;
    this.distributions = [];
    
    // Apply distribution rules
    rule.rules.forEach(ruleItem => {
      const amount = (this.netAmount * ruleItem.percentage) / 100;
      this.distributions.push({
        recipient: ruleItem.recipient || this.recipient,
        amount: amount,
        percentage: ruleItem.percentage,
        role: ruleItem.role,
        status: 'pending'
      });
    });
  }
  
  this.status = 'distributed';
  this.distributedAt = new Date();
  await this.save();
  
  return this.distributions;
};

// Method to process tip payment to recipients
tipSchema.methods.processPayments = async function() {
  // Implementation would integrate with payment processor
  // to send money to staff members' accounts
  
  for (let distribution of this.distributions) {
    try {
      // Simulate payment processing
      distribution.status = 'paid';
      distribution.paidAt = new Date();
      distribution.paymentMethod = 'direct_deposit';
      distribution.transactionId = `tip_${this._id}_${Date.now()}`;
    } catch (error) {
      distribution.status = 'failed';
      console.error('Payment processing failed:', error);
    }
  }
  
  await this.save();
  return this.distributions;
};

// Static method to calculate tips for period
tipSchema.statics.getTipsForPeriod = function(recipientId, startDate, endDate) {
  return this.find({
    'distributions.recipient': recipientId,
    status: 'distributed',
    distributedAt: { $gte: startDate, $lte: endDate }
  }).populate('booking customer');
};

// Static method to get tip analytics
tipSchema.statics.getTipAnalytics = async function(startDate, endDate, filters = {}) {
  const pipeline = [
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate },
        status: 'distributed',
        ...filters
      }
    },
    {
      $group: {
        _id: null,
        totalTips: { $sum: '$amount' },
        averageTip: { $avg: '$amount' },
        tipCount: { $sum: 1 },
        averagePercentage: { $avg: '$percentage' }
      }
    }
  ];
  
  const result = await this.aggregate(pipeline);
  return result[0] || {
    totalTips: 0,
    averageTip: 0,
    tipCount: 0,
    averagePercentage: 0
  };
};

// Ensure virtual fields are serialized
tipSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Tip', tipSchema);