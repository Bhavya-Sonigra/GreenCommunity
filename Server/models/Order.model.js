import mongoose from 'mongoose';
import { getConnection } from '../config/databases.js';

const shippingAddressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 100
  },
  city: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  state: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  zipCode: {
    type: String,
    required: true,
    trim: true,
    match: /^\d{5}(-\d{4})?$/
  },
  country: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50
  }
}, { _id: false });

const orderItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  product_snapshot: {
    images: [String],
    category: String,
    sustainability: {
      eco_rating: Number,
      certifications: [String],
      carbon_footprint: Number,
      carbon_offset_included: Boolean
    }
  }
}, { _id: true });

const paymentSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['credit_card', 'debit_card', 'paypal', 'stripe', 'bank_transfer'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transaction_id: String,
  payment_intent_id: String,
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'],
    default: 'USD'
  },
  processed_at: Date,
  failure_reason: String
}, { _id: false });

const trackingSchema = new mongoose.Schema({
  carrier: String,
  tracking_number: String,
  tracking_url: String,
  status: {
    type: String,
    enum: ['pending', 'shipped', 'in_transit', 'delivered', 'returned'],
    default: 'pending'
  },
  shipped_at: Date,
  delivered_at: Date,
  estimated_delivery: Date
}, { _id: false });

const orderSchema = new mongoose.Schema({
  order_number: {
    type: String,
    unique: true,
    required: true
  },
  buyer_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  items: [orderItemSchema],
  order_status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending',
    index: true
  },
  payment: paymentSchema,
  shipping_address: {
    type: shippingAddressSchema,
    required: true
  },
  billing_address: shippingAddressSchema,
  shipping: {
    method: {
      type: String,
      enum: ['standard', 'expedited', 'overnight', 'pickup'],
      default: 'standard'
    },
    cost: {
      type: Number,
      min: 0,
      default: 0
    },
    carbon_neutral: {
      type: Boolean,
      default: false
    },
    tracking: trackingSchema
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      min: 0
    },
    shipping_cost: {
      type: Number,
      min: 0,
      default: 0
    },
    tax_amount: {
      type: Number,
      min: 0,
      default: 0
    },
    discount_amount: {
      type: Number,
      min: 0,
      default: 0
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'],
      default: 'USD'
    }
  },
  sustainability_impact: {
    total_carbon_offset: {
      type: Number,
      min: 0,
      default: 0
    },
    eco_products_count: {
      type: Number,
      min: 0,
      default: 0
    },
    sustainability_score: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    }
  },
  notes: {
    customer_notes: String,
    internal_notes: String
  },
  created_at: {
    type: Date,
    default: Date.now,
    index: true
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  cancelled_at: Date,
  delivered_at: Date
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
orderSchema.index({ buyer_id: 1, created_at: -1 });
orderSchema.index({ 'items.seller_id': 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ 'shipping.tracking.status': 1 });
orderSchema.index({ created_at: -1 });

// Virtual for order summary
orderSchema.virtual('summary').get(function() {
  return {
    orderNumber: this.order_number,
    status: this.order_status,
    itemCount: this.items.reduce((sum, item) => sum + item.quantity, 0),
    total: this.pricing.total,
    currency: this.pricing.currency,
    createdAt: this.created_at
  };
});

// Virtual for delivery status
orderSchema.virtual('delivery_status').get(function() {
  if (this.order_status === 'delivered') return 'delivered';
  if (this.order_status === 'shipped') return 'in_transit';
  if (this.order_status === 'processing') return 'preparing';
  if (this.order_status === 'confirmed') return 'confirmed';
  return 'pending';
});

// Pre-save middleware
orderSchema.pre('save', function(next) {
  if (this.isNew) {
    // Generate order number if not provided
    if (!this.order_number) {
      const timestamp = Date.now().toString();
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      this.order_number = `GC-${timestamp.slice(-8)}-${random}`;
    }

    // Calculate sustainability impact
    this.calculateSustainabilityImpact();
  }
  
  this.updated_at = new Date();
  next();
});

// Instance methods
orderSchema.methods.calculateSustainabilityImpact = function() {
  let totalCarbonOffset = 0;
  let ecoProductsCount = 0;
  let totalSustainabilityScore = 0;

  this.items.forEach(item => {
    if (item.product_snapshot?.sustainability) {
      const sustainability = item.product_snapshot.sustainability;
      
      if (sustainability.carbon_offset_included) {
        totalCarbonOffset += (sustainability.carbon_footprint || 0) * item.quantity;
      }
      
      if (sustainability.eco_rating >= 4) {
        ecoProductsCount += item.quantity;
      }
      
      totalSustainabilityScore += (sustainability.eco_rating || 0) * item.quantity;
    }
  });

  this.sustainability_impact = {
    total_carbon_offset: totalCarbonOffset,
    eco_products_count: ecoProductsCount,
    sustainability_score: Math.min(totalSustainabilityScore / this.items.length, 100)
  };
};

orderSchema.methods.updateStatus = async function(newStatus) {
  const validTransitions = {
    'pending': ['confirmed', 'cancelled'],
    'confirmed': ['processing', 'cancelled'],
    'processing': ['shipped', 'cancelled'],
    'shipped': ['delivered', 'returned'],
    'delivered': ['returned'],
    'cancelled': [],
    'returned': []
  };

  if (!validTransitions[this.order_status].includes(newStatus)) {
    throw new Error(`Cannot transition from ${this.order_status} to ${newStatus}`);
  }

  this.order_status = newStatus;
  
  if (newStatus === 'cancelled') {
    this.cancelled_at = new Date();
  } else if (newStatus === 'delivered') {
    this.delivered_at = new Date();
    this.shipping.tracking.status = 'delivered';
    this.shipping.tracking.delivered_at = new Date();
  }
  
  return this.save();
};

orderSchema.methods.updatePaymentStatus = async function(status, transactionId = null) {
  this.payment.status = status;
  this.payment.processed_at = new Date();
  
  if (transactionId) {
    this.payment.transaction_id = transactionId;
  }
  
  if (status === 'completed' && this.order_status === 'pending') {
    this.order_status = 'confirmed';
  }
  
  return this.save();
};

orderSchema.methods.addTracking = async function(trackingData) {
  this.shipping.tracking = {
    ...this.shipping.tracking.toObject(),
    ...trackingData,
    status: 'shipped'
  };
  
  if (this.order_status === 'processing') {
    this.order_status = 'shipped';
  }
  
  return this.save();
};

orderSchema.methods.calculateTotals = function() {
  const subtotal = this.items.reduce((sum, item) => sum + item.total, 0);
  
  this.pricing.subtotal = subtotal;
  this.pricing.total = subtotal + this.pricing.shipping_cost + this.pricing.tax_amount - this.pricing.discount_amount;
  
  return this.pricing.total;
};

// Static methods
orderSchema.statics.findByBuyer = function(buyerId, options = {}) {
  const {
    page = 1,
    limit = 10,
    status,
    sortBy = 'created_at',
    sortOrder = -1
  } = options;

  const filter = { buyer_id: buyerId };
  if (status) filter.order_status = status;

  const skip = (page - 1) * limit;
  
  return this.find(filter)
    .populate('items.product_id', 'name images')
    .populate('items.seller_id', 'name email')
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);
};

