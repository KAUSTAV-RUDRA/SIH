import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
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
      days.push(<div key={`empty-${i}`} className="home-calendar-day empty"></div>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayFestivals = monthFestivals.filter(festival => festival.date === day)
      const hasFestival = dayFestivals.length > 0
      
      days.push(
        <div 
          key={day} 
          className={`home-calendar-day ${hasFestival ? 'has-festival' : ''}`}
        >
          <span className="home-day-number">{day}</span>
          {hasFestival && (
            <div className="home-festival-indicator">
              {dayFestivals.slice(0, 3).map((festival, index) => (
                <div key={index} className={`home-festival-dot ${festival.type.toLowerCase()}`}>
                  {festival.name}
                </div>
              ))}
              {dayFestivals.length > 3 && (
                <div className="home-festival-dot more-events">
                  +{dayFestivals.length - 3} more
                </div>
              )}
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
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Welcome to <span className="gradient-text">Jharkhand</span>
          </h1>
          <p className="hero-subtitle">
            Discover the natural beauty and cultural heritage of India's mineral-rich state
          </p>
          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">24</div>
              <div className="stat-label">Districts</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">40%</div>
              <div className="stat-label">Forest Cover</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">32</div>
              <div className="stat-label">Tribes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2 className="section-title">Explore Jharkhand</h2>
        <p className="section-subtitle">Choose your adventure and discover the wonders of this beautiful state</p>
        
        <div className="navigation-cards">
          <Link to="/page-a" className="nav-card card-a">
            <div className="card-icon">📊</div>
            <div className="card-content">
              <h3>Smart Travel Chatbot</h3>
              <p>Get tourist information about attractions, routes, and nearby facilities.</p>
              <div className="card-features">
                <span className="feature-tag">Virtual Tour Guide</span>
                <span className="feature-tag">Travel Planner</span>
                <span className="feature-tag">24/7 Assistance</span>
              </div>
            </div>
            <div className="card-arrow">→</div>
          </Link>
          
          <Link to="/page-b" className="nav-card card-b">
            <div className="card-icon">🗺️</div>
            <div className="card-content">
              <h3>Interactive Maps</h3>
              <p>Navigate through interactive maps showcasing Jharkhand's geography, tourist destinations, and infrastructure</p>
              <div className="card-features">
                <span className="feature-tag">Tourism</span>
                <span className="feature-tag">Geography</span>
                <span className="feature-tag">Routes</span>
              </div>
            </div>
            <div className="card-arrow">→</div>
          </Link>
          
          <Link to="/page-c" className="nav-card card-c">
            <div className="card-icon">🥽</div>
            <div className="card-content">
              <h3>Virtual Reality Tour</h3>
              <p>Immerse yourself in a stunning VR experience of Jharkhand's waterfalls and natural landscapes</p>
              <div className="card-features">
                <span className="feature-tag">360° View</span>
                <span className="feature-tag">VR/AR</span>
                <span className="feature-tag">Immersive</span>
              </div>
            </div>
            <div className="card-arrow">→</div>
          </Link>
          
          <Link to="/calendar" className="nav-card card-d">
            <div className="card-icon">📅</div>
            <div className="card-content">
              <h3>Festival Calendar</h3>
              <p>Explore Jharkhand's rich cultural heritage through regional festivals and celebrations throughout the year</p>
              <div className="card-features">
                <span className="feature-tag">Festivals</span>
                <span className="feature-tag">Cultural</span>
                <span className="feature-tag">Events</span>
              </div>
            </div>
            <div className="card-arrow">→</div>
          </Link>
        </div>
      </div>

      {/* Festival Calendar Section */}
      <div className="calendar-section">
        <div className="calendar-section-content">
          <h2 className="calendar-section-title">Jharkhand Festival Calendar</h2>
          <p className="calendar-section-subtitle">Discover the rich cultural heritage through regional festivals and celebrations</p>
          
          <div className="home-calendar-container">
            <div className="home-calendar-main">
              <div className="home-calendar-navigation">
                <button onClick={() => navigateMonth('prev')} className="home-nav-button">
                  ← Previous
                </button>
                <h3 className="home-current-month">
                  {monthNames[selectedMonth]} {selectedYear}
                </h3>
                <button onClick={() => navigateMonth('next')} className="home-nav-button">
                  Next →
                </button>
              </div>

              <div className="home-calendar-grid">
                <div className="home-calendar-weekdays">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="home-weekday">{day}</div>
                  ))}
                </div>
                <div className="home-calendar-days">
                  {renderCalendar()}
                </div>
              </div>
            </div>

            {/* Festival Legend */}
            <div className="home-calendar-legend">
              <h4>Festival Types</h4>
              <div className="home-legend-items">
                <div className="home-legend-item">
                  <div className="home-legend-dot religious"></div>
                  <span>Religious</span>
                </div>
                <div className="home-legend-item">
                  <div className="home-legend-dot national"></div>
                  <span>National</span>
                </div>
                <div className="home-legend-item">
                  <div className="home-legend-dot cultural"></div>
                  <span>Cultural</span>
                </div>
                <div className="home-legend-item">
                  <div className="home-legend-dot regional"></div>
                  <span>Regional</span>
                </div>
                <div className="home-legend-item">
                  <div className="home-legend-dot educational"></div>
                  <span>Educational</span>
                </div>
                <div className="home-legend-item">
                  <div className="home-legend-dot environmental"></div>
                  <span>Environmental</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="cta-section">
        <div className="cta-content">
          <h3>Ready to Explore?</h3>
          <p>Start your journey through Jharkhand's rich culture and natural beauty</p>
          <div className="cta-buttons">
            <Link to="/page-c" className="cta-button primary">
              Start VR Tour
            </Link>
            <Link to="/page-a" className="cta-button secondary">
              View Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
