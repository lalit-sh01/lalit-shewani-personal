"""
Domain Configuration System for Roadmap Visualizer
Defines how each domain (TT, YouTube, Trading, etc.) configures its UI
"""

from typing import Dict, List, Optional, Any
from dataclasses import dataclass, field
from enum import Enum
import json


class ComponentPriority(Enum):
    CRITICAL = 1  # Always show
    HIGH = 2      # Show in standard view
    MEDIUM = 3    # Show in expanded view
    LOW = 4       # Show in detailed view


class DisplayMode(Enum):
    WIDGET = "widget"      # Compact card
    PANEL = "panel"        # Medium section
    FULLWIDTH = "fullwidth"  # Full width section
    MODAL = "modal"        # Popup/overlay


@dataclass
class ComponentConfig:
    """Configuration for a single UI component"""
    component_id: str
    display_mode: DisplayMode
    priority: ComponentPriority
    enabled: bool = True
    position: Optional[str] = None
    props: Dict[str, Any] = field(default_factory=dict)
    visibility_rules: Dict[str, Any] = field(default_factory=dict)
    variants: Dict[str, Any] = field(default_factory=dict)

    def should_render(self, context: Dict) -> bool:
        """Determine if component should render based on rules"""
        if not self.enabled:
            return False

        for rule_key, rule_value in self.visibility_rules.items():
            if rule_key == "min_progress" and context.get("progress", 0) < rule_value:
                return False
            if rule_key == "max_progress" and context.get("progress", 0) > rule_value:
                return False
            if rule_key == "phase" and context.get("phase") not in rule_value:
                return False
            if rule_key == "has_data" and not context.get(rule_value):
                return False

        return True


@dataclass
class DomainConfig:
    """Complete configuration for a domain/roadmap type"""
    domain_id: str
    name: str
    description: str
    icon: str
    color_scheme: Dict[str, str]

    components: List[ComponentConfig]
    layout: Dict[str, Any] = field(default_factory=dict)
    settings: Dict[str, Any] = field(default_factory=dict)
    skill_tree: Optional[Dict] = None
    kpis: List[Dict] = field(default_factory=list)
    time_patterns: Dict[str, Any] = field(default_factory=dict)

    def get_components_for_context(self, context: Dict) -> List[ComponentConfig]:
        """Get components that should render for current context"""
        return [c for c in self.components if c.should_render(context)]

    def get_layout_for_viewport(self, viewport: str) -> Dict:
        """Get layout config for viewport size"""
        return self.layout.get(viewport, self.layout.get("default", {}))


