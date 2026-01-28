/* ============================================
   LEARNING MODULE - Learning Paths & Resources
   ============================================ */

const Learning = {
    resources: [],
    progress: [],

    /**
     * Initialize learning module
     */
    async init() {
        console.log('📚 Initializing learning module...');
        await this.loadResources();
        await this.loadProgress();
    },

    /**
     * Load learning resources
     */
    async loadResources() {
        try {
            const data = await APIClient.learning.getResources();
            this.resources = Array.isArray(data) ? data : data.resources || [];
            this.renderResources(this.resources);
            return this.resources;
        } catch (error) {
            console.error('❌ Failed to load resources:', error);
            throw error;
        }
    },

    /**
     * Load user learning progress
     */
    async loadProgress() {
        try {
            const data = await APIClient.learning.getProgress();
            this.progress = Array.isArray(data) ? data : data.progress || [];
            this.renderProgress(this.progress);
            return this.progress;
        } catch (error) {
            console.error('❌ Failed to load progress:', error);
            throw error;
        }
    },

    /**
     * Render learning path with user progress
     */
    renderProgress(progress) {
        const path = document.getElementById('learningPath');
        if (!path) return;

        if (progress.length === 0) {
            path.innerHTML = '<div class="placeholder">No learning modules started</div>';
            return;
        }

        path.innerHTML = progress.map(module => `
            <div class="learning-module" data-resource-id="${module.resource_id}">
                <div class="module-status ${module.status}">
                    ${this.getStatusIcon(module.status)}
                </div>
                <div class="module-info">
                    <div class="module-title">${module.title}</div>
                    <div class="module-provider">by ${module.provider || 'DEWA'}</div>
                </div>
                <div class="module-progress">
                    ${module.status === 'in_progress' ? `${module.progress_percent || 0}%` : ''}
                </div>
            </div>
        `).join('');
    },

    /**
     * Render available resources
     */
    renderResources(resources) {
        const grid = document.getElementById('resourcesGrid');
        if (!grid) return;

        if (resources.length === 0) {
            grid.innerHTML = '<div class="placeholder">No learning resources available</div>';
            return;
        }

        grid.innerHTML = resources.map(resource => `
            <div class="resource-card" data-resource-id="${resource.resource_id}">
                <div class="resource-type">${this.formatType(resource.type)}</div>
                <div class="resource-title">${resource.title}</div>
                <div class="resource-provider">by ${resource.provider || 'DEWA'}</div>
                <div class="resource-meta">
                    <span>⏱ ${resource.duration_minutes || '?'} min</span>
                    <span>Level: ${this.formatLevel(resource.difficulty_level)}</span>
                </div>
                <a href="${resource.url || '#'}" 
                   target="_blank" 
                   class="btn btn-secondary" 
                   style="width: 100%; text-align: center; margin-top: 12px; display: block;">
                    Start Learning →
                </a>
            </div>
        `).join('');

        // Add click handlers
        document.querySelectorAll('.resource-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('a')) return;
                const resourceId = card.dataset.resourceId;
                this.trackResourceView(resourceId);
            });
        });
    },

    /**
     * Get status icon
     */
    getStatusIcon(status) {
        const icons = {
            'completed': '✓',
            'in_progress': '⟳',
            'not_started': '○'
        };
        return icons[status] || '○';
    },

    /**
     * Format resource type for display
     */
    formatType(type) {
        const types = {
            'course': 'Course',
            'video': 'Video',
            'guide': 'Guide',
            'article': 'Article',
            'webinar': 'Webinar'
        };
        return types[type] || type;
    },

    /**
     * Format difficulty level
     */
    formatLevel(level) {
        const levels = {
            'beginner': 'Beginner',
            'intermediate': 'Intermediate',
            'advanced': 'Advanced'
        };
        return levels[level] || level;
    },

    /**
     * Update progress on resource
     */
    async updateProgress(resourceId, status, progress = 0) {
        try {
            await APIClient.learning.updateProgress(resourceId, {
                status,
                progress_percent: progress
            });
            
            // Reload progress
            await this.loadProgress();
            console.log('✅ Progress updated:', resourceId);
        } catch (error) {
            console.error('❌ Failed to update progress:', error);
        }
    },

    /**
     * Track resource view for analytics
     */
    trackResourceView(resourceId) {
        const resource = this.resources.find(r => r.resource_id === resourceId);
        if (resource) {
            console.log('📖 Viewed resource:', resource.title);
        }
    },

    /**
     * Get learning recommendations
     */
    async getRecommendations() {
        try {
            const recommendations = await APIClient.learning.getRecommendations();
            return recommendations;
        } catch (error) {
            console.error('❌ Failed to get recommendations:', error);
            return [];
        }
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Learning;
}
