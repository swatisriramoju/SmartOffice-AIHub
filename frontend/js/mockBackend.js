/**
 * Mock Backend Data Service
 * Loads test data and serves it to the frontend
 * Simulates backend API responses for development/demo
 */

class MockBackendService {
    constructor() {
        this.testData = [];
        this.currentUser = null;
        this.allDepartments = [
            "Operations", "Engineering", "Customer Care", 
            "IT", "Finance", "Sustainability", "HR"
        ];
        this.allTools = [
            "Copilot for M365", "AI Chatbot", "Document Summarizer",
            "Data Insight Assistant", "Process Optimizer", "Predictive Maintenance Bot",
            "Email Assistant"
        ];
        this.initialized = false;
    }

    /**
     * Initialize the service by loading all test data files
     */
    async init() {
        if (this.initialized) return;

        try {
            // Load test data from files
            const dataFiles = [
                'data/users_testdata_sample.json',
                'data/users_comprehensive_testdata_part1.json',
                'data/users_comprehensive_testdata_part2.json',
                'data/users_testdata_batch2.json',
                'data/users_testdata.json'
            ];

            for (const file of dataFiles) {
                try {
                    const response = await fetch(file);
                    if (response.ok) {
                        const data = await response.json();
                        this.testData = [...this.testData, ...data];
                        console.log(`✓ Loaded ${data.length} users from ${file}`);
                    }
                } catch (error) {
                    console.warn(`⚠ Could not load ${file}:`, error.message);
                }
            }

            // Set current user (first user in dataset or random)
            if (this.testData.length > 0) {
                this.currentUser = this.testData[0];
                console.log(`✓ Set current user: ${this.currentUser.employeeName} (ID: ${this.currentUser.userId})`);
            } else {
                console.warn('⚠ No test data loaded, using default mock user');
                this.currentUser = this.createMockUser();
            }

            this.initialized = true;
            console.log(`✓ MockBackendService initialized with ${this.testData.length} total users`);
            return true;

        } catch (error) {
            console.error('❌ Error initializing MockBackendService:', error);
            this.currentUser = this.createMockUser();
            this.initialized = true;
            return false;
        }
    }

    /**
     * Create a default mock user for fallback
     */
    createMockUser() {
        return {
            userId: 1001,
            employeeName: "Mohammed Al-Mansouri",
            department: "Operations",
            role: "Operations Manager",
            location: "Dubai HQ",
            joinYear: 2018,
            adoptionScore: 87,
            monthlyAdoptionTrend: [78, 81, 84, 85, 86, 87],
            aiToolsUsedCount: 5,
            tasksAutomated: 42,
            aiUsageFrequency: "High",
            badgesEarned: ["First Automation", "Power User", "AI Innovator", "Learning Champion"],
            leaderboardPoints: 8750,
            leaderboardRank: 1,
            aiToolsUsed: ["Copilot for M365", "AI Chatbot", "Document Summarizer"],
            ssoEnabled: true,
            learningPath: "Advanced",
            tutorialsCompleted: 24,
            certificationsEarned: ["Responsible AI", "Copilot Fundamentals"],
            learningHoursCompleted: 42.5,
            estimatedHoursSaved: 336,
            estimatedProductivityGainPercent: 22,
            roiCategory: "High",
            lastActiveDate: new Date().toISOString().split('T')[0],
            monthlyTasksAutomatedTrend: [35, 36, 38, 40, 41, 42]
        };
    }

    // ============================================
    // USER ENDPOINTS
    // ============================================

    async getProfile() {
        await this.init();
        return {
            employee_id: this.currentUser.userId,
            email: `${this.currentUser.employeeName.toLowerCase().replace(/\s+/g, '.')}@dewa.gov.ae`,
            display_name: this.currentUser.employeeName,
            department_id: this.allDepartments.indexOf(this.currentUser.department) + 1,
            department_name: this.currentUser.department,
            role: this.currentUser.role,
            status: "active",
            hire_date: `${this.currentUser.joinYear}-01-01`,
            avatar_url: null,
        };
    }

    // ============================================
    // ADOPTION METRICS ENDPOINTS
    // ============================================

    async getScorecard() {
        await this.init();
        const user = this.currentUser;

        return {
            employee_id: user.userId,
            display_name: user.employeeName,
            current_score: user.adoptionScore,
            previous_score: user.monthlyAdoptionTrend[user.monthlyAdoptionTrend.length - 2] || user.adoptionScore - 5,
            month_change: user.adoptionScore - (user.monthlyAdoptionTrend[user.monthlyAdoptionTrend.length - 2] || user.adoptionScore - 5),
            tasks_automated: user.tasksAutomated,
            hours_saved: user.estimatedHoursSaved,
            tools_used: user.aiToolsUsedCount,
            learning_progress: Math.round((user.learningHoursCompleted / 50) * 100),
            trends: user.monthlyAdoptionTrend,
        };
    }

