import React, { useEffect, useState } from "react";
import { Card, Col, Row, Image, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import prescriptionImg from "../../Assets/Prescription.jpg";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setPrescriptionData } from "../../state/prescriptionIdReducer";
import axios from "axios";
import {
  faClock,
  faCancel,
  faCheck,
  faPause,
  faCheckDouble,
} from "@fortawesome/free-solid-svg-icons";

function ShowPrescriptions() {
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [error1, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const id = useSelector((state) => state.patientLogin.userId);
  const filterDate = useSelector((state) => state.filterPrescriptions.date);

  const filterDoctor = useSelector((state) => state.filterPrescriptions.doctor);
  console.log("name", filterDoctor);
  const filterStatus = useSelector((state) => state.filterPrescriptions.status);

  const handleCard = (prescription, index) => {
    dispatch(
      setPrescriptionData({
        _id: prescription._id,
        date: prescription.date,
        description: prescription.description,
        patientID: prescription.patientID,
        doctorID: prescription.doctorID,
        status: prescription.status,
        medicine: prescription.medicine,
        doctorName: prescription.doctorName,
      })
    );
    navigate(`/patient/view-prescriptions/${index}`);
  };

  useEffect(() => {
    fetchData();
  }, {});

  const fetchData = async () => {
    try {
      const response = await axios.post("/viewPrescriptions");
      if (response.status === 200) {
        console.log("RESPONSE:", response.data);
        setResponseData(response.data);
      } else {
        console.log("Server error");
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No Prescriptions Found");
      } else if (error.response && error.response.status === 500) {
        setError("Server Error");
      } else {
        setError("An error occurred. Please try again later.");
      }
      setLoading(false);
    }
  };
  const NeededData = responseData;
  const filteredPrescriptions = NeededData.filter((prescription) => {
    const isoDate = prescription.date; // Assuming appointment.date is in ISO format like "2023-10-05T14:30:00.000Z"
    const dateObj = new Date(isoDate);
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0"); // Adding 1 to the month because it's zero-based
    const dd = String(dateObj.getDate()).padStart(2, "0");

    const formattedDate = `${yyyy}-${mm}-${dd}`;
    const status = prescription.status ? prescription.status.toLowerCase() : "";
    const doctor = prescription.doctorName;
    // Check if the formattedDate includes the filterDate and the status includes filterStatus, both in lowercase
    return (
      formattedDate.includes(filterDate.toLowerCase()) &&
      (filterStatus === ""
        ? status.includes("")
        : status === filterStatus.toLowerCase()) &&
      doctor.toLowerCase().includes(filterDoctor.toLowerCase())
      // doctor.includes(filterDoctor.toLowerCase())
      // status.includes(filterStatus.toLowerCase())
    );
  });

  const getStatusIcon = (status) => {
    const lowerCaseStatus = status.toLowerCase();
    switch (lowerCaseStatus) {
      case "submitted":
        return faCheck; // Blue for Upcoming
      case "not submitted":
        return faCancel; // Grey for Completed
      default:
        return faPause; // Default color
    }
  };

  const getStatusColor = (status) => {
    const lowerCaseStatus = status.toLowerCase();
    switch (lowerCaseStatus) {
      case "submitted":
        return "#05afb9"; // Blue for Upcoming
      case "completed":
        return "#adb5bd "; // Grey for Completed
      case "Not submitted":
        return "#ff6b35 "; // Orange for Cancelled
      case "rescheduled":
        return "#c4e6e6  "; // Light Blue for Rescheduled
      default:
        return "#ff6b35"; // Default color
    }
  };

  return (
    <div>
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )}
      {error1 && <div style={{ color: "red" }}>{error1}</div>}
      {filteredPrescriptions.length === 0 && !loading && (
        <div style={{ textAlign: "center", marginTop: "20px" }} className="msg">
          You don't have any prescriptions.
        </div>
      )}
      {!loading &&
        filteredPrescriptions.map((prescription, index) => {
          // Parse the date string into a Date object
          const prescriptionDate = new Date(prescription.date);

          // Format the date as "dd/mm/yyyy"
          const formattedDate = `${prescriptionDate
            .getDate()
            .toString()
            .padStart(2, "0")}/${(prescriptionDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${prescriptionDate.getFullYear()}`;

          return (
            <a
              onClick={() => handleCard(prescription, index + 1)}
              key={prescription.prescriptionId}
              className="text-decoration-none"
            >
              <Card
                style={{
                  cursor: "pointer",
                  borderRadius: "10px",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s",
                  marginBottom: "2rem",
                  marginRight: "2rem",
                  height: "12rem",
                }}
              >
                <Row>
                  <Col lg={1}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column", // Vertical arrangement
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: getStatusColor(prescription.status),
                        borderRadius: "10px 0 0 10px",
                        height: "12rem",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={getStatusIcon(prescription.status)}
                        style={{
                          fontSize: "1.5em",
                          color: "white",
                        }}
                      />
                    </div>
                  </Col>
                  <Col lg={4}>
                    <Card.Body>
                      <Card.Title
                        style={{
                          marginTop: "1.5rem",
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          color: "#212529",
                          marginBottom: "1rem",
                        }}
                      >
                        Dr. {prescription.doctorName}
                      </Card.Title>
                      <div
                        style={{
                          marginBottom: "1rem",
                          fontSize: "1.2rem",
                          color: "#099BA0 ",
                        }}
                      >
                        Prescription {index + 1}
                      </div>
                    </Card.Body>
                  </Col>
                  <Col lg={4}>
                    <Card.Body className="p-4">
                      <Card.Text>
                        <div
                          style={{
                            marginTop: "2rem",
                            marginBottom: "1rem",
                            fontSize: "1.1rem",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faCalendar}
                            style={{
                              marginRight: "0.5rem",
                              fontSize: "1.1rem",
                            }}
                          />
                          {formattedDate}
                        </div>
                      </Card.Text>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </a>
          );
        })}
    </div>
  );
}

export default ShowPrescriptions;
