import mongoose from 'mongoose';
import { getConnection, DB_NAMES } from '../config/databases.js';

const bulkPricingSchema = new mongoose.Schema({
  min_quantity: {
    type: Number,
    required: true,
    min: 1
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, { _id: false });

const dimensionsSchema = new mongoose.Schema({
  length: {
    type: Number,
    required: true,
    min: 0
  },
  width: {
    type: Number,
    required: true,
    min: 0
  },
  height: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    enum: ['cm', 'in', 'm'],
    default: 'cm'
  }
}, { _id: false });

const pricingSchema = new mongoose.Schema({
  base_price: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'],
    default: 'USD'
  },
  discount_price: {
    type: Number,
    min: 0,
    validate: {
      validator: function(v) {
        return !v || v < this.base_price;
      },
      message: 'Discount price must be less than base price'
    }
  },
  bulk_pricing: [bulkPricingSchema]
}, { _id: false });

const sustainabilitySchema = new mongoose.Schema({
  certifications: [{
    type: String,
    enum: [
      'Energy Star', 'USDA Organic', 'Fair Trade', 'LEED', 
      'FSC Certified', 'Cradle to Cradle', 'B Corp', 
      'Carbon Neutral', 'Rainforest Alliance', 'EPA Safer Choice'
    ]
  }],
  eco_rating: {
    type: Number,
    min: 1,
    max: 5,
    validate: {
      validator: Number.isInteger,
      message: 'Eco rating must be an integer between 1 and 5'
    }
  },
  carbon_footprint: {
    type: Number,
    min: 0,
    description: 'kg CO2 equivalent'
  },
  carbon_offset_included: {
    type: Boolean,
    default: false
  },
  recyclable: {
    type: Boolean,
    default: false
  },
  biodegradable: {
    type: Boolean,
    default: false
  },
  renewable_materials: {
    type: Boolean,
    default: false
  },
  local_sourced: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const inventorySchema = new mongoose.Schema({
  stock_quantity: {
    type: Number,
    required: true,
    min: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    uppercase: true
  },
  weight: {
    type: Number,
    min: 0,
    description: 'Weight in grams for shipping calculations'
  },
  dimensions: dimensionsSchema
}, { _id: false });

const shippingSchema = new mongoose.Schema({
  free_shipping_threshold: {
    type: Number,
    min: 0
  },
  shipping_cost: {
    type: Number,
    min: 0,
    default: 0
  },
  international_shipping: {
    type: Boolean,
    default: false
  },
  processing_time: {
    type: Number,
    min: 1,
    max: 30,
    description: 'Processing time in days'
  },
  carbon_neutral_shipping: {
    type: Boolean,
    default: false
  }
}, { _id: false });

const reviewsSchema = new mongoose.Schema({
  average_rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  total_reviews: {
    type: Number,
    min: 0,
    default: 0
  }
}, { _id: false });

const productSchema = new mongoose.Schema({
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Seller ID is required'],
    index: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    minlength: [3, 'Product name must be at least 3 characters'],
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['solar', 'reusable', 'zero_waste', 'local', 'organic', 'eco_fashion', 'green_tech'],
      message: 'Category must be one of: solar, reusable, zero_waste, local, organic, eco_fashion, green_tech'
    },
    index: true
  },
  subcategory: {
    type: String,
    trim: true,
    maxlength: [100, 'Subcategory cannot exceed 100 characters']
  },
  images: [{
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
      },
      message: 'Image must be a valid URL ending with .jpg, .jpeg, .png, .webp, or .gif'
    }
  }],
  pricing: {
    type: pricingSchema,
    required: true
  },
  sustainability: sustainabilitySchema,
  inventory: {
    type: inventorySchema,
    required: true
  },
  shipping: shippingSchema,
  reviews: {
    type: reviewsSchema,
    default: () => ({})
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true,
    maxlength: [50, 'Tag cannot exceed 50 characters']
  }],
  featured: {
    type: Boolean,
    default: false,
    index: true
  },
  status: {
    type: String,
    enum: {
      values: ['active', 'inactive', 'out_of_stock', 'discontinued'],
      message: 'Status must be one of: active, inactive, out_of_stock, discontinued'
    },
    default: 'active',
    index: true
  },
  created_at: {
    type: Date,
    default: Date.now,
    index: true
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ 'pricing.base_price': 1 });
productSchema.index({ 'sustainability.eco_rating': -1 });
productSchema.index({ created_at: -1 });

// Virtual for current price (considering discount)
productSchema.virtual('current_price').get(function() {
  return this.pricing.discount_price || this.pricing.base_price;
});

// Virtual for discount percentage
productSchema.virtual('discount_percentage').get(function() {
  if (!this.pricing.discount_price) return 0;
  return Math.round(((this.pricing.base_price - this.pricing.discount_price) / this.pricing.base_price) * 100);
});

// Virtual for availability status
productSchema.virtual('is_available').get(function() {
  return this.status === 'active' && this.inventory.stock_quantity > 0;
});

