"use client";

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MapPin, 
  Users,
  Calendar,
  Target,
  Trees, 
  Wind, 
  Sun, 
  Droplets,
  Award,
  CheckCircle
} from 'lucide-react';

const ProjectDetail = () => {
  const params = useParams();
  const router = useRouter();
  const [contributionAmount, setContributionAmount] = useState([50]);
  const [isLoading, setIsLoading] = useState(false);

  // Simplified project data
  const projects = [
    {
      id: 1,
      name: 'Sundarbans Mangrove Restoration',
      location: 'West Bengal, India',
      type: 'forestry',
      image: "/tree1.jpg",
      description: 'Large-scale mangrove restoration project in the Sundarbans, protecting vital ecosystems.',
      co2Removed: 142000,
      co2PerRupee: 0.0005,
      totalFunding: 165000000,
      currentFunding: 123750000,
      contributors: 15230,
      timeRemaining: '9 months',
      verified: true,
      certifications: ['Gold Standard', 'VCS'],
      featured: false,
      benefits: [
        'Biodiversity protection',
        'Community support',
        'Coastal protection',
        'Fisheries development'
      ]
    },
    {
      id: 2,
      name: 'Solar Power Expansion',
      location: 'Rajasthan, India',
      type: 'renewable',
      image: "/tree2.jpg",
      description: 'Installing solar panels for renewable energy generation across Rajasthan.',
      co2Removed: 98000,
      co2PerRupee: 0.00034,
      totalFunding: 430000000,
      currentFunding: 280000000,
      contributors: 9250,
      timeRemaining: '15 months',
      verified: true,
      certifications: ['MNRE', 'SECI'],
      featured: true,
      benefits: [
        'Clean energy',
        'Job creation',
        'Energy independence',
        'Infrastructure improvement'
      ]
    },
    {
      id: 3,
      name: 'Ganga Water Conservation',
      location: 'Uttar Pradesh, India',
      type: 'water',
      image: "/tree3.jpg",
      description: 'Conserving water resources and improving water quality in the Ganga basin.',
      co2Removed: 50000,
      co2PerRupee: 0.00042,
      totalFunding: 76000000,
      currentFunding: 48200000,
      contributors: 3400,
      timeRemaining: '7 months',
      verified: true,
      certifications: ['NMCG', 'CPCB'],
      featured: false,
      benefits: [
        'Water conservation',
        'Wildlife habitat',
        'Tourism development',
        'Pollution reduction'
      ]
    },
    {
      id: 4,
      name: 'Wind Energy Farms',
      location: 'Tamil Nadu, India',
      type: 'renewable',
      image: "/tree4.jpg",
      description: 'Developing wind farms to harness clean energy in Tamil Nadu.',
      co2Removed: 60000,
      co2PerRupee: 0.00031,
      totalFunding: 39000000,
      currentFunding: 25500000,
      contributors: 1990,
      timeRemaining: '5 months',
      verified: true,
      certifications: ['CEIG', 'MoEFCC'],
      featured: false,
      benefits: [
        'Energy production',
        'Employment opportunities',
        'Local business growth',
        'Environmental sustainability'
      ]
    },
    {
      id: 5,
      name: 'Tropical Savanna Conservation',
      location: 'Chhattisgarh, India',
      type: 'forestry',
      image: "/tree5.jpg",
      description: 'Protecting and restoring tropical savanna ecosystems in Chhattisgarh.',
      co2Removed: 85000,
      co2PerRupee: 0.00044,
      totalFunding: 102000000,
      currentFunding: 76500000,
      contributors: 6890,
      timeRemaining: '11 months',
      verified: true,
      certifications: ['WWF', 'Govt of India'],
      featured: true,
      benefits: [
        'Biodiversity conservation',
        'Carbon storage',
        'Community livelihoods',
        'Climate resilience'
      ]
    }
  ];

  const projectId = parseInt(params.id);
  const project = projects.find(p => p.id === projectId);

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist.</p>
          <Button onClick={() => router.push('/projects')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const fundingPercentage = (project.currentFunding / project.totalFunding) * 100;
  
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
      case 'forestry': return 'text-green-600';
      case 'renewable': return 'text-blue-600';
      case 'water': return 'text-cyan-600';
      case 'agriculture': return 'text-orange-600';
      default: return 'text-green-600';
    }
  };

  const calculateImpact = (amount) => {
    return (amount * project.co2PerRupee).toFixed(2);
  };

  const ProjectIcon = getProjectIcon(project.type);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/projects')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
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
          {/* Project Image */}
          <div className="space-y-4">
            <div className="aspect-video overflow-hidden rounded-lg border">
              <img 
                src={project.image} 
                alt={project.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/tree1.jpg'; // Fallback
                }}
              />
            </div>
            
            {/* Data below the main photo */}
            <div className="space-y-4">
              {/* Project Overview */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-3">Project Overview</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Location</p>
                        <p className="text-sm font-medium">{project.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="text-xs text-muted-foreground">CO₂ Offset</p>
                        <p className="text-sm font-medium text-green-600">-{project.co2Removed.toLocaleString()} tons</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Contributors</p>
                        <p className="text-sm font-medium">{project.contributors.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Time Left</p>
                        <p className="text-sm font-medium">{project.timeRemaining}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-3">Quick Stats</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-green-600">{fundingPercentage.toFixed(0)}%</p>
                      <p className="text-xs text-muted-foreground">Funded</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-blue-600">₹{(project.currentFunding/10000000).toFixed(1)}Cr</p>
                      <p className="text-xs text-muted-foreground">Raised</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-orange-600">₹{((project.totalFunding - project.currentFunding)/10000000).toFixed(1)}Cr</p>
                      <p className="text-xs text-muted-foreground">Needed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Project Highlights */}
              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-foreground mb-3">Project Highlights</h3>
                  <div className="space-y-2">
                    {project.benefits.slice(0, 3).map((benefit, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Project Info */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {project.type.replace('-', ' ').toUpperCase()}
                </Badge>
                {project.featured && (
                  <Badge className="bg-primary text-primary-foreground text-xs">
                    Featured
                  </Badge>
                )}
                {project.verified && (
                  <Badge className="bg-green-600 text-white text-xs">
                    Verified
                  </Badge>
                )}
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                {project.name}
              </h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{project.location}</span>
                </div>
                <div className="flex items-center gap-1 text-green-600">
                  <Target className="h-4 w-4" />
                  <span className="font-medium">-{project.co2Removed.toLocaleString()} tons CO₂</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{project.contributors.toLocaleString()} contributors</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">{project.timeRemaining} remaining</span>
                </div>
              </div>
            </div>

            {/* Funding Progress */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Funding Progress</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Current Funding</span>
                  <span className="font-medium">
                    ₹{(project.currentFunding/10000000).toFixed(1)}Cr / ₹{(project.totalFunding/10000000).toFixed(1)}Cr
                  </span>
                </div>
                <Progress value={fundingPercentage} className="h-3" />
                <div className="text-sm text-muted-foreground">
                  {fundingPercentage.toFixed(0)}% funded
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed">
                {project.description}
              </p>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Environmental Benefits</h3>
              <div className="flex flex-wrap gap-2">
                {project.benefits.map((benefit) => (
                  <Badge key={benefit} variant="secondary" className="text-xs">
                    {benefit}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Contribution */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">Make a Contribution</h3>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm">Contribution Amount: ₹{(contributionAmount[0] * 83).toLocaleString()}</Label>
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
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Dialog>
                <DialogTrigger asChild>
                  <Button 
                    className="flex-1 btn-hero"
                    onClick={() => {
                      setContributionAmount([50]);
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
                      <Label className="text-sm">Contribution Amount: ₹{(contributionAmount[0] * 83).toLocaleString()}</Label>
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
                  <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <Button 
                      className="w-full btn-hero" 
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
              <Button variant="outline" className="flex-1">
                Learn More
              </Button>
            </div>

            {/* Certifications */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Certifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {project.certifications.map((cert) => (
                    <Badge key={cert} variant="outline" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* More Projects */}
        <div className="mt-12 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">More Projects You Might Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {projects
                .filter(p => p.id !== project.id) // Exclude current project
                .slice(0, 4) // Show only 4 projects
                .map((relatedProject) => {
                  const relatedFundingPercentage = (relatedProject.currentFunding / relatedProject.totalFunding) * 100;
                  const RelatedProjectIcon = getProjectIcon(relatedProject.type);
                  
                  return (
                    <Card 
                      key={relatedProject.id} 
                      className="cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => router.push(`/projects/${relatedProject.id}`)}
                    >
                      <div className="relative">
                        <div className="aspect-video overflow-hidden rounded-t-lg">
                          <img
                            src={relatedProject.image}
                            alt={relatedProject.name}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              e.target.src = '/tree1.jpg'; // Fallback
                            }}
                          />
                        </div>
                        {relatedProject.featured && (
                          <Badge className="absolute top-2 left-2 bg-success text-white text-xs">
                            Featured
                          </Badge>
                        )}
                        {relatedProject.verified && (
                          <Badge className="absolute top-2 right-2 bg-green-600 text-white text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <RelatedProjectIcon className={`h-4 w-4 ${getTypeColor(relatedProject.type)}`} />
                              <Badge variant="outline" className="text-xs">
                                {relatedProject.type.replace('-', ' ').toUpperCase()}
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">
                              {relatedProject.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {relatedProject.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{relatedProject.location}</span>
                            </div>
                            <div className="flex items-center gap-1 text-green-600">
                              <Target className="h-3 w-3" />
                              <span className="text-xs">-{relatedProject.co2Removed.toLocaleString()} tons CO₂</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">
                                {relatedFundingPercentage.toFixed(0)}%
                              </span>
                            </div>
                            <Progress value={relatedFundingPercentage} className="h-1" />
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">{relatedProject.contributors.toLocaleString()}</span>
                            </div>
                            <Button 
                              size="sm" 
                              className="btn-hero text-xs px-2 py-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                router.push(`/projects/${relatedProject.id}`);
                              }}
                            >
                              <Heart className="h-3 w-3 mr-1" />
                              Contribute
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail; 