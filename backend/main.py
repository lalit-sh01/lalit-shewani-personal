"""
FastAPI Backend for Dynamic Roadmap Visualizer
Serves domain configurations and handles user progress updates
"""

from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import json
import asyncio
from contextlib import asynccontextmanager
import logging
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))

from domain_config import (
    ConfigurationManager,
    DomainConfigFactory,
    ComponentConfig,
    ComponentPriority,
    DisplayMode
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Pydantic models
class UserProgress(BaseModel):
    overall: float = Field(ge=0, le=100, default=0)
    current_phase: str = "phase1"
    completed_milestones: List[str] = []
    skill_progress: Dict[str, float] = {}
    last_activity: Optional[datetime] = None
    streak_days: int = 0


class ComponentUpdateRequest(BaseModel):
    data: Dict[str, Any]
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class DomainConfigRequest(BaseModel):
    domain_id: str
    customizations: Optional[Dict[str, Any]] = None


class ConfigResponse(BaseModel):
    config: Dict[str, Any]
    progress: Dict[str, Any]
    domain_data: Dict[str, Any]
    context: Dict[str, Any]


# In-memory data store
class DataStore:
    def __init__(self):
        self.user_progress: Dict[str, UserProgress] = {}
        self.user_configs: Dict[str, Dict] = {}
        self.component_data: Dict[str, Dict] = {}
        self.activity_logs: List[Dict] = []

    async def get_user_progress(self, user_id: str, domain_id: str) -> UserProgress:
        key = f"{user_id}:{domain_id}"
        if key not in self.user_progress:
            self.user_progress[key] = UserProgress(
                overall=0,
                current_phase="phase1",
                completed_milestones=[],
                skill_progress={},
                last_activity=datetime.utcnow(),
                streak_days=0
            )
        return self.user_progress[key]

    async def update_user_progress(self, user_id: str, domain_id: str, progress: UserProgress):
        key = f"{user_id}:{domain_id}"
        self.user_progress[key] = progress

    async def get_component_data(self, user_id: str, component_id: str) -> Dict:
        key = f"{user_id}:{component_id}"
        return self.component_data.get(key, {})

    async def update_component_data(self, user_id: str, component_id: str, data: Dict):
        key = f"{user_id}:{component_id}"
        if key not in self.component_data:
            self.component_data[key] = {}
        self.component_data[key].update(data)

    async def log_activity(self, user_id: str, activity: Dict):
        self.activity_logs.append({
            "user_id": user_id,
            "timestamp": datetime.utcnow().isoformat(),
            **activity
        })


data_store = DataStore()
config_manager = ConfigurationManager()


async def simulate_progress_updates():
    """Simulate progress updates for demo"""
    while True:
        await asyncio.sleep(30)
        for key in data_store.user_progress:
            progress = data_store.user_progress[key]
            if progress.overall < 100:
                progress.overall = min(progress.overall + 0.5, 100)
        logger.info("Simulated progress update")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting Dynamic Roadmap Visualizer API")
    asyncio.create_task(simulate_progress_updates())
    yield
    logger.info("Shutting down API")


app = FastAPI(
    title="Dynamic Roadmap Visualizer API",
    description="Adaptive UI configuration for personalized learning roadmaps",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API Endpoints
@app.get("/")
async def root():
    """Health check"""
    return {
        "status": "healthy",
        "service": "Dynamic Roadmap Visualizer API",
        "version": "1.0.0"
    }


@app.get("/api/domains")
async def list_domains():
    """List all available domains"""
    domains = []
    for domain_id, config in config_manager.configs.items():
        domains.append({
            "id": config.domain_id,
            "name": config.name,
            "description": config.description,
            "icon": config.icon,
            "typical_duration": config.time_patterns.get("typical_duration", "Variable")
        })
    return {"domains": domains}


@app.get("/api/config/{domain_id}", response_model=ConfigResponse)
async def get_configuration(
    domain_id: str,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id")
):
    """Get domain configuration"""
    user_id = x_user_id or "default_user"

    config = config_manager.get_config(domain_id)
    if not config:
        raise HTTPException(status_code=404, detail=f"Domain '{domain_id}' not found")

    progress = await data_store.get_user_progress(user_id, domain_id)

    context = {
        "viewport": "desktop",
        "progress": progress.overall,
        "phase": progress.current_phase,
        "user_id": user_id,
        "domain_id": domain_id
    }

    rendered_config = config_manager.get_rendered_config(domain_id, context)

    # Sample domain data
    domain_data = {}
    if domain_id == "table_tennis":
        domain_data = {
            "phases": [
                {"id": "phase1", "name": "Foundation", "startWeek": 0, "endWeek": 4, "status": "completed"},
                {"id": "phase2", "name": "Development", "startWeek": 4, "endWeek": 12, "status": "active"},
                {"id": "phase3", "name": "Advanced", "startWeek": 12, "endWeek": 20, "status": "upcoming"},
                {"id": "phase4", "name": "Mastery", "startWeek": 20, "endWeek": 28, "status": "upcoming"}
            ],
            "milestones": [
                {"id": "m1", "name": "Basic Grip Mastered", "week": 2, "phase": "phase1", "completed": True},
                {"id": "m2", "name": "First Rally", "week": 6, "phase": "phase2", "completed": True},
                {"id": "m3", "name": "Spin Techniques", "week": 10, "phase": "phase2", "completed": False},
            ]
        }
    elif domain_id == "youtube_creator":
        domain_data = {
            "content_calendar": {
                "upcoming_videos": [
                    {"title": "Getting Started", "status": "scripting", "publish_date": "2024-02-01"},
                ]
            },
            "analytics": {
                "views": 1250,
                "subscribers": 42,
                "watch_time_hours": 18.5,
                "ctr": 4.2
            }
        }
    elif domain_id == "ai_pm":
        domain_data = {
            "learning_modules": [
                {"name": "ML Basics", "progress": 75, "status": "active"},
                {"name": "Data Strategy", "progress": 30, "status": "active"},
            ],
            "projects": [
                {"name": "Recommendation System", "status": "planning"},
            ]
        }
    elif domain_id == "stock_trading":
        domain_data = {
            "portfolio_value": 10500,
            "daily_pnl": 125.50,
            "win_rate": 58,
            "positions": [
                {"symbol": "AAPL", "shares": 10, "pnl": 250},
            ]
        }

    response = ConfigResponse(
        config=rendered_config,
        progress={
            "overall": progress.overall,
            "currentPhase": progress.current_phase,
            "completedMilestones": progress.completed_milestones,
            "skillProgress": progress.skill_progress,
            "lastActivity": progress.last_activity.isoformat() if progress.last_activity else None,
            "streakDays": progress.streak_days
        },
        domain_data=domain_data,
        context=context
    )

    return response


@app.post("/api/components/{component_id}/update")
async def update_component(
    component_id: str,
    request: ComponentUpdateRequest,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id")
):
    """Update component data"""
    user_id = x_user_id or "default_user"

    await data_store.update_component_data(user_id, component_id, request.data)
    await data_store.log_activity(user_id, {
        "type": "component_update",
        "component_id": component_id,
        "data": request.data
    })

    return {
        "success": True,
        "message": f"Component {component_id} updated successfully"
    }


@app.post("/api/progress/update")
async def update_progress(
    user_progress: UserProgress,
    domain_id: str,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id")
):
    """Update user progress"""
    user_id = x_user_id or "default_user"

    await data_store.update_user_progress(user_id, domain_id, user_progress)
    await data_store.log_activity(user_id, {
        "type": "progress_update",
        "domain_id": domain_id,
        "overall_progress": user_progress.overall
    })

    return {
        "success": True,
        "message": "Progress updated successfully",
        "progress": user_progress.overall
    }


@app.get("/api/milestones/{milestone_id}/complete")
async def complete_milestone(
    milestone_id: str,
    domain_id: str,
    x_user_id: Optional[str] = Header(None, alias="X-User-Id")
):
    """Mark milestone as completed"""
    user_id = x_user_id or "default_user"
    progress = await data_store.get_user_progress(user_id, domain_id)

    if milestone_id not in progress.completed_milestones:
        progress.completed_milestones.append(milestone_id)
        progress.overall = min(progress.overall + 5, 100)

        await data_store.update_user_progress(user_id, domain_id, progress)
        await data_store.log_activity(user_id, {
            "type": "milestone_completed",
            "milestone_id": milestone_id,
            "domain_id": domain_id
        })

    return {
        "success": True,
        "message": f"Milestone {milestone_id} completed!",
        "new_progress": progress.overall
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        reload=True
    )
