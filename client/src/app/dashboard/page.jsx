"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

import { 
  TrendingUp, 
  TrendingDown, 
  Target, 
  Plus, 
  Zap, 
  Users,
  Calendar,
  Car,
  Home,
  Utensils,
  Plane,
  Award,
  Leaf,
  BarChart3,
  ArrowRight} from 'lucide-react';
import AnimatedCounter from '@/components/AnimatedCounter';
import ProfessionalProgress from '@/components/ProfessionalProgress';
import AnimatedCircularProgress from '@/components/AnimatedCircularProgress';
import { useUser } from '@/context/UserContext';
import { useState, useEffect } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { usePreferences, useTranslation } from "@/context/PreferencesContext";
import DashboardSkeleton from '@/components/DashboardSkeleton';
import { Calendar as CustomCalendar } from '@/components/ui/calendar';

const translations = {
  en: {
    welcome: "Welcome back!",
    emissions: "Your emissions by category this month",
    achievements: "Your eco-friendly milestones",
    // ... add more as needed
  },
  hi: {
    welcome: "वापसी पर स्वागत है!",
    emissions: "इस महीने श्रेणी के अनुसार आपके उत्सर्जन",
    achievements: "आपकी पर्यावरण-अनुकूल उपलब्धियाँ",
    // ...
  },
  gu: {
    welcome: "પાછા આવવા માટે સ્વાગત છે!",
    emissions: "આ મહિને કેટેગરી પ્રમાણે તમારા ઉત્સર્જન",
    achievements: "તમારી પર્યાવરણ-મૈત્રીપૂર્ણ સિદ્ધિઓ",
    // ...
  },
};

const currencySymbols = {
  usd: "$",
  eur: "€",
  inr: "₹",
};

const unitLabels = {
  metric: { distance: "km", weight: "kg" },
  imperial: { distance: "mi", weight: "lb" },
};

const getGreetingKey = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'greeting_morning';
  if (hour < 18) return 'greeting_afternoon';
  return 'greeting_evening';
};

