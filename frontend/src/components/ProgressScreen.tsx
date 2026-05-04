/**
 * Progress Screen - Detailed statistics
 * 
 * BACKEND INTEGRATION:
 * API: GET /api/progress/:userId/stats
 * 
 * Response JSON:
 * {
 *   "success": true,
 *   "data": {
 *     "total_xp": 1500,
 *     "level": 15,
 *     "streak": 30,
 *     "total_lessons_completed": 12,
 *     "total_questions_answered": 60,
 *     "accuracy": 85,
 *     "study_time_minutes": 240,
 *     "activity_history": [
 *       { "date": "2024-01-20", "xp_earned": 150, "lessons_completed": 2 },
 *       ...
 *     ],
 *     "category_progress": [
 *       { "category": "basics", "completed": 2, "total": 2, "accuracy": 90 },
 *       { "category": "rights", "completed": 1, "total": 2, "accuracy": 80 },
 *       ...
 *     ]
 *   }
 * }
 */

import { TrendingUp, Award, Target, Calendar, Zap, CheckCircle2 } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { UserProgress } from '../types';

interface ProgressScreenProps {
  userProgress: UserProgress;
}

export function ProgressScreen({ userProgress }: ProgressScreenProps) {
  // Mock data for demo - replace with API data
  const stats = {
    totalQuestions: userProgress.completedLessons.length * 5,
    accuracy: 87,
    studyTime: 120, // minutes
    daysActive: 15,
  };

  const weeklyProgress = [
    { day: 'Mon', xp: 120 },
    { day: 'Tue', xp: 80 },
    { day: 'Wed', xp: 150 },
    { day: 'Thu', xp: 100 },
    { day: 'Fri', xp: 200 },
    { day: 'Sat', xp: 90 },
    { day: 'Sun', xp: 110 },
  ];

  const maxXP = Math.max(...weeklyProgress.map(d => d.xp));

  const achievements = [
    { id: 1, title: 'First Lesson', description: 'Complete your first lesson', unlocked: true, icon: '🎯' },
    { id: 2, title: 'Perfect Score', description: 'Get 100% on a quiz', unlocked: true, icon: '⭐' },
    { id: 3, title: 'Week Streak', description: 'Maintain a 7-day streak', unlocked: userProgress.streak >= 7, icon: '🔥' },
    { id: 4, title: 'Level 5', description: 'Reach level 5', unlocked: userProgress.level >= 5, icon: '🏆' },
    { id: 5, title: 'Knowledge Master', description: 'Complete all lessons', unlocked: false, icon: '👑' },
    { id: 6, title: 'Month Streak', description: 'Maintain a 30-day streak', unlocked: false, icon: '💪' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Your Progress</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Track your learning journey</p>
            </div>
            <TrendingUp className="size-8 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Level Progress */}
        <Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm opacity-90">Current Level</p>
              <h2 className="text-3xl font-bold">Level {userProgress.level}</h2>
            </div>
            <Award className="size-12 opacity-80" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{userProgress.totalXP} XP</span>
              <span>{userProgress.level * 100} XP</span>
            </div>
            <Progress 
              value={(userProgress.totalXP % 100)} 
              className="h-3 bg-white/20" 
            />
            <p className="text-xs opacity-90">
              {100 - (userProgress.totalXP % 100)} XP to Level {userProgress.level + 1}
            </p>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                <Zap className="size-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {userProgress.streak}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Day Streak</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="size-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {userProgress.completedLessons.length}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Lessons Done</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Target className="size-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {stats.accuracy}%
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Accuracy</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Calendar className="size-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {stats.daysActive}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Days Active</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Weekly Activity */}
        <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">This Week's Activity</h3>
          <div className="flex items-end justify-between gap-2 h-32">
            {weeklyProgress.map((day, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end justify-center h-24">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg transition-all hover:opacity-80"
                    style={{ height: `${(day.xp / maxXP) * 100}%`, minHeight: '8px' }}
                  />
                </div>
                <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {day.day}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Total this week: <span className="font-bold text-blue-600 dark:text-blue-400">
                {weeklyProgress.reduce((sum, d) => sum + d.xp, 0)} XP
              </span>
            </p>
          </div>
        </Card>

        {/* Achievements */}
        <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
          <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Achievements</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.unlocked
                    ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-400 dark:border-yellow-600'
                    : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-60'
                }`}
              >
                <div className="text-3xl mb-2 text-center">
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </div>
                <p className="text-sm font-bold text-gray-800 dark:text-gray-200 text-center mb-1">
                  {achievement.title}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
