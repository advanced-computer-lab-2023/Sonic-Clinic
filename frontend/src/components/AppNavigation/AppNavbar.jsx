import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import logo from "../../Assets/ClinicLogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";

const AppNavbar = (props) => {
  const { hamburgerMenu } = props;
  const [menuOpen, setMenuOpen] = useState(false);
  const [newNotifications, setNewNotifications] = useState(true);
  //check if someone is loggedin to show notifications

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
          {/* <div><img src="./ClinicLogo.jpg" alt="Clinic Logo" /></div>  */}
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
          <div
            style={{
              position: "relative",
              display: "inline-block",
              fontSize: "1.7rem",
              cursor: "pointer",
              color: "#212529",
            }}
          >
            <FontAwesomeIcon icon={faBell} />
            {newNotifications && (
              <span
                style={{
                  position: "absolute",
                  top: "0.4rem",
                  right: "-0.15rem",
                  height: "0.6rem",
                  width: "0.6rem",
                  borderRadius: "50%",
                  backgroundColor: "#ff6b35",
                }}
              />
            )}
          </div>
        </Container>
      </Navbar>
    </div>
  );
};

export default AppNavbar;
