import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import logo from "../../Assets/ClinicLogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSuitcaseMedical,
  faStaffSnake,
} from "@fortawesome/free-solid-svg-icons";
import NotificationsPanel from "../NotificationsPanel";
import { Button, NavLink } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const AppNavbarGuest = ({ flag }) => {
  const [newNotifications, setNewNotifications] = useState(
    useSelector((state) => state.newNotifications.newNotifications)
  );
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
  const resetNew = () => {
    setNewNotifications(false);
  };
  const navigate = useNavigate();

  return (
    <div>
      <Navbar className="bg-white" sticky="top" style={{ height: "5rem" }}>
        <Container fluid className="px-5">
          <a
            className="d-flex"
            style={{
              color: "#ff6b35",
              fontSize: "1.15rem",
              width: "10rem",
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
          <div
            className="d-flex flex-direction-row justify-space-between col-5"
            style={{ gap: "20px" }}
          ></div>

          <div
            className="col-5"
            style={{
              color: "#adb5bd  ",
              fontSize: "2.3rem",
              fontWeight: "700",
              fontFamily: "'Bebas Neue', sans-serif",
              position: "absolute",
              marginLeft: "40rem",
            }}
          >
            <FontAwesomeIcon
              style={{ color: "#adb5bd  ", marginRight: "0.5rem" }}
              icon={faSuitcaseMedical}
            />
            El7a2ny Clinic
          </div>
          <div
            style={{
              position: "relative",
              display: "inline-block",
              fontSize: "1.7rem",
              cursor: "pointer",
              color: "#212529",
            }}
          ></div>

          {!flag && (
            <Link
              className="d-flex"
              style={{ color: "#05afb9", fontSize: "1.15rem" }}
              to={"/doctor-signup"}
            >
              Register as a Doctor
            </Link>
          )}
          {flag && (
            <Link
              className="d-flex"
              style={{ color: "#05afb9", fontSize: "1.15rem" }}
              to={"/"}
            >
              Login
            </Link>
          )}
        </Container>
      </Navbar>
    </div>
  );
};

export default AppNavbarGuest;
