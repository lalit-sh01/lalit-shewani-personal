import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import '../styles/Timeline.css'

const Timeline = ({
  showMilestones = true,
  interactive = true,
  variant = 'horizontal',
  progress = {},
  data = {},
  onUpdate,
  mode = 'panel'
}) => {
  const [selectedPhase, setSelectedPhase] = useState(null)
  const [hoveredMilestone, setHoveredMilestone] = useState(null)
  const [timelineData, setTimelineData] = useState([])
  const containerRef = useRef(null)

  useEffect(() => {
    const phases = data?.phases || [
      { id: 'phase1', name: 'Foundation', startWeek: 0, endWeek: 4, status: 'completed' },
      { id: 'phase2', name: 'Development', startWeek: 4, endWeek: 12, status: 'active' },
      { id: 'phase3', name: 'Advanced', startWeek: 12, endWeek: 20, status: 'upcoming' },
      { id: 'phase4', name: 'Mastery', startWeek: 20, endWeek: 28, status: 'upcoming' }
    ]

    const milestones = data?.milestones || [
      { id: 'm1', name: 'First Milestone', week: 2, phase: 'phase1', completed: true },
      { id: 'm2', name: 'Key Achievement', week: 6, phase: 'phase2', completed: true },
      { id: 'm3', name: 'Major Goal', week: 10, phase: 'phase2', completed: false },
      { id: 'm4', name: 'Expert Level', week: 24, phase: 'phase4', completed: false }
    ]

    setTimelineData({ phases, milestones })
  }, [data])

  const overallProgress = progress?.overall || 35
  const currentWeek = Math.floor((overallProgress / 100) * 28)

  const renderContent = () => {
    switch (mode) {
      case 'widget':
        return <TimelineWidget {...{ timelineData, overallProgress, currentWeek }} />
      case 'fullwidth':
        return <TimelineFullWidth {...{
          timelineData,
          overallProgress,
          currentWeek,
          interactive,
          showMilestones,
          selectedPhase,
          setSelectedPhase,
          hoveredMilestone,
          setHoveredMilestone,
          onUpdate
        }} />
      case 'panel':
      default:
        return <TimelinePanel {...{
          timelineData,
          overallProgress,
          currentWeek,
          interactive,
          showMilestones,
          variant
        }} />
    }
  }

  return (
    <div className={`timeline-component mode-${mode} variant-${variant}`} ref={containerRef}>
      {renderContent()}
    </div>
  )
}

