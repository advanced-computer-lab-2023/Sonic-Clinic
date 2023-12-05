import React, { useState } from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import DrHamburgerMenu from "../../components/Doctor/DrHamburgerMenu";
import DrViewApps from "../../components/Doctor/DrViewApps";
import DrAddAppSlot from "../../components/Doctor/DrAddAppSlot";
import DrFollowUps from "../../components/Doctor/DrFollowUps";
import ChatPat from "../../components/ChatPat";

function DrAppointments() {
  const [tab, setTab] = useState("booked");

  return (
    <div>
      <AppNavbar hamburgerMenu={<DrHamburgerMenu />} />
      <div
        style={{
          marginTop: "50px",
          color: "var(--body-text-body-color, #212529)",
          fontSize: "2rem",
          fontWeight: "600",
          textAlign: "center",
          lineHeight: "120%",
        }}
      >
        My Appointments
      </div>
      <Tabs
        id="controlled-tab-example"
        activeKey={tab}
        onSelect={(k) => setTab(k)}
        className="mb-3 d-flex align-items-center justify-content-center"
        style={{ marginTop: "20px" }}
      >
        <Tab eventKey="booked" title="Booked Slots">
          <Container fluid className="bg-light pt-3 mt-2">
            <Container className="bg-white px-2 py-4 d-flex justify-content-center">
              <DrViewApps />
            </Container>
          </Container>
        </Tab>
        <Tab eventKey="free" title="Free Slots">
          <Container fluid className="bg-light pt-3 mt-2">
            <Container className="bg-white px-2 py-4 d-flex justify-content-center">
              <DrAddAppSlot />
            </Container>
          </Container>
        </Tab>
        <Tab eventKey="followUp" title="Follow up requests">
          <Container fluid className="bg-light pt-3 mt-2">
            <Container className="bg-white px-2 py-4 d-flex justify-content-center">
              <DrFollowUps />
            </Container>
          </Container>
        </Tab>
      </Tabs>
      <ChatPat who="doctor" />
    </div>
  );
}

export default DrAppointments;
