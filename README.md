# Smart Office AI Adoption Hub

A full-stack, modular enterprise AI adoption platform for DEWA (Dubai Electricity & Water Authority) designed to run within Smart Office employee portal.

## Project Structure

```
SmartOffice_AIHub/
├── backend/
│   ├── main.py              # FastAPI application entry point
│   ├── models.py            # SQLAlchemy ORM models
│   ├── database.py          # Database connection & session
│   ├── dependencies.py      # Auth & current user dependency
│   ├── schemas.py           # Pydantic request/response models
│   ├── routers/
│   │   ├── adoption.py      # Scorecard & adoption metrics
│   │   ├── tools.py         # AI tools catalog
│   │   ├── learning.py      # Learning center & resources
│   │   ├── gamification.py  # Badges, points, challenges
│   │   ├── leaderboard.py   # Departmental & peer rankings
│   │   └── notifications.py # Push notifications
│   ├── services/
│   │   ├── ai_metrics_service.py      # External AI metrics API calls
│   │   ├── learning_service.py        # Viva/HR integration
│   │   ├── ai_tools_service.py        # Tool catalog sync
│   │   └── gamification_service.py    # Badge evaluation logic
│   ├── requirements.txt     # Python dependencies
│   └── .env.example         # Environment variables template
├── database/
│   ├── schema.sql           # PostgreSQL schema
│   └── seed.sql             # Sample data
├── frontend/
│   ├── index.html           # Main application
│   ├── css/
│   │   ├── styles.css       # Core styles
│   │   └── responsive.css   # Mobile-first responsive
│   ├── js/
│   │   ├── api.js           # REST API wrapper
│   │   ├── dashboard.js     # Scorecard & metrics
│   │   ├── leaderboard.js   # Rankings
│   │   ├── tools.js         # Tools catalog
│   │   ├── learning.js      # Learning center
│   │   ├── gamification.js  # Badges & points
│   │   └── app.js           # Main app controller
│   └── assets/              # Icons, images
├── docs/
│   ├── API.md               # API documentation
│   ├── ARCHITECTURE.md      # System design
│   └── INTEGRATION.md       # SSO & external API integration
├── .gitignore
├── docker-compose.yml       # Local dev environment
└── ROADMAP.md              # Implementation phases
```

## Quick Start

### Prerequisites
- Python 3.9+
- PostgreSQL 12+ (or MySQL 8+)
- Node.js (optional, for frontend tooling)
- VS Code with GitHub Copilot

### Installation

1. **Clone and setup backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. **Configure database:**
```bash
# Update DATABASE_URL in .env
# Run migrations
psql -f ../database/schema.sql -d your_db_name
psql -f ../database/seed.sql -d your_db_name
```

3. **Start backend:**
```bash
uvicorn main:app --reload --port 8000
```

4. **Open frontend:**
- Open `frontend/index.html` in browser
- Or serve via Python: `python -m http.server 8001`

## Architecture Overview

### Authentication Flow
1. Smart Office provides DEWA OneID token (JWT)
2. Frontend includes token in `Authorization: Bearer <token>`
3. Backend validates token, extracts user claims
4. User automatically mapped to `employees.employee_id`

### Data Flow
- Frontend → REST API (Python/FastAPI)
- Backend queries local SQL DB + calls external APIs
- External APIs: AI metrics, Viva Learning, Rammas

### External Integrations
- **AI Metrics API**: `/api/ai-metrics/user/{id}` → hours saved, tasks automated
- **Viva Learning**: Microsoft Graph API → course progress, completions
- **Rammas**: DEWA virtual assistant → chat deep link
- **Organizational Data**: HR system → departments, roles, employees

## Key Features

✅ Personal AI Adoption Scorecard (monthly trends)
✅ Department Insights & Peer Comparison
✅ AI Tools Catalog with SSO Links
✅ Learning Center (Viva + internal resources)
✅ Gamification (Badges, Points, Challenges)
✅ Leaderboards (Department & Individual)
✅ ROI Tracking (Hours saved, Cost impact)
✅ Rammas AI Support Integration
✅ Notifications & Alerts
✅ Mobile-optimized for Smart Office WebView

## Development Workflow with GitHub Copilot

### 1. Schema & Models
Write table descriptions as comments → Copilot generates SQLAlchemy models

### 2. API Endpoints
- Describe route in docstring → Copilot scaffolds handler
- Type `@router.get("/path")` → Copilot auto-completes common patterns

### 3. Frontend Components
- Write HTML structure comments → Copilot fills responsive CSS
- Describe API calls → Copilot generates fetch wrapper code

### 4. Service Integration
- Comment: "Call AI metrics API for employee" → Copilot generates async service function

## Environment Variables

```
# Backend (.env)
DATABASE_URL=postgresql://user:password@localhost/ai_hub
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
DEWA_TOKEN_ISSUER=https://login.dewa.gov.ae
AI_METRICS_API_URL=https://api.dewa.gov.ae/ai-metrics
VIVA_GRAPH_ENDPOINT=https://graph.microsoft.com/v1.0
VIVA_CLIENT_ID=xxx
VIVA_CLIENT_SECRET=xxx
```

## API Documentation

See `docs/API.md` for full OpenAPI specification.

Key endpoints:
- `GET /api/me/scorecard` - Personal adoption metrics
- `GET /api/departments/{id}/overview` - Department insights
- `GET /api/tools/catalog` - AI tools list
- `GET /api/learning/resources` - Learning content
- `GET /api/gamification/badges` - User badges
- `GET /api/leaderboard/departments` - Top departments

## Database Schema Highlights

**Core Tables:**
- `employees` - user identity from HR
- `departments` - organizational structure
- `ai_adoption_metrics` - monthly scores per user
- `ai_tools` - approved tools catalog
- `learning_resources` - courses, videos, FAQs
- `gamification_badges` - badge definitions & criteria
- `user_badges` - earned badges per user
- `user_points` - gamification points tracking

## Security

- ✅ SSO-based authentication (DEWA OneID)
- ✅ Role-based access control (RBAC) at endpoint level
- ✅ Input validation (Pydantic schemas)
- ✅ Rate limiting on public endpoints
- ✅ HTTPS enforced in production
- ✅ Database encryption (PII at rest)
- ✅ Audit logging for sensitive operations

## Performance

- Pagination for large lists (leaderboards, resources)
- Redis caching for department aggregates
- Async database calls (SQLAlchemy async)
- Lazy-loaded frontend charts
- Mobile-first CSS (minimal bundle)

## Roadmap

### Phase 1 (Weeks 1-2): Foundation
- [ ] Backend scaffold + DB schema
- [ ] Basic SSO validation
- [ ] Scorecard endpoint with mock data
- [ ] Frontend layout & navigation

### Phase 2 (Weeks 3-4): Core Features
- [ ] Department insights
- [ ] Tools catalog (real + SSO links)
- [ ] Learning center (Viva integration)
- [ ] Basic gamification (points, badges)

### Phase 3 (Weeks 5-6): Advanced
- [ ] ROI metrics & tracking
- [ ] Advanced leaderboards
- [ ] Notifications
- [ ] Rammas integration

### Phase 4 (Weeks 7-8): Polish & Deploy
- [ ] Performance optimization
- [ ] Security hardening
- [ ] UAT testing
- [ ] Production deployment to Azure

## Support & Contact

- **Questions?** Contact: AI.Hub.Dev@dewa.gov.ae
- **Bug reports?** GitHub Issues
- **Feature requests?** Pull Requests welcome

---

**Status**: MVP Development
**Last Updated**: January 28, 2026
**License**: Internal DEWA Use Only
