import { Container, Row } from "react-bootstrap";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import HamburgerMenu from "../../components/Doctor/DrHamburgerMenu";
import DrMainImg from "../../components/Doctor/DrMainImg";
import DrMainOptions from "../../components/Doctor/DrMainOptions";

function DrHomePage() {
  return (
    <div>
      <AppNavbar hamburgerMenu={<HamburgerMenu />} />
      <Container fluid className="bg-light pt-3 mt-2">
        <Container className="bg-white px-5 py-4 d-flex align-items-center justify-content-center">
          <Row className="row-sub-container">
            <DrMainImg />
            <div>
              <DrMainOptions />
            </div>
          </Row>
        </Container>
      </Container>
    </div>
  );
}
export default DrHomePage;
