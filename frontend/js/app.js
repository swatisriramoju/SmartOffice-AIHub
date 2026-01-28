/* ============================================
   SMART OFFICE AI HUB - Main Application
   ============================================ */

// ============================================
// GLOBAL FUNCTIONS - MUST BE DEFINED FIRST
// ============================================

function openTool(toolName, toolUrl) {
    console.log('Opening tool:', toolName);
    const modal = document.getElementById('toolModal');
    const title = document.getElementById('toolModalTitle');
    const content = document.getElementById('toolModalContent');
    
    if (!modal) {
        console.error('Modal element not found!');
        alert('Tool modal not available');
        return;
    }
    
    const toolContent = {
        "Copilot for M365": `
            <div style="max-width: 900px;">
                <h3 style="margin-top: 0; color: #00a651;">Microsoft Copilot for M365</h3>
                <p><strong>Category:</strong> Productivity | <strong>Status:</strong> Active</p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 16px 0;">
                    <div style="background: #f9f9f9; padding: 16px; border-radius: 8px;">
                        <h4 style="margin-top: 0;">📊 Quick Stats</h4>
                        <p><strong>Users:</strong> 1,245 | <strong>Monthly Tasks:</strong> 5,820 | <strong>Avg Time Saved:</strong> 2.3 hrs/week</p>
                    </div>
                    <div style="background: #e8f5e9; padding: 16px; border-radius: 8px;">
                        <h4 style="margin-top: 0;">✨ Benefits</h4>
                        <ul style="margin: 8px 0; padding-left: 20px;"><li>40% faster document creation</li><li>50% fewer revisions</li></ul>
                    </div>
                </div>

                <h4>Available Modules:</h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px;">
                    <button onclick="showDemoNotification('Word Assistant')" style="padding: 12px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">📝 Word Assistant</button>
                    <button onclick="showDemoNotification('Excel Analyzer')" style="padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">📊 Excel Analyzer</button>
                    <button onclick="showDemoNotification('Teams Summarizer')" style="padding: 12px; background: #9C27B0; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">💬 Teams Summarizer</button>
                    <button onclick="showDemoNotification('PowerPoint Creator')" style="padding: 12px; background: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">🎨 PowerPoint Creator</button>
                </div>
            </div>
        `,
        "AI Chatbot": `
            <div style="max-width: 900px;">
                <h3 style="margin-top: 0; color: #00a651;">DEWA AI Chatbot</h3>
                <p><strong>Category:</strong> Support | <strong>Status:</strong> Active</p>
                
                <div style="background: #f0f0f0; padding: 16px; border-radius: 8px; height: 250px; overflow-y: auto; margin: 16px 0; border: 1px solid #ddd;">
                    <div style="background: white; padding: 12px; border-radius: 4px; margin-bottom: 12px;">
                        <strong>Bot:</strong> Welcome! How can I help you today?
                    </div>
                    <div style="background: #e3f2fd; padding: 12px; border-radius: 4px; margin-bottom: 12px; text-align: right;">
                        <strong>You:</strong> What are the office hours?
                    </div>
                    <div style="background: white; padding: 12px; border-radius: 4px; margin-bottom: 12px;">
                        <strong>Bot:</strong> DEWA offices are open Monday-Thursday 7:30 AM - 3:30 PM, Friday-Saturday closed. You can find more info at dewa.gov.ae
                    </div>
                </div>

                <div style="display: flex; gap: 8px;">
                    <input type="text" id="chatInput" placeholder="Ask me anything..." style="flex: 1; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                    <button onclick="sendChatMessage()" style="padding: 10px 24px; background: #00a651; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">Send</button>
                </div>
                
                <div style="margin-top: 12px;">
                    <strong>Quick Responses:</strong><br>
                    <button onclick="quickResponse('Tell me about adoption rewards')" style="margin: 4px; padding: 6px 12px; background: #f0f0f0; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">💰 Rewards</button>
                    <button onclick="quickResponse('Show AI tools available')" style="margin: 4px; padding: 6px 12px; background: #f0f0f0; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">🛠️ Tools</button>
                    <button onclick="quickResponse('Help with training')" style="margin: 4px; padding: 6px 12px; background: #f0f0f0; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">📚 Training</button>
                </div>
            </div>
        `,
        "Document Summarizer": `
            <div style="max-width: 900px;">
                <h3 style="margin-top: 0; color: #00a651;">Document Summarizer</h3>
                <p><strong>Category:</strong> Productivity | <strong>Status:</strong> Review Pending</p>
                
                <div style="background: #f9f9f9; padding: 16px; border-radius: 8px; margin: 16px 0;">
                    <h4>📈 Performance Metrics</h4>
                    <p><strong>Documents Processed:</strong> 3,421 | <strong>Avg Reduction:</strong> 78% | <strong>Accuracy:</strong> 94.2%</p>
                </div>

                <h4>Upload Document:</h4>
                <div style="border: 2px dashed #ddd; padding: 40px; border-radius: 8px; text-align: center; margin: 16px 0; background: #fafafa;">
                    <p style="margin: 0; color: #999; font-size: 1.1em;">📄 Drop file here or <input type="file" style="cursor: pointer;" onchange="summarizeDemo()"></p>
                </div>

                <h4>Summary Type:</h4>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 16px 0;">
                    <button onclick="showDemoNotification('Executive Summary')" style="padding: 12px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">Executive</button>
                    <button onclick="showDemoNotification('Technical Summary')" style="padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer;">Technical</button>
                    <button onclick="showDemoNotification('Bullet Points')" style="padding: 12px; background: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer;">Bullets</button>
                </div>

                <div style="background: #e8f5e9; padding: 16px; border-radius: 8px; margin-top: 16px;">
                    <p style="margin: 0;"><strong>✅ Demo Summary Generated:</strong> This document covers AI adoption initiatives, including strategic objectives, implementation timelines, and expected ROI of 35% within 12 months.</p>
                </div>
            </div>
        `,
        "Data Insight Assistant": `
            <div style="max-width: 900px;">
                <h3 style="margin-top: 0; color: #00a651;">Data Insight Assistant</h3>
                <p><strong>Category:</strong> Analytics | <strong>Status:</strong> Active</p>
                
                <h4>Select Dataset:</h4>
                <select id="datasetSelect" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; margin-bottom: 16px;">
                    <option value="">Choose a dataset...</option>
                    <option value="adoption">AI Adoption Metrics</option>
                    <option value="productivity">Productivity Trends</option>
                    <option value="roi">ROI Analysis</option>
                    <option value="usage">Tool Usage Stats</option>
                </select>

                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 16px 0;">
                    <button onclick="analyzeDataset('Trend Analysis')" style="padding: 12px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">📈 Trends</button>
                    <button onclick="analyzeDataset('Forecasting')" style="padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">🔮 Forecast</button>
                    <button onclick="analyzeDataset('Anomaly Detection')" style="padding: 12px; background: #FF5722; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">⚠️ Anomalies</button>
                    <button onclick="analyzeDataset('Correlation Analysis')" style="padding: 12px; background: #9C27B0; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">🔗 Correlations</button>
                </div>

                <div style="background: #e3f2fd; padding: 16px; border-radius: 8px; margin-top: 16px;">
                    <h4 style="margin-top: 0;">📊 Analysis Results:</h4>
                    <p><strong>Trend:</strong> ↑ 23% increase in AI tool adoption QoQ</p>
                    <p><strong>Top Performer:</strong> Copilot for M365 with 1,245 active users</p>
                    <p><strong>Forecast:</strong> Expected 45% adoption by Q2 2026</p>
                </div>
            </div>
        `,
        "Process Optimizer": `
            <div style="max-width: 900px;">
                <h3 style="margin-top: 0; color: #00a651;">Process Optimizer</h3>
                <p><strong>Category:</strong> Operations | <strong>Status:</strong> Active</p>
                
                <h4>Select Process Type:</h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 16px 0;">
                    <button onclick="optimizeProcess('Approval Workflow')" style="padding: 12px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">📋 Approvals</button>
                    <button onclick="optimizeProcess('Data Entry')" style="padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">📝 Data Entry</button>
                    <button onclick="optimizeProcess('Report Generation')" style="padding: 12px; background: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">📊 Reports</button>
                    <button onclick="optimizeProcess('Email Triage')" style="padding: 12px; background: #9C27B0; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">✉️ Email</button>
                </div>

                <div style="background: #f0f0f0; padding: 16px; border-radius: 8px; margin: 16px 0;">
                    <h4 style="margin-top: 0;">💡 Optimization Opportunities:</h4>
                    <div style="background: white; padding: 12px; margin: 8px 0; border-left: 4px solid #4CAF50;">
                        <strong>1. Automation Potential: 65%</strong><br>
                        <small>12-15 steps can be automated using AI</small>
                    </div>
                    <div style="background: white; padding: 12px; margin: 8px 0; border-left: 4px solid #FF9800;">
                        <strong>2. Time Savings: 8.5 hours/week</strong><br>
                        <small>Per employee average</small>
                    </div>
                    <div style="background: white; padding: 12px; margin: 8px 0; border-left: 4px solid #2196F3;">
                        <strong>3. Cost Reduction: $145K/year</strong><br>
                        <small>Department-wide ROI projection</small>
                    </div>
                </div>
            </div>
        `,
        "Predictive Maintenance Bot": `
            <div style="max-width: 900px;">
                <h3 style="margin-top: 0; color: #00a651;">Predictive Maintenance Bot</h3>
                <p><strong>Category:</strong> Operations | <strong>Status:</strong> Active</p>
                
                <h4>Equipment Categories:</h4>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin: 16px 0;">
                    <button onclick="viewPredictions('Power Systems')" style="padding: 12px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">🔋 Power Systems</button>
                    <button onclick="viewPredictions('Water Pumps')" style="padding: 12px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">💧 Water Pumps</button>
                    <button onclick="viewPredictions('HVAC Units')" style="padding: 12px; background: #FF9800; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">🌡️ HVAC Units</button>
                    <button onclick="viewPredictions('Turbines')" style="padding: 12px; background: #9C27B0; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">⚙️ Turbines</button>
                </div>

                <h4>⚠️ Maintenance Alerts:</h4>
                <div style="background: #FFEBEE; padding: 12px; border-radius: 4px; margin: 12px 0; border-left: 4px solid #F44336;">
                    <strong>Critical (Next 7 days):</strong> Transformer T-04 bearing wear - 89% probability
                </div>
                <div style="background: #FFF3E0; padding: 12px; border-radius: 4px; margin: 12px 0; border-left: 4px solid #FF9800;">
                    <strong>High (2-4 weeks):</strong> Pump P-02 seal degradation - 73% probability
                </div>
                <div style="background: #E8F5E9; padding: 12px; border-radius: 4px; margin: 12px 0; border-left: 4px solid #4CAF50;">
                    <strong>Medium (1-2 months):</strong> HVAC filter maintenance recommended
                </div>

                <h4>ROI Dashboard:</h4>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 16px 0;">
                    <div style="background: #e3f2fd; padding: 12px; border-radius: 4px; text-align: center;">
                        <div style="font-size: 1.5em; color: #2196F3; font-weight: bold;">$428K</div>
                        <div style="font-size: 0.9em; color: #666;">Cost Savings YTD</div>
                    </div>
                    <div style="background: #e8f5e9; padding: 12px; border-radius: 4px; text-align: center;">
                        <div style="font-size: 1.5em; color: #4CAF50; font-weight: bold;">23</div>
                        <div style="font-size: 0.9em; color: #666;">Failures Prevented</div>
                    </div>
                    <div style="background: #fff3e0; padding: 12px; border-radius: 4px; text-align: center;">
                        <div style="font-size: 1.5em; color: #FF9800; font-weight: bold;">94.2%</div>
                        <div style="font-size: 0.9em; color: #666;">Accuracy Rate</div>
                    </div>
                </div>
            </div>
        `,
        "Email Assistant": `
            <div style="max-width: 900px;">
                <h3 style="margin-top: 0; color: #00a651;">Email Assistant</h3>
                <p><strong>Category:</strong> Productivity | <strong>Status:</strong> Active</p>
                
                <h4>Email Purpose:</h4>
                <textarea id="emailPurpose" placeholder="What's the email about? (e.g., Request for project update, Meeting rescheduling, etc.)" style="width: 100%; height: 80px; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-family: Arial; margin: 12px 0;"></textarea>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 16px 0;">
                    <div>
                        <label style="display: block; margin-bottom: 8px;"><strong>Tone:</strong></label>
                        <select style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                            <option>Professional</option>
                            <option>Friendly</option>
                            <option>Urgent</option>
                            <option>Informal</option>
                        </select>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px;"><strong>Length:</strong></label>
                        <select style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                            <option>Concise</option>
                            <option>Standard</option>
                            <option>Detailed</option>
                        </select>
                    </div>
                </div>

                <button onclick="generateEmail()" style="width: 100%; padding: 12px; background: #00a651; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; font-size: 1em;">✨ Generate Email</button>

                <div style="background: #e8f5e9; padding: 16px; border-radius: 8px; margin-top: 16px;">
                    <h4 style="margin-top: 0;">📧 Generated Email Preview:</h4>
                    <div style="background: white; padding: 12px; border-left: 4px solid #00a651; font-family: Arial;">
                        <p><strong>Subject:</strong> Project Status Update - Action Required</p>
                        <p><strong>Body:</strong></p>
                        <p>Hi Team,<br><br>I hope this message finds you well. I wanted to reach out regarding our ongoing project initiatives. Could you please provide an update on the current progress and timeline?<br><br>Any blockers or resource needs should be communicated ASAP so we can address them promptly.<br><br>Best regards</p>
                    </div>
                </div>

                <div style="margin-top: 12px;">
                    <button onclick="copyEmailDemo()" style="padding: 10px 20px; background: #2196F3; color: white; border: none; border-radius: 4px; cursor: pointer;">📋 Copy to Clipboard</button>
                    <button onclick="insertDemo()" style="padding: 10px 20px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; margin-left: 8px;">✉️ Send Email</button>
                </div>
            </div>
        `
    };

    title.textContent = toolName;
    content.innerHTML = toolContent[toolName] || `<p>Loading ${toolName}...</p>`;
    modal.style.display = 'block';
    console.log('Modal displayed');
}

