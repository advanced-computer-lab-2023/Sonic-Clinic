import { BrowserRouter, Route, Routes } from "react-router-dom";
import AppNavbar from "./Components/AppNavigation/AppNavbar";
import "bootstrap/dist/css/bootstrap.min.css";
import PatientHomePage from "./Pages/Patient/PatientHomePage";

function App() {
  return (
    <div className="bg-light">
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route index element={<PatientHomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
