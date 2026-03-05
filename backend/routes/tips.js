const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Tip = require('../models/Tip');
const DispersalRule = require('../models/DispersalRule');
const Booking = require('../models/Booking');
const User = require('../models/User');
const { authorizeRole } = require('../middleware/auth');

const router = express.Router();

// @desc    Get tips for current user or all (admin)
// @route   GET /api/tips
// @access  Private
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending', 'completed', 'distributed']),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { page = 1, limit = 20, status, startDate, endDate } = req.query;
    const filter = {};

    // Role-based filtering
    if (!['admin', 'owner', 'manager'].includes(req.user.role)) {
      filter.$or = [{ recipient: req.user._id }, { 'distribution.staff': req.user._id }];
    }

    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const skip = (page - 1) * limit;

    const [tips, total] = await Promise.all([
      Tip.find(filter)
        .populate('recipient', 'firstName lastName')
        .populate('booking', 'appointmentDate services')
        .populate('customer', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Tip.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        tips,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Add a tip
// @route   POST /api/tips
// @access  Private
router.post('/', [
  body('booking').isMongoId().withMessage('Valid booking ID required'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Tip amount must be positive'),
  body('paymentMethod').optional().isIn(['cash', 'card', 'digital']),
  body('note').optional().trim().isLength({ max: 200 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { booking: bookingId, amount, paymentMethod = 'card', note } = req.body;

    const booking = await Booking.findById(bookingId).populate('staff', 'firstName lastName');
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // Only the customer or admin can add a tip
    const canTip = ['admin', 'owner', 'manager'].includes(req.user.role) ||
                   booking.customer.toString() === req.user._id.toString();
    if (!canTip) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Apply processing fee for card tips
    const processingFeeRate = paymentMethod === 'card' ? 0.029 : 0;
    const processingFee = Math.round(amount * processingFeeRate * 100) / 100;
    const netAmount = Math.round((amount - processingFee) * 100) / 100;

    // Check for dispersal rules
    const dispersalRule = await DispersalRule.findOne({ isActive: true }).sort({ priority: -1 });
    let distribution = [{ staff: booking.staff._id || booking.staff, percentage: 100, amount: netAmount }];

    if (dispersalRule && dispersalRule.rules) {
      distribution = dispersalRule.rules.map(rule => ({
        role: rule.role,
        percentage: rule.percentage,
        amount: Math.round(netAmount * (rule.percentage / 100) * 100) / 100
      }));
    }

    const tip = new Tip({
      booking: bookingId,
      customer: booking.customer,
      recipient: booking.staff._id || booking.staff,
      amount,
      processingFee,
      netAmount,
      paymentMethod,
      note,
      distribution,
      status: 'completed'
    });

    await tip.save();
    await tip.populate('recipient', 'firstName lastName');

    // Emit real-time notification
    if (req.io) {
      req.io.to(`staff_${booking.staff._id || booking.staff}`).emit('new-tip', {
        amount,
        bookingId,
        from: req.user.firstName
      });
    }

    res.status(201).json({ success: true, message: 'Tip added successfully', data: { tip } });
  } catch (error) {
    next(error);
  }
});

// @desc    Get tip summary for a staff member
// @route   GET /api/tips/summary/:staffId
// @access  Private (Admin/Owner/Manager or self)
router.get('/summary/:staffId', [
  param('staffId').isMongoId(),
  query('period').optional().isIn(['7d', '30d', '90d', '365d', 'all'])
], async (req, res, next) => {
  try {
    const { staffId } = req.params;

    // Authorization
    const canAccess = ['admin', 'owner', 'manager'].includes(req.user.role) ||
                     staffId === req.user._id.toString();
    if (!canAccess) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { period = '30d' } = req.query;
    const periodMap = { '7d': 7, '30d': 30, '90d': 90, '365d': 365, 'all': 99999 };
    const days = periodMap[period];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const summary = await Tip.aggregate([
      { $match: { recipient: require('mongoose').Types.ObjectId(staffId), createdAt: { $gte: startDate }, status: 'completed' } },
      { $group: {
        _id: null,
        totalAmount: { $sum: '$amount' },
        totalNet: { $sum: '$netAmount' },
        totalFees: { $sum: '$processingFee' },
        count: { $sum: 1 },
        avgTip: { $avg: '$amount' },
        maxTip: { $max: '$amount' },
        minTip: { $min: '$amount' }
      }}
    ]);

    const byMethod = await Tip.aggregate([
      { $match: { recipient: require('mongoose').Types.ObjectId(staffId), createdAt: { $gte: startDate }, status: 'completed' } },
      { $group: { _id: '$paymentMethod', total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        summary: summary[0] || { totalAmount: 0, totalNet: 0, totalFees: 0, count: 0, avgTip: 0, maxTip: 0, minTip: 0 },
        byPaymentMethod: byMethod.reduce((acc, { _id, total, count }) => ({ ...acc, [_id]: { total, count } }), {}),
        period
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get/manage dispersal rules
// @route   GET /api/tips/dispersal-rules
// @access  Private (Admin/Owner)
router.get('/dispersal-rules', authorizeRole(['admin', 'owner']), async (req, res, next) => {
  try {
    const rules = await DispersalRule.find().sort({ priority: -1 });
    res.json({ success: true, data: { rules } });
  } catch (error) {
    next(error);
  }
});

// @desc    Create dispersal rule
// @route   POST /api/tips/dispersal-rules
// @access  Private (Admin/Owner)
router.post('/dispersal-rules', [
  authorizeRole(['admin', 'owner']),
  body('name').trim().isLength({ min: 1, max: 100 }),
  body('rules').isArray({ min: 1 }),
  body('rules.*.role').isIn(['primary', 'assistant', 'support', 'house']),
  body('rules.*.percentage').isFloat({ min: 0, max: 100 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    // Validate percentages sum to 100
    const totalPct = req.body.rules.reduce((sum, r) => sum + r.percentage, 0);
    if (Math.abs(totalPct - 100) > 0.01) {
      return res.status(400).json({ success: false, message: 'Rule percentages must sum to 100%' });
    }

    const rule = new DispersalRule(req.body);
    rule.createdBy = req.user._id;
    await rule.save();

    res.status(201).json({ success: true, message: 'Dispersal rule created', data: { rule } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
