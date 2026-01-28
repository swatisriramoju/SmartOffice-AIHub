-- Sample data for Smart Office AI Adoption Hub
-- Run after schema.sql

-- ============================================
-- DEPARTMENTS
-- ============================================
INSERT INTO departments (name, description, status) VALUES
('Water Operations', 'Water supply and distribution management', 'active'),
('Electricity Engineering', 'Power generation and distribution', 'active'),
('Customer Service', 'Customer billing and support', 'active'),
('Field Services', 'Maintenance and field operations', 'active'),
('Corporate Services', 'HR, Finance, IT Support', 'active'),
('Sustainability & Innovation', 'Research and sustainability initiatives', 'active');

-- ============================================
-- EMPLOYEES
-- ============================================
INSERT INTO employees (email, display_name, department_id, role, status, hire_date) VALUES
('sarah.almansouri@dewa.gov.ae', 'Sarah Al-Mansouri', 1, 'Operations Manager', 'active', '2018-05-15'),
('mohammed.almazrouei@dewa.gov.ae', 'Mohammed Al-Mazrouei', 2, 'Senior Engineer', 'active', '2016-08-20'),
('fatima.alkhayat@dewa.gov.ae', 'Fatima Al-Khayat', 4, 'Field Services Lead', 'active', '2019-03-10'),
('ahmed.hassan@dewa.gov.ae', 'Ahmed Hassan', 3, 'Customer Service Supervisor', 'active', '2017-11-05'),
('noor.almarri@dewa.gov.ae', 'Noor Al-Marri', 5, 'Compliance Officer', 'active', '2020-01-20'),
('ali.almulla@dewa.gov.ae', 'Ali Al-Mulla', 1, 'Operations Analyst', 'active', '2021-06-15'),
('layla.alhasani@dewa.gov.ae', 'Layla Al-Hasani', 2, 'Systems Engineer', 'active', '2020-09-01'),
('rashid.alkindi@dewa.gov.ae', 'Rashid Al-Kindi', 4, 'Maintenance Technician', 'active', '2019-07-22'),
('hana.alhosani@dewa.gov.ae', 'Hana Al-Hosani', 3, 'Customer Service Representative', 'active', '2021-02-14'),
('karim.almaktoumi@dewa.gov.ae', 'Karim Al-Maktoumi', 6, 'Innovation Manager', 'active', '2021-04-01'),
('ranya.alshamsi@dewa.gov.ae', 'Ranya Al-Shamsi', 5, 'IT Administrator', 'active', '2018-10-10'),
('david.smith@dewa.gov.ae', 'David Smith', 2, 'Technical Analyst', 'active', '2019-12-03');

-- Update department managers
UPDATE departments SET manager_id = 1 WHERE department_id = 1;
UPDATE departments SET manager_id = 2 WHERE department_id = 2;
UPDATE departments SET manager_id = 4 WHERE department_id = 4;
UPDATE departments SET manager_id = 5 WHERE department_id = 5;

-- ============================================
-- AI ADOPTION METRICS (Current Month - January 2026)
-- ============================================
INSERT INTO ai_adoption_metrics (employee_id, month, year, adoption_score, tasks_ai_assisted, hours_saved, tools_explored, learning_hours) VALUES
(1, 1, 2026, 78, 24, 38.5, 8, 12.0),
(2, 1, 2026, 95, 42, 68.0, 12, 20.0),
(3, 1, 2026, 87, 35, 54.0, 10, 16.0),
(4, 1, 2026, 82, 28, 45.0, 9, 14.0),
(5, 1, 2026, 78, 22, 36.0, 7, 10.0),
(6, 1, 2026, 65, 18, 28.0, 6, 8.0),
(7, 1, 2026, 72, 20, 32.0, 7, 9.0),
(8, 1, 2026, 58, 14, 22.0, 5, 6.0),
(9, 1, 2026, 68, 19, 30.0, 6, 7.0),
(10, 1, 2026, 88, 38, 62.0, 11, 18.0),
(11, 1, 2026, 75, 25, 40.0, 8, 11.0),
(12, 1, 2026, 92, 40, 65.0, 11, 19.0);

