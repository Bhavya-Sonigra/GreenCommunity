"use client";

import { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
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
import { useRouter } from 'next/navigation';

const USD_TO_INR = 83;

// Shared data and logic
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
price: 150, // ₹150 (based on Indian marketplace pricing)
    originalPrice: 399, // ₹399 
    rating: 4.8,
    reviews: 156,
    image: '/marketplace/1.jpeg',
    category: 'personal-care',
    vendor: 'EcoLife India',
    vendorType: 'Certified',
    tags: ['Plastic-Free', 'Biodegradable', 'Organic'],
    co2Saved: 0.5,
    description: 'Set of 4 bamboo toothbrushes with soft bristles',
    inStock: true,
    featured: true
  },
  {
    id: 2,
    name: 'Reusable Steel Water Bottle',
price: 350, // ₹350 (based on Indian marketplace pricing)
    rating: 4.9,
    reviews: 298,
    image: '/marketplace/2.jpeg',
    category: 'personal-care',
    vendor: 'HydroGreen',
    vendorType: 'Local',
    tags: ['BPA-Free', 'Recycled Steel', 'Lifetime Warranty'],
    co2Saved: 2.1,
    description: 'Insulated stainless steel water bottle, 1L capacity',
    inStock: true,
    featured: false
  },
  {
    id: 3,
    name: 'Organic Cotton Tote Bag',
price: 200, // ₹200 (based on Indian marketplace pricing)
    rating: 4.7,
    reviews: 87,
    image: '/marketplace/3.jpeg',
    category: 'clothing',
    vendor: 'FairTrade India',
    vendorType: 'Nonprofit',
    tags: ['Fair Trade', 'Organic Cotton', 'Reusable'],
    co2Saved: 1.2,
    description: 'Durable organic cotton shopping bag',
    inStock: true,
    featured: true
  },
  {
    id: 4,
    name: 'Solar Power Bank 10000mAh',
price: 700, // ₹700 (based on Indian marketplace pricing)
    originalPrice: 1699, // ₹1699
    rating: 4.6,
    reviews: 134,
    image: '/marketplace/4.jpeg',
    category: 'tech',
    vendor: 'SolarTech India',
    vendorType: 'Certified',
    tags: ['Solar Powered', 'Waterproof', '10000mAh'],
    co2Saved: 3.8,
    description: 'Portable solar charger with wireless charging capability',
    inStock: false,
    featured: false
  },
  {
    id: 5,
    name: 'Home Compost Bin Kit',
price: 950, // ₹950 (based on Indian marketplace pricing)
    rating: 4.9,
    reviews: 203,
    image: '/marketplace/5.jpeg',
    category: 'home-garden',
    vendor: 'Garden Green',
    vendorType: 'Local',
    tags: ['Composting', 'Recycled Materials', 'Easy Setup'],
    co2Saved: 12.5,
    description: 'Complete home composting system with instructions',
    inStock: true,
    featured: true
  },
  {
    id: 6,
    name: 'Beeswax Food Wraps',
price: 220, // ₹220 (based on Indian marketplace pricing)
    rating: 4.8,
    reviews: 167,
    image: '/marketplace/6.jpeg',
    category: 'food-drink',
    vendor: 'BeePure India',
    vendorType: 'Certified',
    tags: ['Plastic-Free', 'Reusable', 'Natural Beeswax'],
    co2Saved: 0.8,
    description: 'Set of 6 reusable food storage wraps made from natural beeswax',
    inStock: true,
    featured: false
  }
];

