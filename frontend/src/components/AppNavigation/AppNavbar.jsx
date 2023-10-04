import React, { useState } from "react";

import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { slide as Menu } from "react-burger-menu";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

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
      <Navbar className="bg-white" sticky="top">
        <Container fluid className="px-5">
          <div className="d-flex flex-direction-row" style={{ gap: "20px" }}>
            <Navbar.Collapse>{hamburgerMenu}</Navbar.Collapse>

            <div>CLINIC</div>
          </div>
          <Navbar.Text
            style={{
              color: "var(--theme-primary, #05AFB9)",
              fontSize: "16px",
              fontStyle: "normal",
              fontWeight: "700",
              textDecorationLine: "underline",
            }}
          >
            <a style={{ color: "var(--theme-primary, #05AFB9)" }} href="#">
              USD
            </a>
          </Navbar.Text>
        </Container>
      </Navbar>
    </div>
  );
};

export default AppNavbar;