// Demo helper functions
function showDemoNotification(feature) {
    alert('✨ Demo: Launching ' + feature + '\n\nIn production, this would open the real feature interface.');
}

function sendChatMessage() {
    const input = document.getElementById('chatInput');
    if (input && input.value.trim()) {
        alert('✨ Message sent: "' + input.value + '"\n\nBot would respond here.');
        input.value = '';
    }
}

function quickResponse(message) {
    alert('✨ Quick response sent: ' + message);
}

function summarizeDemo() {
    alert('✨ Document uploaded!\n\nProcessing... This would generate a summary.');
}

function analyzeDataset(type) {
    alert('✨ ' + type + ' Analysis\n\nGenerating insights from selected dataset...');
}

function optimizeProcess(process) {
    alert('✨ Analyzing: ' + process + '\n\nIdentifying automation opportunities...');
}

function viewPredictions(equipment) {
    alert('✨ Loading predictions for: ' + equipment + '\n\nFetching maintenance forecast data...');
}

function generateEmail() {
    alert('✨ Email generated successfully!\n\nYour email is ready to review and send.');
}

function copyEmailDemo() {
    alert('✨ Email copied to clipboard!');
}

function insertDemo() {
    alert('✨ Email sending...\n\nYour message has been delivered.');
}

function closeToolModal() {
    document.getElementById('toolModal').style.display = 'none';
}

