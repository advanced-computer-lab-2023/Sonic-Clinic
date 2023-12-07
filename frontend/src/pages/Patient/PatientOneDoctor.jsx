import React from "react";
import { Container, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import HamburgerMenu from "../../components/Patient/HamburgerMenu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import ViewDoctorDetails from "../../components/Patient/ViewDoctorDetails";
import DoctorAppointments from "../../components/Patient/DoctorAppointments";
import ChatPat from "../../components/ChatPat";

function PatientOneDoctor() {
  return (
    <div>
      <AppNavbar hamburgerMenu={<HamburgerMenu />} />
      <Container fluid className="bg-light pt-3 mt-2">
        <Container className="bg-white d-flex align-items-center justify-content-center">
          <Row className="w-100">
            <div style={{ marginTop: "1rem" }}>
              <Link to="/patient/view-doctors">
                <Button>
                  <FontAwesomeIcon icon={faChevronLeft} />
                </Button>
              </Link>
            </div>
            <div className="px-5 py-4">
              <ViewDoctorDetails />
            </div>
            <div className="px-5">
              <DoctorAppointments />
            </div>
          </Row>
        </Container>
      </Container>
      <ChatPat who="patient" />
    </div>
  );
}

export default PatientOneDoctor;
