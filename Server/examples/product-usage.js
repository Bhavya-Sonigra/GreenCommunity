import { getProductModel } from '../models/Product.model.js';

// Example: How to use Product model with marketplace database
async function createProduct() {
  try {
    // Get the Product model connected to marketplace database
    const Product = await getProductModel();
    
    // Create a sample product
    const sampleProduct = new Product({
      seller_id: "60d21b4667d0d8992e610c85", // Replace with actual seller ID
      name: "Eco-Friendly Solar Panel Kit",
      description: "High-efficiency solar panel kit perfect for home use. Reduces carbon footprint by up to 80% compared to traditional energy sources.",
      category: "solar",
      subcategory: "home solar systems",
      images: [
        "https://example.com/solar-panel-1.jpg",
        "https://example.com/solar-panel-2.jpg"
      ],
      pricing: {
        base_price: 299.99,
        currency: "USD",
        discount_price: 249.99,
        bulk_pricing: [
          { min_quantity: 5, price: 229.99 },
          { min_quantity: 10, price: 209.99 }
        ]
      },
      sustainability: {
        certifications: ["Energy Star", "Carbon Neutral"],
        eco_rating: 5,
        carbon_footprint: 0.1,
        carbon_offset_included: true,
        recyclable: true,
        renewable_materials: true,
        local_sourced: false
      },
      inventory: {
        stock_quantity: 100,
        weight: 2500, // grams
        dimensions: {
          length: 65,
          width: 35,
          height: 5,
          unit: "cm"
        }
      },
      shipping: {
        free_shipping_threshold: 200,
        shipping_cost: 25.99,
        international_shipping: true,
        processing_time: 3,
        carbon_neutral_shipping: true
      },
      tags: ["solar", "renewable", "eco-friendly", "energy-efficient"],
      featured: true,
      status: "active"
    });
    
    const savedProduct = await sampleProduct.save();
    console.log('Product created successfully:', savedProduct);
    
    return savedProduct;
  } catch (error) {
    console.error('Error creating product:', error);
  }
}

// Example: Search sustainable products
async function searchSustainableProducts() {
  try {
    const Product = await getProductModel();
    
    const sustainableProducts = await Product.findSustainable({
      eco_rating: 4,
      certifications: ['Energy Star', 'USDA Organic'],
      carbon_neutral: true
    });
    
    console.log('Sustainable products found:', sustainableProducts.length);
    return sustainableProducts;
  } catch (error) {
    console.error('Error searching products:', error);
  }
}

// Example: Advanced product search
async function advancedSearch() {
  try {
    const Product = await getProductModel();
    
    const searchResults = await Product.searchProducts({
      query: 'solar panel',
      category: 'solar',
      minPrice: 100,
      maxPrice: 500,
      minRating: 4,
      inStock: true,
      sortBy: 'sustainability_score',
      sortOrder: -1,
      limit: 10
    });
    
    console.log('Search results:', searchResults);
    return searchResults;
  } catch (error) {
    console.error('Error in advanced search:', error);
  }
}

export {
  createProduct,
  searchSustainableProducts,
  advancedSearch
};
