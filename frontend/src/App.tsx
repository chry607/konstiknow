import { useState, useEffect } from "react";
import { Lesson, UserProgress } from "./types";
import { lessons as initialLessons } from "./data/lessons";
import { HomePage } from "./components/HomePage";
import { HomeScreen } from "./components/HomeScreen";
import { QuizScreen } from "./components/QuizScreen";
import { ResultsScreen } from "./components/ResultsScreen";
import { LeaderboardScreen } from "./components/LeaderboardScreen";
import { ProgressScreen } from "./components/ProgressScreen";
import { AccountScreen } from "./components/AccountScreen";
import { BottomNav } from "./components/BottomNav";
import { ThemeProvider } from "./context/ThemeContext";
import {
  signInWithGoogle,
  continueAsGuest,
  getCurrentSession,
  User,
} from "./services/authService";
import {
  getUserProgress,
  saveUserProgress,
} from "./services/progressService";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [lessons, setLessons] =
    useState<Lesson[]>(initialLessons);
  const [userProgress, setUserProgress] =
    useState<UserProgress>({
      totalXP: 0,
      streak: 0,
      level: 1,
      completedLessons: [],
    });
  const [currentView, setCurrentView] = useState<
    | "landing"
    | "home"
    | "quiz"
    | "results"
    | "leaderboard"
    | "progress"
    | "account"
  >("landing");
  const [activeTab, setActiveTab] = useState<
    "home" | "leaderboard" | "progress" | "account"
  >("home");
  const [currentLessonId, setCurrentLessonId] = useState<
    string | null
  >(null);
  const [quizResults, setQuizResults] = useState<{
    score: number;
    totalQuestions: number;
    xpEarned: number;
    perfectScore: boolean;
  } | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  // Load user progress when user changes
  useEffect(() => {
    if (user) {
      loadUserProgress();
    }
  }, [user]);

  /**
   * BACKEND INTEGRATION:
   * Check if user has an existing session (Google or Guest)
   */
  const checkSession = async () => {
    const session = await getCurrentSession();
    if (session.success && session.user) {
      setUser(session.user);
      setCurrentView("home");
    } else if (session.error) {
      // Show error if OAuth callback failed
      const error = session.error as Error;
      if (error.message && error.message.includes('OAuth')) {
        alert('Login failed. Please try again.');
      }
    }
  };

  /**
   * BACKEND INTEGRATION:
   * Load user's progress from database
   * API: GET /api/progress/:userId
   */
  const loadUserProgress = async () => {
    if (!user) return;
    const progress = await getUserProgress(user.id);
    setUserProgress(progress);
  };

  /**
   * BACKEND INTEGRATION:
   * Handle Google OAuth login
   * After successful login, user data will be available in session
   */
  const handleGoogleLogin = async () => {
    const result = await signInWithGoogle();
    if (result.success) {
      // User will be redirected to Google OAuth
      // After redirect back, checkSession() will be called
      console.log("Redirecting to Google OAuth...");
    } else {
      console.error("Google login failed:", result.error);
      alert("Google login failed. Please try again.");
    }
  };

  /**
   * BACKEND INTEGRATION:
   * Handle guest login
   * Creates temporary user ID and stores progress locally
   * Progress can be migrated to real account later
   */
  const handleGuestLogin = async () => {
    const guestUser = await continueAsGuest();
    setUser(guestUser);
    setCurrentView("home");
    setActiveTab("home");
  };

  /**
   * Handle bottom navigation tab changes
   */
  const handleTabChange = (
    tab: "home" | "leaderboard" | "progress" | "account",
  ) => {
    setActiveTab(tab);
    setCurrentView(tab);
  };

  const handleStartLesson = (lessonId: string) => {
    setCurrentLessonId(lessonId);
    setCurrentView("quiz");
  };

  /**
   * BACKEND INTEGRATION:
   * Save quiz results to database
   * API: POST /api/progress/:userId/lessons/:lessonId
   */
  const handleQuizComplete = async (
    score: number,
    answers: boolean[],
  ) => {
    const totalQuestions = answers.length;
    const percentage = (score / totalQuestions) * 100;
    const stars =
      percentage >= 90
        ? 3
        : percentage >= 70
          ? 2
          : percentage >= 50
            ? 1
            : 0;
    const xpEarned = score * 10 + (percentage === 100 ? 50 : 0); // 10 XP per correct answer, 50 bonus for perfect
    const perfectScore = score === totalQuestions;

    // Update user progress
    const newTotalXP = userProgress.totalXP + xpEarned;
    const newLevel = Math.floor(newTotalXP / 100) + 1;
    const wasCompleted = userProgress.completedLessons.includes(
      currentLessonId!,
    );
    const newCompletedLessons = wasCompleted
      ? userProgress.completedLessons
      : [...userProgress.completedLessons, currentLessonId!];

    const updatedProgress = {
      ...userProgress,
      totalXP: newTotalXP,
      level: newLevel,
      completedLessons: newCompletedLessons,
      streak: userProgress.streak + (wasCompleted ? 0 : 1),
    };

    setUserProgress(updatedProgress);

    // Save to backend
    if (user) {
      await saveUserProgress(user.id, updatedProgress);
    }

    // Update lesson progress
    setLessons(
      lessons.map((lesson) => {
        if (lesson.id === currentLessonId) {
          return {
            ...lesson,
            completed: true,
            stars: Math.max(lesson.stars, stars),
          };
        }
        // Unlock next lesson
        const currentIndex = lessons.findIndex(
          (l) => l.id === currentLessonId,
        );
        const thisIndex = lessons.findIndex(
          (l) => l.id === lesson.id,
        );
        if (thisIndex === currentIndex + 1) {
          return { ...lesson, locked: false };
        }
        return lesson;
      }),
    );

    setQuizResults({
      score,
      totalQuestions,
      xpEarned,
      perfectScore,
    });
    setCurrentView("results");
  };

  const handleExitQuiz = () => {
    setCurrentLessonId(null);
    setCurrentView("home");
    setActiveTab("home");
  };

  const handleContinueFromResults = () => {
    setCurrentLessonId(null);
    setQuizResults(null);
    setCurrentView("home");
    setActiveTab("home");
  };

  /**
   * Handle sign out
   */
  const handleSignOut = () => {
    setUser(null);
    setUserProgress({
      totalXP: 0,
      streak: 0,
      level: 1,
      completedLessons: [],
    });
    setCurrentView("landing");
    setActiveTab("home");
  };

  const currentLesson = lessons.find(
    (l) => l.id === currentLessonId,
  );
  const showBottomNav =
    user &&
    currentView !== "landing" &&
    currentView !== "quiz" &&
    currentView !== "results";

  return (
    <ThemeProvider>
      <div className="size-full bg-white dark:bg-gray-900">
        {currentView === "landing" && (
          <HomePage
            onGoogleLogin={handleGoogleLogin}
            onGuestLogin={handleGuestLogin}
          />
        )}

        {currentView === "home" && (
          <HomeScreen
            lessons={lessons}
            userProgress={userProgress}
            onStartLesson={handleStartLesson}
          />
        )}

        {currentView === "leaderboard" && user && (
          <LeaderboardScreen currentUser={user} />
        )}

        {currentView === "progress" && (
          <ProgressScreen userProgress={userProgress} />
        )}

        {currentView === "account" && user && (
          <AccountScreen
            user={user}
            userProgress={userProgress}
            onSignOut={handleSignOut}
          />
        )}

        {currentView === "quiz" && currentLesson && (
          <QuizScreen
            lesson={currentLesson}
            onComplete={handleQuizComplete}
            onExit={handleExitQuiz}
          />
        )}

        {currentView === "results" &&
          quizResults &&
          currentLesson && (
            <ResultsScreen
              lessonTitle={currentLesson.title}
              score={quizResults.score}
              totalQuestions={quizResults.totalQuestions}
              xpEarned={quizResults.xpEarned}
              perfectScore={quizResults.perfectScore}
              onContinue={handleContinueFromResults}
            />
          )}

        {/* Bottom Navigation */}
        {showBottomNav && (
          <BottomNav
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
        )}
      </div>
    </ThemeProvider>
  );
}