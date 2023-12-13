import React, { useState, useEffect } from "react";
import { Button, Container, Row } from "react-bootstrap";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import HamburgerMenu from "../../components/Patient/HamburgerMenu";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  removeNewPackage,
  removeNewPres,
  updatePatientPackage,
} from "../../state/loginPatientReducer";
import { removeForFam } from "../../state/loginPatientReducer";
import axios from "axios";

function PatientPrescriptionSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const newPres = useSelector((state) => state.patientLogin.newPres);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`/handlePrescreptionStripe`, {
          id: newPres,
        });

        if (response.status === 200) {
          dispatch(removeNewPres());
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData(); // Call the async function here
  }, []); // Empty dependency array means this effect runs once after the initial render

  return (
    <div>
      <AppNavbar hamburgerMenu={<HamburgerMenu />} />
      <Container fluid className="bg-light pt-3 mt-2">
        <Container className="bg-white px-5 py-4 d-flex align-items-center justify-content-center">
          <Row className="w-100">
            <div className="row d-flex align-items-center justify-content-center mt-5">
              <div
                style={{
                  color: "var(--theme-dark, #212529)",
                  fontSize: "30px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "120%",
                  marginBottom: "1rem",
                }}
                className="d-flex align-items-center justify-content-center mt-5"
              >
                You have successfully payed for your prescription!
              </div>
              <Button
                variant="primary"
                onClick={() => navigate("/patient")}
                className="w-50 mt-5"
              >
                Back to Home Page
              </Button>
            </div>
          </Row>
        </Container>
      </Container>
    </div>
  );
}

export default PatientPrescriptionSuccess;
