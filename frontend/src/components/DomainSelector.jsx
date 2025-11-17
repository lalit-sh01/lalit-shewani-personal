import React from 'react'
import './DomainSelector.css'

const DomainSelector = ({ domains, selectedDomain, onSelectDomain }) => {
  return (
    <aside className="domain-selector">
      <div className="selector-header">
        <h2>Learning Domains</h2>
        <p>Choose your learning path</p>
      </div>

      <div className="domains-list">
        {domains.map((domain) => (
          <button
            key={domain.id}
            className={`domain-card ${selectedDomain === domain.id ? 'active' : ''}`}
            onClick={() => onSelectDomain(domain.id)}
          >
            <div className="domain-icon">{domain.icon}</div>
            <div className="domain-info">
              <h3>{domain.name}</h3>
              <p className="domain-duration">{domain.typical_duration}</p>
            </div>
          </button>
        ))}
      </div>
    </aside>
  )
}

export default DomainSelector