function MobileMarketplaceView({ 
  cartItems, 
  addToCart, 
  removeFromCart,
  updateCartItemQuantity,
  getTotalCartItems, 
  getTotalCartValue 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const router = useRouter();

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleProductClick = (productId) => {
    router.push(`/marketplace/${productId}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart
    addToCart(product);
  };

  return (
    <div className="p-3 sm:p-4 space-y-3 sm:space-y-4 bg-gradient-to-b from-background to-accent/5 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        {/* Heading and description instead of logo */}
        <div className="flex flex-col flex-1">
          <h1 className="text-base sm:text-lg font-bold text-foreground leading-tight">Eco Marketplace</h1>
          <span className="text-xs text-muted-foreground">Discover sustainable products that make a difference</span>
        </div>
        {/* Cart */}
        <Sheet>
          <SheetTrigger asChild>
            <Button className="relative bg-gradient-primary text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2">
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              Cart
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Cart</SheetTitle>
              <SheetDescription>
                {getTotalCartItems()} items • ₹{getTotalCartValue().toFixed(2)}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-4 space-y-2">
              {cartItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Your cart is empty</p>
              ) : (
                <>
                  {cartItems.map(item => (
                    <div key={item.id} className="flex items-center gap-2 p-2 border border-border/50 rounded-lg">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded" />
                      <div className="flex-1">
                        <div className="font-medium text-xs">{item.name}</div>
                        <div className="text-muted-foreground text-xs">₹{item.price}</div>
                      </div>
                      <div className="text-xs">Qty: {item.quantity}</div>
                    </div>
                  ))}
                  <Button className="w-full btn-hero mt-4">Checkout</Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      {/* Search and Filters */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-xs sm:text-sm"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full text-xs">
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
      </div>
      {/* Products List */}
      <div className="flex flex-col gap-2 sm:gap-3">
        {filteredProducts.map(product => (
          <Card 
            key={product.id} 
            className="relative flex flex-row gap-2 items-center p-2 sm:p-3 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleProductClick(product.id)}
          >
            {product.featured && (
              <Badge className="absolute top-1 sm:top-2 left-1 sm:left-2 z-10 bg-success text-white text-[10px] sm:text-xs">Featured</Badge>
            )}
            <img src={product.image} alt={product.name} className="w-14 h-14 sm:w-16 sm:h-16 object-cover rounded" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-xs text-foreground leading-tight">{product.name}</h3>
                        <span className="font-bold text-xs text-foreground">₹{product.price}</span>
              </div>
              <p className="text-xs text-muted-foreground line-clamp-2">{product.description}</p>
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{product.rating}</span>
                <span className="text-xs text-muted-foreground">({product.reviews})</span>
              </div>
              <div className="flex gap-1 flex-wrap">
                {product.tags.slice(0, 1).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
                ))}
                {product.tags.length > 1 && (
                  <Badge variant="secondary" className="text-[10px]">+{product.tags.length - 1}</Badge>
                )}
              </div>
            </div>
            <Button 
              size="icon" 
              onClick={(e) => handleAddToCart(e, product)} 
              disabled={!product.inStock} 
              className="ml-2 bg-gradient-primary hover:bg-green-700 hover:shadow-lg p-1 sm:p-2"
            >
              <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </Card>
        ))}
        {filteredProducts.length === 0 && (
          <div className="text-center py-6 sm:py-8">
            <div className="text-muted-foreground text-sm sm:text-base">No products found</div>
            <p className="text-muted-foreground text-xs">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

function TabletMarketplaceView({
  cartItems,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  getTotalCartItems,
  getTotalCartValue
}) {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const router = useRouter();

  // Use props for cart totals, only declare filteredProducts here
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleProductClick = (productId) => {
    router.push(`/marketplace/${productId}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart
    addToCart(product);
  };

  return (
    <div className="p-3 sm:p-4 space-y-4 sm:space-y-5 bg-gradient-to-b from-background to-accent/5 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-foreground">Eco Marketplace</h1>
          <p className="text-muted-foreground text-xs sm:text-sm">Discover sustainable products</p>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="relative bg-gradient-primary text-xs sm:text-sm px-3 sm:px-4 py-2">
              <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
              Cart
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
                        <div className="text-muted-foreground text-xs">₹{item.price}</div>
                      </div>
                      <div className="text-sm">Qty: {item.quantity}</div>
                    </div>
                  ))}
                  <Button className="w-full btn-hero mt-6">Checkout</Button>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search eco-friendly products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-sm"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48 text-sm">
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
      </div>
      {/* Products Grid */}
      <div className={viewMode === 'grid'
        ? 'grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'
        : 'space-y-3 sm:space-y-4'}>
        {filteredProducts.map(product => (
          <Card 
            key={product.id} 
            className={`card-gradient hover-lift cursor-pointer ${viewMode === 'list' ? 'flex-row' : ''}`}
            onClick={() => handleProductClick(product.id)}
          >
            
            <div className={viewMode === 'list' ? 'w-32 shrink-0' : ''}>
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
            <CardContent className={`p-3 ${viewMode === 'list' ? 'flex-1' : ''}`}>
              <div className="space-y-2">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-foreground leading-tight text-sm sm:text-base">{product.name}</h3>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-foreground text-sm sm:text-base">₹{product.price}</div>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1">{product.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs sm:text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-xs sm:text-sm text-muted-foreground">({product.reviews})</span>
                  <Badge variant="outline" className="ml-auto text-xs">
                    {product.vendorType}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {product.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="secondary" className="text-[10px] sm:text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {product.tags.length > 2 && (
                    <Badge variant="secondary" className="text-[10px] sm:text-xs">
                      +{product.tags.length - 2}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-1 text-success">
                    <Leaf className="h-4 w-4" />
                    <span className="text-sm font-medium">-{product.co2Saved}kg CO₂</span>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={(e) => handleAddToCart(e, product)} 
                    disabled={!product.inStock}
                    className="btn-hero text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <div className="text-muted-foreground text-base">No products found</div>
            <p className="text-muted-foreground text-xs">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

function DesktopMarketplaceView({
  cartItems,
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
  getTotalCartItems,
  getTotalCartValue
}) {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const router = useRouter();

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleProductClick = (productId) => {
    router.push(`/marketplace/${productId}`);
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation(); // Prevent navigation when clicking add to cart
    addToCart(product);
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-background to-accent/5 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          {/* Add 'Featured' label above heading */}
          <h1 className="text-3xl font-bold text-gradient">Eco Marketplace</h1>
          <p className="text-muted-foreground">Discover sustainable products that make a difference</p>
        </div>
        {/* Cart */}
        <Sheet>
          <SheetTrigger asChild>
            <Button className="relative bg-gradient-primary">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Cart
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
                        <div className="text-muted-foreground text-xs">₹{item.price}</div>
                      </div>
                      <div className="text-sm">Qty: {item.quantity}</div>
                    </div>
                  ))}
                  <Button className="w-full btn-hero mt-6" onClick={() => router.push('/payment')}>
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
      </div>
      {/* Products Grid */}
      <div className={viewMode === 'grid'
        ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
        : 'space-y-4'}>
        {filteredProducts.map(product => (
          <Card 
            key={product.id} 
            className={`card-gradient hover-lift cursor-pointer ${viewMode === 'list' ? 'flex-row' : ''}`}
            onClick={() => handleProductClick(product.id)}
          >
            {product.featured && (
              <Badge className="absolute top-3 left-3 z-10 bg-success text-white">Featured</Badge>
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
                      <div className="font-bold text-foreground">₹{product.price}</div>
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
                <div className="flex items-center justify-between gap-2 mt-2">
                  <div className="flex items-center gap-1 text-success">
                    <Leaf className="h-4 w-4" />
                    <span className="text-sm font-medium">-{product.co2Saved}kg CO₂</span>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={(e) => handleAddToCart(e, product)} 
                    disabled={!product.inStock}
                    className="btn-hero"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-lg">No products found</div>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

const Marketplace = () => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 });
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const getTotalCartItems = () => cartItems.reduce((total, item) => total + item.quantity, 0);
  const getTotalCartValue = () => cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const updateCartItemQuantity = (productId, quantity) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const cartProps = {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    getTotalCartItems,
    getTotalCartValue
  };

  if (isMobile) {
    return <MobileMarketplaceView {...cartProps} />;
  }
  if (isTablet) {
    return <TabletMarketplaceView {...cartProps} />;
  }
  return <DesktopMarketplaceView {...cartProps} />;
};
export default Marketplace;
