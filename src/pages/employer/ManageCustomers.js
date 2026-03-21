import { useState, useEffect } from 'react';

function ManageCustomers({ staffInfo }) {
  const [customers, setCustomers]             = useState([]);
  const [loading, setLoading]                 = useState(false);
  const [searchTerm, setSearchTerm]           = useState('');
  const [filterStatus, setFilterStatus]       = useState('all');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showModal, setShowModal]             = useState(false);

  useEffect(() => { loadCustomers(); }, []);

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const res  = await fetch('http://localhost:5000/api/customers/all');
      const data = await res.json();
      if (res.ok) setCustomers(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleArchive = async (id) => {
    if (!window.confirm('Archive this customer?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/customers/archive/${id}`, { method: 'PUT' });
      if (res.ok) { alert('Customer archived!'); loadCustomers(); }
      else { const d = await res.json(); alert(d.message || 'Failed'); }
    } catch { alert('Connection error.'); }
  };

  const handleDelete = async (id) => {
    if (window.prompt('Type "DELETE" to confirm:') !== 'DELETE') { alert('Cancelled'); return; }
    try {
      const res = await fetch(`http://localhost:5000/api/customers/delete/${id}`, { method: 'DELETE' });
      if (res.ok) { alert('Customer deleted!'); loadCustomers(); }
      else { const d = await res.json(); alert(d.message || 'Failed'); }
    } catch { alert('Connection error.'); }
  };

  const handleViewDetails = async (customer) => {
    setSelectedCustomer(customer);
    setShowModal(true);
    try {
      const [bRes, pRes] = await Promise.all([
        fetch(`http://localhost:5000/api/bookings/customer/${customer.customerId}`),
        fetch(`http://localhost:5000/api/payments/customer/${customer.customerId}`),
      ]);
      const bookings = await bRes.json();
      const payments = await pRes.json();
      setSelectedCustomer({ ...customer, bookings: bRes.ok ? bookings : [], payments: pRes.ok ? payments : [] });
    } catch (e) { console.error(e); }
  };

  const filtered = customers.filter(c => {
    const matchSearch = !searchTerm ||
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phoneNumber.includes(searchTerm) ||
      (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchStatus =
      filterStatus === 'all' ? true :
      filterStatus === 'active' ? !c.archived : c.archived;
    return matchSearch && matchStatus;
  });

  return (
    <div className="employer-section">
      <div className="filters-section">
        <div className="filter-group">
          <label>Search</label>
          <input type="text" placeholder="Name, phone, or email..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
        </div>
        <div className="filter-group">
          <label>Status</label>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Customers</option>
            <option value="active">Active Only</option>
            <option value="archived">Archived Only</option>
          </select>
        </div>
        <button className="clear-filters-btn" onClick={() => { setSearchTerm(''); setFilterStatus('all'); }}>
          <i className="fa-solid fa-xmark"></i> Clear
        </button>
        <button className="btn-refresh" onClick={loadCustomers} disabled={loading}>
          <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-rotate-right'}`}></i>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="summary-cards">
        {[
          { label: 'Total Customers', value: customers.length,                        icon: 'fa-users' },
          { label: 'Active',          value: customers.filter(c => !c.archived).length, icon: 'fa-circle-check' },
          { label: 'Archived',        value: customers.filter(c => c.archived).length,  icon: 'fa-box-archive' },
        ].map((c, i) => (
          <div key={i} className="summary-card">
            <div className="summary-icon"><i className={`fa-solid ${c.icon}`}></i></div>
            <div className="summary-info">
              <span className="summary-label">{c.label}</span>
              <span className="summary-value">{c.value}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="no-data"><i className="fa-solid fa-users-slash"></i><p>No customers found</p></div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Contact</th><th>Package</th><th>Lessons</th><th>Balance</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {filtered.map(c => {
                const unlocked   = c.totalTowardLessons ? Math.floor(c.totalTowardLessons / c.pricePerLesson) : 0;
                const remaining  = unlocked - (c.lessonsUsed || 0);
                const balance    = (c.packagePrice || 0) - (c.totalPaid || 0);
                return (
                  <tr key={c.customerId} className={c.archived ? 'archived-row' : ''}>
                    <td>
                      <strong>{c.fullName}</strong>
                      {c.archived && <span className="archived-badge">Archived</span>}
                    </td>
                    <td>{c.phoneNumber}<br /><small>{c.email || 'N/A'}</small></td>
                    <td>{c.package_type || 'N/A'}</td>
                    <td>{c.lessonsUsed || 0} / {unlocked}<br /><small>{remaining} remaining</small></td>
                    <td className={balance > 0 ? 'amount-cell warning' : 'amount-cell success'}>R{balance.toFixed(2)}</td>
                    <td>
                      {remaining <= 0 && balance <= 0 ? (
                        <span className="status-pill completed">Completed</span>
                      ) : balance > 0 ? (
                        <span className="status-pill pending">Owing</span>
                      ) : (
                        <span className="status-pill active">Active</span>
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="small-btn view-btn" onClick={() => handleViewDetails(c)}>
                          <i className="fa-solid fa-eye"></i> View
                        </button>
                        {!c.archived && (
                          <button className="small-btn archive-btn" onClick={() => handleArchive(c.customerId)}>
                            <i className="fa-solid fa-box-archive"></i> Archive
                          </button>
                        )}
                        <button className="small-btn delete-btn" onClick={() => handleDelete(c.customerId)}>
                          <i className="fa-solid fa-trash"></i> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      {showModal && selectedCustomer && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fa-solid fa-user" style={{ marginRight: 8 }}></i>{selectedCustomer.fullName}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="modal-body">
              <div className="details-section">
                <h3><i className="fa-solid fa-address-card"></i> Contact Information</h3>
                <p><strong>Phone:</strong> {selectedCustomer.phoneNumber}</p>
                <p><strong>Email:</strong> {selectedCustomer.email || 'N/A'}</p>
                <p><strong>Package:</strong> {selectedCustomer.package_type}</p>
                <p><strong>Package Price:</strong> R{selectedCustomer.packagePrice}</p>
              </div>

              <div className="details-section">
                <h3><i className="fa-solid fa-money-bill-wave"></i> Payment History</h3>
                {selectedCustomer.payments?.length > 0 ? (
                  <table className="mini-table">
                    <thead><tr><th>Date</th><th>Amount</th><th>Recorded By</th></tr></thead>
                    <tbody>
                      {selectedCustomer.payments.map(p => (
                        <tr key={p.paymentId}>
                          <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                          <td>R{parseFloat(p.amountPaid).toFixed(2)}</td>
                          <td>{p.recordedBy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p style={{ color: '#999', fontSize: 13 }}>No payments recorded</p>}
              </div>

              <div className="details-section">
                <h3><i className="fa-solid fa-calendar-days"></i> Booking History</h3>
                {selectedCustomer.bookings?.length > 0 ? (
                  <table className="mini-table">
                    <thead><tr><th>Date</th><th>Time</th><th>Instructor</th><th>Status</th></tr></thead>
                    <tbody>
                      {selectedCustomer.bookings.map(b => (
                        <tr key={b.bookingId}>
                          <td>{new Date(b.lessonDate).toLocaleDateString()}</td>
                          <td>{b.startTime} – {b.endTime}</td>
                          <td>{b.instructorName || 'Unassigned'}</td>
                          <td>{b.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <p style={{ color: '#999', fontSize: 13 }}>No bookings found</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageCustomers;