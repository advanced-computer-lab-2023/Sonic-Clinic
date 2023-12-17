import React, { useState, useEffect } from "react";
import { Button, Container, Row } from "react-bootstrap";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import HamburgerMenu from "../../components/Patient/HamburgerMenu";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeNewApp } from "../../state/loginPatientReducer";
import { removeForFam } from "../../state/loginPatientReducer";
import axios from "axios";

function PatientAppSuccess() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const app = useSelector((state) => state.patientLogin.newApp);
  const famID = useSelector((state) => state.patientLogin.forFam);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`/addAppointmentForMyselfOrFam`, {
          famID: famID,
          doctorID: app.doctorID,
          date: app.date,
          description: app.description,
          time: app.time,
        });
        if (response.status === 200) {
          setMessage("You have successfully booked the appointment");
          dispatch(removeNewApp());
          dispatch(removeForFam());
        } else {
          setMessage(response.data.message);
        }
      } catch (error) {
        setMessage(error);
      }
    };
    fetchData();
  }, []);

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
                {message}
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

export default PatientAppSuccess;
