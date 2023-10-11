import React from "react";
import { Container, Row } from "react-bootstrap";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import DrHamburgerMenu from "../../components/Doctor/DrHamburgerMenu";
import DrViewPatients from "../../components/Doctor/DrViewPatients";

function DrPatients() {
  return (
    <div>
      <AppNavbar hamburgerMenu={<DrHamburgerMenu />} />

      <DrViewPatients />
    </div>
  );
}

export default DrPatients;
