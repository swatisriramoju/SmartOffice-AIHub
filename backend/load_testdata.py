"""
Test data loader - imports JSON test data into the database
Maps test data format to database models
"""

import json
import os
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import (
    Base, Department, Employee, AIAdoptionMetrics, AITool, 
    UserBadge, UserPoints, LearningResource, UserLearningProgress,
    GamificationBadge
)

# ============================================
# STATIC DATA
# ============================================

DEPARTMENTS = {
    "Operations": "Daily operations and facility management",
    "Engineering": "Technical engineering and maintenance",
    "Customer Care": "Customer service and support",
    "IT": "Information technology and systems",
    "Finance": "Finance and accounting",
    "Sustainability": "Environmental sustainability",
    "HR": "Human resources",
}

BADGES_MAP = {
    "First Automation": "Earned your first automated task",
    "AI Innovator": "Created innovative AI workflows",
    "Power User": "Expert tool proficiency",
    "Learning Champion": "Completed multiple learning courses",
    "Productivity Master": "Saved 300+ hours",
}

AI_TOOLS = {
    "Copilot for M365": "Microsoft Copilot integration for Office 365",
    "AI Chatbot": "Internal conversational AI assistant",
    "Document Summarizer": "Automatic document summarization tool",
    "Data Insight Assistant": "Data analysis and visualization",
    "Process Optimizer": "Business process optimization AI",
    "Predictive Maintenance Bot": "Maintenance prediction system",
    "Email Assistant": "AI-powered email management",
}

CERTIFICATIONS = {
    "Responsible AI": "Ethics and responsible AI",
    "Copilot Fundamentals": "Microsoft Copilot basics",
    "AI for Utilities": "AI applications in utilities",
    "Leadership Excellence": "Leadership in AI era",
    "Data Science Basics": "Data science fundamentals",
    "Machine Learning 101": "Introduction to ML",
}

LEARNING_RESOURCES = [
    {"title": "Introduction to AI", "type": "course", "provider": "LinkedIn Learning", "difficulty": "beginner", "duration": 120},
    {"title": "Copilot for Productivity", "type": "course", "provider": "Microsoft Learn", "difficulty": "beginner", "duration": 90},
    {"title": "AI Ethics and Governance", "type": "course", "provider": "Coursera", "difficulty": "intermediate", "duration": 180},
    {"title": "Advanced AI Applications", "type": "course", "provider": "Udacity", "difficulty": "advanced", "duration": 240},
    {"title": "AI in Utilities Sector", "type": "webinar", "provider": "DEWA Training", "difficulty": "intermediate", "duration": 60},
]

# ============================================
# HELPER FUNCTIONS
# ============================================

def create_user_dict(test_user: dict) -> dict:
    """Convert test data format to database format"""
    email = f"{test_user['employeeName'].lower().replace(' ', '.')}@dewa.gov.ae"
    
    return {
        "employee_id": test_user["userId"],
        "email": email,
        "display_name": test_user["employeeName"],
        "department": test_user["department"],
        "role": test_user["role"],
        "hire_date": datetime(test_user["joinYear"], 1, 1),
        "adoption_score": test_user["adoptionScore"],
        "tasks_automated": test_user["tasksAutomated"],
        "hours_saved": test_user["estimatedHoursSaved"],
        "tools_used": test_user["aiToolsUsedCount"],
        "learning_hours": test_user["learningHoursCompleted"],
        "badges": test_user.get("badgesEarned", []),
        "leaderboard_points": test_user.get("leaderboardPoints", 0),
        "leaderboard_rank": test_user.get("leaderboardRank", 1000),
        "tools_list": test_user.get("aiToolsUsed", []),
        "certifications": test_user.get("certificationsEarned", []),
        "monthly_trend": test_user.get("monthlyAdoptionTrend", []),
        "last_active": test_user.get("lastActiveDate", "2026-01-28"),
    }

# ============================================
# MAIN LOADING FUNCTION
# ============================================