const TimelineWidget = ({ timelineData, overallProgress, currentWeek }) => {
  return (
    <div className="timeline-widget">
      <div className="widget-header">
        <h3>Journey Progress</h3>
        <span className="progress-badge">{Math.round(overallProgress)}%</span>
      </div>
      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${overallProgress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
      <div className="widget-stats">
        <div className="stat">
          <span className="label">Current Phase</span>
          <span className="value">
            {timelineData.phases?.find(p => p.status === 'active')?.name || 'Starting'}
          </span>
        </div>
        <div className="stat">
          <span className="label">Week</span>
          <span className="value">{currentWeek} / 28</span>
        </div>
      </div>
    </div>
  )
}

const TimelinePanel = ({ timelineData, overallProgress, currentWeek, interactive, showMilestones, variant }) => {
  const isVertical = variant === 'vertical'

  return (
    <div className={`timeline-panel ${isVertical ? 'vertical' : 'horizontal'}`}>
      <div className="panel-header">
        <h3>Timeline Overview</h3>
        <div className="timeline-controls">
          <button className="control-btn">📅 Calendar</button>
          <button className="control-btn">📊 Analytics</button>
        </div>
      </div>

      <div className="timeline-track">
        {timelineData.phases?.map((phase) => {
          const phaseWidth = ((phase.endWeek - phase.startWeek) / 28) * 100
          const phaseLeft = (phase.startWeek / 28) * 100
          const isActive = phase.status === 'active'

          return (
            <motion.div
              key={phase.id}
              className={`phase-block ${phase.status}`}
              style={isVertical ? {
                height: `${phaseWidth}%`,
                top: `${phaseLeft}%`
              } : {
                width: `${phaseWidth}%`,
                left: `${phaseLeft}%`
              }}
              whileHover={interactive ? { scale: 1.02 } : {}}
            >
              <div className="phase-content">
                <h4>{phase.name}</h4>
                <span className="phase-duration">
                  Weeks {phase.startWeek + 1}-{phase.endWeek}
                </span>
              </div>
              {isActive && (
                <motion.div
                  className="active-indicator"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
            </motion.div>
          )
        })}

        <motion.div
          className="progress-indicator"
          style={isVertical ? {
            top: `${(currentWeek / 28) * 100}%`
          } : {
            left: `${(currentWeek / 28) * 100}%`
          }}
        >
          <div className="indicator-line" />
          <div className="indicator-dot" />
        </motion.div>

        {showMilestones && timelineData.milestones?.map(milestone => {
          const position = (milestone.week / 28) * 100
          return (
            <motion.div
              key={milestone.id}
              className={`milestone ${milestone.completed ? 'completed' : 'pending'}`}
              style={isVertical ? {
                top: `${position}%`
              } : {
                left: `${position}%`
              }}
              whileHover={{ scale: 1.2 }}
              title={milestone.name}
            >
              {milestone.completed ? '✅' : '🎯'}
            </motion.div>
          )
        })}
      </div>

      <div className="timeline-legend">
        <div className="legend-item">
          <span className="legend-color completed" />
          <span>Completed</span>
        </div>
        <div className="legend-item">
          <span className="legend-color active" />
          <span>Active</span>
        </div>
        <div className="legend-item">
          <span className="legend-color upcoming" />
          <span>Upcoming</span>
        </div>
      </div>
    </div>
  )
}

const TimelineFullWidth = ({
  timelineData,
  overallProgress,
  currentWeek,
  interactive,
  showMilestones,
  selectedPhase,
  setSelectedPhase,
  hoveredMilestone,
  setHoveredMilestone,
  onUpdate
}) => {
  const [viewMode, setViewMode] = useState('timeline')

  return (
    <div className="timeline-fullwidth">
      <div className="timeline-header">
        <div className="header-info">
          <h2>Journey Timeline</h2>
          <p>Track your progress through each phase of your learning journey</p>
        </div>

        <div className="view-switcher">
          <button
            className={viewMode === 'timeline' ? 'active' : ''}
            onClick={() => setViewMode('timeline')}
          >
            Timeline
          </button>
          <button
            className={viewMode === 'gantt' ? 'active' : ''}
            onClick={() => setViewMode('gantt')}
          >
            Gantt Chart
          </button>
          <button
            className={viewMode === 'calendar' ? 'active' : ''}
            onClick={() => setViewMode('calendar')}
          >
            Calendar
          </button>
        </div>
      </div>

      <div className="timeline-main">
        {viewMode === 'timeline' && (
          <div className="interactive-timeline">
            <svg className="timeline-svg" viewBox="0 0 1000 200">
              <defs>
                <pattern id="grid" width="35.7" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 35.7 0 L 0 0 0 20" fill="none" stroke="#e0e0e0" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="1000" height="200" fill="url(#grid)" />

              {timelineData.phases?.map((phase) => {
                const x = (phase.startWeek / 28) * 1000
                const width = ((phase.endWeek - phase.startWeek) / 28) * 1000
                const isSelected = selectedPhase === phase.id

                return (
                  <g key={phase.id}>
                    <rect
                      x={x}
                      y="60"
                      width={width}
                      height="80"
                      rx="4"
                      className={`phase-rect ${phase.status} ${isSelected ? 'selected' : ''}`}
                      onClick={() => interactive && setSelectedPhase(phase.id)}
                      style={{ cursor: interactive ? 'pointer' : 'default' }}
                    />
                    <text x={x + width/2} y="100" textAnchor="middle" className="phase-label">
                      {phase.name}
                    </text>
                    <text x={x + width/2} y="120" textAnchor="middle" className="phase-weeks">
                      Weeks {phase.startWeek + 1}-{phase.endWeek}
                    </text>
                  </g>
                )
              })}

              <line
                x1="0"
                y1="100"
                x2={(currentWeek / 28) * 1000}
                y2="100"
                stroke="#4CAF50"
                strokeWidth="4"
                strokeLinecap="round"
              />

              <circle
                cx={(currentWeek / 28) * 1000}
                cy="100"
                r="8"
                fill="#4CAF50"
                className="current-position"
              >
                <animate attributeName="r" values="8;12;8" dur="2s" repeatCount="indefinite" />
              </circle>

              {showMilestones && timelineData.milestones?.map(milestone => {
                const x = (milestone.week / 28) * 1000
                const isHovered = hoveredMilestone === milestone.id

                return (
                  <g
                    key={milestone.id}
                    onMouseEnter={() => setHoveredMilestone(milestone.id)}
                    onMouseLeave={() => setHoveredMilestone(null)}
                  >
                    <circle
                      cx={x}
                      cy="100"
                      r={isHovered ? "8" : "6"}
                      className={`milestone-dot ${milestone.completed ? 'completed' : 'pending'}`}
                      style={{ cursor: 'pointer' }}
                    />
                  </g>
                )
              })}
            </svg>

            <AnimatePresence>
              {selectedPhase && (
                <motion.div
                  className="phase-details"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                >
                  <button
                    className="close-btn"
                    onClick={() => setSelectedPhase(null)}
                  >
                    ×
                  </button>
                  <h3>{timelineData.phases.find(p => p.id === selectedPhase)?.name}</h3>
                  <div className="phase-info">
                    <p>Key objectives and goals for this phase</p>
                    <ul>
                      <li>Objective 1</li>
                      <li>Objective 2</li>
                      <li>Objective 3</li>
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {viewMode === 'gantt' && (
          <div className="gantt-view">
            <p>Gantt chart view coming soon...</p>
          </div>
        )}

        {viewMode === 'calendar' && (
          <div className="calendar-view">
            <p>Calendar view coming soon...</p>
          </div>
        )}
      </div>

      <div className="timeline-footer">
        <div className="progress-summary">
          <div className="summary-item">
            <span className="label">Overall Progress</span>
            <span className="value">{Math.round(overallProgress)}%</span>
          </div>
          <div className="summary-item">
            <span className="label">Current Week</span>
            <span className="value">{currentWeek} of 28</span>
          </div>
          <div className="summary-item">
            <span className="label">Milestones Completed</span>
            <span className="value">
              {timelineData.milestones?.filter(m => m.completed).length} / {timelineData.milestones?.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Timeline
