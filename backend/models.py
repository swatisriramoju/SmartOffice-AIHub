"""
Database models for Smart Office AI Adoption Hub
SQLAlchemy ORM models mapping to PostgreSQL schema
"""

from datetime import datetime
from typing import Optional
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON, DECIMAL
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


class Department(Base):
    """Organizational department entity"""
    __tablename__ = "departments"

    department_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(Text)
    manager_id = Column(Integer, ForeignKey("employees.employee_id"), nullable=True)
    status = Column(String(50), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    employees = relationship("Employee", back_populates="department", foreign_keys="Employee.department_id")


class Employee(Base):
    """Employee entity - users of the platform"""
    __tablename__ = "employees"

    employee_id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    display_name = Column(String(255), nullable=False)
    department_id = Column(Integer, ForeignKey("departments.department_id"), nullable=False, index=True)
    role = Column(String(100), nullable=False)
    status = Column(String(50), default="active")
    hire_date = Column(DateTime, nullable=True)
    avatar_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    department = relationship("Department", back_populates="employees", foreign_keys=[department_id])
    adoption_metrics = relationship("AIAdoptionMetrics", back_populates="employee", cascade="all, delete-orphan")
    learning_progress = relationship("UserLearningProgress", back_populates="employee", cascade="all, delete-orphan")
    badges = relationship("UserBadge", back_populates="employee", cascade="all, delete-orphan")
    points = relationship("UserPoints", back_populates="employee", uselist=False, cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="employee", cascade="all, delete-orphan")
    tool_access = relationship("ToolAccessLog", back_populates="employee", cascade="all, delete-orphan")


class AIAdoptionMetrics(Base):
    """Monthly AI adoption metrics per employee"""
    __tablename__ = "ai_adoption_metrics"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.employee_id", ondelete="CASCADE"), nullable=False, index=True)
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    adoption_score = Column(Integer, nullable=True)
    tasks_ai_assisted = Column(Integer, default=0)
    hours_saved = Column(DECIMAL(10, 2), default=0)
    tools_explored = Column(Integer, default=0)
    learning_hours = Column(DECIMAL(10, 2), default=0)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    employee = relationship("Employee", back_populates="adoption_metrics")


class DepartmentAdoptionAgg(Base):
    """Aggregated adoption metrics per department"""
    __tablename__ = "department_adoption_agg"

    id = Column(Integer, primary_key=True, index=True)
    department_id = Column(Integer, ForeignKey("departments.department_id", ondelete="CASCADE"), nullable=False, index=True)
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    avg_score = Column(DECIMAL(5, 2), nullable=True)
    participation_rate = Column(DECIMAL(5, 2), nullable=True)
    total_hours_saved = Column(DECIMAL(12, 2), nullable=True)
    total_employees = Column(Integer, nullable=True)
    active_users = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class AITool(Base):
    """Approved AI tools in the catalog"""
    __tablename__ = "ai_tools"

    tool_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False, index=True)
    icon_url = Column(String(500), nullable=True)
    sso_url = Column(String(500), nullable=True)
    documentation_url = Column(String(500), nullable=True)
    data_classification = Column(String(50), default="internal")
    is_active = Column(Boolean, default=True)
    requires_approval = Column(Boolean, default=False)
    safety_critical = Column(Boolean, default=False)
    created_by = Column(Integer, ForeignKey("employees.employee_id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    access_logs = relationship("ToolAccessLog", back_populates="tool", cascade="all, delete-orphan")


class ToolAccessLog(Base):
    """Access logs for AI tools - audit trail"""
    __tablename__ = "tool_access_logs"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.employee_id", ondelete="CASCADE"), nullable=False, index=True)
    tool_id = Column(Integer, ForeignKey("ai_tools.tool_id", ondelete="CASCADE"), nullable=False)
    action = Column(String(50), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    employee = relationship("Employee", back_populates="tool_access")
    tool = relationship("AITool", back_populates="access_logs")


class LearningResource(Base):
    """Learning content - courses, videos, guides"""
    __tablename__ = "learning_resources"

    resource_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    type = Column(String(50), nullable=False, index=True)
    provider = Column(String(100), nullable=False, index=True)
    external_id = Column(String(255), nullable=True)
    difficulty_level = Column(String(50), default="beginner")
    duration_minutes = Column(Integer, nullable=True)
    url = Column(String(500), nullable=True)
    tags = Column(String(500), nullable=True)
    is_mandatory = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user_progress = relationship("UserLearningProgress", back_populates="resource", cascade="all, delete-orphan")


class UserLearningProgress(Base):
    """User's progress on learning resources"""
    __tablename__ = "user_learning_progress"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.employee_id", ondelete="CASCADE"), nullable=False, index=True)
    resource_id = Column(Integer, ForeignKey("learning_resources.resource_id", ondelete="CASCADE"), nullable=False, index=True)
    status = Column(String(50), default="not_started")
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    progress_percent = Column(Integer, default=0)
    score = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    employee = relationship("Employee", back_populates="learning_progress")
    resource = relationship("LearningResource", back_populates="user_progress")


class GamificationBadge(Base):
    """Badge definitions - achievements users can earn"""
    __tablename__ = "gamification_badges"

    badge_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    icon_url = Column(String(500), nullable=True)
    criteria_json = Column(JSON, nullable=True)
    level = Column(Integer, default=1)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user_badges = relationship("UserBadge", back_populates="badge", cascade="all, delete-orphan")


class UserBadge(Base):
    """Badges earned by users"""
    __tablename__ = "user_badges"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.employee_id", ondelete="CASCADE"), nullable=False, index=True)
    badge_id = Column(Integer, ForeignKey("gamification_badges.badge_id", ondelete="CASCADE"), nullable=False)
    awarded_on = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    employee = relationship("Employee", back_populates="badges")
    badge = relationship("GamificationBadge", back_populates="user_badges")


class UserPoints(Base):
    """Gamification points tracking"""
    __tablename__ = "user_points"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.employee_id", ondelete="CASCADE"), unique=True, nullable=False)
    total_points = Column(Integer, default=0)
    month_points = Column(Integer, default=0)
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    employee = relationship("Employee", back_populates="points")


class MonthlyChallenge(Base):
    """Monthly gamification challenges"""
    __tablename__ = "monthly_challenges"

    challenge_id = Column(Integer, primary_key=True, index=True)
    month = Column(Integer, nullable=False)
    year = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    criteria_json = Column(JSON, nullable=True)
    reward_points = Column(Integer, default=500)
    status = Column(String(50), default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user_progress = relationship("UserChallengeProgress", back_populates="challenge", cascade="all, delete-orphan")


class UserChallengeProgress(Base):
    """User's progress on monthly challenges"""
    __tablename__ = "user_challenge_progress"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.employee_id", ondelete="CASCADE"), nullable=False)
    challenge_id = Column(Integer, ForeignKey("monthly_challenges.challenge_id", ondelete="CASCADE"), nullable=False)
    progress_percent = Column(Integer, default=0)
    completed = Column(Boolean, default=False)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    challenge = relationship("MonthlyChallenge", back_populates="user_progress")


class Notification(Base):
    """User notifications"""
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.employee_id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=True)
    data_json = Column(JSON, nullable=True)
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    read_at = Column(DateTime, nullable=True)

    # Relationships
    employee = relationship("Employee", back_populates="notifications")


class AuditLog(Base):
    """Audit trail for compliance and security"""
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    employee_id = Column(Integer, ForeignKey("employees.employee_id"), nullable=True)
    action = Column(String(255), nullable=False)
    resource_type = Column(String(100), nullable=True)
    resource_id = Column(Integer, nullable=True)
    details = Column(JSON, nullable=True)
    ip_address = Column(String(45), nullable=True)
    user_agent = Column(String(500), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
