const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Notification = require('../models/Notification');
const { authorizeRole } = require('../middleware/auth');

const router = express.Router();

// @desc    Get notifications for current user
// @route   GET /api/notifications
// @access  Private
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('isRead').optional().isBoolean(),
  query('type').optional().isString(),
  query('priority').optional().isIn(['low', 'medium', 'high', 'urgent'])
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { page = 1, limit = 20, isRead, type, priority } = req.query;
    const filter = { recipient: req.user._id };

    if (isRead !== undefined) filter.isRead = isRead === 'true';
    if (type) filter.type = type;
    if (priority) filter.priority = priority;

    // Exclude expired notifications
    filter.$or = [
      { expiresAt: { $exists: false } },
      { expiresAt: null },
      { expiresAt: { $gt: new Date() } }
    ];

    const skip = (page - 1) * limit;

    const [notifications, total, unreadCount] = await Promise.all([
      Notification.find(filter)
        .sort({ priority: -1, createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Notification.countDocuments(filter),
      Notification.countDocuments({ recipient: req.user._id, isRead: false })
    ]);

    res.json({
      success: true,
      data: {
        notifications,
        unreadCount,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
router.put('/:id/read', [
  param('id').isMongoId()
], async (req, res, next) => {
  try {
    const notification = await Notification.findOne({ _id: req.params.id, recipient: req.user._id });
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    next(error);
  }
});

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
router.put('/read-all', async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { $set: { isRead: true, readAt: new Date() } }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    next(error);
  }
});

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
router.delete('/:id', [
  param('id').isMongoId()
], async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndDelete({ _id: req.params.id, recipient: req.user._id });
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    next(error);
  }
});

// @desc    Send notification (admin)
// @route   POST /api/notifications
// @access  Private (Admin/Owner/Manager)
router.post('/', [
  authorizeRole(['admin', 'owner', 'manager']),
  body('recipient').optional().isMongoId(),
  body('recipients').optional().isArray(),
  body('title').trim().isLength({ min: 1, max: 200 }).withMessage('Title required'),
  body('message').trim().isLength({ min: 1, max: 1000 }).withMessage('Message required'),
  body('type').isIn(['booking', 'payment', 'reminder', 'promotion', 'system', 'alert', 'update']).withMessage('Valid type required'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']),
  body('channels').optional().isArray(),
  body('channels.*').optional().isIn(['push', 'email', 'sms', 'in-app']),
  body('scheduledFor').optional().isISO8601(),
  body('expiresAt').optional().isISO8601()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { recipient, recipients, title, message, type, priority = 'medium', channels = ['in-app'], scheduledFor, expiresAt, data } = req.body;

    // Determine target recipients
    const targetRecipients = recipients || (recipient ? [recipient] : []);
    if (targetRecipients.length === 0) {
      return res.status(400).json({ success: false, message: 'At least one recipient is required' });
    }

    const notifications = [];
    for (const recipientId of targetRecipients) {
      const notification = new Notification({
        recipient: recipientId,
        sender: req.user._id,
        title,
        message,
        type,
        priority,
        channels,
        scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        data
      });
      await notification.save();
      notifications.push(notification);

      // Send real-time notification via Socket.IO
      if (req.io && (!scheduledFor || new Date(scheduledFor) <= new Date())) {
        req.io.to(`user_${recipientId}`).emit('notification', {
          id: notification._id,
          title,
          message,
          type,
          priority
        });
      }
    }

    res.status(201).json({
      success: true,
      message: `${notifications.length} notification(s) sent`,
      data: { notifications }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Send broadcast notification (to all users or by role)
// @route   POST /api/notifications/broadcast
// @access  Private (Admin/Owner)
router.post('/broadcast', [
  authorizeRole(['admin', 'owner']),
  body('title').trim().isLength({ min: 1, max: 200 }),
  body('message').trim().isLength({ min: 1, max: 1000 }),
  body('type').isIn(['promotion', 'system', 'alert', 'update']),
  body('targetRoles').optional().isArray(),
  body('targetRoles.*').optional().isIn(['customer', 'staff', 'technician', 'stylist', 'budtender', 'manager', 'admin', 'owner'])
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { title, message, type, targetRoles, priority = 'medium', channels = ['in-app', 'push'] } = req.body;
    const userFilter = { isActive: true };
    if (targetRoles && targetRoles.length > 0) {
      userFilter.role = { $in: targetRoles };
    }

    const users = await require('../models/User').find(userFilter).select('_id');
    const notifications = [];

    for (const user of users) {
      const notification = new Notification({
        recipient: user._id,
        sender: req.user._id,
        title,
        message,
        type,
        priority,
        channels,
        isBroadcast: true
      });
      notifications.push(notification);
    }

    await Notification.insertMany(notifications);

    // Broadcast via Socket.IO
    if (req.io) {
      req.io.emit('notification', { title, message, type, priority, isBroadcast: true });
    }

    res.status(201).json({
      success: true,
      message: `Broadcast sent to ${notifications.length} users`,
      data: { recipientCount: notifications.length }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get notification preferences
// @route   GET /api/notifications/preferences
// @access  Private
router.get('/preferences', async (req, res, next) => {
  try {
    const user = await require('../models/User').findById(req.user._id).select('preferences.notifications');
    res.json({
      success: true,
      data: {
        preferences: user?.preferences?.notifications || {
          push: true,
          email: true,
          sms: false,
          marketing: false,
          bookingReminders: true,
          promotions: true
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Update notification preferences
// @route   PUT /api/notifications/preferences
// @access  Private
router.put('/preferences', [
  body('push').optional().isBoolean(),
  body('email').optional().isBoolean(),
  body('sms').optional().isBoolean(),
  body('marketing').optional().isBoolean(),
  body('bookingReminders').optional().isBoolean(),
  body('promotions').optional().isBoolean()
], async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.preferences = user.preferences || {};
    user.preferences.notifications = { ...(user.preferences.notifications || {}), ...req.body };
    await user.save();

    res.json({ success: true, message: 'Notification preferences updated', data: { preferences: user.preferences.notifications } });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
