"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Car, 
  Home, 
  Utensils, 
  Plane, 
  Plus, 
  Calculator,
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  Filter,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const FootprintLog = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activityType, setActivityType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState('');
  const [calculatedEmissions, setCalculatedEmissions] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const activityTypes = [
    { value: 'transport-car', label: 'Car Travel', icon: Car, unit: 'miles', factor: 0.4 },
    { value: 'transport-flight', label: 'Flight', icon: Plane, unit: 'miles', factor: 0.2 },
    { value: 'energy-electricity', label: 'Electricity', icon: Home, unit: 'kWh', factor: 0.5 },
    { value: 'energy-gas', label: 'Natural Gas', icon: Home, unit: 'therms', factor: 5.3 },
    { value: 'food-meat', label: 'Meat Consumption', icon: Utensils, unit: 'lbs', factor: 6.5 },
    { value: 'food-dairy', label: 'Dairy Products', icon: Utensils, unit: 'lbs', factor: 3.2 },
  ];

  // Move recentEntries to state
  const [entries, setEntries] = useState([
    { id: 1, date: '2024-01-15', activity: 'Car commute to work', type: 'Transportation', amount: 25, unit: 'miles', co2: 10.2, icon: Car },
    { id: 2, date: '2024-01-14', activity: 'Home electricity usage', type: 'Energy', amount: 15, unit: 'kWh', co2: 7.5, icon: Home },
    { id: 3, date: '2024-01-14', activity: 'Grocery shopping - meat', type: 'Food', amount: 2, unit: 'lbs', co2: 13.0, icon: Utensils },
    { id: 4, date: '2024-01-13', activity: 'Flight to Seattle', type: 'Travel', amount: 800, unit: 'miles', co2: 160.0, icon: Plane },
  ]);

  const calculateEmissions = () => {
    const selectedActivity = activityTypes.find(type => type.value === activityType);
    if (selectedActivity && quantity) {
      const emissions = parseFloat(quantity) * selectedActivity.factor;
      setCalculatedEmissions(emissions);
      setShowResult(true);
    }
  };

  const getSelectedActivityDetails = () => {
    return activityTypes.find(type => type.value === activityType);
  };

  // Add handler for Add to Log
  const handleAddToLog = () => {
    const selectedActivity = activityTypes.find(type => type.value === activityType);
    if (!selectedActivity || !quantity) return;
    setEntries([
      {
        id: Date.now(),
        date: format(selectedDate, "yyyy-MM-dd"),
        activity: selectedActivity.label,
        type: selectedActivity.label.split(' ')[0],
        amount: quantity,
        unit: selectedActivity.unit,
        co2: calculatedEmissions,
        icon: selectedActivity.icon,
      },
      ...entries,
    ]);
    setShowResult(false);
    setActivityType('');
    setQuantity('');
  };

  const weeklyTotal = entries
    .filter(entry => {
      const entryDate = new Date(entry.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    })
    .reduce((total, entry) => total + entry.co2, 0);

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-background to-accent/5 min-h-screen">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Carbon Footprint Log</h1>
        <p className="text-muted-foreground">Track your daily activities and calculate their environmental impact</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-eco">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {weeklyTotal.toFixed(1)} <span className="text-sm font-normal text-muted-foreground">kg CO₂</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingDown className="h-4 w-4 text-success" />
              <span className="text-sm text-success">8% lower than last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{entries.length}</div>
            <div className="text-sm text-muted-foreground mt-2">Activities logged</div>
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Daily</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              {(weeklyTotal / 7).toFixed(1)} <span className="text-sm font-normal text-muted-foreground">kg CO₂</span>
            </div>
            <div className="text-sm text-muted-foreground mt-2">Per day this week</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Activity Form */}
        <div className="lg:col-span-1">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Log New Activity
              </CardTitle>
              <CardDescription>Add an activity to track its carbon footprint</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Activity Type */}
              <div>
                <Label>Activity Type</Label>
                <Select value={activityType} onValueChange={setActivityType}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select activity type" />
                  </SelectTrigger>
                  <SelectContent>
                    {activityTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {type.label}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity and Unit */}
              {activityType && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label>Unit</Label>
                    <Input
                      value={getSelectedActivityDetails()?.unit || ''}
                      disabled
                      className="mt-1 bg-muted"
                    />
                  </div>
                </div>
              )}

              {/* Date */}
              <div>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full mt-1 justify-start text-left font-normal",
                        !selectedDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Calculate Button */}
              <Button 
                onClick={calculateEmissions}
                disabled={!activityType || !quantity}
                className="w-full btn-hero"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Emissions
              </Button>

              {/* Results */}
              {showResult && (
                <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Estimated Emissions</div>
                    <div className="text-2xl font-bold text-primary">
                      {calculatedEmissions.toFixed(2)} kg CO₂
                    </div>
                  </div>
                  <Button className="w-full mt-3 btn-hero" onClick={handleAddToLog}>
                    Add to Log
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Timeline */}
        <div className="lg:col-span-2">
          <Card className="card-gradient">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Activity Timeline</CardTitle>
                  <CardDescription>Your recent carbon footprint activities</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {entries.map((entry) => {
                  const Icon = entry.icon;
                  return (
                    <div 
                      key={entry.id}
                      className="flex items-center gap-4 p-4 border border-border/50 rounded-lg hover:bg-accent/20 transition-colors hover-lift"
                    >
                      <div className="p-3 bg-accent/20 rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{entry.activity}</div>
                        <div className="text-sm text-muted-foreground">
                          {entry.amount} {entry.unit} • {entry.date}
                        </div>
                      </div>

                      <div className="text-right">
                        <Badge variant="secondary" className="mb-1">
                          {entry.type}
                        </Badge>
                        <div className="text-lg font-bold text-foreground">
                          +{entry.co2} kg
                        </div>
                        <div className="text-xs text-muted-foreground">CO₂</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FootprintLog;