-- Previous month data (December 2025)
INSERT INTO ai_adoption_metrics (employee_id, month, year, adoption_score, tasks_ai_assisted, hours_saved, tools_explored, learning_hours) VALUES
(1, 12, 2025, 76, 22, 35.0, 7, 11.0),
(2, 12, 2025, 92, 40, 65.0, 11, 19.0),
(3, 12, 2025, 85, 33, 51.0, 9, 15.0),
(4, 12, 2025, 80, 26, 42.0, 8, 13.0),
(5, 12, 2025, 76, 20, 33.0, 6, 9.0),
(6, 12, 2025, 62, 16, 25.0, 5, 7.0),
(7, 12, 2025, 70, 18, 29.0, 6, 8.0),
(8, 12, 2025, 55, 12, 19.0, 4, 5.0),
(9, 12, 2025, 66, 17, 27.0, 5, 6.0),
(10, 12, 2025, 85, 36, 58.0, 10, 17.0),
(11, 12, 2025, 73, 23, 37.0, 7, 10.0),
(12, 12, 2025, 90, 38, 62.0, 10, 18.0);

-- ============================================
-- DEPARTMENT ADOPTION AGGREGATES
-- ============================================
INSERT INTO department_adoption_agg (department_id, month, year, avg_score, participation_rate, total_hours_saved, total_employees, active_users) VALUES
(1, 1, 2026, 71.5, 100.0, 66.5, 2, 2),
(2, 1, 2026, 86.3, 100.0, 133.0, 3, 3),
(3, 1, 2026, 75.0, 100.0, 75.0, 2, 2),
(4, 1, 2026, 72.5, 100.0, 76.0, 2, 2),
(5, 1, 2026, 76.5, 100.0, 76.0, 2, 2),
(6, 1, 2026, 88.0, 100.0, 62.0, 1, 1);

-- ============================================
-- AI TOOLS
-- ============================================
INSERT INTO ai_tools (name, description, category, sso_url, documentation_url, data_classification, is_active, requires_approval, safety_critical) VALUES
('Copilot in Microsoft 365', 'AI-powered assistant across Teams, Word, Excel, PowerPoint, Outlook. Drafts emails, analyzes data, summarizes meetings.', 'productivity', 'https://teams.microsoft.com/home', 'https://learn.microsoft.com/en-us/copilot', 'internal', TRUE, FALSE, FALSE),
('Copilot in Power BI', 'Natural language query and AI-assisted analytics. Create visualizations and discover insights from DEWA data.', 'analytics', 'https://app.powerbi.com', 'https://learn.microsoft.com/en-us/power-bi/copilot', 'internal', TRUE, FALSE, FALSE),
('Water Demand Forecasting', 'Predicts water demand with 94% accuracy. Supports capacity planning and resource optimization.', 'operations', 'https://analytics.dewa.gov.ae/water-forecast', 'https://intranet.dewa.gov.ae/docs/water-forecast', 'internal', TRUE, FALSE, FALSE),
('Electricity Load Forecasting', 'Forecasts power load with 91% accuracy. Supports grid balancing and generation planning. AED 4.2M annual savings.', 'operations', 'https://analytics.dewa.gov.ae/load-forecast', 'https://intranet.dewa.gov.ae/docs/load-forecast', 'internal', TRUE, FALSE, FALSE),
('Predictive Maintenance AI', 'Analyzes equipment sensor data to predict failures. Integrates with IoT infrastructure.', 'operations', 'https://maintenance.dewa.gov.ae/predict', 'https://intranet.dewa.gov.ae/docs/predictive-maintenance', 'restricted', TRUE, TRUE, TRUE),
('Incident Report Automation', 'Automated incident report generation from field notes and voice recordings. Reduces writing time by 65%.', 'operations', 'https://fieldapp.dewa.gov.ae/incidents', 'https://intranet.dewa.gov.ae/docs/incident-automation', 'internal', TRUE, FALSE, FALSE),
('AI Customer Service Assistant', 'Multilingual AI for customer inquiries. Handles billing, service requests, escalates complex issues.', 'customer', 'https://customer.dewa.gov.ae/chat', 'https://intranet.dewa.gov.ae/docs/customer-ai', 'public', TRUE, FALSE, FALSE),
('DEWA Email Summarizer', 'Summarizes email threads and extracts action items. Powered by Copilot.', 'productivity', 'https://outlook.office.com', 'https://learn.microsoft.com/en-us/copilot/copilot-in-outlook', 'internal', TRUE, FALSE, FALSE),
('Document Intelligence', 'Extracts data from PDFs, forms, and documents. Supports compliance and automation workflows.', 'automation', 'https://forms.office.com', 'https://learn.microsoft.com/en-us/azure/ai-services/document-intelligence', 'internal', TRUE, FALSE, FALSE),
('Rammas Virtual Assistant', 'DEWA AI virtual assistant for general inquiries, policy questions, and support routing.', 'support', 'https://chat.dewa.gov.ae/rammas', 'https://intranet.dewa.gov.ae/docs/rammas', 'public', TRUE, FALSE, FALSE);

