import React, { useState } from "react";
import { Container, Row } from "react-bootstrap";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import HamburgerMenu from "../../components/Patient/HamburgerMenu";
import ViewPrescriptionDetails from "../../components/Patient/ViewPrescriptionDetails";
import ChatPat from "../../components/ChatPat";

function PatientOnePrescription() {
  return (
    <div>
      <AppNavbar hamburgerMenu={<HamburgerMenu />} />
      <Container fluid className="bg-light pt-3 mt-2">
        <Container className="bg-white px-5 py-4 d-flex align-items-center justify-content-center">
          <Row className="w-100">
            <div>
              <ViewPrescriptionDetails />
            </div>
          </Row>
        </Container>
      </Container>
      <ChatPat who="patient" />
    </div>
  );
}

export default PatientOnePrescription;
