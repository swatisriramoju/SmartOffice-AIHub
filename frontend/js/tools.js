/* ============================================
   TOOLS MODULE - AI Tools Discovery & Access
   ============================================ */

const Tools = {
    allTools: [],
    filteredTools: [],

    /**
     * Initialize tools module
     */
    async init() {
        console.log('🛠️ Initializing tools module...');
        await this.loadCatalog();
        this.setupFilters();
    },

    /**
     * Load tools catalog
     */
    async loadCatalog() {
        try {
            const catalog = await APIClient.tools.getCatalog();
            this.allTools = catalog.tools || [];
            this.filteredTools = this.allTools;
            this.render(this.allTools);
            return this.allTools;
        } catch (error) {
            console.error('❌ Failed to load tools:', error);
            throw error;
        }
    },

    /**
     * Render tools list
     */
    render(tools) {
        const list = document.getElementById('toolsList');
        if (!list) return;

        if (tools.length === 0) {
            list.innerHTML = '<div class="placeholder">No tools found</div>';
            return;
        }

        list.innerHTML = tools.map(tool => this.renderTool(tool)).join('');

        // Add click handlers
        document.querySelectorAll('.tool-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.closest('a')) return; // Don't interfere with links
                const toolId = card.dataset.toolId;
                this.showToolDetail(toolId);
            });
        });
    },

    /**
     * Render single tool card
     */
    renderTool(tool) {
        return `
            <div class="tool-card" data-tool-id="${tool.tool_id}">
                <div class="tool-icon">${tool.icon || '🔧'}</div>
                <div class="tool-name">${tool.name}</div>
                <div class="tool-description">${tool.description || 'No description'}</div>
                <div class="tool-meta">
                    <span class="tool-badge">${tool.category || 'General'}</span>
                    <a href="${tool.sso_url || '#'}" 
                       target="_blank" 
                       class="btn btn-primary" 
                       style="padding: 4px 8px; font-size: 12px; width: auto;">
                        Open →
                    </a>
                </div>
            </div>
        `;
    },

    /**
     * Setup filter handlers
     */
    setupFilters() {
        // Category filters
        document.querySelectorAll('.filter-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                this.filterByCategory(chip.dataset.filter);
                
                // Update active state
                document.querySelectorAll('.filter-chip').forEach(c => 
                    c.classList.remove('active')
                );
                chip.classList.add('active');
            });
        });

        // Search input
        const searchInput = document.getElementById('toolsSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.search(e.target.value);
            });
        }
    },

    /**
     * Filter by category
     */
    filterByCategory(category) {
        if (category === 'all') {
            this.filteredTools = this.allTools;
        } else {
            this.filteredTools = this.allTools.filter(tool => 
                tool.category && tool.category.toLowerCase() === category.toLowerCase()
            );
        }
        this.render(this.filteredTools);
    },

    /**
     * Search tools
     */
    search(query) {
        const lower = query.toLowerCase();
        this.filteredTools = this.allTools.filter(tool =>
            (tool.name && tool.name.toLowerCase().includes(lower)) ||
            (tool.description && tool.description.toLowerCase().includes(lower)) ||
            (tool.category && tool.category.toLowerCase().includes(lower))
        );
        this.render(this.filteredTools);
    },

    /**
     * Log tool access
     */
    async logAccess(toolId) {
        try {
            await APIClient.tools.accessTool(toolId);
            console.log('✅ Tool access logged:', toolId);
        } catch (error) {
            console.error('❌ Failed to log tool access:', error);
        }
    },

    /**
     * Show tool details
     */
    showToolDetail(toolId) {
        const tool = this.allTools.find(t => t.tool_id === toolId);
        if (!tool) return;

        console.log('📋 Tool detail:', tool);
        // Can be extended to show modal with full details
    }
};

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Tools;
}
