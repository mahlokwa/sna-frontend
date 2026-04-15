import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App4.css';
import useSessionTimeout from './useSessionTimeout';

function Bookings() {
  useSessionTimeout('/custlogin');
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedTruck, setSelectedTruck] = useState(null);       // NEW
  const [availableTrucks, setAvailableTrucks] = useState([]);     // NEW
  const [loadingTrucks, setLoadingTrucks] = useState(false);      // NEW
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const timeSlots = [
    '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM',
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM',
  ];

  useEffect(() => {
    const bookingData = localStorage.getItem('customerBookingData');
    if (bookingData) {
      setCustomerData(JSON.parse(bookingData));
    } else {
      navigate('/custlogin');
    }
  }, [navigate]);

  // NEW - Fetch available trucks whenever date or time changes
  useEffect(() => {
    if (!selectedDate || !selectedTime) {
      setAvailableTrucks([]);
      setSelectedTruck(null);
      return;
    }

    const fetchAvailableTrucks = async () => {
      setLoadingTrucks(true);
      setSelectedTruck(null);

      // Convert time to 24hr for the API
      const convertTo24Hour = (time12h) => {
        const [time, modifier] = time12h.split(' ');
        let [hours, minutes] = time.split(':');
        if (modifier === 'AM' && hours === '12') hours = '00';
        if (modifier === 'PM' && hours !== '12') hours = String(parseInt(hours) + 12);
        return `${hours.padStart(2, '0')}:${minutes}`;
      };

      const startTime = convertTo24Hour(selectedTime);
      const lessonDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`;

      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/bookings/available-trucks?lessonDate=${lessonDate}&startTime=${startTime}`
        );
        const data = await res.json();
        setAvailableTrucks(data);
      } catch {
        setAvailableTrucks([]);
      } finally {
        setLoadingTrucks(false);
      }
    };

    fetchAvailableTrucks();
  }, [selectedDate, selectedTime]);

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
    const clicked = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (clicked.getDay() === 0) return;
    setSelectedDate(clicked);
    setSelectedTime(null);
    setSelectedTruck(null);   // NEW - reset truck on date change
    setAvailableTrucks([]);   // NEW
  };

  const handleTimeClick = (time) => {
    setSelectedTime(time);
    setSelectedTruck(null);   // NEW - reset truck on time change
  };

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !selectedTruck) {
      setErrorMessage('Please select a date, time, and truck.');
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      return;
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/bookings/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId:  customerData.customerId,
          bookingDate: `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`,
          bookingTime: selectedTime,
          truckId: selectedTruck.truckId,   // NEW
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
        setSelectedTruck(null);     // NEW
        setAvailableTrucks([]);     // NEW
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

  // NEW - slot is full if all trucks are unavailable
  const isSlotFull = availableTrucks.length > 0 && availableTrucks.every(t => !t.isAvailable);
  const isFormValid = selectedDate && selectedTime && selectedTruck;
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
                  const isSunday = new Date(currentDate.getFullYear(), currentDate.getMonth(), day).getDay() === 0;
                  let cls = 'calendar-day';
                  if (past || isSunday) cls += ' past';
                  else if (selected)    cls += ' selected';
                  else if (today)       cls += ' today';
                  return (
                    <button
                      key={day}
                      className={cls}
                      onClick={() => handleDateClick(day)}
                      disabled={past || isSunday}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── RIGHT: TIME SLOTS + TRUCK SELECTION + BOOK BUTTON ── */}
          <div className="right-panel">
            <div className="section-title">Select a Time Slot</div>
            <div className="card">
              <div className="time-slots-grid">
                {selectedDate ? (
                  timeSlots.map(time => (
                    <button
                      key={time}
                      className={`time-slot${selectedTime === time ? ' selected' : ''}`}
                      onClick={() => handleTimeClick(time)}
                    >
                      {time}
                    </button>
                  ))
                ) : (
                  <div className="time-slots-placeholder">Select a date first</div>
                )}
              </div>

              {/* ── NEW: TRUCK SELECTION ── */}
              {selectedTime && (
                <div className="truck-selection">
                  <div className="truck-selection-title">
                    <i className="fa-solid fa-truck"></i> Select a Truck
                  </div>

                  {loadingTrucks ? (
                    <div className="truck-loading">Checking availability...</div>
                  ) : isSlotFull ? (
                    <div className="truck-slot-full">
                      <i className="fa-solid fa-ban"></i> This slot is fully booked. Please choose another time.
                    </div>
                  ) : (
                    <div className="truck-options">
                      {availableTrucks.map(truck => (
                        <button
                          key={truck.truckId}
                          className={`truck-btn${!truck.isAvailable ? ' truck-unavailable' : ''}${selectedTruck?.truckId === truck.truckId ? ' truck-selected' : ''}`}
                          onClick={() => truck.isAvailable && setSelectedTruck(truck)}
                          disabled={!truck.isAvailable}
                        >
                          <i className="fa-solid fa-truck"></i>
                          <span>{truck.number_plate}</span>
                          {!truck.isAvailable && <span className="truck-tag">Booked</span>}
                          {truck.isAvailable && selectedTruck?.truckId === truck.truckId && (
                            <span className="truck-tag selected-tag">Selected</span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Booking summary */}
              {isFormValid && (
                <div className="booking-summary">
                  <div className="summary-title">
                    <i className="fa-solid fa-clipboard-list"></i> Booking Summary
                  </div>
                  <div className="summary-item"><strong>Date:</strong> {formatDate(selectedDate)}</div>
                  <div className="summary-item"><strong>Time:</strong> {selectedTime}</div>
                  <div className="summary-item"><strong>Truck:</strong> {selectedTruck.number_plate}</div>
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