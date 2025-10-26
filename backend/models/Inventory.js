const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: String,
  category: {
    type: String,
    required: true,
    enum: ['hair_products', 'nail_products', 'skin_care', 'tools', 'equipment', 'consumables', 'retail']
  },
  subCategory: String, // e.g., 'shampoo', 'conditioner', 'hair_color', etc.
  brand: String,
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  barcode: String,

  // Stock management
  currentStock: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  minimumStock: {
    type: Number,
    min: 0,
    default: 0
  },
  maximumStock: {
    type: Number,
    min: 0
  },
  reorderPoint: {
    type: Number,
    min: 0,
    default: 0
  },

  // Pricing
  costPrice: {
    type: Number,
    required: true,
    min: 0
  },
  sellingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  wholesalePrice: Number,
  discountPrice: Number,
  discountExpiry: Date,

  // Supplier information
  supplier: {
    name: String,
    contact: String,
    email: String,
    address: String
  },

  // Usage tracking
  usedInServices: [{
    serviceType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ServiceType'
    },
    quantityPerService: {
      type: Number,
      min: 0
    },
    isOptional: {
      type: Boolean,
      default: false
    }
  }],

  // Location and storage
  location: {
    warehouse: String,
    shelf: String,
    bin: String
  },

  // Quality and expiry
  expiryDate: Date,
  batchNumber: String,
  manufacturingDate: Date,
  qualityStatus: {
    type: String,
    enum: ['good', 'damaged', 'expired', 'quarantine'],
    default: 'good'
  },

  // Images and media
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],

  // Status and visibility
  isActive: {
    type: Boolean,
    default: true
  },
  isVisibleToCustomers: {
    type: Boolean,
    default: false
  },

  // Tracking
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  lastUpdatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Audit trail
  stockHistory: [{
    action: {
      type: String,
      enum: ['added', 'removed', 'adjusted', 'sold', 'used_in_service']
    },
    quantity: Number,
    previousStock: Number,
    newStock: Number,
    reason: String,
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    relatedBooking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking'
    },
    date: {
      type: Date,
      default: Date.now
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
inventoryItemSchema.index({ name: 'text', description: 'text' });
inventoryItemSchema.index({ category: 1, subCategory: 1 });
inventoryItemSchema.index({ sku: 1 });
inventoryItemSchema.index({ currentStock: 1 });
inventoryItemSchema.index({ expiryDate: 1 });
inventoryItemSchema.index({ isActive: 1 });

// Pre-save middleware
inventoryItemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for stock status
inventoryItemSchema.virtual('stockStatus').get(function() {
  if (this.currentStock <= 0) return 'out_of_stock';
  if (this.currentStock <= this.reorderPoint) return 'low_stock';
  if (this.currentStock >= this.maximumStock) return 'overstock';
  return 'in_stock';
});

// Virtual for profit margin
inventoryItemSchema.virtual('profitMargin').get(function() {
  if (!this.costPrice || !this.sellingPrice) return 0;
  return ((this.sellingPrice - this.costPrice) / this.costPrice) * 100;
});

// Instance methods
inventoryItemSchema.methods.updateStock = function(quantity, action, performedBy, reason = '', relatedBooking = null) {
  const previousStock = this.currentStock;
  this.currentStock += quantity;

  // Ensure stock doesn't go below 0
  if (this.currentStock < 0) {
    this.currentStock = 0;
  }

  // Add to stock history
  this.stockHistory.push({
    action,
    quantity,
    previousStock,
    newStock: this.currentStock,
    reason,
    performedBy,
    relatedBooking,
    date: new Date()
  });

  return this.save();
};

inventoryItemSchema.methods.isLowStock = function() {
  return this.currentStock <= this.reorderPoint;
};

inventoryItemSchema.methods.isExpired = function() {
  return this.expiryDate && new Date() > this.expiryDate;
};

inventoryItemSchema.methods.getStockAlerts = function() {
  const alerts = [];

  if (this.isLowStock()) {
    alerts.push({
      type: 'low_stock',
      message: `Low stock alert: ${this.name} has ${this.currentStock} units remaining (reorder point: ${this.reorderPoint})`
    });
  }

  if (this.isExpired()) {
    alerts.push({
      type: 'expired',
      message: `Expired product: ${this.name} expired on ${this.expiryDate.toDateString()}`
    });
  }

  if (this.qualityStatus !== 'good') {
    alerts.push({
      type: 'quality_issue',
      message: `Quality issue: ${this.name} is marked as ${this.qualityStatus}`
    });
  }

  return alerts;
};

// Static methods
inventoryItemSchema.statics.getLowStockItems = function() {
  return this.find({
    $expr: { $lte: ['$currentStock', '$reorderPoint'] },
    isActive: true
  });
};

inventoryItemSchema.statics.getExpiredItems = function() {
  return this.find({
    expiryDate: { $lt: new Date() },
    isActive: true
  });
};

inventoryItemSchema.statics.getItemsByCategory = function(category) {
  return this.find({
    category,
    isActive: true
  }).sort({ name: 1 });
};

inventoryItemSchema.statics.getStockAlerts = async function() {
  const [lowStockItems, expiredItems] = await Promise.all([
    this.getLowStockItems(),
    this.getExpiredItems()
  ]);

  const alerts = [];

  lowStockItems.forEach(item => {
    alerts.push(...item.getStockAlerts());
  });

  expiredItems.forEach(item => {
    alerts.push(...item.getStockAlerts());
  });

  return alerts;
};

// Ensure virtual fields are serialized
inventoryItemSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Inventory', inventoryItemSchema);