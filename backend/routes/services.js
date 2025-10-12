const express = require('express');
const { body, validationResult, query } = require('express-validator');
const ServiceType = require('../models/ServiceType');
const { authorizeRole } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all services with filters
// @route   GET /api/services
// @access  Public
router.get('/', [
  query('category').optional().isIn(['nails', 'hair', 'massage', 'facial', 'waxing', 'tattoo', 'piercing', 'dispensary', 'other']),
  query('popular').optional().isBoolean(),
  query('search').optional().isString(),
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
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
      category,
      popular,
      search,
      page = 1,
      limit = 20,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    // Build filter object
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (popular === 'true') filter.isPopular = true;

    // Search functionality
    if (search) {
      filter.$text = { $search: search };
    }

    // Pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort = {};
    if (search) {
      sort.score = { $meta: 'textScore' };
    } else {
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    // Get services
    const services = await ServiceType.find(filter, search ? { score: { $meta: 'textScore' } } : {})
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count
    const total = await ServiceType.countDocuments(filter);

    res.json({
      success: true,
      data: {
        services,
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

// @desc    Get service by ID
// @route   GET /api/services/:id
// @access  Public
router.get('/:id', async (req, res, next) => {
  try {
    const service = await ServiceType.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    res.json({
      success: true,
      data: { service }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Get popular services
// @route   GET /api/services/popular
// @access  Public
router.get('/popular/list', [
  query('limit').optional().isInt({ min: 1, max: 20 })
], async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const services = await ServiceType.getPopularServices(parseInt(limit));

    res.json({
      success: true,
      data: { services }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Search services
// @route   GET /api/services/search
// @access  Public
router.get('/search/query', [
  query('q').notEmpty().withMessage('Search query is required'),
  query('category').optional().isIn(['nails', 'hair', 'massage', 'facial', 'waxing', 'tattoo', 'piercing', 'dispensary', 'other']),
  query('limit').optional().isInt({ min: 1, max: 50 })
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

    const { q, category, limit = 20 } = req.query;

    const services = await ServiceType.searchServices(q, category, parseInt(limit));

    res.json({
      success: true,
      data: { services }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Create new service
// @route   POST /api/services
// @access  Private (Admin/Manager only)
router.post('/', [
  require('../middleware/auth').authenticateToken,
  authorizeRole(['admin', 'owner', 'manager']),
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Service name is required and must be less than 100 characters'),
  body('category').isIn(['nails', 'hair', 'massage', 'facial', 'waxing', 'tattoo', 'piercing', 'dispensary', 'other']).withMessage('Valid category is required'),
  body('description').trim().isLength({ min: 1, max: 500 }).withMessage('Description is required and must be less than 500 characters'),
  body('duration').isInt({ min: 15, max: 480 }).withMessage('Duration must be between 15 and 480 minutes'),
  body('basePrice').isFloat({ min: 0 }).withMessage('Base price must be non-negative')
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

    const serviceData = req.body;

    // Check if service with same name exists
    const existingService = await ServiceType.findOne({
      name: { $regex: new RegExp(`^${serviceData.name}$`, 'i') },
      category: serviceData.category
    });

    if (existingService) {
      return res.status(400).json({
        success: false,
        message: 'Service with this name already exists in this category'
      });
    }

    const service = new ServiceType(serviceData);
    await service.save();

    res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: { service }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Admin/Manager only)
router.put('/:id', [
  require('../middleware/auth').authenticateToken,
  authorizeRole(['admin', 'owner', 'manager']),
  body('name').optional().trim().isLength({ min: 1, max: 100 }),
  body('category').optional().isIn(['nails', 'hair', 'massage', 'facial', 'waxing', 'tattoo', 'piercing', 'dispensary', 'other']),
  body('description').optional().trim().isLength({ min: 1, max: 500 }),
  body('duration').optional().isInt({ min: 15, max: 480 }),
  body('basePrice').optional().isFloat({ min: 0 }),
  body('isActive').optional().isBoolean()
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

    const service = await ServiceType.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Update allowed fields
    const allowedUpdates = [
      'name', 'category', 'description', 'duration', 'basePrice',
      'images', 'requirements', 'aftercareInstructions', 'customizations',
      'staffSpecialties', 'isActive', 'isPopular', 'tags', 'seasonalPricing',
      'groupDiscounts', 'metadata'
    ];

    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        service[key] = req.body[key];
      }
    });

    await service.save();

    res.json({
      success: true,
      message: 'Service updated successfully',
      data: { service }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Delete service (soft delete)
// @route   DELETE /api/services/:id
// @access  Private (Admin/Manager only)
router.delete('/:id', [
  require('../middleware/auth').authenticateToken,
  authorizeRole(['admin', 'owner', 'manager'])
], async (req, res, next) => {
  try {
    const service = await ServiceType.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    // Soft delete by setting isActive to false
    service.isActive = false;
    await service.save();

    res.json({
      success: true,
      message: 'Service deleted successfully'
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Calculate service price with customizations
// @route   POST /api/services/:id/calculate-price
// @access  Public
router.post('/:id/calculate-price', [
  body('customizations').optional().isArray()
], async (req, res, next) => {
  try {
    const service = await ServiceType.findOne({
      _id: req.params.id,
      isActive: true
    });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found'
      });
    }

    const { customizations = [] } = req.body;
    const calculatedPrice = service.calculatePrice(customizations);

    res.json({
      success: true,
      data: {
        basePrice: service.basePrice,
        calculatedPrice,
        customizations
      }
    });

  } catch (error) {
    next(error);
  }
});

// @desc    Get services by category
// @route   GET /api/services/category/:category
// @access  Public
router.get('/category/:category', [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
], async (req, res, next) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Validate category
    const validCategories = ['nails', 'hair', 'massage', 'facial', 'waxing', 'tattoo', 'piercing', 'dispensary', 'other'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    const skip = (page - 1) * limit;

    const services = await ServiceType.find({
      category,
      isActive: true
    })
      .sort({ isPopular: -1, popularityScore: -1, name: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await ServiceType.countDocuments({
      category,
      isActive: true
    });

    res.json({
      success: true,
      data: {
        services,
        category,
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

module.exports = router;