import { Card } from './ui/card';
import { Button } from './ui/button';
import { motion } from 'motion/react';
import { BookOpen, User, Trophy } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

interface HomePageProps {
  onGoogleLogin: () => void;
  onGuestLogin: () => void;
}

export function HomePage({ onGoogleLogin, onGuestLogin }: HomePageProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      {/* Theme Toggle - Top Right */}
      <div className="absolute top-4 right-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="dark:text-gray-300"
        >
          {theme === 'light' ? <Moon className="size-5" /> : <Sun className="size-5" />}
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="size-20 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-3xl flex items-center justify-center"
          >
            <span className="text-4xl">🇵🇭</span>
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2">
            KonstiKnow
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Master the Philippine Constitution
          </p>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-4 mb-8"
        >
          <div className="text-center">
            <div className="size-12 mx-auto mb-2 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <BookOpen className="size-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Interactive Lessons</p>
          </div>
          <div className="text-center">
            <div className="size-12 mx-auto mb-2 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <Trophy className="size-6 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Earn Rewards</p>
          </div>
          <div className="text-center">
            <div className="size-12 mx-auto mb-2 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <User className="size-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Track Progress</p>
          </div>
        </motion.div>

        {/* Login Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="space-y-3">
              {/* Google Login Button */}
              <Button
                onClick={onGoogleLogin}
                className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 font-bold h-12"
              >
                <svg className="size-5 mr-3" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    or
                  </span>
                </div>
              </div>

              {/* Guest Login Button */}
              <Button
                onClick={onGuestLogin}
                variant="outline"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0 font-bold h-12"
              >
                <User className="size-5 mr-2" />
                Continue as Guest
              </Button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-4">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </Card>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 text-sm text-gray-500 dark:text-gray-400"
        >
          <p>Learn the Philippine Constitution the fun way! 🎓</p>
        </motion.div>
      </motion.div>
    </div>
  );
}
