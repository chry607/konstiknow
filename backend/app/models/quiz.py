from dataclasses import dataclass
from datetime import datetime
import json

@dataclass
class Lesson:
    id : str
    title : str
    description : str
    icon : str
    order_index : int
    category : str
    prerequisite_lesson_id : str | None
    max_start : int = 3
    created_at : datetime | None = None
    updated_at : datetime | None = None

@dataclass
class Question:
    id : str
    lesson_id : str
    question : str
    options : json
    correct_answer : int
    explanation : str
    order_index : int
    difficulty : str
    created_at : datetime | None = None
    updated_at : datetime | None = None

@dataclass
class LessonProgress:
    ind : str
    user_id : str
    lesson_id : str
    completed : bool = False
    stars : int = 0
    best_score : int = 0
    attempts : int = 0
    completed_at : datetime | None = None
    created_at : datetime | None = None
    updated_at : datetime | None = None

@dataclass
class QuizAttempts:
    id : str
    user_id : str
    lesson_id : str
    score : int 
    total_questions : int
    answers : json
    xp_earned : int
    completed_at : datetime