-- ============================================
-- LEARNING RESOURCES
-- ============================================
INSERT INTO learning_resources (title, description, type, provider, difficulty_level, duration_minutes, tags, is_mandatory, is_active) VALUES
('AI Fundamentals & DEWA Context', 'Introduction to AI concepts and how they apply to DEWA operations.', 'course', 'viva', 'beginner', 240, 'ai,basics,required', TRUE, TRUE),
('Responsible AI & Safety Protocols', 'Critical training on safe and compliant AI usage for utilities.', 'course', 'viva', 'beginner', 180, 'safety,compliance,required', TRUE, TRUE),
('Copilot for Microsoft 365 Essentials', 'Learn to use Copilot across Teams, Word, Excel, and Outlook.', 'video', 'viva', 'beginner', 60, 'copilot,productivity', FALSE, TRUE),
('Power BI for Data Analysis', 'Master data visualization and insight discovery using Power BI with AI.', 'course', 'viva', 'intermediate', 240, 'powerbi,analytics,data', FALSE, TRUE),
('Advanced Prompt Engineering', 'Techniques for getting better results from Copilot and other AI tools.', 'course', 'viva', 'advanced', 180, 'copilot,prompts,advanced', FALSE, TRUE),
('Leading AI Adoption in Your Team', 'For managers: strategies to encourage responsible AI adoption on your team.', 'course', 'hr', 'intermediate', 120, 'leadership,management,ai', FALSE, TRUE),
('Data Security & Classification', 'Understanding DEWA data classification and what can be shared with AI tools.', 'video', 'hr', 'beginner', 45, 'security,compliance,data', TRUE, TRUE),
('Rammas Virtual Assistant Guide', 'How to use Rammas for common HR and IT support questions.', 'guide', 'internal', 'beginner', 15, 'support,rammas', FALSE, TRUE),
('Case Studies: AI Success Stories', 'Real examples of how DEWA teams saved time and improved decisions using AI.', 'video', 'internal', 'beginner', 30, 'inspiration,case-studies', FALSE, TRUE),
('Water Operations AI Deep Dive', 'Advanced training for water operations teams on demand forecasting and optimization.', 'course', 'viva', 'advanced', 300, 'water,operations,advanced', FALSE, TRUE);

-- ============================================
-- GAMIFICATION BADGES
-- ============================================
INSERT INTO gamification_badges (name, description, icon_url, level) VALUES
('First Steps', 'Completed your first AI learning module', '🚀', 1),
('Power User', 'Used 5 different approved AI tools', '⚡', 2),
('Learning Champion', 'Completed 3 courses or learning paths', '🎓', 2),
('AI Innovator', 'Created or shared an innovative AI use case', '💡', 3),
('Expert', 'Earned certification in AI adoption', '🌟', 3),
('Mentor', 'Helped 3 peers with AI adoption', '👥', 3);

