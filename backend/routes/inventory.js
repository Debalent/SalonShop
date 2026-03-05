const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Inventory = require('../models/Inventory');
const { authorizeRole } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all inventory items
// @route   GET /api/inventory
// @access  Private (Admin/Owner/Manager/Staff)
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isString(),
  query('lowStock').optional().isBoolean(),
  query('search').optional().isString(),
  query('status').optional().isIn(['in-stock', 'low-stock', 'out-of-stock', 'expired', 'discontinued'])
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { page = 1, limit = 20, category, lowStock, search, status, sortBy = 'name', sortOrder = 'asc' } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (status) filter.status = status;
    if (lowStock === 'true') {
      filter.$expr = { $lte: ['$currentStock', '$reorderPoint'] };
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [items, total] = await Promise.all([
      Inventory.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
      Inventory.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        items,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get inventory item by ID
// @route   GET /api/inventory/:id
// @access  Private
router.get('/:id', [
  param('id').isMongoId()
], async (req, res, next) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }
    res.json({ success: true, data: { item } });
  } catch (error) {
    next(error);
  }
});

// @desc    Create inventory item
// @route   POST /api/inventory
// @access  Private (Admin/Owner/Manager)
router.post('/', [
  authorizeRole(['admin', 'owner', 'manager']),
  body('name').trim().isLength({ min: 1, max: 200 }).withMessage('Name required'),
  body('sku').trim().isLength({ min: 1, max: 50 }).withMessage('SKU required'),
  body('category').trim().isLength({ min: 1 }).withMessage('Category required'),
  body('currentStock').isInt({ min: 0 }).withMessage('Current stock must be non-negative'),
  body('unit').trim().isLength({ min: 1 }).withMessage('Unit required'),
  body('costPrice').isFloat({ min: 0 }).withMessage('Cost price must be non-negative'),
  body('reorderPoint').optional().isInt({ min: 0 }),
  body('reorderQuantity').optional().isInt({ min: 1 }),
  body('supplier').optional().isObject(),
  body('expiryDate').optional().isISO8601()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    // Check for duplicate SKU
    const existing = await Inventory.findOne({ sku: req.body.sku });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Item with this SKU already exists' });
    }

    const item = new Inventory({
      ...req.body,
      createdBy: req.user._id,
      auditTrail: [{
        action: 'created',
        performedBy: req.user._id,
        timestamp: new Date(),
        details: { initialStock: req.body.currentStock }
      }]
    });

    // Set status based on stock level
    if (item.currentStock === 0) item.status = 'out-of-stock';
    else if (item.currentStock <= (item.reorderPoint || 0)) item.status = 'low-stock';
    else item.status = 'in-stock';

    await item.save();
    res.status(201).json({ success: true, message: 'Inventory item created', data: { item } });
  } catch (error) {
    next(error);
  }
});

// @desc    Update inventory item
// @route   PUT /api/inventory/:id
// @access  Private (Admin/Owner/Manager)
router.put('/:id', [
  authorizeRole(['admin', 'owner', 'manager']),
  param('id').isMongoId(),
  body('name').optional().trim().isLength({ min: 1, max: 200 }),
  body('category').optional().isString(),
  body('costPrice').optional().isFloat({ min: 0 }),
  body('retailPrice').optional().isFloat({ min: 0 }),
  body('reorderPoint').optional().isInt({ min: 0 }),
  body('isActive').optional().isBoolean()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    const allowedUpdates = ['name', 'category', 'brand', 'costPrice', 'retailPrice', 'reorderPoint', 'reorderQuantity', 'supplier', 'expiryDate', 'isActive', 'notes', 'location'];
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        item[key] = req.body[key];
      }
    });

    // Add audit trail entry
    item.auditTrail = item.auditTrail || [];
    item.auditTrail.push({
      action: 'updated',
      performedBy: req.user._id,
      timestamp: new Date(),
      details: req.body
    });

    await item.save();
    res.json({ success: true, message: 'Inventory item updated', data: { item } });
  } catch (error) {
    next(error);
  }
});

