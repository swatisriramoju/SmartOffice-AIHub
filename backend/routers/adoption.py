"""
Router for AI Adoption metrics and personal scorecard
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from typing import List
import models
import schemas
from database import get_db
from dependencies import get_current_user, CurrentUser

router = APIRouter()


@router.get("/me/scorecard", response_model=schemas.PersonalScorecard)
async def get_personal_scorecard(
    user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get current user's personal AI adoption scorecard.
    
    Includes:
    - Current month adoption score
    - Comparison to previous month
    - Key metrics (tasks, hours saved, tools)
    - Historical trends for charts
    - Department comparison
    """
    current_date = datetime.utcnow()
    current_month = current_date.month
    current_year = current_date.year
    
    # Get current month metrics
    current_metrics = db.query(models.AIAdoptionMetrics).filter(
        models.AIAdoptionMetrics.employee_id == user.employee_id,
        models.AIAdoptionMetrics.month == current_month,
        models.AIAdoptionMetrics.year == current_year,
    ).first()
    
    # Get previous month metrics
    prev_month = current_month - 1 if current_month > 1 else 12
    prev_year = current_year if current_month > 1 else current_year - 1
    
    prev_metrics = db.query(models.AIAdoptionMetrics).filter(
        models.AIAdoptionMetrics.employee_id == user.employee_id,
        models.AIAdoptionMetrics.month == prev_month,
        models.AIAdoptionMetrics.year == prev_year,
    ).first()
    
    # Get last 6 months for trends
    trends_data = db.query(models.AIAdoptionMetrics).filter(
        models.AIAdoptionMetrics.employee_id == user.employee_id,
    ).order_by(
        models.AIAdoptionMetrics.year,
        models.AIAdoptionMetrics.month
    ).all()[-6:]
    
    # Get department average
    dept_avg = db.query(
        func.avg(models.AIAdoptionMetrics.adoption_score)
    ).join(
        models.Employee
    ).filter(
        models.Employee.department_id == user.department_id,
        models.AIAdoptionMetrics.month == current_month,
        models.AIAdoptionMetrics.year == current_year,
    ).scalar()
    
    # Build response
    current_score = current_metrics.adoption_score if current_metrics else 0
    previous_score = prev_metrics.adoption_score if prev_metrics else None
    month_change = (current_score - previous_score) if previous_score else None
    
    trends = [
        {
            "month": m.month,
            "year": m.year,
            "score": m.adoption_score or 0,
        }
        for m in trends_data
    ]
    
    compared_to_dept = None
    if dept_avg and current_score:
        if current_score > dept_avg:
            compared_to_dept = f"Above average by {int(current_score - dept_avg)} points"
        elif current_score < dept_avg:
            compared_to_dept = f"Below average by {int(dept_avg - current_score)} points"
        else:
            compared_to_dept = "At department average"
    
    return schemas.PersonalScorecard(
        employee_id=user.employee_id,
        display_name=user.display_name,
        current_score=current_score,
        previous_score=previous_score,
        month_change=month_change,
        tasks_automated=current_metrics.tasks_ai_assisted if current_metrics else 0,
        hours_saved=float(current_metrics.hours_saved) if current_metrics else 0.0,
        tools_used=current_metrics.tools_explored if current_metrics else 0,
        learning_progress=0,  # Calculate from user_learning_progress
        trends=trends,
        compared_to_department=compared_to_dept,
    )


