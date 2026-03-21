import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App4.css';

function ManageBookings() {
  const navigate = useNavigate();
  const [customerData, setCustomerData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bookingData = localStorage.getItem('customerBookingData');
    if (bookingData) {
      const customer = JSON.parse(bookingData);
      setCustomerData(customer);
      fetchBookings(customer.customerId);
    } else {
      navigate('/book-lesson');
    }
  }, [navigate]);

  const fetchBookings = async (customerId) => {
    try {
      const res  = await fetch(`http://localhost:5000/api/bookings/customer/${customerId}`);
      const data = await res.json();
      if (res.ok) setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    try {
      const res  = await fetch(`http://localhost:5000/api/bookings/cancel/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: customerData.customerId }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Booking cancelled. Your lesson has been returned.');
        fetchBookings(customerData.customerId);
        setCustomerData({
          ...customerData,
          lessonsRemaining: customerData.lessonsRemaining + 1,
          lessonsUsed:      customerData.lessonsUsed - 1,
        });
      } else {
        alert(data.message || 'Error cancelling booking');
      }
    } catch {
      alert('Connection error. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customerBookingData');
    navigate('/custlogin');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-ZA', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });

  const statusLabel = {
    booked:    'Pending',
    confirmed: 'Confirmed',
    cancelled: 'Cancelled',
    completed: 'Completed',
  };

  const statusIcon = {
    booked:    'fa-clock',
    confirmed: 'fa-circle-check',
    cancelled: 'fa-circle-xmark',
    completed: 'fa-flag-checkered',
  };

  if (!customerData) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        Loading...
      </div>
    );
  }

  return (
    <div>

      {/* ── HEADER ── */}
      <header className="header">
        <div className="name">
          <span className="name-red">SNA</span> DRIVING
        </div>
      </header>

      {/* ── BANNER ── */}
      <div className="customer-banner">
        <div className="container">
          <div className="banner-top">
            <div className="banner-greeting">
              <div className="user-avatar">
                {getInitials(customerData.fullName)}
              </div>
              <div>
                <h2>My Bookings</h2>
                <p>{customerData.fullName}</p>
              </div>
            </div>

            <div className="banner-actions">
              <button className="btn-banner-red" onClick={() => navigate('/bookings')}>
                <i className="fa-solid fa-calendar-plus"></i> Book New Lesson
              </button>
              <button className="btn-banner" onClick={handleLogout}>
                <i className="fa-solid fa-right-from-bracket"></i> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOOKINGS LIST ── */}
      <div className="manage-section">
        <div className="section-title">Your Lesson Bookings</div>

        {loading ? (
          <div className="empty-state">
            <i className="fa-solid fa-spinner fa-spin"></i>
            <p>Loading your bookings...</p>
          </div>

        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <i className="fa-solid fa-calendar-xmark"></i>
            <p>You have no bookings yet.</p>
            <button className="btn-primary" onClick={() => navigate('/customer-booking')}>
              <i className="fa-solid fa-calendar-plus"></i> Book Your First Lesson
            </button>
          </div>

        ) : (
          <div className="bookings-list">
            {bookings.map((booking) => (
              <div
                key={booking.bookingId}
                className={`booking-card status-${booking.status}`}
              >
                {/* ── Left: info ── */}
                <div className="booking-info">

                  <div className={`status-badge ${booking.status}`}>
                    <i className={`fa-solid ${statusIcon[booking.status] || 'fa-circle'}`}></i>
                    {statusLabel[booking.status] || booking.status}
                  </div>

                  <div className="booking-date">
                    {formatDate(booking.lessonDate)}
                  </div>

                  <div className="booking-time">
                    <i className="fa-solid fa-clock"></i>
                    {booking.startTime} — {booking.endTime}
                  </div>

                  {/* Instructor info (confirmed) */}
                  {booking.status === 'confirmed' && booking.instructorName && (
                    <div className="instructor-box">
                      <div className="instructor-label">
                        <i className="fa-solid fa-user-tie"></i> Your Instructor
                      </div>
                      <div className="instructor-name">{booking.instructorName}</div>
                      <div className="instructor-phone">
                        <i className="fa-solid fa-phone"></i> {booking.instructorPhone}
                      </div>
                    </div>
                  )}

                  {/* Pending notice */}
                  {booking.status === 'booked' && (
                    <div className="pending-notice">
                      <i className="fa-solid fa-hourglass-half"></i>
                      Waiting for confirmation. An instructor will be assigned soon.
                    </div>
                  )}
                </div>

                {/* ── Right: actions ── */}
                <div className="booking-actions">
                  {booking.status === 'booked' && (
                    <button
                      className="btn-cancel"
                      onClick={() => handleCancelBooking(booking.bookingId)}
                    >
                      <i className="fa-solid fa-xmark"></i> Cancel
                    </button>
                  )}

                  {booking.status === 'confirmed' && (
                    <div className="confirmed-badge">
                      <i className="fa-solid fa-circle-check"></i> Confirmed
                      <small>Contact us to cancel</small>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default ManageBookings;