    async getAdoptionHistory(months = 12) {
        await this.init();
        const user = this.currentUser;
        const history = [];

        for (let i = months; i > 0; i--) {
            const idx = Math.max(0, user.monthlyAdoptionTrend.length - i);
            const score = user.monthlyAdoptionTrend[idx] || user.adoptionScore - (months - i) * 2;

            history.push({
                month: (new Date().getMonth() - i + 12) % 12 + 1,
                year: new Date().getFullYear(),
                adoption_score: Math.max(45, score),
                tasks_ai_assisted: Math.round(score / 100 * user.tasksAutomated),
                hours_saved: Math.round(score / 100 * user.estimatedHoursSaved),
                tools_explored: Math.round(score / 100 * user.aiToolsUsedCount),
                learning_hours: Math.round(score / 100 * user.learningHoursCompleted),
            });
        }

        return history;
    }

    async getDepartmentOverview(deptId) {
        await this.init();

        const deptName = this.allDepartments[deptId - 1] || "Unknown";
        const deptUsers = this.testData.filter(u => u.department === deptName);

        if (deptUsers.length === 0) {
            return {
                department_id: deptId,
                department_name: deptName,
                avg_score: 0,
                participation_rate: 0,
                total_hours_saved: 0,
                total_employees: 0,
                active_users: 0,
            };
        }

        const avgScore = deptUsers.reduce((sum, u) => sum + u.adoptionScore, 0) / deptUsers.length;
        const totalHours = deptUsers.reduce((sum, u) => sum + u.estimatedHoursSaved, 0);

        return {
            department_id: deptId,
            department_name: deptName,
            avg_score: Math.round(avgScore * 10) / 10,
            participation_rate: 95.5,
            total_hours_saved: totalHours,
            total_employees: deptUsers.length,
            active_users: deptUsers.length,
        };
    }

    // ============================================
    // TOOLS ENDPOINTS
    // ============================================

    async getToolsCatalog() {
        await this.init();

        return this.allTools.map((name, idx) => ({
            tool_id: idx + 1,
            name: name,
            description: `${name} - AI-powered productivity tool`,
            category: "Productivity",
            icon_url: null,
            sso_url: `https://tools.dewa.gov.ae/${name.toLowerCase().replace(/\s+/g, '-')}`,
            requires_approval: idx < 2,
        }));
    }

    async getToolCategories() {
        return {
            categories: ["Productivity", "Analytics", "Operations", "Learning", "Communication"]
        };
    }

    async accessTool(toolId) {
        return { status: "logged" };
    }

    // ============================================
    // LEARNING ENDPOINTS
    // ============================================

    async getLearningResources() {
        return [
            {
                resource_id: 1,
                title: "Introduction to AI",
                description: "Basic AI concepts",
                type: "course",
                provider: "LinkedIn Learning",
                difficulty_level: "beginner",
                duration_minutes: 120,
                url: "#"
            },
            {
                resource_id: 2,
                title: "Copilot for Productivity",
                description: "Master Microsoft Copilot",
                type: "course",
                provider: "Microsoft Learn",
                difficulty_level: "beginner",
                duration_minutes: 90,
                url: "#"
            },
            {
                resource_id: 3,
                title: "AI Ethics and Governance",
                description: "Responsible AI practices",
                type: "course",
                provider: "Coursera",
                difficulty_level: "intermediate",
                duration_minutes: 180,
                url: "#"
            },
            {
                resource_id: 4,
                title: "Advanced AI Applications",
                description: "Enterprise AI implementation",
                type: "course",
                provider: "Udacity",
                difficulty_level: "advanced",
                duration_minutes: 240,
                url: "#"
            },
            {
                resource_id: 5,
                title: "AI in Utilities",
                description: "AI for energy and water sectors",
                type: "webinar",
                provider: "DEWA Training",
                difficulty_level: "intermediate",
                duration_minutes: 60,
                url: "#"
            }
        ];
    }

    async getLearningProgress() {
        await this.init();
        const user = this.currentUser;

        return user.certificationsEarned.map((cert, idx) => ({
            resource_id: idx + 1,
            progress_percent: 100,
            status: "completed",
            completed_at: new Date(Date.now() - (60 - idx * 10) * 24 * 60 * 60 * 1000).toISOString(),
        }));
    }

    async updateLearningProgress(resourceId, data) {
        return { status: "updated" };
    }

    // ============================================
    // GAMIFICATION ENDPOINTS
    // ============================================

