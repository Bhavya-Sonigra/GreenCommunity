'use client';

import { useState, useEffect } from 'react';
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
  ArrowRight,
  Globe
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded-lg" />
});
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { 
  ssr: false,
  loading: () => null
});
const Marker = dynamic(() => import('react-leaflet').then(mod => mod.Marker), { 
  ssr: false,
  loading: () => null
});
const Popup = dynamic(() => import('react-leaflet').then(mod => mod.Popup), { 
  ssr: false,
  loading: () => null
});

// Import Leaflet CSS only on client side
if (typeof window !== 'undefined') {
  try {
    require('leaflet/dist/leaflet.css');
  } catch (error) {
    console.warn('Failed to load Leaflet CSS:', error);
  }
}

const Projects = () => {
  const [viewMode, setViewMode] = useState(() => {
    // Initialize from localStorage if available, otherwise default to 'list'
    if (typeof window !== 'undefined') {
      const savedViewMode = localStorage.getItem('projectsViewMode');
      return savedViewMode || 'list';
    }
    return 'list';
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [contributionAmount, setContributionAmount] = useState([50]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);
  const router = useRouter();

  // Add error boundary
  useEffect(() => {
    try {
      // Component initialization
    } catch (err) {
      setError(err);
      console.error('Projects page error:', err);
    }
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Something went wrong</h2>
              <p className="text-muted-foreground">We're sorry, but something unexpected happened. Please try again.</p>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-white font-semibold py-3 px-6 rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-background border border-border text-foreground font-medium py-3 px-6 rounded-md hover:bg-accent transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }

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
      coordinates: [-60.0, -3.0], // Brazil coordinates
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
      coordinates: [-97.0, 31.0], // Texas coordinates
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
      coordinates: [-120.0, 36.0], // California coordinates
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
      coordinates: [37.0, 1.0], // Kenya coordinates
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
      coordinates: [121.0, 13.0], // Philippines coordinates
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
    if (!project || !project.name) return false;
    
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRegion = selectedRegion === 'all' || project.region === selectedRegion;
    const matchesType = selectedType === 'all' || project.type === selectedType;
    return matchesSearch && matchesRegion && matchesType;
  });

  const handleProjectClick = (projectId) => {
    router.push(`/projects/${projectId}`);
  };

  const handleViewModeChange = (newViewMode) => {
    setViewMode(newViewMode);
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('projectsViewMode', newViewMode);
    }
  };

  const handleContribute = (e, project) => {
    e.stopPropagation(); // Prevent navigation when clicking contribute
    // Contribute logic here
    console.log(`Contribute to ${project.name}`);
  };

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
    try {
      return ((amount * 83) * 0.00036).toFixed(1); // Average CO2 per rupee (adjusted for INR)
    } catch (err) {
      console.error('Error calculating impact:', err);
      return '0.0';
    }
  };

  // Map View Component
  const MapView = () => {
    const filteredMapProjects = filteredProjects.filter(project => project.coordinates);
    const [mapError, setMapError] = useState(false);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [hoveredProject, setHoveredProject] = useState(null);
    
    // Custom marker icon
    const createCustomIcon = (type) => {
      if (typeof window === 'undefined') return null;
      
      try {
        const L = require('leaflet');
        
        const getMarkerColor = (type) => {
          switch (type) {
            case 'forestry': return '#10B981';
            case 'renewable': return '#3B82F6';
            case 'water': return '#06B6D4';
            case 'agriculture': return '#F59E0B';
            default: return '#10B981';
          }
        };

        return L.divIcon({
          html: `
            <div style="
              width: 20px; 
              height: 20px; 
              background-color: ${getMarkerColor(type)}; 
              border: 3px solid white; 
              border-radius: 50%; 
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              position: relative;
            ">
              <div style="
                width: 8px; 
                height: 8px; 
                background-color: white; 
                border-radius: 50%; 
                position: absolute; 
                top: 6px; 
                left: 6px;
              "></div>
            </div>
          `,
          className: 'custom-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });
      } catch (error) {
        console.error('Error creating custom icon:', error);
        setMapError(true);
        return null;
      }
    };

    // Fallback map view when Leaflet fails
    if (mapError) {
      return (
        <div className="h-[700px] sm:h-[800px] lg:h-[900px] rounded-lg border-2 border-primary/20 bg-gradient-to-b from-amber-100 via-orange-50 to-yellow-100 relative overflow-hidden">
          {/* Simple world map background */}
          <div className="absolute inset-0 opacity-30">
            <div className="w-full h-full bg-gradient-to-br from-amber-200 via-orange-100 to-yellow-200"></div>
          </div>
          
          {/* Project markers */}
          {filteredMapProjects.map((project, index) => {
            const [lng, lat] = project.coordinates;
            const left = ((lng + 180) / 360) * 100;
            const top = ((90 - lat) / 180) * 100;
            
            const getPinStyle = (type) => {
              switch (type) {
                case 'forestry': 
                  return 'text-green-500 text-2xl';
                case 'renewable':
                  return 'text-blue-500 text-2xl';
                case 'water':
                  return 'text-cyan-500 text-2xl';
                case 'agriculture':
                  return 'text-yellow-500 text-2xl';
                default:
                  return 'text-green-500 text-2xl';
              }
            };
            
            return (
              <motion.div
                key={project.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
                style={{ left: `${left}%`, top: `${top}%` }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleProjectClick(project.id)}
              >
                <div className={`${getPinStyle(project.type)} group-hover:scale-125 transition-transform duration-200 drop-shadow-lg`}>
                  📍
                </div>
              </motion.div>
            );
          })}
          
          {/* Map controls */}
          <div className="absolute top-4 right-4 z-20">
            {/* Removed List View button */}
          </div>
          
          {/* Map title */}
          <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 border-2 border-gray-200 shadow-xl z-20">
            <div className="flex items-center gap-3">
              <Globe className="h-7 w-7 text-primary" />
              <div>
                <div className="font-semibold text-lg">Global Projects</div>
                <div className="text-sm text-gray-600">{filteredMapProjects.length} active projects</div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="relative h-[700px] sm:h-[800px] lg:h-[900px] rounded-lg border-2 border-primary/20 overflow-hidden">
        <MapContainer
          center={[20, 0]}
          zoom={2}
          minZoom={1}
          maxZoom={18}
          zoomControl={false}
          scrollWheelZoom={false}
          doubleClickZoom={false}
          dragging={false}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
          whenCreated={() => {
            setMapLoaded(true);
          }}
          whenReady={() => {
            setMapLoaded(true);
          }}
        >
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            attribution=""
          />
          
          {filteredMapProjects.map((project, index) => {
            const [lng, lat] = project.coordinates;
            const customIcon = createCustomIcon(project.type);
            
            return (
              <Marker
                key={project.id}
                position={[lat, lng]}
                icon={customIcon}
                eventHandlers={{
                  click: () => handleProjectClick(project.id),
                  mouseover: (e) => {
                    e.target.openPopup();
                    setHoveredProject(project.id);
                  },
                  mouseout: (e) => {
                    e.target.closePopup();
                    setHoveredProject(null);
                  },
                }}
              >
                <Popup autoPan={false} closeButton={false}>
                  <div className="p-3 min-w-[250px] cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => handleProjectClick(project.id)}>
                    <div className="font-semibold text-primary mb-2 text-base">{project.name}</div>
                    <div className="text-gray-600 mb-3 text-sm flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {project.location}
                    </div>
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between">
                        <div className="text-green-600 font-medium text-sm">
                          {project.co2Removed.toLocaleString()} tons CO₂
                        </div>
                        <Badge className="text-xs">
                          {projectTypes.find(t => t.value === project.type)?.label || project.type}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{project.contributors.toLocaleString()} contributors</span>
                        <span>{project.timeRemaining} remaining</span>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 border-t pt-2">
                      Click to view full details →
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-30">
          {/* Removed List View button */}
        </div>



        {/* Map Title */}
        <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 border-2 border-gray-200 shadow-xl z-30">
          <div className="flex items-center gap-3">
            <Globe className="h-7 w-7 text-primary" />
            <div>
              <div className="font-semibold text-lg">Global Projects</div>
              <div className="text-sm text-gray-600">{filteredMapProjects.length} active projects</div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  try {
    return (
      <div className="p-2 sm:p-4 space-y-2 sm:space-y-4 bg-gradient-to-b from-background to-accent/5 min-h-screen">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-lg sm:text-2xl font-bold text-gradient">Carbon Offset Projects</h1>
          <p className="text-xs sm:text-sm text-muted-foreground">Support verified projects that remove CO₂ from the atmosphere</p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-sm"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            <Select value={selectedRegion} onValueChange={setSelectedRegion}>
              <SelectTrigger className="w-full sm:w-36 text-sm">
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.value} value={region.value}>
                    {region.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full sm:w-36 text-sm">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                {projectTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* View Mode Toggle */}
            <div className="flex gap-1 p-1 bg-muted rounded-lg">
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewModeChange('list')}
                className="h-8 px-3"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewModeChange('map')}
                className="h-8 px-3"
              >
                <Map className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'map' ? (
          <div className="relative flex-1">
            <MapView />
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-6">
            {filteredProjects.map((project, index) => {
              const IconComponent = getProjectIcon(project.type);
              const fundingPercentage = (project.currentFunding / project.totalFunding) * 100;
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="cursor-pointer"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                        {/* Project Image */}
                        <div className="relative w-full sm:w-96 h-64 sm:h-80 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-primary/10">
                          <img
                            src={project.image}
                            alt={project.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = '/tree1.jpg'; // Fallback image
                            }}
                          />
                          {project.verified && (
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-green-600 shadow-md">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            </div>
                          )}
                          {project.featured && (
                            <div className="absolute top-2 left-2">
                              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                                <Award className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            </div>
                          )}
                        </div>

                        {/* Project Info */}
                        <div className="flex-1 space-y-3 sm:space-y-4">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1">
                                  {project.name}
                                </h3>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                  <MapPin className="h-4 w-4" />
                                  {project.location}
                                </div>
                              </div>
                              <Badge className={getTypeColor(project.type)}>
                                <IconComponent className="h-3 w-3 mr-1" />
                                {projectTypes.find(t => t.value === project.type)?.label || project.type}
                              </Badge>
                            </div>
                            <p className="text-sm sm:text-base text-muted-foreground">
                              {project.description}
                            </p>
                          </div>

                          {/* Project Stats */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                            <div className="text-center">
                              <div className="text-lg sm:text-xl font-bold text-primary">
                                {project.co2Removed.toLocaleString()}
                              </div>
                              <div className="text-xs sm:text-sm text-muted-foreground">tons CO₂</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg sm:text-xl font-bold text-primary">
                                {project.contributors.toLocaleString()}
                              </div>
                              <div className="text-xs sm:text-sm text-muted-foreground">contributors</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg sm:text-xl font-bold text-primary">
                                {project.timeRemaining}
                              </div>
                              <div className="text-xs sm:text-sm text-muted-foreground">remaining</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg sm:text-xl font-bold text-primary">
                                ₹{(project.co2PerRupee * 1000000).toFixed(2)}
                              </div>
                              <div className="text-xs sm:text-sm text-muted-foreground">per ton</div>
                            </div>
                          </div>

                          {/* Funding Progress */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-xs sm:text-sm text-muted-foreground">Funding Progress</span>
                              <span className="font-medium text-xs sm:text-sm">
                                ₹{(project.currentFunding/10000000).toFixed(1)}Cr / ₹{(project.totalFunding/10000000).toFixed(1)}Cr
                              </span>
                            </div>
                            <Progress value={fundingPercentage} className="h-2 sm:h-3 progress-eco" />
                            <div className="text-xs sm:text-sm text-muted-foreground">
                              {fundingPercentage.toFixed(0)}% funded
                            </div>
                          </div>

                          {/* Action Button */}
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  className="btn-hero text-xs sm:text-base px-3 sm:px-5 py-2 sm:py-3"
                                  onClick={(e) => {
                                    e.stopPropagation(); // Prevent navigation
                                    setContributionAmount([50]); // Reset to default
                                    setIsLoading(false);
                                  }}
                                >
                                  <Heart className="h-4 w-4 mr-2" />
                                  Contribute
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="text-lg sm:text-xl">Support {project.name}</DialogTitle>
                                  <DialogDescription className="text-sm">
                                    Choose your contribution amount to help offset carbon emissions
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div>
                                    <Label className="text-xs sm:text-sm">Contribution Amount: ₹{(contributionAmount[0] * 83).toLocaleString()}</Label>
                                    <Slider
                                      value={contributionAmount}
                                      onValueChange={setContributionAmount}
                                      max={50000}
                                      min={1000}
                                      step={1000}
                                      className="mt-2"
                                    />
                                  </div>
                                  <div className="p-3 sm:p-4 bg-primary/10 rounded-lg">
                                    <div className="text-center">
                                      <div className="text-xs sm:text-sm text-muted-foreground">Your Impact</div>
                                      <div className="text-xl sm:text-2xl font-bold text-primary">
                                        {calculateImpact(contributionAmount[0])} tons CO₂
                                      </div>
                                      <div className="text-xs sm:text-sm text-muted-foreground">will be offset</div>
                                    </div>
                                  </div>
                                </div>
                                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                                  <Button 
                                    className="w-full btn-hero text-xs sm:text-base px-3 sm:px-5 py-2 sm:py-3" 
                                    onClick={() => {
                                      setIsLoading(true);
                                      try {
                                        router.push(`/payment?project=${encodeURIComponent(project.name)}&amount=${contributionAmount[0] * 83}`);
                                      } catch (error) {
                                        console.error('Navigation error:', error);
                                        setIsLoading(false);
                                      }
                                    }}
                                    disabled={isLoading}
                                  >
                                    {isLoading ? 'Processing...' : `Contribute ₹${(contributionAmount[0] * 83).toLocaleString()}`}
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                            <Button variant="outline" className="text-xs sm:text-base px-3 sm:px-5 py-2 sm:py-3">
                              Learn More
                              <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}

        {filteredProjects.length === 0 && (
          <div className="text-center py-8 sm:py-12">
            <div className="text-muted-foreground text-sm sm:text-lg">No projects found</div>
            <p className="text-muted-foreground text-xs sm:text-base">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    );
  } catch (err) {
    console.error('Error rendering Projects component:', err);
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Something went wrong</h2>
              <p className="text-muted-foreground">We're sorry, but something unexpected happened. Please try again.</p>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-primary text-white font-semibold py-3 px-6 rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-background border border-border text-foreground font-medium py-3 px-6 rounded-md hover:bg-accent transition-colors"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    );
  }
};

export default Projects;