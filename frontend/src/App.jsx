import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppNavbar from "./components/AppNavigation/AppNavbar";
import "bootstrap/dist/css/bootstrap.min.css";
import PatientHomePage from "./pages/Patient/PatientHomePage";
import AdminHomePage from "./pages/Admin/AdminHomePage";
import AdminHomeCard from "./components/Admin/AdminHomeCard";
import AdminViewTable from './components/Admin/AdminViewTable';
import AdminSearchBar from './components/Admin/AdminSearchBar';
import AdminPatientsPage from './pages/Admin/AdminPatientsPage';
import AdminDoctorsPage from './pages/Admin/AdminDoctorsPage';

function App() {
  return (
    <div className="bg-light">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<AdminHomePage/>} />
          </Route>
          <Route path="/adminDocs">
            <Route index element={<AdminDoctorsPage/>} />
          </Route>
          <Route path="/adminPatients">
            <Route index element={<AdminPatientsPage/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
