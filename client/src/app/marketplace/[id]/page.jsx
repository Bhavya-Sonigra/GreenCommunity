"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Star, 
  Leaf, 
  Recycle, 
  Award,
  MapPin,
  Plus,
  Minus,
  Truck,
  Shield,
  Heart,
  Share2,
  CheckCircle
} from 'lucide-react';

const USD_TO_INR = 83;

// Product data (same as marketplace)
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
    featured: true,
    detailedDescription: 'Our premium bamboo toothbrush set includes 4 eco-friendly toothbrushes made from sustainable bamboo. Each brush features soft, BPA-free bristles that are gentle on gums while effectively cleaning teeth. The bamboo handle is naturally antibacterial and biodegradable, making it the perfect sustainable alternative to plastic toothbrushes.',
    specifications: {
      'Material': 'Bamboo handle, BPA-free bristles',
      'Quantity': '4 toothbrushes per set',
      'Bristle Type': 'Soft',
      'Handle Length': '18cm',
      'Certification': 'FSC Certified Bamboo',
      'Packaging': '100% Recycled Cardboard'
    },
    benefits: [
      'Reduces plastic waste',
      'Biodegradable and compostable',
      'Naturally antibacterial',
      'Gentle on gums',
      'FSC certified sustainable bamboo'
    ],
    shipping: {
      'Standard': '3-5 business days',
      'Express': '1-2 business days',
      'Free Shipping': 'Orders over ₹2000'
    }
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
    featured: false,
    detailedDescription: 'Stay hydrated while saving the planet with our premium insulated stainless steel water bottle. This 32oz bottle keeps drinks cold for up to 24 hours and hot for up to 12 hours. Made from food-grade 18/8 stainless steel with a BPA-free lid, it\'s perfect for daily use, gym sessions, or outdoor adventures.',
    specifications: {
      'Capacity': '32oz (946ml)',
      'Material': '18/8 Stainless Steel',
      'Insulation': 'Double-wall vacuum insulation',
      'Lid Type': 'BPA-free screw cap',
      'Dimensions': '10.5" x 3.5"',
      'Weight': '450g'
    },
    benefits: [
      'Eliminates single-use plastic bottles',
      'Keeps drinks cold for 24 hours',
      'Keeps drinks hot for 12 hours',
      'Lifetime warranty',
      'Made from recycled materials'
    ],
    shipping: {
      'Standard': '3-5 business days',
      'Express': '1-2 business days',
      'Free Shipping': 'Orders over ₹2000'
    }
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
    featured: true,
    detailedDescription: 'Make a sustainable choice with our organic cotton tote bag. Made from 100% certified organic cotton, this durable shopping bag is perfect for groceries, library books, or everyday use. The reinforced handles and spacious interior make it both practical and environmentally friendly.',
    specifications: {
      'Material': '100% Organic Cotton',
      'Dimensions': '16" x 14" x 4"',
      'Weight Capacity': 'Up to 20 lbs',
      'Certification': 'GOTS Certified',
      'Care': 'Machine washable',
      'Origin': 'Fair Trade Certified'
    },
    benefits: [
      'Replaces single-use plastic bags',
      'Supports fair trade practices',
      'Made from organic materials',
      'Durable and long-lasting',
      'Supports local communities'
    ],
    shipping: {
      'Standard': '3-5 business days',
      'Express': '1-2 business days',
      'Free Shipping': 'Orders over ₹2000'
    }
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
    tags: ['Solar Powered', 'Fast Charging', 'Waterproof'],
    co2Saved: 3.5,
    description: 'Portable solar charger with 10000mAh capacity',
    inStock: true,
    featured: false,
    detailedDescription: 'Never run out of power with our solar-powered portable charger. This 10000mAh power bank features a built-in solar panel for eco-friendly charging and includes fast-charging technology. Perfect for outdoor adventures, camping trips, or emergency situations.',
    specifications: {
      'Capacity': '10000mAh',
      'Solar Panel': 'Built-in 2W solar panel',
      'Output': '5V/2.1A',
      'Input': 'Micro USB, USB-C',
      'Charging Time': '6-8 hours (solar), 3-4 hours (USB)',
      'Waterproof': 'IPX4 rating'
    },
    benefits: [
      'Renewable solar charging',
      'Reduces reliance on grid power',
      'Emergency backup power',
      'Portable and lightweight',
      'Waterproof for outdoor use'
    ],
    shipping: {
      'Standard': '3-5 business days',
      'Express': '1-2 business days',
      'Free Shipping': 'Orders over ₹2000'
    }
  },
  {
    id: 5,
    name: 'Beeswax Food Wraps',
    price: 22.99,
    rating: 4.5,
    reviews: 203,
    image: '/marketplace/5.jpeg',
    category: 'food-drink',
    vendor: 'BeeNatural',
    vendorType: 'Local',
    tags: ['Beeswax', 'Reusable', 'Plastic-Free'],
    co2Saved: 0.8,
    description: 'Set of 6 reusable beeswax food wraps',
    inStock: true,
    featured: true,
    detailedDescription: 'Keep your food fresh while reducing plastic waste with our natural beeswax food wraps. Made from organic cotton infused with beeswax, jojoba oil, and tree resin, these wraps are a sustainable alternative to plastic cling film. They\'re reusable, washable, and biodegradable.',
    specifications: {
      'Material': 'Organic cotton with beeswax',
      'Set Contents': '6 wraps (various sizes)',
      'Sizes': 'Small, Medium, Large',
      'Care': 'Hand wash with cold water',
      'Lifespan': '6-12 months with proper care',
      'Certification': 'Organic cotton certified'
    },
    benefits: [
      'Replaces plastic cling film',
      'Natural and biodegradable',
      'Reusable and washable',
      'Keeps food fresh longer',
      'Supports local beekeepers'
    ],
    shipping: {
      'Standard': '3-5 business days',
      'Express': '1-2 business days',
      'Free Shipping': 'Orders over ₹2000'
    }
  },
  {
    id: 6,
    name: 'Bamboo Cutlery Set',
    price: 15.99,
    rating: 4.4,
    reviews: 89,
    image: '/marketplace/6.jpeg',
    category: 'food-drink',
    vendor: 'EcoUtensils',
    vendorType: 'Certified',
    tags: ['Bamboo', 'Travel-Friendly', 'Compostable'],
    co2Saved: 1.0,
    description: 'Portable bamboo cutlery set with carrying case',
    inStock: true,
    featured: false,
    detailedDescription: 'Ditch disposable plastic cutlery with our portable bamboo cutlery set. This travel-friendly set includes a fork, knife, spoon, and chopsticks, all made from sustainable bamboo. The included carrying case keeps your utensils clean and organized.',
    specifications: {
      'Material': 'Bamboo',
      'Set Contents': 'Fork, Knife, Spoon, Chopsticks',
      'Case': 'Included carrying case',
      'Length': '7.5 inches',
      'Weight': 'Lightweight',
      'Care': 'Hand wash with mild soap'
    },
    benefits: [
      'Eliminates single-use plastic cutlery',
      'Lightweight and portable',
      'Durable and long-lasting',
      'Compostable at end of life',
      'Perfect for travel and picnics'
    ],
    shipping: {
      'Standard': '3-5 business days',
      'Express': '1-2 business days',
      'Free Shipping': 'Orders over ₹2000'
    }
  }
];

