import { useState, useEffect } from 'react';

function PaymentRecord() {
  const [searchTerm, setSearchTerm]               = useState('');
  const [customers, setCustomers]                 = useState([]);
  const [selectedCustomer, setSelectedCustomer]   = useState(null);
  const [customerFinancials, setCustomerFinancials] = useState(null);
  const [paymentData, setPaymentData]             = useState({
    packageDescription: '', amountPaid: '',
    amountTowardLessons: '', amountTowardLearners: '', notes: '',
  });
  const [staffInfo, setStaffInfo]       = useState(null);
  const [recentPayments, setRecentPayments] = useState([]);

  useEffect(() => {
    const employeeData = localStorage.getItem('employeeData');
    if (employeeData) { setStaffInfo(JSON.parse(employeeData)); fetchRecentPayments(); }
    else alert('Please login first');
  }, []);

  const fetchRecentPayments = async () => {
    try {
      const res  = await fetch('http://localhost:5000/api/payments/recent');
      const data = await res.json();
      if (res.ok) setRecentPayments(data);
    } catch (e) { console.error(e); }
  };

  const fetchCustomerFinancials = async (customerId) => {
    try {
      const res      = await fetch(`http://localhost:5000/api/customers/${customerId}`);
      const customer = await res.json();
      if (!res.ok) return;
      const paymentsRes = await fetch(`http://localhost:5000/api/payments/customer/${customerId}`);
      const payments    = paymentsRes.ok ? await paymentsRes.json() : [];
      const totalPaid             = payments.reduce((s, p) => s + parseFloat(p.amountPaid || 0), 0);
      const totalTowardLessons    = payments.reduce((s, p) => s + parseFloat(p.amountTowardLessons || 0), 0);
      const totalTowardLearners   = payments.reduce((s, p) => s + parseFloat(p.amountTowardLearners || 0), 0);
      const balanceOwing          = parseFloat(customer.packagePrice || 0) - totalPaid;
      const lessonsUnlocked       = Math.floor(totalTowardLessons / parseFloat(customer.pricePerLesson || 200));
      setCustomerFinancials({
        packageType: customer.package_type, packagePrice: parseFloat(customer.packagePrice || 0),
        drivingLessonsPrice: parseFloat(customer.drivingLessonsPrice || 0),
        learnersFee: parseFloat(customer.learnersFee || 0), totalLessons: customer.totalLessons || 0,
        pricePerLesson: parseFloat(customer.pricePerLesson || 200), totalPaid,
        totalTowardLessons, totalTowardLearners, balanceOwing, lessonsUnlocked,
        lessonsUsed: customer.lessonsUsed || 0,
        lessonsRemaining: lessonsUnlocked - (customer.lessonsUsed || 0),
      });
    } catch (e) { console.error(e); }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) { alert('Please enter a customer name'); return; }
    try {
      const res  = await fetch(`http://localhost:5000/api/customers/search?name=${searchTerm}`);
      const data = await res.json();
      if (res.ok) { setCustomers(data); if (data.length === 0) alert('No customers found'); }
      else alert('Error searching customers');
    } catch { alert('Connection error. Please try again.'); }
  };

  const handleSelectCustomer = (customer) => {
    setSelectedCustomer(customer); setCustomers([]); setSearchTerm('');
    fetchCustomerFinancials(customer.customerId);
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentData({ ...paymentData, [name]: value });
    if (name === 'amountPaid' && customerFinancials) {
      const amount          = parseFloat(value) || 0;
      const learnersFeeOwing = customerFinancials.learnersFee - customerFinancials.totalTowardLearners;
      let towardLearners = 0, towardLessons = 0;
      if (learnersFeeOwing > 0) {
        towardLearners = Math.min(amount, learnersFeeOwing);
        towardLessons  = amount - towardLearners;
      } else { towardLessons = amount; }
      setPaymentData(prev => ({ ...prev, amountTowardLessons: towardLessons.toFixed(2), amountTowardLearners: towardLearners.toFixed(2) }));
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    if (!selectedCustomer) { alert('Please select a customer first'); return; }
    const amountPaid     = parseFloat(paymentData.amountPaid);
    const towardLessons  = parseFloat(paymentData.amountTowardLessons) || 0;
    const towardLearners = parseFloat(paymentData.amountTowardLearners) || 0;
    if (!amountPaid || amountPaid <= 0) { alert('Please enter a valid payment amount'); return; }
    if (towardLessons + towardLearners !== amountPaid) {
      alert(`Allocation mismatch!\nAmount Paid: R${amountPaid.toFixed(2)}\nAllocated: R${(towardLessons + towardLearners).toFixed(2)}`);
      return;
    }
    try {
      const res  = await fetch('http://localhost:5000/api/payments/record', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: selectedCustomer.customerId,
          packageDescription: paymentData.packageDescription,
          amountPaid, amountTowardLessons: towardLessons, amountTowardLearners: towardLearners,
          amountOwing: customerFinancials.balanceOwing - amountPaid,
          notes: paymentData.notes, recordedBy: staffInfo.fullName, staffId: staffInfo.staffId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert(`Payment of R${amountPaid.toFixed(2)} recorded successfully!`);
        clearSelection(); fetchRecentPayments();
      } else alert(data.message || 'Error recording payment');
    } catch { alert('Connection error. Please try again.'); }
  };

  const clearSelection = () => {
    setSelectedCustomer(null); setCustomerFinancials(null);
    setPaymentData({ packageDescription: '', amountPaid: '', amountTowardLessons: '', amountTowardLearners: '', notes: '' });
  };

  const allocated = parseFloat(paymentData.amountTowardLessons || 0) + parseFloat(paymentData.amountTowardLearners || 0);
  const allocationMatch = paymentData.amountPaid && allocated === parseFloat(paymentData.amountPaid || 0);

  return (
    <div>
      <div className="payment-columns" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>

        {/* ── LEFT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Search */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3><i className="fa-solid fa-magnifying-glass"></i> Search Customer</h3>
            </div>
            <div className="dash-card-body">
              <div style={{ display: 'flex', gap: 10 }}>
                <input
                  className="pay-input"
                  type="text"
                  placeholder="Enter customer name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  style={{ flex: 1 }}
                />
                <button className="btn-primary" onClick={handleSearch}>
                  <i className="fa-solid fa-magnifying-glass"></i> Search
                </button>
              </div>

              {customers.length > 0 && (
                <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#999', marginBottom: 4 }}>Results</div>
                  {customers.map((c) => (
                    <div key={c.customerId} className="customer-result-item" onClick={() => handleSelectCustomer(c)}>
                      <div style={{ fontWeight: 700, color: '#1a1a1a', fontSize: 14 }}>{c.fullName}</div>
                      <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
                        <i className="fa-solid fa-phone" style={{ color: '#ff0000', marginRight: 5, fontSize: 10 }}></i>{c.phoneNumber}
                        {c.email && <span style={{ marginLeft: 12 }}><i className="fa-solid fa-envelope" style={{ color: '#ff0000', marginRight: 5, fontSize: 10 }}></i>{c.email}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Selected customer + financials */}
          {selectedCustomer && customerFinancials && (
            <>
              <div className="dash-card">
                <div className="dash-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3><i className="fa-solid fa-user"></i> Selected Customer</h3>
                  <button className="btn-outline" onClick={clearSelection} style={{ padding: '6px 12px', fontSize: 12 }}>
                    <i className="fa-solid fa-xmark"></i> Change
                  </button>
                </div>
                <div className="dash-card-body">
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#1a1a1a', marginBottom: 4 }}>{selectedCustomer.fullName}</div>
                  <div style={{ fontSize: 13, color: '#666', display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <span><i className="fa-solid fa-phone" style={{ color: '#ff0000', marginRight: 6, fontSize: 11 }}></i>{selectedCustomer.phoneNumber}</span>
                    {selectedCustomer.email && <span><i className="fa-solid fa-envelope" style={{ color: '#ff0000', marginRight: 6, fontSize: 11 }}></i>{selectedCustomer.email}</span>}
                  </div>
                </div>
              </div>

              <div className="dash-card">
                <div className="dash-card-header">
                  <h3><i className="fa-solid fa-chart-bar"></i> Package & Payment Status</h3>
                </div>
                <div className="dash-card-body">
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
                    {[
                      { label: 'Package',         value: customerFinancials.packageType },
                      { label: 'Package Price',    value: `R${customerFinancials.packagePrice.toFixed(2)}` },
                      { label: 'Total Paid',       value: `R${customerFinancials.totalPaid.toFixed(2)}`,      green: true },
                      { label: 'Balance Owing',    value: `R${customerFinancials.balanceOwing.toFixed(2)}`,   red: customerFinancials.balanceOwing > 0 },
                      { label: 'Lessons Unlocked', value: `${customerFinancials.lessonsUnlocked} / ${customerFinancials.totalLessons}` },
                      { label: 'Lessons Remaining',value: customerFinancials.lessonsRemaining },
                    ].map((item, i) => (
                      <div key={i} style={{ background: '#f8f8f8', borderRadius: 4, padding: '10px 12px' }}>
                        <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#999', marginBottom: 4 }}>{item.label}</div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: item.green ? '#16a34a' : item.red ? '#ff0000' : '#1a1a1a' }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ borderTop: '1px solid #e0e0e0', paddingTop: 14 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#999', marginBottom: 10 }}>Payment Breakdown</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[
                        { label: `Driving Lessons (R${customerFinancials.drivingLessonsPrice})`, paid: customerFinancials.totalTowardLessons },
                        { label: `Learner's Fee (R${customerFinancials.learnersFee})`,           paid: customerFinancials.totalTowardLearners },
                      ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#666' }}>
                          <span>{item.label}</span>
                          <strong style={{ color: '#1a1a1a' }}>R{item.paid.toFixed(2)} paid</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Payment form */}
          {selectedCustomer && customerFinancials && (
            <div className="dash-card">
              <div className="dash-card-header">
                <h3><i className="fa-solid fa-circle-dollar-to-slot"></i> Record New Payment</h3>
              </div>
              <div className="dash-card-body">
                <form onSubmit={handleSubmitPayment}>

                  <div className="reg-dash-group">
                    <label>Package Description *</label>
                    <input className="pay-input" type="text" name="packageDescription"
                      placeholder="e.g. Installment payment, Full package"
                      value={paymentData.packageDescription} onChange={handlePaymentChange} required />
                  </div>

                  <div className="reg-dash-group">
                    <label>Total Amount Paid (R) *</label>
                    <input className="pay-input" type="number" name="amountPaid"
                      placeholder="0.00" step="0.01" min="0"
                      value={paymentData.amountPaid} onChange={handlePaymentChange} required />
                  </div>

                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1, color: '#999', marginBottom: 10, paddingBottom: 8, borderBottom: '1px solid #e0e0e0' }}>
                      Allocate Payment
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                      <div className="reg-dash-group" style={{ marginBottom: 0 }}>
                        <label>Toward Driving Lessons (R)</label>
                        <input className="pay-input" type="number" name="amountTowardLessons"
                          placeholder="0.00" step="0.01" min="0"
                          value={paymentData.amountTowardLessons} onChange={handlePaymentChange} required />
                        <span style={{ fontSize: 11, color: '#999', marginTop: 4 }}>R200 per lesson</span>
                      </div>
                      <div className="reg-dash-group" style={{ marginBottom: 0 }}>
                        <label>Toward Learner's Fee (R)</label>
                        <input className="pay-input" type="number" name="amountTowardLearners"
                          placeholder="0.00" step="0.01" min="0"
                          value={paymentData.amountTowardLearners} onChange={handlePaymentChange} required />
                        <span style={{ fontSize: 11, color: '#999', marginTop: 4 }}>Doesn't unlock lessons</span>
                      </div>
                    </div>

                    {paymentData.amountPaid && (
                      <div style={{ marginTop: 12, padding: '10px 14px', background: allocationMatch ? '#f0fdf4' : '#fff5f5', border: `1px solid ${allocationMatch ? '#bbf7d0' : '#fca5a5'}`, borderRadius: 4, fontSize: 13 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: allocationMatch ? '#16a34a' : '#ff0000' }}>
                          <span><i className={`fa-solid ${allocationMatch ? 'fa-circle-check' : 'fa-triangle-exclamation'}`} style={{ marginRight: 6 }}></i>Total Allocated</span>
                          <span>R{allocated.toFixed(2)} / R{parseFloat(paymentData.amountPaid || 0).toFixed(2)}</span>
                        </div>
                        {parseFloat(paymentData.amountTowardLessons || 0) > 0 && (
                          <div style={{ marginTop: 6, color: '#666' }}>
                            <i className="fa-solid fa-book-open" style={{ color: '#ff0000', marginRight: 6, fontSize: 11 }}></i>
                            Will unlock {Math.floor(parseFloat(paymentData.amountTowardLessons || 0) / customerFinancials.pricePerLesson)} new lesson(s)
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="reg-dash-group">
                    <label>Notes <span style={{ fontWeight: 400, color: '#999', fontSize: 11 }}>(Optional)</span></label>
                    <textarea className="pay-input" name="notes" rows="3"
                      placeholder="Additional notes about this payment..."
                      value={paymentData.notes} onChange={handlePaymentChange}
                      style={{ resize: 'vertical', minHeight: 70 }} />
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: 14 }}>
                    <i className="fa-solid fa-circle-dollar-to-slot"></i> Record Payment
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Recent payments */}
          <div className="dash-card">
            <div className="dash-card-header">
              <h3><i className="fa-solid fa-clock-rotate-left"></i> Recent Payments</h3>
            </div>
            <div className="dash-card-body">
              {recentPayments.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {recentPayments.map((payment) => (
                    <div key={payment.paymentId} style={{ padding: '14px', background: '#f8f8f8', borderRadius: 4, borderLeft: '3px solid #ff0000' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: 14, color: '#1a1a1a' }}>{payment.customerName}</span>
                        <span style={{ fontWeight: 700, fontSize: 15, color: '#16a34a' }}>R{parseFloat(payment.amountPaid).toFixed(2)}</span>
                      </div>
                      <div style={{ fontSize: 13, color: '#666', marginBottom: 6 }}>{payment.packageDescription}</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#999' }}>
                        <span><i className="fa-solid fa-user" style={{ marginRight: 4 }}></i>{payment.recordedBy}</span>
                        <span><i className="fa-solid fa-calendar" style={{ marginRight: 4 }}></i>{new Date(payment.paymentDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '32px 20px', color: '#999' }}>
                  <i className="fa-solid fa-receipt" style={{ fontSize: 36, color: '#e0e0e0', display: 'block', marginBottom: 12 }}></i>
                  No recent payments
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default PaymentRecord;