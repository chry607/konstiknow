/**
 * Lesson Service
 * 
 * This service handles fetching lessons and questions from the backend.
 * 
 * BACKEND INTEGRATION NOTES:
 * ==========================
 * 
 * DATABASE SCHEMA (PostgreSQL/Supabase):
 * 
 * 1. TABLE: lessons
 *    CREATE TABLE lessons (
 *      id VARCHAR(255) PRIMARY KEY,
 *      title VARCHAR(255) NOT NULL,
 *      description TEXT,
 *      icon VARCHAR(10),  -- Emoji or icon identifier
 *      order_index INTEGER NOT NULL,
 *      category VARCHAR(100),  -- e.g., "basics", "rights", "government"
 *      prerequisite_lesson_id VARCHAR(255),  -- ID of lesson that must be completed first
 *      max_stars INTEGER DEFAULT 3,
 *      created_at TIMESTAMP DEFAULT NOW(),
 *      updated_at TIMESTAMP DEFAULT NOW()
 *    );
 * 
 * 2. TABLE: questions
 *    CREATE TABLE questions (
 *      id VARCHAR(255) PRIMARY KEY,
 *      lesson_id VARCHAR(255) NOT NULL REFERENCES lessons(id),
 *      question TEXT NOT NULL,
 *      options JSONB NOT NULL,  -- Array of strings: ["Option 1", "Option 2", ...]
 *      correct_answer INTEGER NOT NULL,  -- Index of correct option (0-based)
 *      explanation TEXT NOT NULL,
 *      order_index INTEGER NOT NULL,
 *      difficulty VARCHAR(50),  -- "easy", "medium", "hard"
 *      created_at TIMESTAMP DEFAULT NOW(),
 *      updated_at TIMESTAMP DEFAULT NOW()
 *    );
 * 
 * 3. TABLE: lesson_categories
 *    CREATE TABLE lesson_categories (
 *      id VARCHAR(255) PRIMARY KEY,
 *      name VARCHAR(255) NOT NULL,
 *      description TEXT,
 *      icon VARCHAR(10),
 *      color VARCHAR(50),  -- Hex color for UI
 *      order_index INTEGER NOT NULL
 *    );
 * 
 * API ENDPOINTS:
 * ==============
 */ 

import { Lesson, Question } from '../types';
import { lessons } from "../data/lessons";

// Use the static lessons as mock data until API is wired
const mockLessons: Lesson[] = lessons as unknown as Lesson[];

const API_BASE =
  import.meta.env.VITE_API_BASE_URL || 'https://konstiknow-backend.onrender.com';

export async function seedLessons(replace = false) {
  const res = await fetch(`${API_BASE}/api/admin/seed-lessons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lessons, replace }),
  });

  if (!res.ok) {
    throw new Error(`Seed failed: ${res.status}`);
  }

  return res.json();
}

/**
 * Get all lessons
 * 
 * API ENDPOINT:
 * GET /api/lessons
 * 
 * Optional Query Parameters:
 * - category: Filter by category
 * - user_id: Include user's progress for each lesson
 * 
 * Response JSON:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "basics-1",
 *       "title": "Constitution Basics",
 *       "description": "Learn the fundamentals...",
 *       "icon": "📜",
 *       "category": "basics",
 *       "order_index": 1,
 *       "prerequisite_lesson_id": null,
 *       "max_stars": 3,
 *       "question_count": 5,
 *       "user_progress": {  // Only if user_id provided
 *         "completed": true,
 *         "stars": 3,
 *         "best_score": 5,
 *         "locked": false
 *       }
 *     },
 *     ...
 *   ]
 * }
 */
export async function getLessons(userId?: string): Promise<Lesson[]> {
  try {
    // TODO: Replace with actual API call
    // const url = userId ? `/api/lessons?user_id=${userId}` : '/api/lessons';
    // const response = await fetch(url);
    // const data = await response.json();
    // return data.data;
    
    // For now, return mock data
    return mockLessons;
  } catch (error) {
    console.error('Error loading lessons:', error);
    return mockLessons;
  }
}

/**
 * Get single lesson with questions
 * 
 * API ENDPOINT:
 * GET /api/lessons/:lessonId
 * 
 * Response JSON:
 * {
 *   "success": true,
 *   "data": {
 *     "id": "basics-1",
 *     "title": "Constitution Basics",
 *     "description": "Learn the fundamentals...",
 *     "icon": "📜",
 *     "category": "basics",
 *     "max_stars": 3,
 *     "questions": [
 *       {
 *         "id": "q1",
 *         "question": "When was the current Philippine Constitution ratified?",
 *         "options": ["1935", "1973", "1987", "1997"],
 *         "correct_answer": 2,
 *         "explanation": "The 1987 Constitution was ratified...",
 *         "difficulty": "easy"
 *       },
 *       ...
 *     ]
 *   }
 * }
 */
export async function getLesson(lessonId: string): Promise<Lesson | null> {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/lessons/${lessonId}`);
    // const data = await response.json();
    // return data.data;
    
    // For now, return from mock data
    return mockLessons.find(l => l.id === lessonId) || null;
  } catch (error) {
    console.error('Error loading lesson:', error);
    return null;
  }
}