# Domain Configuration Factory
class DomainConfigFactory:
    """Factory for creating domain configurations"""

    @staticmethod
    def create_table_tennis_config() -> DomainConfig:
        return DomainConfig(
            domain_id="table_tennis",
            name="Table Tennis Mastery",
            description="Learn and master table tennis skills",
            icon="🏓",
            color_scheme={
                "primary": "#FF6B35",
                "secondary": "#F7931E",
                "accent": "#C1440E",
                "background": "#FFF5F0"
            },
            components=[
                ComponentConfig(
                    component_id="timeline",
                    display_mode=DisplayMode.FULLWIDTH,
                    priority=ComponentPriority.CRITICAL,
                    props={"showMilestones": True, "interactive": True}
                ),
                ComponentConfig(
                    component_id="progress_tracker",
                    display_mode=DisplayMode.WIDGET,
                    priority=ComponentPriority.CRITICAL,
                    position="top-right",
                    props={"variant": "circular", "showStats": True}
                ),
                ComponentConfig(
                    component_id="phases",
                    display_mode=DisplayMode.PANEL,
                    priority=ComponentPriority.HIGH,
                    props={
                        "phases": ["Beginner", "Intermediate", "Advanced", "Expert"],
                        "descriptions": {
                            "Beginner": "Master grip, stance, basic strokes",
                            "Intermediate": "Develop spin, footwork, tactics",
                            "Advanced": "Competition ready, advanced techniques",
                            "Expert": "Tournament level, coaching capability"
                        }
                    }
                ),
                ComponentConfig(
                    component_id="skill_tree",
                    display_mode=DisplayMode.FULLWIDTH,
                    priority=ComponentPriority.HIGH,
                    props={
                        "layout": "hierarchical",
                        "animated": True,
                        "categories": ["Technical", "Physical", "Mental", "Tactical"]
                    }
                ),
                ComponentConfig(
                    component_id="practice_regimen",
                    display_mode=DisplayMode.PANEL,
                    priority=ComponentPriority.HIGH,
                    props={
                        "showDrills": True,
                        "trackSessions": True,
                        "suggestPartners": True
                    }
                ),
            ],
            layout={
                "desktop": {
                    "grid": "12-column",
                    "areas": {
                        "header": "span 12",
                        "timeline": "span 12",
                        "main": "span 8",
                        "sidebar": "span 4"
                    }
                },
                "mobile": {
                    "stack": True,
                    "collapsible": True
                }
            },
            kpis=[
                {"id": "serve_accuracy", "name": "Serve Accuracy", "unit": "%", "target": 80},
                {"id": "rally_length", "name": "Avg Rally Length", "unit": "shots", "target": 15},
            ],
            time_patterns={
                "typical_duration": "6-24 months",
                "practice_frequency": "3-5 times/week",
                "session_length": "60-90 minutes",
                "milestone_intervals": "2-4 weeks"
            }
        )

    @staticmethod
    def create_youtube_creator_config() -> DomainConfig:
        return DomainConfig(
            domain_id="youtube_creator",
            name="YouTube Creator Journey",
            description="Build and grow a successful YouTube channel",
            icon="📹",
            color_scheme={
                "primary": "#FF0000",
                "secondary": "#282828",
                "accent": "#FFFFFF",
                "background": "#F9F9F9"
            },
            components=[
                ComponentConfig(
                    component_id="timeline",
                    display_mode=DisplayMode.FULLWIDTH,
                    priority=ComponentPriority.CRITICAL,
                    props={"variant": "content-calendar", "showPublishDates": True}
                ),
                ComponentConfig(
                    component_id="progress_tracker",
                    display_mode=DisplayMode.WIDGET,
                    priority=ComponentPriority.CRITICAL,
                    props={"metrics": ["videos_published", "total_views", "subscribers"]}
                ),
                ComponentConfig(
                    component_id="content_calendar",
                    display_mode=DisplayMode.FULLWIDTH,
                    priority=ComponentPriority.CRITICAL,
                    props={
                        "view": "monthly",
                        "showIdeas": True,
                        "trackProduction": True
                    }
                ),
                ComponentConfig(
                    component_id="analytics_dashboard",
                    display_mode=DisplayMode.PANEL,
                    priority=ComponentPriority.HIGH,
                    visibility_rules={"has_data": "channel_id"},
                    props={
                        "metrics": ["views", "watch_time", "ctr", "retention"],
                        "period": "last_30_days"
                    }
                ),
            ],
            kpis=[
                {"id": "upload_consistency", "name": "Upload Consistency", "unit": "videos/week", "target": 2},
                {"id": "avg_retention", "name": "Avg Retention", "unit": "%", "target": 50},
            ],
            time_patterns={
                "typical_duration": "12-36 months",
                "upload_frequency": "1-3 times/week",
                "production_cycle": "3-7 days/video",
            }
        )

    @staticmethod
    def create_ai_pm_config() -> DomainConfig:
        return DomainConfig(
            domain_id="ai_pm",
            name="AI Product Manager Skills",
            description="Master AI/ML product management",
            icon="🤖",
            color_scheme={
                "primary": "#6B46C1",
                "secondary": "#9333EA",
                "accent": "#A855F7",
                "background": "#FAF5FF"
            },
            components=[
                ComponentConfig(
                    component_id="learning_path",
                    display_mode=DisplayMode.FULLWIDTH,
                    priority=ComponentPriority.CRITICAL,
                    props={
                        "tracks": ["Technical", "Product", "Business"],
                        "showPrerequisites": True
                    }
                ),
                ComponentConfig(
                    component_id="skill_tree",
                    display_mode=DisplayMode.PANEL,
                    priority=ComponentPriority.HIGH,
                    props={
                        "categories": ["ML Fundamentals", "Data Strategy", "Ethics"],
                    }
                ),
                ComponentConfig(
                    component_id="case_study_tracker",
                    display_mode=DisplayMode.PANEL,
                    priority=ComponentPriority.HIGH,
                    props={
                        "categories": ["NLP", "Computer Vision", "RecSys", "GenAI"],
                        "trackCompletion": True
                    }
                ),
            ],
            kpis=[
                {"id": "concepts_mastered", "name": "Concepts Mastered", "unit": "count", "target": 50},
                {"id": "projects_completed", "name": "Projects Completed", "unit": "count", "target": 5},
            ],
            time_patterns={
                "typical_duration": "6-12 months",
                "study_frequency": "daily",
                "project_cycle": "2-4 weeks",
            }
        )

    @staticmethod
    def create_stock_trading_config() -> DomainConfig:
        return DomainConfig(
            domain_id="stock_trading",
            name="Stock Trading Mastery",
            description="Learn systematic trading and risk management",
            icon="📈",
            color_scheme={
                "primary": "#10B981",
                "secondary": "#059669",
                "accent": "#F59E0B",
                "background": "#F0FDF4"
            },
            components=[
                ComponentConfig(
                    component_id="trading_simulator",
                    display_mode=DisplayMode.FULLWIDTH,
                    priority=ComponentPriority.CRITICAL,
                    props={
                        "startingCapital": 10000,
                        "allowShort": False,
                        "trackPnL": True
                    }
                ),
                ComponentConfig(
                    component_id="risk_dashboard",
                    display_mode=DisplayMode.PANEL,
                    priority=ComponentPriority.CRITICAL,
                    props={
                        "metrics": ["var", "sharpe", "max_drawdown", "win_rate"],
                        "alertThresholds": True
                    }
                ),
                ComponentConfig(
                    component_id="strategy_builder",
                    display_mode=DisplayMode.PANEL,
                    priority=ComponentPriority.HIGH,
                    visibility_rules={"min_progress": 20},
                    props={
                        "types": ["Momentum", "Mean Reversion", "Breakout", "Value"],
                        "backtesting": True
                    }
                ),
            ],
            kpis=[
                {"id": "win_rate", "name": "Win Rate", "unit": "%", "target": 55},
                {"id": "risk_reward", "name": "Risk/Reward", "unit": "ratio", "target": 2.5},
            ],
            time_patterns={
                "typical_duration": "12-36 months",
                "practice_mode": "3-6 months paper trading",
                "market_hours": "9:30 AM - 4:00 PM EST",
                "review_cycle": "weekly"
            }
        )


