import { useState, useEffect } from 'react';
import AllPayments from './employer/AllPayments';
import AllBookings from './employer/AllBookings';
import SalesReports from './employer/SalesReports';
import ManageCustomers from './employer/ManageCustomers';
import ManageStaff from './employer/ManageStaff';
import AvailableBookings from './AvailableBookings';
import MySchedule from './MySchedule';
import PaymentRecord from './PaymentRecord';
import RegisterStudentTab from './RegisterStudentTab';
import RegisterEmployeeTab from './RegisterEmployeeTab';
import '../App.css';

function EmployerDashboard() {
  const [currentTab, setCurrentTab] = useState(0);
  const [staffInfo, setStaffInfo] = useState(null);

  useEffect(() => {
    const employeeData = localStorage.getItem('employeeData');
    if (employeeData) {
      const data = JSON.parse(employeeData);
      if (data.role !== 'employer') {
        alert('Access denied. Employer access only.');
        window.location.href = '/dashboard';
        return;
      }
      setStaffInfo(data);
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
    { icon: 'fa-circle-dollar-to-slot', label: 'Payments' },
    { icon: 'fa-calendar-days',         label: 'Bookings' },
    { icon: 'fa-chart-bar',             label: 'Reports' },
    { icon: 'fa-users',                 label: 'Customers' },
    { icon: 'fa-user-tie',              label: 'Staff' },
    { icon: 'fa-money-bill-wave',       label: 'Record' },
    { icon: 'fa-inbox',                 label: 'Available' },
    { icon: 'fa-calendar-check',        label: 'Schedule' },
    { icon: 'fa-user-plus',             label: 'Reg. Student' },
    { icon: 'fa-id-badge',              label: 'Reg. Employee' },
  ];

  return (
    <div className="dashboard-wrapper">

      {/* ── HEADER ── */}
      <div className="dashboard-top-header employer-header">
        <div className="header-info">
          <div className="header-logo"><span>SNA</span> DRIVING</div>
          <div className="header-divider"></div>
          <div className="header-title">Employer Dashboard</div>
          <div className="staff-display employer-badge">
            <span className="staff-display-name">{staffInfo.fullName}</span>
            <span className="staff-display-role">
              <i className="fa-solid fa-crown" style={{ color: '#ff0000', marginRight: 4, fontSize: 10 }}></i>
              {staffInfo.role}
            </span>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-button">
          <i className="fa-solid fa-right-from-bracket" style={{ marginRight: 6 }}></i>
          Logout
        </button>
      </div>

      {/* ── TOP TABS (tablet + desktop) ── */}
      <div className="employer-tabs-wrapper">
        <div className="employer-tabs">
          {tabs.map((tab, i) => (
            <button
              key={i}
              className={`employer-tab ${currentTab === i ? 'active-tab' : ''}`}
              onClick={() => setCurrentTab(i)}
            >
              <i className={`fa-solid ${tab.icon}`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="dashboard-tab-content">
        {currentTab === 0 && <AllPayments staffInfo={staffInfo} />}
        {currentTab === 1 && <AllBookings staffInfo={staffInfo} />}
        {currentTab === 2 && <SalesReports staffInfo={staffInfo} />}
        {currentTab === 3 && <ManageCustomers staffInfo={staffInfo} />}
        {currentTab === 4 && <ManageStaff staffInfo={staffInfo} />}
        {currentTab === 5 && <PaymentRecord />}
        {currentTab === 6 && <AvailableBookings staffInfo={staffInfo} />}
        {currentTab === 7 && <MySchedule staffInfo={staffInfo} />}
        {currentTab === 8 && <RegisterStudentTab />}
        {currentTab === 9 && <RegisterEmployeeTab />}
      </div>

      {/* ── BOTTOM NAV (phone only) ── */}
      <nav className="employer-bottom-nav">
        {tabs.map((tab, i) => (
          <button
            key={i}
            className={`employer-bottom-btn ${currentTab === i ? 'active-tab' : ''}`}
            onClick={() => setCurrentTab(i)}
          >
            <i className={`fa-solid ${tab.icon}`}></i>
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>

    </div>
  );
}

export default EmployerDashboard;