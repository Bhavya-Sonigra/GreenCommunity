"use client";

import { useEffect, useState, useCallback, useRef } from 'react';
import { useUser } from '@/context/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calculator,
  TrendingDown,
  TrendingUp,
  ShoppingCart,
  Users,
  CheckCircle,
  Leaf,
  Globe,
  Target,
  BarChart3,
  Play,
  ArrowDownCircle
} from 'lucide-react';
import { FaTwitter, FaFacebook, FaLinkedin, FaInstagram } from 'react-icons/fa';
import { HiArrowRight } from 'react-icons/hi2';
import Link from 'next/link';
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
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/30 backdrop-blur-xl animate-fade-in-down">
        <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 lg:px-8 h-16 sm:h-18">
          {/* Logo and Navigation */}
          <div className="flex items-center flex-1">
            <div className="flex items-center group cursor-pointer">
              <img
                src="/logo.png"
                alt="GreenCommunity Logo"
                className="h-8 sm:h-10 md:h-12 lg:h-14 w-auto object-contain max-w-[120px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[240px]"
              />
            </div>
            {/* Navigation Buttons - Disabled for landing page */}
            <nav className="hidden lg:flex gap-4 ml-8">
              {/* Navigation items would go here */}
            </nav>
          </div>

          {/* Right: Sign In and Sign Up Buttons */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
            <Link href="/login">
              <button className="border border-green-600 text-green-600 hover:bg-green-50 hover:border-green-700 font-semibold px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base whitespace-nowrap cursor-pointer" style={{ fontFamily: "'Inter', sans-serif" }}>
                Sign In
              </button>
            </Link>
            <Link href="/Signup">
              <button className="bg-green-600 hover:bg-green-700 text-white font-semibold px-3 sm:px-4 md:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-full shadow-md transition-all duration-300 transform hover:scale-105 hover:shadow-lg text-sm sm:text-base whitespace-nowrap cursor-pointer" style={{ fontFamily: "'Inter', sans-serif" }}>
                Sign Up
              </button>
            </Link>
          </div>
        </div>
      </header>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          background: "linear-gradient(90deg, #72d1b8ff 200%, #b4ffd8ff 100%)",
        }}></div>
      </div>

      {/* Hero */}
      <section className="w-full flex justify-center items-center py-6 sm:py-8 md:py-12">
        <motion.div
          className="relative max-w-7xl w-full mx-4 sm:mx-6 lg:mx-8 rounded-2xl sm:rounded-3xl shadow-xl overflow-hidden border border-green-200"
          style={{
            background:
              "radial-gradient(circle at 0% 0%, #059669 0%, #34d399 30%, #fff 70%)"
          }}
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <div className="relative z-10 flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 lg:py-20">
            <motion.h1
              className="text-center font-bold mb-4 sm:mb-6 leading-tight"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "clamp(24px, 5vw, 65px)"
              }}
              variants={itemVariants}
            >
              <span className="bg-gradient-to-r from-green-700 to-green-400 bg-clip-text text-transparent">
                Building a Sustainable
              </span>
              <br />
              <span className="bg-gradient-to-r from-green-700 to-green-400 bg-clip-text text-transparent">
                Future Together
              </span>
            </motion.h1>

            <motion.p
              className="text-center text-gray-700 max-w-2xl mb-6 sm:mb-8 px-2 sm:px-0"
              style={{
                fontFamily: "Inter, sans-serif",
                fontSize: "clamp(14px, 2vw, 18px)"
              }}
              variants={itemVariants}
            >
              Calculate your carbon footprint, discover reduction strategies,
              offset your impact, and join a community committed to
              environmental stewardship.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 w-full max-w-2xl"
              variants={itemVariants}
            >
              <Link href="/Signup" className="flex-1">
                <button className="w-full flex items-center justify-center px-3 sm:px-6 py-3 rounded-full shadow-lg font-bold text-white bg-green-600 hover:bg-green-700 transition hover:scale-105 text-sm sm:text-base whitespace-nowrap cursor-pointer">
                  <span className="hidden sm:inline">Calculate My Carbon Footprint</span>
                  <span className="sm:hidden">Calculate My Carbon Footprint</span>
                  <HiArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </Link>
              <Link href="/Signup" className="flex-1">
                <button className="w-full bg-white border-2 border-green-400 text-green-600 rounded-full shadow-lg px-3 sm:px-6 py-3 hover:shadow-xl hover:bg-green-50 transition hover:scale-105 text-sm sm:text-base whitespace-nowrap cursor-pointer">
                  Join the Community
                </button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="w-full bg-white py-12 sm:py-16">
        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
        >
          <motion.div className="text-center mb-12" variants={itemVariants}>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Environmental Impact
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools and community support for your sustainability journey.
            </p>
          </motion.div>

          <div className="grid gap-6 md:gap-8 grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex flex-col p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                variants={itemVariants}
              >
                <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 mb-4 flex-1">{feature.description}</p>
                <a
                  href="#"
                  className="inline-flex items-center text-green-600 font-medium hover:text-green-700 text-sm group"
                >
                  <span>Learn more</span>
                  <HiArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Drive Real Change Section */}
      <section className="bg-gray-50 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16 md:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-green-600 mb-3">Drive Real Change</h3>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">A Community Platform for Climate Action</h2>
          </motion.div>

          {/* Cards Grid - Equal Heights */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
            {/* Left Column - Community Engagement */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:row-span-1"
            >
              <Card className="h-full p-6 sm:p-8 md:p-10 border border-gray-200 shadow-sm rounded-2xl bg-white flex flex-col justify-between">
                <div className="text-center">
                  <div className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-4">Join 10,000+ Climate Champions</div>
                  <div className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed mb-8">
                    Our community is growing, and so is our impact. Together, we're making a measurable difference for the planet.
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center flex-1">
                  <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-3">10K+</div>
                  <div className="text-base sm:text-lg md:text-xl text-gray-500 mb-6">Climate Champions</div>
                  <div className="flex items-center gap-2 text-green-600 font-medium text-sm sm:text-base">
                    <TrendingUp className="w-5 h-5" />
                    Growing 15% MoM
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Center Column - Two Stacked Cards */}
            <div className="flex flex-col gap-6 sm:gap-8 md:gap-10">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="h-full p-6 sm:p-8 md:p-10 border border-gray-200 shadow-sm rounded-2xl bg-white flex flex-col items-center text-center justify-center">
                  <div className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Average 30% Carbon Reduction</div>
                  <div className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                    Members consistently reduce their carbon footprint with our tools and insights.
                  </div>
                  <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-4">30%</div>
                  <div className="w-12 h-12 mx-auto flex items-center justify-center">
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
                <Card className="h-full p-6 sm:p-8 md:p-10 border border-gray-200 shadow-sm rounded-2xl bg-white flex flex-col items-center text-center justify-center">
                  <div className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Real-time Impact Tracking</div>
                  <div className="text-gray-600 text-sm sm:text-base leading-relaxed mb-6">
                    Monitor your sustainability journey with a personalized dashboard and reporting.
                  </div>
                  <div className="w-16 h-12 mx-auto grid grid-cols-4 grid-rows-2 gap-1">
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
              transition={{ duration: 0.5, delay: 0.4 }}
              className="lg:row-span-1"
            >
              <Card className="h-full p-6 sm:p-8 md:p-10 border border-gray-200 shadow-sm rounded-2xl bg-white flex flex-col">
                <div className="mb-8">
                  <div className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-4">Your Complete Sustainability Toolkit</div>
                  <div className="text-gray-600 text-sm sm:text-base md:text-lg leading-relaxed">
                    From verified offsets to expert webinars and an MSME resource hub, all in one place.
                  </div>
                </div>
                <div className="flex flex-col gap-4 flex-1 justify-center">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-green-300 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Leaf className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-gray-800 font-medium text-sm sm:text-base">Verified Offset Projects</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-green-300 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <BarChart3 className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-gray-800 font-medium text-sm sm:text-base">MSME Sustainability Hub</span>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-green-300 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="text-gray-800 font-medium text-sm sm:text-base">Expert-led Webinars</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 py-12 sm:py-16 md:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <motion.div
            className="text-center mb-12 sm:mb-16 md:mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-800">Stories from Our Community</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">
              Real people making real environmental impact
            </p>
          </motion.div>
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={containerVariants}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="p-6 sm:p-8 hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border-0 shadow-lg h-full">
                  <CardContent className="space-y-4 sm:space-y-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover ring-2 ring-green-200 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-gray-800 text-base sm:text-lg truncate">{testimonial.name}</div>
                        <div className="text-sm sm:text-base text-gray-600 truncate">{testimonial.role}</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="w-fit bg-green-100 text-green-800 border-green-200 text-sm">
                      {testimonial.badge}
                    </Badge>
                    <blockquote className="text-gray-600 italic leading-relaxed text-sm sm:text-base">
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
        className="w-full min-h-[300px] sm:min-h-[400px] md:min-h-[500px] flex items-center justify-center"
        style={{
          background: "radial-gradient(circle at 60% 40%, #009966 0%, #065F46 100%)",
          color: "white"
        }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 md:px-8 py-12 sm:py-16 md:py-20 lg:py-24">
          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 sm:mb-6 md:mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Ready to Reduce Your <br className="hidden sm:block" />Environmental Impact?
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 md:mb-10 text-white/80 font-medium max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Join thousands of individuals and businesses taking measurable action toward a sustainable future.
            Start with a free carbon footprint assessment today.
          </motion.p>
          <motion.div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-6 justify-center mb-6 sm:mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Link href="/Signup" className="flex-1">
              <button
                className="w-full bg-white text-green-700 font-semibold px-6 md:px-8 py-3 md:py-4 rounded-lg shadow-lg hover:bg-gray-50 hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer text-sm sm:text-base md:text-lg"
              >
                Start My Assessment
              </button>
            </Link>
            <Link href="/marketplace" className="flex-1">
              <button
                className="w-full bg-transparent border-2 border-white text-white font-semibold px-6 md:px-8 py-3 md:py-4 rounded-lg shadow-lg hover:bg-white hover:text-green-700 hover:border-white hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group cursor-pointer text-sm sm:text-base md:text-lg"
              >
                <span>Explore the Marketplace</span>
                <HiArrowRight className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </Link>
          </motion.div>
          <motion.div
            className="text-sm sm:text-base text-white/70"
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
      <footer className="bg-gradient-to-br from-gray-50 to-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          {/* Main footer content */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 mb-12">
            {/* Logo and description section */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img
                  src="/logo.png"
                  alt="GreenCommunity Logo"
                  className="h-12 sm:h-14 w-auto object-contain"
                />
                <div className="h-8 w-px bg-green-200"></div>
                <div className="text-sm text-green-600 font-medium">
                  Building Tomorrow
                </div>
              </div>
              <p className="text-base text-gray-600 mb-8 leading-relaxed max-w-md" style={{ fontFamily: "'Inter', sans-serif" }}>
                Join the world's largest platform for measurable environmental impact. Connect with individuals and businesses on the journey toward carbon neutrality.
              </p>

              {/* Newsletter signup */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="font-semibold text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Stay Updated
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Get sustainability tips and product updates
                </p>
                <form className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 flex-1 bg-gray-50 hover:bg-white"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    required
                  />
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold text-sm whitespace-nowrap transition-all duration-300 transform hover:scale-105 active:scale-95 hover:shadow-lg cursor-pointer shadow-sm"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>

            {/* Footer links */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-12">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="font-bold text-gray-900 text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>Platform</div>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <li>
                      <a href="#" className="hover:text-green-600 transition-all duration-300 block py-1 hover:translate-x-1">
                        Carbon Calculator
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-green-600 transition-all duration-300 block py-1 hover:translate-x-1">
                        Offset Marketplace
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-green-600 transition-all duration-300 block py-1 hover:translate-x-1">
                        Reduction Tips
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-green-600 transition-all duration-300 block py-1 hover:translate-x-1">
                        Community Hub
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="font-bold text-gray-900 text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>Resources</div>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <li>
                      <a href="#" className="hover:text-green-600 transition-all duration-300 block py-1 hover:translate-x-1">
                        Blog
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-green-600 transition-all duration-300 block py-1 hover:translate-x-1">
                        Case Studies
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-green-600 transition-all duration-300 block py-1 hover:translate-x-1">
                        Research
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-green-600 transition-all duration-300 block py-1 hover:translate-x-1">
                        Webinars
                      </a>
                    </li>
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="font-bold text-gray-900 text-lg" style={{ fontFamily: "'Inter', sans-serif" }}>Company</div>
                  </div>
                  <ul className="text-sm text-gray-600 space-y-3" style={{ fontFamily: "'Inter', sans-serif" }}>
                    <li>
                      <a href="#" className="hover:text-green-600 transition-all duration-300 block py-1 hover:translate-x-1">
                        About Us
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-green-600 transition-all duration-300 block py-1 hover:translate-x-1">
                        Careers
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-green-600 transition-all duration-300 block py-1 hover:translate-x-1">
                        Contact
                      </a>
                    </li>
                    <li>
                      <a href="#" className="hover:text-green-600 transition-all duration-300 block py-1 hover:translate-x-1">
                        Privacy
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer bottom */}
          <div className="border-t border-gray-150 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="text-sm text-gray-500" style={{ fontFamily: "'Inter', sans-serif" }}>
                  &copy; 2024 GreenCommunity. All rights reserved.
                </div>
                <div className="hidden md:flex items-center gap-4 text-xs text-gray-400">
                  <a href="#" className="hover:text-green-600 transition-colors duration-300">Terms</a>
                  <span>•</span>
                  <a href="#" className="hover:text-green-600 transition-colors duration-300">Privacy</a>
                  <span>•</span>
                  <a href="#" className="hover:text-green-600 transition-colors duration-300">Cookies</a>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <div className="text-xs text-gray-400 mr-3">Follow us</div>
                <a href="#" aria-label="Twitter" className="p-2 rounded-full bg-gray-100 hover:bg-blue-50 transition-all duration-300 transform hover:scale-110 hover:shadow-md group">
                  <FaTwitter className="w-4 h-4 text-gray-400 group-hover:text-[#1DA1F2] transition-colors duration-300" />
                </a>
                <a href="#" aria-label="Facebook" className="p-2 rounded-full bg-gray-100 hover:bg-blue-50 transition-all duration-300 transform hover:scale-110 hover:shadow-md group">
                  <FaFacebook className="w-4 h-4 text-gray-400 group-hover:text-[#1877F2] transition-colors duration-300" />
                </a>
                <a href="#" aria-label="LinkedIn" className="p-2 rounded-full bg-gray-100 hover:bg-blue-50 transition-all duration-300 transform hover:scale-110 hover:shadow-md group">
                  <FaLinkedin className="w-4 h-4 text-gray-400 group-hover:text-[#0A66C2] transition-colors duration-300" />
                </a>
                <a href="#" aria-label="Instagram" className="p-2 rounded-full bg-gray-100 hover:bg-pink-50 transition-all duration-300 transform hover:scale-110 hover:shadow-md group">
                  <FaInstagram className="w-4 h-4 text-gray-400 group-hover:text-[#E4405F] transition-colors duration-300" />
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