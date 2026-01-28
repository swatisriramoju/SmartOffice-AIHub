#!/usr/bin/env python3
import json
import random
from datetime import datetime, timedelta

# Seed for reproducibility
random.seed(42)

# Data templates
first_names_arabic = ['Mohammed', 'Ahmed', 'Ali', 'Hassan', 'Khalid', 'Omar', 'Saleh', 'Ibrahim', 'Nabil', 'Faisal', 'Jamal', 'Tariq', 'Wael', 'Karim', 'Majed', 'Yousef', 'Rashid', 'Mansour', 'Saeed', 'Amr']
first_names_female_arabic = ['Aisha', 'Layla', 'Nora', 'Fatima', 'Zainab', 'Amira', 'Haya', 'Maryam', 'Zahra', 'Yasmin', 'Lina', 'Dina', 'Nawal', 'Reem', 'Leena']
first_names_western = ['Michael', 'James', 'Robert', 'David', 'Richard', 'Thomas', 'Charles', 'Christopher', 'Daniel', 'Matthew', 'Anthony', 'Donald', 'Mark', 'Steven']
first_names_female_western = ['Patricia', 'Jessica', 'Jennifer', 'Linda', 'Susan', 'Karen', 'Lisa', 'Nancy', 'Betty', 'Margaret', 'Sandra', 'Elena']
first_names_indian = ['Rajesh', 'Vikram', 'Priya', 'Ravi', 'Leena', 'Deepak', 'Sunita', 'Anil', 'Neha', 'Saira']
last_names_arabic = ['Al-Mansouri', 'Al-Mazrouei', 'Al-Noor', 'Al-Shaibani', 'Al-Khaja', 'Al-Kaabi', 'Al-Ketbi', 'Al-Kalbani', 'Al-Khoori', 'Al-Falasi', 'Al-Dosari', 'Al-Ali', 'Al-Marri', 'Al-Suwaidi', 'Al-Noman', 'Al-Khail', 'Al-Muhairi', 'Al-Midfa', 'Al-Balushi', 'Abu Zaid']
last_names_western = ['Anderson', 'Thompson', 'Williams', 'Johnson', 'Jones', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Murphy', 'Foster', 'Mitchell', 'Park', 'Chen', 'Rossi', 'Michel', 'Volkov']

departments = ['Operations', 'Engineering', 'Customer Care', 'IT', 'Finance', 'Sustainability', 'HR']

roles_by_dept = {
    'Operations': ['Operations Manager', 'Supervisor', 'Field Engineer', 'Shift Manager', 'Operations Analyst', 'Operations Executive', 'Field Technician', 'Plant Manager', 'Distribution Manager', 'Senior Operations Manager'],
    'Engineering': ['Senior Engineer', 'Engineer', 'Civil Engineer', 'Mechanical Engineer', 'Electrical Engineer', 'Junior Engineer', 'Technician', 'Chief Engineer', 'VP Engineering'],
    'Customer Care': ['Team Lead', 'Customer Service Representative', 'Quality Assurance Specialist', 'Supervisor', 'Customer Service Manager', 'Billing Specialist', 'Director of Customer Experience', 'Operations Manager'],
    'IT': ['Systems Administrator', 'Network Engineer', 'IT Support Specialist', 'Database Administrator', 'Systems Engineer', 'IT Director', 'Chief Information Officer'],
    'Finance': ['Finance Manager', 'Financial Analyst', 'Accountant', 'Budget Analyst', 'Payroll Specialist', 'CFO', 'Controller', 'Treasurer'],
    'Sustainability': ['Sustainability Officer', 'Environmental Analyst', 'Senior Sustainability Manager', 'Analyst', 'VP Sustainability'],
    'HR': ['HR Specialist', 'Recruitment Coordinator', 'HR Manager', 'VP Human Resources']
}

locations = ['Dubai HQ', 'Power Station', 'Water Plant', 'Remote']

ai_tools = [
    'Copilot for M365',
    'AI Chatbot',
    'Document Summarizer',
    'Data Insight Assistant',
    'Process Optimizer',
    'Predictive Maintenance Bot',
    'Customer Insight Engine',
    'Response Generator',
    'Mobile Assistant',
    'Environmental Impact Tracker',
    'Financial Forecaster',
    'System Optimizer',
    'Network Analyzer',
    'CAD Assistant',
    'Quality Checker',
    'Database Optimizer',
    'Query Assistant',
    'Electrical Analyzer',
    'Recruitment Assistant',
    'Executive Dashboard',
    'ROI Calculator',
    'Infrastructure AI',
    'Engineering Analytics',
    'Sustainability Analyzer',
    'Logistics Optimizer',
    'Employee Analytics'
]

def generate_name():
    rand = random.random()
    if rand < 0.25:
        return random.choice(first_names_arabic) + ' ' + random.choice(last_names_arabic)
    elif rand < 0.35:
        return random.choice(first_names_female_arabic) + ' ' + random.choice(last_names_arabic)
    elif rand < 0.55:
        return random.choice(first_names_western) + ' ' + random.choice(last_names_western)
    elif rand < 0.65:
        return random.choice(first_names_female_western) + ' ' + random.choice(last_names_western)
    else:
        return random.choice(first_names_indian) + ' ' + random.choice(last_names_western)

def generate_user(user_id):
    join_year = random.randint(2015, 2024)
    dept = random.choice(departments)
    role = random.choice(roles_by_dept[dept])
    location = random.choice(locations)
    
    # Seniority mapping
    is_senior = 'Manager' in role or 'Lead' in role or 'Supervisor' in role or 'VP' in role or 'Chief' in role or 'Director' in role or 'Officer' in role or 'CFO' in role or 'Controller' in role or 'Treasurer' in role
    years_tenure = 2026 - join_year
    
    # Adoption score correlates with tenure and seniority
    if is_senior:
        base_adoption = random.randint(75, 88)
    elif years_tenure >= 5:
        base_adoption = random.randint(65, 82)
    elif years_tenure >= 3:
        base_adoption = random.randint(55, 75)
    else:
        base_adoption = random.randint(45, 65)
    
    adoption_score = min(100, base_adoption)
    
    # Generate monthly trend (realistic progression)
    trend = []
    current = max(30, adoption_score - random.randint(8, 15))
    for _ in range(6):
        trend.append(current)
        current = min(adoption_score, current + random.randint(1, 4))
    
    ai_tools_count = max(1, min(5, (adoption_score // 20)))
    tools_used = random.sample(ai_tools, ai_tools_count)
    
    tasks_automated = max(1, int((adoption_score / 100) * 45))
    
    # Frequency based on score
    if adoption_score >= 80:
        frequency = 'High'
    elif adoption_score >= 60:
        frequency = 'Medium'
    else:
        frequency = 'Low'
    
    # Badges earned
    badges = []
    if adoption_score >= 75:
        badges.append('First Automation')
    if adoption_score >= 80:
        badges.append('Power User')
    if adoption_score >= 85:
        badges.append('AI Innovator')
    if adoption_score >= 75 and random.random() < 0.4:
        badges.append('Learning Champion')
    
    # Learning path
    if adoption_score >= 80:
        learning_path = 'Advanced'
    elif adoption_score >= 60:
        learning_path = 'Intermediate'
    else:
        learning_path = 'Beginner'
    
    tutorials_completed = max(1, int((adoption_score / 100) * 26))
    
    # Certifications
    certs = []
    if adoption_score >= 65:
        certs.append('Responsible AI')
    if adoption_score >= 70:
        certs.append('Copilot Fundamentals')
    if adoption_score >= 78 and is_senior:
        certs.append('AI for Utilities')
    if adoption_score >= 85 and is_senior:
        certs.append('Leadership Excellence')
    
    learning_hours = max(5, int((tutorials_completed / 26) * 45))
    
    # ROI calculations
    hours_saved = tasks_automated * 8
    
    if adoption_score >= 80:
        roi_category = 'High'
        productivity_gain = random.randint(18, 25)
    elif adoption_score >= 60:
        roi_category = 'Medium'
        productivity_gain = random.randint(10, 17)
    else:
        roi_category = 'Low'
        productivity_gain = random.randint(5, 9)
    
    # Leaderboard points correlate with adoption
    leaderboard_points = int((adoption_score / 100) * 8750)
    
    # Monthly tasks trend
    tasks_trend = []
    current_tasks = max(1, tasks_automated - random.randint(4, 8))
    for _ in range(6):
        tasks_trend.append(current_tasks)
        current_tasks = min(tasks_automated, current_tasks + random.randint(0, 2))
    
    # Last active date (within 90 days)
    days_ago = random.randint(0, 90)
    last_active = (datetime.now() - timedelta(days=days_ago)).strftime('%Y-%m-%d')
    
    return {
        'userId': user_id,
        'employeeName': generate_name(),
        'department': dept,
        'role': role,
        'location': location,
        'joinYear': join_year,
        'adoptionScore': adoption_score,
        'monthlyAdoptionTrend': trend,
        'aiToolsUsedCount': ai_tools_count,
        'tasksAutomated': tasks_automated,
        'aiUsageFrequency': frequency,
        'badgesEarned': badges,
        'leaderboardPoints': leaderboard_points,
        'leaderboardRank': 0,
        'aiToolsUsed': tools_used,
        'ssoEnabled': random.random() < 0.95,
        'learningPath': learning_path,
        'tutorialsCompleted': tutorials_completed,
        'certificationsEarned': certs,
        'learningHoursCompleted': float(learning_hours),
        'estimatedHoursSaved': hours_saved,
        'estimatedProductivityGainPercent': productivity_gain,
        'roiCategory': roi_category,
        'lastActiveDate': last_active,
        'monthlyTasksAutomatedTrend': tasks_trend
    }

# Generate 1050 users (to include 50 seed + 1000 generated)
users = []
for i in range(1051, 2101):
    users.append(generate_user(i))

# Assign leaderboard ranks based on leaderboard points
users_sorted = sorted(users, key=lambda x: x['leaderboardPoints'], reverse=True)
for rank, user in enumerate(users_sorted, 1):
    user['leaderboardRank'] = rank

# Randomize order
random.shuffle(users)

# Save to JSON
output_file = r'data\users_testdata_full.json'
with open(output_file, 'w') as f:
    json.dump(users, f, indent=2)

print(f'Generated {len(users)} user records')
print(f'Saved to {output_file}')
