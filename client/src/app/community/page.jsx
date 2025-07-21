"use client";
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users, 
  Trophy, 
  Target, 
  Calendar, 
  MapPin, 
  Plus, 
  Search,
  TrendingUp,
  Award,
  Leaf,
  Clock,
  CheckCircle,
  Star,
  MessageCircle,
  Share,
  Heart
} from 'lucide-react';

const Community = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('challenges');

  const challenges = [
    {
      id: 1,
      title: 'Zero Waste Week',
      description: 'Reduce household waste to near zero for one week',
      participants: 1250,
      timeRemaining: '5 days left',
      difficulty: 'Medium',
      reward: '50 eco-points',
      progress: 65,
      image: '🗑️',
      category: 'Waste Reduction',
      featured: true
    },
    {
      id: 2,
      title: 'Plant-Based February',
      description: 'Commit to plant-based meals for the entire month',
      participants: 2840,
      timeRemaining: '12 days left',
      difficulty: 'Hard',
      reward: '100 eco-points',
      progress: 40,
      image: '🌱',
      category: 'Diet & Food',
      featured: true
    },
    {
      id: 3,
      title: 'Bike to Work Challenge',
      description: 'Use bicycle or public transport for daily commuting',
      participants: 890,
      timeRemaining: '3 weeks left',
      difficulty: 'Easy',
      reward: '25 eco-points',
      progress: 80,
      image: '🚲',
      category: 'Transportation',
      featured: false
    },
    {
      id: 4,
      title: 'Energy Saver Month',
      description: 'Reduce home energy consumption by 20%',
      participants: 1560,
      timeRemaining: '2 weeks left',
      difficulty: 'Medium',
      reward: '75 eco-points',
      progress: 55,
      image: '⚡',
      category: 'Energy',
      featured: true
    }
  ];

  const groups = [
    {
      id: 1,
      name: 'Zero Waste Warriors',
      members: 4250,
      description: 'Community focused on reducing waste and promoting circular economy',
      category: 'Waste Reduction',
      location: 'Global',
      avatar: '♻️',
      active: true,
      posts: 156
    },
    {
      id: 2,
      name: 'Solar Enthusiasts',
      members: 2180,
      description: 'Share experiences and tips about solar energy adoption',
      category: 'Renewable Energy',
      location: 'North America',
      avatar: '☀️',
      active: true,
      posts: 89
    },
    {
      id: 3,
      name: 'Urban Gardeners',
      members: 1890,
      description: 'Growing food sustainably in urban environments',
      category: 'Food & Agriculture',
      location: 'Global',
      avatar: '🌿',
      active: false,
      posts: 245
    },
    {
      id: 4,
      name: 'Eco Travelers',
      members: 3420,
      description: 'Sustainable travel tips and carbon-neutral adventures',
      category: 'Travel',
      location: 'Global',
      avatar: '🌍',
      active: true,
      posts: 178
    }
  ];

  const events = [
    {
      id: 1,
      title: 'Community Beach Cleanup',
      date: '2024-02-15',
      time: '9:00 AM',
      location: 'Santa Monica Beach, CA',
      attendees: 45,
      maxAttendees: 100,
      organizer: 'Ocean Guardians',
      description: 'Join us for a morning of beach cleaning and ocean conservation'
    },
    {
      id: 2,
      title: 'Sustainable Living Workshop',
      date: '2024-02-18',
      time: '2:00 PM',
      location: 'Community Center, Portland',
      attendees: 28,
      maxAttendees: 50,
      organizer: 'Green Living Collective',
      description: 'Learn practical tips for reducing your environmental footprint'
    },
    {
      id: 3,
      title: 'Tree Planting Day',
      date: '2024-02-22',
      time: '8:00 AM',
      location: 'Central Park, NYC',
      attendees: 120,
      maxAttendees: 200,
      organizer: 'NYC Green Initiative',
      description: 'Help us plant 500 trees to improve urban air quality'
    }
  ];

  const leaderboard = [
    { rank: 1, name: 'Sarah Chen', points: 2450, avatar: '👩‍🦱', streak: 45, badges: 12 },
    { rank: 2, name: 'Mike Rodriguez', points: 2380, avatar: '👨‍🦲', streak: 38, badges: 10 },
    { rank: 3, name: 'Emma Johnson', points: 2290, avatar: '👩‍🦳', streak: 52, badges: 14 },
    { rank: 4, name: 'David Kim', points: 2150, avatar: '👨‍🦱', streak: 29, badges: 8 },
    { rank: 5, name: 'Alex Thompson', points: 2050, avatar: '👩‍🦰', streak: 41, badges: 11 }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-700';
      case 'Medium': return 'bg-yellow-100 text-yellow-700';
      case 'Hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-background to-accent/5 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gradient">Community Hub</h1>
          <p className="text-muted-foreground">Connect, compete, and create positive environmental impact together</p>
        </div>
        
        <Button className="btn-hero">
          <Plus className="h-5 w-5 mr-2" />
          Start a Challenge
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search challenges, groups, events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="challenges">Challenges</TabsTrigger>
          <TabsTrigger value="groups">Groups</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
          <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
        </TabsList>

        {/* Challenges Tab */}
        <TabsContent value="challenges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map(challenge => (
              <Card key={challenge.id} className={`card-gradient hover-lift`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-3xl">{challenge.image}</div>
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{challenge.participants} joined</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{challenge.timeRemaining}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{challenge.progress}%</span>
                    </div>
                    <Progress value={challenge.progress} className="h-2 progress-eco" />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-center gap-1 text-success">
                      <Trophy className="h-4 w-4" />
                      <span className="text-sm font-medium">{challenge.reward}</span>
                    </div>
                    
                    <Button size="sm" className="bg-gradient-primary hover:shadow-medium">
                      Join Challenge
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Groups Tab */}
        <TabsContent value="groups" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {groups.map(group => (
              <Card key={group.id} className="card-gradient hover-lift">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{group.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        {group.active && (
                          <Badge variant="secondary" className="bg-success/10 text-success">
                            Active
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{group.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-foreground">
                        {group.members.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Members</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-foreground">{group.posts}</div>
                      <div className="text-xs text-muted-foreground">Posts</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-foreground">4.8★</div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-border/50">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{group.location}</span>
                    </div>
                    
                    <Button size="sm" variant="outline">
                      Join Group
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Events Tab */}
        <TabsContent value="events" className="space-y-6">
          <div className="space-y-4">
            {events.map(event => (
              <Card key={event.id} className="card-gradient hover-lift">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-3">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-xl font-bold text-foreground">{event.title}</h3>
                          <Badge variant="outline">{event.organizer}</Badge>
                        </div>
                        
                        <p className="text-muted-foreground">{event.description}</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{event.date} at {event.time}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            <span>{event.attendees}/{event.maxAttendees} attending</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-center gap-3">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-foreground">{event.attendees}</div>
                        <div className="text-sm text-muted-foreground">people attending</div>
                      </div>
                      <Button className="w-full btn-hero">
                        Join Event
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Leaderboard */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Monthly Leaderboard
                </CardTitle>
                <CardDescription>Top contributors this month</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {leaderboard.map(user => (
                  <div key={user.rank} className="flex items-center gap-4 p-3 rounded-lg border border-border/50">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      user.rank === 1 ? 'bg-yellow-100 text-yellow-700' :
                      user.rank === 2 ? 'bg-gray-100 text-gray-700' :
                      user.rank === 3 ? 'bg-orange-100 text-orange-700' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      #{user.rank}
                    </div>
                    
                    <div className="text-2xl">{user.avatar}</div>
                    
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{user.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {user.streak} day streak • {user.badges} badges
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-foreground">{user.points.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">eco-points</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Your Stats */}
            <Card className="card-eco">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Your Impact
                </CardTitle>
                <CardDescription>Your community contributions</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">1,850</div>
                    <div className="text-sm text-muted-foreground">Eco-Points</div>
                  </div>
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">23</div>
                    <div className="text-sm text-muted-foreground">Rank</div>
                  </div>
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">7</div>
                    <div className="text-sm text-muted-foreground">Badges</div>
                  </div>
                  <div className="text-center p-3 bg-background/50 rounded-lg">
                    <div className="text-2xl font-bold text-foreground">31</div>
                    <div className="text-sm text-muted-foreground">Day Streak</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-foreground">Recent Achievements</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 p-2 bg-success/10 rounded-lg">
                      <CheckCircle className="h-4 w-4 text-success" />
                      <span className="text-sm">Completed Zero Waste Week</span>
                    </div>
                    <div className="flex items-center gap-3 p-2 bg-primary/10 rounded-lg">
                      <Award className="h-4 w-4 text-primary" />
                      <span className="text-sm">Earned Eco Warrior Badge</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Community;