import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppNavbar from "./components/AppNavigation/AppNavbar";
import "bootstrap/dist/css/bootstrap.min.css";
import PatientHomePage from "./pages/Patient/PatientHomePage";
import PatientViewDoctors from "./pages/Patient/PatientViewDoctors";
import PatientProfile from "./pages/Patient/PatientProfile";
import AdminHomePage from "./pages/Admin/AdminHomePage";
import AdminPatientsPage from "./pages/Admin/AdminPatientsPage";
import AdminDoctorsPage from "./pages/Admin/AdminDoctorsPage";
import PatientViewPrescriptions from "./pages/Patient/PatientViewPrescriptions";
import PatientViewAppointments from "./pages/Patient/PatientViewAppointments";
import DrHomePage from "./pages/Doctor/DrHomePage";
import AdminPackagesPage from "./pages/Admin/AdminPackagesPage";
import AdminAdminsPage from "./pages/Admin/AdminAdminsPage";

import GuestHomePage from "./pages/Guest/GuestHomePage";

import Login from "./pages/Guest/Login";
import PatientSignup from "./pages/Guest/PatientSignup";
import DrSignup from "./pages/Guest/DrSignup";
import DrAppointments from "./pages/Doctor/DrAppointments";

import ProfilePage from "./pages/Doctor/DrProfile";

import DrPatients from "./pages/Doctor/DrPatients";
import PatientOneDoctor from "./pages/Patient/PatientOneDoctor";

function App() {
  return (
    <div className="bg-light">
      <Routes>
        <Route path="/" element={<GuestHomePage />} />
        <Route path="login">
          <Route index element={<Login />} />
        </Route>
        <Route path="patient-signup">
          <Route index element={<PatientSignup />} />
        </Route>
        <Route path="doctor-signup">
          <Route index element={<DrSignup />} />
        </Route>

        <Route path="patient">
          <Route index element={<PatientHomePage />} />
          <Route path="view-doctors">
            <Route index element={<PatientViewDoctors />} />
            <Route path=":index" element={<PatientOneDoctor />} />
          </Route>

          <Route
            path="view-appointments"
            element={<PatientViewAppointments />}
          />
          <Route
            path="view-prescriptions"
            element={<PatientViewPrescriptions />}
          />
          <Route path="profile" element={<PatientProfile />} />
        </Route>

        <Route path="doctor">
          <Route index element={<DrHomePage />} />

          <Route path="doctor-profile" element={<ProfilePage />} />

          <Route path="doctor-appointments" element={<DrAppointments />} />
          <Route path="doctor-patients" element={<DrPatients />} />
        </Route>

        <Route path="GuestHomePage">
          <Route index element={<GuestHomePage />} />
        </Route>

        <Route path="admin">
          <Route index element={<AdminHomePage />} />
          <Route path="doctors-list" element={<AdminDoctorsPage />} />
          <Route path="patients-list" element={<AdminPatientsPage />} />
          <Route path="admins-list" element={<AdminAdminsPage />} />
          <Route path="packages" element={<AdminPackagesPage />} />
        </Route>
        <Route path="*" element={<>Page not found</>} />
      </Routes>
    </div>
  );
}

export default App;
