import { body, param, query } from 'express-validator';

// Product validation
export const validateCreateProduct = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Product name must be between 3 and 200 characters')
    .matches(/^[a-zA-Z0-9\s\-\.\,\(\)\&\']+$/)
    .withMessage('Product name contains invalid characters'),

  body('description')
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage('Description must be between 10 and 2000 characters'),

  body('category')
    .isIn(['solar', 'reusable', 'zero_waste', 'local', 'organic', 'eco_fashion', 'green_tech'])
    .withMessage('Invalid category'),

  body('subcategory')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Subcategory cannot exceed 100 characters'),

  body('images')
    .isArray({ min: 1 })
    .withMessage('At least one image is required')
    .custom((images) => {
      for (const image of images) {
        if (!image.match(/^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i)) {
          throw new Error('All images must be valid URLs ending with image extensions');
        }
      }
      return true;
    }),

  // Pricing validation
  body('pricing.base_price')
    .isFloat({ min: 0 })
    .withMessage('Base price must be a positive number'),

  body('pricing.currency')
    .optional()
    .isIn(['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'])
    .withMessage('Invalid currency'),

  body('pricing.discount_price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Discount price must be a positive number')
    .custom((value, { req }) => {
      if (value && value >= req.body.pricing.base_price) {
        throw new Error('Discount price must be less than base price');
      }
      return true;
    }),

  body('pricing.bulk_pricing')
    .optional()
    .isArray()
    .withMessage('Bulk pricing must be an array')
    .custom((bulkPricing) => {
      if (bulkPricing && bulkPricing.length > 0) {
        const quantities = bulkPricing.map(tier => tier.min_quantity).sort((a, b) => a - b);
        for (let i = 0; i < quantities.length - 1; i++) {
          if (quantities[i] >= quantities[i + 1]) {
            throw new Error('Bulk pricing quantities must be in ascending order');
          }
        }
      }
      return true;
    }),

  // Sustainability validation
  body('sustainability.eco_rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Eco rating must be between 1 and 5'),

  body('sustainability.carbon_footprint')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Carbon footprint must be a positive number'),

  body('sustainability.certifications')
    .optional()
    .isArray()
    .withMessage('Certifications must be an array')
    .custom((certifications) => {
      const validCertifications = [
        'Energy Star', 'USDA Organic', 'Fair Trade', 'LEED',
        'FSC Certified', 'Cradle to Cradle', 'B Corp',
        'Carbon Neutral', 'Rainforest Alliance', 'EPA Safer Choice'
      ];
      for (const cert of certifications) {
        if (!validCertifications.includes(cert)) {
          throw new Error(`Invalid certification: ${cert}`);
        }
      }
      return true;
    }),

  // Inventory validation
  body('inventory.stock_quantity')
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a non-negative integer'),

  body('inventory.weight')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Weight must be a positive number'),

  body('inventory.dimensions.length')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Length must be a positive number'),

  body('inventory.dimensions.width')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Width must be a positive number'),

  body('inventory.dimensions.height')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Height must be a positive number'),

  body('inventory.dimensions.unit')
    .optional()
    .isIn(['cm', 'in', 'm'])
    .withMessage('Invalid dimension unit'),

  // Shipping validation
  body('shipping.free_shipping_threshold')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Free shipping threshold must be a positive number'),

  body('shipping.shipping_cost')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Shipping cost must be a positive number'),

  body('shipping.processing_time')
    .optional()
    .isInt({ min: 1, max: 30 })
    .withMessage('Processing time must be between 1 and 30 days'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
    .custom((tags) => {
      for (const tag of tags) {
        if (typeof tag !== 'string' || tag.length > 50) {
          throw new Error('Each tag must be a string with maximum 50 characters');
        }
      }
      return true;
    }),

  body('status')
    .optional()
    .isIn(['active', 'inactive', 'out_of_stock', 'discontinued'])
    .withMessage('Invalid status')
];

export const validateUpdateProduct = [
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID'),

  ...validateCreateProduct.map(validator => 
    validator.optional ? validator : validator.optional()
  )
];

export const validateProductId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID')
];

export const validateSellerId = [
  param('sellerId')
    .optional()
    .isMongoId()
    .withMessage('Invalid seller ID')
];

export const validateStockUpdate = [
  param('id')
    .isMongoId()
    .withMessage('Invalid product ID'),

  body('quantity')
    .isInt({ min: 0 })
    .withMessage('Quantity must be a non-negative integer'),

  body('operation')
    .optional()
    .isIn(['set', 'add', 'subtract'])
    .withMessage('Operation must be one of: set, add, subtract')
];

export const validateProductQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('category')
    .optional()
    .isIn(['solar', 'reusable', 'zero_waste', 'local', 'organic', 'eco_fashion', 'green_tech'])
    .withMessage('Invalid category'),

  query('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),

  query('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number')
    .custom((value, { req }) => {
      if (req.query.minPrice && parseFloat(value) < parseFloat(req.query.minPrice)) {
        throw new Error('Maximum price must be greater than minimum price');
      }
      return true;
    }),

  query('minRating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Minimum rating must be between 0 and 5'),

  query('sortBy')
    .optional()
    .isIn(['created_at', 'price', 'rating', 'sustainability', 'name'])
    .withMessage('Invalid sort field'),

  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),

  query('ecoRating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Eco rating must be between 1 and 5'),

  query('inStock')
    .optional()
    .isBoolean()
    .withMessage('inStock must be a boolean'),

  query('featured')
    .optional()
    .isBoolean()
    .withMessage('featured must be a boolean'),

  query('localOnly')
    .optional()
    .isBoolean()
    .withMessage('localOnly must be a boolean'),

  query('carbonNeutral')
    .optional()
    .isBoolean()
    .withMessage('carbonNeutral must be a boolean')
];

