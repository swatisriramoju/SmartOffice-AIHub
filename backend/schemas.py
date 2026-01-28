"""
Pydantic request/response schemas and authentication models
"""

from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum


# ============================================
# AUTHENTICATION & USER
# ============================================

class TokenPayload(BaseModel):
    """JWT token payload structure"""
    sub: str  # user email or ID
    email: str
    display_name: str
    department_id: int
    role: str
    iat: int
    exp: int


class CurrentUser(BaseModel):
    """Current authenticated user context"""
    employee_id: int
    email: str
    display_name: str
    department_id: int
    role: str
    status: str


class UserProfile(BaseModel):
    """User profile response"""
    employee_id: int
    email: str
    display_name: str
    department_id: int
    department_name: Optional[str] = None
    role: str
    status: str
    hire_date: Optional[datetime] = None
    avatar_url: Optional[str] = None

    class Config:
        from_attributes = True


# ============================================
# ADOPTION SCORECARD
# ============================================

class AdoptionMetricBase(BaseModel):
    """Base adoption metric data"""
    adoption_score: Optional[int] = Field(None, ge=0, le=100)
    tasks_ai_assisted: int = 0
    hours_saved: float = 0.0
    tools_explored: int = 0
    learning_hours: float = 0.0


class AdoptionMetric(AdoptionMetricBase):
    """Full adoption metric"""
    id: int
    employee_id: int
    month: int
    year: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PersonalScorecard(BaseModel):
    """User's personal adoption scorecard"""
    employee_id: int
    display_name: str
    current_score: int
    previous_score: Optional[int] = None
    month_change: Optional[int] = None
    tasks_automated: int
    hours_saved: float
    tools_used: int
    learning_progress: int
    trends: List[dict]  # Historical data for charts
    compared_to_department: Optional[str] = None


class DepartmentOverview(BaseModel):
    """Department adoption overview"""
    department_id: int
    department_name: str
    avg_score: float
    participation_rate: float
    total_hours_saved: float
    total_employees: int
    active_users: int
    rank: Optional[int] = None


# ============================================
# LEADERBOARD
# ============================================

class LeaderboardEntry(BaseModel):
    """Individual leaderboard entry"""
    rank: int
    employee_id: int
    display_name: str
    department_name: str
    adoption_score: int
    points: int
    badges_earned: int


class DepartmentLeaderboard(BaseModel):
    """Department leaderboard entry"""
    rank: int
    department_id: int
    department_name: str
    avg_score: float
    participation_rate: float
    total_hours_saved: float
    active_users: int


class LeaderboardResponse(BaseModel):
    """Full leaderboard response"""
    individuals: List[LeaderboardEntry]
    departments: List[DepartmentLeaderboard]
    your_rank: Optional[int] = None
    your_points: Optional[int] = None


# ============================================
# AI TOOLS
# ============================================

class AIToolBase(BaseModel):
    """Base AI tool data"""
    name: str
    description: str
    category: str
    sso_url: Optional[str] = None
    documentation_url: Optional[str] = None
    data_classification: str = "internal"
    is_active: bool = True
    requires_approval: bool = False
    safety_critical: bool = False


class AITool(AIToolBase):
    """Full AI tool response"""
    tool_id: int
    icon_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ToolCatalogResponse(BaseModel):
    """AI tools catalog response"""
    tools: List[AITool]
    categories: List[str]
    total: int


# ============================================
# LEARNING & RESOURCES
# ============================================

class LearningResourceBase(BaseModel):
    """Base learning resource data"""
    title: str
    description: Optional[str] = None
    type: str  # course, video, guide, faq
    provider: str  # viva, hr, internal
    difficulty_level: str = "beginner"
    duration_minutes: Optional[int] = None
    url: Optional[str] = None
    tags: Optional[str] = None
    is_mandatory: bool = False


class LearningResource(LearningResourceBase):
    """Full learning resource"""
    resource_id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserLearningProgressBase(BaseModel):
    """Base user learning progress"""
    status: str  # not_started, in_progress, completed
    progress_percent: int = 0
    score: Optional[int] = None


class UserLearningProgress(UserLearningProgressBase):
    """Full user learning progress"""
    id: int
    resource_id: int
    employee_id: int
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class LearningPathResponse(BaseModel):
    """Learning path with progress"""
    path_name: str
    completion_percent: int
    modules: List[dict]  # Module status, title, duration
    recommended_next: Optional[LearningResource] = None


# ============================================
# GAMIFICATION
# ============================================

class BadgeBase(BaseModel):
    """Base badge data"""
    name: str
    description: Optional[str] = None
    level: int = 1


class Badge(BadgeBase):
    """Full badge"""
    badge_id: int
    icon_url: Optional[str] = None

    class Config:
        from_attributes = True


class UserBadgeResponse(BaseModel):
    """User badge with earned status"""
    badge: Badge
    earned: bool = False
    earned_on: Optional[datetime] = None


class GamificationSummary(BaseModel):
    """User's gamification summary"""
    employee_id: int
    total_points: int
    month_points: int
    badges_earned: List[Badge]
    next_badge: Optional[Badge] = None
    monthly_rank: Optional[int] = None
    progress_to_next_level: int  # percentage


class MonthlyChallenge(BaseModel):
    """Monthly challenge"""
    challenge_id: int
    title: str
    description: Optional[str] = None
    reward_points: int
    progress_percent: int
    completed: bool


# ============================================
# NOTIFICATIONS
# ============================================

class NotificationBase(BaseModel):
    """Base notification"""
    type: str
    title: str
    message: Optional[str] = None


class NotificationResponse(NotificationBase):
    """Full notification"""
    id: int
    is_read: bool
    created_at: datetime
    read_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class NotificationsList(BaseModel):
    """Notifications list response"""
    total: int
    unread: int
    notifications: List[NotificationResponse]


# ============================================
# DEPARTMENT
# ============================================

class DepartmentBase(BaseModel):
    """Base department data"""
    name: str
    description: Optional[str] = None
    status: str = "active"


class Department(DepartmentBase):
    """Full department"""
    department_id: int
    manager_id: Optional[int] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ============================================
# ROI & ANALYTICS
# ============================================

class ROIMetrics(BaseModel):
    """ROI and value tracking metrics"""
    employee_id: int
    hours_saved: float
    tasks_automated: int
    tools_used: int
    estimated_value: float  # calculated
    period: str  # current_month, year_to_date, etc


class DepartmentROI(BaseModel):
    """Department-level ROI"""
    department_id: int
    department_name: str
    total_hours_saved: float
    total_employees: int
    avg_hours_per_employee: float
    estimated_annual_value: float
    trend: str  # up, down, stable


# ============================================
# ERROR RESPONSES
# ============================================

class ErrorResponse(BaseModel):
    """Standard error response"""
    status_code: int
    message: str
    detail: Optional[str] = None


# ============================================
# PAGINATION
# ============================================

class PaginationParams(BaseModel):
    """Pagination parameters"""
    skip: int = Field(0, ge=0)
    limit: int = Field(10, ge=1, le=100)


class PaginatedResponse(BaseModel):
    """Paginated response wrapper"""
    total: int
    skip: int
    limit: int
    items: List[dict]
