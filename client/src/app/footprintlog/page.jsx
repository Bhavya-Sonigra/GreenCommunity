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
  
  // Additional details based on activity type
  const [fuelType, setFuelType] = useState('');
  const [passengers, setPassengers] = useState('1');
  const [flightClass, setFlightClass] = useState('');
  const [energySource, setEnergySource] = useState('');
  const [foodType, setFoodType] = useState('');

  const activityTypes = [
    { 
      value: 'transport-car', 
      label: 'Car Travel', 
      icon: Car, 
      unit: 'miles', 
      factor: 0.4,
      requiresFuelType: true,
      requiresPassengers: true
    },
    { 
      value: 'transport-flight', 
      label: 'Flight', 
      icon: Plane, 
      unit: 'miles', 
      factor: 0.2,
      requiresFlightClass: true,
      requiresPassengers: true
    },
    { 
      value: 'energy-electricity', 
      label: 'Electricity', 
      icon: Home, 
      unit: 'kWh', 
      factor: 0.5,
      requiresEnergySource: true
    },
    { 
      value: 'energy-gas', 
      label: 'Natural Gas', 
      icon: Home, 
      unit: 'therms', 
      factor: 5.3
    },
    { 
      value: 'food-meat', 
      label: 'Meat Consumption', 
      icon: Utensils, 
      unit: 'lbs', 
      factor: 6.5,
      requiresFoodType: true
    },
    { 
      value: 'food-dairy', 
      label: 'Dairy Products', 
      icon: Utensils, 
      unit: 'lbs', 
      factor: 3.2,
      requiresFoodType: true
    },
  ];

  // Fuel type options
  const fuelTypes = [
    { value: 'petrol', label: 'Petrol/Gasoline', factor: 1.0 },
    { value: 'diesel', label: 'Diesel', factor: 1.2 },
    { value: 'cng', label: 'CNG', factor: 0.7 },
    { value: 'electric', label: 'Electric', factor: 0.3 },
    { value: 'hybrid', label: 'Hybrid', factor: 0.6 },
  ];

  // Flight class options
  const flightClasses = [
    { value: 'economy', label: 'Economy', factor: 1.0 },
    { value: 'business', label: 'Business', factor: 2.5 },
    { value: 'first', label: 'First Class', factor: 4.0 },
  ];

  // Energy source options
  const energySources = [
    { value: 'grid', label: 'Grid Electricity', factor: 1.0 },
    { value: 'solar', label: 'Solar Power', factor: 0.1 },
    { value: 'wind', label: 'Wind Power', factor: 0.1 },
    { value: 'hydro', label: 'Hydroelectric', factor: 0.2 },
  ];

  // Food type options
  const foodTypes = [
    { value: 'beef', label: 'Beef', factor: 1.5 },
    { value: 'pork', label: 'Pork', factor: 1.0 },
    { value: 'chicken', label: 'Chicken', factor: 0.6 },
    { value: 'fish', label: 'Fish', factor: 0.5 },
    { value: 'milk', label: 'Milk', factor: 1.0 },
    { value: 'cheese', label: 'Cheese', factor: 1.2 },
    { value: 'yogurt', label: 'Yogurt', factor: 0.8 },
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
      let baseEmissions = parseFloat(quantity) * selectedActivity.factor;
      
      // Apply additional factors based on activity type
      if (selectedActivity.requiresFuelType && fuelType) {
        const fuelFactor = fuelTypes.find(f => f.value === fuelType)?.factor || 1.0;
        baseEmissions *= fuelFactor;
      }
      
      if (selectedActivity.requiresFlightClass && flightClass) {
        const classFactor = flightClasses.find(f => f.value === flightClass)?.factor || 1.0;
        baseEmissions *= classFactor;
      }
      
      if (selectedActivity.requiresEnergySource && energySource) {
        const energyFactor = energySources.find(e => e.value === energySource)?.factor || 1.0;
        baseEmissions *= energyFactor;
      }
      
      if (selectedActivity.requiresFoodType && foodType) {
        const foodFactor = foodTypes.find(f => f.value === foodType)?.factor || 1.0;
        baseEmissions *= foodFactor;
      }
      
      // Divide by number of passengers for shared transport
      if (selectedActivity.requiresPassengers && parseInt(passengers) > 1) {
        baseEmissions /= parseInt(passengers);
      }
      
      setCalculatedEmissions(baseEmissions);
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
    
    // Create detailed activity description
    let activityDescription = selectedActivity.label;
    if (activityType === 'transport-car' && fuelType) {
      const fuelLabel = fuelTypes.find(f => f.value === fuelType)?.label;
      activityDescription = `${fuelLabel} Car Travel`;
    } else if (activityType === 'transport-flight' && flightClass) {
      const classLabel = flightClasses.find(f => f.value === flightClass)?.label;
      activityDescription = `${classLabel} Flight`;
    } else if (activityType === 'energy-electricity' && energySource) {
      const sourceLabel = energySources.find(e => e.value === energySource)?.label;
      activityDescription = `${sourceLabel} Usage`;
    } else if ((activityType === 'food-meat' || activityType === 'food-dairy') && foodType) {
      const foodLabel = foodTypes.find(f => f.value === foodType)?.label;
      activityDescription = `${foodLabel} Consumption`;
    }
    
    setEntries([
      {
        id: Date.now(),
        date: format(selectedDate, "yyyy-MM-dd"),
        activity: activityDescription,
        type: selectedActivity.label.split(' ')[0],
        amount: quantity,
        unit: selectedActivity.unit,
        co2: calculatedEmissions,
        icon: selectedActivity.icon,
        details: {
          fuelType,
          passengers,
          flightClass,
          energySource,
          foodType,
        }
      },
      ...entries,
    ]);
    
    // Reset form
    setShowResult(false);
    setActivityType('');
    setQuantity('');
    setFuelType('');
    setPassengers('1');
    setFlightClass('');
    setEnergySource('');
    setFoodType('');
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
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 bg-gradient-to-b from-background to-accent/5 min-h-screen">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gradient">Carbon Footprint Log</h1>
        <p className="text-sm sm:text-base text-muted-foreground">Track your daily activities and calculate their environmental impact</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <Card className="card-eco">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {weeklyTotal.toFixed(1)} <span className="text-xs sm:text-sm font-normal text-muted-foreground">kg CO₂</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-success" />
              <span className="text-xs sm:text-sm text-success">8% lower than last week</span>
            </div>
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-foreground">{entries.length}</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-2">Activities logged</div>
          </CardContent>
        </Card>

        <Card className="card-gradient">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Daily</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-foreground">
              {(weeklyTotal / 7).toFixed(1)} <span className="text-xs sm:text-sm font-normal text-muted-foreground">kg CO₂</span>
            </div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-2">Per day this week</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
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
            <CardContent className="space-y-3 sm:space-y-4">
              {/* Activity Type */}
              <div>
                <Label className="text-sm sm:text-base">Activity Type</Label>
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm sm:text-base">Quantity</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm sm:text-base">Unit</Label>
                    <Input
                      value={getSelectedActivityDetails()?.unit || ''}
                      disabled
                      className="mt-1 bg-muted"
                    />
                  </div>
                </div>
              )}

              {/* Fuel Type for Car Travel */}
              {activityType === 'transport-car' && (
                <div>
                  <Label className="text-sm sm:text-base">Fuel Type</Label>
                  <Select value={fuelType} onValueChange={setFuelType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select fuel type" />
                    </SelectTrigger>
                    <SelectContent>
                      {fuelTypes.map((fuel) => (
                        <SelectItem key={fuel.value} value={fuel.value}>
                          {fuel.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Flight Class for Air Travel */}
              {activityType === 'transport-flight' && (
                <div>
                  <Label className="text-sm sm:text-base">Flight Class</Label>
                  <Select value={flightClass} onValueChange={setFlightClass}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select flight class" />
                    </SelectTrigger>
                    <SelectContent>
                      {flightClasses.map((classType) => (
                        <SelectItem key={classType.value} value={classType.value}>
                          {classType.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Energy Source for Electricity */}
              {activityType === 'energy-electricity' && (
                <div>
                  <Label className="text-sm sm:text-base">Energy Source</Label>
                  <Select value={energySource} onValueChange={setEnergySource}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select energy source" />
                    </SelectTrigger>
                    <SelectContent>
                      {energySources.map((source) => (
                        <SelectItem key={source.value} value={source.value}>
                          {source.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Food Type for Food Consumption */}
              {(activityType === 'food-meat' || activityType === 'food-dairy') && (
                <div>
                  <Label className="text-sm sm:text-base">Food Type</Label>
                  <Select value={foodType} onValueChange={setFoodType}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select food type" />
                    </SelectTrigger>
                    <SelectContent>
                      {foodTypes.map((food) => (
                        <SelectItem key={food.value} value={food.value}>
                          {food.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Number of Passengers for Transport */}
              {(activityType === 'transport-car' || activityType === 'transport-flight') && (
                <div>
                  <Label className="text-sm sm:text-base">Number of Passengers</Label>
                  <Input
                    type="number"
                    min="1"
                    placeholder="1"
                    value={passengers}
                    onChange={(e) => {
                      setPassengers(e.target.value);
                    }}
                    onBlur={(e) => {
                      const value = parseInt(e.target.value);
                      if (isNaN(value) || value < 1) {
                        setPassengers('1');
                      }
                    }}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Emissions will be divided by the number of passengers
                  </p>
                </div>
              )}

              {/* Date */}
              <div>
                <Label className="text-sm sm:text-base">Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full mt-1 justify-start text-left font-normal text-sm sm:text-base",
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
                disabled={
                  !activityType || 
                  !quantity || 
                  (activityType === 'transport-car' && !fuelType) ||
                  (activityType === 'transport-flight' && !flightClass) ||
                  (activityType === 'energy-electricity' && !energySource) ||
                  ((activityType === 'food-meat' || activityType === 'food-dairy') && !foodType)
                }
                className="w-full btn-hero text-sm sm:text-base"
              >
                <Calculator className="h-4 w-4 mr-2" />
                Calculate Emissions
              </Button>

              {/* Results */}
              {showResult && (
                <div className="p-3 sm:p-4 bg-primary/10 border border-primary/20 rounded-lg">
                  <div className="text-center">
                    <div className="text-xs sm:text-sm text-muted-foreground">Estimated Emissions</div>
                    <div className="text-xl sm:text-2xl font-bold text-primary">
                      {calculatedEmissions.toFixed(2)} kg CO₂
                    </div>
                  </div>
                  <Button className="w-full mt-3 btn-hero text-sm sm:text-base" onClick={handleAddToLog}>
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
              <div className="space-y-3 sm:space-y-4">
                {entries.map((entry) => {
                  const Icon = entry.icon;
                  return (
                    <div 
                      key={entry.id}
                      className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border border-border/50 rounded-lg hover:bg-accent/20 transition-colors hover-lift"
                    >
                      <div className="p-2 sm:p-3 bg-accent/20 rounded-lg">
                        <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="font-medium text-foreground text-sm sm:text-base">{entry.activity}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">
                          {entry.amount} {entry.unit} • {entry.date}
                        </div>
                      </div>

                      <div className="text-right">
                        <Badge variant="secondary" className="mb-1 text-xs">
                          {entry.type}
                        </Badge>
                        <div className="text-base sm:text-lg font-bold text-foreground">
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