import { useState, useEffect } from 'react';

function MySchedule({ staffInfo }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => { loadMySchedule(); }, []);

  const loadMySchedule = async () => {
    setLoading(true);
    try {
      const res  = await fetch(`http://localhost:5000/api/bookings/instructor/${staffInfo.staffId}`);
      const data = await res.json();
      if (res.ok) setBookings(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Cancel this booking? It will be returned to the available pool.')) return;
    try {
      const res  = await fetch(`http://localhost:5000/api/bookings/instructor-cancel/${bookingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ instructorId: staffInfo.staffId }),
      });
      const data = await res.json();
      if (res.ok) { alert('Booking cancelled successfully!'); loadMySchedule(); }
      else alert(data.message || 'Failed to cancel booking');
    } catch { alert('Connection error. Please try again.'); }
  };

  const EmptyState = () => (
    <div className="no-bookings">
      <i className="fa-solid fa-calendar-xmark"></i>
      <h3>No scheduled lessons</h3>
      <p>Accept bookings from the Available Bookings tab</p>
    </div>
  );

  const renderListView = () => {
    if (bookings.length === 0) return <EmptyState />;
    return (
      <div className="bookings-list">
        {bookings.map((booking) => {
          const lessonDate = new Date(booking.lessonDate);
          const isUpcoming = lessonDate > new Date();
          return (
            <div key={booking.bookingId} className={`booking-item ${booking.status === 'completed' ? 'completed-booking' : ''}`}>
              <span className="booking-status-badge">
                {booking.status === 'confirmed' && isUpcoming && 'Confirmed'}
                {booking.status === 'confirmed' && !isUpcoming && 'Past'}
                {booking.status === 'completed' && 'Completed'}
              </span>

              <div className="booking-main-info">
                <h3>{booking.customerName}</h3>
                <p className="booking-phone"><i className="fa-solid fa-phone"></i> {booking.customerPhone}</p>
                {booking.customerEmail && (
                  <p className="booking-email"><i className="fa-solid fa-envelope"></i> {booking.customerEmail}</p>
                )}
              </div>

              <div className="booking-details-grid">
                <div className="booking-detail-item">
                  <span className="detail-label">Date</span>
                  <span className="detail-value">
                    {lessonDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                <div className="booking-detail-item">
                  <span className="detail-label">Time</span>
                  <span className="detail-value">{booking.startTime} – {booking.endTime}</span>
                </div>
              </div>

              {booking.status === 'confirmed' && isUpcoming && (
                <div className="booking-actions">
                  <button className="cancel-booking-btn" onClick={() => handleCancelBooking(booking.bookingId)}>
                    <i className="fa-solid fa-xmark"></i> Cancel Booking
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  const renderCalendarView = () => {
    const bookingsByMonth = {};
    bookings.forEach(booking => {
      const date     = new Date(booking.lessonDate);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      if (!bookingsByMonth[monthKey]) bookingsByMonth[monthKey] = [];
      bookingsByMonth[monthKey].push(booking);
    });

    if (Object.keys(bookingsByMonth).length === 0) return <EmptyState />;

    return (
      <div className="calendar-view">
        {Object.entries(bookingsByMonth).map(([monthKey, monthBookings]) => {
          const [year, month] = monthKey.split('-');
          const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
          return (
            <div key={monthKey} className="calendar-month-section">
              <h3 className="calendar-month-title">
                <i className="fa-solid fa-calendar" style={{ color: '#ff0000', fontSize: 14 }}></i> {monthName}
              </h3>
              <div className="calendar-bookings-grid">
                {monthBookings.map(booking => {
                  const date = new Date(booking.lessonDate);
                  return (
                    <div key={booking.bookingId} className="calendar-booking-card">
                      <div className="calendar-booking-date">
                        <span className="calendar-day">{date.getDate()}</span>
                        <span className="calendar-weekday">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      </div>
                      <div className="calendar-booking-info">
                        <strong>{booking.customerName}</strong>
                        <span>{booking.startTime} – {booking.endTime}</span>
                        <span className="calendar-booking-status">{booking.status}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="my-schedule-section">
      <div className="schedule-controls">
        <div className="view-toggle-buttons">
          <button className={`btn-outline ${viewMode === 'list' ? 'active-view' : ''}`} onClick={() => setViewMode('list')}>
            <i className="fa-solid fa-list"></i> List View
          </button>
          <button className={`btn-outline ${viewMode === 'calendar' ? 'active-view' : ''}`} onClick={() => setViewMode('calendar')}>
            <i className="fa-solid fa-calendar-days"></i> Calendar View
          </button>
        </div>
        <button className="btn-primary" onClick={loadMySchedule} disabled={loading}>
          <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-rotate-right'}`}></i>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      {viewMode === 'list' ? renderListView() : renderCalendarView()}
    </div>
  );
}

export default MySchedule;