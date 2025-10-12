const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Booking = require('../models/Booking');
const User = require('../models/User');
const ServiceType = require('../models/ServiceType');
const { authorizeRole, validateStaffBookingAccess } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all bookings with filters
// @route   GET /api/bookings
// @access  Private
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('status').optional().isIn(['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show']),
  query('staff').optional().isMongoId().withMessage('Staff ID must be valid'),
  query('customer').optional().isMongoId().withMessage('Customer ID must be valid'),
  query('startDate').optional().isISO8601().withMessage('Start date must be valid ISO date'),
  query('endDate').optional().isISO8601().withMessage('End date must be valid ISO date')
], validateStaffBookingAccess, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      page = 1,
      limit = 20,
      status,
      staff,
      customer,
      startDate,
      endDate,
      search
    } = req.query;

    // Build filter object
    const filter = {};

    // Role-based filtering
    if (req.user.role === 'customer') {
      filter.customer = req.user._id;
    } else if (['staff', 'technician', 'stylist', 'budtender'].includes(req.user.role)) {
      filter.staff = req.user._id;
    }

    // Apply additional filters
    if (status) filter.status = status;
    if (staff && ['admin', 'owner', 'manager'].includes(req.user.role)) {
      filter.staff = staff;
    }
    if (customer && ['admin', 'owner', 'manager'].includes(req.user.role)) {
      filter.customer = customer;
    }

    // Date range filter
    if (startDate || endDate) {
      filter.appointmentDate = {};
      if (startDate) filter.appointmentDate.$gte = new Date(startDate);
      if (endDate) filter.appointmentDate.$lte = new Date(endDate);
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Get bookings with population
    const bookings = await Booking.find(filter)
      .populate('customer', 'firstName lastName email phone avatar')
      .populate('staff', 'firstName lastName email phone avatar staffInfo.specialty')
      .populate('services.serviceType', 'name category duration basePrice')
      .sort({ appointmentDate: -1, startTime: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const total = await Booking.countDocuments(filter);

    res.json({
      success: true,
      data: {
        bookings,
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

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
router.get('/:id', async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('customer', 'firstName lastName email phone avatar customerInfo')
      .populate('staff', 'firstName lastName email phone avatar staffInfo')
      .populate('services.serviceType', 'name category description duration basePrice images');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check permissions
    const canAccess = req.user.role === 'admin' ||
                     req.user.role === 'owner' ||
                     req.user.role === 'manager' ||
                     booking.customer._id.toString() === req.user._id.toString() ||
                     booking.staff._id.toString() === req.user._id.toString();

    if (!canAccess) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: { booking }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
router.post('/', [
  body('staff').isMongoId().withMessage('Valid staff ID is required'),
  body('services').isArray({ min: 1 }).withMessage('At least one service is required'),
  body('services.*.serviceType').isMongoId().withMessage('Valid service type ID is required'),
  body('services.*.price').isFloat({ min: 0 }).withMessage('Service price must be non-negative'),
  body('services.*.duration').isInt({ min: 15 }).withMessage('Service duration must be at least 15 minutes'),
  body('appointmentDate').isISO8601().withMessage('Valid appointment date is required'),
  body('startTime').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid start time is required (HH:MM format)'),
  body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be non-negative')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      staff,
      services,
      appointmentDate,
      startTime,
      totalAmount,
      notes
    } = req.body;

    // Validate staff member exists and is active
    const staffMember = await User.findOne({
      _id: staff,
      role: { $in: ['staff', 'technician', 'stylist', 'budtender'] },
      isActive: true
    });

    if (!staffMember) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or inactive staff member'
      });
    }

    // Validate services exist
    const serviceIds = services.map(s => s.serviceType);
    const validServices = await ServiceType.find({
      _id: { $in: serviceIds },
      isActive: true
    });

    if (validServices.length !== serviceIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more services are invalid or inactive'
      });
    }

    // Calculate total duration and end time
    const totalDuration = services.reduce((sum, service) => sum + service.duration, 0);
    const [hours, minutes] = startTime.split(':').map(Number);
    const endDate = new Date(appointmentDate);
    endDate.setHours(hours, minutes + totalDuration);
    const endTime = `${endDate.getHours().toString().padStart(2, '0')}:${endDate.getMinutes().toString().padStart(2, '0')}`;

    // Check for scheduling conflicts
    const conflictingBooking = await Booking.findOne({
      staff: staff,
      appointmentDate: new Date(appointmentDate),
      status: { $in: ['pending', 'confirmed', 'in-progress'] },
      $or: [
        {
          startTime: { $lt: endTime },
          endTime: { $gt: startTime }
        }
      ]
    });

    if (conflictingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Time slot is already booked'
      });
    }

    // Calculate final amount with taxes
    const taxRate = 0.08; // 8% default tax rate
    const taxAmount = totalAmount * taxRate;
    const finalAmount = totalAmount + taxAmount;

    // Create booking
    const booking = new Booking({
      customer: req.user._id,
      staff,
      services,
      appointmentDate: new Date(appointmentDate),
      startTime,
      endTime,
      totalAmount,
      taxAmount,
      finalAmount,
      notes: notes ? { customer: notes } : {}
    });

    await booking.save();

    // Populate booking for response
    await booking.populate('customer', 'firstName lastName email phone');
    await booking.populate('staff', 'firstName lastName email phone');
    await booking.populate('services.serviceType', 'name category duration basePrice');

    // TODO: Send confirmation notifications
    // await sendBookingConfirmation(booking);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
router.put('/:id', [
  body('status').optional().isIn(['pending', 'confirmed', 'in-progress', 'completed', 'cancelled', 'no-show']),
  body('appointmentDate').optional().isISO8601().withMessage('Valid appointment date is required'),
  body('startTime').optional().matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Valid start time is required')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check permissions
    const canUpdate = req.user.role === 'admin' ||
                     req.user.role === 'owner' ||
                     req.user.role === 'manager' ||
                     booking.staff.toString() === req.user._id.toString() ||
                     (booking.customer.toString() === req.user._id.toString() && booking.canBeCancelled());

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['status', 'appointmentDate', 'startTime', 'notes'];
    const updates = {};

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Handle status-specific logic
    if (req.body.status === 'cancelled') {
      updates.cancelledBy = req.user._id;
      updates.cancelledAt = new Date();
      updates.cancellationReason = req.body.cancellationReason;
    }

    Object.assign(booking, updates);
    await booking.save();

    await booking.populate('customer', 'firstName lastName email phone');
    await booking.populate('staff', 'firstName lastName email phone');
    await booking.populate('services.serviceType', 'name category duration basePrice');

    res.json({
      success: true,
      message: 'Booking updated successfully',
      data: { booking }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
router.delete('/:id', async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if booking can be cancelled
    if (!booking.canBeCancelled()) {
      return res.status(400).json({
        success: false,
        message: 'Booking cannot be cancelled (too close to appointment time or already processed)'
      });
    }

    // Check permissions
    const canCancel = req.user.role === 'admin' ||
                     req.user.role === 'owner' ||
                     req.user.role === 'manager' ||
                     booking.customer.toString() === req.user._id.toString() ||
                     booking.staff.toString() === req.user._id.toString();

    if (!canCancel) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    booking.status = 'cancelled';
    booking.cancelledBy = req.user._id;
    booking.cancelledAt = new Date();
    booking.cancellationReason = req.body.reason || 'Cancelled by user';

    await booking.save();

    res.json({
      success: true,
      message: 'Booking cancelled successfully'
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Get available time slots
// @route   GET /api/bookings/available-slots
// @access  Private
router.get('/available-slots/staff/:staffId', [
  query('date').isISO8601().withMessage('Valid date is required'),
  query('duration').optional().isInt({ min: 15 }).withMessage('Duration must be at least 15 minutes')
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { staffId } = req.params;
    const { date, duration = 60 } = req.query;

    // Validate staff member
    const staff = await User.findOne({
      _id: staffId,
      role: { $in: ['staff', 'technician', 'stylist', 'budtender'] },
      isActive: true
    });

    if (!staff) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    // Get staff schedule for the day
    const dayOfWeek = new Date(date).toLocaleLowerCase();
    const schedule = staff.staffInfo?.schedule?.[dayOfWeek];

    if (!schedule || !schedule.isWorking) {
      return res.json({
        success: true,
        data: { availableSlots: [] }
      });
    }

    // Find existing bookings for the date
    const existingBookings = await Booking.find({
      staff: staffId,
      appointmentDate: new Date(date),
      status: { $in: ['pending', 'confirmed', 'in-progress'] }
    }).sort({ startTime: 1 });

    // Generate available slots
    const availableSlots = [];
    const workStart = schedule.start;
    const workEnd = schedule.end;

    // TODO: Implement slot generation logic
    // This would calculate available time slots based on:
    // - Staff working hours
    // - Existing bookings
    // - Required service duration
    // - Buffer time between appointments

    res.json({
      success: true,
      data: { availableSlots }
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;