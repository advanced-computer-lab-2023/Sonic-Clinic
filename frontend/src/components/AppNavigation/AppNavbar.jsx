import React, { useState } from "react";

import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import logo from "../../Assets/ClinicLogo.png";
const AppNavbar = (props) => {
  const { hamburgerMenu } = props;
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div>
      <Navbar className="bg-white" sticky="top" style={{ height: "5rem" }}>
        <Container fluid className="px-5">
          <div
            className="d-flex flex-direction-row col-5"
            style={{ gap: "20px" }}
          >
            <Navbar.Collapse>{hamburgerMenu}</Navbar.Collapse>
          </div>
          <div
            className="col-7"
            style={{
              color: "#ff6b35",
              fontSize: "3rem",
              fontWeight: "700",
              paddingLeft: "2.3rem",
            }}
          >
            Clinic
          </div>
        </Container>
      </Navbar>
    </div>
  );
};

export default AppNavbar;
