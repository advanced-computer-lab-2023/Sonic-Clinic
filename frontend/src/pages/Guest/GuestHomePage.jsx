import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import GuestMainImg from "../../components/Guest/GuestMainImg";
import GuestBox from "../../components/Guest/GuestBox";
import GuestBurgerMenu from "../../components/Guest/GuestBurgerMenu";
import { Waypoint } from "react-waypoint";
import { useSpring, animated } from "react-spring";
import { logoutDoctor } from "../../state/loginDoctorReducer";
import { logoutAdmin } from "../../state/loginAdminReducer";
import { logoutPatient } from "../../state/loginPatientReducer";
import { useDispatch } from "react-redux";
import axios from "axios";

const GuestHomePage = () => {
  const [aboutUsVisible, setAboutUsVisible] = useState(false);
  const [contactUsVisible, setContactUsVisible] = useState(false);
  const [ourDoctorsVisible, setOurDoctorsVisible] = useState(false);
  const [ourPatientsVisible, setOurPatientsVisible] = useState(false);
  const dispatch = useDispatch();

  const aboutUsSpring = useSpring({
    opacity: aboutUsVisible ? 1 : 0,
    transform: aboutUsVisible ? "translateX(0)" : "translateX(-50px)",
    config: { duration: 1000 },
  });

  const contactUsSpring = useSpring({
    opacity: contactUsVisible ? 1 : 0,
    transform: contactUsVisible ? "translateX(0)" : "translateX(50px)",
    config: { duration: 1000 },
  });

  const ourDoctorsSpring = useSpring({
    opacity: ourDoctorsVisible ? 1 : 0,
    transform: ourDoctorsVisible ? "translateX(0)" : "translateX(-50%)",
    config: { duration: 1000 },
  });

  const ourPatientsSpring = useSpring({
    opacity: ourPatientsVisible ? 1 : 0,
    transform: ourPatientsVisible ? "translateX(0)" : "translateX(50%)",
    config: { duration: 1000 },
  });
  useEffect(() => {
    setAboutUsVisible(false);
    setContactUsVisible(false);
    setOurDoctorsVisible(false);
    setOurPatientsVisible(false);
    dispatch(logoutDoctor());
    dispatch(logoutAdmin());
    dispatch(logoutPatient());
  }, []);

  const logout = async () => {
    try {
      const response = await axios.get("/logout");
      if (response.status === 200) {
        console.log("LOGOUT");
      }
    } catch (error) {
      console.log();
    }
  };

  return (
    <div>
      <AppNavbar hamburgerMenu={<GuestBurgerMenu />} />
      <Container fluid className="bg-light pt-3 mt-2">
        <Container className="bg-white px-5 py-4 d-flex align-items-center justify-content-center">
          <Row className="row-sub-container">
            <GuestMainImg />
            <div>
              <GuestBox />
            </div>
          </Row>
        </Container>
        <div>
          <div className="d-flex flex-row justify-content-space-between">
            <Waypoint
              onEnter={() => setOurDoctorsVisible(true)}
              onLeave={() => setOurDoctorsVisible(false)}
            />
            <animated.div style={ourDoctorsSpring}>
              <div
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  textAlign: "center",
                  width: "30rem",
                  height: "15rem",
                  marginLeft: "13rem",
                  marginRight: "8rem",
                  marginTop: "1rem",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#05afb9",
                    borderRadius: "8px",
                    height: "100%",
                    padding: "1rem",
                    color: "white",
                  }}
                >
                  <h2 style={{ fontWeight: "bold", marginBottom: "1rem" }}>
                    Our Doctors
                  </h2>
                  <p>
                    Meet our expert team of doctors who are dedicated to your
                    health and well-being. Our doctors have years of experience
                    and are committed to providing personalized and
                    compassionate care to every patient.
                  </p>
                </div>
              </div>
            </animated.div>
            <Waypoint
              onEnter={() => setOurPatientsVisible(true)}
              onLeave={() => setOurPatientsVisible(false)}
            />
            <animated.div style={ourPatientsSpring}>
              <div
                className="our-patients-section"
                style={{
                  backgroundColor: "white",
                  padding: "20px",
                  textAlign: "center",
                  width: "30rem",
                  height: "15rem",
                  marginTop: "1rem",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#05afb9",
                    borderRadius: "8px",
                    height: "100%",
                    padding: "1rem",
                    color: "white",
                  }}
                >
                  <h2 style={{ fontWeight: "bold", marginBottom: "1rem" }}>
                    Our Patients
                  </h2>
                  <p>
                    Discover the stories of our valued patients and their
                    experiences with our healthcare services. We take pride in
                    the positive impact we've had on the lives of our patients
                    and strive to provide the highest quality of care.
                  </p>
                </div>
              </div>
            </animated.div>
          </div>

          <Waypoint
            onEnter={() => setAboutUsVisible(true)}
            onLeave={() => setAboutUsVisible(false)}
          />
          <animated.div style={aboutUsSpring}>
            <Container
              className="bg-white px-5 py-4"
              style={{ marginTop: "1rem" }}
            >
              <Row className="about-us-section">
                <Col xs={12}>
                  <h2 style={{ fontWeight: "bold" }}>About Us</h2>
                  <p>
                    Welcome to our virtual clinic! At SonicClinic, we are
                    committed to delivering accessible and high-quality
                    healthcare services. Our mission is to provide innovative
                    solutions for your health and well-being.
                  </p>
                </Col>
              </Row>
            </Container>
          </animated.div>
          <Waypoint
            onEnter={() => setContactUsVisible(true)}
            onLeave={() => setContactUsVisible(false)}
          />
          <animated.div style={contactUsSpring}>
            <Container
              className="bg-white px-5 py-4"
              style={{ marginTop: "1rem" }}
            >
              <Row className="contact-us-section">
                <Col xs={12}>
                  <h2 style={{ fontWeight: "bold" }}>Contact Us</h2>
                  <p>
                    Got questions or need assistance? Feel free to reach out to
                    our friendly team. We are here to help you. Contact us
                    through the provided channels, and we'll get back to you as
                    soon as possible.
                  </p>
                </Col>
              </Row>
            </Container>
          </animated.div>
        </div>
      </Container>
    </div>
  );
};

export default GuestHomePage;
