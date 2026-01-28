"""
Main FastAPI application for Smart Office AI Adoption Hub
"""

import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
from sqlalchemy.orm import Session

from database import get_db, init_db, engine
import models
from schemas import ErrorResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ============================================
# LIFESPAN EVENTS
# ============================================

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Startup and shutdown events for FastAPI app.
    Initializes database tables on startup.
    """
    # Startup
    logger.info("Starting AI Adoption Hub API...")
    try:
        # Create all tables
        models.Base.metadata.create_all(bind=engine)
        logger.info("Database tables initialized")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down AI Adoption Hub API...")


# ============================================
# CREATE APP
# ============================================

app = FastAPI(
    title="Smart Office AI Adoption Hub API",
    description="Enterprise AI adoption platform for DEWA",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# ============================================
# MIDDLEWARE
# ============================================

# CORS - Allow Smart Office and internal domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:8000",
        "http://localhost:8001",
        "https://smartoffice.dewa.gov.ae",
        "https://mobilehub.dewa.gov.ae",
        os.getenv("ALLOWED_ORIGINS", "").split(","),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted hosts
app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=[
        "localhost",
        "127.0.0.1",
        "smartoffice.dewa.gov.ae",
        "mobilehub.dewa.gov.ae",
        "api.dewa.gov.ae",
    ]
)

# ============================================
# ROOT ENDPOINT
# ============================================

@app.get("/")
async def root():
    """Root endpoint - API information"""
    return {
        "name": "Smart Office AI Adoption Hub API",
        "version": "1.0.0",
        "status": "operational",
        "docs": "/api/docs",
        "health": "/health"
    }


@app.get("/health")
async def health_check(db: Session = Depends(get_db)):
    """Health check endpoint - verify API and database connectivity"""
    try:
        # Test database connection
        db.execute("SELECT 1")
        db_status = "healthy"
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        db_status = "unhealthy"
        return JSONResponse(
            status_code=503,
            content={
                "status": "service_unavailable",
                "api": "healthy",
                "database": db_status,
            }
        )
    
    return {
        "status": "healthy",
        "api": "healthy",
        "database": db_status,
    }


# ============================================
# AUTHENTICATION ENDPOINTS
# ============================================

@app.get("/api/me")
async def get_current_user_profile(db: Session = Depends(get_db)):
    """Get current authenticated user's profile - returns first employee for testing"""
    # For testing, return the first employee in the database
    employee = db.query(models.Employee).first()
    
    if not employee:
        # Return mock user for frontend testing
        return {
            "employee_id": 1001,
            "email": "test@dewa.gov.ae",
            "display_name": "Test User",
            "department_id": 1,
            "department_name": "Operations",
            "role": "Employee",
            "status": "active",
            "hire_date": "2020-01-01",
            "avatar_url": None,
        }
    
    return {
        "employee_id": employee.employee_id,
        "email": employee.email,
        "display_name": employee.display_name,
        "department_id": employee.department_id,
        "department_name": employee.department.name if employee.department else None,
        "role": employee.role,
        "status": employee.status,
        "hire_date": employee.hire_date,
        "avatar_url": employee.avatar_url,
    }


# ============================================
# ADOPTION METRICS ENDPOINTS
# ============================================

@app.get("/api/me/scorecard")
async def get_scorecard(db: Session = Depends(get_db)):
    """Get current user's adoption scorecard"""
    employee = db.query(models.Employee).first()
    
    if not employee:
        return {
            "employee_id": 1001,
            "display_name": "Test User",
            "current_score": 75,
            "previous_score": 70,
            "month_change": 5,
            "tasks_automated": 35,
            "hours_saved": 280,
            "tools_used": 4,
            "learning_progress": 65,
            "trends": [65, 68, 70, 72, 73, 75],
        }
    
    # Get current month metrics
    from datetime import datetime
    current_month = datetime.now().month
    current_year = datetime.now().year
    
    current_metrics = db.query(models.AIAdoptionMetrics).filter(
        models.AIAdoptionMetrics.employee_id == employee.employee_id,
        models.AIAdoptionMetrics.month == current_month,
        models.AIAdoptionMetrics.year == current_year,
    ).first()
    
    previous_metrics = db.query(models.AIAdoptionMetrics).filter(
        models.AIAdoptionMetrics.employee_id == employee.employee_id,
        models.AIAdoptionMetrics.month == (current_month - 1 if current_month > 1 else 12),
    ).first()
    
    # Get trends (last 6 months)
    trends = db.query(models.AIAdoptionMetrics).filter(
        models.AIAdoptionMetrics.employee_id == employee.employee_id,
    ).order_by(models.AIAdoptionMetrics.year, models.AIAdoptionMetrics.month).all()
    
    trend_scores = [m.adoption_score or 0 for m in trends[-6:]]
    
    return {
        "employee_id": employee.employee_id,
        "display_name": employee.display_name,
        "current_score": current_metrics.adoption_score if current_metrics else 0,
        "previous_score": previous_metrics.adoption_score if previous_metrics else 0,
        "month_change": (current_metrics.adoption_score - previous_metrics.adoption_score) if current_metrics and previous_metrics else 0,
        "tasks_automated": current_metrics.tasks_ai_assisted if current_metrics else 0,
        "hours_saved": float(current_metrics.hours_saved) if current_metrics else 0,
        "tools_used": current_metrics.tools_explored if current_metrics else 0,
        "learning_progress": int(current_metrics.learning_hours * 10) if current_metrics else 0,
        "trends": trend_scores,
    }


