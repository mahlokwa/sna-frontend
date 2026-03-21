import { useState, useEffect } from 'react';

function SalesReports({ staffInfo }) {
  const [payments, setPayments]       = useState([]);
  const [loading, setLoading]         = useState(false);
  const [reportType, setReportType]   = useState('monthly');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

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

  const getMonthly = () => {
    const d = {};
    payments.forEach(p => {
      const date = new Date(p.paymentDate);
      if (date.getFullYear() !== selectedYear) return;
      const key = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}`;
      if (!d[key]) d[key] = { label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }), totalRevenue: 0, totalPayments: 0, towardLessons: 0, towardLearners: 0 };
      d[key].totalRevenue  += parseFloat(p.amountPaid || 0);
      d[key].totalPayments += 1;
      d[key].towardLessons  += parseFloat(p.amountTowardLessons || 0);
      d[key].towardLearners += parseFloat(p.amountTowardLearners || 0);
    });
    return Object.values(d).sort((a, b) => new Date(a.label) - new Date(b.label));
  };

  const getQuarterly = () => {
    const d = {};
    payments.forEach(p => {
      const date = new Date(p.paymentDate);
      if (date.getFullYear() !== selectedYear) return;
      const q   = Math.floor(date.getMonth() / 3) + 1;
      const key = `${date.getFullYear()}-Q${q}`;
      if (!d[key]) d[key] = { label: `Q${q} ${date.getFullYear()}`, totalRevenue: 0, totalPayments: 0, towardLessons: 0, towardLearners: 0 };
      d[key].totalRevenue  += parseFloat(p.amountPaid || 0);
      d[key].totalPayments += 1;
      d[key].towardLessons  += parseFloat(p.amountTowardLessons || 0);
      d[key].towardLearners += parseFloat(p.amountTowardLearners || 0);
    });
    return Object.values(d);
  };

  const getYearly = () => {
    const d = {};
    payments.forEach(p => {
      const year = new Date(p.paymentDate).getFullYear();
      if (!d[year]) d[year] = { label: year, totalRevenue: 0, totalPayments: 0, towardLessons: 0, towardLearners: 0 };
      d[year].totalRevenue  += parseFloat(p.amountPaid || 0);
      d[year].totalPayments += 1;
      d[year].towardLessons  += parseFloat(p.amountTowardLessons || 0);
      d[year].towardLearners += parseFloat(p.amountTowardLearners || 0);
    });
    return Object.values(d).sort((a, b) => b.label - a.label);
  };

  const reportData    = reportType === 'monthly' ? getMonthly() : reportType === 'quarterly' ? getQuarterly() : getYearly();
  const totalRevenue  = reportData.reduce((s, i) => s + i.totalRevenue, 0);
  const totalPayments = reportData.reduce((s, i) => s + i.totalPayments, 0);
  const availableYears = [...new Set(payments.map(p => new Date(p.paymentDate).getFullYear()))].sort((a,b) => b-a);
  const maxRevenue = Math.max(...reportData.map(d => d.totalRevenue), 1);

  const reportBtns = [
    { type: 'monthly',   icon: 'fa-calendar-days', label: 'Monthly' },
    { type: 'quarterly', icon: 'fa-chart-bar',      label: 'Quarterly' },
    { type: 'yearly',    icon: 'fa-chart-line',     label: 'Yearly' },
  ];

  return (
    <div className="employer-section">
      <div className="report-controls">
        <div className="report-type-selector">
          {reportBtns.map(b => (
            <button key={b.type} className={`report-type-btn ${reportType === b.type ? 'active' : ''}`} onClick={() => setReportType(b.type)}>
              <i className={`fa-solid ${b.icon}`}></i> {b.label}
            </button>
          ))}
        </div>
        {reportType !== 'yearly' && (
          <div className="year-selector">
            <label>Year:</label>
            <select value={selectedYear} onChange={e => setSelectedYear(parseInt(e.target.value))}>
              {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        )}
        <button className="btn-refresh" onClick={loadPayments} disabled={loading}>
          <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-rotate-right'}`}></i>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="summary-cards">
        {[
          { label: 'Total Revenue',   value: `R${totalRevenue.toFixed(2)}`,                                          icon: 'fa-money-bill-wave', cls: 'revenue' },
          { label: 'Total Payments',  value: totalPayments,                                                           icon: 'fa-receipt',          cls: 'count' },
          { label: 'Average Payment', value: `R${totalPayments > 0 ? (totalRevenue/totalPayments).toFixed(2) : '0.00'}`, icon: 'fa-calculator',    cls: 'average' },
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

      {reportData.length === 0 ? (
        <div className="no-data"><i className="fa-solid fa-chart-area"></i><p>No data for this period</p></div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>{reportType === 'monthly' ? 'Month' : reportType === 'quarterly' ? 'Quarter' : 'Year'}</th>
                <th>Total Revenue</th><th>Payments</th><th>Toward Lessons</th><th>Toward Learners</th><th>Avg Payment</th>
              </tr>
            </thead>
            <tbody>
              {reportData.map((item, i) => (
                <tr key={i}>
                  <td><strong>{item.label}</strong></td>
                  <td className="amount-cell highlight">R{item.totalRevenue.toFixed(2)}</td>
                  <td>{item.totalPayments}</td>
                  <td className="amount-cell">R{item.towardLessons.toFixed(2)}</td>
                  <td className="amount-cell">R{item.towardLearners.toFixed(2)}</td>
                  <td className="amount-cell">R{item.totalPayments > 0 ? (item.totalRevenue/item.totalPayments).toFixed(2) : '0.00'}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="total-row">
                <td><strong>TOTAL</strong></td>
                <td className="amount-cell highlight"><strong>R{totalRevenue.toFixed(2)}</strong></td>
                <td><strong>{totalPayments}</strong></td>
                <td className="amount-cell"><strong>R{reportData.reduce((s,i)=>s+i.towardLessons,0).toFixed(2)}</strong></td>
                <td className="amount-cell"><strong>R{reportData.reduce((s,i)=>s+i.towardLearners,0).toFixed(2)}</strong></td>
                <td className="amount-cell"><strong>R{totalPayments > 0 ? (totalRevenue/totalPayments).toFixed(2) : '0.00'}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {/* Bar Chart */}
      <div className="chart-container">
        <h3><i className="fa-solid fa-chart-bar" style={{ color: '#ff0000', marginRight: 8 }}></i>Revenue Trend</h3>
        <div className="bar-chart">
          {reportData.map((item, i) => (
            <div key={i} className="bar-item">
              <div className="bar-container">
                <div className="bar" style={{ height: `${(item.totalRevenue / maxRevenue) * 100}%` }} title={`R${item.totalRevenue.toFixed(2)}`}>
                  <span className="bar-value">R{item.totalRevenue.toFixed(0)}</span>
                </div>
              </div>
              <div className="bar-label">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SalesReports;