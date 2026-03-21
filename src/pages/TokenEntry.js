import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App4.css';
import { Key, Loader, AlertCircle, Mail } from 'lucide-react';

function TokenEntry() {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerifyToken = async (e) => {
    e.preventDefault();
    
    if (!token.trim()) {
      setError('Please enter your booking token');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/bookings/verify-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim().toUpperCase() })
      });

      const data = await res.json();

      if (res.ok) {
        // Store customer data in localStorage
        localStorage.setItem('customerBookingData', JSON.stringify(data.customer));
        
        // Redirect to booking page
        navigate('/Bookings');
      } else {
        setError(data.message || 'Invalid token');
      }
    } catch (error) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="token-entry-page">
      {/* Hero Background */}
      <div className="token-hero">
        <div className="token-overlay"></div>
        
        {/* Logo/Brand */}
        <div className="token-brand">
          <h1><span>SNA</span> DRIVING</h1>
        </div>

        {/* Main Content */}
        <div className="token-content">
          <div className="token-card">
            <div className="token-header">
              <div className="token-icon">
                <Key size={32} />
              </div>
              <h2>Access Your Bookings</h2>
              <p>Enter your booking token to view and manage your driving lessons</p>
            </div>

            {error && (
              <div className="error-alert">
                <AlertCircle size={20} />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleVerifyToken} className="token-form">
              <div className="form-group">
                <label>Booking Token</label>
                <input
                  type="text"
                  value={token}
                  onChange={(e) => setToken(e.target.value.toUpperCase())}
                 
                  maxLength="13"
                  className="token-input"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="token-submit-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader size={20} className="spinner" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Key size={20} />
                    Access My Bookings
                  </>
                )}
              </button>
            </form>

            <div className="token-help">
              <div className="help-icon">
                <Mail size={18} />
              </div>
              <div className="help-content">
                <h4>Don't have a token?</h4>
                <p>
                  Your booking token was provided when you registered. Check your email, SMS, or contact us at{' '}
                  <a href="mailto:info@snadrivingschool.co.za">info@snadrivingschool.co.za</a> to register as a customer
                </p>
              </div>
            </div>
          </div>

          {/* Back to Home Link */}
          <div className="back-link">
            <a href="/">← Back to Homepage</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TokenEntry;