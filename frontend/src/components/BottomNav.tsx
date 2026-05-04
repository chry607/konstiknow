import { Home, Trophy, TrendingUp, User } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavProps {
  activeTab: 'home' | 'leaderboard' | 'progress' | 'account';
  onTabChange: (tab: 'home' | 'leaderboard' | 'progress' | 'account') => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'home' as const, icon: Home, label: 'Learn' },
    { id: 'leaderboard' as const, icon: Trophy, label: 'Leaderboard' },
    { id: 'progress' as const, icon: TrendingUp, label: 'Progress' },
    { id: 'account' as const, icon: User, label: 'Account' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 safe-area-inset-bottom z-50">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-around px-2 py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className="flex flex-col items-center justify-center flex-1 py-2 relative"
              >
                {/* Active indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-blue-50 dark:bg-blue-900/30 rounded-lg"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                
                {/* Icon and label */}
                <div className="relative z-10 flex flex-col items-center gap-1">
                  <Icon 
                    className={`size-6 ${
                      isActive 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  />
                  <span 
                    className={`text-xs font-medium ${
                      isActive 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    {tab.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
