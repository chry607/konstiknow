from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import uuid4

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

import os
from urllib.parse import urlencode

import httpx
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Philippine Constitution Quiz API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:3000",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

supabase: Optional[Client] = None
_supabase_url = os.environ.get("SUPABASE_URL")
_supabase_key = os.environ.get("SUPABASE_KEY")
if _supabase_url and _supabase_key:
    supabase = create_client(_supabase_url, _supabase_key)

# ----------------------------
# Helpers
# ----------------------------

def _require_supabase() -> Client:
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    return supabase

def _utc_now_iso() -> str:
    return datetime.utcnow().isoformat()

def _build_supabase_oauth_url(
    provider: str,
    redirect_to: str,
    state: str,
    code_challenge: str,
) -> str:
    if not _supabase_url:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    params = urlencode(
        {
            "provider": provider,
            "redirect_to": redirect_to,
            "response_type": "code",
            "flow_type": "pkce",
            "code_challenge": code_challenge,
            "code_challenge_method": "S256",
            "state": state,
        }
    )
    return f"{_supabase_url}/auth/v1/authorize?{params}"

async def _exchange_supabase_pkce_code(code: str, code_verifier: str) -> Dict[str, Any]:
    if not _supabase_url or not _supabase_key:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            f"{_supabase_url}/auth/v1/token?grant_type=pkce",
            json={
                "code": code,
                "code_verifier": code_verifier,
            },
            headers={
                "apikey": _supabase_key,
                "Content-Type": "application/json",
            },
        )
    if response.status_code != 200:
        raise HTTPException(status_code=400, detail=response.text)
    return response.json()

async def _get_supabase_user(access_token: str) -> Optional[Dict[str, Any]]:
    if not _supabase_url or not _supabase_key:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.get(
            f"{_supabase_url}/auth/v1/user",
            headers={
                "Authorization": f"Bearer {access_token}",
                "apikey": _supabase_key,
            },
        )
    if response.status_code != 200:
        return None
    return response.json()

# ----------------------------
# Status
# ----------------------------

@app.get("/")
async def status():
    """Status endpoint"""
    return {"ok": True, "service": "Philippine Constitution Quiz API"}

# ----------------------------
# Auth Models
# ----------------------------

class UserOut(BaseModel):
    id: str
    email: Optional[str] = None
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    is_guest: bool = False

class AuthResponse(BaseModel):
    success: bool = True
    user: UserOut
    access_token: str
    refresh_token: str

class GuestAuthResponse(BaseModel):
    success: bool = True
    guest_id: str
    session_token: str

class SessionResponse(BaseModel):
    authenticated: bool
    user: Optional[UserOut] = None

class LogoutResponse(BaseModel):
    success: bool = True

class AuthRedirectRequest(BaseModel):
    redirect_to: Optional[str] = None
    state: str
    code_challenge: str

class AuthExchangeRequest(BaseModel):
    code: str
    code_verifier: str

class AuthExchangeResponse(BaseModel):
    success: bool = True
    access_token: str
    refresh_token: Optional[str] = None

class EmailAuthRequest(BaseModel):
    email: str
    redirect_to: Optional[str] = None
    code_challenge: str

# ----------------------------
# Progress Models
# ----------------------------

class LessonProgress(BaseModel):
    lesson_id: str
    completed: bool
    stars: int
    best_score: int

class ProgressData(BaseModel):
    total_xp: int
    streak: int
    level: int
    completed_lessons: List[str]
    lesson_progress: Optional[List[LessonProgress]] = None

class ProgressResponse(BaseModel):
    success: bool = True
    data: ProgressData

class SaveProgressRequest(BaseModel):
    total_xp: int
    streak: int
    level: int
    completed_lessons: List[str]

class SaveProgressResponse(BaseModel):
    success: bool = True
    message: str

class SaveLessonCompletionRequest(BaseModel):
    completed: bool
    stars: int
    score: int
    total_questions: int
    xp_earned: int
    answers: List[Dict[str, Any]]

class SaveLessonCompletionResponse(BaseModel):
    success: bool = True
    new_level: int
    unlocked_lessons: List[str]