# Component Registry
class ComponentRegistry:
    """Registry of all available UI components"""

    def __init__(self):
        self.components = {}
        self._register_default_components()

    def _register_default_components(self):
        """Register all default components"""
        universal_components = [
            {
                "id": "timeline",
                "type": "universal",
                "name": "Timeline View",
                "description": "Visual timeline with phases and milestones",
            },
            {
                "id": "progress_tracker",
                "type": "universal",
                "name": "Progress Tracker",
                "description": "Overall progress visualization",
            },
            {
                "id": "phases",
                "type": "universal",
                "name": "Phase Navigator",
                "description": "Navigate between journey phases"
            },
            {
                "id": "milestones",
                "type": "universal",
                "name": "Milestones",
                "description": "Key achievement points"
            },
            {
                "id": "tasks",
                "type": "universal",
                "name": "Task Manager",
                "description": "Actionable tasks and todos"
            },
        ]

        domain_components = [
            {"id": "skill_tree", "type": "domain", "domains": ["table_tennis", "ai_pm"]},
            {"id": "practice_regimen", "type": "domain", "domains": ["table_tennis"]},
            {"id": "content_calendar", "type": "domain", "domains": ["youtube_creator"]},
            {"id": "analytics_dashboard", "type": "domain", "domains": ["youtube_creator"]},
            {"id": "learning_path", "type": "domain", "domains": ["ai_pm"]},
            {"id": "case_study_tracker", "type": "domain", "domains": ["ai_pm"]},
            {"id": "trading_simulator", "type": "domain", "domains": ["stock_trading"]},
            {"id": "risk_dashboard", "type": "domain", "domains": ["stock_trading"]},
            {"id": "strategy_builder", "type": "domain", "domains": ["stock_trading"]},
        ]

        for comp in universal_components:
            self.components[comp["id"]] = comp

        for comp in domain_components:
            self.components[comp["id"]] = comp

    def get_component(self, component_id: str) -> Optional[Dict]:
        return self.components.get(component_id)

    def get_components_for_domain(self, domain_id: str) -> List[Dict]:
        """Get all components applicable to a domain"""
        result = []
        for comp in self.components.values():
            if comp["type"] == "universal":
                result.append(comp)
            elif comp["type"] == "domain" and domain_id in comp.get("domains", []):
                result.append(comp)
        return result


# Configuration Manager
class ConfigurationManager:
    """Manages domain configurations and component registry"""

    def __init__(self):
        self.registry = ComponentRegistry()
        self.configs = {}
        self._load_default_configs()

    def _load_default_configs(self):
        """Load default domain configurations"""
        factory = DomainConfigFactory()
        self.configs["table_tennis"] = factory.create_table_tennis_config()
        self.configs["youtube_creator"] = factory.create_youtube_creator_config()
        self.configs["ai_pm"] = factory.create_ai_pm_config()
        self.configs["stock_trading"] = factory.create_stock_trading_config()

    def get_config(self, domain_id: str) -> Optional[DomainConfig]:
        return self.configs.get(domain_id)

    def get_rendered_config(self, domain_id: str, context: Dict) -> Dict:
        """Get configuration ready for UI rendering"""
        config = self.get_config(domain_id)
        if not config:
            return {}

        components = config.get_components_for_context(context)
        viewport = context.get("viewport", "desktop")
        layout = config.get_layout_for_viewport(viewport)

        return {
            "domain": {
                "id": config.domain_id,
                "name": config.name,
                "icon": config.icon,
                "colors": config.color_scheme
            },
            "components": [
                {
                    "id": c.component_id,
                    "mode": c.display_mode.value,
                    "priority": c.priority.value,
                    "props": c.props,
                    "position": c.position
                }
                for c in components
            ],
            "layout": layout,
            "kpis": config.kpis,
            "settings": config.settings
        }

    def create_custom_config(self, base_domain: str, customizations: Dict) -> DomainConfig:
        """Create a custom configuration based on a template"""
        base_config = self.get_config(base_domain)
        if not base_config:
            raise ValueError(f"Unknown base domain: {base_domain}")

        import copy
        custom_config = copy.deepcopy(base_config)

        if "kpis" in customizations:
            custom_config.kpis = customizations["kpis"]

        if "settings" in customizations:
            custom_config.settings.update(customizations["settings"])

        return custom_config
