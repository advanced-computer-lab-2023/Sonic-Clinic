import React from "react";
import { Container } from "react-bootstrap";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import DrHamburgerMenu from "../../components/Doctor/DrHamburgerMenu";
import DrViewApps from "../../components/Doctor/DrViewApps";

function DrAppointments() {
  return (
    <div>
      <AppNavbar hamburgerMenu={<DrHamburgerMenu />} />
      <Container fluid className="bg-light pt-3 mt-2">
        <Container className="bg-white px-5 py-4 d-flex justify-content-center">
          <DrViewApps />
        </Container>
      </Container>
    </div>
  );
}

export default DrAppointments;
