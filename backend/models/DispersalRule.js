const mongoose = require('mongoose');

const dispersalRuleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Rule name is required'],
    trim: true,
    maxlength: [100, 'Rule name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  serviceTypes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceType'
  }], // Empty array means applies to all services
  salon: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to salon owner/admin
    required: [true, 'Salon is required']
  },
  rules: [{
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['primary', 'assistant', 'support', 'house', 'management'],
      required: [true, 'Role is required']
    },
    percentage: {
      type: Number,
      required: [true, 'Percentage is required'],
      min: [0, 'Percentage cannot be negative'],
      max: [100, 'Percentage cannot exceed 100']
    },
    minimumAmount: {
      type: Number,
      default: 0
    },
    maximumAmount: {
      type: Number
    },
    conditions: {
      serviceValue: {
        min: Number,
        max: Number
      },
      tipPercentage: {
        min: Number,
        max: Number
      }
    }
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  priority: {
    type: Number,
    default: 0 // Higher numbers = higher priority
  },
  effectiveDate: {
    type: Date,
    default: Date.now
  },
  expirationDate: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  approvedAt: Date,
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
dispersalRuleSchema.index({ salon: 1, isActive: 1, priority: -1 });
dispersalRuleSchema.index({ serviceTypes: 1 });
dispersalRuleSchema.index({ effectiveDate: 1, expirationDate: 1 });

// Pre-save middleware to validate rules
dispersalRuleSchema.pre('save', function(next) {
  // Validate that percentages sum to 100%
  const totalPercentage = this.rules.reduce((sum, rule) => sum + rule.percentage, 0);
  
  if (Math.abs(totalPercentage - 100) > 0.01) { // Allow for floating point precision
    return next(new Error('Rule percentages must sum to 100%'));
  }
  
  this.updatedAt = Date.now();
  next();
});

// Method to check if rule applies to a booking
dispersalRuleSchema.methods.appliesTo = function(booking) {
  // Check if rule is active and within effective dates
  if (!this.isActive) return false;
  
  const now = new Date();
  if (this.effectiveDate && now < this.effectiveDate) return false;
  if (this.expirationDate && now > this.expirationDate) return false;
  
  // Check if rule applies to any of the booking's services
  if (this.serviceTypes.length === 0) return true; // Applies to all services
  
  const bookingServiceTypes = booking.services.map(s => s.serviceType.toString());
  const ruleServiceTypes = this.serviceTypes.map(s => s.toString());
  
  return bookingServiceTypes.some(serviceType => 
    ruleServiceTypes.includes(serviceType)
  );
};

// Static method to find applicable rule for booking
dispersalRuleSchema.statics.findApplicableRule = async function(booking, salonId) {
  const rules = await this.find({
    salon: salonId,
    isActive: true,
    $or: [
      { serviceTypes: { $size: 0 } }, // Rules that apply to all services
      { serviceTypes: { $in: booking.services.map(s => s.serviceType) } }
    ]
  }).sort({ priority: -1, createdAt: -1 });
  
  for (const rule of rules) {
    if (rule.appliesTo(booking)) {
      // Check additional conditions
      let conditionsMet = true;
      
      for (const ruleItem of rule.rules) {
        if (ruleItem.conditions) {
          // Check service value conditions
          if (ruleItem.conditions.serviceValue) {
            const { min, max } = ruleItem.conditions.serviceValue;
            if (min && booking.totalAmount < min) conditionsMet = false;
            if (max && booking.totalAmount > max) conditionsMet = false;
          }
          
          // Check tip percentage conditions
          if (ruleItem.conditions.tipPercentage && booking.tipAmount) {
            const tipPercentage = (booking.tipAmount / booking.totalAmount) * 100;
            const { min, max } = ruleItem.conditions.tipPercentage;
            if (min && tipPercentage < min) conditionsMet = false;
            if (max && tipPercentage > max) conditionsMet = false;
          }
        }
      }
      
      if (conditionsMet) {
        return rule;
      }
    }
  }
  
  return null; // No applicable rule found
};

// Method to calculate tip distribution
dispersalRuleSchema.methods.calculateDistribution = function(tipAmount) {
  const distributions = [];
  
  for (const rule of this.rules) {
    let amount = (tipAmount * rule.percentage) / 100;
    
    // Apply minimum and maximum constraints
    if (rule.minimumAmount && amount < rule.minimumAmount) {
      amount = rule.minimumAmount;
    }
    if (rule.maximumAmount && amount > rule.maximumAmount) {
      amount = rule.maximumAmount;
    }
    
    distributions.push({
      recipient: rule.recipient,
      role: rule.role,
      percentage: rule.percentage,
      amount: amount
    });
  }
  
  return distributions;
};

module.exports = mongoose.model('DispersalRule', dispersalRuleSchema);