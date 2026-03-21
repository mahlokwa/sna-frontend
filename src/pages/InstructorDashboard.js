import { useState, useEffect } from 'react';
import PaymentRecord from './PaymentRecord';
import AvailableBookings from './AvailableBookings';
import MySchedule from './MySchedule';
import RegisterStudentTab from './RegisterStudentTab';
import '../App5.css';

function InstructorDashboard() {
  const [currentTab, setCurrentTab] = useState(0);
  const [staffInfo, setStaffInfo]   = useState(null);

  useEffect(() => {
    const employeeData = localStorage.getItem('employeeData');
    if (employeeData) {
      setStaffInfo(JSON.parse(employeeData));
    } else {
      alert('Please login first');
      window.location.href = '/login';
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('employeeData');
    window.location.href = '/login';
  };

  if (!staffInfo) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        Loading...
      </div>
    );
  }

  const tabs = [
    { label: 'Available Bookings', icon: 'fa-calendar-days' },
    { label: 'My Schedule',        icon: 'fa-calendar-check' },
    { label: 'Payments',           icon: 'fa-circle-dollar-to-slot' },
    { label: 'Register Student',   icon: 'fa-user-plus' },
  ];

  return (
    <div className="dashboard-wrapper">

      {/* ── HEADER ── */}
      <div className="dashboard-top-header">
        <div className="header-info">
          <div className="header-logo"><span>SNA</span> DRIVING</div>
          <div className="header-divider"></div>
          <div className="header-title">Instructor Dashboard</div>
          <div className="staff-display">
            <span className="staff-display-name">{staffInfo.fullName}</span>
            <span className="staff-display-role">{staffInfo.role}</span>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-button">
          <i className="fa-solid fa-right-from-bracket" style={{ marginRight: 6 }}></i>
          Logout
        </button>
      </div>

      {/* ── TABS ── */}
      <div className="dashboard-tabs">
        {tabs.map((tab, i) => (
          <button
            key={i}
            className={`dashboard-tab ${currentTab === i ? 'active-tab' : ''}`}
            onClick={() => setCurrentTab(i)}
          >
            <i className={`fa-solid ${tab.icon}`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <div className="dashboard-tab-content">
        {currentTab === 0 && <AvailableBookings staffInfo={staffInfo} />}
        {currentTab === 1 && <MySchedule staffInfo={staffInfo} />}
        {currentTab === 2 && <PaymentRecord />}
        {currentTab === 3 && <RegisterStudentTab />}
      </div>

    </div>
  );
}

export default InstructorDashboard;