// @desc    Adjust stock levels
// @route   POST /api/inventory/:id/adjust-stock
// @access  Private (Admin/Owner/Manager/Staff)
router.post('/:id/adjust-stock', [
  param('id').isMongoId(),
  body('adjustment').isInt().withMessage('Adjustment quantity required (positive or negative)'),
  body('reason').trim().isLength({ min: 1, max: 200 }).withMessage('Reason required'),
  body('type').isIn(['restock', 'usage', 'damage', 'return', 'correction', 'sale']).withMessage('Valid adjustment type required')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    const { adjustment, reason, type } = req.body;
    const newStock = item.currentStock + adjustment;

    if (newStock < 0) {
      return res.status(400).json({ success: false, message: 'Insufficient stock for this adjustment' });
    }

    const previousStock = item.currentStock;
    item.currentStock = newStock;

    // Update status
    if (newStock === 0) item.status = 'out-of-stock';
    else if (newStock <= (item.reorderPoint || 0)) item.status = 'low-stock';
    else item.status = 'in-stock';

    // Audit trail
    item.auditTrail = item.auditTrail || [];
    item.auditTrail.push({
      action: 'stock_adjusted',
      performedBy: req.user._id,
      timestamp: new Date(),
      details: { type, adjustment, previousStock, newStock, reason }
    });

    await item.save();

    // Alert if low stock
    if (item.status === 'low-stock' && req.io) {
      req.io.to('admin').emit('low-stock-alert', {
        item: item.name,
        currentStock: item.currentStock,
        reorderPoint: item.reorderPoint
      });
    }

    res.json({ success: true, message: 'Stock adjusted successfully', data: { item } });
  } catch (error) {
    next(error);
  }
});

// @desc    Get low stock alerts
// @route   GET /api/inventory/alerts/low-stock
// @access  Private (Admin/Owner/Manager)
router.get('/alerts/low-stock', authorizeRole(['admin', 'owner', 'manager']), async (req, res, next) => {
  try {
    const lowStockItems = await Inventory.find({
      $expr: { $lte: ['$currentStock', '$reorderPoint'] },
      isActive: { $ne: false }
    }).sort({ currentStock: 1 });

    const outOfStock = lowStockItems.filter(i => i.currentStock === 0);
    const needsReorder = lowStockItems.filter(i => i.currentStock > 0);

    res.json({
      success: true,
      data: {
        outOfStock,
        needsReorder,
        totalAlerts: lowStockItems.length
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get inventory summary/stats
// @route   GET /api/inventory/stats/overview
// @access  Private (Admin/Owner/Manager)
router.get('/stats/overview', authorizeRole(['admin', 'owner', 'manager']), async (req, res, next) => {
  try {
    const [totalItems, statusCounts, categoryBreakdown, totalValue] = await Promise.all([
      Inventory.countDocuments({ isActive: { $ne: false } }),
      Inventory.aggregate([
        { $match: { isActive: { $ne: false } } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Inventory.aggregate([
        { $match: { isActive: { $ne: false } } },
        { $group: { _id: '$category', count: { $sum: 1 }, totalStock: { $sum: '$currentStock' } } },
        { $sort: { count: -1 } }
      ]),
      Inventory.aggregate([
        { $match: { isActive: { $ne: false } } },
        { $group: { _id: null, totalCostValue: { $sum: { $multiply: ['$currentStock', '$costPrice'] } }, totalRetailValue: { $sum: { $multiply: ['$currentStock', { $ifNull: ['$retailPrice', '$costPrice'] }] } } } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        totalItems,
        statusBreakdown: statusCounts.reduce((acc, { _id, count }) => ({ ...acc, [_id]: count }), {}),
        categoryBreakdown,
        valuation: totalValue[0] || { totalCostValue: 0, totalRetailValue: 0 }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete inventory item (soft delete)
// @route   DELETE /api/inventory/:id
// @access  Private (Admin/Owner)
router.delete('/:id', [
  authorizeRole(['admin', 'owner']),
  param('id').isMongoId()
], async (req, res, next) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Inventory item not found' });
    }

    item.isActive = false;
    item.status = 'discontinued';
    item.auditTrail = item.auditTrail || [];
    item.auditTrail.push({
      action: 'discontinued',
      performedBy: req.user._id,
      timestamp: new Date()
    });

    await item.save();
    res.json({ success: true, message: 'Inventory item discontinued' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
