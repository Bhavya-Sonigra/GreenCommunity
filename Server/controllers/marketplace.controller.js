import asyncHandler from '../utils/asyncHandler.js';
import { getProductModel } from '../models/Product.model.js';
import User from '../models/User.model.js';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';

// Get all products with filtering, sorting, and pagination
export const getProducts = asyncHandler(async (req, res) => {
  const Product = await getProductModel();
  
  const {
    page = 1,
    limit = 20,
    category,
    subcategory,
    minPrice,
    maxPrice,
    minRating,
    sortBy = 'created_at',
    sortOrder = 'desc',
    search,
    featured,
    inStock = true,
    ecoRating,
    certifications,
    localOnly,
    carbonNeutral
  } = req.query;

  // Build filter query
  const filter = { status: 'active' };

  if (inStock === 'true') {
    filter['inventory.stock_quantity'] = { $gt: 0 };
  }

  if (category) {
    filter.category = category;
  }

  if (subcategory) {
    filter.subcategory = { $regex: subcategory, $options: 'i' };
  }

  if (minPrice || maxPrice) {
    filter['pricing.base_price'] = {};
    if (minPrice) filter['pricing.base_price'].$gte = parseFloat(minPrice);
    if (maxPrice) filter['pricing.base_price'].$lte = parseFloat(maxPrice);
  }

  if (minRating) {
    filter['reviews.average_rating'] = { $gte: parseFloat(minRating) };
  }

  if (featured === 'true') {
    filter.featured = true;
  }

  if (ecoRating) {
    filter['sustainability.eco_rating'] = { $gte: parseInt(ecoRating) };
  }

  if (certifications) {
    const certArray = certifications.split(',');
    filter['sustainability.certifications'] = { $in: certArray };
  }

  if (localOnly === 'true') {
    filter['sustainability.local_sourced'] = true;
  }

  if (carbonNeutral === 'true') {
    filter['sustainability.carbon_offset_included'] = true;
  }

  if (search) {
    filter.$text = { $search: search };
  }

  // Sort options
  const sortOptions = {};
  const order = sortOrder === 'desc' ? -1 : 1;
  
  switch (sortBy) {
    case 'price':
      sortOptions['pricing.base_price'] = order;
      break;
    case 'rating':
      sortOptions['reviews.average_rating'] = order;
      break;
    case 'sustainability':
      sortOptions['sustainability.eco_rating'] = order;
      break;
    case 'name':
      sortOptions.name = order;
      break;
    default:
      sortOptions.created_at = order;
  }

  // Pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const [products, totalProducts] = await Promise.all([
    Product.find(filter)
      .populate('seller_id', 'name email')
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Product.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(totalProducts / limitNum);

  res.status(200).json({
    success: true,
    data: {
      products,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalProducts,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    }
  });
});

// Get single product by ID
export const getProductById = asyncHandler(async (req, res) => {
  const Product = await getProductModel();
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid product ID'
    });
  }

  const product = await Product.findById(id)
    .populate('seller_id', 'name email createdAt')
    .lean();

  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  res.status(200).json({
    success: true,
    data: product
  });
});

// Create new product (sellers only)
export const createProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const Product = await getProductModel();
  
  const productData = {
    ...req.body,
    seller_id: req.user.id
  };

  const product = new Product(productData);
  const savedProduct = await product.save();

  const populatedProduct = await Product.findById(savedProduct._id)
    .populate('seller_id', 'name email');

  res.status(201).json({
    success: true,
    message: 'Product created successfully',
    data: populatedProduct
  });
});

// Update product (seller or admin only)
export const updateProduct = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const Product = await getProductModel();
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid product ID'
    });
  }

  const product = await Product.findById(id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Check if user is seller or admin
  if (product.seller_id.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this product'
    });
  }

  const updatedProduct = await Product.findByIdAndUpdate(
    id,
    { ...req.body, updated_at: Date.now() },
    { new: true, runValidators: true }
  ).populate('seller_id', 'name email');

  res.status(200).json({
    success: true,
    message: 'Product updated successfully',
    data: updatedProduct
  });
});

// Delete product (seller or admin only)
export const deleteProduct = asyncHandler(async (req, res) => {
  const Product = await getProductModel();
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid product ID'
    });
  }

  const product = await Product.findById(id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Check if user is seller or admin
  if (product.seller_id.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this product'
    });
  }

  await Product.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: 'Product deleted successfully'
  });
});

