/* ============================================
   DASHBOARD MODULE - Scorecard & Metrics
   ============================================ */

const Dashboard = {
    /**
     * Initialize dashboard
     */
    async init() {
        console.log('📊 Initializing dashboard...');
        await this.loadScorecard();
    },

    /**
     * Load scorecard data
     */
    async loadScorecard() {
        try {
            const scorecard = await APIClient.adoption.getScorecard();
            this.render(scorecard);
            return scorecard;
        } catch (error) {
            console.error('❌ Failed to load scorecard:', error);
            throw error;
        }
    },

    /**
     * Render scorecard UI
     */
    render(scorecard) {
        // Update score display
        const currentScore = document.getElementById('currentScore');
        if (currentScore) {
            currentScore.textContent = scorecard.current_score;
            currentScore.style.color = this.getScoreColor(scorecard.current_score);
        }

        // Update individual metrics
        this.updateMetric('tasksAutomated', scorecard.tasks_automated);
        this.updateMetric('hoursSaved', (scorecard.hours_saved || 0).toFixed(1));
        this.updateMetric('toolsUsed', scorecard.tools_used);

        // Update trends
        if (scorecard.trends && scorecard.trends.length > 0) {
            this.renderTrends(scorecard.trends);
        }

        // Update comparisons
        if (scorecard.compared_to_department) {
            this.updateComparison(scorecard.compared_to_department);
        }
    },

    /**
     * Update metric display
     */
    updateMetric(elementId, value) {
        const element = document.getElementById(elementId);
        if (element) {
            element.textContent = value;
        }
    },

    /**
     * Get color based on score
     */
    getScoreColor(score) {
        if (score >= 80) return '#00a651'; // Green
        if (score >= 60) return '#ff9800'; // Orange
        return '#d32f2f'; // Red
    },

    /**
     * Render trend data
     */
    renderTrends(trends) {
        // Chart rendering handled in app.js
        console.log('📈 Trends available:', trends.length, 'months');
    },

    /**
     * Update department comparison
     */
    updateComparison(comparison) {
        const el = document.querySelector('.comparison-panel');
        if (el) {
            const detail = el.querySelector('p');
            if (detail) {
                detail.textContent = comparison;
            }
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dashboard;
}
