import React, { useState } from "react";
import { Container, Row } from "react-bootstrap";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import HamburgerMenu from "../../components/Patient/HamburgerMenu";
import ShowDoctors from "../../components/Patient/ShowDoctors";
import ViewDoctorDetails from "../../components/Patient/ViewDoctorDetails";
import DoctorAppointments from "../../components/Patient/DoctorAppointments";

function PatientOneDoctor() {
  return (
    <div>
      <AppNavbar hamburgerMenu={<HamburgerMenu />} />
      <Container fluid className="bg-light pt-3 mt-2">
        <Container className="bg-white px-5 py-4 d-flex align-items-center justify-content-center">
          <Row className="w-100">
            <div>
              <ViewDoctorDetails />
            </div>
            <div>
              <DoctorAppointments />
            </div>
          </Row>
        </Container>
      </Container>
    </div>
  );
}

export default PatientOneDoctor;
