import mongoose from 'mongoose';
import { getConnection } from '../config/databases.js';

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Category name is required'],
    unique: true,
    trim: true,
    minlength: [2, 'Category name must be at least 2 characters'],
    maxlength: [50, 'Category name cannot exceed 50 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  parent_category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null
  },
  image: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+\.(jpg|jpeg|png|webp|gif)$/i.test(v);
      },
      message: 'Image must be a valid URL ending with .jpg, .jpeg, .png, .webp, or .gif'
    }
  },
  icon: {
    type: String,
    trim: true
  },
  sort_order: {
    type: Number,
    default: 0,
    min: 0
  },
  is_active: {
    type: Boolean,
    default: true,
    index: true
  },
  sustainability_focus: {
    type: Boolean,
    default: true // Since this is a green marketplace
  },
  
  // SEO fields
  seo: {
    meta_title: { type: String, maxlength: 60 },
    meta_description: { type: String, maxlength: 160 },
    keywords: [String]
  },
  
  // Analytics and metadata
  meta: {
    product_count: { type: Number, default: 0, min: 0 },
    featured_products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    avg_price_range: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 0 }
    },
    total_sales: { type: Number, default: 0 },
    last_updated: { type: Date, default: Date.now }
  },
  
  // Sustainability metrics for the category
  sustainability_metrics: {
    avg_eco_rating: { type: Number, default: 0, min: 0, max: 5 },
    carbon_neutral_products: { type: Number, default: 0 },
    local_products_count: { type: Number, default: 0 },
    certified_products_count: { type: Number, default: 0 }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
categorySchema.index({ name: 1 });
categorySchema.index({ slug: 1 });
categorySchema.index({ parent_category: 1 });
categorySchema.index({ is_active: 1, sort_order: 1 });
categorySchema.index({ sustainability_focus: 1 });

// Virtual for subcategories
categorySchema.virtual('subcategories', {
  ref: 'Category',
  localField: '_id',
  foreignField: 'parent_category'
});

// Virtual for full path (for breadcrumbs)
categorySchema.virtual('path').get(function() {
  // This would need to be populated or calculated
  return this.parent_category ? `${this.parent_category.name} > ${this.name}` : this.name;
});

// Pre-save middleware
categorySchema.pre('save', function(next) {
  // Auto-generate slug if not provided
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
  }
  
  // Update meta timestamp
  this.meta.last_updated = new Date();
  
  next();
});

// Instance methods
categorySchema.methods.updateProductCount = async function() {
  const Product = mongoose.model('Product');
  const count = await Product.countDocuments({ 
    category_id: this._id, 
    status: 'active' 
  });
  
  this.meta.product_count = count;
  return this.save();
};

categorySchema.methods.updateSustainabilityMetrics = async function() {
  const Product = mongoose.model('Product');
  
  // Aggregate sustainability data for this category
  const metrics = await Product.aggregate([
    { $match: { category_id: this._id, status: 'active' } },
    {
      $group: {
        _id: null,
        avgEcoRating: { $avg: '$sustainability.eco_rating' },
        carbonNeutralCount: {
          $sum: { $cond: ['$sustainability.carbon_offset_included', 1, 0] }
        },
        localProductsCount: {
          $sum: { $cond: ['$sustainability.local_sourced', 1, 0] }
        },
        certifiedProductsCount: {
          $sum: { $size: { $ifNull: ['$sustainability.certifications', []] } }
        }
      }
    }
  ]);

  if (metrics.length > 0) {
    const data = metrics[0];
    this.sustainability_metrics = {
      avg_eco_rating: Math.round(data.avgEcoRating * 10) / 10 || 0,
      carbon_neutral_products: data.carbonNeutralCount || 0,
      local_products_count: data.localProductsCount || 0,
      certified_products_count: data.certifiedProductsCount || 0
    };
  }
  
  return this.save();
};

// Static methods
categorySchema.statics.getMainCategories = function() {
  return this.find({ 
    parent_category: null, 
    is_active: true 
  })
  .sort({ sort_order: 1, name: 1 })
  .populate('subcategories');
};

categorySchema.statics.getCategoryTree = function() {
  return this.find({ is_active: true })
    .populate({
      path: 'subcategories',
      match: { is_active: true },
      options: { sort: { sort_order: 1, name: 1 } }
    })
    .sort({ sort_order: 1, name: 1 });
};

categorySchema.statics.findBySlug = function(slug) {
  return this.findOne({ slug, is_active: true })
    .populate('parent_category')
    .populate('subcategories');
};

categorySchema.statics.getSustainableCategories = function() {
  return this.find({ 
    sustainability_focus: true, 
    is_active: true 
  })
  .sort({ 'sustainability_metrics.avg_eco_rating': -1 });
};

// Get category model with marketplace database connection
const getCategoryModel = async () => {
  const marketplaceConnection = await getConnection('MARKETPLACE_DB');
  return marketplaceConnection.model('Category', categorySchema);
};

// For synchronous usage (when connection is already established)
const Category = mongoose.model('Category', categorySchema);

export { getCategoryModel };
export default Category;
