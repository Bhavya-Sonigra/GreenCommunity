import express from 'express';
import rateLimit from 'express-rate-limit';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSellerProducts,
  updateStock,
  getFeaturedProducts,
  getCategories,
  searchProducts,
  getSustainableProducts,
  toggleFeatured,
  getMarketplaceStats
} from '../controllers/marketplace.controller.js';

import {
  validateCreateProduct,
  validateUpdateProduct,
  validateProductId,
  validateSellerId,
  validateStockUpdate,
  validateProductQuery,
  validateSearchProducts,
  validateSustainableQuery
} from '../middleware/marketplace.validation.js';

import { authenticate, authorize, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Rate limiters for different operations
const createProductLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 products per hour per user
  message: {
    error: 'Too many product creation attempts. Please try again later.',
    retryAfter: 60 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false
});

const searchLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // 30 searches per minute
  message: {
    error: 'Too many search requests. Please try again later.',
    retryAfter: 1 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false
});

const updateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 updates per 15 minutes
  message: {
    error: 'Too many update requests. Please try again later.',
    retryAfter: 15 * 60 * 1000
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Public routes (no authentication required)
/**
 * @route   GET /api/marketplace/products
 * @desc    Get all products with filtering and pagination
 * @access  Public
 * @query   page, limit, category, subcategory, minPrice, maxPrice, minRating, sortBy, sortOrder, search, featured, inStock, ecoRating, certifications, localOnly, carbonNeutral
 */
router.get('/products', 
  validateProductQuery, 
  getProducts
);

/**
 * @route   GET /api/marketplace/products/:id
 * @desc    Get single product by ID
 * @access  Public
 */
router.get('/products/:id', 
  validateProductId, 
  getProductById
);

/**
 * @route   GET /api/marketplace/products/featured
 * @desc    Get featured products
 * @access  Public
 * @query   limit
 */
router.get('/featured', 
  getFeaturedProducts
);

/**
 * @route   GET /api/marketplace/categories
 * @desc    Get all categories with product counts
 * @access  Public
 */
router.get('/categories', 
  getCategories
);

/**
 * @route   POST /api/marketplace/search
 * @desc    Advanced product search
 * @access  Public
 * @body    query, category, minPrice, maxPrice, minRating, inStock, sortBy, sortOrder, limit, skip
 */
router.post('/search', 
  searchLimiter,
  validateSearchProducts, 
  searchProducts
);

/**
 * @route   GET /api/marketplace/sustainable
 * @desc    Get sustainable products
 * @access  Public
 * @query   eco_rating, certifications, carbon_neutral, local_only
 */
router.get('/sustainable', 
  validateSustainableQuery, 
  getSustainableProducts
);

/**
 * @route   GET /api/marketplace/seller/:sellerId/products
 * @desc    Get products by specific seller (public view)
 * @access  Public
 */
router.get('/seller/:sellerId/products', 
  validateSellerId,
  validateProductQuery, 
  getSellerProducts
);

// Protected routes (authentication required)
/**
 * @route   POST /api/marketplace/products
 * @desc    Create new product
 * @access  Private (Authenticated users)
 * @body    Complete product object
 */
router.post('/products', 
  authenticate,
  createProductLimiter,
  validateCreateProduct, 
  createProduct
);

/**
 * @route   PUT /api/marketplace/products/:id
 * @desc    Update product
 * @access  Private (Product owner or admin)
 * @body    Product fields to update
 */
router.put('/products/:id', 
  authenticate,
  updateLimiter,
  validateUpdateProduct, 
  updateProduct
);

/**
 * @route   DELETE /api/marketplace/products/:id
 * @desc    Delete product
 * @access  Private (Product owner or admin)
 */
router.delete('/products/:id', 
  authenticate,
  validateProductId, 
  deleteProduct
);

/**
 * @route   GET /api/marketplace/my-products
 * @desc    Get current user's products
 * @access  Private
 * @query   page, limit, status
 */
router.get('/my-products', 
  authenticate,
  validateProductQuery,
  getSellerProducts
);

/**
 * @route   PATCH /api/marketplace/products/:id/stock
 * @desc    Update product stock
 * @access  Private (Product owner or admin)
 * @body    quantity, operation (set|add|subtract)
 */
router.patch('/products/:id/stock', 
  authenticate,
  updateLimiter,
  validateStockUpdate, 
  updateStock
);

// Admin only routes
/**
 * @route   PATCH /api/marketplace/products/:id/featured
 * @desc    Toggle product featured status
 * @access  Private (Admin only)
 */
router.patch('/products/:id/featured', 
  authenticate,
  authorize('admin'),
  validateProductId, 
  toggleFeatured
);

/**
 * @route   GET /api/marketplace/admin/stats
 * @desc    Get marketplace statistics
 * @access  Private (Admin only)
 */
router.get('/admin/stats', 
  authenticate,
  authorize('admin'),
  getMarketplaceStats
);

// Health check
/**
 * @route   GET /api/marketplace/health
 * @desc    Health check for marketplace service
 * @access  Public
 */
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Marketplace API is healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware specific to marketplace
router.use((error, req, res, next) => {
  // Handle Mongoose validation errors
  if (error.name === 'ValidationError') {
    const validationErrors = Object.values(error.errors).map(err => ({
      field: err.path,
      message: err.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Product validation failed',
      errors: validationErrors
    });
  }
  
  // Handle duplicate key errors (like duplicate SKU)
  if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `Product ${field} already exists`,
      field
    });
  }
  
  // Handle cast errors (invalid ObjectId)
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid product ID format'
    });
  }
  
  // Pass to global error handler
  next(error);
});

export default router;
