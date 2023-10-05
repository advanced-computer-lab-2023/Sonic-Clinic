import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppNavbar from "./components/AppNavigation/AppNavbar";
import "bootstrap/dist/css/bootstrap.min.css";
import PatientHomePage from "./pages/Patient/PatientHomePage";
import PatientViewDoctors from "./pages/Patient/PatientViewDoctors";
import PatientProfile from "./pages/Patient/PatientProfile";
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
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
