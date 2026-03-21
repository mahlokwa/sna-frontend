import { useState, useEffect } from 'react';

function AllBookings({ staffInfo }) {
  const [bookings, setBookings]     = useState([]);
  const [loading, setLoading]       = useState(false);
  const [filters, setFilters]       = useState({ status: '', instructor: '', dateFrom: '', dateTo: '' });

  useEffect(() => { loadBookings(); }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const res  = await fetch('http://localhost:5000/api/bookings/all');
      const data = await res.json();
      if (res.ok) setBookings(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleAssignInstructor = async (bookingId, currentInstructorId) => {
    const instructorId = prompt(`Enter instructor ID to assign (current: ${currentInstructorId || 'None'}):`);
    if (!instructorId) return;
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/update-status/${bookingId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'confirmed', instructorId: parseInt(instructorId) }),
      });
      if (res.ok) { alert('Instructor assigned!'); loadBookings(); }
      else { const d = await res.json(); alert(d.message || 'Failed'); }
    } catch { alert('Connection error.'); }
  };

  const handleUpdateStatus = async (bookingId, newStatus) => {
    if (!window.confirm(`Change status to "${newStatus}"?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/update-status/${bookingId}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) { alert(`Status updated to ${newStatus}!`); loadBookings(); }
      else { const d = await res.json(); alert(d.message || 'Failed'); }
    } catch { alert('Connection error.'); }
  };

  const applyFilters = () => {
    let f = [...bookings];
    if (filters.status) f = f.filter(b => b.status === filters.status);
    if (filters.instructor) f = f.filter(b => b.instructorName?.toLowerCase().includes(filters.instructor.toLowerCase()));
    if (filters.dateFrom) f = f.filter(b => new Date(b.lessonDate) >= new Date(filters.dateFrom));
    if (filters.dateTo)   f = f.filter(b => new Date(b.lessonDate) <= new Date(filters.dateTo));
    return f;
  };

  const filtered = applyFilters();
  const counts = {
    booked:    bookings.filter(b => b.status === 'booked').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  const statusStyle = {
    booked:    { bg: '#dbeafe', color: '#1d4ed8' },
    confirmed: { bg: '#dcfce7', color: '#16a34a' },
    completed: { bg: '#e2e3e5', color: '#383d41' },
    cancelled: { bg: '#fee2e2', color: '#dc2626' },
  };

  const summaryCards = [
    { label: 'Booked',    value: counts.booked,    icon: 'fa-clock',         border: '#1d4ed8' },
    { label: 'Confirmed', value: counts.confirmed, icon: 'fa-circle-check',  border: '#16a34a' },
    { label: 'Completed', value: counts.completed, icon: 'fa-flag-checkered',border: '#666' },
    { label: 'Cancelled', value: counts.cancelled, icon: 'fa-circle-xmark',  border: '#dc2626' },
  ];

  return (
    <div className="employer-section">
      <div className="filters-section">
        <div className="filter-group">
          <label>Status</label>
          <select value={filters.status} onChange={e => setFilters({...filters, status: e.target.value})}>
            <option value="">All Statuses</option>
            <option value="booked">Booked</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="filter-group">
          <label>From Date</label>
          <input type="date" value={filters.dateFrom} onChange={e => setFilters({...filters, dateFrom: e.target.value})} />
        </div>
        <div className="filter-group">
          <label>To Date</label>
          <input type="date" value={filters.dateTo} onChange={e => setFilters({...filters, dateTo: e.target.value})} />
        </div>
        <div className="filter-group">
          <label>Search Instructor</label>
          <input type="text" placeholder="Instructor name..." value={filters.instructor} onChange={e => setFilters({...filters, instructor: e.target.value})} />
        </div>
        <button className="clear-filters-btn" onClick={() => setFilters({ status: '', instructor: '', dateFrom: '', dateTo: '' })}>
          <i className="fa-solid fa-xmark"></i> Clear
        </button>
        <button className="btn-refresh" onClick={loadBookings} disabled={loading}>
          <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-rotate-right'}`}></i>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="summary-cards">
        {summaryCards.map((c, i) => (
          <div key={i} className="summary-card" style={{ borderLeftColor: c.border }}>
            <div className="summary-icon"><i className={`fa-solid ${c.icon}`} style={{ color: c.border }}></i></div>
            <div className="summary-info">
              <span className="summary-label">{c.label}</span>
              <span className="summary-value">{c.value}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="no-data"><i className="fa-solid fa-calendar-xmark"></i><p>No bookings found</p></div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th><th>Customer</th><th>Date</th><th>Time</th>
                <th>Status</th><th>Instructor</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => {
                const s = statusStyle[b.status] || { bg: '#f0f0f0', color: '#666' };
                return (
                  <tr key={b.bookingId}>
                    <td>{b.bookingId}</td>
                    <td><strong>{b.customerName}</strong><br /><small>{b.customerPhone}</small></td>
                    <td>{new Date(b.lessonDate).toLocaleDateString()}</td>
                    <td>{b.startTime} – {b.endTime}</td>
                    <td>
                      <span className="status-pill" style={{ background: s.bg, color: s.color }}>{b.status}</span>
                    </td>
                    <td>{b.instructorName || <span style={{ color: '#999' }}>Unassigned</span>}</td>
                    <td>
                      <div className="action-buttons">
                        {b.status === 'booked' && (
                          <button className="small-btn assign-btn" onClick={() => handleAssignInstructor(b.bookingId, b.instructorId)}>
                            <i className="fa-solid fa-user-plus"></i> Assign
                          </button>
                        )}
                        {b.status === 'confirmed' && (
                          <button className="small-btn complete-btn" onClick={() => handleUpdateStatus(b.bookingId, 'completed')}>
                            <i className="fa-solid fa-flag-checkered"></i> Complete
                          </button>
                        )}
                        {b.status !== 'cancelled' && b.status !== 'completed' && (
                          <button className="small-btn cancel-btn" onClick={() => handleUpdateStatus(b.bookingId, 'cancelled')}>
                            <i className="fa-solid fa-xmark"></i> Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AllBookings;