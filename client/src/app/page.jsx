"use client";

import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator,
  TrendingDown,
  TrendingUp, 
  ShoppingCart,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Leaf,
  Globe,
  Target,
  BarChart3,
  Award,
  Sparkles,
  Play,
  Sun,
  Mountain,
  Waves,
  ArrowDownCircle
} from 'lucide-react';
import Link from 'next/link';
import DashboardSkeleton from '@/components/DashboardSkeleton';
import MainPageSkeleton from '@/components/MainPageSkeleton';
import { useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import toast, { Toaster } from 'react-hot-toast';
// Import motion from framer-motion
import { motion } from 'framer-motion';

const LandingPage = () => {
  const features = [
    {
      icon: Calculator,
      title: "Carbon Footprint Calculator",
      description: "Get precise measurements of your individual or business carbon impact with our comprehensive assessment tools.",
      color: "text-blue-500"
    },
    {
      icon: TrendingDown,
      title: "Reduction Strategies",
      description: "Receive personalized tips and actionable plans to reduce your environmental footprint effectively.",
      color: "text-green-500"
    },
    {
      icon: ShoppingCart,
      title: "Offset Marketplace",
      description: "Browse verified carbon offset projects and make meaningful environmental investments.",
      color: "text-purple-500"
    },
    {
      icon: Users,
      title: "Sustainability Community",
      description: "Connect with like-minded individuals and businesses sharing the journey toward carbon neutrality.",
      color: "text-orange-500"
    }
  ];

  const stats = [
    { value: "10K+", label: "Climate Champions", subtext: "Growing 15% MoM" },
    { value: "30%", label: "Average Carbon Reduction", subtext: "Members consistently reduce their carbon footprint" },
    { value: "100%", label: "Real-time Impact Tracking", subtext: "Monitor your sustainability journey" }
  ];

  const toolkit = [
    { title: "Verified Offset Projects", icon: CheckCircle },
    { title: "MSME Sustainability Hub", icon: Target },
    { title: "Expert-led Webinars", icon: Play }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Founder of EcoTech Solutions",
      badge: "Carbon Neutral Certified",
      quote: "GreenCommunity helped our small business reduce carbon emissions by 40% in just six months. The actionable insights were game-changing.",
      avatar: "/woman.png"
    },
    {
      name: "Michael Rodriguez",
      role: "Community Member",
      badge: "Top Project Contributor",
      quote: "I never realized how much impact small changes could make until I used their calculator. Now our entire family is on a sustainability journey.",
      avatar: "/user.png"
    },
    {
      name: "Dr. Priya Patel",
      role: "Environmental Consultant",
      badge: "Urban Garden Innovator",
      quote: "The offset marketplace connected us with amazing reforestation projects. We're not just reducing emissions, we're actively restoring nature.",
      avatar: "/user-icon.png"
    }
  ];

  const router = useRouter();
  const protectedClickCount = useRef(0);
  const handleProtectedRoute = useCallback((e) => {
    e.preventDefault();
    protectedClickCount.current += 1;
    toast.error('Please log in first to access this page.');
    if (protectedClickCount.current >= 2) {
      protectedClickCount.current = 0;
      setTimeout(() => router.push('/Signup'), 800);
    }
  }, [router]);

  // Animation variants for staggered containers and fading in items
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };


  return (
    <div className="min-h-screen bg-gradient-to-r from-green-50 via-white to-white relative overflow-hidden">
      <Toaster position="top-center" toastOptions={{ duration: 2500, style: { fontSize: '1rem', fontFamily: 'Inter, sans-serif' } }} />
      {/* Landing Page Navbar - styled like old dashboard navbar */}
      <header className="sticky top-0 z-50 glass border-b border-border/30 backdrop-blur-xl animate-fade-in-down">
        <div className="flex items-center justify-between px-6 h-16">
          {/* Logo and Navigation */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 group cursor-pointer">
              <img
                src="/logo.png"
                alt="App Logo"
                className="mx-auto h-10 w-60 mb-1.2"
              />
            </div>
            {/* Navigation Buttons - Disabled for landing page */}
            <nav className="hidden lg:flex gap-1 ml-15">
              </nav>
          </div>
          {/* Right: Sign In and Sign Up Buttons */}
          <div className="flex gap-3">
            <Link href="/login">
              <button className="border border-green-600 text-green-600 hover:bg-green-50 font-semibold px-5 py-2 rounded-full shadow transition-all transform hover:scale-105 hover:shadow-lg duration-200" style={{fontFamily: "'Inter', sans-serif"}}>
                Sign In
              </button>
            </Link>
            <Link href="/Signup">
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-full shadow transition-all transform hover:scale-105 hover:shadow-lg duration-200" style={{ fontFamily: "'Inter', sans-serif" }}>
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </header>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          background: "linear-gradient(90deg, #72d1b8ff 200%, #b4ffd8ff 100%)",
        }}></div>
      </div>

      {/* Hero Section */}
      <section className="w-full flex justify-center items-center py-8 bg-transparent">
        <motion.div
          className="relative max-w-7xl w-full mx-auto rounded-3xl shadow-xl overflow-hidden border border-green-200"
          style={{
            background: "radial-gradient(circle at 0% 0%, #70e1acff 0%, #A7F3D0 20%, #fff 30%, #fff 100%)"
          }}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="relative z-10 flex flex-col items-center px-8 py-30">
            <motion.h1
              className="text-center font-bold mb-8 font-sans"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                fontSize: "clamp(48px, 7vw, 55px)",
                lineHeight: 1.1
              }}
              variants={itemVariants}
            >
              <span
                style={{
                  background: "linear-gradient(90deg, #07a27bff 0%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 700
                }}
              >
                Building a
              </span>{' '}
              <span
                style={{
                  fontWeight: 700,
                  color: "#222",
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                <span
                  style={{
                    background: "linear-gradient(90deg, #07a27bff 0%, #b9fa8dff 60%, #90bd7cff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700
                  }}
                >
                  Sustainable
                </span><br />
                <span
                  style={{
                    background: "linear-gradient(90deg, #07a27bff 0%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 700
                  }}
                >
                  Future Together
                </span>
              </span>
            </motion.h1>
            <motion.p
              className="mx-auto text-center"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 400,
                fontSize: "15px",
                color: "#9CA3AF",
                lineHeight: 1.5,
                maxWidth: "700px",
                marginBottom: "2rem"
              }}
              variants={itemVariants}
            >
              Calculate your carbon footprint, discover reduction strategies, offset your <br />
              impact, and join a community committed to environmental stewardship.
            </motion.p>
            
            <motion.div className="flex flex-col sm:flex-row gap-4 mb-10 justify-center" variants={itemVariants}>
              <Link href = "/login">
              <button
                onClick={() => router.push('/Signup')}
                className="flex items-center justify-center px-7 py-2 rounded-full shadow-md font-bold text-white text-base hover:shadow-lg transition-all"
                style={{
                  background: "linear-gradient(90deg, #07a27bff 0%)",
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "12px"
                }}
              >
                Calculate My Carbon Footprint
                <span className="ml-2" style={{ fontSize: "20px", color: '#fff' }}>→</span>
              </button>
              </Link>
              <Link href = "/login">
              <button
                onClick={() => router.push('/Signup')}
                className="bg-white border border-green-400 text-green-600 rounded-full shadow-md transition px-8 py-3 hover:shadow-lg hover:bg-green-50"
                style={{
                  fontFamily: "'Inter', 'Poppins', 'sans-serif'",
                  fontWeight: 600,
                  fontSize: "16px"
                }}

              >
                Join the Community
              </button>
              </Link>
            </motion.div>
            <motion.div className="text-center text-gray-500 text-sm mb-4" variants={itemVariants}>
              Trusted by environmentally conscious individuals and forward-thinking businesses
            </motion.div>
            <motion.div className="flex justify-center gap-20 text-green-600 text-2xl items-center" variants={itemVariants}>
              {/* Lucide Leaf Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-leaf h-7 w-7 opacity-80" aria-hidden="true">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"></path>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"></path>
              </svg>
              {/* Lucide Waves Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-waves h-7 w-7 opacity-80" aria-hidden="true">
                <path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
                <path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
                <path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"></path>
              </svg>
              {/* Sun */}
              <svg width="40" height="40" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="20" cy="20" r="6" />
                <path d="M20 6v4M20 34v-4M6 20h4M34 20h-4M9.64 9.64l2.83 2.83M30.36 30.36l-2.83-2.83M9.64 30.36l2.83-2.83M30.36 9.64l-2.83 2.83" />
              </svg>
              {/* Lucide Mountain Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-mountain h-7 w-7 opacity-80" aria-hidden="true">
                <path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="w-full bg-white py-36 relative z-10">
        <div className="absolute inset-0 bg-white z-0"></div>
        <motion.div
          className="relative z-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.div className="mb-15 max-w-5xl mx-auto px-5 -mt-15" variants={itemVariants}>
            <h2 className="text-4xl font-bold text-gray-900 mb-3 text-left leading-tight">Everything You Need for<br />Environmental Impact</h2>
            <p className="text-base text-gray-500 text-left max-w-2xl">
              Comprehensive tools and community support for your sustainability journey.
            </p>
          </motion.div>
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-8 px-5 mt-2">
            {/* Using a map to simplify and animate each feature card */}
            {features.slice(0, 4).map((feature, index) => (
              <motion.div key={index} className="flex flex-col items-start" variants={itemVariants}>
                <div className="w-8 h-8 rounded-md bg-green-600 flex items-center justify-center mb-2">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-base font-semibold text-gray-900 mb-1">{feature.title}</div>
                <div className="text-sm text-gray-600 mb-2">
                  {feature.description}
                </div>
                <a href="#" className="text-green-600 font-medium hover:underline flex items-center gap-1 mt-1 text-sm">Learn more <span>&rarr;</span></a>
              </motion.div>
            ))}
              </div>
        </motion.div>
      </section>

      {/* Drive Real Change Section */}
      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-green-600 mb-2">Drive Real Change</h3>
            <h2 className="text-4xl font-bold text-gray-800">A Community Platform for Climate Action</h2>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Left Column - Community Engagement */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-10 border border-gray-200 shadow-sm rounded-2xl bg-white flex flex-col h-full">
                <div>
                  <div className="text-lg font-semibold text-gray-900 mb-2">Join 10,000+ Climate Champions</div>
                  <div className="text-gray-600 text-base leading-relaxed mb-8">
                    Our community is growing, and so is our impact. Together, we're making a measurable difference for the planet.
        </div>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center">
                  <div className="text-6xl font-bold text-gray-900 mb-2">10K+</div>
                  <div className="text-lg text-gray-500 mb-6">Climate Champions</div>
                  <div className="flex items-center gap-2 text-green-600 font-medium mt-2">
                    <TrendingUp className="w-5 h-5" />
                    Growing 15% MoM
                  </div>
                </div>
          </Card>
            </motion.div>

            {/* Center Column - Two Separate Cards */}
            <div className="flex flex-col gap-8">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="p-10 border border-gray-200 shadow-sm rounded-2xl bg-white flex flex-col h-full items-center text-center">
                  <div className="text-lg font-semibold text-gray-900 mb-2">Average 30% Carbon Reduction</div>
                  <div className="text-gray-600 text-base leading-relaxed mb-6">
                    Members consistently reduce their carbon footprint with our tools and insights.
                </div>
                  <div className="text-6xl font-bold text-gray-900 mb-2">30%</div>
                  <div className="w-12 h-12 mx-auto mb-2 flex items-center justify-center">
                    <ArrowDownCircle className="w-10 h-10 text-green-600" />
              </div>
          </Card>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="p-10 border border-gray-200 shadow-sm rounded-2xl bg-white flex flex-col h-full items-center text-center">
                  <div className="text-lg font-semibold text-gray-900 mb-2">Real-time Impact Tracking</div>
                  <div className="text-gray-600 text-base leading-relaxed mb-6">
                    Monitor your sustainability journey with a personalized dashboard and reporting.
        </div>
                  <div className="w-16 h-16 mx-auto mb-2 grid grid-cols-4 grid-rows-2 gap-1">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="bg-green-600 rounded-sm"></div>
                    ))}
              </div>
          </Card>
              </motion.div>
      </div>

            {/* Right Column - Sustainability Toolkit */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="p-10 border border-gray-200 shadow-sm rounded-2xl bg-white flex flex-col h-full justify-center">
                          <div>
                  <div className="text-lg font-semibold text-gray-900 mb-2">Your Complete Sustainability Toolkit</div>
                  <div className="text-gray-600 text-base leading-relaxed mb-8">
                    From verified offsets to expert webinars and an MSME resource hub, all in one place.
                      </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 p-3 bg-white rounded-full border border-gray-200 hover:border-green-300 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Leaf className="w-4 h-4 text-green-600" />
          </div>
                    <span className="text-gray-800 font-medium">Verified Offset Projects</span>
                        </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-full border border-gray-200 hover:border-green-300 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <BarChart3 className="w-4 h-4 text-green-600" />
                        </div>
                    <span className="text-gray-800 font-medium">MSME Sustainability Hub</span>
                      </div>
                  <div className="flex items-center gap-3 p-3 bg-white rounded-full border border-gray-200 hover:border-green-300 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Globe className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-800 font-medium">Expert-led Webinars</span>
                  </div>
                </div>
            </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold mb-4 text-gray-800">Stories from Our Community</h2>
            <p className="text-xl text-gray-600">
              Real people making real environmental impact
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg h-full">
              <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full object-cover ring-2 ring-green-200"
                      />
                      <div>
                        <div className="font-semibold text-gray-800">{testimonial.name}</div>
                        <div className="text-sm text-gray-600">{testimonial.role}</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="w-fit bg-green-100 text-green-800 border-green-200">
                      {testimonial.badge}
                    </Badge>
                    <blockquote className="text-gray-600 italic leading-relaxed">
                      "{testimonial.quote}"
                    </blockquote>
              </CardContent>
            </Card>
              </motion.div>
            ))}
          </motion.div>
          </div>
      </section>

      {/* New Full-Width CTA Section */}
      <motion.section
        className="w-full min-h-[400px] flex items-center justify-center"
        style={{
          background: "radial-gradient(circle at 60% 40%, #009966 0%, #065F46 100%)",
          color: "white"
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-2xl mx-auto text-center px-4 py-24">
          <motion.h1
            className="text-4xl md:text-5xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Ready to Reduce Your <br /> Environmental Impact?
          </motion.h1>
          <motion.p
            className="text-lg mb-8 text-white/80 font-medium"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Join thousands of individuals and businesses taking measurable action toward a sustainable future.
            Start with a free carbon footprint assessment today.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link href="/Signup">
              <button 
                className="bg-white text-green-700 font-semibold px-6 py-3 rounded-lg shadow hover:bg-gray-100 transition cursor-pointer"
              >
                Start My Assessment
              </button>
            </Link>
            <Link href="/marketplace">
              <button 
                className="bg-transparent border border-white text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-white hover:text-green-700 transition cursor-pointer"
              >
                Explore the Marketplace →
              </button>
            </Link>
          </motion.div>
          <motion.div
            className="text-sm text-white/70"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            Free assessment • No credit card required • Join 10,000+ climate champions
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-white border-t py-12">
        <div className="max-w-7xl mx-auto px-4">
          {/* Logo, description, and newsletter signup */}
          <div className="flex-1 min-w-[250px] mb-8">
            <div className="flex items-center gap-2 mb-2">
              <img src="/logo.png" alt="GreenCommunity Logo" className="h-12" />
            </div>
            <p className="text-base text-gray-600 mb-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              GreenCommunity is building the world's largest platform for measurable environmental impact, connecting individuals and businesses in the journey toward carbon neutrality and nature restoration.
            </p>
            <div>
              <div className="font-semibold text-base text-gray-900 mb-1" style={{ fontFamily: "'Inter', sans-serif" }}>Get sustainability tips and community updates</div>
              <form className="flex gap-2 mb-8">
                <input type="email" placeholder="Your email" className="border rounded px-3 py-2 text-sm" style={{ fontFamily: "'Inter', sans-serif" }} />
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded font-semibold text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>Sign Up</button>
              </form>
            </div>
          </div>
          {/* Footer links below signup */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8 px-8">
            <div>
              <div className="font-bold mb-2 text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>Platform</div>
              <ul className="text-sm text-gray-600 space-y-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                <li><a href="#" className="hover:underline focus:underline">Carbon Calculator</a></li>
                <li><a href="#" className="hover:underline focus:underline">Offset Marketplace</a></li>
                <li><a href="#" className="hover:underline focus:underline">Reduction Tips</a></li>
                <li><a href="#" className="hover:underline focus:underline">Community Hub</a></li>
              </ul>
            </div>
            <div>
              <div className="font-bold mb-3 text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>Resources</div>
              <ul className="text-sm text-gray-600 space-y-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                <li><a href="#" className="hover:underline focus:underline">Blog</a></li>
                <li><a href="#" className="hover:underline focus:underline">Case Studies</a></li>
                <li><a href="#" className="hover:underline focus:underline">Research</a></li>
                <li><a href="#" className="hover:underline focus:underline">Webinars</a></li>
              </ul>
            </div>
            <div>
              <div className="font-bold mb-2 text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>Support</div>
              <ul className="text-sm text-gray-600 space-y-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                <li><a href="#" className="hover:underline focus:underline">Help Center</a></li>
                <li><a href="#" className="hover:underline focus:underline">Contact Us</a></li>
                <li><a href="#" className="hover:underline focus:underline">API Docs</a></li>
                <li><a href="#" className="hover:underline focus:underline">Partner With Us</a></li>
              </ul>
            </div>
            <div>
              <div className="font-bold mb-2 text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>Company</div>
              <ul className="text-sm text-gray-600 space-y-1" style={{ fontFamily: "'Inter', sans-serif" }}>
                <li><a href="#" className="hover:underline focus:underline">About Us</a></li>
                <li><a href="#" className="hover:underline focus:underline">Careers</a></li>
                <li><a href="#" className="hover:underline focus:underline">Press</a></li>
                <li><a href="#" className="hover:underline focus:underline">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <hr className="my-8 border-gray-200" />
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>

            <div className="w-full flex flex-col items-center mb-0">
              <div className="flex items-center gap-6">
                <a href="#" aria-label="Twitter">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 hover:text-green-600 transition"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53A4.48 4.48 0 0 0 22.4.36a9.09 9.09 0 0 1-2.88 1.1A4.52 4.52 0 0 0 16.5 0c-2.5 0-4.5 2.01-4.5 4.5 0 .35.04.7.11 1.03C7.69 5.36 4.07 3.6 1.64.96c-.38.65-.6 1.4-.6 2.2 0 1.52.77 2.86 1.95 3.65A4.48 4.48 0 0 1 .96 6v.06c0 2.13 1.52 3.91 3.54 4.31-.37.1-.76.16-1.16.16-.28 0-.55-.03-.81-.08.55 1.72 2.16 2.97 4.07 3A9.05 9.05 0 0 1 0 19.54a12.8 12.8 0 0 0 6.92 2.03c8.3 0 12.85-6.88 12.85-12.85 0-.2 0-.39-.01-.58A9.22 9.22 0 0 0 24 4.59a9.1 9.1 0 0 1-2.6.71z"/></svg>
                </a>
                <a href="#" aria-label="Facebook">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 hover:text-green-600 transition"><path d="M18 2h-3a4 4 0 0 0-4 4v3H7v4h4v8h4v-8h3l1-4h-4V6a1 1 0 0 1 1-1h3z"/></svg>
                </a>
                <a href="#" aria-label="LinkedIn">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 hover:text-green-600 transition"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                </a>
                <a href="#" aria-label="Instagram">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400 hover:text-green-600 transition"><rect x="2" y="2" width="16" height="16" rx="4"/><circle cx="10" cy="10" r="4"/><path d="M18 6.5v.01"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

const MainPage = () => {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const [hasRedirected, setHasRedirected] = useState(false);

  useEffect(() => {
    // If user is authenticated and we haven't redirected yet, redirect to dashboard
    if (!isLoading && user && !hasRedirected) {
      setHasRedirected(true);
      router.replace('/dashboard');
    }
  }, [user, isLoading, router, hasRedirected]);

  // Show loading skeleton while checking authentication or redirecting
  if (isLoading || (user && hasRedirected)) {
    return <LandingPage />;
  }

  // Show landing page for non-authenticated users
  return <LandingPage />;
};

export default MainPage;