export const validateSearchProducts = [
  body('query')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search query must be between 1 and 100 characters'),

  body('category')
    .optional()
    .isIn(['solar', 'reusable', 'zero_waste', 'local', 'organic', 'eco_fashion', 'green_tech'])
    .withMessage('Invalid category'),

  body('minPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Minimum price must be a positive number'),

  body('maxPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Maximum price must be a positive number'),

  body('minRating')
    .optional()
    .isFloat({ min: 0, max: 5 })
    .withMessage('Minimum rating must be between 0 and 5'),

  body('inStock')
    .optional()
    .isBoolean()
    .withMessage('inStock must be a boolean'),

  body('sortBy')
    .optional()
    .isIn(['created_at', 'price', 'rating', 'sustainability', 'name'])
    .withMessage('Invalid sort field'),

  body('sortOrder')
    .optional()
    .isInt({ min: -1, max: 1 })
    .withMessage('Sort order must be -1 or 1'),

  body('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  body('skip')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Skip must be a non-negative integer')
];

export const validateSustainableQuery = [
  query('eco_rating')
    .optional()
    .isInt({ min: 1, max: 5 })
    .withMessage('Eco rating must be between 1 and 5'),

  query('certifications')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        const validCertifications = [
          'Energy Star', 'USDA Organic', 'Fair Trade', 'LEED',
          'FSC Certified', 'Cradle to Cradle', 'B Corp',
          'Carbon Neutral', 'Rainforest Alliance', 'EPA Safer Choice'
        ];
        const certArray = value.split(',');
        for (const cert of certArray) {
          if (!validCertifications.includes(cert.trim())) {
            throw new Error(`Invalid certification: ${cert.trim()}`);
          }
        }
      }
      return true;
    }),

  query('carbon_neutral')
    .optional()
    .isBoolean()
    .withMessage('carbon_neutral must be a boolean'),

  query('local_only')
    .optional()
    .isBoolean()
    .withMessage('local_only must be a boolean')
];

// Cart validation (for future use)
export const validateAddToCart = [
  body('productId')
    .isMongoId()
    .withMessage('Invalid product ID'),

  body('quantity')
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be between 1 and 100')
];

export const validateUpdateCartItem = [
  param('itemId')
    .isMongoId()
    .withMessage('Invalid cart item ID'),

  body('quantity')
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be between 1 and 100')
];

// Order validation (for future use)
export const validateCreateOrder = [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),

  body('items.*.productId')
    .isMongoId()
    .withMessage('Invalid product ID'),

  body('items.*.quantity')
    .isInt({ min: 1, max: 100 })
    .withMessage('Quantity must be between 1 and 100'),

  body('shippingAddress.street')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Street address must be between 5 and 100 characters'),

  body('shippingAddress.city')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('City must be between 2 and 50 characters'),

  body('shippingAddress.state')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('State must be between 2 and 50 characters'),

  body('shippingAddress.zipCode')
    .trim()
    .matches(/^\d{5}(-\d{4})?$/)
    .withMessage('Invalid ZIP code format'),

  body('shippingAddress.country')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Country must be between 2 and 50 characters')
];

export default {
  validateCreateProduct,
  validateUpdateProduct,
  validateProductId,
  validateSellerId,
  validateStockUpdate,
  validateProductQuery,
  validateSearchProducts,
  validateSustainableQuery,
  validateAddToCart,
  validateUpdateCartItem,
  validateCreateOrder
};
