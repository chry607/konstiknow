export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  icon: string;
  questions: Question[];
  completed: boolean;
  locked: boolean;
  stars: number;
  maxStars: number;
}

export interface UserProgress {
  totalXP: number;
  streak: number;
  level: number;
  completedLessons: string[];
}