# ----------------------------
# Lesson Models
# ----------------------------

class LessonSummary(BaseModel):
    id: str
    title: str
    description: str
    icon: str
    category: str
    question_count: int
    user_progress: Optional[Dict[str, Any]] = None

class LessonsResponse(BaseModel):
    success: bool = True
    data: List[LessonSummary]

class LessonDetail(BaseModel):
    id: str
    title: str
    questions: List[Dict[str, Any]]

class LessonDetailResponse(BaseModel):
    success: bool = True
    data: LessonDetail

class LessonQuestionResponse(BaseModel):
    success: bool = True
    data: List[Dict[str, Any]]

class ValidateAnswerRequest(BaseModel):
    user_answer: int
    user_id: str

class ValidateAnswerResponse(BaseModel):
    success: bool = True
    is_correct: bool
    correct_answer: int
    explanation: str
    xp_earned: int

# ----------------------------
# Leaderboard Models
# ----------------------------

class LeaderboardEntry(BaseModel):
    rank: int
    user_id: str
    name: str
    avatar_url: Optional[str] = None
    total_xp: int
    level: int
    streak: int

class LeaderboardResponse(BaseModel):
    success: bool = True
    data: List[LeaderboardEntry]
    user_rank: Dict[str, int]

# ----------------------------
# Auth Endpoints (still mocked)
# ----------------------------

@app.post("/api/auth/google")
async def auth_google(payload: AuthRedirectRequest):
    if not payload.state or not payload.code_challenge:
        raise HTTPException(status_code=400, detail="Missing PKCE parameters")
    redirect_to = payload.redirect_to or os.environ.get(
        "SUPABASE_REDIRECT_URL",
        "http://127.0.0.1:3000",
    )
    auth_url = _build_supabase_oauth_url(
        "google",
        redirect_to,
        payload.state,
        payload.code_challenge,
    )
    return {"success": True, "auth_url": auth_url}

@app.post("/api/auth/email")
async def auth_email(payload: EmailAuthRequest):
    sb = _require_supabase()
    redirect_to = payload.redirect_to or os.environ.get(
        "SUPABASE_REDIRECT_URL",
        "http://127.0.0.1:3000",
    )
    sb.auth.sign_in_with_otp(
        {
            "email": payload.email,
            "options": {
                "email_redirect_to": redirect_to,
                "code_challenge": payload.code_challenge,
                "code_challenge_method": "S256",
            },
        }
    )
    return {"success": True}

@app.post("/api/auth/exchange", response_model=AuthExchangeResponse)
async def auth_exchange(payload: AuthExchangeRequest):
    data = await _exchange_supabase_pkce_code(payload.code, payload.code_verifier)
    return AuthExchangeResponse(
        access_token=data.get("access_token", ""),
        refresh_token=data.get("refresh_token"),
    )

@app.post("/api/auth/guest", response_model=GuestAuthResponse)
async def auth_guest():
    return GuestAuthResponse(
        guest_id=f"guest_{uuid4()}",
        session_token="guest_session_token_mock",
    )

@app.get("/api/auth/session", response_model=SessionResponse)
async def auth_session(request: Request):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.lower().startswith("bearer "):
        return SessionResponse(authenticated=False, user=None)

    token = auth_header.split(" ", 1)[1].strip()
    if not token:
        return SessionResponse(authenticated=False, user=None)

    user_data = await _get_supabase_user(token)
    if not user_data:
        return SessionResponse(authenticated=False, user=None)

    user = UserOut(
        id=user_data.get("id", ""),
        email=user_data.get("email"),
        name=(user_data.get("user_metadata") or {}).get("name"),
        avatar_url=(user_data.get("user_metadata") or {}).get("avatar_url"),
        is_guest=False,
    )
    return SessionResponse(authenticated=True, user=user)

@app.post("/api/auth/logout", response_model=LogoutResponse)
async def auth_logout(request: Request):
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.lower().startswith("bearer "):
        token = auth_header.split(" ", 1)[1].strip()
        if token and _supabase_url and _supabase_key:
            async with httpx.AsyncClient(timeout=10.0) as client:
                await client.post(
                    f"{_supabase_url}/auth/v1/logout",
                    headers={
                        "Authorization": f"Bearer {token}",
                        "apikey": _supabase_key,
                    },
                )
    return LogoutResponse(success=True)