// Get products by seller
export const getSellerProducts = asyncHandler(async (req, res) => {
  const Product = await getProductModel();
  const sellerId = req.params.sellerId || req.user.id;
  
  const {
    page = 1,
    limit = 20,
    status = 'all'
  } = req.query;

  const filter = { seller_id: sellerId };
  
  if (status !== 'all') {
    filter.status = status;
  }

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const [products, totalProducts] = await Promise.all([
    Product.find(filter)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Product.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(totalProducts / limitNum);

  res.status(200).json({
    success: true,
    data: {
      products,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalProducts,
        hasNextPage: pageNum < totalPages,
        hasPrevPage: pageNum > 1
      }
    }
  });
});

// Update product stock
export const updateStock = asyncHandler(async (req, res) => {
  const Product = await getProductModel();
  const { id } = req.params;
  const { quantity, operation = 'set' } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid product ID'
    });
  }

  const product = await Product.findById(id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  // Check if user is seller or admin
  if (product.seller_id.toString() !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update stock'
    });
  }

  let newQuantity;
  switch (operation) {
    case 'add':
      newQuantity = product.inventory.stock_quantity + quantity;
      break;
    case 'subtract':
      newQuantity = Math.max(0, product.inventory.stock_quantity - quantity);
      break;
    default:
      newQuantity = quantity;
  }

  product.inventory.stock_quantity = newQuantity;
  await product.save();

  res.status(200).json({
    success: true,
    message: 'Stock updated successfully',
    data: {
      productId: product._id,
      previousStock: product.inventory.stock_quantity,
      newStock: newQuantity
    }
  });
});

// Get featured products
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const Product = await getProductModel();
  const { limit = 8 } = req.query;

  const products = await Product.find({
    featured: true,
    status: 'active',
    'inventory.stock_quantity': { $gt: 0 }
  })
  .populate('seller_id', 'name')
  .sort({ created_at: -1 })
  .limit(parseInt(limit))
  .lean();

  res.status(200).json({
    success: true,
    data: products
  });
});

// Get categories with product counts
export const getCategories = asyncHandler(async (req, res) => {
  const Product = await getProductModel();
  
  const categories = await Product.aggregate([
    { $match: { status: 'active' } },
    { $group: { 
      _id: '$category', 
      count: { $sum: 1 },
      subcategories: { $addToSet: '$subcategory' }
    }},
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    success: true,
    data: categories
  });
});

// Search products with advanced filters
export const searchProducts = asyncHandler(async (req, res) => {
  const Product = await getProductModel();
  const searchOptions = req.body;

  const products = await Product.searchProducts(searchOptions);

  res.status(200).json({
    success: true,
    data: products
  });
});

// Get sustainable products
export const getSustainableProducts = asyncHandler(async (req, res) => {
  const Product = await getProductModel();
  const criteria = req.query;

  const products = await Product.findSustainable(criteria);

  res.status(200).json({
    success: true,
    data: products
  });
});

// Toggle featured status (admin only)
export const toggleFeatured = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  const Product = await getProductModel();
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid product ID'
    });
  }

  const product = await Product.findById(id);
  
  if (!product) {
    return res.status(404).json({
      success: false,
      message: 'Product not found'
    });
  }

  product.featured = !product.featured;
  await product.save();

  res.status(200).json({
    success: true,
    message: `Product ${product.featured ? 'featured' : 'unfeatured'} successfully`,
    data: { featured: product.featured }
  });
});

// Get marketplace statistics (admin only)
export const getMarketplaceStats = asyncHandler(async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  const Product = await getProductModel();

  const stats = await Promise.all([
    Product.countDocuments({ status: 'active' }),
    Product.countDocuments({ status: 'inactive' }),
    Product.countDocuments({ status: 'out_of_stock' }),
    Product.countDocuments({ featured: true }),
    Product.aggregate([
      { $group: { _id: null, totalValue: { $sum: '$pricing.base_price' } } }
    ]),
    Product.aggregate([
      { $group: { _id: '$seller_id', productCount: { $sum: 1 } } },
      { $group: { _id: null, totalSellers: { $sum: 1 } } }
    ])
  ]);

  res.status(200).json({
    success: true,
    data: {
      activeProducts: stats[0],
      inactiveProducts: stats[1],
      outOfStockProducts: stats[2],
      featuredProducts: stats[3],
      totalInventoryValue: stats[4][0]?.totalValue || 0,
      totalSellers: stats[5][0]?.totalSellers || 0
    }
  });
});