// ============================================
// MAIN APP OBJECT
// ============================================

const APP = {
    // Configuration
    config: {
        apiBaseUrl: 'http://localhost:8000/api',
        useMockBackend: true, // Use mock backend for demo
        currentSection: 'scorecard',
    },

    // User context
    user: {
        employee_id: null,
        email: null,
        display_name: null,
        department_id: null,
        role: null,
        department_name: null,
    },

    // State
    state: {
        scorecard: null,
        leaderboard: [],
        tools: [],
        learning: [],
        notifications: [],
        department: null,
        badges: [],
    },

    // ============================================
    // INITIALIZATION
    // ============================================

    async init() {
        console.log('🚀 Initializing Smart Office AI Hub...');

        try {
            // Initialize mock backend
            if (this.config.useMockBackend) {
                console.log('📦 Using mock backend (test data loaded)');
                await mockBackend.init();
            }

            // Load current user
            await this.loadCurrentUser();

            // Update header
            this.updateHeader();

            // Setup navigation
            this.setupNavigation();

            // Hide loading
            setTimeout(() => {
                const loading = document.getElementById('loadingIndicator');
                if (loading) loading.style.display = 'none';
            }, 500);

            // Load initial section
            await this.loadSection('scorecard');

            console.log('✅ App initialized successfully');
        } catch (error) {
            console.error('❌ Error:', error);
            this.showError('Failed to initialize: ' + error.message);
        }
    },

    // ============================================
    // API CALLS
    // ============================================

    async apiCall(endpoint, method = 'GET') {
        try {
            if (this.config.useMockBackend) {
                // Use mock backend
                if (endpoint === '/me') return mockBackend.getProfile();
                if (endpoint === '/me/scorecard') return mockBackend.getScorecard();
                if (endpoint === '/adoption-metrics/history') return mockBackend.getAdoptionHistory();
                if (endpoint.startsWith('/departments/')) {
                    const deptId = parseInt(endpoint.split('/')[2]);
                    return mockBackend.getDepartmentOverview(deptId);
                }
                if (endpoint === '/tools/catalog') return mockBackend.getToolsCatalog();
                if (endpoint === '/tools/categories') return mockBackend.getToolCategories();
                if (endpoint === '/learning/resources') return mockBackend.getLearningResources();
                if (endpoint === '/learning/progress') return mockBackend.getLearningProgress();
                if (endpoint === '/badges') return mockBackend.getBadges();
                if (endpoint === '/leaderboard') return mockBackend.getLeaderboard();
                if (endpoint === '/points') return mockBackend.getPoints();
                if (endpoint === '/challenges') return mockBackend.getChallenges();
                if (endpoint === '/analytics/roi') return mockBackend.getROI();
                if (endpoint.startsWith('/analytics/trends')) return mockBackend.getTrends();
                if (endpoint === '/notifications') return mockBackend.getNotifications();

                throw new Error('Unknown endpoint: ' + endpoint);
            }

            // Real API call
            const response = await fetch(this.config.apiBaseUrl + endpoint, { method });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        } catch (error) {
            console.error('API error:', error);
            throw error;
        }
    },

    // ============================================
    // USER MANAGEMENT
    // ============================================

    async loadCurrentUser() {
        try {
            const profile = await this.apiCall('/me');
            this.user = profile;
            console.log('✅ User:', this.user.display_name);
        } catch (error) {
            console.error('Error loading user:', error);
            this.user = {
                employee_id: 1001,
                email: 'test@dewa.gov.ae',
                display_name: 'Test User',
                department_id: 1,
                department_name: 'Operations',
                role: 'Employee',
            };
        }
    },

    updateHeader() {
        const name = document.getElementById('userDisplayName');
        const role = document.getElementById('userRole');
        const avatar = document.getElementById('userAvatar');

        if (name) name.textContent = this.user.display_name;
        if (role) role.textContent = this.user.role;
        if (avatar) {
            const initials = this.user.display_name.split(' ').map(n => n[0]).join('').toUpperCase();
            avatar.textContent = initials.slice(0, 2);
        }
    },

    // ============================================
    // NAVIGATION
    // ============================================

    setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                
                // Update active
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                await this.loadSection(section);
            });
        });
    },

    async loadSection(sectionName) {
        const valid = ['scorecard', 'leaderboard', 'tools', 'learning', 'roi', 'settings'];
        if (!valid.includes(sectionName)) return;

        // Hide all
        document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
        
        // Show target
        const el = document.getElementById(`${sectionName}-section`);
        if (el) el.classList.add('active');

        this.config.currentSection = sectionName;

        try {
            switch (sectionName) {
                case 'scorecard': await this.loadScorecard(); break;
                case 'leaderboard': await this.loadLeaderboard(); break;
                case 'tools': await this.loadTools(); break;
                case 'learning': await this.loadLearning(); break;
                case 'roi': await this.loadROI(); break;
                case 'settings': this.loadSettings(); break;
            }
        } catch (error) {
            console.error(`Error loading ${sectionName}:`, error);
            this.showError(`Failed to load ${sectionName}`);
        }
    },

    // ============================================
    // SCORECARD
    // ============================================

    async loadScorecard() {
        const card = await this.apiCall('/me/scorecard');
        
        document.getElementById('currentScore').textContent = card.current_score;
        document.getElementById('tasksAutomated').textContent = card.tasks_automated;
        document.getElementById('hoursSaved').textContent = card.hours_saved;
        document.getElementById('toolsUsed').textContent = card.tools_used;

        const change = card.current_score - card.previous_score;
        const trend = change > 0 ? '📈' : change < 0 ? '📉' : '→';
        document.getElementById('scoreChange').textContent = `${trend} ${change > 0 ? '+' : ''}${change} vs last month`;

        // Comparison
        document.getElementById('userProgress').style.width = card.current_score + '%';
        document.getElementById('deptProgress').style.width = Math.round(card.current_score * 0.9) + '%';
        document.getElementById('orgProgress').style.width = Math.round(card.current_score * 0.85) + '%';

        document.getElementById('userCompScore').textContent = card.current_score;
        document.getElementById('deptCompScore').textContent = Math.round(card.current_score * 0.9);
        document.getElementById('orgCompScore').textContent = Math.round(card.current_score * 0.85);

        // Chart
        this.drawTrendChart(card.trends);
    },

    drawTrendChart(trends) {
        const canvas = document.getElementById('trendChart');
        if (!canvas || trends.length === 0) return;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const w = canvas.width;
        const h = canvas.height;
        const margin = 40;
        const stepX = (w - 2 * margin) / (trends.length - 1 || 1);
        const minScore = Math.min(...trends);
        const maxScore = Math.max(...trends);
        const range = Math.max(maxScore - minScore, 10);

        // Draw grid
        ctx.strokeStyle = '#eee';
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const y = margin + (i * (h - 2 * margin) / 4);
            ctx.beginPath();
            ctx.moveTo(margin, y);
            ctx.lineTo(w - margin, y);
            ctx.stroke();
        }

        // Draw line
        ctx.strokeStyle = '#00a651';
        ctx.lineWidth = 2;
        ctx.beginPath();
        trends.forEach((score, i) => {
            const x = margin + i * stepX;
            const y = h - margin - ((score - minScore) / range) * (h - 2 * margin);
            if (i === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
        });
        ctx.stroke();

        // Draw points
        ctx.fillStyle = '#00a651';
        trends.forEach((score, i) => {
            const x = margin + i * stepX;
            const y = h - margin - ((score - minScore) / range) * (h - 2 * margin);
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
        });
    },

    // ============================================
    // LEADERBOARD
    // ============================================

    async loadLeaderboard() {
        const board = await this.apiCall('/leaderboard');
        const badges = await this.apiCall('/badges');

        const list = document.getElementById('leaderboardList');
        list.innerHTML = board.slice(0, 20).map((e, i) => `
            <div style="display: flex; align-items: center; padding: 16px; border-bottom: 1px solid #eee; ${e.is_top_performer ? 'background: linear-gradient(90deg, rgba(0,166,81,0.05) 0%, transparent 100%);' : ''}">
                <span style="margin-right: 12px; font-size: 1.5em; min-width: 35px; text-align: center;">
                    ${e.rank <= 3 ? ['🥇', '🥈', '🥉'][e.rank - 1] : e.achievement_badge}
                </span>
                <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                        <div style="font-weight: 600; font-size: 1em;">${e.display_name}</div>
                        ${e.title ? `<span style="font-size: 0.8em; background: #00a651; color: white; padding: 2px 8px; border-radius: 12px;">${e.title}</span>` : ''}
                    </div>
                    <div style="font-size: 0.85em; color: #666; margin-bottom: 6px;">${e.role} • ${e.department}</div>
                    <div style="display: flex; gap: 12px; font-size: 0.8em; color: #999;">
                        <span>📍 ${e.location}</span>
                        <span>⚡ ${e.adoption_score} adoption</span>
                        <span>🎯 ${e.tasks_automated} tasks</span>
                        <span>⏱ ${e.hours_saved}h saved</span>
                    </div>
                    ${e.badge_list.length > 0 ? `<div style="margin-top: 6px; display: flex; gap: 6px;">${e.badge_list.map(b => `<span style="background: #f0f0f0; padding: 2px 6px; border-radius: 4px; font-size: 0.75em;">${b}</span>`).join('')}</div>` : ''}
                </div>
                <div style="text-align: right; min-width: 80px;">
                    <div style="font-weight: 700; font-size: 1.2em; color: #00a651;">${e.points.toLocaleString()}</div>
                    <div style="font-size: 0.8em; color: #999;">points</div>
                    <div style="font-size: 0.8em; color: #999; margin-top: 4px;">🔥 ${e.streak_days}d streak</div>
                </div>
            </div>
        `).join('');

        const badgesGrid = document.getElementById('badgesGrid');
        badgesGrid.innerHTML = badges.map(b => `
            <div style="padding: 16px; border: 1px solid #eee; border-radius: 8px; text-align: center;">
                <div style="font-size: 1.8em; margin-bottom: 8px;">🏆</div>
                <div style="font-weight: 500; font-size: 0.9em;">${b.name}</div>
                <div style="font-size: 0.75em; color: #999; margin-top: 4px;">${b.description}</div>
            </div>
        `).join('');
    },

    // ============================================
    // TOOLS
    // ============================================

    async loadTools() {
        const tools = await this.apiCall('/tools/catalog');

        const list = document.getElementById('toolsList');
        list.innerHTML = tools.map(t => `
            <div style="padding: 16px; border: 1px solid #eee; border-radius: 8px; margin-bottom: 12px;">
                <div style="font-weight: 500; margin-bottom: 8px;">${t.name}</div>
                <div style="font-size: 0.9em; color: #666; margin-bottom: 12px;">${t.description}</div>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="font-size: 0.75em; background: #f0f0f0; padding: 4px 8px; border-radius: 4px;">${t.category}</span>
                    <button class="btn btn-primary" style="padding: 6px 12px; font-size: 0.9em;">Open Tool</button>
                </div>
            </div>
        `).join('');
    },

    // ============================================
    // LEARNING
    // ============================================

    async loadLearning() {
        const resources = await this.apiCall('/learning/resources');
        const progress = await this.apiCall('/learning/progress');

        const grid = document.getElementById('resourcesGrid');
        grid.innerHTML = resources.map(r => `
            <div style="padding: 16px; border: 1px solid #eee; border-radius: 8px;">
                <div style="font-weight: 500; margin-bottom: 8px;">${r.title}</div>
                <div style="font-size: 0.85em; color: #666; margin-bottom: 8px;">${r.description || r.type}</div>
                <div style="display: flex; justify-content: space-between; font-size: 0.8em; color: #999;">
                    <span>${r.provider}</span>
                    <span>${r.duration_minutes} min</span>
                </div>
            </div>
        `).join('');
    },

    // ============================================
    // ROI
    // ============================================

    async loadROI() {
        const roi = await this.apiCall('/analytics/roi');

        document.getElementById('totalHoursSaved').textContent = Math.round(roi.total_hours_saved);
        document.getElementById('estimatedValue').textContent = Math.round(roi.total_roi_aed).toLocaleString();
        document.getElementById('participation').textContent = Math.round((roi.users_impacted / 140) * 100);
        document.getElementById('yourRank').textContent = 'N/A';
    },

    // ============================================
    // SETTINGS
    // ============================================

    loadSettings() {
        console.log('Settings loaded');
    },

    // ============================================
    // UTILITIES
    // ============================================

    showError(msg) {
        const div = document.createElement('div');
        div.style.cssText = 'position: fixed; top: 70px; right: 16px; background: #d32f2f; color: white; padding: 16px; border-radius: 8px; z-index: 9999;';
        div.textContent = '❌ ' + msg;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 5000);
    },

    showSuccess(msg) {
        const div = document.createElement('div');
        div.style.cssText = 'position: fixed; top: 70px; right: 16px; background: #00a651; color: white; padding: 16px; border-radius: 8px; z-index: 9999;';
        div.textContent = '✅ ' + msg;
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 3000);
    }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => APP.init());
