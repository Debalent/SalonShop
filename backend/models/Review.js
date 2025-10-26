const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  staff: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ServiceType'
  },
  // Overall rating
  overallRating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  // Detailed ratings
  ratings: {
    serviceQuality: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    staffProfessionalism: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    valueForMoney: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },
    ambiance: {
      type: Number,
      min: 1,
      max: 5
    },
    waitingTime: {
      type: Number,
      min: 1,
      max: 5
    }
  },
  // Review content
  title: {
    type: String,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    maxlength: [1000, 'Comment cannot exceed 1000 characters']
  },
  pros: [String], // Positive aspects
  cons: [String], // Areas for improvement
  // Media attachments
  photos: [{
    url: String,
    caption: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  // Recommendation
  wouldRecommend: {
    type: Boolean,
    required: true
  },
  // Verification status
  isVerified: {
    type: Boolean,
    default: false // Verified if customer completed the service
  },
  // Moderation
  isApproved: {
    type: Boolean,
    default: true // Auto-approved, can be moderated later
  },
  moderationReason: String,
  moderatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  moderatedAt: Date,
  // Engagement metrics
  helpful: {
    count: {
      type: Number,
      default: 0
    },
    users: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  // Response from staff/business
  response: {
    text: String,
    respondedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    respondedAt: Date,
    isPublic: {
      type: Boolean,
      default: true
    }
  },
  // Metadata
  source: {
    type: String,
    enum: ['mobile_app', 'web_app', 'third_party', 'manual'],
    default: 'mobile_app'
  },
  deviceInfo: String,
  ipAddress: String,
  // Timestamps
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
reviewSchema.index({ customer: 1, createdAt: -1 });
reviewSchema.index({ staff: 1, createdAt: -1 });
reviewSchema.index({ service: 1, createdAt: -1 });
reviewSchema.index({ overallRating: -1 });
reviewSchema.index({ isApproved: 1, createdAt: -1 });
reviewSchema.index({ 'helpful.count': -1 });

// Pre-save middleware
reviewSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for average rating
reviewSchema.virtual('averageRating').get(function() {
  const ratings = Object.values(this.ratings).filter(rating => rating != null);
  if (ratings.length === 0) return 0;
  return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
});

// Instance methods
reviewSchema.methods.markHelpful = function(userId) {
  if (!this.helpful.users.includes(userId)) {
    this.helpful.users.push(userId);
    this.helpful.count = this.helpful.users.length;
    return this.save();
  }
  return Promise.resolve(this);
};

reviewSchema.methods.addResponse = function(responseText, staffId) {
  this.response = {
    text: responseText,
    respondedBy: staffId,
    respondedAt: new Date(),
    isPublic: true
  };
  return this.save();
};

// Static methods
reviewSchema.statics.getAverageRatingForStaff = async function(staffId, timeframe = null) {
  const matchConditions = { staff: staffId, isApproved: true };

  if (timeframe) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - timeframe);
    matchConditions.createdAt = { $gte: startDate };
  }

  const result = await this.aggregate([
    { $match: matchConditions },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$overallRating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$overallRating'
        }
      }
    }
  ]);

  if (result.length === 0) {
    return { averageRating: 0, totalReviews: 0, ratingDistribution: {} };
  }

  const distribution = result[0].ratingDistribution.reduce((acc, rating) => {
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, {});

  return {
    averageRating: Math.round(result[0].averageRating * 10) / 10,
    totalReviews: result[0].totalReviews,
    ratingDistribution: distribution
  };
};

reviewSchema.statics.getAverageRatingForService = async function(serviceId) {
  const result = await this.aggregate([
    {
      $match: {
        service: serviceId,
        isApproved: true
      }
    },
    {
      $group: {
        _id: null,
        averageRating: { $avg: '$overallRating' },
        totalReviews: { $sum: 1 }
      }
    }
  ]);

  return result.length > 0 ? {
    averageRating: Math.round(result[0].averageRating * 10) / 10,
    totalReviews: result[0].totalReviews
  } : { averageRating: 0, totalReviews: 0 };
};

// Ensure virtual fields are serialized
reviewSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Review', reviewSchema);