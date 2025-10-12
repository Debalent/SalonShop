const mongoose = require('mongoose');

const serviceTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    maxlength: [100, 'Service name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Service category is required'],
    enum: ['nails', 'hair', 'massage', 'facial', 'waxing', 'tattoo', 'piercing', 'dispensary', 'other']
  },
  description: {
    type: String,
    required: [true, 'Service description is required'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  duration: {
    type: Number, // in minutes
    required: [true, 'Service duration is required'],
    min: [15, 'Duration must be at least 15 minutes'],
    max: [480, 'Duration cannot exceed 8 hours']
  },
  basePrice: {
    type: Number,
    required: [true, 'Base price is required'],
    min: [0, 'Price cannot be negative']
  },
  images: [{
    public_id: String,
    url: String,
    alt: String
  }],
  requirements: [{
    type: String,
    trim: true
  }],
  aftercareInstructions: [{
    type: String,
    trim: true
  }],
  customizations: [{
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['select', 'multi-select', 'text', 'number', 'color'],
      required: true
    },
    options: [{
      label: String,
      value: String,
      additionalCost: { type: Number, default: 0 }
    }],
    required: { type: Boolean, default: false },
    description: String
  }],
  staffSpecialties: [{
    type: String,
    trim: true
  }], // Which staff specialties can perform this service
  isActive: {
    type: Boolean,
    default: true
  },
  isPopular: {
    type: Boolean,
    default: false
  },
  popularityScore: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  seasonalPricing: [{
    startDate: Date,
    endDate: Date,
    adjustedPrice: Number,
    description: String
  }],
  groupDiscounts: [{
    minimumPeople: Number,
    discountPercentage: Number,
    description: String
  }],
  metadata: {
    allergyWarnings: [String],
    ageRestrictions: {
      minimum: Number,
      maximum: Number
    },
    equipmentNeeded: [String],
    preparationTime: Number, // in minutes
    cleanupTime: Number // in minutes
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes
serviceTypeSchema.index({ category: 1, isActive: 1 });
serviceTypeSchema.index({ isPopular: 1, popularityScore: -1 });
serviceTypeSchema.index({ averageRating: -1 });
serviceTypeSchema.index({ tags: 1 });
serviceTypeSchema.index({ name: 'text', description: 'text', tags: 'text' });

// Pre-save middleware to update timestamps
serviceTypeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for price range (considering customizations)
serviceTypeSchema.virtual('priceRange').get(function() {
  let minPrice = this.basePrice;
  let maxPrice = this.basePrice;
  
  this.customizations.forEach(customization => {
    if (customization.options && customization.options.length > 0) {
      const costs = customization.options.map(option => option.additionalCost || 0);
      maxPrice += Math.max(...costs);
    }
  });
  
  if (minPrice === maxPrice) {
    return `$${minPrice}`;
  } else {
    return `$${minPrice} - $${maxPrice}`;
  }
});

// Method to calculate final price with customizations
serviceTypeSchema.methods.calculatePrice = function(selectedCustomizations = []) {
  let totalPrice = this.basePrice;
  
  selectedCustomizations.forEach(selected => {
    const customization = this.customizations.find(c => c.name === selected.name);
    if (customization) {
      const option = customization.options.find(o => o.value === selected.value);
      if (option && option.additionalCost) {
        totalPrice += option.additionalCost;
      }
    }
  });
  
  return totalPrice;
};

// Static method to get popular services
serviceTypeSchema.statics.getPopularServices = function(limit = 10) {
  return this.find({ isActive: true, isPopular: true })
    .sort({ popularityScore: -1, averageRating: -1 })
    .limit(limit);
};

// Static method to search services
serviceTypeSchema.statics.searchServices = function(query, category = null, limit = 20) {
  const searchQuery = {
    isActive: true,
    $text: { $search: query }
  };
  
  if (category) {
    searchQuery.category = category;
  }
  
  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit);
};

// Method to update popularity score
serviceTypeSchema.methods.updatePopularityScore = async function() {
  // Calculate popularity based on bookings, ratings, etc.
  // This would typically be called by a background job
  const Booking = mongoose.model('Booking');
  
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentBookings = await Booking.countDocuments({
    'services.serviceType': this._id,
    createdAt: { $gte: thirtyDaysAgo },
    status: { $in: ['completed', 'confirmed'] }
  });
  
  // Simple popularity calculation (can be made more sophisticated)
  this.popularityScore = (recentBookings * 0.7) + (this.averageRating * 20) + (this.totalReviews * 0.1);
  this.isPopular = this.popularityScore > 50;
  
  await this.save();
};

// Ensure virtual fields are serialized
serviceTypeSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('ServiceType', serviceTypeSchema);