"use client";

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';
import { 
  CreditCard,
  Smartphone,
  ArrowLeft,
  Lock,
  Shield,
  CheckCircle,
  Heart,
  Trees,
  Award,
  Calculator,
  Leaf,
  Globe,
  Zap,
  Star,
  QrCode,
  Copy,
  Download
} from 'lucide-react';

const Payment = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const projectId = searchParams.get('project');
  const projectName = searchParams.get('name') || 'Climate Project';
  const co2PerDollar = parseFloat(searchParams.get('co2Rate') || '2.5');
  
  const [contributionAmount, setContributionAmount] = useState([50]); // in USD
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const qrCanvasRef = useRef(null);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  const [billingInfo, setBillingInfo] = useState({
    email: '',
    address: '',
    city: '',
    country: '',
    zipCode: ''
  });

  const calculateImpact = (amount) => {
    return (amount * co2PerDollar).toFixed(1);
  };

  const calculateTrees = (amount) => {
    // Rough estimate: 1 tree absorbs ~48 lbs CO2 per year (0.02 tons)
    const co2Tons = amount * co2PerDollar;
    return Math.round(co2Tons / 0.02);
  };

  const USD_TO_INR = 83;
  const processingFee = Math.round(contributionAmount[0] * 0.029 + 0.3); // in USD
  const totalAmountUSD = contributionAmount[0] + processingFee;
  const totalAmountINR = Math.round(totalAmountUSD * USD_TO_INR);

  // Always use this UPI ID for QR code and UPI string generation
  const UPI_ID = 'kanoptl1999-1@oksbi';

  const generateUPIString = () => {
    const amount = contributionAmount[0] * USD_TO_INR;
    const note = `Contribution to ${projectName}`;
    return `upi://pay?pa=${UPI_ID}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
  };

  // Generate QR Code
  const generateQRCode = async () => {
    try {
      const upiString = generateUPIString();
      const qrDataUrl = await QRCode.toDataURL(upiString, {
        width: 300,
        margin: 2,
        color: {
          dark: '#22c55e',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  useEffect(() => {
    if (paymentMethod === 'upi') {
      generateQRCode();
    }
  }, [paymentMethod, contributionAmount]);

  const downloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a');
      link.download = `climate-payment-qr-${contributionAmount[0]}.png`;
      link.href = qrCodeUrl;
      link.click();
    }
  };

  const copyUPIString = () => {
    const upiString = generateUPIString();
    navigator.clipboard.writeText(upiString);
    toast.success("UPI String Copied! You can paste this in any UPI app to make payment.");
  };

  const handlePayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(`Payment Successful! 🌱 Thank you for contributing $${contributionAmount[0]} to ${projectName}. You've helped offset ${calculateImpact(contributionAmount[0])} tons of CO₂!`);
      
      // Navigate back to projects with success message
      router.push('/projects?payment=success');
    } catch (error) {
      toast.error("There was an issue processing your payment. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard, description: 'Visa, Mastercard, American Express', color: 'from-blue-500 to-purple-600' },
    { id: 'upi', name: 'UPI Payment', icon: Smartphone, description: 'Google Pay, PhonePe, Paytm, BHIM', color: 'from-green-500 to-emerald-600' },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-gray-900 dark:via-emerald-900/20 dark:to-gray-900 p-0 overflow-x-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-60 right-20 w-48 h-48 bg-emerald-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 left-1/3 w-24 h-24 bg-teal-200/40 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      <div className="max-w-full px-3 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center space-y-2 sm:space-y-4">
          <Button variant="ghost" onClick={() => router.back()} className="absolute left-0 top-0 text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1 sm:py-2 bg-green-100 dark:bg-green-900/30 rounded-full">
            <Leaf className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            <span className="text-xs sm:text-sm font-medium text-green-700 dark:text-green-300">Climate Action Payment</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Complete Your Impact
          </h1>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of climate warriors supporting <span className="font-semibold text-green-600">{projectName}</span> 
            and help create a sustainable future for our planet
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-3 space-y-3 sm:space-y-6">
            {/* Contribution Amount */}
            

            {/* Payment Method */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-xl">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                    <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3 sm:space-y-4">
                  {paymentMethods.map(method => {
                    const Icon = method.icon;
                    return (
                      <div 
                        key={method.id} 
                        className={`relative p-3 sm:p-4 border-2 rounded-xl transition-all duration-300 cursor-pointer hover:shadow-lg ${
                          paymentMethod === method.id 
                            ? 'border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 shadow-lg scale-105' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
                        }`}
                        onClick={() => setPaymentMethod(method.id)}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-4">
                          <RadioGroupItem value={method.id} id={method.id} className="border-2" />
                          <div className={`p-2 sm:p-3 rounded-lg bg-gradient-to-r ${method.color}`}>
                            <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <Label htmlFor={method.id} className="font-semibold text-sm sm:text-lg cursor-pointer">
                              {method.name}
                            </Label>
                            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{method.description}</p>
                          </div>
                          {paymentMethod === method.id && (
                            <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-green-500" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Card Details (if card payment selected) */}
            {paymentMethod === 'card' && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    Card Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
                  <div>
                    <Label htmlFor="cardName" className="text-xs sm:text-sm font-medium">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                      className="mt-2 h-10 sm:h-12 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cardNumber" className="text-xs sm:text-sm font-medium">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                      className="mt-2 h-10 sm:h-12 text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:gap-4">
                    <div>
                      <Label htmlFor="expiry" className="text-xs sm:text-sm font-medium">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                        className="mt-2 h-10 sm:h-12 text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvc" className="text-xs sm:text-sm font-medium">CVC</Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                        value={cardDetails.cvc}
                        onChange={(e) => setCardDetails({...cardDetails, cvc: e.target.value})}
                        className="mt-2 h-10 sm:h-12 text-sm"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* UPI Details (if UPI payment selected) */}
            {paymentMethod === 'upi' && (
              <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                    <div className="p-1.5 sm:p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                      <Smartphone className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    UPI Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 p-3 sm:p-6">
                  {/* QR Code Section */}
                  <div className="text-center space-y-3 sm:space-y-4">
                    <div className="flex justify-center">
                      <Button
                        onClick={() => setShowQR(!showQR)}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl flex items-center gap-2 sm:gap-3 shadow-lg text-xs sm:text-sm"
                      >
                        <QrCode className="h-4 w-4 sm:h-5 sm:w-5" />
                        {showQR ? 'Hide' : 'Show'} QR Code
                      </Button>
                    </div>
                    
                    {showQR && qrCodeUrl && (
                      <div className="bg-white p-3 sm:p-6 rounded-2xl shadow-lg border-2 border-green-200 inline-block">
                        <div className="space-y-3 sm:space-y-4">
                          <img 
                            src={qrCodeUrl} 
                            alt="UPI Payment QR Code" 
                            className="w-48 h-48 sm:w-64 sm:h-64 mx-auto"
                          />
                          <div className="text-center space-y-1 sm:space-y-2">
                            <p className="text-xs sm:text-sm font-medium text-gray-700">
                              Scan with any UPI app to pay ₹{contributionAmount[0] * USD_TO_INR}
                            </p>
                            <p className="text-[10px] sm:text-xs text-green-700 font-semibold">UPI ID: {UPI_ID}</p>
                            <div className="flex justify-center gap-1 sm:gap-2">
                              <Button
                                onClick={copyUPIString}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1 sm:gap-2 text-xs"
                              >
                                <Copy className="h-3 w-3 sm:h-4 sm:w-4" />
                                Copy UPI Link
                              </Button>
                              <Button
                                onClick={downloadQR}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1 sm:gap-2 text-xs"
                              >
                                <Download className="h-3 w-3 sm:h-4 sm:w-4" />
                                Download QR
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <Separator className="my-6" />

                  {/* Manual UPI Entry */}
                  <div>
                    <Label htmlFor="upiId" className="text-xs sm:text-sm font-medium">Enter UPI ID Manually</Label>
                    <Input
                      id="upiId"
                      placeholder="yourname@paytm / yourname@gpay"
                      className="mt-2 h-10 sm:h-12 text-sm"
                    />
                    <p className="text-[10px] sm:text-xs text-muted-foreground mt-2">
                      Or scan the QR code above with your UPI app
                    </p>
                  </div>
                  
                  {/* UPI Apps */}
                  <div className="space-y-2 sm:space-y-3">
                    <Label className="text-xs sm:text-sm font-medium">Popular UPI Apps</Label>
                    <div className="grid grid-cols-2 gap-2 sm:gap-3">
                      {[
                        { name: 'Google Pay', color: 'from-blue-500 to-blue-600' },
                        { name: 'PhonePe', color: 'from-purple-500 to-purple-600' },
                        { name: 'Paytm', color: 'from-blue-600 to-indigo-600' },
                        { name: 'BHIM', color: 'from-orange-500 to-red-500' }
                      ].map(app => (
                        <Button 
                          key={app.name} 
                          variant="outline" 
                          className={`h-10 sm:h-12 bg-gradient-to-r ${app.color} text-white border-0 hover:opacity-90 transition-opacity text-xs sm:text-sm`}
                        >
                          {app.name}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Billing Information */}
            <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-base sm:text-lg">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-r from-gray-500 to-slate-500 rounded-lg">
                    <Globe className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  Billing Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6">
                <div>
                  <Label htmlFor="email" className="text-xs sm:text-sm font-medium">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={billingInfo.email}
                    onChange={(e) => setBillingInfo({...billingInfo, email: e.target.value})}
                    className="mt-2 h-10 sm:h-12 text-sm"
                  />
                </div>
                <div>
                  <Label htmlFor="address" className="text-xs sm:text-sm font-medium">Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street"
                    value={billingInfo.address}
                    onChange={(e) => setBillingInfo({...billingInfo, address: e.target.value})}
                    className="mt-2 h-10 sm:h-12 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <Label htmlFor="city" className="text-xs sm:text-sm font-medium">City</Label>
                    <Input
                      id="city"
                      placeholder="San Francisco"
                      value={billingInfo.city}
                      onChange={(e) => setBillingInfo({...billingInfo, city: e.target.value})}
                      className="mt-2 h-10 sm:h-12 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode" className="text-xs sm:text-sm font-medium">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      placeholder="94102"
                      value={billingInfo.zipCode}
                      onChange={(e) => setBillingInfo({...billingInfo, zipCode: e.target.value})}
                      className="mt-2 h-10 sm:h-12 text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Order Summary */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-6">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-900/30 dark:to-green-900/20 sticky top-6 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-400/20 to-transparent rounded-full blur-2xl"></div>
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-lg sm:text-2xl">
                  <div className="p-2 sm:p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl">
                    <Heart className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  Your Climate Impact
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  See the real difference you're making
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 relative p-3 sm:p-6">
                {/* Impact Metrics */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="relative p-4 sm:p-6 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl text-white overflow-hidden">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full blur-xl"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span className="text-xs sm:text-sm font-medium">CO₂ Offset</span>
                        </div>
                        <Star className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div className="text-xl sm:text-3xl font-bold">
                        {calculateImpact(contributionAmount[0])} tons
                      </div>
                      <div className="text-emerald-100 text-xs sm:text-sm">
                        Removed from atmosphere
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative p-4 sm:p-6 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl text-white overflow-hidden">
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-1 sm:mb-2">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <Trees className="h-4 w-4 sm:h-5 sm:w-5" />
                          <span className="text-xs sm:text-sm font-medium">Trees Equivalent</span>
                        </div>
                        <Leaf className="h-4 w-4 sm:h-5 sm:w-5" />
                      </div>
                      <div className="text-xl sm:text-3xl font-bold">
                        {calculateTrees(contributionAmount[0])}
                      </div>
                      <div className="text-green-100 text-xs sm:text-sm">
                        Trees planted impact
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                  <h4 className="font-semibold text-base sm:text-lg mb-2 sm:mb-3">Payment Summary</h4>
                  <div className="flex justify-between text-sm sm:text-lg">
                    <span>Contribution</span>
                    <span className="font-semibold">₹{contributionAmount[0] * USD_TO_INR}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm text-muted-foreground">
                    <span>Processing Fee</span>
                    <span>₹{Math.round(processingFee * USD_TO_INR)}</span>
                  </div>
                  <Separator className="my-3" />
                  <div className="flex justify-between font-bold text-lg sm:text-xl">
                    <span>Total</span>
                    <span className="text-green-600">₹{totalAmountINR}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Project Info */}
                <div className="space-y-2 sm:space-y-3 p-3 sm:p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                  <h4 className="font-semibold text-base sm:text-lg">Supporting Project</h4>
                  <p className="text-muted-foreground text-sm">{projectName}</p>
                  <div className="flex gap-1 sm:gap-2">
                    <Badge variant="outline" className="text-[10px] sm:text-xs bg-green-100 border-green-300 text-green-700">
                      <Award className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                      Verified Project
                    </Badge>
                    <Badge variant="outline" className="text-[10px] sm:text-xs bg-blue-100 border-blue-300 text-blue-700">
                      <Shield className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                      Climate Certified
                    </Badge>
                  </div>
                </div>

                {/* Complete Payment Button */}
                <Button 
                  className="w-full h-12 sm:h-14 text-sm sm:text-lg font-semibold bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105" 
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing Payment...
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Lock className="h-4 w-4 sm:h-5 sm:w-5" />
                      Complete Payment ₹{totalAmountINR}
                    </div>
                  )}
                </Button>

                {/* Security Notice */}
                <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-muted-foreground p-2 sm:p-3 bg-white/30 dark:bg-gray-800/30 rounded-lg backdrop-blur-sm">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                  <span>Secured by 256-bit SSL encryption</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
