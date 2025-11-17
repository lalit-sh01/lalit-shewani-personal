import React, { useState } from 'react'
import '../styles/ContentCalendar.css'

const ContentCalendar = ({ view = 'monthly', data = {}, progress = {}, mode = 'panel' }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const sampleContent = data?.content_calendar || {
    upcoming_videos: [
      { id: 1, title: 'Getting Started', status: 'scripting', publish_date: '2024-02-01' },
      { id: 2, title: 'First Tutorial', status: 'ideation', publish_date: '2024-02-08' },
      { id: 3, title: 'Advanced Tips', status: 'recording', publish_date: '2024-02-15' },
    ]
  }

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  return (
    <div className={`content-calendar mode-${mode}`}>
      <div className="calendar-header">
        <h3>📅 Content Calendar</h3>
        <div className="month-navigation">
          <button onClick={handlePrevMonth}>←</button>
          <span className="month-label">
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={handleNextMonth}>→</button>
        </div>
      </div>

      <div className="calendar-container">
        <div className="calendar-weekdays">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="weekday">{day}</div>
          ))}
        </div>

        <div className="calendar-days">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="calendar-day empty" />
          ))}
          {daysArray.map(day => (
            <div key={day} className="calendar-day">
              <div className="day-number">{day}</div>
              {sampleContent.upcoming_videos.some(v => {
                const date = new Date(v.publish_date)
                return date.getDate() === day && date.getMonth() === currentMonth.getMonth()
              }) && (
                <div className="day-event">📹</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="content-pipeline">
        <h4>📊 Content Pipeline</h4>
        <div className="pipeline-items">
          {sampleContent.upcoming_videos.map(video => (
            <div key={video.id} className={`pipeline-item ${video.status}`}>
              <div className="pipeline-title">{video.title}</div>
              <div className="pipeline-status">{video.status}</div>
              <div className="pipeline-date">{new Date(video.publish_date).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ContentCalendar
