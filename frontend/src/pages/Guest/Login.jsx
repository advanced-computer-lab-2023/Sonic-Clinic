import React, { useEffect } from "react";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import { logoutPatient } from "../../state/loginPatientReducer";
import { useDispatch } from "react-redux";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import RegPhoto from "../../components/Guest/RegPhoto";
import LoginForm from "../../forms/Guest/LoginForm";
import PatientSignupForm from "../../forms/Guest/PatientSignupForm";
import GuestBurgerMenu from "../../components/Guest/GuestBurgerMenu";
import { logoutDoctor } from "../../state/loginDoctorReducer";
import { logoutAdmin } from "../../state/loginAdminReducer";
import AppNavbarGuest from "../../components/AppNavigation/AppNavbarGuest";
import axios from "axios";

function PatientLogin() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logoutDoctor());
    dispatch(logoutAdmin());
    dispatch(logoutPatient());
    logout();
  }, []);

  const logout = async () => {
    try {
      const response = await axios.get("/logout");
      if (response.status === 200) {
        console.log("LOGOUT");
      }
    } catch (error) {
      console.log();
    }
  };

  return (
    <div>
      <AppNavbarGuest flag={false} />
      <Container fluid className="bg-light pt-3 mt-2">
        <Container className="bg-white px-5 py-4 d-flex align-items-center justify-content-center">
          <div className="d-flex w-100 align-items-center">
            <div className="col-lg-5 order-lg-2 d-none d-lg-block">
              <RegPhoto />
            </div>
            <div className="col-12 col-lg-7 order-lg-1">
              <LoginForm />
            </div>
          </div>
        </Container>
      </Container>
    </div>
  );
}

export default PatientLogin;
