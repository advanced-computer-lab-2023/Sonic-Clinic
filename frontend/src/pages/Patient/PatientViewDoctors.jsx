import React from "react";
import { Container, Row } from "react-bootstrap";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import HamburgerMenu from "../../components/Patient/HamburgerMenu";
import DoctorFilter from "../../components/Patient/DoctorFilter";
import SearchCard from "../../components/Patient/SearchCard";
import ShowDoctors from "../../components/Patient/ShowDoctors";
import ViewDoctorsSearch from "../../components/Patient/ViewDoctorsSearch";

function PatientViewDoctors() {
  return (
    <div>
      <AppNavbar hamburgerMenu={<HamburgerMenu />} />
      <Container fluid className="bg-light pt-3 mt-2">
        <Container className="bg-white px-5 py-4 d-flex align-items-center justify-content-center">
          <Row>
            <div>
              <ViewDoctorsSearch />
            </div>
            <div className="col-5">
              <DoctorFilter />
            </div>
            <div className="col-7">
              <ShowDoctors />
            </div>
          </Row>
        </Container>
      </Container>
    </div>
  );
}

export default PatientViewDoctors;
