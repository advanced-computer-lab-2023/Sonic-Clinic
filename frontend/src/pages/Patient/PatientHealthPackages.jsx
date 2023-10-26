import React, { useState } from "react";
import { Card, Container, Row } from "react-bootstrap";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import HamburgerMenu from "../../components/Patient/HamburgerMenu";
import Flicking, { ViewportSlot } from "@egjs/react-flicking";
import "@egjs/react-flicking/dist/flicking-inline.css";
import { Arrow } from "@egjs/flicking-plugins";
import "@egjs/flicking-plugins/dist/arrow.css";

function PatientHealthPackages() {
  const plugins = [new Arrow()];
  const [panels, setPanels] = useState([0, 1, 2, 3]);

  return (
    <div>
      <AppNavbar hamburgerMenu={<HamburgerMenu />} />
      <Container fluid className="bg-light pt-3 mt-2">
        <Container className="bg-white px-5 py-4 d-flex align-items-center justify-content-center">
          <Row className="w-100">
            <div>
              <Flicking circular={true} plugins={plugins}>
                <div className="card-panel">1</div>
                <div className="card-panel">2</div>
                <div className="card-panel">3</div>
                <ViewportSlot>
                  <span className="flicking-arrow-prev"></span>
                  <span className="flicking-arrow-next"></span>
                </ViewportSlot>
              </Flicking>
            </div>
          </Row>
        </Container>
      </Container>
    </div>
  );
}

export default PatientHealthPackages;
