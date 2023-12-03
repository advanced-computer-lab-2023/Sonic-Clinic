import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import logo from "../../Assets/ClinicLogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import NotificationsPanel from "../NotificationsPanel";

const AppNavbar = (props) => {
  const { hamburgerMenu } = props;
  const [newNotifications, setNewNotifications] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const doctorLoggedIn = useSelector((state) => state.doctorLogin.isLoggedIn);
  const patientLoggedIn = useSelector((state) => state.patientLogin.isLoggedIn);
  const [who, setWho] = useState("");

  useEffect(() => {
    if (doctorLoggedIn || patientLoggedIn) {
      setNotifications(true);
      if (doctorLoggedIn) {
        setWho("doctor");
      } else {
        setWho("patient");
      }
    } else {
      setNotifications(false);
    }
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
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
            {notifications && (
              <>
                {" "}
                <FontAwesomeIcon icon={faBell} onClick={toggleNotifications} />
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
                {notifications && (
                  <NotificationsPanel
                    who={who}
                    isOpen={showNotifications}
                    closePanel={toggleNotifications} // Pass a function to close the panel
                  />
                )}
              </>
            )}
          </div>
        </Container>
      </Navbar>
    </div>
  );
};

export default AppNavbar;
