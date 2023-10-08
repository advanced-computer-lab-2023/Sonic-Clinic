import React, { useEffect, useState } from "react";
import { Card, Col, Row, Image, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import prescriptionImg from "../../Assets/Prescription.jpg";
import axios from "axios";
import { useSelector } from "react-redux";

function ShowPrescriptions() {
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [error1, setError] = useState(null);
  const id = useSelector((state) => state.patientLogin.userId);

  useEffect(() => {
    fetchData();
  }, {});

  const fetchData = async () => {
    try {
      const response = await axios.post("/viewPrescriptions", {
        _id: id,
      });
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
      {responseData.length === 0 && !loading && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          You don't have any prescriptions.
        </div>
      )}
      {!loading &&
        responseData.map((prescription, index) => {
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
            <Link
              to={`/prescription/${prescription._id}`}
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
                          {prescription.doctorName}
                        </div>
                      </Card.Text>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </Link>
          );
        })}
    </div>
  );
}

export default ShowPrescriptions;
