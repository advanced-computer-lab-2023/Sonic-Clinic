import React, { useEffect, useState } from "react";
import { Card, Col, Row, Image, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import prescriptionImg from "../../Assets/Prescription.jpg";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setPrescriptionData } from "../../state/prescriptionIdReducer";
import axios from "axios";

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
        <div style={{ textAlign: "center", marginTop: "20px" }}>
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
                className="mb-4 mx-3~ bg-light"
                style={{ cursor: "pointer" }}
              >
                <Row>
                  <Col lg={4}>
                    <div className="prescription-icon-container">
                      <Image
                        src={prescriptionImg}
                        fluid
                        className="doctor-image"
                      />
                    </div>
                  </Col>
                  <Col lg={8}>
                    <Card.Body className="p-4">
                      <Card.Title className="show-more-title">
                        Prescription {index + 1}
                      </Card.Title>
                      <Card.Text>
                        <div className="show-more-date">
                          <FontAwesomeIcon
                            icon={faCalendar}
                            style={{ marginRight: "0.5rem" }}
                          />
                          {formattedDate} {/* Display the formatted date */}
                        </div>
                        <div
                          className={`show-more-status ${
                            prescription.status === "Filled"
                              ? "filled"
                              : "unfilled"
                          }`}
                        >
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            style={{ marginRight: "0.5rem" }}
                          />
                          {prescription.status}
                        </div>
                        <div className="show-more-doctor">
                          Dr. {prescription.doctorName}
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
