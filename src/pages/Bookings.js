import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App4.css';

function Bookings() {
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '01:00 PM', '02:00 PM',
    '03:00 PM', '04:00 PM', '05:00 PM',
  ];

  useEffect(() => {
    const bookingData = localStorage.getItem('customerBookingData');
    if (bookingData) {
      setCustomerData(JSON.parse(bookingData));
    } else {
      navigate('/custlogin');
    }
  }, [navigate]);

  const getDaysInMonth = (date) => {
    const year  = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth       = new Date(year, month + 1, 0).getDate();
    const startingDayOfWeek = new Date(year, month, 1).getDay();
    return { daysInMonth, startingDayOfWeek };
  };

  const formatDate = (date) =>
    date.toLocaleDateString('en-ZA', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isPastDate = (day) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), day) < today;
  };

  const handleDateClick = (day) => {
    if (isPastDate(day)) return;
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    setSelectedTime(null);
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime) {
      setErrorMessage('Please select a date and time.');
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      return;
    }
    try {
      const res = await fetch('http://localhost:5000/api/bookings/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId:  customerData.customerId,
          bookingDate: selectedDate.toISOString().split('T')[0],
          bookingTime: selectedTime,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 5000);
        const updated = {
          ...customerData,
          lessonsRemaining: customerData.lessonsRemaining - 1,
          lessonsUsed:      customerData.lessonsUsed + 1,
        };
        setCustomerData(updated);
        localStorage.setItem('customerBookingData', JSON.stringify(updated));
        setSelectedDate(null);
        setSelectedTime(null);
      } else {
        setErrorMessage(data.message || 'Error creating booking');
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
      }
    } catch {
      setErrorMessage('Connection error. Please try again.');
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customerBookingData');
    navigate('/custlogin');
  };

  if (!customerData) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        Loading your dashboard...
      </div>
    );
  }

  const isFormValid = selectedDate && selectedTime;
  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const progressPct = customerData.totalLessons
    ? Math.round((customerData.lessonsUsed / customerData.totalLessons) * 100)
    : 0;

  return (
    <div>

      {/* ── HEADER ── */}
      <header className="header">
        <div className="name">
          <span className="name-red">SNA</span> DRIVING
        </div>
      </header>

      {/* ── CUSTOMER BANNER ── */}
      <div className="customer-banner">
        <div className="container">

          <div className="banner-top">
            <div className="banner-greeting">
              <div className="user-avatar">
                {getInitials(customerData.fullName)}
              </div>
              <div>
                <h2>Welcome, {customerData.fullName}</h2>
                <p>Package: {customerData.packageType}</p>
              </div>
            </div>
            <div className="banner-actions">
              <button className="btn-banner" onClick={() => navigate('/manage-bookings')}>
                My Bookings
              </button>
              <button className="btn-banner" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon red">
                <i className="fa-solid fa-calendar-days"></i>
              </div>
              <div className="stat-info">
                <div className="stat-label">Lessons Remaining</div>
                <div className="stat-value">
                  {customerData.lessonsRemaining}
                  <span> / {customerData.totalLessons}</span>
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">
                <i className="fa-solid fa-money-bill-wave"></i>
              </div>
              <div className="stat-info">
                <div className="stat-label">Balance Owing</div>
                <div className="stat-value">
                  R{customerData.balanceOwing ? customerData.balanceOwing.toFixed(2) : '0.00'}
                </div>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon green">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <div className="stat-info">
                <div className="stat-label">Lessons Completed</div>
                <div className="stat-value">{customerData.lessonsUsed}</div>
                <div className="stat-progress">
                  <div className="progress-bar-track">
                    <div className="progress-bar-fill" style={{ width: `${progressPct}%` }}></div>
                  </div>
                  <div className="progress-label">
                    {customerData.lessonsUsed} out of {customerData.totalLessons} completed
                  </div>
                </div>
              </div>
            </div>
          </div>

          {customerData.balanceOwing > 0 && (
            <div className="balance-warning">
              <i className="fa-solid fa-triangle-exclamation"></i>
              You have an outstanding balance. Please contact us to arrange payment.
            </div>
          )}

        </div>
      </div>

      {/* ── BOOKING SECTION ── */}
      <div className="booking-section">

        {showSuccess && (
          <div className="alert-success">
            <i className="fa-solid fa-circle-check"></i>
            Booking confirmed! We'll be in touch shortly.
          </div>
        )}
        {showError && (
          <div className="alert-error">
            <i className="fa-solid fa-triangle-exclamation"></i>
            {errorMessage}
          </div>
        )}

        <div className="booking-grid">

          {/* ── LEFT: CALENDAR ── */}
          <div>
            <div className="section-title">Select a Date</div>
            <div className="card">
              <div className="calendar-nav">
                {/* Plain text arrows — reliable cross-browser */}
                <button
                  className="calendar-nav-btn"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                >
                  &#8249;
                </button>
                <span className="calendar-month-label">
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </span>
                <button
                  className="calendar-nav-btn"
                  onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                >
                  &#8250;
                </button>
              </div>

              <div className="weekday-labels">
                {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
                  <div key={d} className="weekday-label">{d}</div>
                ))}
              </div>

              <div className="calendar-grid">
                {[...Array(startingDayOfWeek)].map((_, i) => (
                  <div key={`e-${i}`}></div>
                ))}
                {[...Array(daysInMonth)].map((_, i) => {
                  const day  = i + 1;
                  const past = isPastDate(day);
                  const today = isToday(day);
                  const selected =
                    selectedDate &&
                    selectedDate.getDate() === day &&
                    selectedDate.getMonth() === currentDate.getMonth();
                  let cls = 'calendar-day';
                  if (past)          cls += ' past';
                  else if (selected) cls += ' selected';
                  else if (today)    cls += ' today';
                  return (
                    <button
                      key={day}
                      className={cls}
                      onClick={() => handleDateClick(day)}
                      disabled={past}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── RIGHT: TIME SLOTS + BOOK BUTTON ── */}
          <div className="right-panel">
            <div className="section-title">Select a Time Slot</div>
            <div className="card">
              <div className="time-slots-grid">
                {selectedDate ? (
                  timeSlots.map(time => (
                    <button
                      key={time}
                      className={`time-slot${selectedTime === time ? ' selected' : ''}`}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </button>
                  ))
                ) : (
                  <div className="time-slots-placeholder">Select a date first</div>
                )}
              </div>

              {/* Booking summary */}
              {isFormValid && (
                <div className="booking-summary">
                  <div className="summary-title">
                    <i className="fa-solid fa-clipboard-list"></i> Booking Summary
                  </div>
                  <div className="summary-item"><strong>Date:</strong> {formatDate(selectedDate)}</div>
                  <div className="summary-item"><strong>Time:</strong> {selectedTime}</div>
                </div>
              )}

              <button
                className="submit-btn"
                onClick={handleSubmit}
                disabled={!isFormValid}
              >
                Book Lesson
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Bookings;