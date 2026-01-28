/* ============================================
   LEADERBOARD MODULE - Rankings & Recognition
   ============================================ */

const Leaderboard = {
    currentView: 'individual',

    /**
     * Initialize leaderboard
     */
    async init() {
        console.log('🏆 Initializing leaderboard...');
        await this.loadLeaderboard();
    },

    /**
     * Load leaderboard data
     */
    async loadLeaderboard() {
        try {
            const leaderboard = await APIClient.gamification.getLeaderboard();
            this.render(leaderboard);
            return leaderboard;
        } catch (error) {
            console.error('❌ Failed to load leaderboard:', error);
            throw error;
        }
    },

    /**
     * Render leaderboard UI
     */
    render(leaderboard) {
        const list = document.getElementById('leaderboardList');
        if (!list) return;

        list.innerHTML = leaderboard.map((entry, index) => `
            <div class="leaderboard-entry" data-rank="${index + 1}">
                <div class="rank-badge ${this.isTopRank(index) ? 'top-3' : ''}">
                    ${this.getMedalIcon(index)}
                </div>
                <div class="leaderboard-info">
                    <div class="leaderboard-name">${entry.display_name}</div>
                    <div class="leaderboard-role">
                        ${entry.department || 'Department'} • ${entry.role || 'Employee'}
                    </div>
                </div>
                <div class="leaderboard-score">${entry.adoption_score.toFixed(0)}</div>
            </div>
        `).join('');
    },

    /**
     * Get medal icon for top 3
     */
    getMedalIcon(index) {
        const icons = ['🥇', '🥈', '🥉'];
        if (index < 3) {
            return icons[index];
        }
        return index + 1;
    },

    /**
     * Check if rank is in top 3
     */
    isTopRank(index) {
        return index < 3;
    },

    /**
     * Format entry for display
     */
    formatEntry(entry) {
        return {
            ...entry,
            displayScore: entry.adoption_score.toFixed(0),
            points: entry.points || 0,
            badgesCount: (entry.badges || []).length
        };
    },

    /**
     * Handle view toggle (individual vs department)
     */
    toggleView() {
        this.currentView = this.currentView === 'individual' ? 'department' : 'individual';
        this.loadLeaderboard();
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Leaderboard;
}
