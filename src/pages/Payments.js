import React, { useState, useEffect } from 'react';
import { DollarSign, Plus, CreditCard, Banknote, Building } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const Payments = ({ instructor, showToast, setCount }) => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);

  useEffect(() => {
    loadPayments();
  }, []);

  const loadPayments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/instructor/payments`, {
        credentials: 'include'
      });
      const data = await response.json();

      if (data.success) {
        setPayments(data.payments);
        setCount(data.payments.length);
      }
    } catch (error) {
      console.error('Failed to load payments:', error);
      showToast('Failed to load payments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="payments-container">
      <div className="payments-header">
        <button 
          className="btn btn-primary"
          onClick={() => setShowRecordModal(true)}
        >
          <Plus size={16} />
          Record New Payment
        </button>
      </div>

      {payments.length === 0 ? (
        <div className="empty-state">
          <DollarSign size={64} />
          <h3>No payments recorded</h3>
          <p>Record payments after completing lessons</p>
        </div>
      ) : (
        <div className="payments-table-container">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Customer</th>
                <th>Lesson Date</th>
                <th>Type</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Notes</th>
              </tr>
            </thead>
            <tbody>
              {payments.map(payment => {
                const paymentDate = new Date(payment.payment_date);
                const lessonDate = new Date(payment.lesson_date);
                return (
                  <tr key={payment.id}>
                    <td>{paymentDate.toLocaleDateString()}</td>
                    <td>{payment.customer_name}</td>
                    <td>{lessonDate.toLocaleDateString()}</td>
                    <td>
                      <span className="lesson-type-badge">{payment.lesson_type}</span>
                    </td>
                    <td>
                      <div className="payment-method">
                        {payment.payment_method === 'cash' && <Banknote size={14} />}
                        {payment.payment_method === 'card' && <CreditCard size={14} />}
                        {payment.payment_method === 'transfer' && <Building size={14} />}
                        {payment.payment_method}
                      </div>
                    </td>
                    <td className="amount">${payment.amount.toFixed(2)}</td>
                    <td>{payment.notes || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="5" className="total-label">Total:</td>
                <td className="total-amount">${totalAmount.toFixed(2)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      {showRecordModal && (
        <RecordPaymentModal
          onClose={() => setShowRecordModal(false)}
          onSuccess={() => {
            setShowRecordModal(false);
            loadPayments();
            showToast('Payment recorded successfully', 'success');
          }}
          showToast={showToast}
        />
      )}
    </div>
  );
};

const RecordPaymentModal = ({ onClose, onSuccess, showToast }) => {
  const [unpaidBookings, setUnpaidBookings] = useState([]);
  const [formData, setFormData] = useState({
    bookingId: '',
    amount: '',
    paymentMethod: 'cash',
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUnpaidBookings();
  }, []);

  const loadUnpaidBookings = async () => {
    try {
      const response = await fetch(`${API_URL}/instructor/dashboard/my-schedule`, {
        credentials: 'include'
      });
      const data = await response.json();

      if (data.success) {
        const unpaid = data.bookings.filter(b => 
          b.status === 'confirmed' && b.payment_status === 'unpaid'
        );
        setUnpaidBookings(unpaid);
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
      showToast('Failed to load bookings', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.bookingId || !formData.amount) {
      showToast('Please select a booking and enter an amount', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/instructor/payment/record`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          booking_id: parseInt(formData.bookingId),
          amount: parseFloat(formData.amount),
          payment_method: formData.paymentMethod,
          notes: formData.notes
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        onSuccess();
      } else {
        showToast(data.message, 'error');
      }
    } catch (error) {
      console.error('Record payment failed:', error);
      showToast('Failed to record payment', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Record Payment</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Select Booking</label>
            <select
              value={formData.bookingId}
              onChange={(e) => handleChange('bookingId', e.target.value)}
              required
            >
              <option value="">Choose a booking...</option>
              {unpaidBookings.map(booking => {
                const lessonDate = new Date(booking.lesson_date);
                return (
                  <option key={booking.id} value={booking.id}>
                    {booking.customer_name} - {lessonDate.toLocaleDateString()} - {booking.lesson_type}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              step="0.01"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => handleChange('paymentMethod', e.target.value)}
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="transfer">Bank Transfer</option>
            </select>
          </div>

          <div className="form-group">
            <label>Notes (optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              placeholder="Any additional notes..."
            />
          </div>

          <div className="modal-actions">
            <button 
              type="button"
              className="btn"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="btn btn-success"
              disabled={loading}
            >
              {loading ? 'Recording...' : 'Record Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payments;