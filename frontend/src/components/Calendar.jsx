import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Calendar.css'

function Calendar() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Jharkhand Regional Festivals Data
  const festivals = {
    0: [ // January
      { date: 1, name: "New Year", type: "National" },
      { date: 14, name: "Makar Sankranti", type: "Religious" },
      { date: 26, name: "Republic Day", type: "National" }
    ],
    1: [ // February
      { date: 14, name: "Valentine's Day", type: "Cultural" },
      { date: 19, name: "Shivratri", type: "Religious" }
    ],
    2: [ // March
      { date: 8, name: "Holi", type: "Religious" },
      { date: 22, name: "Bihar Diwas", type: "Regional" }
    ],
    3: [ // April
      { date: 14, name: "Baisakhi", type: "Religious" },
      { date: 15, name: "Good Friday", type: "Religious" },
      { date: 17, name: "Easter", type: "Religious" }
    ],
    4: [ // May
      { date: 1, name: "Labour Day", type: "National" },
      { date: 9, name: "Rabindranath Tagore Jayanti", type: "Cultural" }
    ],
    5: [ // June
      { date: 5, name: "World Environment Day", type: "Environmental" },
      { date: 21, name: "International Yoga Day", type: "Health" }
    ],
    6: [ // July
      { date: 4, name: "Independence Day Preparation", type: "National" },
      { date: 15, name: "Guru Purnima", type: "Religious" }
    ],
    7: [ // August
      { date: 15, name: "Independence Day", type: "National" },
      { date: 19, name: "Raksha Bandhan", type: "Religious" },
      { date: 26, name: "Krishna Janmashtami", type: "Religious" }
    ],
    8: [ // September
      { date: 5, name: "Teachers' Day", type: "Educational" },
      { date: 17, name: "Ganesh Chaturthi", type: "Religious" },
      { date: 28, name: "World Tourism Day", type: "Tourism" }
    ],
    9: [ // October
      { date: 2, name: "Gandhi Jayanti", type: "National" },
      { date: 8, name: "Dussehra", type: "Religious" },
      { date: 12, name: "Durga Puja", type: "Religious" },
      { date: 31, name: "Halloween", type: "Cultural" }
    ],
    10: [ // November
      { date: 1, name: "Diwali", type: "Religious" },
      { date: 4, name: "Bhai Dooj", type: "Religious" },
      { date: 14, name: "Children's Day", type: "Educational" }
    ],
    11: [ // December
      { date: 25, name: "Christmas", type: "Religious" },
      { date: 31, name: "New Year's Eve", type: "Cultural" }
    ]
  }

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay()
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear)
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear)
    const days = []
    const monthFestivals = festivals[selectedMonth] || []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayFestivals = monthFestivals.filter(festival => festival.date === day)
      const hasFestival = dayFestivals.length > 0
      
      days.push(
        <div 
          key={day} 
          className={`calendar-day ${hasFestival ? 'has-festival' : ''}`}
        >
          <span className="day-number">{day}</span>
          {hasFestival && (
            <div className="festival-indicator">
              {dayFestivals.map((festival, index) => (
                <div key={index} className={`festival-dot ${festival.type.toLowerCase()}`}></div>
              ))}
            </div>
          )}
        </div>
      )
    }

    return days
  }

  const getFestivalsForMonth = () => {
    return festivals[selectedMonth] || []
  }

  const navigateMonth = (direction) => {
    if (direction === 'prev') {
      if (selectedMonth === 0) {
        setSelectedMonth(11)
        setSelectedYear(selectedYear - 1)
      } else {
        setSelectedMonth(selectedMonth - 1)
      }
    } else {
      if (selectedMonth === 11) {
        setSelectedMonth(0)
        setSelectedYear(selectedYear + 1)
      } else {
        setSelectedMonth(selectedMonth + 1)
      }
    }
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h1 className="calendar-title">Jharkhand Festival Calendar</h1>
        <p className="calendar-subtitle">Discover the rich cultural heritage and regional festivals of Jharkhand</p>
        <Link to="/" className="back-link">← Back to Home</Link>
      </div>

      <div className="calendar-content">
        <div className="calendar-main">
          <div className="calendar-navigation">
            <button onClick={() => navigateMonth('prev')} className="nav-button">
              ← Previous
            </button>
            <h2 className="current-month">
              {monthNames[selectedMonth]} {selectedYear}
            </h2>
            <button onClick={() => navigateMonth('next')} className="nav-button">
              Next →
            </button>
          </div>

          <div className="calendar-grid">
            <div className="calendar-weekdays">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="weekday">{day}</div>
              ))}
            </div>
            <div className="calendar-days">
              {renderCalendar()}
            </div>
          </div>
        </div>

        <div className="festivals-sidebar">
          <h3>Festivals in {monthNames[selectedMonth]}</h3>
          <div className="festivals-list">
            {getFestivalsForMonth().map((festival, index) => (
              <div key={index} className="festival-item">
                <div className="festival-date">{festival.date}</div>
                <div className="festival-details">
                  <div className="festival-name">{festival.name}</div>
                  <div className={`festival-type ${festival.type.toLowerCase()}`}>
                    {festival.type}
                  </div>
                </div>
              </div>
            ))}
            {getFestivalsForMonth().length === 0 && (
              <div className="no-festivals">No festivals this month</div>
            )}
          </div>

          <div className="legend">
            <h4>Festival Types</h4>
            <div className="legend-items">
              <div className="legend-item">
                <div className="legend-dot religious"></div>
                <span>Religious</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot national"></div>
                <span>National</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot cultural"></div>
                <span>Cultural</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot regional"></div>
                <span>Regional</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Calendar
