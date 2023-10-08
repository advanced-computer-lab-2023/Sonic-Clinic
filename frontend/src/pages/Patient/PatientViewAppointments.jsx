import React, { useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import HamburgerMenu from "../../components/Patient/HamburgerMenu";
import ShowAppointments from "../../components/Patient/ShowAppointments";
import AppointmentFilter from "../../components/Patient/AppointmentFilter";
import { useDispatch } from "react-redux";
import { deleteSearchData } from "../../state/Patient/SearchDoctor";

function PatientViewAppointments() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(deleteSearchData());
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
    </div>
  );
}

export default PatientViewAppointments;
