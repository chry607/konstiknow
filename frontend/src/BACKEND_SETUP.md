# KonstiKnow - Backend Integration Guide

## Overview

KonstiKnow is a Duolingo-style educational web app for learning the Philippine Constitution. This document provides comprehensive information for setting up your own backend.

## Current State

All Supabase dependencies have been removed. The app currently works with:
- ✅ Guest mode (localStorage)
- ✅ Mock Google OAuth (localStorage)
- ✅ Local progress tracking
- ✅ All UI features functional

## Backend Requirements

### 1. Authentication System

#### Google OAuth Setup
- Configure Google OAuth 2.0 credentials
- Set up redirect URLs for your domain
- Implement OAuth flow on your backend

#### Required Endpoints

**POST /api/auth/google**
```json
Response:
{
  "success": true,
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "name": "User Name",
    "avatar_url": "https://...",
    "is_guest": false
  },
  "access_token": "eyJhbGc...",
  "refresh_token": "..."
}
```

**POST /api/auth/guest**
```json
Response:
{
  "success": true,
  "guest_id": "guest_uuid",
  "session_token": "temp_token"
}
```

**GET /api/auth/session**
```json
Headers: { "Authorization": "Bearer {access_token}" }
Response:
{
  "authenticated": true,
  "user": { ...user data... }
}
```

**POST /api/auth/logout**
```json
Headers: { "Authorization": "Bearer {access_token}" }
Response: { "success": true }
```

### 2. Database Schema

#### PostgreSQL Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  avatar_url TEXT,
  is_guest BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User progress table
CREATE TABLE user_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255) NOT NULL UNIQUE,
  total_xp INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  last_activity_date DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Lessons table
CREATE TABLE lessons (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(10),
  order_index INTEGER NOT NULL,
  category VARCHAR(100),
  prerequisite_lesson_id VARCHAR(255),
  max_stars INTEGER DEFAULT 3,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Questions table
CREATE TABLE questions (
  id VARCHAR(255) PRIMARY KEY,
  lesson_id VARCHAR(255) NOT NULL REFERENCES lessons(id),
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  correct_answer INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  difficulty VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Lesson progress table
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255) NOT NULL,
  lesson_id VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  stars INTEGER DEFAULT 0,
  best_score INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Quiz attempts table
CREATE TABLE quiz_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id VARCHAR(255) NOT NULL,
  lesson_id VARCHAR(255) NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answers JSONB,
  xp_earned INTEGER NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW()
);
```

### 3. API Endpoints

#### Progress Endpoints

**GET /api/progress/:userId**
```json
Response:
{
  "success": true,
  "data": {
    "total_xp": 350,
    "streak": 5,
    "level": 4,
    "completed_lessons": ["basics-1", "bill-of-rights"],
    "lesson_progress": [...]
  }
}
```

**PUT /api/progress/:userId**
```json
Request:
{
  "total_xp": 350,
  "streak": 5,
  "level": 4,
  "completed_lessons": ["basics-1"]
}

Response:
{
  "success": true,
  "message": "Progress saved successfully"
}
```

**POST /api/progress/:userId/lessons/:lessonId**
```json
Request:
{
  "completed": true,
  "stars": 3,
  "score": 5,
  "total_questions": 5,
  "xp_earned": 100,
  "answers": [...]
}

Response:
{
  "success": true,
  "new_level": 4,
  "unlocked_lessons": ["executive-branch"]
}
```

#### Lesson Endpoints

**GET /api/lessons**
```json
Query params: ?category=basics&user_id=uuid

Response:
{
  "success": true,
  "data": [
    {
      "id": "basics-1",
      "title": "Constitution Basics",
      "description": "Learn the fundamentals...",
      "icon": "📜",
      "category": "basics",
      "question_count": 5,
      "user_progress": { ... }
    }
  ]
}
```

**GET /api/lessons/:lessonId**
```json
Response:
{
  "success": true,
  "data": {
    "id": "basics-1",
    "title": "Constitution Basics",
    "questions": [...]
  }
}
```

**GET /api/lessons/:lessonId/questions**
```json
Response:
{
  "success": true,
  "data": [
    {
      "id": "q1",
      "question": "When was...",
      "options": ["...", "...", "...", "..."],
      "difficulty": "easy"
    }
  ]
}
```
⚠️ Note: Don't send `correct_answer` to frontend initially

**POST /api/questions/:questionId/validate**
```json
Request:
{
  "user_answer": 2,
  "user_id": "uuid"
}

Response:
{
  "success": true,
  "is_correct": true,
  "correct_answer": 2,
  "explanation": "The 1987 Constitution...",
  "xp_earned": 10
}
```

#### Leaderboard Endpoints

**GET /api/leaderboard**
```json
Query params: ?limit=50&offset=0

Response:
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "user_id": "uuid",
      "name": "John Doe",
      "avatar_url": "https://...",
      "total_xp": 1500,
      "level": 15,
      "streak": 30
    }
  ],
  "user_rank": {
    "rank": 42,
    "total_users": 1000
  }
}
```

## Implementation Steps

1. **Choose Your Backend Stack**
   - Node.js + Express
   - Python + Flask/FastAPI
   - Ruby on Rails
   - Or any backend of your choice

2. **Set Up Database**
   - Use the provided SQL schema
   - Set up migrations
   - Seed initial lesson data from `/data/lessons.ts`

3. **Implement Authentication**
   - Set up Google OAuth
   - Create JWT token system
   - Implement session management

4. **Create API Endpoints**
   - Follow the endpoint specifications above
   - Add proper error handling
   - Implement rate limiting

5. **Update Frontend Service Files**
   - `/services/authService.ts`
   - `/services/progressService.ts`
   - `/services/lessonService.ts`
   
   Replace the TODO comments with actual fetch calls to your API.

6. **Configure CORS**
   ```javascript
   // Example for Express.js
   app.use(cors({
     origin: 'your-frontend-domain.com',
     credentials: true
   }));
   ```

## Security Considerations

- ✅ Never send correct answers to the frontend
- ✅ Validate all answers server-side
- ✅ Use HTTPS in production
- ✅ Implement rate limiting
- ✅ Sanitize user inputs
- ✅ Use JWT for authentication
- ✅ Implement CSRF protection

## Environment Variables

Create a `.env` file for your backend:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/konstiknow
JWT_SECRET=your-jwt-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
FRONTEND_URL=http://localhost:3000
```

## Testing Your Backend

Use tools like:
- Postman
- Insomnia
- curl
- Thunder Client (VS Code extension)

## Migration from Guest to Real Account

Implement an endpoint to migrate guest data:

**POST /api/users/:guestId/migrate**
```json
Request:
{
  "new_user_id": "google-user-uuid"
}

Response:
{
  "success": true,
  "message": "Progress migrated successfully"
}
```

## Support

For questions about the frontend implementation or backend integration, refer to the comprehensive comments in the service files.

---

**Note**: This app currently works fully in localStorage mode. Take your time setting up the backend properly!
