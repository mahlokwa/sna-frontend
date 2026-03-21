import { useState } from 'react';

function RegisterEmployeeTab() {
  const [formData, setFormData] = useState({
    fullName: '', role: 'instructor', email: '',
    phoneNumber: '', username: '', password: '', adminCode: '',
  });
  const [showEmployerWarning, setShowEmployerWarning] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'role') setShowEmployerWarning(e.target.value === 'employer');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.role === 'employer') {
      const confirmed = window.confirm(
        '⚠️ WARNING: You are registering an EMPLOYER with full business access.\n\nAre you absolutely sure?'
      );
      if (!confirmed) return;
    }
    try {
      const res  = await fetch('http://localhost:5000/api/staff/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setFormData({ fullName: '', role: 'instructor', email: '', phoneNumber: '', username: '', password: '', adminCode: '' });
        setShowEmployerWarning(false);
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch {
      alert('Connection error. Please try again.');
    }
  };

  return (
    <div>
      {success ? (
        <div className="dash-card">
          <div className="dash-card-body" style={{ textAlign: 'center', padding: 40 }}>
            <div className="dash-token-success">
              <i className="fa-solid fa-circle-check"></i>
              <h3>Employee Registered Successfully!</h3>
              <p>They can now log in using their username and password.</p>
              <button className="btn-primary" onClick={() => setSuccess(false)} style={{ marginTop: 20 }}>
                <i className="fa-solid fa-plus"></i> Register Another Employee
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="dash-card" style={{ maxWidth: 600 }}>
          <div className="dash-card-header">
            <h3><i className="fa-solid fa-user-tie"></i> Employee Details</h3>
          </div>
          <div className="dash-card-body">
            <form onSubmit={handleSubmit}>

              <div className="reg-dash-group">
                <label>Full Name *</label>
                <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} placeholder="Enter full name" />
              </div>

              <div className="reg-dash-group">
                <label>Role *</label>
                <select name="role" required value={formData.role} onChange={handleChange}>
                  <option value="instructor">Instructor — Can accept bookings</option>
                  <option value="employer">Employer — Full business access</option>
                </select>
                {showEmployerWarning && (
                  <div style={{
                    display: 'flex', gap: 10, alignItems: 'flex-start',
                    marginTop: 10, padding: '12px 14px',
                    background: '#fff3cd', borderLeft: '3px solid #ffc107',
                    fontSize: 13, color: '#856404',
                  }}>
                    <i className="fa-solid fa-triangle-exclamation" style={{ marginTop: 2, color: '#d4a017' }}></i>
                    <span><strong>Warning:</strong> Employers have full access to all business data and can delete customers and staff.</span>
                  </div>
                )}
              </div>

              <div className="form-row">
                <div className="reg-dash-group">
                  <label>Email Address *</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="employee@email.com" />
                </div>
                <div className="reg-dash-group">
                  <label>Phone Number *</label>
                  <input type="tel" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange} placeholder="071 234 5678" />
                </div>
              </div>

              <div className="form-row">
                <div className="reg-dash-group">
                  <label>Username *</label>
                  <input type="text" name="username" required value={formData.username} onChange={handleChange} placeholder="Choose a username" />
                </div>
                <div className="reg-dash-group">
                  <label>Password *</label>
                  <input type="password" name="password" required value={formData.password} onChange={handleChange} placeholder="Create a password" />
                </div>
              </div>

              <div className="reg-dash-group">
                <label>Admin Code *</label>
                <input type="password" name="adminCode" required value={formData.adminCode} onChange={handleChange} placeholder="Enter admin verification code" />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: 16, fontSize: 15, justifyContent: 'center', marginTop: 8 }}>
                <i className="fa-solid fa-user-plus"></i> Register Employee
              </button>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default RegisterEmployeeTab;