// Virtual for sustainability score (calculated from multiple factors)
productSchema.virtual('sustainability_score').get(function() {
  let score = 0;
  const sustainability = this.sustainability;
  
  if (sustainability.eco_rating) score += sustainability.eco_rating * 2;
  if (sustainability.certifications && sustainability.certifications.length > 0) score += sustainability.certifications.length;
  if (sustainability.carbon_offset_included) score += 3;
  if (sustainability.recyclable) score += 2;
  if (sustainability.biodegradable) score += 2;
  if (sustainability.renewable_materials) score += 2;
  if (sustainability.local_sourced) score += 3;
  
  return Math.min(score, 20); // Cap at 20
});

// Pre-save middleware to update timestamps and validate
productSchema.pre('save', function(next) {
  // Auto-generate SKU if not provided
  if (!this.sku && this.isNew) {
    const prefix = this.category.substring(0, 3).toUpperCase();
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 4).toUpperCase();
    this.inventory.sku = `${prefix}-${timestamp}-${random}`;
  }
  
  // Update status based on stock
  if (this.inventory.stock_quantity === 0 && this.status === 'active') {
    this.status = 'out_of_stock';
  } else if (this.inventory.stock_quantity > 0 && this.status === 'out_of_stock') {
    this.status = 'active';
  }
  
  // Validate images array
  if (!this.images || this.images.length === 0) {
    return next(new Error('At least one product image is required'));
  }
  
  // Validate bulk pricing
  if (this.pricing.bulk_pricing && this.pricing.bulk_pricing.length > 0) {
    const sortedBulk = this.pricing.bulk_pricing.sort((a, b) => a.min_quantity - b.min_quantity);
    for (let i = 0; i < sortedBulk.length - 1; i++) {
      if (sortedBulk[i].min_quantity >= sortedBulk[i + 1].min_quantity) {
        return next(new Error('Bulk pricing quantities must be in ascending order'));
      }
    }
  }
  
  next();
});

// Method to check if product is in stock
productSchema.methods.isInStock = function(quantity = 1) {
  return this.inventory.stock_quantity >= quantity && this.status === 'active';
};

// Method to get bulk price for quantity
productSchema.methods.getBulkPrice = function(quantity) {
  if (!this.pricing.bulk_pricing || this.pricing.bulk_pricing.length === 0) {
    return this.current_price;
  }
  
  let applicablePrice = this.current_price;
  
  for (const bulkTier of this.pricing.bulk_pricing) {
    if (quantity >= bulkTier.min_quantity) {
      applicablePrice = bulkTier.price;
    } else {
      break;
    }
  }
  
  return applicablePrice;
};

// Method to calculate total price with shipping
productSchema.methods.calculateTotalPrice = function(quantity, shippingAddress = null) {
  const unitPrice = this.getBulkPrice(quantity);
  const subtotal = unitPrice * quantity;
  
  let shippingCost = 0;
  if (this.shipping.free_shipping_threshold && subtotal < this.shipping.free_shipping_threshold) {
    shippingCost = this.shipping.shipping_cost || 0;
  }
  
  return {
    unit_price: unitPrice,
    subtotal,
    shipping_cost: shippingCost,
    total: subtotal + shippingCost,
    currency: this.pricing.currency
  };
};

// Method to reduce stock
productSchema.methods.reduceStock = function(quantity) {
  if (this.inventory.stock_quantity < quantity) {
    throw new Error('Insufficient stock');
  }
  this.inventory.stock_quantity -= quantity;
  return this.save();
};

// Static method to find products by sustainability criteria
productSchema.statics.findSustainable = function(criteria = {}) {
  const query = { status: 'active' };
  
  if (criteria.eco_rating) {
    query['sustainability.eco_rating'] = { $gte: criteria.eco_rating };
  }
  
  if (criteria.certifications) {
    query['sustainability.certifications'] = { $in: criteria.certifications };
  }
  
  if (criteria.carbon_neutral) {
    query['sustainability.carbon_offset_included'] = true;
  }
  
  if (criteria.local_only) {
    query['sustainability.local_sourced'] = true;
  }
  
  return this.find(query).populate('seller_id', 'name email');
};

// Static method for advanced search
productSchema.statics.searchProducts = function(searchOptions = {}) {
  const {
    query,
    category,
    minPrice,
    maxPrice,
    minRating,
    inStock = true,
    sortBy = 'created_at',
    sortOrder = -1,
    limit = 20,
    skip = 0
  } = searchOptions;
  
  const searchQuery = { status: 'active' };
  
  if (inStock) {
    searchQuery['inventory.stock_quantity'] = { $gt: 0 };
  }
  
  if (query) {
    searchQuery.$text = { $search: query };
  }
  
  if (category) {
    searchQuery.category = category;
  }
  
  if (minPrice || maxPrice) {
    searchQuery['pricing.base_price'] = {};
    if (minPrice) searchQuery['pricing.base_price'].$gte = minPrice;
    if (maxPrice) searchQuery['pricing.base_price'].$lte = maxPrice;
  }
  
  if (minRating) {
    searchQuery['reviews.average_rating'] = { $gte: minRating };
  }
  
  return this.find(searchQuery)
    .populate('seller_id', 'name email')
    .sort({ [sortBy]: sortOrder })
    .limit(limit)
    .skip(skip);
};

// Function to get Product model with marketplace database connection
const getProductModel = async () => {
  const marketplaceConnection = await getConnection('MARKETPLACE_DB');
  return marketplaceConnection.model('Product', productSchema);
};

// For synchronous usage (when connection is already established)
const Product = mongoose.model('Product', productSchema);

export { getProductModel };
export default Product;
