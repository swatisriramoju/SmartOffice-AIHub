// AI Features for Smart Office AI Hub
// Provides AI-powered insights, recommendations, and predictive analytics

const AIFeatures = {
    // Initialize AI features
    async init() {
        console.log('Initializing AI Features...');
        this.generateInsights();
        this.generateRecommendations();
        this.generatePeerInsights();
    },

    // Generate AI Insights
    generateInsights() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const adoptionScore = currentUser.adoptionScore || 650;
        const completedTools = currentUser.completedTools || 5;
        const tasksAutomated = currentUser.tasksAutomated || 12;

        // Predictive completion calculation
        const baseCompletion = (adoptionScore / 1000) * 100;
        const predictedCompletion = Math.min(95, Math.round(baseCompletion + (Math.random() * 15)));
        
        // Next milestone calculation
        const nextMilestoneTarget = Math.ceil((adoptionScore + 100) / 50) * 50;
        const daysToMilestone = Math.max(10, Math.round((nextMilestoneTarget - adoptionScore) / 15));
        
        // Success probability based on completion rate
        const successProbability = Math.min(99, Math.round(75 + (completedTools * 3)));

        // Update UI
        document.getElementById('predictedCompletion').textContent = predictedCompletion + '%';
        document.getElementById('nextMilestone').textContent = nextMilestoneTarget + ' pts';
        document.getElementById('nextMilestone').parentElement.parentElement.children[2].textContent = `in ${daysToMilestone} days`;
        document.getElementById('successProbability').textContent = successProbability + '%';

        return {
            predictedCompletion,
            nextMilestoneTarget,
            daysToMilestone,
            successProbability
        };
    },

    // Generate personalized recommendations
    generateRecommendations() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const role = currentUser.role || 'Employee';
        const adoptionScore = currentUser.adoptionScore || 650;
        const completedTools = currentUser.completedTools || 5;

        // Recommend tools based on role and score
        const toolRecommendations = this.getToolRecommendations(role, adoptionScore);
        const learningRecommendations = this.getLearningRecommendations(role, adoptionScore);

        // Populate tool recommendations
        const toolsContainer = document.getElementById('recommendedTools');
        if (toolsContainer) {
            toolsContainer.innerHTML = toolRecommendations.map(tool => `
                <div style="background: white; border: 2px solid #00a651; border-radius: 12px; padding: 16px; cursor: pointer; transition: all 0.3s;" 
                     onmouseover="this.style.boxShadow='0 8px 20px rgba(0,166,81,0.2)'" 
                     onmouseout="this.style.boxShadow='none'">
                    <div style="font-size: 2em; margin-bottom: 8px;">${tool.emoji}</div>
                    <h4 style="margin: 8px 0; color: #333;">${tool.name}</h4>
                    <p style="margin: 8px 0; color: #666; font-size: 0.9em;">${tool.description}</p>
                    <div style="display: flex; align-items: center; gap: 8px; margin-top: 12px;">
                        <div style="font-size: 0.8em; background: #e8f5e9; color: #00a651; padding: 4px 8px; border-radius: 4px;">
                            ${tool.matchScore}% match
                        </div>
                        <div style="font-size: 0.8em; color: #999;">Perfect for ${tool.reason}</div>
                    </div>
                </div>
            `).join('');
        }

        // Populate learning recommendations
        const learningContainer = document.getElementById('recommendedLearning');
        if (learningContainer) {
            learningContainer.innerHTML = learningRecommendations.map(learning => `
                <div style="background: white; border-left: 4px solid #1976d2; padding: 16px; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h4 style="margin: 0 0 8px 0; color: #333;">${learning.title}</h4>
                        <p style="margin: 0; color: #666; font-size: 0.9em;">${learning.description}</p>
                        <div style="margin-top: 8px; display: flex; gap: 8px;">
                            <span style="background: #e3f2fd; color: #1976d2; padding: 2px 8px; border-radius: 4px; font-size: 0.8em;">📚 ${learning.duration}</span>
                            <span style="background: #f3e5f5; color: #7b1fa2; padding: 2px 8px; border-radius: 4px; font-size: 0.8em;">⭐ ${learning.difficulty}</span>
                        </div>
                    </div>
                    <button type="button" style="background: #1976d2; color: white; border: none; padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 500; white-space: nowrap;">Start Learning</button>
                </div>
            `).join('');
        }

        // Populate AI recommendations
        const aiRecommendations = this.getAIRecommendations(role, adoptionScore, completedTools);
        const aiContainer = document.getElementById('aiRecommendations');
        if (aiContainer) {
            aiContainer.innerHTML = aiRecommendations.map(rec => `
                <div style="background: white; padding: 16px; border-radius: 8px; border-left: 4px solid #667eea; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: start;">
                        <div>
                            <h4 style="margin: 0 0 4px 0; color: #333;">${rec.title}</h4>
                            <p style="margin: 0; color: #666; font-size: 0.9em;">${rec.description}</p>
                            <div style="margin-top: 8px; font-size: 0.85em; color: #999;">⏱️ ${rec.timeframe}</div>
                        </div>
                        <span style="background: #f3e5f5; color: #7b1fa2; padding: 4px 12px; border-radius: 20px; font-size: 0.85em; font-weight: 500; white-space: nowrap;">AI Suggested</span>
                    </div>
                </div>
            `).join('');
        }
    },

    // Get tool recommendations based on role and score
    getToolRecommendations(role, adoptionScore) {
        const recommendations = {
            'Manager': [
                {
                    name: 'Process Optimizer',
                    emoji: '⚙️',
                    description: 'Optimize team workflows and automate routine tasks',
                    reason: 'team leads',
                    matchScore: 94
                },
                {
                    name: 'Data Insight Assistant',
                    emoji: '📊',
                    description: 'Get actionable insights from team performance data',
                    reason: 'decision makers',
                    matchScore: 92
                },
                {
                    name: 'Copilot for M365',
                    emoji: '🤖',
                    description: 'Enhance productivity across Office 365 apps',
                    reason: 'daily users',
                    matchScore: 88
                }
            ],
            'Employee': [
                {
                    name: 'Copilot for M365',
                    emoji: '🤖',
                    description: 'AI assistant for Word, Excel, Teams, and PowerPoint',
                    reason: 'office workers',
                    matchScore: 96
                },
                {
                    name: 'Email Assistant',
                    emoji: '✉️',
                    description: 'Write better emails faster with AI',
                    reason: 'communicators',
                    matchScore: 91
                },
                {
                    name: 'Document Summarizer',
                    emoji: '📄',
                    description: 'Quickly summarize long documents and reports',
                    reason: 'researchers',
                    matchScore: 87
                }
            ],
            'Executive': [
                {
                    name: 'Data Insight Assistant',
                    emoji: '📊',
                    description: 'Strategic insights from enterprise data',
                    reason: 'executives',
                    matchScore: 98
                },
                {
                    name: 'Predictive Maintenance Bot',
                    emoji: '🔧',
                    description: 'Predict issues before they happen',
                    reason: 'operations',
                    matchScore: 95
                },
                {
                    name: 'Process Optimizer',
                    emoji: '⚙️',
                    description: 'Enterprise-wide process automation',
                    reason: 'optimization',
                    matchScore: 93
                }
            ]
        };

        return recommendations[role] || recommendations['Employee'];
    },

    // Get learning recommendations
    getLearningRecommendations(role, adoptionScore) {
        const recommendations = [
            {
                title: 'Advanced AI Integration Strategies',
                description: 'Learn how to maximize AI tools in your daily workflows',
                duration: '2 hours',
                difficulty: 'Intermediate'
            },
            {
                title: 'Data Literacy for AI Users',
                description: 'Understand data basics to get more from AI tools',
                duration: '3 hours',
                difficulty: 'Beginner'
            },
            {
                title: 'AI Ethics and Responsible Use',
                description: 'Best practices for ethical AI implementation',
                duration: '1.5 hours',
                difficulty: 'Beginner'
            },
            {
                title: 'Automation Patterns and Best Practices',
                description: 'Design efficient workflows with Process Optimizer',
                duration: '4 hours',
                difficulty: 'Advanced'
            }
        ];

        // Return top 3 based on score
        return recommendations.slice(0, 3);
    },

    // Get AI recommendations for next steps
    getAIRecommendations(role, adoptionScore, completedTools) {
        const recommendations = [];

        if (adoptionScore < 700) {
            recommendations.push({
                title: 'Focus on Core Tools First',
                description: 'Master Copilot for M365 to build a strong foundation. This will unlock 40% more productivity gains.',
                timeframe: 'Next 2 weeks'
            });
        }

        if (completedTools < 4) {
            recommendations.push({
                title: 'Expand Your Tool Kit',
                description: `You're doing great with ${completedTools} tools. Try Email Assistant next for communication efficiency.`,
                timeframe: 'This week'
            });
        }

        recommendations.push({
            title: 'Join Monthly AI Challenge',
            description: 'Complete the "Automation Expert" challenge this month to earn 150 bonus points and exclusive badges.',
            timeframe: 'Before Feb 28'
        });

        if (adoptionScore > 650) {
            recommendations.push({
                title: 'Become an AI Champion',
                description: 'Your high adoption score qualifies you to mentor others. Earn points by helping your team.',
                timeframe: 'Ongoing'
            });
        }

        return recommendations;
    },

    // Generate peer insights
    generatePeerInsights() {
        // Mock data for peer insights
        const peers = [
            { name: 'Sarah Ahmed', score: 895, department: 'Operations', tools: 6 },
            { name: 'Ahmed Hassan', score: 820, department: 'Finance', tools: 5 },
            { name: 'Fatima Khan', score: 780, department: 'HR', tools: 5 }
        ];

        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        const myScore = currentUser.adoptionScore || 650;

        // Calculate insights
        const highPerformers = peers.filter(p => p.score > myScore).length;
        const popularTools = ['Copilot for M365', 'Document Summarizer', 'Email Assistant'];
        const advantage = Math.round((peers.reduce((a, b) => a + b.score, 0) / peers.length - myScore) / 10);

        document.getElementById('highPerformers').textContent = highPerformers;
        document.getElementById('popularTool').textContent = popularTools[0];
        document.getElementById('yourAdvantage').textContent = Math.abs(advantage) + '%';
    }
};

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
    AIFeatures.init();
});

// Re-initialize when user data changes
document.addEventListener('userDataUpdated', () => {
    AIFeatures.init();
});
