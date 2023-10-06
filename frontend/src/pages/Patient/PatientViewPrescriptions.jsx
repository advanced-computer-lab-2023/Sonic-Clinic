import React from "react";
import { Container, Row } from "react-bootstrap";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import HamburgerMenu from "../../components/Patient/HamburgerMenu";
import PrescriptionFilter from "../../components/Patient/PrescriptionFilter";
import ShowPrescriptions from "../../components/Patient/ShowPrescriptions";

function PatientViewPrescriptions() {
  return (
    <div>
      <AppNavbar hamburgerMenu={<HamburgerMenu />} />
      <Container fluid className="bg-light pt-3 mt-2">
        <Container className="bg-white px-5 py-4 d-flex align-items-center justify-content-center">
          <div className="col-5">
            <PrescriptionFilter />
          </div>
          <div className="col-7">
            <ShowPrescriptions />
          </div>
        </Container>
      </Container>
    </div>
  );
}

export default PatientViewPrescriptions;
