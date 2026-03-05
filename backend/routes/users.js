const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const User = require('../models/User');
const { authorizeRole, authorizeOwnershipOrAdmin } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private (Admin/Owner/Manager)
router.get('/', [
  authorizeRole(['admin', 'owner', 'manager']),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('role').optional().isIn(['customer', 'staff', 'technician', 'stylist', 'budtender', 'manager', 'admin', 'owner']),
  query('isActive').optional().isBoolean(),
  query('search').optional().isString()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { page = 1, limit = 20, role, isActive, search, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (page - 1) * limit;
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    const [users, total] = await Promise.all([
      User.find(filter).sort(sort).skip(skip).limit(parseInt(limit)),
      User.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
router.get('/:id', [
  param('id').isMongoId().withMessage('Valid user ID is required'),
  authorizeOwnershipOrAdmin()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const user = await User.findById(req.params.id)
      .populate('customerInfo.favoriteServices')
      .populate('customerInfo.preferredStaff', 'firstName lastName avatar staffInfo.specialty');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
});

// @desc    Update user profile
// @route   PUT /api/users/:id
// @access  Private
router.put('/:id', [
  param('id').isMongoId().withMessage('Valid user ID is required'),
  authorizeOwnershipOrAdmin(),
  body('firstName').optional().trim().isLength({ min: 2, max: 50 }),
  body('lastName').optional().trim().isLength({ min: 2, max: 50 }),
  body('phone').optional().matches(/^\+?[\d\s-()]+$/),
  body('email').optional().isEmail().normalizeEmail(),
  body('avatar').optional().isURL()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Only admins can update role
    const allowedUpdates = ['firstName', 'lastName', 'phone', 'email', 'avatar', 'preferences'];
    if (['admin', 'owner'].includes(req.user.role)) {
      allowedUpdates.push('role', 'isActive', 'staffInfo');
    }

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        user[key] = req.body[key];
      }
    });

    await user.save();
    res.json({ success: true, message: 'User updated successfully', data: { user } });
  } catch (error) {
    next(error);
  }
});

// @desc    Change password
// @route   PUT /api/users/:id/password
// @access  Private
router.put('/:id/password', [
  param('id').isMongoId(),
  authorizeOwnershipOrAdmin(),
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const user = await User.findById(req.params.id).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isValid = await user.comparePassword(req.body.currentPassword);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = req.body.newPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
});

// @desc    Deactivate user (soft delete)
// @route   DELETE /api/users/:id
// @access  Private (Admin/Owner)
router.delete('/:id', [
  param('id').isMongoId(),
  authorizeRole(['admin', 'owner'])
], async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deactivation of last admin
    if (user.role === 'admin') {
      const adminCount = await User.countDocuments({ role: 'admin', isActive: true });
      if (adminCount <= 1) {
        return res.status(400).json({ success: false, message: 'Cannot deactivate the last admin user' });
      }
    }

    user.isActive = false;
    await user.save();
    res.json({ success: true, message: 'User deactivated successfully' });
  } catch (error) {
    next(error);
  }
});

// @desc    Get user statistics
// @route   GET /api/users/stats/overview
// @access  Private (Admin/Owner/Manager)
router.get('/stats/overview', authorizeRole(['admin', 'owner', 'manager']), async (req, res, next) => {
  try {
    const [totalUsers, activeUsers, roleCounts, recentUsers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]),
      User.find().sort({ createdAt: -1 }).limit(5).select('firstName lastName email role createdAt')
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        roleCounts: roleCounts.reduce((acc, { _id, count }) => ({ ...acc, [_id]: count }), {}),
        recentUsers
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