-- ============================================
-- USER BADGES (Earned)
-- ============================================
INSERT INTO user_badges (employee_id, badge_id) VALUES
(1, 1), (1, 2), (1, 3),
(2, 1), (2, 2), (2, 3), (2, 4), (2, 5),
(3, 1), (3, 2), (3, 3),
(4, 1), (4, 2), (4, 3),
(5, 1), (5, 2),
(6, 1),
(7, 1), (7, 2),
(10, 1), (10, 2), (10, 3), (10, 4),
(12, 1), (12, 2), (12, 3), (12, 5);

-- ============================================
-- USER POINTS
-- ============================================
INSERT INTO user_points (employee_id, total_points, month_points) VALUES
(1, 3500, 450),
(2, 8500, 1200),
(3, 6200, 850),
(4, 4700, 650),
(5, 3400, 400),
(6, 2100, 300),
(7, 3200, 420),
(8, 1800, 250),
(9, 2600, 350),
(10, 7800, 1100),
(11, 3800, 520),
(12, 8200, 1150);

-- ============================================
-- LEARNING PROGRESS
-- ============================================
INSERT INTO user_learning_progress (employee_id, resource_id, status, progress_percent, completed_at) VALUES
(1, 1, 'completed', 100, '2026-01-20'),
(1, 2, 'completed', 100, '2026-01-22'),
(1, 3, 'in_progress', 65, NULL),
(2, 1, 'completed', 100, '2026-01-15'),
(2, 2, 'completed', 100, '2026-01-17'),
(2, 3, 'completed', 100, '2026-01-18'),
(2, 4, 'completed', 100, '2026-01-23'),
(3, 1, 'completed', 100, '2026-01-19'),
(3, 2, 'completed', 100, '2026-01-21'),
(3, 7, 'completed', 100, '2026-01-16'),
(4, 1, 'completed', 100, '2026-01-18'),
(4, 2, 'completed', 100, '2026-01-20'),
(5, 1, 'completed', 100, '2026-01-25'),
(5, 7, 'completed', 100, '2026-01-24'),
(6, 1, 'in_progress', 40, NULL),
(6, 7, 'not_started', 0, NULL);

-- ============================================
-- MONTHLY CHALLENGE
-- ============================================
INSERT INTO monthly_challenges (month, year, title, description, reward_points, status) VALUES
(1, 2026, 'AI Explorer', 'Use 3 different AI tools this month', 500, 'active');

-- ============================================
-- USER CHALLENGE PROGRESS
-- ============================================
INSERT INTO user_challenge_progress (employee_id, challenge_id, progress_percent, completed) VALUES
(1, 1, 100, TRUE),
(2, 1, 100, TRUE),
(3, 1, 100, TRUE),
(4, 1, 80, FALSE),
(5, 1, 60, FALSE),
(6, 1, 40, FALSE),
(7, 1, 70, FALSE),
(10, 1, 100, TRUE),
(12, 1, 100, TRUE);

-- ============================================
-- NOTIFICATIONS
-- ============================================
INSERT INTO notifications (employee_id, type, title, message, is_read) VALUES
(1, 'badge_earned', 'Badge Unlocked!', 'You earned the "Learning Champion" badge!', FALSE),
(2, 'milestone', 'Adoption Milestone', 'You reached 95% adoption score this month!', TRUE),
(3, 'challenge', 'Monthly Challenge', 'You completed the "AI Explorer" challenge!', FALSE),
(4, 'learning', 'Learning Path Available', 'New advanced course available: "Power BI for Ops"', FALSE),
(5, 'new_tool', 'New Tool Available', 'Check out Predictive Maintenance AI (request access)', FALSE);

-- ============================================
-- VERIFY DATA
-- ============================================
SELECT 'Departments: ' || COUNT(*) FROM departments;
SELECT 'Employees: ' || COUNT(*) FROM employees;
SELECT 'Adoption Metrics: ' || COUNT(*) FROM ai_adoption_metrics;
SELECT 'AI Tools: ' || COUNT(*) FROM ai_tools;
SELECT 'Learning Resources: ' || COUNT(*) FROM learning_resources;
SELECT 'Badges: ' || COUNT(*) FROM gamification_badges;
SELECT 'User Badges: ' || COUNT(*) FROM user_badges;
