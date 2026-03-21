import { useState } from 'react';
import '../App5.css';

function EmployeeLogin() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res  = await fetch('http://localhost:5000/api/staff/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('employeeData', JSON.stringify({
          staffId:     data.staffId,
          fullName:    data.fullName,
          role:        data.role,
          email:       data.email,
          phoneNumber: data.phoneNumber,
        }));
        if (data.role === 'employer') {
          window.location.href = '/Empdashboard';
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch {
      setError('Connection error. Please try again.');
    }
  };

  return (
    <div className="emp-login-page">
      <div className="emp-login-hero">
        <div className="emp-login-overlay"></div>

        {/* ── BRAND ── */}
        <div className="emp-login-brand">
          <h1><span>SNA</span> DRIVING</h1>
          <div className="emp-login-brand-line"></div>
        </div>

        {/* ── CARD ── */}
        <div className="emp-login-content">
          <div className="emp-login-card">

            <div className="emp-login-header">
              <div className="emp-login-icon">
                <i className="fa-solid fa-user-tie"></i>
              </div>
              <h2>Employee Login</h2>
              <p>Sign in to access your SNA Driving School dashboard</p>
            </div>

            {error && (
              <div className="error-alert">
                <i className="fa-solid fa-circle-exclamation"></i>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  name="username"
                  required
                  placeholder="Enter your username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <button type="submit" className="emp-login-btn">
                <i className="fa-solid fa-right-to-bracket"></i>
                Login
              </button>
            </form>

            <div className="emp-login-footer">
              Forgot your password? Contact your administrator.
            </div>

          </div>
        </div>

        <div className="back-link">
          <a href="/"><i className="fa-solid fa-arrow-left"></i> Back to Home</a>
        </div>

      </div>
    </div>
  );
}

export default EmployeeLogin;