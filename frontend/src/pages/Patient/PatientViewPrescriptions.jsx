import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import HamburgerMenu from "../../components/Patient/HamburgerMenu";
import PrescriptionFilter from "../../components/Patient/PrescriptionFilter";
import ShowPrescriptions from "../../components/Patient/ShowPrescriptions";
import { useDispatch } from "react-redux";
import { deleteSearchData } from "../../state/Patient/SearchDoctor";
import { deleteFilterPrescription } from "../../state/Patient/filterPrescriptions";

function PatientViewPrescriptions() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(deleteSearchData());
    dispatch(deleteFilterPrescription());
  }, []);
  return (
    <div>
      <AppNavbar hamburgerMenu={<HamburgerMenu />} />
      <Container fluid className="bg-light pt-3 mt-2">
        <Container className="bg-white px-5 py-4">
          <Row>
            <Col xs={12} md={5}>
              <PrescriptionFilter />
            </Col>
            <Col xs={12} md={7}>
              <ShowPrescriptions />
            </Col>
          </Row>
        </Container>
      </Container>
    </div>
  );
}

export default PatientViewPrescriptions;
