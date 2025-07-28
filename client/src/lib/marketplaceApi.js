import { apiRequest } from './api';

// Category mapping from backend to client format
const CATEGORY_MAPPING = {
  'solar': 'tech',
  'reusable': 'personal-care',
  'zero_waste': 'home-garden',
  'local': 'food-drink',
  'organic': 'food-drink',
  'eco_fashion': 'clothing',
  'green_tech': 'tech'
};

// Reverse mapping for filtering
const CLIENT_TO_BACKEND_CATEGORIES = {
  'personal-care': ['reusable'],
  'home-garden': ['zero_waste'],
  'clothing': ['eco_fashion'],
  'food-drink': ['local', 'organic'],
  'tech': ['solar', 'green_tech'],
  'travel': [] // This category doesn't exist in backend yet
};

// Transform backend product to client format
const transformProduct = (backendProduct) => {
  const seller = backendProduct.seller_id;
  
  // Calculate CO2 saved from carbon footprint (if available)
  const co2Saved = backendProduct.sustainability?.carbon_footprint 
    ? Math.max(0, 5 - backendProduct.sustainability.carbon_footprint) // Estimate savings
    : Math.random() * 5; // Fallback to random for demo

  // Determine vendor type based on certifications
  let vendorType = 'Local';
  if (backendProduct.sustainability?.certifications?.length > 2) {
    vendorType = 'Certified';
  } else if (backendProduct.sustainability?.certifications?.includes('B Corp')) {
    vendorType = 'Nonprofit';
  }

  return {
    id: backendProduct._id,
    name: backendProduct.name,
    price: backendProduct.pricing.discount_price || backendProduct.pricing.base_price,
    originalPrice: backendProduct.pricing.discount_price ? backendProduct.pricing.base_price : null,
    rating: backendProduct.reviews?.average_rating || 4.5,
    reviews: backendProduct.reviews?.total_reviews || Math.floor(Math.random() * 300) + 50,
    image: backendProduct.images?.[0] || '/marketplace/default.jpeg',
    category: CATEGORY_MAPPING[backendProduct.category] || 'tech',
    vendor: seller?.name || 'EcoStore',
    vendorType,
    tags: backendProduct.tags?.map(tag => tag.charAt(0).toUpperCase() + tag.slice(1)) || 
          backendProduct.sustainability?.certifications || ['Eco-Friendly'],
    co2Saved: parseFloat(co2Saved.toFixed(1)),
    description: backendProduct.description,
    inStock: backendProduct.is_available !== false && backendProduct.inventory?.stock_quantity > 0,
    featured: backendProduct.featured || false,
    // Keep original backend data for detailed operations
    _original: backendProduct
  };
};

// Marketplace API service
export const marketplaceApi = {
  // Get all products with filtering
  async getProducts(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      // Transform client filters to backend format
      if (filters.category && filters.category !== 'all') {
        const backendCategories = CLIENT_TO_BACKEND_CATEGORIES[filters.category];
        if (backendCategories && backendCategories.length > 0) {
          // For now, just use the first matching category
          params.append('category', backendCategories[0]);
        }
      }
      
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      if (filters.minPrice) {
        params.append('minPrice', filters.minPrice);
      }
      
      if (filters.maxPrice) {
        params.append('maxPrice', filters.maxPrice);
      }
      
      if (filters.minRating) {
        params.append('minRating', filters.minRating);
      }
      
      if (filters.featured) {
        params.append('featured', 'true');
      }
      
      if (filters.inStock !== false) {
        params.append('inStock', 'true');
      }
      
      // Set defaults
      params.append('page', filters.page || 1);
      params.append('limit', filters.limit || 20);
      params.append('sortBy', filters.sortBy || 'created_at');
      params.append('sortOrder', filters.sortOrder || 'desc');
      
      const response = await apiRequest(`/marketplace/products?${params.toString()}`);
      
      return {
        ...response,
        data: {
          ...response.data,
          products: response.data.products.map(transformProduct)
        }
      };
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get single product by ID
  async getProductById(id) {
    try {
      const response = await apiRequest(`/marketplace/products/${id}`);
      return {
        ...response,
        data: transformProduct(response.data)
      };
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Get featured products
  async getFeaturedProducts(limit = 8) {
    try {
      const response = await apiRequest(`/marketplace/featured?limit=${limit}`);
      return {
        ...response,
        data: response.data.map(transformProduct)
      };
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },

  // Get categories with product counts
  async getCategories() {
    try {
      const response = await apiRequest('/marketplace/categories');
      
      // Transform backend categories to client format
      const clientCategories = [
        { value: 'all', label: 'All Products', count: 0 }
      ];
      
      let totalCount = 0;
      const categoryMap = {};
      
      // Group backend categories by client categories
      response.data.forEach(backendCat => {
        const clientCategory = CATEGORY_MAPPING[backendCat._id];
        if (clientCategory) {
          if (!categoryMap[clientCategory]) {
            categoryMap[clientCategory] = { count: 0, subcategories: [] };
          }
          categoryMap[clientCategory].count += backendCat.count;
          categoryMap[clientCategory].subcategories.push(...backendCat.subcategories);
          totalCount += backendCat.count;
        }
      });
      
      // Convert to client format
      const categoryLabels = {
        'personal-care': 'Personal Care',
        'home-garden': 'Home & Garden',
        'clothing': 'Sustainable Clothing',
        'food-drink': 'Food & Drink',
        'tech': 'Eco Tech',
        'travel': 'Travel Essentials'
      };
      
      Object.entries(categoryMap).forEach(([key, data]) => {
        clientCategories.push({
          value: key,
          label: categoryLabels[key] || key,
          count: data.count
        });
      });
      
      clientCategories[0].count = totalCount;
      
      return {
        ...response,
        data: clientCategories
      };
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Search products
  async searchProducts(searchOptions) {
    try {
      const response = await apiRequest('/marketplace/search', {
        method: 'POST',
        body: JSON.stringify(searchOptions)
      });
      
      return {
        ...response,
        data: response.data.map(transformProduct)
      };
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },

  // Get sustainable products
  async getSustainableProducts(criteria = {}) {
    try {
      const params = new URLSearchParams();
      
      Object.entries(criteria).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, value);
        }
      });
      
      const response = await apiRequest(`/marketplace/sustainable?${params.toString()}`);
      
      return {
        ...response,
        data: response.data.map(transformProduct)
      };
    } catch (error) {
      console.error('Error fetching sustainable products:', error);
      throw error;
    }
  }
};

export default marketplaceApi;
