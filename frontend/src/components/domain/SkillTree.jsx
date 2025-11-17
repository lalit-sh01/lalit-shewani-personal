import React, { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import '../styles/SkillTree.css'

const SkillTree = ({
  layout = 'hierarchical',
  animated = true,
  categories = [],
  progress = {},
  data = {},
  mode = 'panel'
}) => {
  const [selectedSkill, setSelectedSkill] = useState(null)
  const [viewType, setViewType] = useState('tree')

  // Sample skill tree data
  const skillTree = {
    id: 'root',
    name: 'Skills',
    icon: '🌳',
    children: [
      {
        id: 'skill1',
        name: 'Fundamental Skills',
        icon: '🎯',
        unlocked: true,
        mastered: true,
        progress: 100,
        children: [
          { id: 'skill1a', name: 'Skill 1A', icon: '📚', unlocked: true, progress: 80 },
          { id: 'skill1b', name: 'Skill 1B', icon: '📚', unlocked: true, progress: 100 },
        ]
      },
      {
        id: 'skill2',
        name: 'Advanced Skills',
        icon: '🚀',
        unlocked: true,
        progress: 40,
        children: [
          { id: 'skill2a', name: 'Skill 2A', icon: '🔧', unlocked: true, progress: 50 },
          { id: 'skill2b', name: 'Skill 2B', icon: '🔧', unlocked: false, requirements: ['Complete Skill 2A'] },
        ]
      },
    ]
  }

  const flattenedSkills = useMemo(() => {
    const flatten = (node, depth = 0) => {
      const skills = [{ ...node, depth }]
      if (node.children) {
        node.children.forEach(child => {
          skills.push(...flatten(child, depth + 1))
        })
      }
      return skills
    }
    return flatten(skillTree)
  }, [])

  const totalSkills = flattenedSkills.length
  const unlockedSkills = flattenedSkills.filter(s => s.unlocked).length
  const masteredSkills = flattenedSkills.filter(s => s.mastered).length

  if (mode === 'widget') {
    return (
      <div className="skill-tree-widget">
        <div className="widget-header">
          <h3>🌳 Skill Progress</h3>
        </div>

        <div className="skill-stats">
          <div className="stat-circle">
            <svg viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e0e0e0" strokeWidth="5" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#4CAF50"
                strokeWidth="5"
                strokeDasharray={`${(unlockedSkills / totalSkills) * 283} 283`}
                transform="rotate(-90 50 50)"
              />
              <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="24">
                {Math.round((unlockedSkills / totalSkills) * 100)}%
              </text>
            </svg>
          </div>

          <div className="stat-details">
            <div className="stat-item">
              <span className="stat-value">{unlockedSkills}</span>
              <span className="stat-label">Unlocked</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{masteredSkills}</span>
              <span className="stat-label">Mastered</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'fullwidth') {
    return (
      <div className="skill-tree-fullwidth">
        <div className="tree-header">
          <h2>🌳 Skill Development</h2>
          <div className="view-switcher">
            <button className={viewType === 'tree' ? 'active' : ''} onClick={() => setViewType('tree')}>
              Tree View
            </button>
            <button className={viewType === 'list' ? 'active' : ''} onClick={() => setViewType('list')}>
              List View
            </button>
          </div>
        </div>

        <div className="tree-content">
          {viewType === 'list' && (
            <div className="skill-list">
              <table className="skill-table">
                <thead>
                  <tr>
                    <th>Skill</th>
                    <th>Status</th>
                    <th>Progress</th>
                  </tr>
                </thead>
                <tbody>
                  {flattenedSkills.filter(s => s.name !== 'Skills').map(skill => (
                    <tr key={skill.id} onClick={() => setSelectedSkill(skill)} className={selectedSkill?.id === skill.id ? 'selected' : ''}>
                      <td>
                        <span className="skill-icon">{skill.icon || '📚'}</span>
                        <span>{skill.name}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${skill.mastered ? 'mastered' : skill.unlocked ? 'unlocked' : 'locked'}`}>
                          {skill.mastered ? 'Mastered' : skill.unlocked ? 'In Progress' : 'Locked'}
                        </span>
                      </td>
                      <td>
                        <div className="progress-bar-mini">
                          <div className="progress-fill" style={{ width: `${skill.progress || 0}%` }} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="skill-tree-panel">
      <div className="panel-header">
        <h3>Skill Tree</h3>
        <p>Progress: {unlockedSkills} unlocked, {masteredSkills} mastered</p>
      </div>

      <div className="tree-visualization">
        {flattenedSkills.filter(s => s.name !== 'Skills').map((skill, idx) => (
          <motion.div
            key={skill.id}
            className={`skill-node ${skill.mastered ? 'mastered' : skill.unlocked ? 'unlocked' : 'locked'}`}
            onClick={() => setSelectedSkill(skill)}
            whileHover={{ scale: 1.05 }}
          >
            <div className="skill-icon">{skill.icon || '📚'}</div>
            <div className="skill-name">{skill.name}</div>
          </motion.div>
        ))}
      </div>

      {selectedSkill && (
        <div className="skill-details-panel">
          <h4>{selectedSkill.name}</h4>
          {selectedSkill.unlocked && !selectedSkill.mastered && (
            <div className="skill-progress">
              <span>Progress: {selectedSkill.progress || 0}%</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${selectedSkill.progress || 0}%` }} />
              </div>
            </div>
          )}
          {!selectedSkill.unlocked && (
            <div className="skill-locked">
              <p>🔒 Locked</p>
              <p>{selectedSkill.requirements?.join(', ')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SkillTree
