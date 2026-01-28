# GitHub Copilot Integration Guide - Smart Office AI Hub

## Overview

This guide shows how to use **GitHub Copilot** to accelerate development on the Smart Office AI Hub project. All code templates are designed to work seamlessly with Copilot's code generation and completion features.

---

## Setup

### 1. Enable GitHub Copilot in VS Code

```
VS Code Extensions → Install "GitHub Copilot"
Sign in with GitHub account
Accept terms and enable
```

### 2. Configure Copilot Settings

In VS Code settings (`Ctrl+,`):
```json
{
    "github.copilot.enable": {
        "javascript": true,
        "python": true,
        "sql": true,
        "markdown": true
    }
}
```

### 3. Use Copilot Commands

- **Ctrl+Shift+A** - Open Copilot Chat (GitHub Copilot Chat extension)
- **Ctrl+I** - Inline completion
- **Tab** - Accept suggestion
- **Escape** - Dismiss suggestion

---

## Workflow: Complete Remaining Routers

### Task: Create Tools Router

**Step 1: Create file**
```bash
# Create file in VS Code
backend/routers/tools.py
```

**Step 2: Use Copilot Chat to scaffold**

Open Copilot Chat (`Ctrl+Shift+A`):

```
@@ Create a FastAPI router for AI tools catalog with these endpoints:
1. GET /tools/catalog - List all approved tools with pagination and filtering
2. GET /tools/categories - Get all tool categories
3. POST /tools/{tool_id}/access - Log tool access and return success
4. GET /tools/{tool_id} - Get details of a specific tool

Use these technologies:
- FastAPI router with async handlers
- SQLAlchemy for ORM queries
- Pydantic schemas for input/output validation
- JWT authentication via get_current_user dependency
- Audit logging for access logging

Follow the pattern from adoption.py router.
Include error handling (404, 403) and docstrings.
```

Copilot will generate the complete router scaffolding.

**Step 3: Review and refine**

- Check that endpoints match adoption.py patterns
- Verify ORM queries are correct
- Ensure error codes are appropriate
- Confirm docstrings are complete

**Step 4: Add to main.py**

In `backend/main.py`, uncomment or add:
```python
from routers import tools

app.include_router(tools.router, prefix="/api", tags=["Tools"])
```

### Task: Create Learning Router

**Step 1: Open Copilot Chat**

```
@@ Create a FastAPI router for learning resources with these endpoints:
1. GET /learning/resources - List all learning resources with filtering by type, difficulty, provider
2. GET /learning/progress - Get current user's learning progress
3. POST /learning/{resource_id}/progress - Update progress on a resource (status, progress %, score)
4. GET /learning/recommendations - Get personalized learning recommendations based on user's role and progress
5. GET /learning/paths/{role} - Get learning paths for a specific user role

Use the same patterns as adoption.py. Include:
- Async handlers with proper dependencies
- ORM queries using relationships
- Pydantic validation schemas
- Access control (own data only for employees, any for admins)
- Audit logging for completions
```

**Step 2: Generate and integrate**

Follow same process as tools router.

### Task: Create Gamification Router

**Step 1: Copilot Chat**

```
@@ Create a FastAPI router for gamification (badges, points, challenges) with:
1. GET /badges - Get all badges (filter by earned/locked)
2. POST /badges - Award a badge to user (admin only)
3. GET /points - Get user's current points and progress
4. GET /challenges - Get active monthly challenges
5. POST /challenges/{challenge_id}/progress - Update challenge progress
6. POST /challenges/{challenge_id}/complete - Mark challenge as complete

Include error handling, docstrings, and audit logging. Follow adoption.py pattern.
```

**Step 2: Generate and integrate**

---

## Workflow: Complete Frontend Modules

### Task: Implement Tools Module

**Step 1: Open tools.js**
```javascript
// @@ Implement the Tools module with these features:
// 1. Load tools catalog from API
// 2. Render tools grid with search
// 3. Filter by category
// 4. Log tool access when user clicks
// 5. Show tool details in modal
// Follow the pattern from dashboard.js module
```

