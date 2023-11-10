import { Container, Row } from "react-bootstrap";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
//import MainImg from "../../components/Patient/MainImg";
import GuestMainImg from "../../components/Guest/GuestMainImg";
import HamburgerMenu from "../../components/Patient/HamburgerMenu";
import GuestBox from "../../components/Guest/GuestBox";
import GuestBurgerMenu from "../../components/Guest/GuestBurgerMenu";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { logoutDoctor } from "../../state/loginDoctorReducer";
import { logoutAdmin } from "../../state/loginAdminReducer";
import { logoutPatient } from "../../state/loginPatientReducer";
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
      </Container>
    </div>
  );
}

export default GuestHomePage;