@app.get("/api/adoption-metrics/history")
async def get_adoption_history(months: int = 12, db: Session = Depends(get_db)):
    """Get adoption metrics history"""
    employee = db.query(models.Employee).first()
    
    if not employee:
        return []
    
    metrics = db.query(models.AIAdoptionMetrics).filter(
        models.AIAdoptionMetrics.employee_id == employee.employee_id,
    ).order_by(
        models.AIAdoptionMetrics.year.desc(),
        models.AIAdoptionMetrics.month.desc()
    ).limit(months).all()
    
    return [
        {
            "month": m.month,
            "year": m.year,
            "adoption_score": m.adoption_score,
            "tasks_ai_assisted": m.tasks_ai_assisted,
            "hours_saved": float(m.hours_saved),
            "tools_explored": m.tools_explored,
            "learning_hours": float(m.learning_hours),
        }
        for m in metrics
    ]


@app.get("/api/departments/{dept_id}/overview")
async def get_department_overview(dept_id: int, db: Session = Depends(get_db)):
    """Get department adoption overview"""
    dept = db.query(models.Department).filter(models.Department.department_id == dept_id).first()
    
    if not dept:
        return {"error": "Department not found"}
    
    employees = db.query(models.Employee).filter(models.Employee.department_id == dept_id).all()
    
    if not employees:
        return {
            "department_id": dept_id,
            "department_name": dept.name,
            "avg_score": 0,
            "participation_rate": 0,
            "total_hours_saved": 0,
            "total_employees": 0,
        }
    
    # Get current month metrics
    from datetime import datetime
    current_month = datetime.now().month
    current_year = datetime.now().year
    
    metrics = db.query(models.AIAdoptionMetrics).filter(
        models.AIAdoptionMetrics.employee_id.in_([e.employee_id for e in employees]),
        models.AIAdoptionMetrics.month == current_month,
        models.AIAdoptionMetrics.year == current_year,
    ).all()
    
    avg_score = sum([m.adoption_score or 0 for m in metrics]) / len(metrics) if metrics else 0
    total_hours = sum([m.hours_saved or 0 for m in metrics])
    participation_rate = (len(metrics) / len(employees)) * 100 if employees else 0
    
    return {
        "department_id": dept_id,
        "department_name": dept.name,
        "avg_score": round(avg_score, 1),
        "participation_rate": round(participation_rate, 1),
        "total_hours_saved": float(total_hours),
        "total_employees": len(employees),
        "active_users": len(metrics),
    }


# ============================================
# TOOLS ENDPOINTS
# ============================================

@app.get("/api/tools/catalog")
async def get_tools_catalog(db: Session = Depends(get_db)):
    """Get AI tools catalog"""
    tools = db.query(models.AITool).filter(models.AITool.is_active == True).all()
    
    return [
        {
            "tool_id": t.tool_id,
            "name": t.name,
            "description": t.description,
            "category": t.category,
            "icon_url": t.icon_url,
            "sso_url": t.sso_url,
            "requires_approval": t.requires_approval,
        }
        for t in tools
    ]


@app.get("/api/tools/categories")
async def get_tool_categories(db: Session = Depends(get_db)):
    """Get tool categories"""
    tools = db.query(models.AITool).filter(models.AITool.is_active == True).all()
    categories = list(set([t.category for t in tools]))
    
    return {"categories": categories}


