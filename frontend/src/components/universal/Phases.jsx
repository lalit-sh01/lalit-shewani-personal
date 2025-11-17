import React, { useState } from 'react'
import '../styles/Phases.css'

const Phases = ({ phases = [], data = {}, progress = {} }) => {
  const [expandedPhase, setExpandedPhase] = useState(null)

  const phaseList = data?.phases || [
    { id: 'phase1', name: 'Foundation', description: 'Build basics', status: 'completed' },
    { id: 'phase2', name: 'Development', description: 'Develop skills', status: 'active' },
    { id: 'phase3', name: 'Advanced', description: 'Advanced techniques', status: 'upcoming' },
  ]

  return (
    <div className="phases-component">
      <div className="phases-header">
        <h3>Learning Phases</h3>
        <p>Progress through your learning journey</p>
      </div>

      <div className="phases-list">
        {phaseList.map((phase, index) => (
          <div key={phase.id} className={`phase-item ${phase.status}`}>
            <div className="phase-number">{index + 1}</div>
            <div
              className="phase-content"
              onClick={() => setExpandedPhase(expandedPhase === phase.id ? null : phase.id)}
            >
              <h4>{phase.name}</h4>
              <p>{phase.description}</p>
              {expandedPhase === phase.id && (
                <div className="phase-expanded">
                  <p>More details about this phase...</p>
                </div>
              )}
            </div>
            <div className={`phase-status-badge ${phase.status}`}>
              {phase.status === 'completed' ? '✓' : phase.status === 'active' ? '◆' : '○'}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Phases