Copilot will auto-complete the implementation.

### Task: Implement Learning Module

**Step 1: Open learning.js**
```javascript
// @@ Complete the Learning module to:
// 1. Load learning resources from /learning/resources
// 2. Load user progress from /learning/progress
// 3. Render learning path with status indicators
// 4. Render resource cards with metadata
// 5. Show progress bars and completion status
// Include error handling and loading states
```

### Task: Implement Gamification Module

**Step 1: Open gamification.js**
```javascript
// @@ Complete gamification to:
// 1. Load badges from /badges endpoint
// 2. Load challenges from /challenges endpoint
// 3. Load points from /points endpoint
// 4. Render badge grid with locked/earned states
// 5. Render active challenges with progress
// 6. Show points total and next level progress
// Add click handlers for challenges and badges
```

---

## Workflow: Add Feature - Notifications

### Task: Create Notifications Endpoint

**Step 1: Copilot Chat**

```
@@ Create a FastAPI notifications router with:
1. GET /notifications - List user's notifications (paginated, filter by read status)
2. POST /notifications/{notification_id}/read - Mark single notification as read
3. POST /notifications/read-all - Mark all notifications as read
4. DELETE /notifications/{notification_id} - Delete a notification
5. WebSocket /notifications/stream - Stream real-time notifications (bonus)

Use SQLAlchemy ORM for queries.
Include pagination, sorting by date desc.
Add unread_count to response metadata.
```

### Task: Create Notifications Frontend Component

**Step 1: Create notifications.js**

```javascript
// @@ Create a notifications module that:
// 1. Polls /notifications every 5 seconds for new notifications
// 2. Shows notification badge with unread count
// 3. Displays notifications in dropdown list
// 4. Marks as read when clicked
// 5. Shows success toast when badge earned
// Include debouncing to prevent excessive API calls
// Use timestamps formatted as "2 hours ago"
```

---

## Workflow: Add Feature - Export Scorecard

### Task: Create PDF Export Feature

**Step 1: Backend Endpoint**

```
@@ Create a POST /export/scorecard endpoint that:
1. Gets current user's scorecard
2. Generates PDF with user's adoption metrics, trends, and comparison
3. Includes charts as images
4. Returns PDF file for download
5. Log the export action in audit logs

Use reportlab library for PDF generation.
Include header with DEWA branding and footer with timestamp.
```

**Step 2: Frontend Export Button**

```javascript
// @@ Add an export button to the scorecard section that:
// 1. Calls POST /export/scorecard when clicked
// 2. Shows loading spinner while generating
// 3. Automatically downloads PDF when ready
// 4. Shows success/error toast
// Filename format: "AI_Adoption_Scorecard_2026-01.pdf"
```

---

## Workflow: Performance Optimization

### Task: Add Caching

**Step 1: Add Redis Cache**

```python
# @@ Add Redis caching to adoption router:
# 1. Cache /me/scorecard for 5 minutes per user
# 2. Cache leaderboard for 15 minutes
# 3. Use user_id as cache key prefix
# 4. Invalidate cache on metrics POST
# 5. Add cache hit/miss logging
# Use redis-py library with aioredis for async
```

### Task: Add Service Worker

**Step 1: Create service-worker.js**

```javascript
// @@ Create a service worker for offline capability:
// 1. Cache static assets (HTML, CSS, JS)
// 2. Cache API responses with network-first strategy
// 3. Show offline indicator when disconnected
// 4. Queue POST requests when offline, retry when online
// 5. Update cache on API success
// Register service worker in app.js
```

---

## Common Copilot Prompts for This Project

### API Endpoint Generation

```
@@ Create a FastAPI endpoint that:
- [describe business logic]
- [specify ORM queries needed]
- [list input/output schemas]
- [mention access control]
- [describe error cases]
```