@app.post("/api/tools/{tool_id}/access")
async def log_tool_access(tool_id: int, db: Session = Depends(get_db)):
    """Log tool access"""
    employee = db.query(models.Employee).first()
    tool = db.query(models.AITool).filter(models.AITool.tool_id == tool_id).first()
    
    if not employee or not tool:
        raise HTTPException(status_code=404, detail="Not found")
    
    log = models.ToolAccessLog(
        employee_id=employee.employee_id,
        tool_id=tool_id,
        action="access"
    )
    db.add(log)
    db.commit()
    
    return {"status": "logged"}


# ============================================
# LEARNING ENDPOINTS
# ============================================

@app.get("/api/learning/resources")
async def get_learning_resources(db: Session = Depends(get_db)):
    """Get learning resources"""
    resources = db.query(models.LearningResource).filter(models.LearningResource.is_active == True).all()
    
    return [
        {
            "resource_id": r.resource_id,
            "title": r.title,
            "description": r.description,
            "type": r.type,
            "provider": r.provider,
            "difficulty_level": r.difficulty_level,
            "duration_minutes": r.duration_minutes,
            "url": r.url,
        }
        for r in resources
    ]


@app.get("/api/learning/progress")
async def get_learning_progress(db: Session = Depends(get_db)):
    """Get learning progress"""
    employee = db.query(models.Employee).first()
    
    if not employee:
        return []
    
    progress = db.query(models.UserLearningProgress).filter(
        models.UserLearningProgress.employee_id == employee.employee_id,
    ).all()
    
    return [
        {
            "resource_id": p.resource_id,
            "progress_percent": p.progress_percent,
            "status": p.status,
            "completed_at": p.completed_at,
        }
        for p in progress
    ]


@app.post("/api/learning/{resource_id}/progress")
async def update_learning_progress(resource_id: int, data: dict, db: Session = Depends(get_db)):
    """Update learning progress"""
    employee = db.query(models.Employee).first()
    
    if not employee:
        raise HTTPException(status_code=404, detail="User not found")
    
    progress = db.query(models.UserLearningProgress).filter(
        models.UserLearningProgress.employee_id == employee.employee_id,
        models.UserLearningProgress.resource_id == resource_id,
    ).first()
    
    if not progress:
        progress = models.UserLearningProgress(
            employee_id=employee.employee_id,
            resource_id=resource_id,
            progress_percent=data.get("progress_percent", 0),
            status=data.get("status", "in_progress"),
        )
        db.add(progress)
    else:
        progress.progress_percent = data.get("progress_percent", progress.progress_percent)
        progress.status = data.get("status", progress.status)
    
    db.commit()
    
    return {"status": "updated"}


# ============================================
# GAMIFICATION ENDPOINTS
# ============================================

@app.get("/api/badges")
async def get_badges(db: Session = Depends(get_db)):
    """Get badges"""
    badges = db.query(models.GamificationBadge).all()
    
    return [
        {
            "badge_id": b.badge_id,
            "name": b.name,
            "description": b.description,
            "icon_url": b.icon_url,
            "level": b.level,
        }
        for b in badges
    ]


@app.get("/api/leaderboard")
async def get_leaderboard(db: Session = Depends(get_db)):
    """Get leaderboard"""
    points = db.query(models.UserPoints).order_by(models.UserPoints.total_points.desc()).limit(100).all()
    
    leaderboard = []
    for i, p in enumerate(points, 1):
        employee = db.query(models.Employee).filter(models.Employee.employee_id == p.employee_id).first()
        if employee:
            leaderboard.append({
                "rank": i,
                "employee_id": employee.employee_id,
                "display_name": employee.display_name,
                "role": employee.role,
                "department": employee.department.name if employee.department else None,
                "points": p.total_points,
            })
    
    return leaderboard


@app.get("/api/points")
async def get_points(db: Session = Depends(get_db)):
    """Get user points"""
    employee = db.query(models.Employee).first()
    
    if not employee:
        return {"total_points": 0, "rank": 0}
    
    points = db.query(models.UserPoints).filter(models.UserPoints.employee_id == employee.employee_id).first()
    
    if not points:
        return {"total_points": 0, "rank": 0}
    
    return {
        "employee_id": employee.employee_id,
        "total_points": points.total_points,
        "month_points": points.month_points,
        "rank": points.rank,
    }


