import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import logo from "../../Assets/ClinicLogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faSuitcaseMedical,
  faStaffSnake,
} from "@fortawesome/free-solid-svg-icons";
import NotificationsPanel from "../NotificationsPanel";
import { Button, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";

const AppNavbar = (props) => {
  const { hamburgerMenu } = props;
  const [newNotifications, setNewNotifications] = useState(
    useSelector((state) => state.newNotifications.newNotifications)
  );
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const doctorLoggedIn = useSelector((state) => state.doctorLogin.isLoggedIn);
  const patientLoggedIn = useSelector((state) => state.patientLogin.isLoggedIn);
  const adminLoggedIn = useSelector((state) => state.adminLogin.isLoggedIn);

  const docWallet = useSelector((state) => state.doctorLogin.wallet);
  const patWallet = useSelector((state) => state.patientLogin.wallet);
  const [who, setWho] = useState("");

  useEffect(() => {
    if (doctorLoggedIn || patientLoggedIn) {
      setNotifications(true);
      if (doctorLoggedIn) {
        setWho("doctor");
        setWallet(docWallet);
      } else {
        setWho("patient");
        setWallet(patWallet);
      }
    } else {
      setNotifications(false);
      setWho("admin");
    }
  }, []);
  const [wallet, setWallet] = useState("");

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };
  const resetNew = () => {
    setNewNotifications(false);
  };

  return (
    <div>
      <Navbar className="bg-white" sticky="top" style={{ height: "5rem" }}>
        <Container
          fluid
          className="px-5 d-flex align-items-center w-100"
          style={{ display: "flex", height: "100%" }}
        >
          <div style={{ flex: 1 }}>
            {/* Left section */}
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              {hamburgerMenu}
            </Navbar.Collapse>
            {who === "patient" && (
              <a
                className="d-flex"
                style={{
                  color: "#ff6b35",
                  fontSize: "1.15rem",
                  marginLeft: "5rem",
                }}
                href="http://localhost:3001/"
                target="_blank" // Add this attribute to open in a new tab
                rel="noopener noreferrer" // Add this for security
              >
                Visit Pharmacy
                <FontAwesomeIcon
                  style={{
                    color: "#ff6b35",
                    marginLeft: "0.5rem",
                    marginTop: "0.3rem",
                  }}
                  icon={faStaffSnake}
                />
              </a>
            )}
          </div>

          <div style={{ flex: 1, textAlign: "center" }}>
            {" "}
            {/* Center section */}
            <div
              style={{
                color: "#adb5bd  ",
                fontSize: "2.3rem",
                fontWeight: "700",
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              <FontAwesomeIcon
                style={{ color: "#adb5bd  ", marginRight: "0.5rem" }}
                icon={faSuitcaseMedical}
              />
              El7a2ny Clinic
            </div>
          </div>

          <div style={{ flex: 1, display: "flex", justifyContent: "flex-end" }}>
            {" "}
            {/* Right section */}
            <div style={{ display: "flex", alignItems: "center" }}>
              {who !== "admin" && (
                <div
                  style={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: "black",
                    fontWeight: "bold",
                    marginRight: "3rem",
                    fontSize: "1.1rem",
                  }}
                >
                  Balance: ${parseFloat(wallet).toFixed(2)}
                </div>
              )}

              <div
                style={{
                  marginLeft: "20px",
                  position: "relative",
                  fontSize: "1.7rem",
                  cursor: "pointer",
                  color: "#212529",
                }}
              >
                {notifications && (
                  <div>
                    <FontAwesomeIcon
                      style={{ color: "#05afb9" }}
                      icon={faBell}
                      onClick={toggleNotifications}
                    />
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
                        isOpen={showNotifications}
                        closePanel={toggleNotifications}
                        resetNew={resetNew}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Container>
      </Navbar>
    </div>
  );
};

export default AppNavbar;
