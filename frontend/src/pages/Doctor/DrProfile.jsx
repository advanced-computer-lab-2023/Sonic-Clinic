import React from "react";
import { Container } from "react-bootstrap";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import DrHamburgerMenu from "../../components/Doctor/DrHamburgerMenu";
import DrProfileBox from "../../components/Doctor/DrProfileBox";
import DrContract from "../../components/Doctor/DrContract";

function DrProfile() {
  return (
    <div>
      <AppNavbar hamburgerMenu={<DrHamburgerMenu />} />
      <Container className="bg-white px-3 py-3 d-flex">
        <div style={{ marginLeft: "6rem", marginRight: "6rem" }}>
          <DrContract />
        </div>

        <div className="col-7">
          <DrProfileBox />
        </div>
      </Container>
    </div>
  );
}

export default DrProfile;