# ----------------------------
# Progress Endpoints
# ----------------------------

@app.get("/api/progress/{user_id}", response_model=ProgressResponse)
async def get_progress(user_id: str):
    sb = _require_supabase()

    up_res = sb.table("user_progress").select("total_xp,streak,level").eq("user_id", user_id).limit(1).execute()
    up = up_res.data[0] if up_res.data else {"total_xp": 0, "streak": 0, "level": 1}

    lp_res = sb.table("lesson_progress").select("lesson_id,completed,stars,best_score").eq("user_id", user_id).execute()
    lp_data = lp_res.data or []

    completed_lessons = [lp["lesson_id"] for lp in lp_data if lp.get("completed")]

    data = ProgressData(
        total_xp=up.get("total_xp", 0),
        streak=up.get("streak", 0),
        level=up.get("level", 1),
        completed_lessons=completed_lessons,
        lesson_progress=[LessonProgress(**lp) for lp in lp_data],
    )
    return ProgressResponse(data=data)

@app.put("/api/progress/{user_id}", response_model=SaveProgressResponse)
async def save_progress(user_id: str, payload: SaveProgressRequest):
    sb = _require_supabase()

    sb.table("user_progress").upsert(
        {
            "user_id": user_id,
            "total_xp": payload.total_xp,
            "streak": payload.streak,
            "level": payload.level,
            "updated_at": _utc_now_iso(),
        },
        on_conflict="user_id",
    ).execute()

    if payload.completed_lessons:
        rows = [
            {
                "user_id": user_id,
                "lesson_id": lesson_id,
                "completed": True,
                "updated_at": _utc_now_iso(),
            }
            for lesson_id in payload.completed_lessons
        ]
        sb.table("lesson_progress").upsert(rows, on_conflict="user_id,lesson_id").execute()

    return SaveProgressResponse(success=True, message="Progress saved successfully")

