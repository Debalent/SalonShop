const express = require('express');
const { query, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Review = require('../models/Review');
const ServiceType = require('../models/ServiceType');
const Inventory = require('../models/Inventory');

const router = express.Router();

// @desc    Get dashboard overview analytics
// @route   GET /api/analytics/dashboard
// @access  Private (Admin/Owner/Manager)
router.get('/dashboard', [
  query('period').optional().isIn(['7d', '30d', '90d', '365d', 'ytd', 'all'])
], async (req, res, next) => {
  try {
    const { period = '30d' } = req.query;
    const periodMap = { '7d': 7, '30d': 30, '90d': 90, '365d': 365, 'ytd': Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000)), 'all': 99999 };
    const days = periodMap[period] || 30;
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const previousStart = new Date(startDate.getTime() - days * 24 * 60 * 60 * 1000);

    // Current period stats
    const [currentRevenue, previousRevenue, currentBookings, previousBookings, activeCustomers, activeStaff] = await Promise.all([
      Booking.aggregate([
        { $match: { appointmentDate: { $gte: startDate }, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$finalAmount' }, count: { $sum: 1 } } }
      ]),
      Booking.aggregate([
        { $match: { appointmentDate: { $gte: previousStart, $lt: startDate }, status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$finalAmount' }, count: { $sum: 1 } } }
      ]),
      Booking.countDocuments({ appointmentDate: { $gte: startDate } }),
      Booking.countDocuments({ appointmentDate: { $gte: previousStart, $lt: startDate } }),
      User.countDocuments({ role: 'customer', isActive: true, lastLoginAt: { $gte: startDate } }),
      User.countDocuments({ role: { $in: ['staff', 'technician', 'stylist', 'budtender'] }, isActive: true })
    ]);

    const currRev = currentRevenue[0]?.total || 0;
    const prevRev = previousRevenue[0]?.total || 0;
    const revenueChange = prevRev > 0 ? ((currRev - prevRev) / prevRev * 100).toFixed(1) : 0;
    const bookingChange = previousBookings > 0 ? ((currentBookings - previousBookings) / previousBookings * 100).toFixed(1) : 0;

    // Average rating
    const avgRating = await Review.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: 'approved' } },
      { $group: { _id: null, avg: { $avg: '$overallRating' }, count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        revenue: { current: currRev, previous: prevRev, change: parseFloat(revenueChange) },
        bookings: { current: currentBookings, previous: previousBookings, change: parseFloat(bookingChange) },
        customers: { active: activeCustomers },
        staff: { active: activeStaff },
        rating: { average: avgRating[0]?.avg ? Math.round(avgRating[0].avg * 10) / 10 : 0, reviewCount: avgRating[0]?.count || 0 },
        period
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get revenue analytics with time series
// @route   GET /api/analytics/revenue
// @access  Private (Admin/Owner/Manager)
router.get('/revenue', [
  query('period').optional().isIn(['7d', '30d', '90d', '365d']),
  query('groupBy').optional().isIn(['day', 'week', 'month'])
], async (req, res, next) => {
  try {
    const { period = '30d', groupBy = 'day' } = req.query;
    const days = { '7d': 7, '30d': 30, '90d': 90, '365d': 365 }[period];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const dateFormat = {
      day: { $dateToString: { format: '%Y-%m-%d', date: '$appointmentDate' } },
      week: { $dateToString: { format: '%Y-W%V', date: '$appointmentDate' } },
      month: { $dateToString: { format: '%Y-%m', date: '$appointmentDate' } }
    };

    const timeSeries = await Booking.aggregate([
      { $match: { appointmentDate: { $gte: startDate }, status: 'completed' } },
      { $group: {
        _id: dateFormat[groupBy],
        revenue: { $sum: '$finalAmount' },
        bookings: { $sum: 1 },
        avgTransaction: { $avg: '$finalAmount' }
      }},
      { $sort: { _id: 1 } },
      { $project: { date: '$_id', revenue: { $round: ['$revenue', 2] }, bookings: 1, avgTransaction: { $round: ['$avgTransaction', 2] }, _id: 0 } }
    ]);

    const summary = await Booking.aggregate([
      { $match: { appointmentDate: { $gte: startDate }, status: 'completed' } },
      { $group: {
        _id: null,
        totalRevenue: { $sum: '$finalAmount' },
        totalBookings: { $sum: 1 },
        avgTransaction: { $avg: '$finalAmount' },
        maxTransaction: { $max: '$finalAmount' },
        minTransaction: { $min: '$finalAmount' }
      }}
    ]);

    res.json({
      success: true,
      data: {
        timeSeries,
        summary: summary[0] || { totalRevenue: 0, totalBookings: 0, avgTransaction: 0 },
        period,
        groupBy
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get service analytics
// @route   GET /api/analytics/services
// @access  Private (Admin/Owner/Manager)
router.get('/services', [
  query('period').optional().isIn(['7d', '30d', '90d', '365d'])
], async (req, res, next) => {
  try {
    const days = { '7d': 7, '30d': 30, '90d': 90, '365d': 365 }[req.query.period || '30d'];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const serviceStats = await Booking.aggregate([
      { $match: { appointmentDate: { $gte: startDate }, status: 'completed' } },
      { $unwind: '$services' },
      { $group: {
        _id: '$services.serviceType',
        bookings: { $sum: 1 },
        revenue: { $sum: '$services.price' },
        avgPrice: { $avg: '$services.price' }
      }},
      { $lookup: { from: 'servicetypes', localField: '_id', foreignField: '_id', as: 'service' } },
      { $unwind: { path: '$service', preserveNullAndEmptyArrays: true } },
      { $project: {
        name: { $ifNull: ['$service.name', 'Unknown'] },
        category: { $ifNull: ['$service.category', 'other'] },
        bookings: 1,
        revenue: { $round: ['$revenue', 2] },
        avgPrice: { $round: ['$avgPrice', 2] }
      }},
      { $sort: { revenue: -1 } }
    ]);

    const categoryStats = await Booking.aggregate([
      { $match: { appointmentDate: { $gte: startDate }, status: 'completed' } },
      { $unwind: '$services' },
      { $lookup: { from: 'servicetypes', localField: 'services.serviceType', foreignField: '_id', as: 'serviceInfo' } },
      { $unwind: { path: '$serviceInfo', preserveNullAndEmptyArrays: true } },
      { $group: {
        _id: { $ifNull: ['$serviceInfo.category', 'other'] },
        bookings: { $sum: 1 },
        revenue: { $sum: '$services.price' }
      }},
      { $sort: { revenue: -1 } }
    ]);

    res.json({
      success: true,
      data: { serviceStats, categoryStats }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get staff analytics
// @route   GET /api/analytics/staff
// @access  Private (Admin/Owner/Manager)
router.get('/staff', [
  query('period').optional().isIn(['7d', '30d', '90d', '365d'])
], async (req, res, next) => {
  try {
    const days = { '7d': 7, '30d': 30, '90d': 90, '365d': 365 }[req.query.period || '30d'];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const staffStats = await Booking.aggregate([
      { $match: { appointmentDate: { $gte: startDate }, status: 'completed' } },
      { $group: {
        _id: '$staff',
        totalBookings: { $sum: 1 },
        totalRevenue: { $sum: '$finalAmount' },
        avgRating: { $avg: '$feedback.rating' },
        completedServices: { $sum: { $size: '$services' } }
      }},
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'staffInfo' } },
      { $unwind: '$staffInfo' },
      { $project: {
        name: { $concat: ['$staffInfo.firstName', ' ', '$staffInfo.lastName'] },
        avatar: '$staffInfo.avatar',
        role: '$staffInfo.role',
        totalBookings: 1,
        totalRevenue: { $round: ['$totalRevenue', 2] },
        avgRating: { $round: [{ $ifNull: ['$avgRating', 0] }, 1] },
        completedServices: 1
      }},
      { $sort: { totalRevenue: -1 } }
    ]);

    // Utilization rates
    const totalStaff = await User.countDocuments({
      role: { $in: ['staff', 'technician', 'stylist', 'budtender'] },
      isActive: true
    });

    const staffWithBookings = new Set(staffStats.map(s => s._id.toString())).size;

    res.json({
      success: true,
      data: {
        staffStats,
        overview: {
          totalStaff,
          activeStaff: staffWithBookings,
          utilizationRate: totalStaff > 0 ? Math.round(staffWithBookings / totalStaff * 100) : 0
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get customer analytics
// @route   GET /api/analytics/customers
// @access  Private (Admin/Owner/Manager)
router.get('/customers', [
  query('period').optional().isIn(['7d', '30d', '90d', '365d'])
], async (req, res, next) => {
  try {
    const days = { '7d': 7, '30d': 30, '90d': 90, '365d': 365 }[req.query.period || '30d'];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const previousStart = new Date(startDate.getTime() - days * 24 * 60 * 60 * 1000);

    const [newCustomers, previousNewCustomers, topCustomers, retentionData] = await Promise.all([
      User.countDocuments({ role: 'customer', createdAt: { $gte: startDate } }),
      User.countDocuments({ role: 'customer', createdAt: { $gte: previousStart, $lt: startDate } }),
      Booking.aggregate([
        { $match: { appointmentDate: { $gte: startDate }, status: 'completed' } },
        { $group: { _id: '$customer', totalSpent: { $sum: '$finalAmount' }, visits: { $sum: 1 } } },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'customerInfo' } },
        { $unwind: '$customerInfo' },
        { $project: { name: { $concat: ['$customerInfo.firstName', ' ', '$customerInfo.lastName'] }, totalSpent: { $round: ['$totalSpent', 2] }, visits: 1 } },
        { $sort: { totalSpent: -1 } },
        { $limit: 10 }
      ]),
      // Retention: customers who booked in both current and previous period
      Booking.aggregate([
        { $match: { appointmentDate: { $gte: previousStart }, status: 'completed' } },
        { $group: { _id: '$customer', periods: { $addToSet: { $cond: [{ $gte: ['$appointmentDate', startDate] }, 'current', 'previous'] } } } },
        { $match: { periods: { $all: ['current', 'previous'] } } },
        { $count: 'retained' }
      ])
    ]);

    const customerGrowth = previousNewCustomers > 0 ? ((newCustomers - previousNewCustomers) / previousNewCustomers * 100).toFixed(1) : 0;

    res.json({
      success: true,
      data: {
        newCustomers,
        customerGrowth: parseFloat(customerGrowth),
        totalCustomers: await User.countDocuments({ role: 'customer', isActive: true }),
        topCustomers,
        retainedCustomers: retentionData[0]?.retained || 0
      }
    });
  } catch (error) {
    next(error);
  }
});

// @desc    Get booking analytics
// @route   GET /api/analytics/bookings
// @access  Private (Admin/Owner/Manager)
router.get('/bookings', [
  query('period').optional().isIn(['7d', '30d', '90d', '365d'])
], async (req, res, next) => {
  try {
    const days = { '7d': 7, '30d': 30, '90d': 90, '365d': 365 }[req.query.period || '30d'];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [statusBreakdown, peakHours, peakDays, cancellationRate] = await Promise.all([
      Booking.aggregate([
        { $match: { appointmentDate: { $gte: startDate } } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      Booking.aggregate([
        { $match: { appointmentDate: { $gte: startDate }, status: 'completed' } },
        { $group: { _id: '$startTime', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      Booking.aggregate([
        { $match: { appointmentDate: { $gte: startDate }, status: 'completed' } },
        { $group: { _id: { $dayOfWeek: '$appointmentDate' }, count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]),
      Booking.aggregate([
        { $match: { appointmentDate: { $gte: startDate } } },
        { $group: { _id: null, total: { $sum: 1 }, cancelled: { $sum: { $cond: [{ $eq: ['$status', 'cancelled'] }, 1, 0] } } } }
      ])
    ]);

    const dayNames = ['', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    res.json({
      success: true,
      data: {
        statusBreakdown: statusBreakdown.reduce((acc, { _id, count }) => ({ ...acc, [_id]: count }), {}),
        peakHours: peakHours.map(h => ({ time: h._id, bookings: h.count })),
        peakDays: peakDays.map(d => ({ day: dayNames[d._id] || d._id, bookings: d.count })),
        cancellationRate: cancellationRate[0] ? Math.round(cancellationRate[0].cancelled / cancellationRate[0].total * 100 * 10) / 10 : 0
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
