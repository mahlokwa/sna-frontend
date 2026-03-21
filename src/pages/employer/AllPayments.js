import { useState, useEffect } from 'react';

function AllPayments({ staffInfo }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [filters, setFilters]   = useState({ dateFrom: '', dateTo: '', instructor: '', customer: '' });

  useEffect(() => { loadPayments(); }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const res  = await fetch('http://localhost:5000/api/payments/all');
      const data = await res.json();
      if (res.ok) setPayments(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const applyFilters = () => {
    let f = [...payments];
    if (filters.dateFrom) f = f.filter(p => new Date(p.paymentDate) >= new Date(filters.dateFrom));
    if (filters.dateTo)   f = f.filter(p => new Date(p.paymentDate) <= new Date(filters.dateTo));
    if (filters.instructor) f = f.filter(p => p.recordedBy.toLowerCase().includes(filters.instructor.toLowerCase()));
    if (filters.customer)   f = f.filter(p => p.customerName.toLowerCase().includes(filters.customer.toLowerCase()));
    return f;
  };

  const filtered      = applyFilters();
  const totalRevenue  = filtered.reduce((s, p) => s + parseFloat(p.amountPaid || 0), 0);
  const totalLessons  = filtered.reduce((s, p) => s + parseFloat(p.amountTowardLessons || 0), 0);
  const totalLearners = filtered.reduce((s, p) => s + parseFloat(p.amountTowardLearners || 0), 0);

  return (
    <div className="employer-section">
      <div className="filters-section">
        <div className="filter-group">
          <label>From Date</label>
          <input type="date" value={filters.dateFrom} onChange={e => setFilters({...filters, dateFrom: e.target.value})} />
        </div>
        <div className="filter-group">
          <label>To Date</label>
          <input type="date" value={filters.dateTo} onChange={e => setFilters({...filters, dateTo: e.target.value})} />
        </div>
        <div className="filter-group">
          <label>Search Customer</label>
          <input type="text" placeholder="Customer name..." value={filters.customer} onChange={e => setFilters({...filters, customer: e.target.value})} />
        </div>
        <div className="filter-group">
          <label>Search Instructor</label>
          <input type="text" placeholder="Instructor name..." value={filters.instructor} onChange={e => setFilters({...filters, instructor: e.target.value})} />
        </div>
        <button className="clear-filters-btn" onClick={() => setFilters({ dateFrom: '', dateTo: '', instructor: '', customer: '' })}>
          <i className="fa-solid fa-xmark"></i> Clear
        </button>
        <button className="btn-refresh" onClick={loadPayments} disabled={loading}>
          <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-rotate-right'}`}></i>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="summary-cards">
        {[
          { label: 'Total Revenue',   value: `R${totalRevenue.toFixed(2)}`,  icon: 'fa-money-bill-wave',      cls: 'revenue' },
          { label: 'Toward Lessons',  value: `R${totalLessons.toFixed(2)}`,  icon: 'fa-car',                  cls: 'lessons' },
          { label: 'Toward Learners', value: `R${totalLearners.toFixed(2)}`, icon: 'fa-id-card',              cls: 'learners' },
          { label: 'Total Payments',  value: filtered.length,                icon: 'fa-receipt',               cls: 'count' },
        ].map((c, i) => (
          <div key={i} className={`summary-card ${c.cls}`}>
            <div className="summary-icon"><i className={`fa-solid ${c.icon}`}></i></div>
            <div className="summary-info">
              <span className="summary-label">{c.label}</span>
              <span className="summary-value">{c.value}</span>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="no-data"><i className="fa-solid fa-receipt"></i><p>No payments found</p></div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th><th>Customer</th><th>Package</th>
                <th>Amount Paid</th><th>To Lessons</th><th>To Learners</th>
                <th>Recorded By</th><th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.paymentId}>
                  <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                  <td><strong>{p.customerName}</strong></td>
                  <td>{p.packageDescription}</td>
                  <td className="amount-cell highlight">R{parseFloat(p.amountPaid).toFixed(2)}</td>
                  <td className="amount-cell">R{parseFloat(p.amountTowardLessons).toFixed(2)}</td>
                  <td className="amount-cell">R{parseFloat(p.amountTowardLearners).toFixed(2)}</td>
                  <td>{p.recordedBy}</td>
                  <td className="notes-cell">{p.notes || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AllPayments;