const ProductDetail = () => {
  const params = useParams();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const productId = parseInt(params.id);
  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/marketplace')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Marketplace
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (quantity <= 0) {
      return; // Don't add to cart if quantity is 0 or less
    }
    
    setIsAddingToCart(true);
    // Simulate API call
    setTimeout(() => {
      setIsAddingToCart(false);
      // Here you would typically add to cart state management
      console.log(`Added ${quantity} ${product.name} to cart`);
    }, 1000);
  };

  const images = [product.image]; // In a real app, you'd have multiple images

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/marketplace')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Marketplace
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Heart className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg border">
              <img 
                src={images[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/marketplace/1.jpeg'; // Fallback
                }}
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square w-20 overflow-hidden rounded-lg border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-border'
                    }`}
                  >
                    <img 
                      src={image} 
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {product.category.replace('-', ' ').toUpperCase()}
                </Badge>
                {product.featured && (
                  <Badge className="bg-primary text-primary-foreground text-xs">
                    Featured
                  </Badge>
                )}
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                {product.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-muted-foreground">({product.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <Leaf className="h-4 w-4" />
                  <span className="text-sm">Saves {product.co2Saved}kg CO₂</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-foreground">
                    ₹{(product.price * USD_TO_INR).toFixed(0)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      ₹{(product.originalPrice * USD_TO_INR).toFixed(0)}
                    </span>
                  )}
                </div>
                {product.originalPrice && (
                  <Badge className="bg-green-100 text-green-800">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </Badge>
                )}
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.detailedDescription}
              </p>
            </div>

            {/* Tags */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Features</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Quantity</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(Math.max(0, quantity - 1))}
                    className="h-10 w-10"
                    disabled={quantity <= 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="px-4 py-2 min-w-[60px] text-center font-medium">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="flex-1 btn-hero"
                onClick={handleAddToCart}
                disabled={!product.inStock || isAddingToCart || quantity <= 0}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {isAddingToCart ? 'Adding...' : quantity <= 0 ? 'Select Quantity' : 'Add to Cart'}
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                disabled={quantity <= 0}
              >
                Buy Now
              </Button>
            </div>

            {/* Vendor Info */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Vendor Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Vendor</span>
                  <span className="font-medium">{product.vendor}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Type</span>
                  <Badge variant="outline" className="text-xs">
                    {product.vendorType}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 space-y-8">
          {/* Specifications */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Specifications</h2>
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-border/30 last:border-b-0">
                      <span className="text-sm text-muted-foreground">{key}</span>
                      <span className="text-sm font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Benefits */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Environmental Benefits</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {product.benefits.map((benefit, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </div>
                      <span className="text-sm font-medium">{benefit}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Shipping */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Shipping Information</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {Object.entries(product.shipping).map(([type, info]) => (
                    <div key={type} className="flex items-center justify-between py-2 border-b border-border/30 last:border-b-0">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{type}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{info}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* More Products */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">More Products You Might Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {products
                .filter(p => p.id !== product.id) // Exclude current product
                .slice(0, 4) // Show only 4 products
                .map((relatedProduct) => (
                  <Card 
                    key={relatedProduct.id} 
                    className="cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => router.push(`/marketplace/${relatedProduct.id}`)}
                  >
                    <div className="relative">
                      <div className="aspect-square overflow-hidden rounded-t-lg">
                        <img
                          src={relatedProduct.image}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = '/marketplace/1.jpeg'; // Fallback
                          }}
                        />
                      </div>
                      {relatedProduct.featured && (
                        <Badge className="absolute top-2 left-2 bg-success text-white text-xs">
                          Featured
                        </Badge>
                      )}
                      {!relatedProduct.inStock && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                          <Badge variant="secondary">Out of Stock</Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div>
                          <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">
                            {relatedProduct.name}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                            {relatedProduct.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs font-medium">{relatedProduct.rating}</span>
                          </div>
                          <span className="font-bold text-foreground text-sm">
                            ₹{(relatedProduct.price * USD_TO_INR).toFixed(0)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-green-600">
                            <Leaf className="h-3 w-3" />
                            <span className="text-xs">-{relatedProduct.co2Saved}kg CO₂</span>
                          </div>
                          <Button 
                            size="sm" 
                            className="btn-hero text-xs px-2 py-1"
                            onClick={(e) => {
                              e.stopPropagation();
                              // Add to cart logic here
                              console.log(`Added ${relatedProduct.name} to cart`);
                            }}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 