import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import HamburgerMenu from "../../components/Patient/HamburgerMenu";
import ShowAppointments from "../../components/Patient/ShowAppointments";
import AppointmentFilter from "../../components/Patient/AppointmentFilter";
import { useDispatch } from "react-redux";
import { deleteSearchData } from "../../state/Patient/SearchDoctor";
import { deleteFilterAppointments } from "../../state/Patient/filterAppointments";
import ChatPat from "../../components/ChatPat";

function PatientViewAppointments() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(deleteSearchData());
    dispatch(deleteFilterAppointments());
  }, []);

  return (
    <div>
      <AppNavbar hamburgerMenu={<HamburgerMenu />} />
      <Container fluid className="bg-light pt-3 mt-2">
        <Container className="bg-white px-5 py-4">
          <Row>
            <Col xs={12} md={5}>
              <AppointmentFilter />
            </Col>
            <Col xs={12} md={7}>
              <ShowAppointments />
            </Col>
          </Row>
        </Container>
      </Container>
      <ChatPat who="patient" />
    </div>
  );
}

export default PatientViewAppointments;
