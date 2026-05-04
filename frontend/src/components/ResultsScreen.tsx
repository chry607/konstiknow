import { motion } from 'motion/react';
import { Trophy, Star, TrendingUp, Award, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface ResultsScreenProps {
  lessonTitle: string;
  score: number;
  totalQuestions: number;
  xpEarned: number;
  perfectScore: boolean;
  onContinue: () => void;
}

export function ResultsScreen({
  lessonTitle,
  score,
  totalQuestions,
  xpEarned,
  perfectScore,
  onContinue
}: ResultsScreenProps) {
  const percentage = (score / totalQuestions) * 100;
  const stars = percentage >= 90 ? 3 : percentage >= 70 ? 2 : percentage >= 50 ? 1 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="p-8 text-center dark:bg-gray-800 dark:border-gray-700">
          {/* Trophy Animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: [0, -10, 10, -10, 0] }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex justify-center mb-6"
          >
            <div className={`size-24 rounded-full flex items-center justify-center ${
              perfectScore 
                ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' 
                : percentage >= 70 
                ? 'bg-gradient-to-br from-green-400 to-green-600'
                : 'bg-gradient-to-br from-blue-400 to-blue-600'
            }`}>
              {perfectScore ? (
                <Award className="size-12 text-white" />
              ) : (
                <Trophy className="size-12 text-white" />
              )}
            </div>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2"
          >
            {perfectScore 
              ? 'Perfect Score! 🎉' 
              : percentage >= 70 
              ? 'Great Job! 👏' 
              : 'Keep Learning! 💪'
            }
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-600 dark:text-gray-400 mb-8"
          >
            You completed {lessonTitle}
          </motion.p>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6 bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700">
                <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                  {score}/{totalQuestions}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Correct Answers</div>
              </Card>
            </motion.div>

            {/* XP Earned */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Card className="p-6 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <TrendingUp className="size-6 text-yellow-600 dark:text-yellow-400" />
                  <div className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">
                    +{xpEarned}
                  </div>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">XP Earned</div>
              </Card>
            </motion.div>

            {/* Stars */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card className="p-6 bg-purple-50 dark:bg-purple-900/30 border-purple-200 dark:border-purple-700">
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: i < stars ? 1 : 0.5 }}
                      transition={{ delay: 0.9 + i * 0.1 }}
                    >
                      <Star
                        className={`size-8 ${
                          i < stars 
                            ? 'fill-yellow-400 text-yellow-400' 
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                      />
                    </motion.div>
                  ))}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Stars Earned</div>
              </Card>
            </motion.div>
          </div>

          {/* Accuracy Bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">Accuracy</span>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{Math.round(percentage)}%</span>
            </div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ delay: 1.2, duration: 0.8, ease: "easeOut" }}
                className={`h-full rounded-full ${
                  percentage >= 90 
                    ? 'bg-gradient-to-r from-green-400 to-green-600' 
                    : percentage >= 70 
                    ? 'bg-gradient-to-r from-blue-400 to-blue-600'
                    : 'bg-gradient-to-r from-orange-400 to-orange-600'
                }`}
              />
            </div>
          </motion.div>

          {/* Motivational Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mb-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg"
          >
            <p className="text-gray-700 dark:text-gray-300">
              {perfectScore 
                ? "Outstanding! You've mastered this lesson completely. Ready for the next challenge?" 
                : percentage >= 70 
                ? "Well done! You have a solid understanding of this topic. Keep up the great work!" 
                : "Good effort! Review the lesson and try again to improve your score."}
            </p>
          </motion.div>

          {/* Continue Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <Button
              onClick={onContinue}
              size="lg"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold"
            >
              <Home className="size-5 mr-2" />
              Continue Learning
            </Button>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}