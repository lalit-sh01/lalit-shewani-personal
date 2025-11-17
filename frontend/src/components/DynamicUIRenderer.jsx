import React, { useState, useEffect, useMemo, Suspense, lazy } from 'react'
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import './DynamicUIRenderer.css'

// Component imports
const Timeline = lazy(() => import('./universal/Timeline'))
const ProgressTracker = lazy(() => import('./universal/ProgressTracker'))
const SkillTree = lazy(() => import('./domain/SkillTree'))
const ContentCalendar = lazy(() => import('./domain/ContentCalendar'))
const Phases = lazy(() => import('./universal/Phases'))

// Component map
const ComponentMap = {
  timeline: Timeline,
  progress_tracker: ProgressTracker,
  skill_tree: SkillTree,
  content_calendar: ContentCalendar,
  phases: Phases,
  learning_path: () => <div className="component-placeholder">Learning Path</div>,
  analytics_dashboard: () => <div className="component-placeholder">Analytics Dashboard</div>,
  case_study_tracker: () => <div className="component-placeholder">Case Study Tracker</div>,
  trading_simulator: () => <div className="component-placeholder">Trading Simulator</div>,
  risk_dashboard: () => <div className="component-placeholder">Risk Dashboard</div>,
  strategy_builder: () => <div className="component-placeholder">Strategy Builder</div>,
  practice_regimen: () => <div className="component-placeholder">Practice Regimen</div>,
}

const sortByPriority = (a, b) => a.priority - b.priority

const ComponentSkeleton = () => (
  <div className="component-skeleton">
    <div className="skeleton-header" />
    <div className="skeleton-content" />
  </div>
)

const ComponentWrapper = ({ component, mode, userProgress, domainData, onUpdate, isEditMode }) => {
  const Component = ComponentMap[component.id]

  if (!Component) {
    console.warn(`Component ${component.id} not found`)
    return null
  }

  return (
    <div className={`component-wrapper mode-${mode} ${isEditMode ? 'edit-mode' : ''}`} data-component-id={component.id}>
      {isEditMode && (
        <div className="component-controls">
          <button className="control-btn move">⋮⋮</button>
          <button className="control-btn settings">⚙️</button>
          <button className="control-btn hide">👁️</button>
        </div>
      )}
      <Suspense fallback={<ComponentSkeleton />}>
        <Component
          {...component.props}
          progress={userProgress}
          data={domainData}
          onUpdate={onUpdate}
          mode={mode}
        />
      </Suspense>
    </div>
  )
}

const GridLayout = ({ config, children }) => {
  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: config?.columns || 'repeat(12, 1fr)',
    gap: config?.gap || '1rem',
    padding: config?.padding || '1rem',
  }

  return (
    <div className="grid-layout" style={gridStyle}>
      {React.Children.map(children, (child, index) => (
        <div key={index}>
          {child}
        </div>
      ))}
    </div>
  )
}

const StackLayout = ({ config, children }) => {
  const [collapsed, setCollapsed] = useState({})

  return (
    <div className="stack-layout">
      {React.Children.map(children, (child, index) => {
        const componentId = child.props?.['data-component-id']
        const isCollapsed = collapsed[componentId]

        return (
          <div className="stack-item" key={index}>
            {config?.collapsible && (
              <button
                className="collapse-btn"
                onClick={() => setCollapsed(prev => ({
                  ...prev,
                  [componentId]: !prev[componentId]
                }))}
              >
                {isCollapsed ? '▶' : '▼'}
              </button>
            )}
            <div className={`stack-content ${isCollapsed ? 'collapsed' : ''}`}>
              {child}
            </div>
          </div>
        )
      })}
    </div>
  )
}

const LayoutEngine = ({ layout, components, children }) => {
  const layoutType = layout?.type || 'grid'

  switch (layoutType) {
    case 'grid':
      return <GridLayout config={layout}>{children}</GridLayout>
    case 'stack':
      return <StackLayout config={layout}>{children}</StackLayout>
    default:
      return <div className="default-layout">{children}</div>
  }
}