@router.get("/departments/{department_id}/overview", response_model=schemas.DepartmentOverview)
async def get_department_overview(
    department_id: int,
    user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get department AI adoption overview.
    
    Returns aggregated metrics for the specified department.
    Users can see their own department and public department data.
    """
    # Check department access
    if user.department_id != department_id and user.role not in ["admin", "manager"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this department"
        )
    
    dept = db.query(models.Department).filter(
        models.Department.department_id == department_id
    ).first()
    
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
    
    current_date = datetime.utcnow()
    
    # Get current month aggregated metrics
    dept_agg = db.query(models.DepartmentAdoptionAgg).filter(
        models.DepartmentAdoptionAgg.department_id == department_id,
        models.DepartmentAdoptionAgg.month == current_date.month,
        models.DepartmentAdoptionAgg.year == current_date.year,
    ).first()
    
    if not dept_agg:
        # Calculate on-the-fly if not pre-aggregated
        metrics = db.query(models.AIAdoptionMetrics).join(
            models.Employee
        ).filter(
            models.Employee.department_id == department_id,
            models.AIAdoptionMetrics.month == current_date.month,
            models.AIAdoptionMetrics.year == current_date.year,
        ).all()
        
        active_count = len([m for m in metrics if m.adoption_score is not None])
        total_count = db.query(models.Employee).filter(
            models.Employee.department_id == department_id,
            models.Employee.status == "active"
        ).count()
        
        avg_score = sum([m.adoption_score for m in metrics if m.adoption_score]) / active_count if active_count > 0 else 0
        total_hours = sum([m.hours_saved for m in metrics if m.hours_saved]) if metrics else 0
        participation = (active_count / total_count * 100) if total_count > 0 else 0
        
        return schemas.DepartmentOverview(
            department_id=department_id,
            department_name=dept.name,
            avg_score=float(avg_score),
            participation_rate=float(participation),
            total_hours_saved=float(total_hours),
            total_employees=total_count,
            active_users=active_count,
        )
    
    return schemas.DepartmentOverview(
        department_id=department_id,
        department_name=dept.name,
        avg_score=float(dept_agg.avg_score or 0),
        participation_rate=float(dept_agg.participation_rate or 0),
        total_hours_saved=float(dept_agg.total_hours_saved or 0),
        total_employees=dept_agg.total_employees or 0,
        active_users=dept_agg.active_users or 0,
    )


@router.post("/adoption-metrics", response_model=schemas.AdoptionMetric)
async def create_adoption_metric(
    metric: schemas.AdoptionMetricBase,
    user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create or update adoption metrics for current user.
    
    Only accessible by admins or for the current user.
    """
    current_date = datetime.utcnow()
    
    # Find existing metric
    existing = db.query(models.AIAdoptionMetrics).filter(
        models.AIAdoptionMetrics.employee_id == user.employee_id,
        models.AIAdoptionMetrics.month == current_date.month,
        models.AIAdoptionMetrics.year == current_date.year,
    ).first()
    
    if existing:
        # Update existing
        existing.adoption_score = metric.adoption_score
        existing.tasks_ai_assisted = metric.tasks_ai_assisted
        existing.hours_saved = metric.hours_saved
        existing.tools_explored = metric.tools_explored
        existing.learning_hours = metric.learning_hours
        db.commit()
        db.refresh(existing)
        return existing
    else:
        # Create new
        new_metric = models.AIAdoptionMetrics(
            employee_id=user.employee_id,
            month=current_date.month,
            year=current_date.year,
            adoption_score=metric.adoption_score,
            tasks_ai_assisted=metric.tasks_ai_assisted,
            hours_saved=metric.hours_saved,
            tools_explored=metric.tools_explored,
            learning_hours=metric.learning_hours,
        )
        db.add(new_metric)
        db.commit()
        db.refresh(new_metric)
        return new_metric


@router.get("/adoption-metrics/history")
async def get_adoption_history(
    months: int = 12,
    user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get user's adoption metrics history for specified number of months.
    """
    metrics = db.query(models.AIAdoptionMetrics).filter(
        models.AIAdoptionMetrics.employee_id == user.employee_id,
    ).order_by(
        models.AIAdoptionMetrics.year,
        models.AIAdoptionMetrics.month
    ).all()[-months:]
    
    return {
        "employee_id": user.employee_id,
        "months": months,
        "data": [
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
    }
