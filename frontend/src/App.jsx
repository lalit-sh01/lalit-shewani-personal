import React, { useState, useEffect } from 'react'
import './App.css'
import DomainSelector from './components/DomainSelector'
import DynamicUIRenderer from './components/DynamicUIRenderer'

function App() {
  const [selectedDomain, setSelectedDomain] = useState('table_tennis')
  const [domains, setDomains] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDomains()
  }, [])

  const fetchDomains = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/domains')
      const data = await response.json()
      setDomains(data.domains)
    } catch (error) {
      console.error('Error fetching domains:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Dynamic Roadmap Visualizer</h1>
        <p>Adaptive learning paths for your personal growth</p>
      </header>

      <div className="app-content">
        <DomainSelector
          domains={domains}
          selectedDomain={selectedDomain}
          onSelectDomain={setSelectedDomain}
        />

        <main className="app-main">
          <DynamicUIRenderer
            domainId={selectedDomain}
            userId="default_user"
          />
        </main>
      </div>
    </div>
  )
}

export default App
