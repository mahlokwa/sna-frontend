import { useState } from 'react';

function RegisterStudentTab() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    licenseType: '', address: '', emergencyContact: '', emergencyPhone: '',
  });
  const [generatedToken, setGeneratedToken] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculatePackagePricing = (packageType) => {
    const p = { packagePrice: 0, drivingLessonsPrice: 0, learnersFee: 0, totalLessons: 15, pricePerLesson: 200 };
    switch (packageType) {
      case 'code8': case 'code10': case 'code14':
        p.packagePrice = 3000; p.drivingLessonsPrice = 3000; break;
      case 'code8_learners': case 'code10_learners': case 'code14_learners':
        p.packagePrice = 3500; p.drivingLessonsPrice = 3000; p.learnersFee = 500; break;
      default: break;
    }
    return p;
  };

  const pricing = formData.licenseType ? calculatePackagePricing(formData.licenseType) : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const p = calculatePackagePricing(formData.licenseType);
    try {
      const res = await fetch('http://localhost:5000/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName:                `${formData.firstName} ${formData.lastName}`,
          phoneNumber:             formData.phone,
          email:                   formData.email,
          address:                 formData.address,
          package_type:            formData.licenseType,
          packagePrice:            p.packagePrice,
          drivingLessonsPrice:     p.drivingLessonsPrice,
          learnersFee:             p.learnersFee,
          totalLessons:            p.totalLessons,
          pricePerLesson:          p.pricePerLesson,
          emergency_contact_name:  formData.emergencyContact,
          emergency_contact_phone: formData.emergencyPhone,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setGeneratedToken(data.bookingToken);
        setFormData({ firstName: '', lastName: '', email: '', phone: '', licenseType: '', address: '', emergencyContact: '', emergencyPhone: '' });
      } else {
        alert(data.message || 'Failed to register student.');
      }
    } catch {
      alert('Connection error. Please try again.');
    }
  };

  return (
    <div>
      {generatedToken ? (
        <div className="dash-card">
          <div className="dash-card-body" style={{ textAlign: 'center' }}>
            <div className="dash-token-success">
              <i className="fa-solid fa-circle-check"></i>
              <h3>Student Registered Successfully!</h3>
              <p>Booking token for this student:</p>
              <div className="dash-token-value">{generatedToken}</div>
              <div className="dash-token-note">
                <i className="fa-solid fa-mobile-screen"></i>
                Give this token to the student — they need it to log in and book lessons
              </div>
              <button className="btn-primary" onClick={() => setGeneratedToken('')} style={{ marginTop: 20 }}>
                <i className="fa-solid fa-plus"></i> Register Another Student
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="reg-dash-grid">

            {/* ── Left column ── */}
            <div>
              <div className="dash-card" style={{ marginBottom: 20 }}>
                <div className="dash-card-header">
                  <h3><i className="fa-solid fa-user"></i> Personal Information</h3>
                </div>
                <div className="dash-card-body">
                  <div className="form-row">
                    <div className="reg-dash-group">
                      <label>First Name *</label>
                      <input type="text" name="firstName" required value={formData.firstName} onChange={handleChange} placeholder="e.g. Khomotso" />
                    </div>
                    <div className="reg-dash-group">
                      <label>Last Name *</label>
                      <input type="text" name="lastName" required value={formData.lastName} onChange={handleChange} placeholder="e.g. Mailula" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="reg-dash-group">
                      <label>Email Address *</label>
                      <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="student@email.com" />
                    </div>
                    <div className="reg-dash-group">
                      <label>Phone Number *</label>
                      <input type="tel" name="phone" required value={formData.phone} onChange={handleChange} placeholder="071 234 5678" />
                    </div>
                  </div>
                  <div className="reg-dash-group">
                    <label>Full Address *</label>
                    <textarea name="address" required value={formData.address} onChange={handleChange} placeholder="Street address, city, postal code" />
                  </div>
                </div>
              </div>

              <div className="dash-card">
                <div className="dash-card-header">
                  <h3><i className="fa-solid fa-heart-pulse"></i> Emergency Contact <span style={{ fontSize: 11, fontWeight: 400, color: '#999' }}>(Optional)</span></h3>
                </div>
                <div className="dash-card-body">
                  <div className="form-row">
                    <div className="reg-dash-group">
                      <label>Contact Name</label>
                      <input type="text" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} placeholder="Full name" />
                    </div>
                    <div className="reg-dash-group">
                      <label>Contact Phone</label>
                      <input type="tel" name="emergencyPhone" value={formData.emergencyPhone} onChange={handleChange} placeholder="071 234 5678" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right column ── */}
            <div>
              <div className="dash-card" style={{ marginBottom: 20 }}>
                <div className="dash-card-header">
                  <h3><i className="fa-solid fa-id-card"></i> Package Selection</h3>
                </div>
                <div className="dash-card-body">
                  <div className="reg-dash-group">
                    <label>Package Type *</label>
                    <select name="licenseType" required value={formData.licenseType} onChange={handleChange} className={formData.licenseType ? 'has-value' : ''}>
                      <option value="">Select a package</option>
                      <optgroup label="Driving Lessons Only — R3,000">
                        <option value="code8">Code 8 License</option>
                        <option value="code10">Code 10 License</option>
                        <option value="code14">Code 14 License</option>
                      </optgroup>
                      <optgroup label="Combo: Lessons + Learner's — R3,500">
                        <option value="code8_learners">Code 8 + Learner's License</option>
                        <option value="code10_learners">Code 10 + Learner's License</option>
                        <option value="code14_learners">Code 14 + Learner's License</option>
                      </optgroup>
                    </select>
                  </div>

                  {pricing && (
                    <div className="dash-pricing">
                      <div className="dash-pricing-pill">
                        <span>Driving Lessons</span>
                        <strong>R{pricing.drivingLessonsPrice.toLocaleString()}</strong>
                      </div>
                      {pricing.learnersFee > 0 && (
                        <div className="dash-pricing-pill">
                          <span>Learner's Fee</span>
                          <strong>R{pricing.learnersFee.toLocaleString()}</strong>
                        </div>
                      )}
                      <div className="dash-pricing-pill">
                        <span>Lessons Included</span>
                        <strong>{pricing.totalLessons} lessons</strong>
                      </div>
                      <div className="dash-pricing-pill total">
                        <span>Total Package Price</span>
                        <strong>R{pricing.packagePrice.toLocaleString()}</strong>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', padding: 16, fontSize: 15, justifyContent: 'center' }}>
                <i className="fa-solid fa-paper-plane"></i> Register Student
              </button>
            </div>

          </div>
        </form>
      )}
    </div>
  );
}

export default RegisterStudentTab;