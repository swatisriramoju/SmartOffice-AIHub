/* ============================================
   GAMIFICATION MODULE - Badges, Points, Challenges
   ============================================ */

const Gamification = {
    badges: [],
    points: 0,
    challenges: [],

    /**
     * Initialize gamification module
     */
    async init() {
        console.log('🎮 Initializing gamification module...');
        await Promise.all([
            this.loadBadges(),
            this.loadPoints(),
            this.loadChallenges()
        ]);
    },

    /**
     * Load user badges
     */
    async loadBadges() {
        try {
            const data = await APIClient.gamification.getBadges();
            this.badges = Array.isArray(data) ? data : data.badges || [];
            this.renderBadges(this.badges);
            return this.badges;
        } catch (error) {
            console.error('❌ Failed to load badges:', error);
            throw error;
        }
    },

    /**
     * Load user points
     */
    async loadPoints() {
        try {
            const data = await APIClient.gamification.getPoints();
            this.points = data.total_points || data || 0;
            this.updatePointsDisplay(this.points);
            return this.points;
        } catch (error) {
            console.error('❌ Failed to load points:', error);
            throw error;
        }
    },

    /**
     * Load active challenges
     */
    async loadChallenges() {
        try {
            const data = await APIClient.gamification.getChallenges();
            this.challenges = Array.isArray(data) ? data : data.challenges || [];
            this.renderChallenges(this.challenges);
            return this.challenges;
        } catch (error) {
            console.error('❌ Failed to load challenges:', error);
            throw error;
        }
    },

    /**
     * Render badges grid
     */
    renderBadges(badges) {
        const grid = document.getElementById('badgesGrid');
        if (!grid) return;

        if (badges.length === 0) {
            grid.innerHTML = '<div class="placeholder">No badges earned yet. Keep exploring!</div>';
            return;
        }

        grid.innerHTML = badges.map(badge => `
            <div class="badge-card ${badge.earned ? '' : 'locked'}" data-badge-id="${badge.badge_id}">
                <div class="badge-icon">${badge.icon || '🏅'}</div>
                <div class="badge-name">${badge.name}</div>
                <div class="badge-status">
                    ${badge.earned 
                        ? `✓ Earned on ${this.formatDate(badge.awarded_on)}` 
                        : 'Locked'}
                </div>
                ${badge.criteria ? `<small style="color: #999;">${badge.criteria}</small>` : ''}
            </div>
        `).join('');
    },

    /**
     * Render challenges section
     */
    renderChallenges(challenges) {
        // Create a simple challenge display
        const container = document.querySelector('.leaderboard-container:last-of-type');
        if (!container) return;

        const html = challenges.map(challenge => `
            <div style="background: var(--bg-secondary); padding: 12px; border-radius: 8px; margin-bottom: 8px;">
                <div style="font-weight: 600; margin-bottom: 4px;">${challenge.title}</div>
                <div style="font-size: 12px; color: #666; margin-bottom: 8px;">${challenge.description || ''}</div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div class="progress-bar" style="flex: 1; margin-right: 8px;">
                        <div class="progress-fill" style="width: ${challenge.progress_percent || 0}%;"></div>
                    </div>
                    <span style="font-size: 12px; font-weight: 600; color: var(--primary);">
                        +${challenge.reward_points} pts
                    </span>
                </div>
            </div>
        `).join('');

        if (html) {
            const section = document.createElement('div');
            section.style.marginTop = '24px';
            section.innerHTML = `<h3 style="color: var(--secondary); margin-bottom: 16px;">🎯 Current Challenges</h3>${html}`;
            if (container.parentNode) {
                container.parentNode.insertBefore(section, container.nextSibling);
            }
        }
    },

    /**
     * Update points display
     */
    updatePointsDisplay(points) {
        // Display points in scorecard or summary
        const pointsEl = document.querySelector('[data-metric="points"]');
        if (pointsEl) {
            pointsEl.textContent = points.toLocaleString();
        }
        console.log(`💰 User has ${points} points`);
    },

    /**
     * Award badge to user
     */
    async awardBadge(badgeId) {
        try {
            // This would typically be called by the backend
            console.log('🎖️ Badge awarded:', badgeId);
            await this.loadBadges(); // Refresh
        } catch (error) {
            console.error('❌ Failed to award badge:', error);
        }
    },

    /**
     * Complete challenge
     */
    async completeChallenge(challengeId) {
        try {
            // Mark challenge as completed
            console.log('✅ Challenge completed:', challengeId);
            await this.loadChallenges(); // Refresh
        } catch (error) {
            console.error('❌ Failed to complete challenge:', error);
        }
    },

    /**
     * Format date for display
     */
    formatDate(dateString) {
        if (!dateString) return 'Soon';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-AE', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },

    /**
     * Get badge by ID
     */
    getBadgeById(badgeId) {
        return this.badges.find(b => b.badge_id === badgeId);
    },

    /**
     * Get earned badges count
     */
    getEarnedCount() {
        return this.badges.filter(b => b.earned).length;
    },

    /**
     * Calculate progress to next badge
     */
    getProgressToNextBadge() {
        // This would show user how close they are to earning next badge
        return Math.round((this.points / 1000) * 100); // Example: next badge at 1000 points
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Gamification;
}
