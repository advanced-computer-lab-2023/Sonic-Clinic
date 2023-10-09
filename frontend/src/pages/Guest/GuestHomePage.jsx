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

function GuestHomePage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(logoutDoctor());
    dispatch(logoutAdmin());
    dispatch(logoutPatient());
  }, []);
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
