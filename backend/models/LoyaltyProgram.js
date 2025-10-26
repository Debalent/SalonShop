const mongoose = require('mongoose');

const loyaltyProgramSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  isActive: {
    type: Boolean,
    default: true
  },
  // Points system configuration
  pointsConfig: {
    pointsPerDollar: {
      type: Number,
      default: 1,
      min: 0
    },
    pointsForReferral: {
      type: Number,
      default: 100
    },
    pointsForReview: {
      type: Number,
      default: 25
    },
    bonusMultiplierEvents: [{
      event: {
        type: String,
        enum: ['birthday', 'anniversary', 'first_visit', 'vip_member']
      },
      multiplier: {
        type: Number,
        default: 2,
        min: 1
      },
      description: String
    }]
  },
  // Reward tiers
  tiers: [{
    name: String,
    minPoints: {
      type: Number,
      required: true,
      min: 0
    },
    benefits: {
      discountPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
      },
      freeServiceThreshold: Number, // Points needed for free service
      priorityBooking: {
        type: Boolean,
        default: false
      },
      exclusiveOffers: {
        type: Boolean,
        default: false
      },
      dedicatedStylist: {
        type: Boolean,
        default: false
      }
    },
    color: String, // For UI theming
    icon: String
  }],
  // Redemption rules
  redemptionRules: {
    minPointsPerRedemption: {
      type: Number,
      default: 50
    },
    maxPointsPerRedemption: Number,
    redemptionOptions: [{
      name: String,
      pointsRequired: Number,
      value: Number, // Dollar value
      description: String,
      isActive: {
        type: Boolean,
        default: true
      },
      usageLimit: Number, // Per customer per period
      period: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly']
      }
    }]
  },
  // Expiration policy
  expirationPolicy: {
    pointsExpire: {
      type: Boolean,
      default: true
    },
    expirationMonths: {
      type: Number,
      default: 12
    },
    expirationReminderDays: {
      type: Number,
      default: 30
    }
  },
  // Special campaigns
  campaigns: [{
    name: String,
    description: String,
    startDate: Date,
    endDate: Date,
    bonusPoints: Number,
    targetServices: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ServiceType' }],
    targetCustomers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isActive: {
      type: Boolean,
      default: true
    }
  }],
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
loyaltyProgramSchema.index({ isActive: 1 });
loyaltyProgramSchema.index({ 'tiers.minPoints': 1 });

// Pre-save middleware
loyaltyProgramSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance methods
loyaltyProgramSchema.methods.getTierForPoints = function(points) {
  const applicableTiers = this.tiers.filter(tier => points >= tier.minPoints);
  return applicableTiers.sort((a, b) => b.minPoints - a.minPoints)[0] || null;
};

loyaltyProgramSchema.methods.calculatePointsEarned = function(amount, customerTier = null, specialEvent = null) {
  let basePoints = Math.floor(amount * this.pointsConfig.pointsPerDollar);
  let multiplier = customerTier?.benefits?.bonusMultiplier || 1;

  // Apply special event multiplier
  if (specialEvent) {
    const eventConfig = this.pointsConfig.bonusMultiplierEvents.find(
      event => event.event === specialEvent
    );
    if (eventConfig) {
      multiplier *= eventConfig.multiplier;
    }
  }

  return Math.floor(basePoints * multiplier);
};

loyaltyProgramSchema.methods.canRedeemPoints = function(points, requestedPoints) {
  return requestedPoints >= this.redemptionRules.minPointsPerRedemption &&
         (!this.redemptionRules.maxPointsPerRedemption ||
          requestedPoints <= this.redemptionRules.maxPointsPerRedemption);
};

module.exports = mongoose.model('LoyaltyProgram', loyaltyProgramSchema);