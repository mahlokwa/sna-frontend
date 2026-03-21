
import { useState, useEffect } from 'react';

function AvailableBookings({ staffInfo }) {
  const [bookings, setBookings]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadAvailableBookings();
    let interval;
    if (autoRefresh) interval = setInterval(loadAvailableBookings, 30000);
    return () => { if (interval) clearInterval(interval); };
  }, [autoRefresh]);

  const loadAvailableBookings = async () => {
    setLoading(true);
    try {
      const res  = await fetch('http://localhost:5000/api/bookings/available');
      const data = await res.json();
      if (res.ok) setBookings(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleAcceptBooking = async (bookingId) => {
    if (!window.confirm('Accept this booking?')) return;
    try {
      const res  = await fetch(`http://localhost:5000/api/bookings/accept/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructorId: staffInfo.staffId }),
      });
      const data = await res.json();
      if (res.ok) { alert('Booking accepted successfully!'); loadAvailableBookings(); }
      else { alert(data.message || 'Failed to accept booking'); loadAvailableBookings(); }
    } catch { alert('Connection error. Please try again.'); }
  };

  return (
    <div className="available-bookings-section">

      {/* Controls */}
      <div className="bookings-controls">
        <button className="btn-refresh" onClick={loadAvailableBookings} disabled={loading}>
          <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-rotate-right'}`}></i>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
        <label className="auto-refresh-checkbox">
          <input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} />
          <span>Auto-refresh every 30s</span>
        </label>
      </div>

      {/* List */}
      {bookings.length === 0 ? (
        <div className="no-bookings">
          <i className="fa-solid fa-box-open"></i>
          <h3>No available bookings</h3>
          <p>Check back later for new booking requests</p>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map((booking) => {
            const lessonDate = new Date(booking.lessonDate);
            const isRecent   = booking.hoursAgo < 24;
            return (
              <div key={booking.bookingId} className="booking-item">
                {isRecent && <span className="new-badge">NEW</span>}

                <div className="booking-main-info">
                  <h3>{booking.customerName}</h3>
                  <p className="booking-phone">
                    <i className="fa-solid fa-phone"></i> {booking.customerPhone}
                  </p>
                </div>

                <div className="booking-details-grid">
                  <div className="booking-detail-item">
                    <span className="detail-label">Date</span>
                    <span className="detail-value">
                      {lessonDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="booking-detail-item">
                    <span className="detail-label">Time</span>
                    <span className="detail-value">{booking.startTime} – {booking.endTime}</span>
                  </div>
                  <div className="booking-detail-item">
                    <span className="detail-label">Posted</span>
                    <span className="detail-value">
                      {booking.hoursAgo < 1 ? 'Just now' : `${booking.hoursAgo}h ago`}
                    </span>
                  </div>
                </div>

                <div className="booking-actions">
                  <button className="accept-booking-btn" onClick={() => handleAcceptBooking(booking.bookingId)}>
                    <i className="fa-solid fa-circle-check"></i> Accept Booking
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AvailableBookings;