@app.post("/api/progress/{user_id}/lessons/{lesson_id}", response_model=SaveLessonCompletionResponse)
async def save_lesson_completion(user_id: str, lesson_id: str, payload: SaveLessonCompletionRequest):
    sb = _require_supabase()

    # Load existing progress for this lesson
    existing_lp = sb.table("lesson_progress").select("best_score,attempts").eq("user_id", user_id).eq("lesson_id", lesson_id).limit(1).execute()
    existing = existing_lp.data[0] if existing_lp.data else {"best_score": 0, "attempts": 0}

    best_score = max(existing.get("best_score", 0), payload.score)
    attempts = existing.get("attempts", 0) + 1

    sb.table("lesson_progress").upsert(
        {
            "user_id": user_id,
            "lesson_id": lesson_id,
            "completed": payload.completed,
            "stars": payload.stars,
            "best_score": best_score,
            "attempts": attempts,
            "completed_at": _utc_now_iso() if payload.completed else None,
            "updated_at": _utc_now_iso(),
        },
        on_conflict="user_id,lesson_id",
    ).execute()

    sb.table("quiz_attempts").insert(
        {
            "user_id": user_id,
            "lesson_id": lesson_id,
            "score": payload.score,
            "total_questions": payload.total_questions,
            "answers": payload.answers,
            "xp_earned": payload.xp_earned,
            "completed_at": _utc_now_iso(),
        }
    ).execute()

    # Update user_progress
    up_res = sb.table("user_progress").select("total_xp,streak,level").eq("user_id", user_id).limit(1).execute()
    up = up_res.data[0] if up_res.data else {"total_xp": 0, "streak": 0, "level": 1}

    total_xp = int(up.get("total_xp", 0)) + payload.xp_earned
    new_level = max(1, total_xp // 100 + 1)

    sb.table("user_progress").upsert(
        {
            "user_id": user_id,
            "total_xp": total_xp,
            "streak": up.get("streak", 0),
            "level": new_level,
            "last_activity_date": datetime.utcnow().date().isoformat(),
            "updated_at": _utc_now_iso(),
        },
        on_conflict="user_id",
    ).execute()

    unlocked_lessons: List[str] = []
    if payload.completed and payload.stars >= 2:
        unlock_res = sb.table("lessons").select("id").eq("prerequisite_lesson_id", lesson_id).execute()
        unlocked_lessons = [l["id"] for l in (unlock_res.data or [])]

    return SaveLessonCompletionResponse(
        success=True,
        new_level=new_level,
        unlocked_lessons=unlocked_lessons,
    )

# ----------------------------
# Lesson Endpoints
# ----------------------------

@app.get("/api/lessons", response_model=LessonsResponse)
async def get_lessons(category: Optional[str] = None, user_id: Optional[str] = None):
    sb = _require_supabase()

    query = sb.table("lessons").select("id,title,description,icon,category,order_index").order("order_index")
    if category:
        query = query.eq("category", category)

    lessons_res = query.execute()
    lessons_rows = lessons_res.data or []

    lesson_ids = [l["id"] for l in lessons_rows]

    # Count questions per lesson
    question_counts: Dict[str, int] = {lid: 0 for lid in lesson_ids}
    if lesson_ids:
        q_res = sb.table("questions").select("lesson_id").in_("lesson_id", lesson_ids).execute()
        for q in (q_res.data or []):
            question_counts[q["lesson_id"]] = question_counts.get(q["lesson_id"], 0) + 1

    # User progress mapping
    progress_map: Dict[str, Dict[str, Any]] = {}
    if user_id and lesson_ids:
        lp_res = sb.table("lesson_progress").select("lesson_id,completed,stars,best_score").eq("user_id", user_id).in_("lesson_id", lesson_ids).execute()
        for lp in (lp_res.data or []):
            progress_map[lp["lesson_id"]] = {
                "completed": lp.get("completed", False),
                "stars": lp.get("stars", 0),
                "best_score": lp.get("best_score", 0),
                "locked": False,
            }

    lessons = [
        LessonSummary(
            id=l["id"],
            title=l["title"],
            description=l.get("description") or "",
            icon=l.get("icon") or "",
            category=l.get("category") or "",
            question_count=question_counts.get(l["id"], 0),
            user_progress=progress_map.get(l["id"]) if user_id else None,
        )
        for l in lessons_rows
    ]

    return LessonsResponse(data=lessons)

@app.get("/api/lessons/{lesson_id}", response_model=LessonDetailResponse)
async def get_lesson(lesson_id: str):
    sb = _require_supabase()

    lesson_res = sb.table("lessons").select("id,title").eq("id", lesson_id).limit(1).execute()
    lesson = lesson_res.data[0] if lesson_res.data else None
    if not lesson:
        return LessonDetailResponse(data=LessonDetail(id=lesson_id, title="", questions=[]))

    q_res = sb.table("questions").select("id,question,options,difficulty,order_index").eq("lesson_id", lesson_id).order("order_index").execute()
    questions = [
        {
            "id": q["id"],
            "question": q["question"],
            "options": q["options"],
            "difficulty": q.get("difficulty"),
        }
        for q in (q_res.data or [])
    ]

    return LessonDetailResponse(
        data=LessonDetail(
            id=lesson["id"],
            title=lesson["title"],
            questions=questions,
        )
    )

@app.get("/api/lessons/{lesson_id}/questions", response_model=LessonQuestionResponse)
async def get_lesson_questions(lesson_id: str):
    sb = _require_supabase()

    q_res = sb.table("questions").select("id,question,options,difficulty,order_index").eq("lesson_id", lesson_id).order("order_index").execute()
    questions = [
        {
            "id": q["id"],
            "question": q["question"],
            "options": q["options"],
            "difficulty": q.get("difficulty"),
        }
        for q in (q_res.data or [])
    ]
    return LessonQuestionResponse(data=questions)

@app.post("/api/questions/{question_id}/validate", response_model=ValidateAnswerResponse)
async def validate_answer(question_id: str, payload: ValidateAnswerRequest):
    sb = _require_supabase()

    q_res = sb.table("questions").select("correct_answer,explanation").eq("id", question_id).limit(1).execute()
    q = q_res.data[0] if q_res.data else None
    if not q:
        return ValidateAnswerResponse(
            success=True,
            is_correct=False,
            correct_answer=0,
            explanation="Question not found.",
            xp_earned=0,
        )

    is_correct = payload.user_answer == q["correct_answer"]
    return ValidateAnswerResponse(
        success=True,
        is_correct=is_correct,
        correct_answer=q["correct_answer"],
        explanation=q["explanation"],
        xp_earned=10 if is_correct else 0,
    )

# ----------------------------
# Leaderboard Endpoints
# ----------------------------

@app.get("/api/leaderboard", response_model=LeaderboardResponse)
async def get_leaderboard(limit: int = 50, offset: int = 0):
    sb = _require_supabase()

    # Pull from user_progress + users for leaderboard
    # Supabase doesn't support joins in this client directly; do two queries
    up_res = (
        sb.table("user_progress")
        .select("user_id,total_xp,level,streak")
        .order("total_xp", desc=True)
        .range(offset, offset + limit - 1)
        .execute()
    )
    up_rows = up_res.data or []

    user_ids = [r["user_id"] for r in up_rows]
    users_map: Dict[str, Dict[str, Any]] = {}
    if user_ids:
        users_res = sb.table("users").select("id,name,avatar_url").in_("id", user_ids).execute()
        for u in (users_res.data or []):
            users_map[u["id"]] = u

    data = []
    for idx, r in enumerate(up_rows, start=offset + 1):
        u = users_map.get(r["user_id"], {})
        data.append(
            LeaderboardEntry(
                rank=idx,
                user_id=r["user_id"],
                name=u.get("name") or "Unknown",
                avatar_url=u.get("avatar_url"),
                total_xp=r.get("total_xp", 0),
                level=r.get("level", 1),
                streak=r.get("streak", 0),
            )
        )

    return LeaderboardResponse(
        data=data,
        user_rank={"rank": 42, "total_users": 1000},
    )

class SeedLessonsRequest(BaseModel):
    lessons: List[Dict[str, Any]]
    replace: bool = False

class SeedLessonsResponse(BaseModel):
    success: bool = True
    inserted_lessons: int
    inserted_questions: int

@app.post("/api/admin/seed-lessons", response_model=SeedLessonsResponse)
async def seed_lessons(payload: SeedLessonsRequest):
    sb = _require_supabase()

    lessons = payload.lessons or []
    lesson_ids = [l.get("id") for l in lessons if l.get("id")]

    if payload.replace and lesson_ids:
        sb.table("questions").delete().in_("lesson_id", lesson_ids).execute()
        sb.table("lessons").delete().in_("id", lesson_ids).execute()

    lesson_rows = []
    question_rows = []

    for l_index, lesson in enumerate(lessons):
        lesson_rows.append({
            "id": lesson.get("id"),
            "title": lesson.get("title"),
            "description": lesson.get("description"),
            "icon": lesson.get("icon"),
            "order_index": lesson.get("order_index", l_index + 1),
            "category": lesson.get("category"),
            "prerequisite_lesson_id": lesson.get("prerequisite_lesson_id"),
            "max_stars": lesson.get("max_stars", 3),
        })

        questions = lesson.get("questions", [])
        for q_index, q in enumerate(questions):
            question_rows.append({
                "id": q.get("id"),
                "lesson_id": lesson.get("id"),
                "question": q.get("question"),
                "options": q.get("options", []),
                "correct_answer": q.get("correct_answer", q.get("correctAnswer")),
                "explanation": q.get("explanation"),
                "order_index": q.get("order_index", q_index + 1),
                "difficulty": q.get("difficulty"),
            })

    if lesson_rows:
        sb.table("lessons").upsert(lesson_rows, on_conflict="id").execute()

    if question_rows:
        sb.table("questions").upsert(question_rows, on_conflict="id").execute()

    return {
        "success": True,
        "inserted_lessons": len(lesson_rows),
        "inserted_questions": len(question_rows),
    }

@app.post("/api/admin/trigger-seed", response_model=SeedLessonsResponse)
async def trigger_seed(payload: SeedLessonsRequest):
    return await seed_lessons(payload)