/**
 * Get questions for a lesson
 * 
 * API ENDPOINT:
 * GET /api/lessons/:lessonId/questions
 * 
 * Optional Query Parameters:
 * - shuffle: Boolean to randomize question order
 * - limit: Number of questions to return
 * 
 * Response JSON:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "q1",
 *       "question": "When was...",
 *       "options": ["...", "...", "...", "..."],
 *       "correct_answer": 2,
 *       "explanation": "...",
 *       "difficulty": "easy"
 *     },
 *     ...
 *   ]
 * }
 * 
 * SECURITY NOTE:
 * - The correct_answer should NOT be sent to the frontend initially
 * - Only send question and options
 * - Verify answers on the backend
 * - Return correct_answer and explanation only after user submits
 */
export async function getQuestions(lessonId: string, shuffle = false): Promise<Question[]> {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/lessons/${lessonId}/questions?shuffle=${shuffle}`);
    // const data = await response.json();
    // return data.data;
    
    // For now, return from mock data
    const lesson = mockLessons.find(l => l.id === lessonId);
    return lesson?.questions || [];
  } catch (error) {
    console.error('Error loading questions:', error);
    return [];
  }
}

/**
 * Submit answer and get validation
 * 
 * API ENDPOINT:
 * POST /api/questions/:questionId/validate
 * 
 * Request JSON:
 * {
 *   "user_answer": 2,
 *   "user_id": "uuid"
 * }
 * 
 * Response JSON:
 * {
 *   "success": true,
 *   "is_correct": true,
 *   "correct_answer": 2,
 *   "explanation": "The 1987 Constitution...",
 *   "xp_earned": 10
 * }
 * 
 * WHY THIS IS IMPORTANT:
 * - Prevents cheating by inspecting network requests
 * - Ensures data integrity
 * - Allows for accurate analytics
 */
export async function validateAnswer(
  questionId: string,
  userAnswer: number,
  userId: string
): Promise<{ isCorrect: boolean; correctAnswer: number; explanation: string; xpEarned: number }> {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch(`/api/questions/${questionId}/validate`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${accessToken}`
    //   },
    //   body: JSON.stringify({ user_answer: userAnswer, user_id: userId })
    // });
    // const data = await response.json();
    // return {
    //   isCorrect: data.is_correct,
    //   correctAnswer: data.correct_answer,
    //   explanation: data.explanation,
    //   xpEarned: data.xp_earned
    // };
    
    // For now, validate client-side (NOT SECURE for production)
    const lesson = mockLessons.find(l => l.questions.some((q: any) => q.id === questionId));
    const question: any = lesson?.questions.find((q: any) => q.id === questionId);

    if (!question) {
      throw new Error('Question not found');
    }

    const correctAnswer = question.correctAnswer ?? question.correct_answer;

    return {
      isCorrect: userAnswer === correctAnswer,
      correctAnswer,
      explanation: question.explanation,
      xpEarned: userAnswer === correctAnswer ? 10 : 0
    };
  } catch (error) {
    console.error('Error validating answer:', error);
    throw error;
  }
}

/**
 * Get lesson categories
 * 
 * API ENDPOINT:
 * GET /api/categories
 * 
 * Response JSON:
 * {
 *   "success": true,
 *   "data": [
 *     {
 *       "id": "basics",
 *       "name": "Constitution Basics",
 *       "description": "Fundamental concepts",
 *       "icon": "📜",
 *       "color": "#3B82F6",
 *       "lesson_count": 2
 *     },
 *     ...
 *   ]
 * }
 */
export async function getCategories() {
  try {
    // TODO: Replace with actual API call
    // const response = await fetch('/api/categories');
    // return await response.json();
    
    return { success: true, data: [] };
  } catch (error) {
    console.error('Error loading categories:', error);
    return { success: false, error };
  }
}