def load_test_data():
    """Load test data from JSON files into the database"""
    
    # Create tables
    print("Creating database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Step 1: Create departments
        print("\n1. Creating departments...")
        for dept_name, dept_desc in DEPARTMENTS.items():
            existing = db.query(Department).filter(Department.name == dept_name).first()
            if not existing:
                dept = Department(name=dept_name, description=dept_desc, status="active")
                db.add(dept)
                print(f"   ✓ {dept_name}")
        db.commit()
        
        # Step 2: Create gamification badges
        print("\n2. Creating gamification badges...")
        for badge_name, badge_desc in BADGES_MAP.items():
            existing = db.query(GamificationBadge).filter(GamificationBadge.name == badge_name).first()
            if not existing:
                badge = GamificationBadge(
                    name=badge_name,
                    description=badge_desc,
                    level=1,
                )
                db.add(badge)
                print(f"   ✓ {badge_name}")
        db.commit()
        
        # Step 3: Create AI tools
        print("\n3. Creating AI tools...")
        for tool_name, tool_desc in AI_TOOLS.items():
            existing = db.query(AITool).filter(AITool.name == tool_name).first()
            if not existing:
                tool = AITool(
                    name=tool_name,
                    description=tool_desc,
                    category="Productivity",
                    is_active=True,
                    requires_approval=False,
                )
                db.add(tool)
                print(f"   ✓ {tool_name}")
        db.commit()
        # Step 4: Create learning resources
        print("\n4. Creating learning resources...")
        for resource in LEARNING_RESOURCES:
            existing = db.query(LearningResource).filter(
                LearningResource.title == resource["title"]
            ).first()
            if not existing:
                lr = LearningResource(
                    title=resource["title"],
                    type=resource["type"],
                    provider=resource["provider"],
                    difficulty_level=resource["difficulty"],
                    duration_minutes=resource["duration"],
                    is_active=True,
                )
                db.add(lr)
                print(f"   ✓ {resource['title']}")
        db.commit()
        
        # Step 5: Load test data from JSON files
        print("\n5. Loading employees from test data...")
        
        test_data_dir = "data"
        json_files = [
            "users_testdata_sample.json",
            "users_comprehensive_testdata_part1.json",
            "users_comprehensive_testdata_part2.json",
            "users_testdata_batch2.json",
            "users_testdata.json",
        ]
        
        employees_created = 0
        for json_file in json_files:
            file_path = os.path.join(test_data_dir, json_file)
            if not os.path.exists(file_path):
                print(f"   ⚠ {json_file} not found, skipping...")
                continue
            
            with open(file_path, 'r', encoding='utf-8') as f:
                test_users = json.load(f)
            
            print(f"\n   Processing {json_file} ({len(test_users)} records)...")
            
            for test_user in test_users:
                # Check if employee exists
                existing_emp = db.query(Employee).filter(
                    Employee.employee_id == test_user["userId"]
                ).first()
                
                if existing_emp:
                    print(f"      ⊘ User {test_user['userId']} already exists, skipping...")
                    continue
                
                user_data = create_user_dict(test_user)
                
                # Get department
                dept = db.query(Department).filter(
                    Department.name == user_data["department"]
                ).first()
                
                if not dept:
                    print(f"      ✗ Department '{user_data['department']}' not found for {test_user['employeeName']}")
                    continue
                
                # Create employee
                employee = Employee(
                    employee_id=user_data["employee_id"],
                    email=user_data["email"],
                    display_name=user_data["display_name"],
                    department_id=dept.department_id,
                    role=user_data["role"],
                    status="active",
                    hire_date=user_data["hire_date"],
                )
                db.add(employee)
                db.flush()  # Ensure employee is created before adding adoption metrics
                
                # Create adoption metrics for current month (January 2026)
                adoption = AIAdoptionMetrics(
                    employee_id=employee.employee_id,
                    month=1,
                    year=2026,
                    adoption_score=user_data["adoption_score"],
                    tasks_ai_assisted=user_data["tasks_automated"],
                    hours_saved=user_data["hours_saved"],
                    tools_explored=user_data["tools_used"],
                    learning_hours=user_data["learning_hours"],
                )
                db.add(adoption)
                
                # Add historical metrics (6 months)
                monthly_trend = user_data.get("monthly_trend", [])
                if monthly_trend:
                    base_tasks = user_data["tasks_automated"]
                    for i, adoption_score in enumerate(monthly_trend):
                        month = 8 + i  # August to January
                        year = 2025 if month < 12 else 2026
                        if month >= 12:
                            month = month - 12
                        
                        historical = AIAdoptionMetrics(
                            employee_id=employee.employee_id,
                            month=month,
                            year=year,
                            adoption_score=adoption_score,
                            tasks_ai_assisted=max(1, int(base_tasks * (adoption_score / 100))),
                            hours_saved=max(8, int((base_tasks * (adoption_score / 100)) * 8)),
                            tools_explored=max(1, int(user_data["tools_used"] * (adoption_score / 100))),
                            learning_hours=max(2, (user_data["learning_hours"] * (adoption_score / 100))),
                        )
                        db.add(historical)
                
                # Add badges
                for badge_name in user_data.get("badges", []):
                    if badge_name in BADGES_MAP:
                        badge_def = db.query(GamificationBadge).filter(
                            GamificationBadge.name == badge_name
                        ).first()
                        if badge_def:
                            user_badge = UserBadge(
                                employee_id=employee.employee_id,
                                badge_id=badge_def.badge_id,
                                awarded_on=datetime.now() - timedelta(days=30),
                            )
                            db.add(user_badge)
                
                # Add points
                points = UserPoints(
                    employee_id=employee.employee_id,
                    total_points=user_data.get("leaderboard_points", 0),
                    rank=user_data.get("leaderboard_rank", 1),
                    last_updated=datetime.now(),
                )
                db.add(points)
                
                # Add learning progress
                learning_resources = db.query(LearningResource).all()
                completed_count = len(user_data.get("certifications", []))
                for i, cert_name in enumerate(user_data.get("certifications", [])):
                    if i < len(learning_resources):
                        progress = UserLearningProgress(
                            employee_id=employee.employee_id,
                            resource_id=learning_resources[i].resource_id,
                            progress_percent=100,
                            status="completed",
                            completed_at=datetime.now() - timedelta(days=60 - i*10),
                        )
                        db.add(progress)
                
                employees_created += 1
                if employees_created % 10 == 0:
                    print(f"      ✓ {employees_created} employees created so far...")
            
            db.commit()
        
        print(f"\n✅ Successfully loaded {employees_created} employees!")
        print("\nSummary:")
        print(f"  - Departments: {db.query(Department).count()}")
        print(f"  - Employees: {db.query(Employee).count()}")
        print(f"  - AI Tools: {db.query(AITool).count()}")
        print(f"  - Adoption Metrics: {db.query(AIAdoptionMetrics).count()}")
        print(f"  - Badges: {db.query(UserBadge).count()}")
        print(f"  - Learning Resources: {db.query(LearningResource).count()}")
        
    except Exception as e:
        print(f"\n❌ Error loading test data: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    load_test_data()