**Example:**
```
@@ Create GET /roi endpoint that:
- Calculates total hours saved from adoption metrics
- Estimates business value (AED) using $50/hour rate
- Gets organization and department participation rates
- Returns user's rank in department
- Include error handling for missing data
```

### Frontend Component Generation

```
@@ Create a [component] that:
- [describe UI layout]
- [list API endpoints to call]
- [specify data transformations]
- [describe user interactions]
- [mention error states]
```

**Example:**
```
@@ Create a user profile card that:
- Displays user's name, role, department
- Shows avatar initials in circle
- Shows adoption score as percentage badge
- Shows tier/level (beginner/intermediate/advanced)
- Is clickable to show full profile modal
```

### Test Generation

```
@@ Create unit tests for [function] that:
- Test happy path with valid input
- Test error cases (404, 403, 400)
- Mock database with pytest fixtures
- Verify response schema matches
- Test access control rules
```

**Example:**
```
@@ Create tests for adoption.py scorecard endpoint:
- Test happy path returns correct scorecard
- Test 401 without auth token
- Test 403 for accessing other user's data
- Mock database queries with pytest
- Verify response matches PersonalScorecard schema
```

---

## Best Practices with Copilot

### 1. Be Specific

❌ **Too vague:**
```
@@ Generate a router
```

✅ **Specific:**
```
@@ Create a FastAPI router for tools catalog with:
- GET /tools/catalog endpoint
- Filter by category and search
- Pagination support
- Follow adoption.py pattern
```

### 2. Provide Context

❌ **Missing context:**
```
@@ Create an endpoint
```

✅ **With context:**
```
@@ Create a POST /learning/progress endpoint that:
- Updates user's progress on a learning resource
- Accepts resource_id, status, progress_percent, score
- Returns updated progress object
- Use SQLAlchemy ORM like adoption.py
- Include error handling for resource not found
```

### 3. Reference Existing Code

```
@@ Create a new router following the same pattern as adoption.py
(copy the structure, dependency injection, error handling, docstrings)
```

### 4. Request Improvements

```
@@ Review this code and suggest:
- Performance improvements
- Security enhancements
- Error handling additions
- Code style fixes
```

### 5. Ask for Explanations

```
@@ Explain how this query works:
[paste ORM query]

What indexes would help optimize this?
```

---

## Copilot Limitations to Know

