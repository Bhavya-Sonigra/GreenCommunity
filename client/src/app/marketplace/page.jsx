"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { 
  Search, 
  Filter, 
  ShoppingCart, 
  Star, 
  Leaf, 
  Recycle, 
  Award,
  MapPin,
  Plus,
  Minus,
  Grid3X3,
  List
} from 'lucide-react';

const USD_TO_INR = 83;

const Marketplace = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [cartItems, setCartItems] = useState([]);

  const categories = [
    { value: 'all', label: 'All Products' },
    { value: 'personal-care', label: 'Personal Care' },
    { value: 'home-garden', label: 'Home & Garden' },
    { value: 'clothing', label: 'Sustainable Clothing' },
    { value: 'food-drink', label: 'Food & Drink' },
    { value: 'tech', label: 'Eco Tech' },
    { value: 'travel', label: 'Travel Essentials' },
  ];

  const products = [
    {
      id: 1,
      name: 'Bamboo Toothbrush Set',
      price: 24.99,
      originalPrice: 29.99,
      rating: 4.8,
      reviews: 156,
      image: '/marketplace/1.jpeg',
      category: 'personal-care',
      vendor: 'EcoLife',
      vendorType: 'Certified',
      tags: ['Plastic-Free', 'Biodegradable', 'Organic'],
      co2Saved: 0.5,
      description: 'Set of 4 bamboo toothbrushes with soft bristles',
      inStock: true,
      featured: true
    },
    {
      id: 2,
      name: 'Reusable Water Bottle',
      price: 34.99,
      rating: 4.9,
      reviews: 298,
      image: '/marketplace/2.jpeg',
      category: 'personal-care',
      vendor: 'HydroGreen',
      vendorType: 'Local',
      tags: ['BPA-Free', 'Recycled Steel', 'Lifetime Warranty'],
      co2Saved: 2.1,
      description: 'Insulated stainless steel water bottle, 32oz',
      inStock: true,
      featured: false
    },
    {
      id: 3,
      name: 'Organic Cotton Tote Bag',
      price: 18.99,
      rating: 4.7,
      reviews: 87,
      image: '/marketplace/3.jpeg',
      category: 'clothing',
      vendor: 'FairTrade Co',
      vendorType: 'Nonprofit',
      tags: ['Fair Trade', 'Organic Cotton', 'Reusable'],
      co2Saved: 1.2,
      description: 'Durable organic cotton shopping bag',
      inStock: true,
      featured: true
    },
    {
      id: 4,
      name: 'Solar Power Bank',
      price: 49.99,
      originalPrice: 64.99,
      rating: 4.6,
      reviews: 134,
      image: '/marketplace/4.jpeg',
      category: 'tech',
      vendor: 'SolarTech',
      vendorType: 'Certified',
      tags: ['Solar Powered', 'Waterproof', '10000mAh'],
      co2Saved: 3.8,
      description: 'Portable solar charger with wireless charging',
      inStock: false,
      featured: false
    },
    {
      id: 5,
      name: 'Compost Bin Kit',
      price: 89.99,
      rating: 4.9,
      reviews: 203,
      image: '/marketplace/5.jpeg',
      category: 'home-garden',
      vendor: 'Garden Green',
      vendorType: 'Local',
      tags: ['Composting', 'Recycled Materials', 'Easy Setup'],
      co2Saved: 12.5,
      description: 'Complete home composting system',
      inStock: true,
      featured: true
    },
    {
      id: 6,
      name: 'Beeswax Food Wraps',
      price: 22.99,
      rating: 4.8,
      reviews: 167,
      image: '/marketplace/6.jpeg',
      category: 'food-drink',
      vendor: 'BeePure',
      vendorType: 'Certified',
      tags: ['Plastic-Free', 'Reusable', 'Natural Beeswax'],
      co2Saved: 0.8,
      description: 'Set of 6 reusable food storage wraps',
      inStock: true,
      featured: false
    }
  ];

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalCartValue = () => {
    return cartItems.reduce((total, item) => total + (item.price * USD_TO_INR * item.quantity), 0);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-background to-accent/5 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Eco Marketplace</h1>
          <p className="text-muted-foreground">Discover sustainable products that make a difference</p>
        </div>
        
        {/* Cart */}
        <Sheet>
          <SheetTrigger asChild>
            <Button className="relative bg-gradient-primary hover:shadow-medium">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart
              {getTotalCartItems() > 0 && (
                <Badge className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 flex items-center justify-center bg-success text-white">
                  {getTotalCartItems()}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Shopping Cart</SheetTitle>
              <SheetDescription>
                {getTotalCartItems()} items • ₹{getTotalCartValue().toFixed(2)}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              {cartItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Your cart is empty</p>
              ) : (
                <>
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border border-border/50 rounded-lg">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.name}</div>
                        <div className="text-muted-foreground text-xs">₹{(item.price * USD_TO_INR).toFixed(2)}</div>
                      </div>
                      <div className="text-sm">Qty: {item.quantity}</div>
                    </div>
                  ))}
                  <Button className="w-full btn-hero mt-6">
                    Proceed to Checkout
                  </Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search eco-friendly products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        : "space-y-4"
      }>
        {filteredProducts.map(product => (
          <Card key={product.id} className={`card-gradient hover-lift ${viewMode === 'list' ? 'flex-row' : ''}`}>
            {product.featured && (
              <Badge className="absolute top-3 left-3 z-10 bg-success text-white">
                Featured
              </Badge>
            )}
            
            <div className={viewMode === 'list' ? 'w-48 shrink-0' : ''}>
              <div className="relative aspect-square overflow-hidden rounded-t-lg">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {!product.inStock && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <Badge variant="secondary">Out of Stock</Badge>
                  </div>
                )}
              </div>
            </div>

            <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
              <div className="space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground leading-tight">{product.name}</h3>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-foreground">₹{(product.price * USD_TO_INR).toFixed(2)}</div>
                      {product.originalPrice && (
                        <div className="text-sm text-muted-foreground line-through">
                          ₹{(product.originalPrice * USD_TO_INR).toFixed(2)}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">({product.reviews})</span>
                  
                  <Badge variant="outline" className="ml-auto">
                    {product.vendorType}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1">
                  {product.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {product.tags.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{product.tags.length - 2}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="flex items-center gap-1 text-success">
                    <Leaf className="h-4 w-4" />
                    <span className="text-sm font-medium">-{product.co2Saved}kg CO₂</span>
                  </div>
                  
                  <Button 
                    size="sm" 
                    onClick={() => addToCart(product)}
                    disabled={!product.inStock}
                    className="bg-gradient-primary hover:shadow-medium"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg">No products found</div>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default Marketplace;