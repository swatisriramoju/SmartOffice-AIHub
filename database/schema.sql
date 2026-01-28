-- PostgreSQL Schema for Smart Office AI Adoption Hub
-- Created: January 28, 2026

-- ============================================
-- 1. ORGANIZATIONAL STRUCTURE
-- ============================================

CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    manager_id INTEGER,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE employees (
    employee_id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    display_name VARCHAR(255) NOT NULL,
    department_id INTEGER NOT NULL REFERENCES departments(department_id),
    role VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    hire_date DATE,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key for manager_id after employees table
ALTER TABLE departments ADD CONSTRAINT fk_dept_manager 
    FOREIGN KEY (manager_id) REFERENCES employees(employee_id);

CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_department ON employees(department_id);

-- ============================================
-- 2. AI ADOPTION METRICS
-- ============================================

CREATE TABLE ai_adoption_metrics (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL,
    adoption_score INTEGER CHECK (adoption_score BETWEEN 0 AND 100),
    tasks_ai_assisted INTEGER DEFAULT 0,
    hours_saved DECIMAL(10, 2) DEFAULT 0.00,
    tools_explored INTEGER DEFAULT 0,
    learning_hours DECIMAL(10, 2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, month, year)
);

CREATE TABLE department_adoption_agg (
    id SERIAL PRIMARY KEY,
    department_id INTEGER NOT NULL REFERENCES departments(department_id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL,
    avg_score DECIMAL(5, 2),
    participation_rate DECIMAL(5, 2),
    total_hours_saved DECIMAL(12, 2),
    total_employees INTEGER,
    active_users INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(department_id, month, year)
);

CREATE INDEX idx_adoption_metrics_employee ON ai_adoption_metrics(employee_id, year, month);
CREATE INDEX idx_adoption_metrics_dept ON department_adoption_agg(department_id, year, month);

-- ============================================
-- 3. AI TOOLS CATALOG
-- ============================================

CREATE TABLE ai_tools (
    tool_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    icon_url VARCHAR(500),
    sso_url VARCHAR(500),
    documentation_url VARCHAR(500),
    data_classification VARCHAR(50) NOT NULL DEFAULT 'internal',
    is_active BOOLEAN DEFAULT TRUE,
    requires_approval BOOLEAN DEFAULT FALSE,
    safety_critical BOOLEAN DEFAULT FALSE,
    created_by INTEGER REFERENCES employees(employee_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tool_access_logs (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
    tool_id INTEGER NOT NULL REFERENCES ai_tools(tool_id) ON DELETE CASCADE,
    action VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tools_category ON ai_tools(category);
CREATE INDEX idx_tool_access_logs_employee ON tool_access_logs(employee_id, timestamp);

-- ============================================
-- 4. LEARNING & DEVELOPMENT
-- ============================================

CREATE TABLE learning_resources (
    resource_id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    provider VARCHAR(100) NOT NULL,
    external_id VARCHAR(255),
    difficulty_level VARCHAR(50) DEFAULT 'beginner',
    duration_minutes INTEGER,
    url VARCHAR(500),
    tags VARCHAR(500),
    is_mandatory BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_learning_progress (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
    resource_id INTEGER NOT NULL REFERENCES learning_resources(resource_id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'not_started',
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    progress_percent INTEGER DEFAULT 0,
    score INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, resource_id)
);

CREATE INDEX idx_learning_progress_employee ON user_learning_progress(employee_id);
CREATE INDEX idx_learning_progress_resource ON user_learning_progress(resource_id);

-- ============================================
-- 5. GAMIFICATION
-- ============================================

CREATE TABLE gamification_badges (
    badge_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    icon_url VARCHAR(500),
    criteria_json JSONB,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_badges (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
    badge_id INTEGER NOT NULL REFERENCES gamification_badges(badge_id) ON DELETE CASCADE,
    awarded_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, badge_id)
);

CREATE TABLE user_points (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL UNIQUE REFERENCES employees(employee_id) ON DELETE CASCADE,
    total_points INTEGER DEFAULT 0,
    month_points INTEGER DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE monthly_challenges (
    challenge_id SERIAL PRIMARY KEY,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    criteria_json JSONB,
    reward_points INTEGER DEFAULT 500,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(month, year)
);

CREATE TABLE user_challenge_progress (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
    challenge_id INTEGER NOT NULL REFERENCES monthly_challenges(challenge_id) ON DELETE CASCADE,
    progress_percent INTEGER DEFAULT 0,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(employee_id, challenge_id)
);

CREATE INDEX idx_user_badges_employee ON user_badges(employee_id);
CREATE INDEX idx_user_points_employee ON user_points(employee_id);

-- ============================================
-- 6. NOTIFICATIONS
-- ============================================

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER NOT NULL REFERENCES employees(employee_id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data_json JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    read_at TIMESTAMP
);

CREATE INDEX idx_notifications_employee ON notifications(employee_id, is_read);

-- ============================================
-- 7. AUDIT & LOGGING
-- ============================================

CREATE TABLE audit_logs (
    id SERIAL PRIMARY KEY,
    employee_id INTEGER REFERENCES employees(employee_id),
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100),
    resource_id INTEGER,
    details JSONB,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_logs_employee ON audit_logs(employee_id, timestamp);
CREATE INDEX idx_audit_logs_action ON audit_logs(action, timestamp);

-- ============================================
-- 8. VIEWS FOR COMMON QUERIES
-- ============================================

-- Current month scorecard per employee
CREATE VIEW v_current_month_scorecard AS
SELECT 
    e.employee_id,
    e.display_name,
    e.email,
    d.name AS department_name,
    COALESCE(m.adoption_score, 0) AS adoption_score,
    COALESCE(m.tasks_ai_assisted, 0) AS tasks_automated,
    COALESCE(m.hours_saved, 0) AS hours_saved,
    COALESCE(m.tools_explored, 0) AS tools_explored,
    EXTRACT(MONTH FROM CURRENT_DATE) AS month,
    EXTRACT(YEAR FROM CURRENT_DATE) AS year
FROM employees e
LEFT JOIN departments d ON e.department_id = d.department_id
LEFT JOIN ai_adoption_metrics m ON e.employee_id = m.employee_id 
    AND m.month = EXTRACT(MONTH FROM CURRENT_DATE) 
    AND m.year = EXTRACT(YEAR FROM CURRENT_DATE)
WHERE e.status = 'active';

-- Department leaderboard
CREATE VIEW v_department_leaderboard AS
SELECT 
    d.department_id,
    d.name AS department_name,
    COALESCE(AVG(m.adoption_score), 0) AS avg_score,
    COUNT(DISTINCT CASE WHEN m.adoption_score IS NOT NULL THEN m.employee_id END) AS active_users,
    COUNT(DISTINCT e.employee_id) AS total_employees,
    ROUND(100.0 * COUNT(DISTINCT CASE WHEN m.adoption_score IS NOT NULL THEN m.employee_id END) / 
        NULLIF(COUNT(DISTINCT e.employee_id), 0), 2) AS participation_rate,
    COALESCE(SUM(m.hours_saved), 0) AS total_hours_saved,
    ROW_NUMBER() OVER (ORDER BY COALESCE(AVG(m.adoption_score), 0) DESC) AS rank
FROM departments d
LEFT JOIN employees e ON d.department_id = e.department_id AND e.status = 'active'
LEFT JOIN ai_adoption_metrics m ON e.employee_id = m.employee_id 
    AND m.month = EXTRACT(MONTH FROM CURRENT_DATE) 
    AND m.year = EXTRACT(YEAR FROM CURRENT_DATE)
GROUP BY d.department_id, d.name
ORDER BY avg_score DESC;

-- User stats summary
CREATE VIEW v_user_stats_summary AS
SELECT 
    e.employee_id,
    e.display_name,
    COALESCE(up.total_points, 0) AS total_points,
    COUNT(DISTINCT ub.badge_id) AS badge_count,
    COUNT(DISTINCT CASE WHEN ulp.status = 'completed' THEN ulp.resource_id END) AS resources_completed,
    COUNT(DISTINCT t.tool_id) AS tools_used
FROM employees e
LEFT JOIN user_points up ON e.employee_id = up.employee_id
LEFT JOIN user_badges ub ON e.employee_id = ub.employee_id
LEFT JOIN user_learning_progress ulp ON e.employee_id = ulp.employee_id
LEFT JOIN tool_access_logs tal ON e.employee_id = tal.employee_id
LEFT JOIN ai_tools t ON tal.tool_id = t.tool_id
WHERE e.status = 'active'
GROUP BY e.employee_id, e.display_name, up.total_points;

-- ============================================
-- 9. INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_gamification_badges_level ON gamification_badges(level);
CREATE INDEX idx_learning_resources_type ON learning_resources(type);
CREATE INDEX idx_learning_resources_provider ON learning_resources(provider);
CREATE INDEX idx_audit_logs_timestamp ON audit_logs(timestamp DESC);

-- ============================================
-- 10. TRIGGERS FOR AUDIT & AUTO-UPDATE
-- ============================================

-- Update updated_at timestamp on any table modification
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_employees BEFORE UPDATE ON employees
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_departments BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_ai_adoption_metrics BEFORE UPDATE ON ai_adoption_metrics
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_ai_tools BEFORE UPDATE ON ai_tools
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_learning_resources BEFORE UPDATE ON learning_resources
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trigger_update_user_learning_progress BEFORE UPDATE ON user_learning_progress
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Audit log trigger
CREATE OR REPLACE FUNCTION audit_table_changes()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO audit_logs (action, resource_type, resource_id, details)
    VALUES (TG_OP, TG_TABLE_NAME, NEW.id, row_to_json(NEW));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_audit_ai_adoption AFTER INSERT OR UPDATE ON ai_adoption_metrics
    FOR EACH ROW EXECUTE FUNCTION audit_table_changes();

CREATE TRIGGER trigger_audit_user_badges AFTER INSERT ON user_badges
    FOR EACH ROW EXECUTE FUNCTION audit_table_changes();

-- ============================================
-- SCHEMA VERSION
-- ============================================
CREATE TABLE schema_version (
    version VARCHAR(10) PRIMARY KEY,
    description TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO schema_version VALUES ('1.0.0', 'Initial Smart Office AI Hub schema', CURRENT_TIMESTAMP);
