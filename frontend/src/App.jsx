import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppNavbar from "./components/AppNavigation/AppNavbar";
import "bootstrap/dist/css/bootstrap.min.css";
import PatientHomePage from "./pages/Patient/PatientHomePage";
import PatientViewDoctors from "./pages/Patient/PatientViewDoctors";
import PatientProfile from "./pages/Patient/PatientProfile";
import AdminHomePage from "./pages/Admin/AdminHomePage";
import AdminPatientsPage from './pages/Admin/AdminPatientsPage';
import AdminDoctorsPage from './pages/Admin/AdminDoctorsPage';
import AdminAdminsPage from './pages/Admin/AdminAdminsPage';
import AdminPackagesPage from './pages/Admin/AdminPackagesPage';

function App() {
  return (
    <div className="bg-light">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<PatientHomePage />} />

          <Route path="patient">
              <Route path="view-doctors" element={<PatientViewDoctors />} />
              <Route path="profile" element={<PatientProfile />} />
              <Route index element={<PatientHomePage />} />
            </Route>
          </Route>

          <Route path="admin">
             <Route path="doctors-list" element={<AdminDoctorsPage />} /> 
             <Route path="patients-list" element={<AdminPatientsPage />} /> 
             <Route path="admins-list" element={<AdminAdminsPage />} /> 
             <Route path="packages" element={<AdminPackagesPage />} /> 
             <Route index element={<AdminHomePage />} />
          </Route>

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