@app.get("/api/challenges")
async def get_challenges(db: Session = Depends(get_db)):
    """Get challenges"""
    from datetime import datetime
    current_month = datetime.now().month
    current_year = datetime.now().year
    
    challenges = db.query(models.MonthlyChallenge).filter(
        models.MonthlyChallenge.month == current_month,
        models.MonthlyChallenge.year == current_year,
        models.MonthlyChallenge.status == "active"
    ).all()
    
    return [
        {
            "challenge_id": c.challenge_id,
            "title": c.title,
            "description": c.description,
            "reward_points": c.reward_points,
        }
        for c in challenges
    ]


# ============================================
# ANALYTICS ENDPOINTS
# ============================================

@app.get("/api/analytics/roi")
async def get_roi_analytics(db: Session = Depends(get_db)):
    """Get ROI analytics"""
    from datetime import datetime
    current_month = datetime.now().month
    current_year = datetime.now().year
    
    metrics = db.query(models.AIAdoptionMetrics).filter(
        models.AIAdoptionMetrics.month == current_month,
        models.AIAdoptionMetrics.year == current_year,
    ).all()
    
    total_hours_saved = sum([m.hours_saved or 0 for m in metrics])
    hourly_rate = 75  # AED per hour
    total_roi = total_hours_saved * hourly_rate
    
    return {
        "total_hours_saved": float(total_hours_saved),
        "hourly_rate": hourly_rate,
        "total_roi_aed": total_roi,
        "users_impacted": len(metrics),
        "roi_per_user": total_roi / len(metrics) if metrics else 0,
    }


@app.get("/api/analytics/trends")
async def get_trends_analytics(months: int = 6, db: Session = Depends(get_db)):
    """Get trends analytics"""
    from datetime import datetime
    
    # Get all adoption metrics
    metrics = db.query(models.AIAdoptionMetrics).all()
    
    # Group by month
    trends = {}
    for m in metrics:
        key = f"{m.year}-{m.month:02d}"
        if key not in trends:
            trends[key] = {"adoption": [], "hours": [], "tasks": [], "count": 0}
        if m.adoption_score:
            trends[key]["adoption"].append(m.adoption_score)
        if m.hours_saved:
            trends[key]["hours"].append(float(m.hours_saved))
        if m.tasks_ai_assisted:
            trends[key]["tasks"].append(m.tasks_ai_assisted)
        trends[key]["count"] += 1
    
    # Calculate averages
    result = []
    for key in sorted(trends.keys())[-months:]:
        avg_adoption = sum(trends[key]["adoption"]) / len(trends[key]["adoption"]) if trends[key]["adoption"] else 0
        avg_hours = sum(trends[key]["hours"]) / len(trends[key]["hours"]) if trends[key]["hours"] else 0
        avg_tasks = sum(trends[key]["tasks"]) / len(trends[key]["tasks"]) if trends[key]["tasks"] else 0
        
        result.append({
            "month": key,
            "avg_adoption_score": round(avg_adoption, 1),
            "total_hours_saved": round(avg_hours * trends[key]["count"], 1),
            "avg_tasks_automated": round(avg_tasks, 1),
            "users_active": trends[key]["count"],
        })
    
    return result


@app.get("/api/notifications")
async def get_notifications(db: Session = Depends(get_db)):
    """Get notifications"""
    employee = db.query(models.Employee).first()
    
    if not employee:
        return []
    
    notifications = db.query(models.Notification).filter(
        models.Notification.employee_id == employee.employee_id,
    ).order_by(models.Notification.created_at.desc()).limit(50).all()
    
    return [
        {
            "id": n.id,
            "type": n.type,
            "title": n.title,
            "message": n.message,
            "is_read": n.is_read,
            "created_at": n.created_at,
        }
        for n in notifications
    ]


@app.post("/api/notifications/{notif_id}/read")
async def mark_notification_read(notif_id: int, db: Session = Depends(get_db)):
    """Mark notification as read"""
    notification = db.query(models.Notification).filter(models.Notification.id == notif_id).first()
    
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    
    notification.is_read = True
    db.commit()
    
    return {"status": "marked"}


# ============================================
# AUTHENTICATION ENDPOINTS
# ============================================

# ============================================
# ERROR HANDLERS
# ============================================

@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    """Handle validation errors"""
    return JSONResponse(
        status_code=400,
        content={
            "status_code": 400,
            "message": "Validation error",
            "detail": str(exc)
        }
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """Handle unexpected errors"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "status_code": 500,
            "message": "Internal server error",
            "detail": str(exc) if os.getenv("DEBUG") else "An error occurred"
        }
    )


# ============================================
# STARTUP LOGGING
# ============================================

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=os.getenv("DEBUG", "False") == "True",
        log_level="info"
    )
