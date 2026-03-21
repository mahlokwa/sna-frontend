import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Bookings from "./pages/Bookings";


import EmployeeLogin from "./pages/EmployeeLogin";
import PaymentRecord from './pages/PaymentRecord';
import TokenEntry from "./pages/TokenEntry";
import ManageBookings from "./pages/ManageBookings";
import InstructorDashboard from "./pages/InstructorDashboard"; // ← ADD THIS LINE
import EmployerDashboard from "./pages/EmployerDashboard";
import HomePage from "./pages/HomePage";
import Services from "./pages/Services";
import Pricing from "./pages/Pricing";
import Servicedetail from './pages/Servicedetail';
import RegisterStudentTab from "./pages/RegisterStudentTab";
import RegisterEmployeeTab from "./pages/RegisterEmployeeTab";
import Contact from "./pages/Contact";
import About from "./pages/About";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage/>} />
        <Route path="/Services" element={<Services/>} />
        <Route path="/Pricing" element={<Pricing/>} />
        <Route path="/Contact" element={<Contact/>} />
        <Route path="/About" element={<About/>} />
        <Route path="/services/:serviceType" element={<Servicedetail/>} />
        <Route path="/register" element={<RegisterStudentTab />} />
        <Route path= "/bookings" element={<Bookings/>}/>
        <Route path= "/Eregister" element={<RegisterEmployeeTab/>}/>
        <Route path= "/login" element={<EmployeeLogin/>}/>
        <Route path="/payment-record" element={<PaymentRecord />} />
        <Route path= "/custlogin" element={<TokenEntry/>}/>
        <Route path= "/manage-bookings" element={<ManageBookings/>}/>
        <Route path="/dashboard" element={<InstructorDashboard />} />
        <Route path="/Empdashboard" element={<EmployerDashboard/>} />
      </Routes>
    </Router>
  );
}

export default App;