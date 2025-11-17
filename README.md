# Dynamic Roadmap Visualizer 🚀

An adaptive, plugin-based UI rendering system for personal goal roadmaps that dynamically adjusts its interface based on the domain (Table Tennis, YouTube Creator, AI PM, Stock Trading, etc.).

## 🎯 Project Overview

This is a complete learning roadmap visualizer that demonstrates:
- **Domain-specific UI configuration** - Each learning domain has its own tailored interface
- **Dynamic component rendering** - Components appear/disappear based on user progress and context
- **Adaptive layouts** - Responsive design that works on desktop, tablet, and mobile
- **Real-time progress tracking** - Live updates as users advance through their learning journey
- **Customizable experience** - Edit mode for drag-and-drop component reordering

## 📊 Project Structure

```
.
├── backend/
│   ├── domain_config.py      # Domain configuration system
│   ├── main.py               # FastAPI backend
│   └── requirements.txt       # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── DomainSelector.jsx
│   │   │   ├── DynamicUIRenderer.jsx
│   │   │   ├── universal/
│   │   │   │   ├── Timeline.jsx
│   │   │   │   ├── ProgressTracker.jsx
│   │   │   │   └── Phases.jsx
│   │   │   ├── domain/
│   │   │   │   ├── SkillTree.jsx
│   │   │   │   └── ContentCalendar.jsx
│   │   │   └── styles/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── App.css
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .gitignore
└── README.md
```

## 🚀 Quick Start

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment (optional but recommended):**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the FastAPI server:**
   ```bash
   python main.py
   ```
   The API will be available at `http://localhost:8000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`

## 📚 Available Domains

### 🏓 Table Tennis Mastery
- **Duration:** 6-24 months
- **Components:** Timeline, Progress Tracker, Skill Tree, Practice Regimen, Phases
- **Key Features:** Skill progression, phase-based learning, performance KPIs

### 📹 YouTube Creator Journey
- **Duration:** 12-36 months
- **Components:** Timeline, Progress Tracker, Content Calendar, Analytics Dashboard
- **Key Features:** Content pipeline, publishing schedule, audience analytics

### 🤖 AI Product Manager Skills
- **Duration:** 6-12 months
- **Components:** Learning Path, Skill Tree, Case Study Tracker, Progress Tracker
- **Key Features:** Technical learning tracks, concept mastery, project portfolio

### 📈 Stock Trading Mastery
- **Duration:** 12-36 months
- **Components:** Trading Simulator, Risk Dashboard, Strategy Builder, Progress Tracker
- **Key Features:** Paper trading, risk metrics, strategy backtesting

## 🏗️ Architecture

### Domain Configuration System (Python)

Each domain defines:
- **Components**: Which UI components to display
- **Display Modes**: How to render (widget, panel, fullwidth, modal)
- **Priority**: When to show components based on view mode
- **Visibility Rules**: Conditions for showing components
- **KPIs**: Key performance indicators for the domain
- **Time Patterns**: Learning pace expectations
- **Skill Trees**: Learning progression structure

### Dynamic Rendering (React)

The frontend:
1. Fetches domain configuration from the backend
2. Dynamically loads and renders components
3. Adapts layout based on viewport and user's view mode preference
4. Supports drag-and-drop customization in edit mode
5. Updates progress in real-time

## 📡 API Endpoints

### GET `/api/domains`
List all available learning domains

**Response:**
```json
{
  "domains": [
    {
      "id": "table_tennis",
      "name": "Table Tennis Mastery",
      "description": "Learn and master table tennis skills",
      "icon": "🏓",
      "typical_duration": "6-24 months"
    }
  ]
}
```

### GET `/api/config/{domain_id}`
Get domain-specific configuration
- **Headers:** `X-User-Id: <user_id>`

**Response:**
```json
{
  "config": {
    "domain": {...},
    "components": [...],
    "layout": {...},
    "kpis": [...]
  },
  "progress": {...},
  "domain_data": {...},
  "context": {...}
}
```

### POST `/api/components/{component_id}/update`
Update component data
- **Headers:** `X-User-Id: <user_id>`
- **Body:** `{ "data": {...} }`

### POST `/api/progress/update`
Update user progress
- **Headers:** `X-User-Id: <user_id>`
- **Body:** `{ "overall": 50, "current_phase": "phase2", ... }`

### GET `/api/milestones/{milestone_id}/complete`
Mark a milestone as completed

## 🎨 Customization

### Adding a New Domain

1. **Create configuration in `backend/domain_config.py`:**

```python
@staticmethod
def create_new_domain_config() -> DomainConfig:
    return DomainConfig(
        domain_id="new_domain",
        name="New Domain",
        description="Description",
        icon="🎯",
        color_scheme={...},
        components=[...],
        kpis=[...],
        time_patterns={...}
    )
```

2. **Register in ConfigurationManager:**

```python
def _load_default_configs(self):
    factory = DomainConfigFactory()
    self.configs["new_domain"] = factory.create_new_domain_config()
```

### Adding a New Component

1. **Create React component** in `frontend/src/components/`
2. **Register in ComponentMap** in `DynamicUIRenderer.jsx`
3. **Add to domain configuration** in the backend

## 🎯 Component Modes

Each component can render in different modes:

| Mode | Use Case | Best For |
|------|----------|----------|
| **widget** | Compact overview | Small cards, summaries |
| **panel** | Standard section | Medium-sized detailed views |
| **fullwidth** | Full interactive | Complete interactive experiences |
| **modal** | Focus | Popup/overlay presentations |

## 🔍 View Mode Priorities

Switch view modes using the header controls:
- **▦ Compact**: Only CRITICAL priority components
- **▤ Standard**: CRITICAL + HIGH priority components
- **▣ Detailed**: All components

## 💡 Key Features

✅ Multi-domain support with domain-specific configurations
✅ Dynamic component loading based on context and progress
✅ Responsive design for desktop, tablet, and mobile
✅ Real-time progress tracking with WebSocket support
✅ Drag-and-drop component customization in edit mode
✅ Multiple view modes (compact, standard, detailed)
✅ Animated transitions and interactive elements
✅ Component visibility rules based on user progress
✅ KPI tracking and analytics
✅ Skill tree visualization with progress indicators

## 🚨 Troubleshooting

### Backend Issues
```bash
# Check Python version (need 3.8+)
python --version

# Check if port 8000 is available
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows
```

### Frontend Issues
```bash
# Check Node version (need 16+)
node --version

# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Connection Issues
- Ensure backend is running on `http://localhost:8000`
- Check that frontend is configured to proxy to the backend
- Verify CORS is enabled in FastAPI

## 📈 Future Enhancements

- [ ] PostgreSQL database integration
- [ ] User authentication and authorization
- [ ] Social features (leaderboards, communities)
- [ ] AI-powered recommendations
- [ ] Mobile app (React Native)
- [ ] Offline support with service workers
- [ ] Advanced analytics dashboard
- [ ] Integration with external learning platforms

## 📝 License

MIT - Feel free to use this in your own projects!

---

**Built with ❤️ for adaptive learning experiences**