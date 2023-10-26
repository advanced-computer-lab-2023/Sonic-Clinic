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

import DrProfile from "./pages/Doctor/DrProfile";

import DrPatients from "./pages/Doctor/DrPatients";
import PatientOneDoctor from "./pages/Patient/PatientOneDoctor";
import PatientOnePrescription from "./pages/Patient/PatientOnePrescription";
import ForgotPassword from "./pages/Guest/ForgotPassword";
import OTPVerification from "./pages/Guest/OTPVerification";
import ResetPassword from "./pages/Guest/ResetPassword";
import PasswordChanged from "./pages/Guest/PasswordChanged";
import PatientHealthPackages from "./pages/Patient/PatientHealthPackages";

function App() {
  return (
    <div className="bg-light">
      <Routes>
        <Route path="/" element={<GuestHomePage />} />

        <Route path="login">
          <Route index element={<Login />} />
        </Route>

        <Route path="forgot-password">
          <Route path="otp-verification" element={<OTPVerification />} />
          <Route path="reset-password" element={<ResetPassword />} />
          <Route path="password-changed" element={<PasswordChanged />} />
          <Route index element={<ForgotPassword />} />
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

          <Route path="view-prescriptions">
            <Route index element={<PatientViewPrescriptions />} />
            <Route path=":index" element={<PatientOnePrescription />} />
          </Route>

          <Route path="profile" element={<PatientProfile />} />
          <Route path="health-packages" element={<PatientHealthPackages />} />
        </Route>

        <Route path="doctor">
          <Route index element={<DrHomePage />} />
          <Route path="doctor-profile" element={<DrProfile />} />
          <Route path="doctor-appointments" element={<DrAppointments />} />
          <Route path="doctor-patients" element={<DrPatients />} />
        </Route>

        <Route path="guest-home-page">
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
