"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  MapPin, 
  Calendar, 
  Leaf, 
  Trees, 
  Wind, 
  Sun,
  Star,
  TrendingUp
} from 'lucide-react';

export default function MarketplacePage() {
  const projects = [
    {
      id: 1,
      title: "Amazon Rainforest Conservation",
      description: "Protect 10,000 acres of pristine Amazon rainforest from deforestation",
      location: "Brazil",
      type: "Forest Conservation",
      price: 12,
      rating: 4.9,
      verified: true,
      impact: "2.3 tons CO₂/credit",
      deadline: "2025-12-31",
      progress: 78,
      icon: Trees,
      color: "text-green-500"
    },
    {
      id: 2,
      title: "Wind Farm Development",
      description: "Support clean energy generation through wind farm expansion",
      location: "Denmark",
      type: "Renewable Energy",
      price: 8,
      rating: 4.7,
      verified: true,
      impact: "1.8 tons CO₂/credit",
      deadline: "2025-08-15",
      progress: 45,
      icon: Wind,
      color: "text-blue-500"
    },
    {
      id: 3,
      title: "Solar Panel Initiative",
      description: "Install solar panels in rural communities to replace fossil fuel dependency",
      location: "India",
      type: "Solar Energy",
      price: 15,
      rating: 4.8,
      verified: true,
      impact: "2.1 tons CO₂/credit",
      deadline: "2025-10-20",
      progress: 62,
      icon: Sun,
      color: "text-yellow-500"
    },
    {
      id: 4,
      title: "Mangrove Restoration",
      description: "Restore coastal mangrove forests to protect biodiversity and sequester carbon",
      location: "Philippines",
      type: "Ecosystem Restoration",
      price: 10,
      rating: 4.6,
      verified: true,
      impact: "1.9 tons CO₂/credit",
      deadline: "2025-11-30",
      progress: 33,
      icon: Leaf,
      color: "text-emerald-500"
    }
  ];

  const categories = [
    { name: "All Projects", count: 24 },
    { name: "Forest Conservation", count: 8 },
    { name: "Renewable Energy", count: 10 },
    { name: "Ecosystem Restoration", count: 6 }
  ];

  return (
    <div className="p-5 space-y-8 bg-gradient-to-br from-background via-accent/5 to-primary/5 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3 flex-wrap">
        {categories.map((category, index) => (
          <Badge 
            key={category.name}
            variant={index === 0 ? "default" : "secondary"}
            className="px-4 py-2 text-sm cursor-pointer hover:bg-primary/20 transition-colors"
          >
            {category.name} ({category.count})
          </Badge>
        ))}
      </div>
        <div className="flex gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </div>

      {/* Categories */}
      


      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-premium hover-glow">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Available Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">24</div>
            <div className="text-sm text-success flex items-center gap-1 mt-1">
              <TrendingUp className="h-3 w-3" />
              +3 this week
            </div>
          </CardContent>
        </Card>

        <Card className="card-floating hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Total Impact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">12.5K</div>
            <div className="text-sm text-muted-foreground">tons CO₂ offset</div>
          </CardContent>
        </Card>

        <Card className="card-floating hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Average Price</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">$11</div>
            <div className="text-sm text-muted-foreground">per credit</div>
          </CardContent>
        </Card>

        <Card className="card-floating hover-lift">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-semibold text-muted-foreground">Verified Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">100%</div>
            <div className="text-sm text-success">All verified</div>
          </CardContent>
        </Card>
      </div>

      
      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => {
          const Icon = project.icon;
          return (
            <Card key={project.id} className="card-premium hover-lift cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl bg-accent/20 ${project.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{project.title}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">{project.location}</span>
                        {project.verified && (
                          <Badge variant="secondary" className="text-xs">Verified</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">${project.price}</div>
                    <div className="text-xs text-muted-foreground">per credit</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-muted-foreground">Impact</div>
                    <div className="text-sm font-semibold">{project.impact}</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Rating</div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">{project.rating}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    Ends {project.deadline}
                  </div>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    Invest Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