orderSchema.statics.findBySeller = function(sellerId, options = {}) {
  const {
    page = 1,
    limit = 10,
    status,
    sortBy = 'created_at',
    sortOrder = -1
  } = options;

  const filter = { 'items.seller_id': sellerId };
  if (status) filter.order_status = status;

  const skip = (page - 1) * limit;
  
  return this.find(filter)
    .populate('buyer_id', 'name email')
    .populate('items.product_id', 'name images')
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(limit);
};

orderSchema.statics.getOrderStats = function(sellerId = null) {
  const matchStage = sellerId 
    ? { $match: { 'items.seller_id': mongoose.Types.ObjectId(sellerId) } }
    : { $match: {} };

  return this.aggregate([
    matchStage,
    {
      $group: {
        _id: '$order_status',
        count: { $sum: 1 },
        totalValue: { $sum: '$pricing.total' }
      }
    }
  ]);
};

orderSchema.statics.generateOrderNumber = function() {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `GC-${timestamp.slice(-8)}-${random}`;
};

// Get order model with marketplace database connection
const getOrderModel = async () => {
  const marketplaceConnection = await getConnection('MARKETPLACE_DB');
  return marketplaceConnection.model('Order', orderSchema);
};

// For synchronous usage (when connection is already established)
const Order = mongoose.model('Order', orderSchema);

export { getOrderModel };
export default Order;
