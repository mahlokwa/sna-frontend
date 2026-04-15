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
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [availableTrucks, setAvailableTrucks] = useState([]);
  const [loadingTrucks, setLoadingTrucks] = useState(false);
  const [slotAvailability, setSlotAvailability] = useState({});
  const [hasBookedToday, setHasBookedToday] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);

  const timeSlots = [
    '07:00 AM', '07:30 AM', '08:00 AM', '08:30 AM',
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
    '05:00 PM',
  ];

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');
    if (modifier === 'AM' && hours === '12') hours = '00';
    if (modifier === 'PM' && hours !== '12') hours = String(parseInt(hours) + 12);
    return `${hours.padStart(2, '0')}:${minutes}`;
  };

  const formatDateStr = (date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    const bookingData = localStorage.getItem('customerBookingData');
    if (bookingData) {
      setCustomerData(JSON.parse(bookingData));
    } else {
      navigate('/custlogin');
    }
  }, [navigate]);

  // Fetch slot availability + check if customer already booked on selected date
  useEffect(() => {
    if (!selectedDate || !customerData) {
      setSlotAvailability({});
      setHasBookedToday(false);
      setSelectedTime(null);
      setSelectedTruck(null);
      setAvailableTrucks([]);
      return;
    }

    const lessonDate = formatDateStr(selectedDate);

    const fetchDayAvailability = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/bookings/day-availability?lessonDate=${lessonDate}&customerId=${customerData.customerId}`
        );
        const data = await res.json();
        setSlotAvailability(data.slotAvailability || {});
        setHasBookedToday(data.customerHasBooking || false);
      } catch {
        setSlotAvailability({});
        setHasBookedToday(false);
      }
    };

    fetchDayAvailability();
    setSelectedTime(null);
    setSelectedTruck(null);
    setAvailableTrucks([]);
  }, [selectedDate, customerData]);

  // Fetch available trucks when time is selected
  useEffect(() => {
    if (!selectedDate || !selectedTime) {
      setAvailableTrucks([]);
      setSelectedTruck(null);
      return;
    }

    const fetchAvailableTrucks = async () => {
      setLoadingTrucks(true);
      setSelectedTruck(null);
      const startTime = convertTo24Hour(selectedTime);
      const lessonDate = formatDateStr(selectedDate);
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

  const isSlotFull = (time) => {
    const time24 = convertTo24Hour(time);
    if (slotAvailability.hasOwnProperty(time24)) return !slotAvailability[time24];
    return false;
  };

  const handleDateClick = (day) => {
    if (isPastDate(day)) return;
    const clicked = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    if (clicked.getDay() === 0) return;
    setSelectedDate(clicked);
  };

  const handleTimeClick = (time) => {
    if (isSlotFull(time) || hasBookedToday) return;
    setSelectedTime(time);
    setSelectedTruck(null);
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
          bookingDate: formatDateStr(selectedDate),
          bookingTime: selectedTime,
          truckId:     selectedTruck.truckId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setBookingDetails({
          date:  formatDate(selectedDate),
          time:  selectedTime,
          truck: selectedTruck.number_plate,
        });
        setShowPopup(true);

        const updated = {
          ...customerData,
          lessonsRemaining: customerData.lessonsRemaining - 1,
          lessonsUsed:      customerData.lessonsUsed + 1,
        };
        setCustomerData(updated);
        localStorage.setItem('customerBookingData', JSON.stringify(updated));
        setSelectedDate(null);
        setSelectedTime(null);
        setSelectedTruck(null);
        setAvailableTrucks([]);
        setSlotAvailability({});
        setHasBookedToday(false);
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

  const allTrucksFull = availableTrucks.length > 0 && availableTrucks.every(t => !t.isAvailable);
  const isFormValid = selectedDate && selectedTime && selectedTruck;
  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
  const progressPct = customerData.totalLessons
    ? Math.round((customerData.lessonsUsed / customerData.totalLessons) * 100)
    : 0;

  return (
    <div>

      {/* ── SUCCESS POPUP ── */}
      {showPopup && bookingDetails && (
        <div className="popup-overlay" onClick={() => setShowPopup(false)}>
          <div className="popup-card" onClick={e => e.stopPropagation()}>
            <div className="popup-icon">
              <i className="fa-solid fa-circle-check"></i>
            </div>
            <h2 className="popup-title">Booking Confirmed!</h2>
            <p className="popup-subtitle">Your lesson has been successfully booked.</p>
            <div className="popup-details">
              <div className="popup-detail-row">
                <i className="fa-solid fa-calendar-days"></i>
                <span>{bookingDetails.date}</span>
              </div>
              <div className="popup-detail-row">
                <i className="fa-solid fa-clock"></i>
                <span>{bookingDetails.time}</span>
              </div>
              <div className="popup-detail-row">
                <i className="fa-solid fa-truck"></i>
                <span>{bookingDetails.truck}</span>
              </div>
            </div>
            <button className="popup-btn" onClick={() => setShowPopup(false)}>
              Done
            </button>
          </div>
        </div>
      )}

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

              {hasBookedToday && (
                <div className="day-booked-warning">
                  <i className="fa-solid fa-circle-info"></i>
                  You already have a booking on this day. Only one booking per day is allowed.
                </div>
              )}

              <div className="time-slots-grid">
                {selectedDate ? (
                  timeSlots.map(time => {
                    const full = isSlotFull(time);
                    let cls = 'time-slot';
                    if (full)                  cls += ' slot-full';
                    if (selectedTime === time) cls += ' selected';
                    return (
                      <button
                        key={time}
                        className={cls}
                        onClick={() => handleTimeClick(time)}
                        disabled={full || hasBookedToday}
                        title={full ? 'This slot is fully booked' : ''}
                      >
                        {time}
                        {full && <span className="slot-full-label">Full</span>}
                      </button>
                    );
                  })
                ) : (
                  <div className="time-slots-placeholder">Select a date first</div>
                )}
              </div>

              {selectedTime && !hasBookedToday && (
                <div className="truck-selection">
                  <div className="truck-selection-title">
                    <i className="fa-solid fa-truck"></i> Select a Truck
                  </div>

                  {loadingTrucks ? (
                    <div className="truck-loading">Checking availability...</div>
                  ) : allTrucksFull ? (
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