const Dashboard = () => {
  const { user, isLoading } = useUser();
  const [greetingKey, setGreetingKey] = useState('greeting_morning'); // Default fallback
  const { preferences } = usePreferences();
  const { t } = useTranslation();
  const currency = currencySymbols[preferences.currency] || "$";
  const units = unitLabels[preferences.units] || unitLabels.metric;
  const [date, setDate] = useState(new Date());

  // Handle client-side tasks
  useEffect(() => {
    // Set the correct greeting when component mounts
    setGreetingKey(getGreetingKey());
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const isAuthenticated = !!user;
  const name = user?.name || 'Guest';
  const goalProgress = isAuthenticated ? 75 : 0;
  

  // Mock data - in a real app, this would come from an API
  const currentFootprint = 2.4; // tons CO2 per month
  const targetFootprint = 2.0;
  const dailyEmissions = [1.2, 2.1, 1.8, 2.5, 1.9, 2.3, 1.7]; // Last 7 days
  const weeklyTotal = dailyEmissions.reduce((a, b) => a + b, 0);

  const footprintBreakdown = [
    { category: 'Transportation', amount: 0.8, percentage: 33, icon: Car, color: 'text-blue-500' },
    { category: 'Energy', amount: 0.7, percentage: 29, icon: Home, color: 'text-yellow-500' },
    { category: 'Food', amount: 0.6, percentage: 25, icon: Utensils, color: 'text-green-500' },
    { category: 'Travel', amount: 0.3, percentage: 13, icon: Plane, color: 'text-purple-500' },
  ];

  const recentActivities = [
    { type: 'Transportation', description: 'Commute to work (15 miles)', co2: 0.8, date: 'Today' },
    { type: 'Energy', description: 'Home electricity usage', co2: 0.6, date: 'Yesterday' },
    { type: 'Food', description: 'Groceries - mostly organic', co2: 0.4, date: 'Yesterday' },
  ];

  const achievements = [
    { title: 'Week Streak', description: '7 days of logging', icon: Award, earned: true },
    { title: 'Green Commuter', description: 'Used public transport 5x', icon: Car, earned: true },
    { title: 'Plant-Based', description: 'Ate vegetarian for 3 days', icon: Leaf, earned: false },
  ];

  // Generate streak days from 1st to 13th of the current month
  const today = new Date();
  const streakDays = Array.from({ length: 13 }, (_, i) => new Date(today.getFullYear(), today.getMonth(), i + 1));

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-background via-accent/5 to-primary/5 min-h-screen relative">
      {/* Enhanced Header */}
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-primary rounded-full animate-pulse-eco" />
          <div>
            <h1 className="text-4xl font-bold text-gradient">{t(greetingKey)}, {name}!</h1>
            <p className="text-lg text-muted-foreground">Here's your environmental impact overview</p>
          </div>
        </div>
      </div>

      {/* Key Metrics Cards with Staggered Animation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Monthly Footprint */}
        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <Card className="card-premium hover-glow group cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
                <BarChart3 className="h-5 w-5" />
                Monthly Footprint
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-foreground">
                  <AnimatedCounter end={currentFootprint} decimals={1} />
                  <span className="text-base font-normal text-muted-foreground ml-1">tons CO₂</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-success animate-bounce" />
                  <span className="text-sm text-success font-semibold">12% below target</span>
                </div>
                <ProfessionalProgress value={80} className="mt-3" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weekly Total */}
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Card className="card-floating hover-lift group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
                <Calendar className="h-5 w-5" />
                This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-foreground">
                  <AnimatedCounter end={weeklyTotal} decimals={1} />
                  <span className="text-base font-normal text-muted-foreground ml-1">kg CO₂</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-warning animate-bounce" />
                  <span className="text-sm text-warning font-semibold">5% above last week</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goal Progress */}
        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Card className="card-floating hover-lift group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2 group-hover:text-primary transition-colors">
                <Target className="h-5 w-5" />
                Goal Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-foreground">
                  <AnimatedCounter end={goalProgress} />%
                </div>
                <div className="text-sm text-muted-foreground">
                  Target: {targetFootprint} tons/month
                </div>
                <ProfessionalProgress value={goalProgress} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Offset Credits */}
        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Card className="card-premium hover-glow group cursor-pointer">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground flex items-center gap-2 group-hover:text-success transition-colors">
                <Leaf className="h-5 w-5" />
                Offset Credits
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-3xl font-bold text-foreground">
                  <AnimatedCounter end={1.2} decimals={1} />
                  <span className="text-base font-normal text-muted-foreground ml-1">tons</span>
                </div>
                <Badge variant="secondary" className="bg-success/15 text-success border-success/30 font-semibold animate-pulse-eco">
                  50% offset this month
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Enhanced Footprint Breakdown */}
          <div className="animate-slide-up" style={{ animationDelay: '0.5s' }}>
            <Card className="card-premium hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">{t('emissions')}</CardTitle>
                <CardDescription>Your emissions by category this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {footprintBreakdown.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.category}
                        className="flex items-center justify-between p-4 rounded-xl border border-border/30 hover:border-primary/20 hover:bg-primary/5 transition-all duration-300 group animate-fade-in"
                        style={{ animationDelay: `${0.6 + (index * 0.1)}s` }}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br from-accent/20 to-accent/30 ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                            <Icon className="h-6 w-6" />
                          </div>
                          <div>
                            <div className="font-semibold text-foreground text-lg">{item.category}</div>
                            <div className="text-sm text-muted-foreground">
                              <AnimatedCounter end={item.amount} decimals={1} /> tons CO₂
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-center justify-center min-w-[60px]">
                          <div className="w-12 h-12">
                            <AnimatedCircularProgress
                              targetValue={item.percentage}
                              rotation={270}
                              textSize="22px"
                              pathColor="#22c55e"
                              textColor="#1a2e22"
                              trailColor="#e5e7eb"
                              textPosition={{ x: 50, y: 50 }}
                              className="seed-meter" // Add a class for potential CSS customization
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Recent Activities */}
          <div className="animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <Card className="card-floating hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calendar className="h-6 w-6 text-primary" />
                  Recent Activities
                </CardTitle>
                <CardDescription>Your latest carbon footprint entries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity, index) => (
                    <div 
                      key={index} 
                      className="flex items-center justify-between p-4 rounded-xl border border-border/30 hover:bg-accent/20 hover:shadow-lg transition-all duration-300 animate-fade-in hover-lift group"
                      style={{ animationDelay: `${0.7 + (index * 0.1)}s` }}
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors">
                          {activity.description}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {activity.type} • {activity.date}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          +<AnimatedCounter end={activity.co2} decimals={1} /> kg
                        </div>
                        <div className="text-xs text-muted-foreground">CO₂</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Achievements */}
          <div className="animate-slide-up" style={{ animationDelay: '0.8s' }}>
            <Card className="card-floating hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">{t('achievements')}</CardTitle>
                <CardDescription>Your eco-friendly milestones</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon;
                  return (
                    <div 
                      key={index} 
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-500 hover-lift ${
                        achievement.earned 
                          ? 'border-success/40 bg-gradient-to-r from-success/10 to-success/5 shadow-lg' 
                          : 'border-border/30 bg-muted/10 hover:border-primary/20'
                      }`}
                    >
                      <div className={`p-3 rounded-xl transition-all duration-300 ${
                        achievement.earned 
                          ? 'bg-success/20 text-success animate-pulse-eco' 
                          : 'bg-muted text-muted-foreground'
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1">
                        <div className={`font-semibold text-lg ${
                          achievement.earned ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {achievement.title}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {achievement.description}
                        </div>
                      </div>
                      {achievement.earned && (
                        <Badge className="bg-success/20 text-success border-success/30 font-bold animate-pulse-eco">
                          ✓ Earned
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Column with Enhanced Styling */}
        <div className="space-y-6">
          {/* Enhanced Quick Actions */}
          <div className="animate-slide-up" style={{ animationDelay: '0.7s' }}>
            <Card className="card-premium hover-glow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Zap className="h-6 w-6 text-primary animate-pulse-eco" />
                  Quick Actions
                </CardTitle>
                <CardDescription>Track your impact today</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full justify-start h-14 text-lg font-semibold btn-professional group">
                  <Plus className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                  Log Activity
                  <ArrowRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button className="w-full justify-start h-14 text-lg font-semibold btn-professional group">
                  <Zap className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                  Offset Emissions
                  <ArrowRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button className="w-full justify-start h-14 text-lg font-semibold btn-professional group">
                  <Users className="h-5 w-5 mr-3 group-hover:scale-110 transition-transform" />
                  Join Challenge
                  <ArrowRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>
          {/* Calendar Streak */}
          <div className="animate-slide-up" style={{ animationDelay: '0.75s' }}>
            <Card className="bg-gradient-to-br from-green-50 via-white to-green-100 border border-green-200 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl hover:scale-[1.02]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-md mr-2 animate-pulse-eco">
                    <Calendar className="h-6 w-6 text-white" />
                  </span>
                  <span className="bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent font-extrabold">Streak Calendar</span>
                </CardTitle>
                <CardDescription className="text-base text-gray-600 mt-1">Your activity streak this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center items-center py-6">
                  <CustomCalendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    streakDays={streakDays}
                    className="rounded-2xl border-2 border-green-200 bg-white shadow-lg p-4 w-[360px] hover:shadow-green-200/70 transition-all duration-300"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Enhanced Tip of the Day */}
          <div className="animate-slide-up" style={{ animationDelay: '0.9s' }}>
            <Card className="card-premium hover-glow border-2 border-primary/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-primary opacity-10 rounded-full -translate-y-10 translate-x-10" />
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                  <span className="text-2xl animate-pulse">💡</span>
                  Eco Tip of the Day
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Try meal prepping with seasonal, local ingredients this week. It can reduce your food-related emissions by up to 
                  <span className="font-bold text-success"> 20%</span> while saving time and money!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 