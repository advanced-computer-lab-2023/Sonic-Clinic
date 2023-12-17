import { Container, Row } from "react-bootstrap";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import MainImg from "../../components/Patient/MainImg";
import HamburgerMenu from "../../components/Patient/HamburgerMenu";
import SearchCard from "../../components/Patient/SearchCard";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { deleteSearchData } from "../../state/Patient/SearchDoctor";
import { deleteFilterAppointments } from "../../state/Patient/filterAppointments";
import HomeMainOptions from "../../components/Patient/HomeMainOptions";
import ChatPat from "../../components/ChatPat";

function PatientHomePage() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(deleteSearchData());
    dispatch(deleteFilterAppointments());
  }, []);
  return (
    <div>
      <AppNavbar hamburgerMenu={<HamburgerMenu />} />
      <Container fluid className="bg-light pt-3 mt-2">
        <Container className="bg-white px-5 py-4 d-flex align-items-center justify-content-center">
          <Row className="row-sub-container">
            <MainImg />
            <div>
              <SearchCard />
            </div>
          </Row>
        </Container>
      </Container>
      <ChatPat who="patient" />
    </div>
  );
}
export default PatientHomePage;
