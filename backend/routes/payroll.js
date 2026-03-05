const express = require('express');
const { body, param, query, validationResult } = require('express-validator');
const Payroll = require('../models/Payroll');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Tip = require('../models/Tip');

const router = express.Router();

// @desc    Get all payroll records
// @route   GET /api/payroll
// @access  Private (Admin/Owner/Manager)
router.get('/', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('staff').optional().isMongoId(),
  query('status').optional().isIn(['draft', 'pending', 'approved', 'processed', 'paid']),
  query('payPeriodStart').optional().isISO8601(),
  query('payPeriodEnd').optional().isISO8601()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { page = 1, limit = 20, staff, status, payPeriodStart, payPeriodEnd } = req.query;
    const filter = {};

    if (staff) filter.staff = staff;
    if (status) filter.status = status;
    if (payPeriodStart || payPeriodEnd) {
      filter.payPeriodStart = {};
      if (payPeriodStart) filter.payPeriodStart.$gte = new Date(payPeriodStart);
      if (payPeriodEnd) filter.payPeriodStart.$lte = new Date(payPeriodEnd);
    }

    const skip = (page - 1) * limit;

    const [records, total] = await Promise.all([
      Payroll.find(filter)
        .populate('staff', 'firstName lastName email role staffInfo.hourlyRate staffInfo.commissionRate')
        .sort({ payPeriodEnd: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Payroll.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        payrollRecords: records,
        pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get payroll record by ID
// @route   GET /api/payroll/:id
// @access  Private (Admin/Owner/Manager)
router.get('/:id', [
  param('id').isMongoId()
], async (req, res, next) => {
  try {
    const record = await Payroll.findById(req.params.id)
      .populate('staff', 'firstName lastName email phone role staffInfo')
      .populate('approvedBy', 'firstName lastName');

    if (!record) {
      return res.status(404).json({ success: false, message: 'Payroll record not found' });
    }

    res.json({ success: true, data: { payrollRecord: record } });
  } catch (error) {
    next(error);
  }
});

// @desc    Generate payroll for a pay period
// @route   POST /api/payroll/generate
// @access  Private (Admin/Owner)
router.post('/generate', [
  body('payPeriodStart').isISO8601().withMessage('Valid pay period start date required'),
  body('payPeriodEnd').isISO8601().withMessage('Valid pay period end date required'),
  body('staffIds').optional().isArray()
], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
    }

    const { payPeriodStart, payPeriodEnd, staffIds } = req.body;
    const startDate = new Date(payPeriodStart);
    const endDate = new Date(payPeriodEnd);

    // Get staff members
    const staffFilter = {
      role: { $in: ['staff', 'technician', 'stylist', 'budtender', 'manager'] },
      isActive: true
    };
    if (staffIds && staffIds.length > 0) {
      staffFilter._id = { $in: staffIds };
    }

    const staffMembers = await User.find(staffFilter);
    const generatedRecords = [];

    for (const member of staffMembers) {
      // Check for existing payroll record
      const existing = await Payroll.findOne({
        staff: member._id,
        payPeriodStart: startDate,
        payPeriodEnd: endDate
      });

      if (existing) continue;

      // Calculate earnings from bookings
      const completedBookings = await Booking.find({
        staff: member._id,
        appointmentDate: { $gte: startDate, $lte: endDate },
        status: 'completed'
      });

      const totalServiceRevenue = completedBookings.reduce((sum, b) => sum + (b.finalAmount || 0), 0);
      const commissionRate = member.staffInfo?.commissionRate || 0;
      const commissionEarnings = totalServiceRevenue * (commissionRate / 100);

      // Get tips for the period
      const tips = await Tip.find({
        recipient: member._id,
        createdAt: { $gte: startDate, $lte: endDate },
        status: 'completed'
      });
      const totalTips = tips.reduce((sum, t) => sum + (t.amount || 0), 0);

      // Calculate hours (estimate from bookings)
      const totalMinutes = completedBookings.reduce((sum, b) => {
        const [startH, startM] = (b.startTime || '0:0').split(':').map(Number);
        const [endH, endM] = (b.endTime || '0:0').split(':').map(Number);
        return sum + ((endH * 60 + endM) - (startH * 60 + startM));
      }, 0);
      const regularHours = Math.min(totalMinutes / 60, 80); // Bi-weekly cap
      const overtimeHours = Math.max((totalMinutes / 60) - 80, 0);

      const hourlyRate = member.staffInfo?.hourlyRate || 0;
      const regularPay = regularHours * hourlyRate;
      const overtimePay = overtimeHours * hourlyRate * 1.5;

      // Tax calculations (simplified)
      const grossPay = regularPay + overtimePay + commissionEarnings + totalTips;
      const federalTax = grossPay * 0.12;
      const stateTax = grossPay * 0.05;
      const socialSecurity = grossPay * 0.062;
      const medicare = grossPay * 0.0145;
      const totalDeductions = federalTax + stateTax + socialSecurity + medicare;
      const netPay = grossPay - totalDeductions;

      const record = new Payroll({
        staff: member._id,
        payPeriodStart: startDate,
        payPeriodEnd: endDate,
        hours: {
          regular: Math.round(regularHours * 100) / 100,
          overtime: Math.round(overtimeHours * 100) / 100,
          total: Math.round((regularHours + overtimeHours) * 100) / 100
        },
        earnings: {
          regular: Math.round(regularPay * 100) / 100,
          overtime: Math.round(overtimePay * 100) / 100,
          commission: Math.round(commissionEarnings * 100) / 100,
          tips: Math.round(totalTips * 100) / 100,
          bonuses: 0,
          grossPay: Math.round(grossPay * 100) / 100
        },
        deductions: {
          federalTax: Math.round(federalTax * 100) / 100,
          stateTax: Math.round(stateTax * 100) / 100,
          socialSecurity: Math.round(socialSecurity * 100) / 100,
          medicare: Math.round(medicare * 100) / 100,
          totalDeductions: Math.round(totalDeductions * 100) / 100
        },
        netPay: Math.round(netPay * 100) / 100,
        status: 'draft',
        completedServices: completedBookings.length,
        serviceRevenue: Math.round(totalServiceRevenue * 100) / 100
      });

      await record.save();
      generatedRecords.push(record);
    }

    // Populate created records
    const populated = await Payroll.find({ _id: { $in: generatedRecords.map(r => r._id) } })
      .populate('staff', 'firstName lastName email role');

    res.status(201).json({
      success: true,
      message: `Generated ${generatedRecords.length} payroll records`,
      data: { payrollRecords: populated }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Approve payroll record
// @route   PUT /api/payroll/:id/approve
// @access  Private (Admin/Owner)
router.put('/:id/approve', [
  param('id').isMongoId()
], async (req, res, next) => {
  try {
    const record = await Payroll.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Payroll record not found' });
    }

    if (!['draft', 'pending'].includes(record.status)) {
      return res.status(400).json({ success: false, message: `Cannot approve record with status: ${record.status}` });
    }

    record.status = 'approved';
    record.approvedBy = req.user._id;
    record.approvedAt = new Date();
    await record.save();

    await record.populate('staff', 'firstName lastName');
    res.json({ success: true, message: 'Payroll record approved', data: { payrollRecord: record } });
  } catch (error) {
    next(error);
  }
});

// @desc    Process payroll (mark as paid)
// @route   PUT /api/payroll/:id/process
// @access  Private (Admin/Owner)
router.put('/:id/process', [
  param('id').isMongoId(),
  body('paymentMethod').optional().isIn(['direct_deposit', 'check', 'cash']),
  body('paymentReference').optional().isString()
], async (req, res, next) => {
  try {
    const record = await Payroll.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Payroll record not found' });
    }

    if (record.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Payroll must be approved before processing' });
    }

    record.status = 'paid';
    record.paidAt = new Date();
    record.paymentMethod = req.body.paymentMethod || 'direct_deposit';
    record.paymentReference = req.body.paymentReference;
    await record.save();

    await record.populate('staff', 'firstName lastName');
    res.json({ success: true, message: 'Payroll processed successfully', data: { payrollRecord: record } });
  } catch (error) {
    next(error);
  }
});

// @desc    Get payroll summary
// @route   GET /api/payroll/summary/overview
// @access  Private (Admin/Owner/Manager)
router.get('/summary/overview', async (req, res, next) => {
  try {
    const { period = 'current' } = req.query;
    const now = new Date();
    let startDate, endDate;

    if (period === 'current') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    } else if (period === 'last') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      endDate = new Date(now.getFullYear(), now.getMonth(), 0);
    }

    const summary = await Payroll.aggregate([
      { $match: { payPeriodStart: { $gte: startDate }, payPeriodEnd: { $lte: endDate } } },
      { $group: {
        _id: null,
        totalGrossPay: { $sum: '$earnings.grossPay' },
        totalNetPay: { $sum: '$netPay' },
        totalDeductions: { $sum: '$deductions.totalDeductions' },
        totalTips: { $sum: '$earnings.tips' },
        totalCommission: { $sum: '$earnings.commission' },
        recordCount: { $sum: 1 },
        avgGrossPay: { $avg: '$earnings.grossPay' }
      }}
    ]);

    const statusCounts = await Payroll.aggregate([
      { $match: { payPeriodStart: { $gte: startDate }, payPeriodEnd: { $lte: endDate } } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        summary: summary[0] || { totalGrossPay: 0, totalNetPay: 0, totalDeductions: 0, totalTips: 0, totalCommission: 0, recordCount: 0, avgGrossPay: 0 },
        statusBreakdown: statusCounts.reduce((acc, { _id, count }) => ({ ...acc, [_id]: count }), {}),
        period: { start: startDate, end: endDate }
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
