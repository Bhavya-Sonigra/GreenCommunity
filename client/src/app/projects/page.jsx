'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Trees, 
  Wind, 
  Sun, 
  Droplets, 
  MapPin, 
  Award, 
  Users,
  Calendar,
  Target,
  Heart,
  Search,
  Filter,
  Map,
  List,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const Projects = () => {
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [contributionAmount, setContributionAmount] = useState([50]);

  const regions = [
    { value: 'all', label: 'All Regions' },
    { value: 'north-america', label: 'North America' },
    { value: 'south-america', label: 'South America' },
    { value: 'europe', label: 'Europe' },
    { value: 'africa', label: 'Africa' },
    { value: 'asia', label: 'Asia' },
    { value: 'oceania', label: 'Oceania' },
  ];

  const projectTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'forestry', label: 'Forestry & Land Use' },
    { value: 'renewable', label: 'Renewable Energy' },
    { value: 'water', label: 'Water Conservation' },
    { value: 'agriculture', label: 'Sustainable Agriculture' },
  ];

  const projects = [
    {
      id: 1,
      name: 'Amazon Rainforest Restoration',
      location: 'Brazil, South America',
      type: 'forestry',
      region: 'south-america',
      image: "/tree1.jpg",
      description: 'Large-scale reforestation project protecting and restoring 50,000 hectares of Amazon rainforest',
      co2Removed: 125000,
      co2PerRupee: 0.00036,  // Adjusted for INR (0.03/83)
      totalFunding: 207500000, // 2.5M USD * 83
      currentFunding: 155625000, // 1.875M USD * 83,
      contributors: 15420,
      timeRemaining: '8 months',
      verified: true,
      certifications: ['Gold Standard', 'VCS'],
      featured: false,
      benefits: [
        'Biodiversity protection',
        'Indigenous community support',
        'Soil conservation',
        'Water cycle regulation'
      ]
    },
    {
      id: 2,
      name: 'Wind Farm Development',
      location: 'Texas, USA',
      type: 'renewable',
      region: 'north-america',
      image: "/tree2.jpg",
      description: 'Clean energy generation through wind turbines, providing renewable power to 25,000 homes',
      co2Removed: 75000,
      co2PerRupee: 0.00027, // Adjusted for INR (0.022/83)
      totalFunding: 415000000, // 5M USD * 83
      currentFunding: 265600000, // 3.2M USD * 83,
      contributors: 8765,
      timeRemaining: '12 months',
      verified: true,
      certifications: ['CDM', 'ACR'],
      featured: false,
      benefits: [
        'Clean energy generation',
        'Job creation',
        'Energy independence',
        'Community investment'
      ]
    },
    {
      id: 3,
      name: 'Ocean Kelp Forest Restoration',
      location: 'California, USA',
      type: 'water',
      region: 'north-america',
      image: "/tree3.jpg",
      description: 'Restoring underwater kelp forests to sequester carbon and support marine ecosystems',
      co2Removed: 45000,
      co2PerRupee: 0.00047, // Adjusted for INR (0.039/83)
      totalFunding: 66400000, // 800K USD * 83
      currentFunding: 43160000, // 520K USD * 83,
      contributors: 3240,
      timeRemaining: '6 months',
      verified: true,
      certifications: ['VCS', 'CAR'],
      featured: true,
      benefits: [
        'Marine biodiversity',
        'Carbon sequestration',
        'Fisheries support',
        'Coastal protection'
      ]
    },
    {
      id: 4,
      name: 'Solar Energy Cooperative',
      location: 'Kenya, Africa',
      type: 'renewable',
      region: 'africa',
      image: "/tree4.jpg",
      description: 'Community-owned solar installation providing clean energy access to rural villages',
      co2Removed: 32000,
      co2PerRupee: 0.0003, // Adjusted for INR (0.025/83)
      totalFunding: 37350000, // 450K USD * 83
      currentFunding: 23655000, // 285K USD * 83,
      contributors: 1890,
      timeRemaining: '4 months',
      verified: true,
      certifications: ['Gold Standard'],
      featured: false,
      benefits: [
        'Energy access',
        'Women empowerment',
        'Education support',
        'Healthcare improvement'
      ]
    },
    {
      id: 5,
      name: 'Mangrove Conservation',
      location: 'Philippines, Asia',
      type: 'forestry',
      region: 'asia',
      image: "/tree5.jpg",
      description: 'Protecting and restoring mangrove ecosystems crucial for coastal communities and carbon storage',
      co2Removed: 85000,
      co2PerRupee: 0.00041, // Adjusted for INR (0.034/83)
      totalFunding: 99600000, // 1.2M USD * 83
      currentFunding: 74700000, // 900K USD * 83,
      contributors: 6750,
      timeRemaining: '10 months',
      verified: true,
      certifications: ['VCS', 'CCBS'],
      featured: true,
      benefits: [
        'Coastal protection',
        'Fisheries enhancement',
        'Storm surge reduction',
        'Community livelihoods'
      ]
    }
  ];
  
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || project.region === selectedRegion;
    const matchesType = selectedType === 'all' || project.type === selectedType;
    return matchesSearch && matchesRegion && matchesType;
  });

  const getProjectIcon = (type) => {
    switch (type) {
      case 'forestry': return Trees;
      case 'renewable': return Wind;
      case 'water': return Droplets;
      case 'agriculture': return Sun;
      default: return Trees;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'forestry': return 'text-green-600 bg-green-100';
      case 'renewable': return 'text-blue-600 bg-blue-100';
      case 'water': return 'text-cyan-600 bg-cyan-100';
      case 'agriculture': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const calculateImpact = (amount) => {
    return ((amount * 83) * 0.00036).toFixed(1); // Average CO2 per rupee (adjusted for INR)
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-background to-accent/5 min-h-screen">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gradient">Carbon Offset Projects</h1>
        <p className="text-muted-foreground">Support verified projects that remove CO₂ from the atmosphere</p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex gap-3">
          <Select value={selectedRegion} onValueChange={setSelectedRegion}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map(region => (
                <SelectItem key={region.value} value={region.value}>
                  {region.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Project Type" />
            </SelectTrigger>
            <SelectContent>
              {projectTypes.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'map' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('map')}
            >
              <Map className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="space-y-6">
        {filteredProjects.map((project, index) => {
          const Icon = getProjectIcon(project.type);
          const fundingPercentage = (project.currentFunding / project.totalFunding) * 100;
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              key={project.id}
            >
              <Card className="card-gradient">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                {/* Project Image */}
                <div className="relative">
                  <img 
                    src={project.image} 
                    alt={project.name}
                    className="w-full h-48 lg:h-full object-cover rounded-lg"
                  />
                  {project.verified && (
                    <Badge className="absolute top-3 right-3 bg-success text-white">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>

                {/* Project Details */}
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h3 className="text-xl font-bold text-foreground">{project.name}</h3>
                      <div className="flex gap-2">
                        {project.certifications.map(cert => (
                          <Badge key={cert} variant="outline" className="text-xs">
                            <Award className="h-3 w-3 mr-1" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{project.location}</span>
                      </div>
                      <Badge className={`${getTypeColor(project.type)}`}>
                        <Icon className="h-3 w-3 mr-1" />
                        {projectTypes.find(t => t.value === project.type)?.label}
                      </Badge>
                    </div>
                    
                    <p className="text-muted-foreground">{project.description}</p>
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-accent/20 rounded-lg">
                      <div className="text-lg font-bold text-foreground">
                        {(project.co2Removed / 1000).toFixed(0)}k
                      </div>
                      <div className="text-xs text-muted-foreground">tons CO₂</div>
                    </div>
                    <div className="text-center p-3 bg-accent/20 rounded-lg">
                      <div className="text-lg font-bold text-foreground">
                        {project.contributors.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">contributors</div>
                    </div>
                    <div className="text-center p-3 bg-accent/20 rounded-lg">
                      <div className="text-lg font-bold text-foreground">
                        ₹{project.co2PerRupee}
                      </div>
                      <div className="text-xs text-muted-foreground">CO₂/rupee</div>
                    </div>
                    <div className="text-center p-3 bg-accent/20 rounded-lg">
                      <div className="text-lg font-bold text-foreground">
                        {project.timeRemaining}
                      </div>
                      <div className="text-xs text-muted-foreground">remaining</div>
                    </div>
                  </div>

                  {/* Funding Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Funding Progress</span>
                      <span className="font-medium">
                        ₹{(project.currentFunding/10000000).toFixed(1)}Cr / ₹{(project.totalFunding/10000000).toFixed(1)}Cr
                      </span>
                    </div>
                    <Progress value={fundingPercentage} className="h-3 progress-eco" />
                    <div className="text-sm text-muted-foreground">
                      {fundingPercentage.toFixed(0)}% funded
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex gap-3 pt-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="btn-hero">
                          <Heart className="h-4 w-4 mr-2" />
                          Contribute
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Support {project.name}</DialogTitle>
                          <DialogDescription>
                            Choose your contribution amount to help offset carbon emissions
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div>
                            <Label>Contribution Amount: ₹{(contributionAmount[0] * 83).toLocaleString()}</Label>
                            <Slider
                              value={contributionAmount}
                              onValueChange={setContributionAmount}
                              max={50000}
                              min={1000}
                              step={1000}
                              className="mt-2"
                            />
                          </div>
                          <div className="p-4 bg-primary/10 rounded-lg">
                            <div className="text-center">
                              <div className="text-sm text-muted-foreground">Your Impact</div>
                              <div className="text-2xl font-bold text-primary">
                                {calculateImpact(contributionAmount[0])} tons CO₂
                              </div>
                              <div className="text-sm text-muted-foreground">will be offset</div>
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button className="w-full btn-hero">
                            Contribute ₹{(contributionAmount[0] * 83).toLocaleString()}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                    <Button variant="outline">
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )
      })}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg">No projects found</div>
          <p className="text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
};

export default Projects;