| Limitation | Workaround |
|-----------|-----------|
| Hallucinated code (imports that don't exist) | Verify imports against requirements.txt |
| Outdated patterns (old library versions) | Reference pinned versions in requirements.txt |
| Missing error cases | Manually add error handling after generation |
| Incomplete logic | Review generated code for edge cases |
| Security issues (hardcoded secrets) | Never accept hardcoded passwords/keys |

---

## Advanced Copilot Techniques

### 1. Teach Copilot Your Style

```python
# At top of file, show your code style:
# Constants in UPPER_SNAKE_CASE
MAX_BATCH_SIZE = 1000
DEFAULT_TIMEOUT_SECONDS = 10

# Functions use async where appropriate
async def fetch_user_data(user_id: int) -> User:
    """Fetch user with full relationships."""
    return db.query(User).filter(...).first()

# Now when you ask Copilot to generate, it matches your style
```

### 2. Use Comments as Specifications

```python
def get_adoption_metrics(user_id: int):
    """
    Get adoption metrics for user in current month.
    
    Args:
        user_id: Employee ID
    
    Returns:
        AIAdoptionMetrics object with current month data
        or None if not found
    
    Raises:
        ValueError: if user_id is invalid
    """
    # @@ Implement according to docstring
```

### 3. Generate Test Data

```python
# @@ Generate realistic test data for these models:
# - 5 departments
# - 20 employees across departments
# - 20 adoption metrics (current and previous month)
# - 10 tools with different categories
# - 30 learning resource entries
# Use factory_boy or pytest fixtures
```

---

## Productivity Tips

### Keyboard Shortcuts
- **Ctrl+Enter**: Accept full suggestion
- **Tab**: Accept partial suggestion
- **Escape**: Dismiss suggestion
- **Alt+[**: Previous suggestion
- **Alt+]**: Next suggestion
- **Ctrl+Shift+A**: Open Copilot Chat

### Editor Configuration
```json
{
    // In .vscode/settings.json
    "editor.formatOnSave": true,
    "github.copilot.enable": {
        "*": true,
        "yaml": false
    },
    "github.copilot.autocomplete.enable": true
}
```

### Workflow Optimization

**For API Generation:**
1. Open router file
2. Type `from routers import` (Copilot helps)
3. Type endpoint decorator
4. Copilot generates full handler
5. Review and refine

**For Frontend:**
1. Create module skeleton
2. Type class/object declaration
3. Copilot generates methods
4. Fill in business logic
5. Test in browser

---

## Example: Complete Session

Let's show a complete workflow to add a new feature.

### Goal: Add "Export Scorecard as PDF" Feature

**Step 1: Backend - Create endpoint**

Open `backend/routers/adoption.py`:

```python
# @@ Add a POST /export/scorecard endpoint that:
# - Gets current user's scorecard
# - Generates PDF with adoption metrics and charts
# - Returns file for download
# - Logs export action
# Use reportlab for PDF generation
```

Copilot generates:
```python
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph

@router.post("/export/scorecard")
async def export_scorecard(
    user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Export adoption scorecard as PDF."""
    scorecard = await get_personal_scorecard(user=user, db=db)
    
    # Create PDF
    pdf_path = f"/tmp/scorecard_{user.employee_id}.pdf"
    doc = SimpleDocTemplate(pdf_path, pagesize=letter)
    # ... build PDF with scorecard data
    
    # Log export
    log_audit_event(user, "EXPORT_SCORECARD", "pdf", user.employee_id, db)
    
    return FileResponse(pdf_path, filename=f"scorecard_{date.today()}.pdf")
```

**Step 2: Frontend - Add export button**

In `frontend/index.html`, add to scorecard section:
```html
<button id="exportScorecard" class="btn btn-secondary">
    📥 Export as PDF
</button>
```

**Step 3: Frontend - Add click handler**

In `frontend/js/dashboard.js`:

```javascript
// @@ Add export button click handler that:
// - Calls POST /export/scorecard
// - Shows loading spinner
// - Triggers download when ready
// - Shows success toast
```

Copilot generates:
```javascript
document.getElementById('exportScorecard')?.addEventListener('click', async () => {
    try {
        APP.showLoading();
        const response = await APP.api.post('/export/scorecard');
        
        // Trigger download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `scorecard_${new Date().toISOString().split('T')[0]}.pdf`;
        a.click();
        
        APP.hideLoading();
        APP.showSuccess('Scorecard exported successfully!');
    } catch (error) {
        APP.hideLoading();
        APP.showError('Failed to export scorecard');
    }
});
```

**Step 4: Test**

```
@@ Create unit tests for export_scorecard endpoint:
- Test returns PDF file
- Test 401 without auth
- Test logs audit event
- Test file has correct filename
```

---

## Resources

- **GitHub Copilot Docs**: https://docs.github.com/copilot
- **VS Code Extension**: https://marketplace.visualstudio.com/items?itemName=GitHub.copilot
- **Copilot Chat**: https://marketplace.visualstudio.com/items?itemName=GitHub.copilot-chat

---

## Summary

GitHub Copilot is a powerful tool for accelerating development on the Smart Office AI Hub. Use it for:

✅ Scaffolding new endpoints  
✅ Generating boilerplate code  
✅ Writing tests  
✅ Code refactoring  
✅ Learning best practices  

Remember to:
✅ Review all generated code  
✅ Test thoroughly  
✅ Never accept security issues  
✅ Keep your team aligned on patterns  

Happy coding! 🚀

---

**Last Updated:** January 2026  
**Version:** 1.0.0
