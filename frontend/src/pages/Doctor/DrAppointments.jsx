import React from "react";
import { Container, Row } from "react-bootstrap";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import DrHamburgerMenu from "../../components/Doctor/DrHamburgerMenu";
import DrShowAppointments from "../../components/Doctor/DrShowAppointments";
import DrAppointmentFilter from "../../components/Doctor/DrAppointmentFilter";

function DrAppointments() {
  return (
    <div>
      <AppNavbar hamburgerMenu={<DrHamburgerMenu />} />
      <Container fluid className="bg-light pt-3 mt-2">
        <Container className="bg-white px-5 py-4 d-flex align-items-center justify-content-center">
          <div className="col-5">
            <DrAppointmentFilter />
          </div>
          <div className="col-7">
            <DrShowAppointments />
          </div>
        </Container>
      </Container>
    </div>
  );
}

export default DrAppointments;
