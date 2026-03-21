import { useState, useEffect } from 'react';

function ManageStaff({ staffInfo }) {
  const [staff, setStaff]           = useState([]);
  const [loading, setLoading]       = useState(false);
  const [showModal, setShowModal]   = useState(false);
  const [newStaff, setNewStaff]     = useState({
    fullName: '', username: '', password: '', phoneNumber: '', email: '', role: 'instructor',
  });

  useEffect(() => { loadStaff(); }, []);

  const loadStaff = async () => {
    setLoading(true);
    try {
      const res  = await fetch('http://localhost:5000/api/staff/all');
      const data = await res.json();
      if (res.ok) setStaff(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleAddStaff = async (e) => {
    e.preventDefault();
    try {
      const res  = await fetch('http://localhost:5000/api/staff/register', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff),
      });
      const data = await res.json();
      if (res.ok) {
        alert('Staff member added!');
        setShowModal(false);
        setNewStaff({ fullName: '', username: '', password: '', phoneNumber: '', email: '', role: 'instructor' });
        loadStaff();
      } else alert(data.message || 'Failed');
    } catch { alert('Connection error.'); }
  };

  const handleDelete = async (id, name) => {
    if (window.prompt(`Type "${name}" to confirm deletion:`) !== name) { alert('Cancelled'); return; }
    try {
      const res = await fetch(`http://localhost:5000/api/staff/delete/${id}`, { method: 'DELETE' });
      if (res.ok) { alert('Staff member deleted!'); loadStaff(); }
      else { const d = await res.json(); alert(d.message || 'Failed'); }
    } catch { alert('Connection error.'); }
  };

  const handleToggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'instructor' ? 'employer' : 'instructor';
    if (!window.confirm(`Change role to ${newRole}?`)) return;
    try {
      const res = await fetch(`http://localhost:5000/api/staff/update-role/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });
      if (res.ok) { alert(`Role updated to ${newRole}!`); loadStaff(); }
      else { const d = await res.json(); alert(d.message || 'Failed'); }
    } catch { alert('Connection error.'); }
  };

  return (
    <div className="employer-section">
      <div className="filters-section" style={{ justifyContent: 'flex-end' }}>
        <button className="add-button" onClick={() => setShowModal(true)}>
          <i className="fa-solid fa-plus"></i> Add Staff Member
        </button>
        <button className="btn-refresh" onClick={loadStaff} disabled={loading}>
          <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-rotate-right'}`}></i>
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      <div className="summary-cards">
        {[
          { label: 'Total Staff',  value: staff.length,                               icon: 'fa-users' },
          { label: 'Instructors',  value: staff.filter(s => s.role === 'instructor').length, icon: 'fa-chalkboard-user' },
          { label: 'Employers',    value: staff.filter(s => s.role === 'employer').length,   icon: 'fa-crown' },
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

      {staff.length === 0 ? (
        <div className="no-data"><i className="fa-solid fa-user-slash"></i><p>No staff members found</p></div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Username</th><th>Contact</th><th>Role</th><th>Joined</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {staff.map(member => {
                const isMe = member.staffId === staffInfo.staffId;
                return (
                  <tr key={member.staffId} className={isMe ? 'current-user-row' : ''}>
                    <td>
                      <strong>{member.fullName}</strong>
                      {isMe && <span className="you-badge">You</span>}
                    </td>
                    <td>{member.username}</td>
                    <td>{member.phoneNumber}<br /><small>{member.email || 'N/A'}</small></td>
                    <td>
                      <span className={`role-badge ${member.role}`}>
                        {member.role === 'employer'
                          ? <><i className="fa-solid fa-crown"></i> Employer</>
                          : <><i className="fa-solid fa-chalkboard-user"></i> Instructor</>}
                      </span>
                    </td>
                    <td>{new Date(member.createdAt).toLocaleDateString()}</td>
                    <td>
                      {isMe ? (
                        <span style={{ color: '#999', fontSize: 12 }}>Current user</span>
                      ) : (
                        <div className="action-buttons">
                          <button className="small-btn role-btn" onClick={() => handleToggleRole(member.staffId, member.role)}>
                            <i className="fa-solid fa-arrows-rotate"></i> Change Role
                          </button>
                          <button className="small-btn delete-btn" onClick={() => handleDelete(member.staffId, member.fullName)}>
                            <i className="fa-solid fa-trash"></i> Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Staff Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2><i className="fa-solid fa-user-plus" style={{ marginRight: 8 }}></i>Add Staff Member</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <form onSubmit={handleAddStaff} className="modal-form">
              {[
                { label: 'Full Name *',    name: 'fullName',    type: 'text',     required: true },
                { label: 'Username *',     name: 'username',    type: 'text',     required: true },
                { label: 'Password *',     name: 'password',    type: 'password', required: true },
                { label: 'Phone Number *', name: 'phoneNumber', type: 'tel',      required: true },
                { label: 'Email',          name: 'email',       type: 'email',    required: false },
              ].map(field => (
                <div key={field.name} className="form-group">
                  <label>{field.label}</label>
                  <input
                    type={field.type}
                    required={field.required}
                    value={newStaff[field.name]}
                    onChange={e => setNewStaff({...newStaff, [field.name]: e.target.value})}
                  />
                </div>
              ))}
              <div className="form-group">
                <label>Role *</label>
                <select value={newStaff.role} onChange={e => setNewStaff({...newStaff, role: e.target.value})} required>
                  <option value="instructor">Instructor</option>
                  <option value="employer">Employer</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn-primary">
                  <i className="fa-solid fa-user-plus"></i> Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageStaff;