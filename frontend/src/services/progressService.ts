import { UserProgress } from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://konstiknow-backend.onrender.com';
const SESSION_TOKEN_KEY = 'session_token';

const requestJson = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem(SESSION_TOKEN_KEY);
  return token ? { Authorization: `Bearer ${token}` } : {};
};
/**
 * User Progress Service
 * 
 * This service handles saving and loading user progress data.
 * 
 * BACKEND INTEGRATION NOTES:
 * ==========================
 * 
 * DATABASE SCHEMA (PostgreSQL/Supabase):
 * 
 * 1. TABLE: user_progress
 *    CREATE TABLE user_progress (
 *      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *      user_id VARCHAR(255) NOT NULL UNIQUE,  -- Supabase auth user ID or guest ID
 *      total_xp INTEGER DEFAULT 0,
 *      streak INTEGER DEFAULT 0,
 *      level INTEGER DEFAULT 1,
 *      last_activity_date DATE,
 *      created_at TIMESTAMP DEFAULT NOW(),
 *      updated_at TIMESTAMP DEFAULT NOW()
 *    );
 * 
 * 2. TABLE: lesson_progress
 *    CREATE TABLE lesson_progress (
 *      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *      user_id VARCHAR(255) NOT NULL,
 *      lesson_id VARCHAR(255) NOT NULL,
 *      completed BOOLEAN DEFAULT FALSE,
 *      stars INTEGER DEFAULT 0,
 *      best_score INTEGER DEFAULT 0,
 *      attempts INTEGER DEFAULT 0,
 *      completed_at TIMESTAMP,
 *      created_at TIMESTAMP DEFAULT NOW(),
 *      updated_at TIMESTAMP DEFAULT NOW(),
 *      UNIQUE(user_id, lesson_id)
 *    );
 * 
 * 3. TABLE: quiz_attempts
 *    CREATE TABLE quiz_attempts (
 *      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *      user_id VARCHAR(255) NOT NULL,
 *      lesson_id VARCHAR(255) NOT NULL,
 *      score INTEGER NOT NULL,
 *      total_questions INTEGER NOT NULL,
 *      answers JSONB,  -- Array of {question_id, user_answer, is_correct}
 *      xp_earned INTEGER NOT NULL,
 *      completed_at TIMESTAMP DEFAULT NOW()
 *    );
 * 
 * API ENDPOINTS:
 * ==============
 */

import { UserProgress } from '../types';

/**
 * Get user progress
 * 
 * API ENDPOINT:
 * GET /api/progress/:userId
 * 
 * Response JSON:
 * {
 *   "success": true,
 *   "data": {
 *     "total_xp": 350,
 *     "streak": 5,
 *     "level": 4,
 *     "completed_lessons": ["basics-1", "bill-of-rights"],
 *     "lesson_progress": [
 *       {
 *         "lesson_id": "basics-1",
 *         "completed": true,
 *         "stars": 3,
 *         "best_score": 5
 *       },
 *       {
 *         "lesson_id": "bill-of-rights",
 *         "completed": true,
 *         "stars": 2,
 *         "best_score": 4
 *       }
 *     ]
 *   }
 * }
 */
export async function getUserProgress(userId: string): Promise<UserProgress> {
  try {
    const response = await requestJson<{
      success: boolean;
      data: {
        total_xp: number;
        streak: number;
        level: number;
        completed_lessons: string[];
      };
    }>(`/api/progress/${userId}`, {
      method: 'GET',
      headers: {
        ...getAuthHeaders(),
      },
    });

    const progress = {
      totalXP: response.data.total_xp,
      streak: response.data.streak,
      level: response.data.level,
      completedLessons: response.data.completed_lessons,
    };

    localStorage.setItem(`progress_${userId}`, JSON.stringify(progress));
    return progress;
  } catch (error) {
    console.error('Error loading progress:', error);
    const savedProgress = localStorage.getItem(`progress_${userId}`);
    if (savedProgress) {
      return JSON.parse(savedProgress);
    }
    return {
      totalXP: 0,
      streak: 0,
      level: 1,
      completedLessons: []
    };
  }
}

/**
 * Save user progress
 * 
 * API ENDPOINT:
 * PUT /api/progress/:userId
 * 
 * Request JSON:
 * {
 *   "total_xp": 350,
 *   "streak": 5,
 *   "level": 4,
 *   "completed_lessons": ["basics-1", "bill-of-rights"]
 * }
 * 
 * Response JSON:
 * {
 *   "success": true,
 *   "message": "Progress saved successfully"
 * }
 */
export async function saveUserProgress(userId: string, progress: UserProgress): Promise<void> {
  try {
    await requestJson(`/api/progress/${userId}`, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        total_xp: progress.totalXP,
        streak: progress.streak,
        level: progress.level,
        completed_lessons: progress.completedLessons,
      }),
    });

    localStorage.setItem(`progress_${userId}`, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

/**
 * Save lesson completion
 * 
 * API ENDPOINT:
 * POST /api/progress/:userId/lessons/:lessonId
 * 
 * Request JSON:
 * {
 *   "completed": true,
 *   "stars": 3,
 *   "score": 5,
 *   "total_questions": 5,
 *   "xp_earned": 100,
 *   "answers": [
 *     {
 *       "question_id": "q1",
 *       "user_answer": 2,
 *       "is_correct": true
 *     },
 *     ...
 *   ]
 * }
 * 
    await requestJson(`/api/progress/${userId}/lessons/${lessonId}`, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
      },
      body: JSON.stringify({
        completed: data.completed,
        stars: data.stars,
        score: data.score,
        total_questions: data.totalQuestions,
        xp_earned: data.xpEarned,
        answers: data.answers.map((answer) => ({
          question_id: answer.questionId,
          user_answer: answer.userAnswer,
          is_correct: answer.isCorrect,
        })),
      }),
    });
  lessonId: string,
  data: {
    completed: boolean;
    stars: number;
    score: number;
    totalQuestions: number;
    xpEarned: number;
    answers: Array<{ questionId: string; userAnswer: number; isCorrect: boolean }>;
  }
): Promise<void> {
  try {
    // TODO: Replace with actual API call
    // await fetch(`/api/progress/${userId}/lessons/${lessonId}`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${accessToken}`
    //   },
    //   body: JSON.stringify(data)
    // });
    
    console.log('Lesson completion saved:', { userId, lessonId, data });
  } catch (error) {
    console.error('Error saving lesson completion:', error);
  }
}

/**
 * Get leaderboard
 * 
 * API ENDPOINT:
 * GET /api/leaderboard?limit=50&offset=0
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
 *       "streak": 30
 *     },
 *     ...
 *   ],
 *   "user_rank": {
 *     "rank": 42,
 *     "total_users": 1000
 *   }
 * }
 */
export async function getLeaderboard(limit = 50, offset = 0) {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/leaderboard?limit=${limit}&offset=${offset}`);
    // return await response.json();
    
    return { success: true, data: [] };
  } catch (error) {
    console.error('Error loading leaderboard:', error);
    return { success: false, error };
  }
}
