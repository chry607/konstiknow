/**
 * Leaderboard Screen
 * 
 * BACKEND INTEGRATION:
 * API: GET /api/leaderboard?limit=100&offset=0
 * 
 * Response JSON:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "rank": 1,
 *       "user_id": "uuid",
 *       "name": "John Doe",
 *       "avatar_url": "https://...",
 *       "total_xp": 1500,
 *       "level": 15,
 *       "streak": 30,
 *       "completed_lessons": 12
 *     },
 *     ...
 *   ],
 *   "current_user": {
 *     "rank": 42,
 *     "total_users": 1000
 *   }
 * }
 */

import { useState, useEffect } from 'react';
import { Trophy, Medal, Crown, Flame } from 'lucide-react';
import { Card } from './ui/card';
import { Avatar } from './ui/avatar';
import { motion } from 'motion/react';
import { User } from '../services/authService';

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatarUrl?: string;
  totalXP: number;
  level: number;
  streak: number;
}

interface LeaderboardScreenProps {
  currentUser: User;
}

export function LeaderboardScreen({ currentUser }: LeaderboardScreenProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [filter, setFilter] = useState<'global' | 'friends'>('global');

  useEffect(() => {
    loadLeaderboard();
  }, [filter]);

  /**
   * BACKEND INTEGRATION:
   * Load leaderboard data from API
   */
  const loadLeaderboard = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/leaderboard?filter=${filter}&limit=100`);
      // const data = await response.json();
      // setLeaderboard(data.data);
      // setUserRank(data.current_user.rank);
      
      // Mock data for now
      const mockData: LeaderboardEntry[] = [
        { rank: 1, userId: '1', name: 'Maria Santos', avatarUrl: undefined, totalXP: 2500, level: 25, streak: 45 },
        { rank: 2, userId: '2', name: 'Juan dela Cruz', avatarUrl: undefined, totalXP: 2200, level: 22, streak: 30 },
        { rank: 3, userId: '3', name: 'Ana Reyes', avatarUrl: undefined, totalXP: 2000, level: 20, streak: 28 },
        { rank: 4, userId: '4', name: 'Pedro Garcia', avatarUrl: undefined, totalXP: 1800, level: 18, streak: 25 },
        { rank: 5, userId: '5', name: 'Sofia Cruz', avatarUrl: undefined, totalXP: 1600, level: 16, streak: 20 },
        { rank: 6, userId: '6', name: 'Miguel Torres', avatarUrl: undefined, totalXP: 1400, level: 14, streak: 18 },
        { rank: 7, userId: '7', name: 'Carmen Lopez', avatarUrl: undefined, totalXP: 1200, level: 12, streak: 15 },
        { rank: 8, userId: '8', name: 'Jose Ramos', avatarUrl: undefined, totalXP: 1000, level: 10, streak: 12 },
      ];
      setLeaderboard(mockData);
      setUserRank(42);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="size-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="size-6 text-gray-400" />;
    if (rank === 3) return <Medal className="size-6 text-amber-600" />;
    return null;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
    if (rank === 2) return 'bg-gradient-to-r from-gray-300 to-gray-500';
    if (rank === 3) return 'bg-gradient-to-r from-amber-500 to-amber-700';
    return 'bg-gray-100 dark:bg-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Leaderboard</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">See how you rank among other learners</p>
            </div>
            <Trophy className="size-8 text-yellow-500" />
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('global')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                filter === 'global'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              Global
            </button>
            <button
              onClick={() => setFilter('friends')}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                filter === 'friends'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
              }`}
            >
              Friends
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Your Rank Card */}
        {userRank && (
          <Card className="p-4 mb-6 bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Your Rank</p>
                <p className="text-3xl font-bold">#{userRank}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90">Keep learning to climb higher!</p>
              </div>
            </div>
          </Card>
        )}

        {/* Top 3 Podium */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {/* 2nd Place */}
          {leaderboard[1] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-2">
                <div className="size-16 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-2xl">
                  {leaderboard[1].avatarUrl ? (
                    <img src={leaderboard[1].avatarUrl} alt="" className="size-16 rounded-full" />
                  ) : (
                    '👤'
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold">
                  2
                </div>
              </div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center truncate w-full">
                {leaderboard[1].name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{leaderboard[1].totalXP} XP</p>
              <div className="mt-2 h-20 w-full bg-gray-200 dark:bg-gray-700 rounded-t-lg" />
            </motion.div>
          )}

          {/* 1st Place */}
          {leaderboard[0] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex flex-col items-center -mt-4"
            >
              <Crown className="size-6 text-yellow-500 mb-1" />
              <div className="relative mb-2">
                <div className="size-20 rounded-full bg-yellow-400 flex items-center justify-center text-3xl ring-4 ring-yellow-500/30">
                  {leaderboard[0].avatarUrl ? (
                    <img src={leaderboard[0].avatarUrl} alt="" className="size-20 rounded-full" />
                  ) : (
                    '👤'
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 size-7 rounded-full bg-yellow-500 flex items-center justify-center text-white text-sm font-bold">
                  1
                </div>
              </div>
              <p className="text-sm font-bold text-gray-800 dark:text-gray-200 text-center truncate w-full">
                {leaderboard[0].name}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{leaderboard[0].totalXP} XP</p>
              <div className="mt-2 h-28 w-full bg-yellow-400 rounded-t-lg" />
            </motion.div>
          )}

          {/* 3rd Place */}
          {leaderboard[2] && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center"
            >
              <div className="relative mb-2">
                <div className="size-16 rounded-full bg-amber-600 dark:bg-amber-700 flex items-center justify-center text-2xl">
                  {leaderboard[2].avatarUrl ? (
                    <img src={leaderboard[2].avatarUrl} alt="" className="size-16 rounded-full" />
                  ) : (
                    '👤'
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-amber-600 flex items-center justify-center text-white text-xs font-bold">
                  3
                </div>
              </div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 text-center truncate w-full">
                {leaderboard[2].name}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{leaderboard[2].totalXP} XP</p>
              <div className="mt-2 h-16 w-full bg-amber-200 dark:bg-amber-700 rounded-t-lg" />
            </motion.div>
          )}
        </div>

        {/* Rest of Leaderboard */}
        <div className="space-y-2">
          {leaderboard.slice(3).map((entry, index) => (
            <motion.div
              key={entry.userId}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
            >
              <Card className="p-4 dark:bg-gray-800 dark:border-gray-700">
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="flex-shrink-0 w-8 text-center">
                    <span className="text-lg font-bold text-gray-600 dark:text-gray-400">
                      {entry.rank}
                    </span>
                  </div>

                  {/* Avatar */}
                  <div className="flex-shrink-0 size-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xl">
                    {entry.avatarUrl ? (
                      <img src={entry.avatarUrl} alt="" className="size-12 rounded-full" />
                    ) : (
                      '👤'
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 dark:text-gray-200 truncate">
                      {entry.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Level {entry.level}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Flame className="size-4 text-orange-500" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {entry.streak}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {entry.totalXP} XP
                      </p>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
