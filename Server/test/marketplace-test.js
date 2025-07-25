import dotenv from 'dotenv';
dotenv.config();

import { connectAllDatabases } from '../config/databases.js';
import Product from '../models/Product.model.js';
import Cart from '../models/Cart.model.js';
import Order from '../models/Order.model.js';
import User from '../models/User.model.js';

const testMarketplace = async () => {
  try {
    console.log('🛒 Testing Marketplace System...');
    
    // Connect to databases
    await connectAllDatabases();
    console.log('✅ Database connections established');
    
    // Create test user for orders/carts
    const testUser = await User.create({
      name: 'Marketplace Tester',
      email: 'marketplace@test.com',
      password: 'TestPassword123!'
    });
    console.log('✅ Test user created');
    
    // Clean up any existing test products
    await Product.deleteMany({ name: { $regex: /^Test Product/ } });
    await Cart.deleteMany({ userId: testUser._id });
    await Order.deleteMany({ userId: testUser._id });
    
    // Test Product creation
    const testProduct = {
      name: 'Test Product Eco-Friendly Widget',
      description: 'A sustainable widget made from recycled materials',
      category: 'Home & Garden',
      pricing: {
        basePrice: 29.99,
        currency: 'USD',
        discountPercentage: 10
      },
      inventory: {
        quantity: 100,
        lowStockThreshold: 10
      },
      sustainability: {
        carbonFootprint: 2.5,
        sustainabilityScore: 85,
        recyclable: true,
        certifications: ['Fair Trade', 'Organic']
      },
      shipping: {
        weight: 0.5,
        dimensions: {
          length: 10,
          width: 8,
          height: 5
        }
      },
      images: ['test-image1.jpg', 'test-image2.jpg'],
      tags: ['eco-friendly', 'sustainable', 'home']
    };
    
    const product = await Product.create(testProduct);
    console.log('✅ Product created successfully:', {
      id: product._id,
      name: product.name,
      currentPrice: product.currentPrice,
      sustainabilityScore: product.sustainability.sustainabilityScore
    });
    
    // Test product methods
    const bulkPrice = product.calculateBulkPrice(5);
    console.log('✅ Bulk price calculation:', bulkPrice);
    
    const inStock = product.isInStock();
    console.log('✅ Stock check:', inStock);
    
    // Update inventory
    await product.updateInventory(5);
    console.log('✅ Inventory updated, new quantity:', product.inventory.quantity);
    
    // Test Cart functionality
    const cart = await Cart.create({
      userId: testUser._id,
      items: [{
        productId: product._id,
        quantity: 3,
        priceAtTime: product.currentPrice
      }]
    });
    
    await cart.updateTotals();
    console.log('✅ Cart created with totals:', {
      itemCount: cart.totalItems,
      subtotal: cart.subtotal,
      total: cart.total,
      sustainabilityImpact: cart.sustainabilityImpact
    });
    
    // Test Order creation
    const order = await Order.create({
      userId: testUser._id,
      items: cart.items,
      shipping: {
        address: {
          street: '123 Green St',
          city: 'Eco City',
          state: 'CA',
          zipCode: '90210',
          country: 'USA'
        },
        method: 'ground',
        cost: 9.99
      },
      payment: {
        method: 'credit_card',
        amount: cart.total + 9.99
      }
    });
    
    await order.calculateTotals();
    console.log('✅ Order created:', {
      orderNumber: order.orderNumber,
      total: order.total,
      status: order.status,
      estimatedCarbonSaved: order.sustainabilityImpact.estimatedCarbonSaved
    });
    
    // Test order status update
    await order.updateStatus('processing', 'Order is being prepared');
    console.log('✅ Order status updated to processing');
    
    // Test product search and filtering
    const searchResults = await Product.find({
      $text: { $search: 'eco-friendly' }
    }).limit(5);
    console.log('✅ Text search results:', searchResults.length);
    
    const sustainableProducts = await Product.find({
      'sustainability.sustainabilityScore': { $gte: 80 }
    });
    console.log('✅ Sustainable products found:', sustainableProducts.length);
    
    // Clean up test data
    await Product.deleteOne({ _id: product._id });
    await Cart.deleteOne({ _id: cart._id });
    await Order.deleteOne({ _id: order._id });
    await User.deleteOne({ _id: testUser._id });
    console.log('🧹 Test data cleaned up');
    
    console.log('🎉 All marketplace tests passed!');
    
  } catch (error) {
    console.error('❌ Marketplace test failed:', error);
  } finally {
    process.exit(0);
  }
};

testMarketplace();
