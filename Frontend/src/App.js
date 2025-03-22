import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from 'react-query';
import { useEffect, useContext } from "react";
import Cookies from "js-cookie";
import {
  AdminRoute,
  DonorRoute,
  StudentRoute
} from "./routes/RouteCegories";
import AdminNavbar from "./pages/Admin/adminNavbar";

import Navbarhome from "./pages/home/Navbarhome";
import Navbarstudent from "./pages/Student/studentNavbar";

import Navbardonor from "./pages/Donor/donorNavbar"
import Dashboard from "./pages/home/DashBoard";
import Contactus from "./pages/home/contact";
import AboutUs from "./pages/home/about";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { StudentContext } from "./api/studentContext";
import StudentDashboard from "./pages/Student/StudentDashboard";

import PaymentForm from "./pages/Donor/DonorDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";

// import Dashboard from "./pages/Student/StudentDashboard"

function App() {
  const queryClient = new QueryClient();


  const { roleValue, setRolevalue, userEmailID } = useContext(StudentContext);
  console.log(roleValue);

  useEffect(() => {
    const storedRole = Cookies.get("role");
    setRolevalue(storedRole || "guest");
    console.log(roleValue);
    setRolevalue(localStorage.getItem("role"));


  }, [roleValue]);





  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>

        {roleValue ? (
          roleValue === "admin" ? <AdminNavbar userEmail={userEmailID}/> :
            roleValue === "student" ? <Navbarstudent userEmail={userEmailID}/> :
              roleValue === "donor" ? <Navbardonor userEmail={userEmailID}/> :
                <Navbarhome />
        ) : (
          <Navbarhome />
        )}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/contactus" element={<Contactus />} />
          <Route path="/aboutus" element={<AboutUs />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Admin Routes */}
          <Route path="/admin/admin_dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          

          {/* Student Routes */}
          <Route path="/student/student_dashboard" element={<StudentRoute><StudentDashboard /></StudentRoute>} />
          
          {/* Donor Routes */}
          <Route path="/donor/donor_dashboard" element={<DonorRoute><PaymentForm /></DonorRoute>} />
          <Route path="/*" element={<><h1>Page not found</h1></>} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;