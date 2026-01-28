/* ============================================
   API CLIENT - HTTP Wrapper
   ============================================ */

// Note: This file is provided as a template.
// Core API functionality is implemented in app.js
// Extend this file with specialized API calls as needed

const APIClient = {
    baseURL: 'http://localhost:8000/api',

    /**
     * Make HTTP request with error handling
     */
    async request(method, endpoint, body = null) {
        const token = localStorage.getItem('auth_token');
        
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Bearer ${token}` } : {})
            }
        };

        if (body) {
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, options);
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request error:', error);
            throw error;
        }
    },

    // Adoption metrics endpoints
    adoption: {
        getScorecard: () => APIClient.request('GET', '/me/scorecard'),
        getDepartmentOverview: (deptId) => APIClient.request('GET', `/departments/${deptId}/overview`),
        createMetrics: (data) => APIClient.request('POST', '/adoption-metrics', data),
        getHistory: (months = 12) => APIClient.request('GET', `/adoption-metrics/history?months=${months}`)
    },

    // Tools endpoints
    tools: {
        getCatalog: () => APIClient.request('GET', '/tools/catalog'),
        accessTool: (toolId) => APIClient.request('POST', `/tools/${toolId}/access`, {}),
        getCategories: () => APIClient.request('GET', '/tools/categories')
    },

    // Learning endpoints
    learning: {
        getResources: () => APIClient.request('GET', '/learning/resources'),
        getProgress: () => APIClient.request('GET', '/learning/progress'),
        updateProgress: (resourceId, data) => APIClient.request('POST', `/learning/${resourceId}/progress`, data),
        getRecommendations: () => APIClient.request('GET', '/learning/recommendations')
    },

    // Gamification endpoints
    gamification: {
        getBadges: () => APIClient.request('GET', '/badges'),
        getChallenges: () => APIClient.request('GET', '/challenges'),
        getPoints: () => APIClient.request('GET', '/points'),
        getLeaderboard: () => APIClient.request('GET', '/leaderboard')
    },

    // Notifications endpoints
    notifications: {
        getList: () => APIClient.request('GET', '/notifications'),
        markRead: (notifId) => APIClient.request('POST', `/notifications/${notifId}/read`, {}),
        markAllRead: () => APIClient.request('POST', '/notifications/read-all', {})
    },

    // User endpoints
    user: {
        getProfile: () => APIClient.request('GET', '/me'),
        updateProfile: (data) => APIClient.request('PUT', '/me', data),
        getDepartment: (deptId) => APIClient.request('GET', `/departments/${deptId}`)
    },

    // Analytics endpoints
    analytics: {
        getROI: () => APIClient.request('GET', '/analytics/roi'),
        getTrends: (months = 6) => APIClient.request('GET', `/analytics/trends?months=${months}`),
        getDepartmentStats: (deptId) => APIClient.request('GET', `/analytics/departments/${deptId}`)
    }
};

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = APIClient;
}