const DynamicUIRenderer = ({ domainId, userId, initialConfig = null }) => {
  const [config, setConfig] = useState(initialConfig)
  const [userProgress, setUserProgress] = useState({})
  const [domainData, setDomainData] = useState({})
  const [context, setContext] = useState({})
  const [isEditMode, setIsEditMode] = useState(false)
  const [viewMode, setViewMode] = useState('standard')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true)
        const response = await fetch(`http://localhost:8000/api/config/${domainId}`, {
          headers: {
            'X-User-Id': userId,
          },
        })

        if (!response.ok) throw new Error('Failed to fetch configuration')

        const data = await response.json()
        setConfig(data.config)
        setUserProgress(data.progress)
        setDomainData(data.domain_data)
        setContext({
          viewport: getViewport(),
          progress: data.progress.overall,
          phase: data.progress.currentPhase,
          ...data.context
        })
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (!initialConfig) {
      fetchConfig()
    }
  }, [domainId, userId, initialConfig])

  useEffect(() => {
    const handleResize = () => {
      setContext(prev => ({
        ...prev,
        viewport: getViewport()
      }))
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const visibleComponents = useMemo(() => {
    if (!config?.components) return []

    let filtered = config.components

    switch (viewMode) {
      case 'compact':
        filtered = filtered.filter(c => c.priority <= 2)
        break
      case 'standard':
        filtered = filtered.filter(c => c.priority <= 3)
        break
      case 'detailed':
        break
      default:
        break
    }

    return filtered.sort(sortByPriority)
  }, [config, viewMode])

  const handleComponentUpdate = (componentId, data) => {
    setDomainData(prev => ({
      ...prev,
      [componentId]: {
        ...prev[componentId],
        ...data
      }
    }))

    fetch(`http://localhost:8000/api/components/${componentId}/update`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-User-Id': userId,
      },
      body: JSON.stringify({ data }),
    }).catch(console.error)
  }

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setConfig(prev => {
        const oldIndex = prev.components.findIndex(c => c.id === active.id)
        const newIndex = prev.components.findIndex(c => c.id === over.id)

        const newComponents = [...prev.components]
        const [movedComponent] = newComponents.splice(oldIndex, 1)
        newComponents.splice(newIndex, 0, movedComponent)

        return {
          ...prev,
          components: newComponents
        }
      })
    }
  }

  if (loading) {
    return (
      <div className="ui-renderer-loading">
        <div className="loading-spinner" />
        <p>Loading your {config?.domain?.name || 'roadmap'}...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="ui-renderer-error">
        <h3>⚠️ Error loading configuration</h3>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    )
  }

  return (
    <div
      className={`dynamic-ui-renderer domain-${domainId} ${isEditMode ? 'edit-mode' : ''}`}
      style={{
        '--primary-color': config?.domain?.colors?.primary,
        '--secondary-color': config?.domain?.colors?.secondary,
        '--accent-color': config?.domain?.colors?.accent,
        '--bg-color': config?.domain?.colors?.background,
      }}
    >
      <header className="renderer-header">
        <div className="domain-info">
          <span className="domain-icon">{config?.domain?.icon}</span>
          <h1>{config?.domain?.name}</h1>
        </div>

        <div className="header-controls">
          <div className="view-mode-selector">
            <button
              className={viewMode === 'compact' ? 'active' : ''}
              onClick={() => setViewMode('compact')}
              title="Compact View"
            >
              ▦
            </button>
            <button
              className={viewMode === 'standard' ? 'active' : ''}
              onClick={() => setViewMode('standard')}
              title="Standard View"
            >
              ▤
            </button>
            <button
              className={viewMode === 'detailed' ? 'active' : ''}
              onClick={() => setViewMode('detailed')}
              title="Detailed View"
            >
              ▣
            </button>
          </div>

          <button
            className="edit-mode-toggle"
            onClick={() => setIsEditMode(!isEditMode)}
          >
            {isEditMode ? '✓ Done' : '✏️ Customize'}
          </button>
        </div>
      </header>

      <main className="renderer-content">
        <DndContext
          sensors={sensors}
          onDragEnd={handleDragEnd}
          disabled={!isEditMode}
        >
          <SortableContext
            items={visibleComponents.map(c => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <LayoutEngine
              layout={config?.layout?.[context.viewport] || config?.layout?.default}
              components={visibleComponents}
            >
              {visibleComponents.map(component => (
                <ComponentWrapper
                  key={component.id}
                  component={component}
                  mode={component.mode}
                  userProgress={userProgress}
                  domainData={domainData[component.id] || domainData}
                  onUpdate={(data) => handleComponentUpdate(component.id, data)}
                  isEditMode={isEditMode}
                  data-component-id={component.id}
                />
              ))}
            </LayoutEngine>
          </SortableContext>
        </DndContext>
      </main>
    </div>
  )
}

const getViewport = () => {
  const width = window.innerWidth
  if (width < 768) return 'mobile'
  if (width < 1024) return 'tablet'
  return 'desktop'
}

export default DynamicUIRenderer
