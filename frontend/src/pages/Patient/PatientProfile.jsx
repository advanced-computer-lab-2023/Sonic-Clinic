import { Container, Row } from "react-bootstrap";
import AppNavbar from "../../components/AppNavigation/AppNavbar";

import HamburgerMenu from "../../components/Patient/HamburgerMenu";

import ProfileTabs from "../../components/Patient/ProfileTabs";

function PatientProfile() {
  return (
    <div>
      <AppNavbar hamburgerMenu={<HamburgerMenu />} />
      <Container fluid className="bg-light pt-3 mt-2">
        <Container className="bg-white px-5 py-4 d-flex align-items-center justify-content-center">
          <Row className="w-100">
            <div>
              <ProfileTabs />
            </div>
          </Row>
        </Container>
      </Container>
    </div>
  );
}
export default PatientProfile;
