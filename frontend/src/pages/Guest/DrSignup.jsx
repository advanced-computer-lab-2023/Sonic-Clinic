import React, { useEffect } from "react";
import Container from "react-bootstrap/Container";
import "bootstrap/dist/css/bootstrap.min.css";
import { logout } from "../../state/loginPatientReducer";
import { useDispatch } from "react-redux";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import RegPhoto from "../../components/Guest/RegPhoto";

import DrSignupForm from "../../forms/Guest/DrSignupForm";

function DrSignup() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(logout());
  }, []);

  return (
    <div>
      <AppNavbar />
      <Container fluid className="bg-light pt-3 mt-2">
        <Container className="bg-white px-5 py-4 d-flex align-items-center justify-content-center">
          <div className="d-flex w-100 align-items-center">
            <div className="col-lg-5 order-lg-2 d-none d-lg-block">
              <RegPhoto />
            </div>
            <div className="col-12 col-lg-7 order-lg-1">
              <DrSignupForm />
            </div>
          </div>
        </Container>
      </Container>
    </div>
  );
}

export default DrSignup;
