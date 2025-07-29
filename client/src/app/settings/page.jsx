'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Bell, 
  Settings as SettingsIcon, 
  Download, 
  Camera,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Shield,
  Trash2,
  Save,
  Upload,
  Loader2
} from 'lucide-react';
import { usePreferences } from "@/context/PreferencesContext";
import { useTranslation } from "@/context/PreferencesContext";
import { authAPI } from '@/lib/api';
import { useUser } from '@/context/UserContext';
import toast from 'react-hot-toast';

const Settings = () => {
  const { t } = useTranslation();
  const { user, updateUser } = useUser();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    joinDate: '',
    preferredUnits: 'metric'
  });
  
  const [isGoogleAuth, setIsGoogleAuth] = useState(false);

  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    challengeReminders: true,
    weeklyReports: true,
    communityActivity: false,
    marketingEmails: false,
    mobilePush: true,
    socialActivity: true
  });

  const { preferences, setPreferences } = usePreferences();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: '',
    new: '',
    confirm: '',
  });
  const [passwordMessage, setPasswordMessage] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Load user settings on component mount
  useEffect(() => {
    loadUserSettings();
  }, []);

  const loadUserSettings = async () => {
    try {
      setIsLoading(true);
      const response = await authAPI.getUserSettings();
      const userData = response.user;
      
      // Check if user is authenticated via Google
      setIsGoogleAuth(userData.isGoogleAuth || false);
      
      // Update profile data - use userInfo from backend response
      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.userInfo?.phone || userData.profile?.phone || '',
        location: userData.userInfo?.location ? 
          `${userData.userInfo.location.city || ''}, ${userData.userInfo.location.state || ''}, ${userData.userInfo.location.country || ''}`.replace(/^, |, $/g, '') : 
          (userData.profile?.location ? 
            `${userData.profile.location.city || ''}, ${userData.profile.location.state || ''}, ${userData.profile.location.country || ''}`.replace(/^, |, $/g, '') : ''),
        bio: userData.userInfo?.bio || userData.profile?.bio || '',
        joinDate: userData.createdAt || '',
        preferredUnits: userData.userInfo?.preferences?.units || userData.profile?.preferredUnits || 'metric'
      });

      // Update notifications - use userInfo notifications or fallback to profile
      if (userData.userInfo?.notifications) {
        setNotifications(userData.userInfo.notifications);
      } else if (userData.profile?.notificationPreferences) {
        setNotifications(userData.profile.notificationPreferences);
      }

      // Update app preferences - use userInfo preferences or fallback to profile
      if (userData.userInfo?.preferences) {
        setPreferences(userData.userInfo.preferences);
      } else if (userData.profile?.appPreferences) {
        setPreferences(userData.profile.appPreferences);
      }
    } catch (error) {
      console.error('Error loading user settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationToggle = (setting) => {
    setNotifications(prev => ({ ...prev, [setting]: !prev[setting] }));
  };

  const handlePreferenceChange = (setting, value) => {
    setPreferences((prev) => ({ ...prev, [setting]: value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value });
  };

  const saveProfileSettings = async () => {
    try {
      setIsSaving(true);
      
      // Parse location string into components
      const parseLocation = (locationString) => {
        if (!locationString || !locationString.trim()) {
          return { city: '', state: '', country: '', raw: '' };
        }
        
        const parts = locationString.split(',').map(part => part.trim());
        let city = '', state = '', country = '';
        
        if (parts.length === 1) {
          city = parts[0];
        } else if (parts.length === 2) {
          city = parts[0];
          country = parts[1];
        } else if (parts.length >= 3) {
          city = parts[0];
          state = parts[1];
          country = parts[2];
        }
        
        return { city, state, country, raw: locationString };
      };
      
      const locationData = parseLocation(profileData.location);
      
      const response = await authAPI.updateProfile({
        name: profileData.name,
        email: isGoogleAuth ? undefined : profileData.email, // Don't send email for Google users
        phone: profileData.phone,
        bio: profileData.bio,
        preferredUnits: profileData.preferredUnits,
        location: profileData.location
      });
      
      // Update user context
      updateUser(response.user);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      
      // Handle specific Google auth email error
      if (error.response?.data?.code === 'GOOGLE_EMAIL_READONLY') {
        toast.error('Email cannot be changed for Google-authenticated accounts');
      } else {
        toast.error(error.response?.data?.message || 'Failed to update profile');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const saveNotificationSettings = async () => {
    try {
      setIsSaving(true);
      await authAPI.updateNotificationPreferences(notifications);
      toast.success('Notification preferences updated!');
    } catch (error) {
      console.error('Error updating notifications:', error);
      toast.error('Failed to update notification preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const saveAppPreferences = async () => {
    try {
      setIsSaving(true);
      await authAPI.updateAppPreferences(preferences);
      toast.success('App preferences updated!');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update app preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const submitPasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMessage('');
    
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      setPasswordMessage('All fields are required.');
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      setPasswordMessage('New passwords do not match.');
      return;
    }
    
    try {
      setIsChangingPassword(true);
      await authAPI.changePassword({
        currentPassword: passwordForm.current,
        newPassword: passwordForm.new
      });
      
      setPasswordMessage('Password changed successfully!');
      setPasswordForm({ current: '', new: '', confirm: '' });
      setShowChangePassword(false);
      toast.success('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      setPasswordMessage(error.response?.data?.message || 'Failed to change password');
      toast.error('Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const exportData = () => {
    alert('Your data export has been prepared and will be sent to your email.');
  };

  const deleteAccount = () => {
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion process initiated. You will receive an email with further instructions.');
    }
  };

  if (preferences.privacy === 'private') {
    return (
      <div className="p-8 text-center text-muted-foreground">
        {t('profile_private')}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gradient-to-b from-background to-accent/5 min-h-screen">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gradient">{t('Settings')}</h1>
        <p className="text-muted-foreground">{t('Manage Account Preferences')}</p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">{t('Profile')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('Notifications')}</TabsTrigger>
          <TabsTrigger value="preferences">{t('preferences')}</TabsTrigger>
          <TabsTrigger value="data">{t('Data privacy')}</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {t('Profile Information')}
                  </CardTitle>
                  <CardDescription>{t('Update Personal Info')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-20 w-20">
                      <AvatarImage src="" alt="Profile" />
                      <AvatarFallback className="bg-gradient-primary text-white text-xl font-semibold">
                        AJ
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        {t('Change Photo')}
                      </Button>
                      <p className="text-sm text-muted-foreground">{t('Max Size 5mb')}</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">{t('Full Name')}</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => handleProfileUpdate('name', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">{t('Email Address')}</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => handleProfileUpdate('email', e.target.value)}
                        disabled={isGoogleAuth}
                        className={`mt-1 ${isGoogleAuth ? 'opacity-60 cursor-not-allowed' : ''}`}
                      />
                      {isGoogleAuth && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          Email cannot be changed for Google-authenticated accounts
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="phone">{t('Phone Number')}</Label>
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">{t('location')}</Label>
                      <Input
                        id="location"
                        value={profileData.location}
                        onChange={(e) => handleProfileUpdate('location', e.target.value)}
                        className="mt-1"
                        placeholder={t('City State Country')}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="bio">{t('bio')}</Label>
                    <Input
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                      className="mt-1"
                      placeholder={t('Tell About Yourself')}
                    />
                  </div>
                  <div>
                    <Label>{t('Preferred units')}</Label>
                    <Select 
                      value={profileData.preferredUnits} 
                      onValueChange={(value) => handleProfileUpdate('preferredUnits', value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="metric">{t('Metric Units')}</SelectItem>
                        <SelectItem value="imperial">{t('Imperial Units')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button 
                    className="btn-hero"
                    onClick={saveProfileSettings}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {isSaving ? t('Saving...') : t('Save Changes')}
                  </Button>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="card-eco">
                <CardHeader>
                  <CardTitle>{t('Account Stats')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('Member Since')}</span>
                      <span className="font-medium">
                        {profileData.joinDate ? new Date(profileData.joinDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('Total Eco Points')}</span>
                      <span className="font-medium text-primary">1,850</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('Challenges Completed')}</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('CO2 Offset')}</span>
                      <span className="font-medium text-success">24.5 tons</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('Community Rank')}</span>
                      <Badge variant="secondary">#23</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle>{t('achievements')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="text-center p-2">
                      <div className="text-2xl mb-1">🏆</div>
                      <div className="text-xs text-muted-foreground">{t('Eco Warrior')}</div>
                    </div>
                    <div className="text-center p-2">
                      <div className="text-2xl mb-1">🌱</div>
                      <div className="text-xs text-muted-foreground">{t('Plant Protector')}</div>
                    </div>
                    <div className="text-center p-2">
                      <div className="text-2xl mb-1">♻️</div>
                      <div className="text-xs text-muted-foreground">{t('Zero Waste')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                {t('Notification Preferences')}
              </CardTitle>
              <CardDescription>{t('Choose How to be Notified')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">{t('Email Notifications')}</h4>
                <div className="space-y-4">
                  {[
                    { key: 'emailUpdates', label: t('Platform Updates'), description: t('Important Updates') },
                    { key: 'challengeReminders', label: t('Challenge Reminders'), description: t('Challenge Reminders Description') },
                    { key: 'weeklyReports', label: t('Weekly Progress Reports'), description: t('Weekly Progress Reports Description') },
                    { key: 'communityActivity', label: t('Community Activity'), description: t('Community Activity Description') },
                    { key: 'marketingEmails', label: t('Marketing Emails'), description: t('Marketing Emails Description') }
                  ].map(({ key, label, description }) => (
                    <div key={key} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{label}</div>
                        <div className="text-sm text-muted-foreground">{description}</div>
                      </div>
                      <Switch
                        checked={notifications[key]}
                        onCheckedChange={() => handleNotificationToggle(key)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              {/* Push Notifications */}
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">{t('push_notifications')}</h4>
                <div className="space-y-4">
                  {[
                    { key: 'mobilePush', label: t('Mobile Push Notifications'), description: t('Receive Notifications on Mobile') },
                    { key: 'socialActivity', label: t('Social Activity'), description: t('When Someone Likes or Comments') }
                  ].map(({ key, label, description }) => (
                    <div key={key} className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{label}</div>
                        <div className="text-sm text-muted-foreground">{description}</div>
                      </div>
                      <Switch
                        checked={notifications[key]}
                        onCheckedChange={() => handleNotificationToggle(key)}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <Button 
                className="btn-hero"
                onClick={saveNotificationSettings}
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {isSaving ? t('Saving...') : t('Save Notification Settings')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                {t('app_preferences')}
              </CardTitle>
              <CardDescription>{t('customize_ecoaction_experience')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>{t('theme')}</Label>
                  <Select value={preferences.theme} onValueChange={(value) => handlePreferenceChange('theme', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">{t('light')}</SelectItem>
                      <SelectItem value="dark">{t('dark')}</SelectItem>
                      <SelectItem value="system">{t('system')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('language')}</Label>
                  <Select value={preferences.language} onValueChange={(value) => handlePreferenceChange('language', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">{t('english')}</SelectItem>
                      <SelectItem value="hi">{t('hindi')}</SelectItem>
                      <SelectItem value="gu">{t('gujarati')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('currency')}</Label>
                  <Select value={preferences.currency} onValueChange={(value) => handlePreferenceChange('currency', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">{t('usd')}</SelectItem>
                      <SelectItem value="eur">{t('eur')}</SelectItem>
                      <SelectItem value="inr">{t('inr')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>{t('measurement_units')}</Label>
                  <Select value={preferences.units} onValueChange={(value) => handlePreferenceChange('units', value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metric">{t('metric')}</SelectItem>
                      <SelectItem value="imperial">{t('imperial')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">{t('Privacy Settings')}</h4>
                <div className="space-y-4">
                  <div>
                    <Label>{t('Profile Visibility')}</Label>
                    <Select value={preferences.privacy} onValueChange={(value) => handlePreferenceChange('Privacy', value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">{t('public')}</SelectItem>
                        <SelectItem value="friends">{t('friends_only')}</SelectItem>
                        <SelectItem value="private">{t('private')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-border/50 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium text-foreground">{t('Data Sharing for Research')}</div>
                      <div className="text-sm text-muted-foreground">
                        {t('Help Improve Environmental Research')}
                      </div>
                    </div>
                    <Switch
                      checked={preferences.dataSharing}
                      onCheckedChange={(checked) => handlePreferenceChange('dataSharing', checked)}
                    />
                  </div>
                </div>
              </div>
              <Button className="btn-hero" onClick={saveAppPreferences}>
                <Save className="h-4 w-4 mr-2" />
                {t('Save Preferences')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        {/* Data & Privacy Tab */}
        <TabsContent value="data" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  {t('Data Export')}
                </CardTitle>
                <CardDescription>{t('Download all Data')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t('Export Includes Profile Info')}
                </p>
                <Button onClick={exportData} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  {t('Download My Data')}
                </Button>
              </CardContent>
            </Card>
            <Card className="card-gradient border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" />
                  {t('Delete Account')}
                </CardTitle>
                <CardDescription>{t('Permanently Delete Account')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t('This Action cannot be undone')}
                </p>
                <Button onClick={deleteAccount} variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('Delete Account')}
                </Button>
              </CardContent>
            </Card>
          </div>
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t('Privacy Security')}
              </CardTitle>
              <CardDescription>{t('Manage Account Security')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className={`justify-start ${isGoogleAuth ? 'opacity-60 cursor-not-allowed' : ''}`}
                  onClick={() => !isGoogleAuth && setShowChangePassword((v) => !v)}
                  disabled={isGoogleAuth}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {t('Change Password')}
                </Button>
                <Button variant="outline" className="justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  {t('Two Factor Authentication')}
                </Button>
                <Button variant="outline" className="justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  {t('Login Notifications')}
                </Button>
                <Button variant="outline" className="justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  {t('Session Management')}
                </Button>
              </div>
              {showChangePassword && (
                <form className="mt-4 space-y-3" onSubmit={submitPasswordChange}>
                  <Label htmlFor="current">Current Password</Label>
                  <Input
                    id="current"
                    name="current"
                    type="password"
                    value={passwordForm.current}
                    onChange={handlePasswordChange}
                    required
                  />
                  <Label htmlFor="new">New Password</Label>
                  <Input
                    id="new"
                    name="new"
                    type="password"
                    value={passwordForm.new}
                    onChange={handlePasswordChange}
                    required
                  />
                  <Label htmlFor="confirm">Confirm New Password</Label>
                  <Input
                    id="confirm"
                    name="confirm"
                    type="password"
                    value={passwordForm.confirm}
                    onChange={handlePasswordChange}
                    required
                  />
                  <Button type="submit" className="btn-hero">Submit</Button>
                  {passwordMessage && <div className="text-sm text-primary mt-2">{passwordMessage}</div>}
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;