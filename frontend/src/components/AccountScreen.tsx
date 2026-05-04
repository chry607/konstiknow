/**
 * Account Screen
 * 
 * BACKEND INTEGRATION:
 * API: GET /api/users/:userId/profile
 * 
 * Response JSON:
 * {
 *   "success": true,
 *   "data": {
 *     "id": "uuid",
 *     "email": "user@example.com",
 *     "name": "John Doe",
 *     "avatar_url": "https://...",
 *     "is_guest": false,
 *     "created_at": "2024-01-01T00:00:00Z",
 *     "settings": {
 *       "notifications_enabled": true,
 *       "sound_effects": true,
 *       "daily_goal": 50
 *     }
 *   }
 * }
 */

import React from 'react';
import { User, Mail, Calendar, LogOut, Settings, Bell, Volume2, Target, Moon, Sun, Link } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { User as UserType } from '../services/authService';
import { signOut } from '../services/authService';
import { useTheme } from '../context/ThemeContext';
import { UserProgress } from '../types';

// Local types
interface Settings {
  notifications_enabled: boolean;
  sound_effects: boolean;
  daily_goal: number;
}

type SettingKey = 'notifications' | 'sound_effects' | 'daily_goal' | 'dark_mode';

interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: (value?: boolean) => void;
}

interface SignOutResult {
  success: boolean;
  [key: string]: any;
}

interface AccountScreenProps {
  user: UserType;
  userProgress: UserProgress;
  onSignOut: () => void;
}

export function AccountScreen({ user, userProgress, onSignOut }: AccountScreenProps): JSX.Element {
  const { theme, toggleTheme }: ThemeContextType = useTheme();

  /**
   * BACKEND INTEGRATION:
   * Handle user sign out
   * API: POST /api/auth/logout
   */
  const handleSignOut = async (): Promise<void> => {
    const result: SignOutResult = await signOut();
    if (result.success) {
      onSignOut();
    }
  };

  /**
   * BACKEND INTEGRATION:
   * Update user settings
   * API: PUT /api/users/:userId/settings
   * Request: { "notifications_enabled": true, "sound_effects": false, ... }
   */
  const handleSettingChange = async (setting: SettingKey, value: boolean): Promise<void> => {
    try {
      // TODO: Save to backend
      // await fetch(`/api/users/${user.id}/settings`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${accessToken}`
      //   },
      //   body: JSON.stringify({ [setting]: value })
      // });
      
      console.log(`Setting ${setting} changed to:`, value);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  /**
   * BACKEND INTEGRATION:
   * Link guest account to Google
   * API: POST /api/users/:guestId/link-google
   */
  const handleLinkAccount = async (): Promise<void> => {
    if (!user.is_guest) return;
    
    try {
      // TODO: Implement account linking
      // const result = await signInWithGoogle();
      // if (result.success) {
      //   await fetch(`/api/users/${user.id}/migrate`, {
      //     method: 'POST',
      //     body: JSON.stringify({ new_user_id: result.user.id })
      //   });
      // }
      
      alert('Account linking will be implemented with backend integration');
    } catch (error) {
      console.error('Error linking account:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Account</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage your profile and settings</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="size-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-3xl">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt="" className="size-20 rounded-full" />
              ) : (
                '👤'
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
                {user.name || 'Guest User'}
              </h2>
              {user.email && (
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                  <Mail className="size-4" />
                  {user.email}
                </p>
              )}
              {user.is_guest && (
                <div className="mt-2">
                  <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 text-xs rounded-full">
                    Guest Account
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {userProgress.level}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Level</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                {userProgress.totalXP}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total XP</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {userProgress.streak}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Day Streak</p>
            </div>
          </div>

          {/* Link Account (for guests) */}
          {user.is_guest && (
            <Button
              onClick={handleLinkAccount}
              className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
            >
              <Link className="size-4 mr-2" />
              Link with Google Account
            </Button>
          )}
        </Card>

        {/* Settings */}
        <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="size-5 text-gray-600 dark:text-gray-400" />
            <h3 className="font-bold text-gray-800 dark:text-gray-200">Settings</h3>
          </div>

          <div className="space-y-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                {theme === 'light' ? (
                  <Sun className="size-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Moon className="size-5 text-gray-600 dark:text-gray-400" />
                )}
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">Dark Mode</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Use dark theme</p>
                </div>
              </div>
              <Switch 
                checked={theme === 'dark'} 
                onCheckedChange={toggleTheme}
              />
            </div>

            {/* Notifications */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Bell className="size-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">Notifications</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Daily reminders</p>
                </div>
              </div>
              <Switch 
                defaultChecked={true}
                onCheckedChange={(checked: boolean) => handleSettingChange('notifications', checked)}
              />
            </div>

            {/* Sound Effects */}
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <Volume2 className="size-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">Sound Effects</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Play sounds during quiz</p>
                </div>
              </div>
              <Switch 
                defaultChecked={true}
                onCheckedChange={(checked: boolean) => handleSettingChange('sound_effects', checked)}
              />
            </div>

            {/* Daily Goal */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Target className="size-5 text-gray-600 dark:text-gray-400" />
                <div>
                  <p className="font-medium text-gray-800 dark:text-gray-200">Daily Goal</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">50 XP per day</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </div>
          </div>
        </Card>

        {/* About */}
        <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">About</h3>
          <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center justify-between">
              <span>App Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Member Since</span>
              <span className="font-medium">January 2024</span>
            </div>
            <Button variant="link" className="p-0 h-auto text-blue-600 dark:text-blue-400">
              Terms of Service
            </Button>
            <Button variant="link" className="p-0 h-auto text-blue-600 dark:text-blue-400">
              Privacy Policy
            </Button>
          </div>
        </Card>

        {/* Sign Out */}
        <Button
          onClick={handleSignOut}
          variant="destructive"
          className="w-full"
          size="lg"
        >
          <LogOut className="size-5 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
