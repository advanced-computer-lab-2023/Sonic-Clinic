import { Container, Row } from "react-bootstrap";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import MainImg from "../../components/Patient/MainImg";
import HamburgerMenu from "../../components/Patient/HamburgerMenu";

function PatientHomePage() {
  return (
    <div>
      <AppNavbar hamburgerMenu={<HamburgerMenu />} />
      <Container fluid className="bg-light pt-3 mt-2">
        <Container className="bg-white px-5 py-4 d-flex align-items-center justify-content-center">
          <Row className="row-sub-container">
            <MainImg />
          </Row>
        </Container>
      </Container>
    </div>
  );
}
export default PatientHomePage;
