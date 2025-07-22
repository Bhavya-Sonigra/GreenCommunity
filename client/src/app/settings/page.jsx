'use client';

import { useState } from 'react';
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
  Upload
} from 'lucide-react';
import { usePreferences } from "@/context/PreferencesContext";
import { useTranslation } from "@/context/PreferencesContext";

const Settings = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    joinDate: '',
    preferredUnits: 'metric'
  });

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

  const submitPasswordChange = (e) => {
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
    // TODO: Connect to backend
    setTimeout(() => {
      setPasswordMessage('Password changed successfully!');
      setPasswordForm({ current: '', new: '', confirm: '' });
      setShowChangePassword(false);
    }, 1000);
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
          <TabsTrigger value="profile">{t('profile')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('notifications')}</TabsTrigger>
          <TabsTrigger value="preferences">{t('preferences')}</TabsTrigger>
          <TabsTrigger value="data">{t('data_privacy')}</TabsTrigger>
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
                        {t('change_photo')}
                      </Button>
                      <p className="text-sm text-muted-foreground">{t('max_size_5mb')}</p>
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
                        className="mt-1"
                      />
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
                        placeholder={t('city_state_country')}
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
                      placeholder={t('tell_about_yourself')}
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
                        <SelectItem value="metric">{t('metric_units')}</SelectItem>
                        <SelectItem value="imperial">{t('imperial_units')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button className="btn-hero">
                    <Save className="h-4 w-4 mr-2" />
                    {t('save_changes')}
                  </Button>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <Card className="card-eco">
                <CardHeader>
                  <CardTitle>{t('account_stats')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{t('Member Since')}</span>
                      <span className="font-medium">{new Date(profileData.joinDate).toLocaleDateString()}</span>
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
                {t('notification_preferences')}
              </CardTitle>
              <CardDescription>{t('choose_how_to_be_notified')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Notifications */}
              <div className="space-y-4">
                <h4 className="font-medium text-foreground">{t('email_notifications')}</h4>
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
              <Button className="btn-hero">
                <Save className="h-4 w-4 mr-2" />
                {t('save_notification_settings')}
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
                <h4 className="font-medium text-foreground">{t('privacy_settings')}</h4>
                <div className="space-y-4">
                  <div>
                    <Label>{t('profile_visibility')}</Label>
                    <Select value={preferences.privacy} onValueChange={(value) => handlePreferenceChange('privacy', value)}>
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
                      <div className="font-medium text-foreground">{t('data_sharing_for_research')}</div>
                      <div className="text-sm text-muted-foreground">
                        {t('help_improve_environmental_research')}
                      </div>
                    </div>
                    <Switch
                      checked={preferences.dataSharing}
                      onCheckedChange={(checked) => handlePreferenceChange('dataSharing', checked)}
                    />
                  </div>
                </div>
              </div>
              <Button className="btn-hero">
                <Save className="h-4 w-4 mr-2" />
                {t('save_preferences')}
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
                  {t('data_export')}
                </CardTitle>
                <CardDescription>{t('download_all_data')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t('export_includes_profile_info')}
                </p>
                <Button onClick={exportData} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  {t('download_my_data')}
                </Button>
              </CardContent>
            </Card>
            <Card className="card-gradient border-destructive/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-destructive">
                  <Trash2 className="h-5 w-5" />
                  {t('delete_account')}
                </CardTitle>
                <CardDescription>{t('permanently_delete_account')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {t('this_action_cannot_be_undone')}
                </p>
                <Button onClick={deleteAccount} variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('delete_account')}
                </Button>
              </CardContent>
            </Card>
          </div>
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                {t('privacy_security')}
              </CardTitle>
              <CardDescription>{t('manage_account_security')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start" onClick={() => setShowChangePassword((v) => !v)}>
                  <Shield className="h-4 w-4 mr-2" />
                  {t('change_password')}
                </Button>
                <Button variant="outline" className="justify-start">
                  <Phone className="h-4 w-4 mr-2" />
                  {t('two_factor_authentication')}
                </Button>
                <Button variant="outline" className="justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  {t('login_notifications')}
                </Button>
                <Button variant="outline" className="justify-start">
                  <Calendar className="h-4 w-4 mr-2" />
                  {t('session_management')}
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