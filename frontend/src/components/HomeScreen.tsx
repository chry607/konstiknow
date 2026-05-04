import { Lesson, UserProgress } from '../types';
import { Trophy, Flame, Star } from 'lucide-react';
import { Card } from './ui/card';
import { Progress } from './ui/progress';

interface HomeScreenProps {
  lessons: Lesson[];
  userProgress: UserProgress;
  onStartLesson: (lessonId: string) => void;
}

export function HomeScreen({ lessons, userProgress, onStartLesson }: HomeScreenProps) {
  const progressPercentage = (userProgress.completedLessons.length / lessons.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pb-20">{/* Added pb-20 for bottom nav */}
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇵🇭</span>
              <h1 className="font-bold text-blue-600 dark:text-blue-400">KonstiKnow</h1>
            </div>
            <div className="flex items-center gap-6">{/* Removed theme toggle button as it's in other screens */}
              <div className="flex items-center gap-2">
                <Flame className="size-5 text-orange-500" />
                <span className="font-bold text-orange-500">{userProgress.streak}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="size-5 text-yellow-500" />
                <span className="font-bold text-gray-700 dark:text-gray-300">{userProgress.totalXP} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Card */}
        <Card className="p-6 mb-8 bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm opacity-90">Your Progress</p>
              <h2 className="text-2xl font-bold">Level {userProgress.level}</h2>
            </div>
            <div className="text-right">
              <p className="text-sm opacity-90">Lessons Completed</p>
              <p className="text-2xl font-bold">{userProgress.completedLessons.length}/{lessons.length}</p>
            </div>
          </div>
          <Progress value={progressPercentage} className="h-3 bg-white/20" />
        </Card>

        {/* Lessons Path */}
        <div className="space-y-4">
          <h2 className="font-bold text-gray-800 dark:text-gray-200 mb-4">Learning Path</h2>
          
          {lessons.map((lesson, index) => (
            <div key={lesson.id} className="flex items-center gap-4">
              {/* Connector Line */}
              {index > 0 && (
                <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-16 w-1 h-12 bg-gray-300 dark:bg-gray-600" />
              )}
              
              {/* Lesson Card */}
              <Card 
                className={`w-full p-6 cursor-pointer transition-all hover:shadow-lg dark:bg-gray-800 dark:border-gray-700 ${
                  lesson.locked 
                    ? 'opacity-60 cursor-not-allowed bg-gray-50 dark:bg-gray-900' 
                    : 'hover:scale-[1.02] border-2 border-transparent hover:border-blue-400 dark:hover:border-blue-500'
                } ${lesson.completed ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700' : ''}`}
                onClick={() => !lesson.locked && onStartLesson(lesson.id)}
              >
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className={`flex-shrink-0 size-16 rounded-full flex items-center justify-center text-3xl ${
                    lesson.completed 
                      ? 'bg-green-100 dark:bg-green-800' 
                      : lesson.locked 
                      ? 'bg-gray-200 dark:bg-gray-700' 
                      : 'bg-blue-100 dark:bg-blue-900'
                  }`}>
                    {lesson.locked ? '🔒' : lesson.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-1">{lesson.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{lesson.description}</p>
                    
                    {/* Stars */}
                    {!lesson.locked && (
                      <div className="flex items-center gap-1 mt-2">
                        {[...Array(lesson.maxStars)].map((_, i) => (
                          <Star
                            key={i}
                            className={`size-4 ${
                              i < lesson.stars 
                                ? 'fill-yellow-400 text-yellow-400' 
                                : 'text-gray-300 dark:text-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Status Badge */}
                  {lesson.completed && (
                    <div className="flex-shrink-0">
                      <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Completed
                      </div>
                    </div>
                  )}
                  
                  {lesson.locked && (
                    <div className="flex-shrink-0">
                      <div className="bg-gray-400 dark:bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                        Locked
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}