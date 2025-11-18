export interface Phase {
  id: string;
  title: string;
  start: string;
  end: string;
  progress: number;
}

export interface KPI {
  id: string;
  title: string;
  value: string;
}

export interface UpcomingMilestone {
  title: string;
  due: string;
  progress: number;
}

export interface Task {
  id: string;
  title: string;
  done: boolean;
}

export interface MilestoneDetail {
  title: string;
  due: string;
  resources: string[];
}

export interface Item {
  id: string;
  title: string;
  due: string;
  type: 'task' | 'milestone';
}

export interface Lane {
  id: string;
  title: string;
  items: Item[];
}

export interface DashboardData {
  title: string;
  motivation: string;
  phases: Phase[];
  kpis: KPI[];
  upcoming: UpcomingMilestone;
}

export interface TimelineData {
  title: string;
  lanes: Lane[];
  milestone: MilestoneDetail;
  initialTasks: Task[];
}

// Sample Dashboard Data
export const dashboardData: DashboardData = {
  title: "Full-Stack Development Mastery",
  motivation: "Build production-ready applications and master modern web technologies",
  phases: [
    {
      id: "p1",
      title: "Foundation Phase",
      start: "Jan 2025",
      end: "Mar 2025",
      progress: 75
    },
    {
      id: "p2",
      title: "Advanced Concepts",
      start: "Apr 2025",
      end: "Jun 2025",
      progress: 40
    },
    {
      id: "p3",
      title: "Real-World Projects",
      start: "Jul 2025",
      end: "Sep 2025",
      progress: 15
    },
    {
      id: "p4",
      title: "Production & Deployment",
      start: "Oct 2025",
      end: "Dec 2025",
      progress: 0
    }
  ],
  kpis: [
    {
      id: "k1",
      title: "Weekly Practice Hours",
      value: "52%"
    },
    {
      id: "k2",
      title: "Projects Completed",
      value: "12/20"
    },
    {
      id: "k3",
      title: "Skills Acquired",
      value: "28"
    }
  ],
  upcoming: {
    title: "Build REST API with Authentication",
    due: "Dec 25, 2025",
    progress: 60
  }
};

// Sample Timeline Data
export const timelineData: TimelineData = {
  title: "Q4 2025 Roadmap",
  lanes: [
    {
      id: "l1",
      title: "Backend Development",
      items: [
        {
          id: "i1",
          title: "REST API Design",
          due: "Nov 30",
          type: "task"
        },
        {
          id: "i2",
          title: "Database Schema",
          due: "Dec 5",
          type: "task"
        },
        {
          id: "i3",
          title: "Auth Implementation",
          due: "Dec 15",
          type: "milestone"
        }
      ]
    },
    {
      id: "l2",
      title: "Frontend Development",
      items: [
        {
          id: "i4",
          title: "Component Library",
          due: "Nov 28",
          type: "task"
        },
        {
          id: "i5",
          title: "State Management",
          due: "Dec 10",
          type: "task"
        },
        {
          id: "i6",
          title: "UI/UX Polish",
          due: "Dec 20",
          type: "milestone"
        }
      ]
    },
    {
      id: "l3",
      title: "DevOps & Testing",
      items: [
        {
          id: "i7",
          title: "Unit Tests Setup",
          due: "Dec 1",
          type: "task"
        },
        {
          id: "i8",
          title: "CI/CD Pipeline",
          due: "Dec 12",
          type: "task"
        },
        {
          id: "i9",
          title: "Deployment Ready",
          due: "Dec 25",
          type: "milestone"
        }
      ]
    }
  ],
  milestone: {
    title: "Build REST API with Authentication",
    due: "December 25, 2025",
    resources: [
      "Node.js & Express Documentation",
      "JWT Authentication Guide",
      "PostgreSQL Tutorial",
      "API Security Best Practices"
    ]
  },
  initialTasks: [
    {
      id: "t1",
      title: "Set up Express server",
      done: true
    },
    {
      id: "t2",
      title: "Configure database connection",
      done: true
    },
    {
      id: "t3",
      title: "Implement user registration",
      done: false
    },
    {
      id: "t4",
      title: "Add JWT authentication",
      done: false
    },
    {
      id: "t5",
      title: "Create protected routes",
      done: false
    },
    {
      id: "t6",
      title: "Write API documentation",
      done: false
    }
  ]
};
