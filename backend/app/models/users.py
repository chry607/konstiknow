from dataclasses import dataclass
from datetime import datetime

@dataclass
class User:
    id: str
    email: str
    name: str
    avatar_url: str | None = None
    created_at: datetime | None = None
    updated_at: datetime | None = None
    is_guess: bool = False

@dataclass
class UserProgress:
    id : str
    user_id : str
    total_exp: int = 0
    streak : int= 0
    level : int = 1
    last_activity_date : datetime
    created_at : datetime | None = None
    updated_at : datetime | None = None