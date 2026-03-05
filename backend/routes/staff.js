const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const User = require('../models/User');
const Booking = require('../models/Booking');
const { authorizeRole } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all staff members
// @route   GET /api/staff
// @access  Private
router.get('/', [
  query('specialty').optional().isString(),
  query('isActive').optional().isBoolean(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('search').optional().isString()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { specialty, isActive, page = 1, limit = 20, search, sortBy = 'firstName', sortOrder = 'asc' } = req.query;
    const filter = {
      role: { $in: ['staff', 'technician', 'stylist', 'budtender', 'manager'] }
    };

    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (specialty) filter['staffInfo.specialty'] = { $in: [specialty] };
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [staff, total] = await Promise.all([
      User.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
      User.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        staff,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get staff member by ID
// @route   GET /api/staff/:id
// @access  Private
router.get('/:id', [
  param('id').isMongoId()
], async (req, res, next) => {
  try {
    const staff = await User.findOne({
      _id: req.params.id,
      role: { $in: ['staff', 'technician', 'stylist', 'budtender', 'manager'] }
    });

    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    // Get staff performance stats
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const [bookingStats, recentBookings] = await Promise.all([
      Booking.aggregate([
        { $match: { staff: staff._id, appointmentDate: { $gte: thirtyDaysAgo }, status: 'completed' } },
        { $group: { _id: null, totalRevenue: { $sum: '$finalAmount' }, totalBookings: { $sum: 1 }, avgRating: { $avg: '$feedback.rating' } } }
      ]),
      Booking.find({ staff: staff._id, status: { $in: ['confirmed', 'pending'] } })
        .populate('customer', 'firstName lastName')
        .populate('services.serviceType', 'name')
        .sort({ appointmentDate: 1 })
        .limit(10)
    ]);

    const stats = bookingStats[0] || { totalRevenue: 0, totalBookings: 0, avgRating: 0 };

    res.json({
      success: true,
      data: {
        staff,
        performance: {
          monthlyRevenue: stats.totalRevenue,
          monthlyBookings: stats.totalBookings,
          averageRating: stats.avgRating ? Math.round(stats.avgRating * 10) / 10 : null,
          upcomingBookings: recentBookings
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Create staff member
// @route   POST /api/staff
// @access  Private (Admin/Owner/Manager)
router.post('/', [
  authorizeRole(['admin', 'owner', 'manager']),
  body('firstName').trim().isLength({ min: 2, max: 50 }).withMessage('First name required'),
  body('lastName').trim().isLength({ min: 2, max: 50 }).withMessage('Last name required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('phone').matches(/^\+?[\d\s-()]+$/).withMessage('Valid phone required'),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['staff', 'technician', 'stylist', 'budtender', 'manager']).withMessage('Valid staff role required'),
  body('staffInfo.specialty').optional().isArray(),
  body('staffInfo.hourlyRate').optional().isFloat({ min: 0 }),
  body('staffInfo.commissionRate').optional().isFloat({ min: 0, max: 100 })
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const existingUser = await User.findOne({ $or: [{ email: req.body.email }, { phone: req.body.phone }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User with this email or phone already exists' });
    }

    const staff = new User(req.body);
    await staff.save();
    const staffResponse = staff.toJSON();

    res.status(201).json({ success: true, message: 'Staff member created successfully', data: { staff: staffResponse } });
  } catch (error) {
    next(error);
  }
});

// @desc    Update staff member
// @route   PUT /api/staff/:id
// @access  Private (Admin/Owner/Manager)
router.put('/:id', [
  authorizeRole(['admin', 'owner', 'manager']),
  param('id').isMongoId(),
  body('firstName').optional().trim().isLength({ min: 2, max: 50 }),
  body('lastName').optional().trim().isLength({ min: 2, max: 50 }),
  body('email').optional().isEmail().normalizeEmail(),
  body('phone').optional().matches(/^\+?[\d\s-()]+$/),
  body('role').optional().isIn(['staff', 'technician', 'stylist', 'budtender', 'manager']),
  body('isActive').optional().isBoolean()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const staff = await User.findOne({
      _id: req.params.id,
      role: { $in: ['staff', 'technician', 'stylist', 'budtender', 'manager'] }
    });

    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    const allowedUpdates = ['firstName', 'lastName', 'email', 'phone', 'role', 'isActive', 'avatar', 'staffInfo'];
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        staff[key] = req.body[key];
      }
    });

    await staff.save();
    res.json({ success: true, message: 'Staff member updated successfully', data: { staff } });
  } catch (error) {
    next(error);
  }
});

// @desc    Update staff schedule
// @route   PUT /api/staff/:id/schedule
// @access  Private (Admin/Owner/Manager or self)
router.put('/:id/schedule', [
  param('id').isMongoId(),
  body('schedule').isObject().withMessage('Schedule object is required')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    // Allow self or admin
    const canUpdate = ['admin', 'owner', 'manager'].includes(req.user.role) ||
                     req.params.id === req.user._id.toString();
    if (!canUpdate) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const staff = await User.findOne({
      _id: req.params.id,
      role: { $in: ['staff', 'technician', 'stylist', 'budtender', 'manager'] }
    });

    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    staff.staffInfo = staff.staffInfo || {};
    staff.staffInfo.schedule = req.body.schedule;
    await staff.save();

    res.json({ success: true, message: 'Schedule updated successfully', data: { staff } });
  } catch (error) {
    next(error);
  }
});

// @desc    Deactivate staff member
// @route   DELETE /api/staff/:id
// @access  Private (Admin/Owner)
router.delete('/:id', [
  authorizeRole(['admin', 'owner']),
  param('id').isMongoId()
], async (req, res, next) => {
  try {
    const staff = await User.findOne({
      _id: req.params.id,
      role: { $in: ['staff', 'technician', 'stylist', 'budtender', 'manager'] }
    });

    if (!staff) {
      return res.status(404).json({ success: false, message: 'Staff member not found' });
    }

    // Cancel upcoming bookings
    await Booking.updateMany(
      { staff: staff._id, status: { $in: ['pending', 'confirmed'] }, appointmentDate: { $gte: new Date() } },
      { $set: { status: 'cancelled', cancellationReason: 'Staff member deactivated' } }
    );

    staff.isActive = false;
    await staff.save();

    res.json({ success: true, message: 'Staff member deactivated successfully' });
  } catch (error) {
    next(error);
  }
});

// @desc    Get staff performance overview
// @route   GET /api/staff/performance/overview
// @access  Private (Admin/Owner/Manager)
router.get('/performance/overview', authorizeRole(['admin', 'owner', 'manager']), async (req, res, next) => {
  try {
    const { period = '30d' } = req.query;
    const periodMap = { '7d': 7, '30d': 30, '90d': 90, '365d': 365 };
    const days = periodMap[period] || 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const performance = await Booking.aggregate([
      { $match: { appointmentDate: { $gte: startDate }, status: 'completed' } },
      { $group: {
        _id: '$staff',
        totalRevenue: { $sum: '$finalAmount' },
        totalBookings: { $sum: 1 },
        avgRating: { $avg: '$feedback.rating' }
      }},
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'staffInfo' } },
      { $unwind: '$staffInfo' },
      { $project: {
        firstName: '$staffInfo.firstName',
        lastName: '$staffInfo.lastName',
        avatar: '$staffInfo.avatar',
        specialty: '$staffInfo.staffInfo.specialty',
        totalRevenue: 1,
        totalBookings: 1,
        avgRating: { $round: ['$avgRating', 1] }
      }},
      { $sort: { totalRevenue: -1 } }
    ]);

    res.json({ success: true, data: { performance, period } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
