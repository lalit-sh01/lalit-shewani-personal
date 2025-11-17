import React from 'react'
import { motion } from 'framer-motion'
import '../styles/ProgressTracker.css'

const ProgressTracker = ({ variant = 'circular', showStats = true, progress = {}, metrics = [] }) => {
  const overallProgress = progress?.overall || 0

  if (variant === 'circular') {
    const circumference = 2 * Math.PI * 45
    const strokeDashoffset = circumference - (overallProgress / 100) * circumference

    return (
      <div className="progress-tracker circular">
        <div className="progress-container">
          <svg className="progress-circle" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" className="progress-background" />
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              className="progress-fill"
              style={{ strokeDashoffset }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </svg>
          <div className="progress-text">
            <span className="progress-value">{Math.round(overallProgress)}%</span>
            <span className="progress-label">Complete</span>
          </div>
        </div>

        {showStats && (
          <div className="progress-stats">
            <div className="stat">
              <span className="stat-label">Phase</span>
              <span className="stat-value">{progress?.currentPhase || 'Phase 1'}</span>
            </div>
            <div className="stat">
              <span className="stat-label">Streak</span>
              <span className="stat-value">{progress?.streakDays || 0} days</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="progress-tracker linear">
      <div className="progress-header">
        <h3>Progress</h3>
        <span className="progress-percentage">{Math.round(overallProgress)}%</span>
      </div>
      <div className="progress-bar-container">
        <motion.div
          className="progress-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${overallProgress}%` }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  )
}

export default ProgressTracker
