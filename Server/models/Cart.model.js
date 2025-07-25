import mongoose from 'mongoose';
import { getConnection } from '../config/databases.js';

const cartItemSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    max: 100
  },
  price_at_time: {
    type: Number,
    required: true,
    min: 0
  },
  added_at: {
    type: Date,
    default: Date.now
  }
}, { _id: true });

const cartSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  items: [cartItemSchema],
  total_items: {
    type: Number,
    default: 0,
    min: 0
  },
  total_amount: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'INR'],
    default: 'USD'
  },
  last_updated: {
    type: Date,
    default: Date.now
  },
  expires_at: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    index: { expireAfterSeconds: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
cartSchema.index({ user_id: 1 });
cartSchema.index({ 'items.product_id': 1 });
cartSchema.index({ last_updated: -1 });

// Virtual for cart summary
cartSchema.virtual('summary').get(function() {
  return {
    itemCount: this.total_items,
    totalAmount: this.total_amount,
    currency: this.currency,
    isEmpty: this.total_items === 0
  };
});

// Pre-save middleware to calculate totals
cartSchema.pre('save', function(next) {
  this.total_items = this.items.reduce((sum, item) => sum + item.quantity, 0);
  this.total_amount = this.items.reduce((sum, item) => sum + (item.price_at_time * item.quantity), 0);
  this.last_updated = new Date();
  
  // Update expiration
  this.expires_at = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  
  next();
});

// Instance methods
cartSchema.methods.addItem = async function(productId, quantity, price) {
  const existingItemIndex = this.items.findIndex(
    item => item.product_id.toString() === productId.toString()
  );

  if (existingItemIndex > -1) {
    // Update existing item
    this.items[existingItemIndex].quantity += quantity;
    this.items[existingItemIndex].price_at_time = price; // Update to current price
    this.items[existingItemIndex].added_at = new Date();
  } else {
    // Add new item
    this.items.push({
      product_id: productId,
      quantity,
      price_at_time: price,
      added_at: new Date()
    });
  }
  
  return this.save();
};

cartSchema.methods.removeItem = async function(productId) {
  this.items = this.items.filter(
    item => item.product_id.toString() !== productId.toString()
  );
  
  return this.save();
};

cartSchema.methods.updateItemQuantity = async function(productId, quantity) {
  const item = this.items.find(
    item => item.product_id.toString() === productId.toString()
  );
  
  if (item) {
    if (quantity <= 0) {
      return this.removeItem(productId);
    }
    
    item.quantity = quantity;
    item.added_at = new Date();
    return this.save();
  }
  
  throw new Error('Item not found in cart');
};

cartSchema.methods.clear = async function() {
  this.items = [];
  return this.save();
};

cartSchema.methods.getItemCount = function() {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
};

cartSchema.methods.getTotalAmount = function() {
  return this.items.reduce((sum, item) => sum + (item.price_at_time * item.quantity), 0);
};

// Static methods
cartSchema.statics.findByUserId = function(userId) {
  return this.findOne({ user_id: userId })
    .populate({
      path: 'items.product_id',
      select: 'name images pricing.base_price pricing.discount_price inventory.stock_quantity status'
    });
};

cartSchema.statics.createForUser = function(userId) {
  return this.create({
    user_id: userId,
    items: [],
    total_items: 0,
    total_amount: 0
  });
};

// Clean up expired carts (utility method)
cartSchema.statics.cleanupExpiredCarts = function() {
  return this.deleteMany({
    expires_at: { $lt: new Date() }
  });
};

// Get cart model with marketplace database connection
const getCartModel = async () => {
  const marketplaceConnection = await getConnection('MARKETPLACE_DB');
  return marketplaceConnection.model('Cart', cartSchema);
};

// For synchronous usage (when connection is already established)
const Cart = mongoose.model('Cart', cartSchema);

export { getCartModel };
export default Cart;
