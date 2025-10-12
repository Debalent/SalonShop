const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token required'
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token'
      });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired'
      });
    } else {
      console.error('Auth middleware error:', error);
      return res.status(500).json({
        success: false,
        message: 'Authentication error'
      });
    }
  }
};

// Middleware to authorize user roles
const authorizeRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Insufficient permissions'
      });
    }

    next();
  };
};

// Middleware to check if user owns the resource or has admin privileges
const authorizeOwnershipOrAdmin = (resourceUserField = 'user') => {
  return (req, res, next) => {
    const { user } = req;
    const resourceUserId = req.params[resourceUserField] || req.body[resourceUserField];

    // Allow if user is admin/owner/manager
    if (['admin', 'owner', 'manager'].includes(user.role)) {
      return next();
    }

    // Allow if user owns the resource
    if (resourceUserId && resourceUserId.toString() === user._id.toString()) {
      return next();
    }

    // Allow if checking own profile
    if (req.params.id && req.params.id.toString() === user._id.toString()) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: 'Access denied. You can only access your own resources.'
    });
  };
};

// Middleware to generate JWT token
const generateToken = (userId, role) => {
  return jwt.sign(
    { 
      userId, 
      role,
      iat: Date.now() / 1000
    },
    process.env.JWT_SECRET,
    { 
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );
};

// Middleware to validate staff permissions for bookings
const validateStaffBookingAccess = async (req, res, next) => {
  try {
    const { user } = req;
    
    // Admins, owners, and managers have full access
    if (['admin', 'owner', 'manager'].includes(user.role)) {
      return next();
    }

    // Staff can only access their own bookings
    if (['staff', 'technician', 'stylist', 'budtender'].includes(user.role)) {
      const bookingId = req.params.id;
      const staffId = req.params.staffId || req.body.staff;
      
      // If accessing specific booking, check if staff member is assigned
      if (bookingId) {
        const Booking = require('../models/Booking');
        const booking = await Booking.findById(bookingId);
        
        if (!booking) {
          return res.status(404).json({
            success: false,
            message: 'Booking not found'
          });
        }
        
        if (booking.staff.toString() !== user._id.toString()) {
          return res.status(403).json({
            success: false,
            message: 'Access denied. You can only access your own bookings.'
          });
        }
      }
      
      // If filtering by staff, ensure it's their own ID
      if (staffId && staffId.toString() !== user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. You can only access your own bookings.'
        });
      }
    }

    next();
  } catch (error) {
    console.error('Staff booking access validation error:', error);
    return res.status(500).json({
      success: false,
      message: 'Access validation error'
    });
  }
};

module.exports = {
  authenticateToken,
  authorizeRole,
  authorizeOwnershipOrAdmin,
  generateToken,
  validateStaffBookingAccess
};