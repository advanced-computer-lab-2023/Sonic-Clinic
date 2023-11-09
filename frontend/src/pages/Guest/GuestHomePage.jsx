import { Container, Row } from "react-bootstrap";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
//import MainImg from "../../components/Patient/MainImg";
import GuestMainImg from "../../components/Guest/GuestMainImg";
import HamburgerMenu from "../../components/Patient/HamburgerMenu";
import GuestBox from "../../components/Guest/GuestBox";
import GuestBurgerMenu from "../../components/Guest/GuestBurgerMenu";
import { useDispatch } from "react-redux";
import { useEffect, useRef } from "react";
import { logoutDoctor } from "../../state/loginDoctorReducer";
import { logoutAdmin } from "../../state/loginAdminReducer";
import { logoutPatient } from "../../state/loginPatientReducer";
import Waypoint from "react-waypoint";
import axios from "axios";

function GuestHomePage() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(logoutDoctor());
    dispatch(logoutAdmin());
    dispatch(logoutPatient());
    logout();
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

  // const handleEnterViewport = () => {
  //   setFadeIn(true);
  // };

  // const handleExitViewport = () => {
  //   setFadeIn(false);
  // };

  return (
    <div>
      <AppNavbar hamburgerMenu={<GuestBurgerMenu />} />
      {/* Main Section
      <Waypoint onEnter={handleEnterViewport} onLeave={handleExitViewport}>
        <Container className={`bg-light pt-3 mt-2 ${fadeIn ? "fade-in" : ""}`}>
          <Row className="row-sub-container">
            <GuestMainImg />
            <div>
              <GuestBox />
            </div>
          </Row>
        </Container>
      </Waypoint>
      <Waypoint
        onEnter={() => handleEnterViewport("about-us-section")}
        onLeave={() => handleExitViewport("about-us-section")}
      >
        <Container id="about-us-section" className="bg-light pt-3 mt-2 fade-in">
          <Container className="bg-white px-5 py-4">
            <h2>About Us</h2>
            <p>This is a brief description of our clinic...</p>
          </Container>
        </Container>
      </Waypoint>
      <Waypoint
        onEnter={() => handleEnterViewport("contact-us-section")}
        onLeave={() => handleExitViewport("contact-us-section")}
      >
        <Container
          id="contact-us-section"
          className="bg-light pt-3 mt-2 fade-in"
        >
          <Container className="bg-white px-5 py-4">
            <h2>Contact Us</h2>
            <p>You can reach us at contact@clinic.com...</p>
          </Container>
        </Container>
      </Waypoint>
  */}
    </div>
  );
}

export default GuestHomePage;