    async getBadges() {
        const badgeList = [
            "First Automation",
            "AI Innovator",
            "Power User",
            "Learning Champion",
            "Productivity Master"
        ];

        return badgeList.map((name, idx) => ({
            badge_id: idx + 1,
            name: name,
            description: `Badge for ${name}`,
            icon_url: null,
            level: 1,
        }));
    }

    async getLeaderboard() {
        await this.init();

        // Top performer titles and bonuses
        const topPerformerTitles = {
            1: "🏆 AI Champion",
            2: "🥈 Innovation Leader",
            3: "🥉 Adoption Pioneer",
            4: "⭐ Excellence",
            5: "⭐ Excellence"
        };

        // Sort by adoption score and return top 100
        const sorted = [...this.testData]
            .sort((a, b) => (b.leaderboardPoints || 0) - (a.leaderboardPoints || 0))
            .slice(0, 100);

        return sorted.map((user, idx) => {
            const rank = idx + 1;
            const isTopPerformer = rank <= 5;
            
            return {
                rank: rank,
                employee_id: user.userId,
                display_name: user.employeeName,
                role: user.role,
                department: user.department,
                location: user.location || "Dubai HQ",
                points: user.leaderboardPoints || 0,
                adoption_score: user.adoptionScore || 0,
                tasks_automated: user.tasksAutomated || 0,
                hours_saved: user.estimatedHoursSaved || 0,
                badge_count: (user.badgesEarned || []).length,
                badge_list: (user.badgesEarned || []).slice(0, 3),
                certifications_earned: (user.certificationsEarned || []).length,
                ai_tools_used: user.aiToolsUsedCount || 0,
                is_top_performer: isTopPerformer,
                title: isTopPerformer ? topPerformerTitles[rank] : null,
                streak_days: Math.floor(Math.random() * 90) + 5,
                last_achievement: Math.floor(Math.random() * 14) + 1 + " days ago",
                achievement_badge: rank === 1 ? "🌟" : rank === 2 ? "✨" : rank === 3 ? "💎" : "⭐"
            };
        });
    }

    async getPoints() {
        await this.init();
        const user = this.currentUser;

        // Calculate rank
        const sorted = [...this.testData].sort((a, b) => (b.leaderboardPoints || 0) - (a.leaderboardPoints || 0));
        const rank = sorted.findIndex(u => u.userId === user.userId) + 1;

        return {
            employee_id: user.userId,
            total_points: user.leaderboardPoints || 0,
            month_points: Math.round((user.leaderboardPoints || 0) / 12),
            rank: rank,
        };
    }

    async getChallenges() {
        return [
            {
                challenge_id: 1,
                title: "Automation Expert",
                description: "Automate 5 tasks this month",
                reward_points: 500,
            },
            {
                challenge_id: 2,
                title: "Learning Streak",
                description: "Complete 2 learning modules",
                reward_points: 300,
            },
            {
                challenge_id: 3,
                title: "Tool Master",
                description: "Use 3 different AI tools",
                reward_points: 250,
            }
        ];
    }

    // ============================================
    // ANALYTICS ENDPOINTS
    // ============================================

    async getROI() {
        await this.init();

        const totalHours = this.testData.reduce((sum, u) => sum + (u.estimatedHoursSaved || 0), 0);
        const hourlyRate = 75; // AED per hour
        const totalROI = totalHours * hourlyRate;

        return {
            total_hours_saved: totalHours,
            hourly_rate: hourlyRate,
            total_roi_aed: totalROI,
            users_impacted: this.testData.length,
            roi_per_user: Math.round(totalROI / this.testData.length),
        };
    }

    async getTrends(months = 6) {
        await this.init();

        // Generate trend data
        const trends = [];
        for (let i = months; i > 0; i--) {
            const monthDate = new Date();
            monthDate.setMonth(monthDate.getMonth() - i);

            const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;

            trends.push({
                month: monthKey,
                avg_adoption_score: 60 + (months - i) * 2,
                total_hours_saved: 10000 + (months - i) * 2000,
                avg_tasks_automated: 20 + (months - i),
                users_active: this.testData.length,
            });
        }

        return trends;
    }

    async getNotifications() {
        return [
            {
                id: 1,
                type: "achievement",
                title: "Badge Earned!",
                message: "You've earned the 'Power User' badge",
                is_read: false,
                created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            },
            {
                id: 2,
                type: "challenge",
                title: "New Challenge",
                message: "Join the 'Learning Streak' challenge this month",
                is_read: false,
                created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            },
        ];
    }

    markNotificationRead(notifId) {
        return { status: "marked" };
    }
}

// Create global instance
const mockBackend = new MockBackendService();

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = mockBackend;
}
