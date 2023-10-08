import React, { useEffect, useState } from "react";
import { Card, Col, Row, Image, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faCapsules,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import prescriptionImg from "../../Assets/Prescription.jpg";
import axios from "axios";
import { useSelector } from "react-redux";

function ShowPrescriptions() {
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState([]); // Initialize as an empty array
  const [error1, setError] = useState(null);
  const id = useSelector((state) => state.patientLogin.userId);

  useEffect(() => {
    fetchData();
  }, {}); // Fetch data when searchData changes

  const fetchData = async () => {
    try {
      const response = await axios.post("/viewPrescriptions", {
        _id: "65227ce336503a9cd488289e",
      });
      if (response.status === 200) {
        console.log("RESPONSE:", response.data);
        setResponseData(response.data.prescriptions);
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
  console.log(NeededData);

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
      {!loading &&
        NeededData.map((prescription) => (
          <Link
            to={`/prescription/${prescription._id}`}
            key={prescription.prescriptionId}
            className="text-decoration-none"
          >
            <Card className="mb-4 mx-3~ bg-light" style={{ cursor: "pointer" }}>
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
                      Prescription {prescription._id}
                    </Card.Title>
                    <Card.Text>
                      <div className="show-more-date">
                        <FontAwesomeIcon
                          icon={faCalendar}
                          style={{ marginRight: "0.5rem" }}
                        />
                        {prescription.date}
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
                        {prescription.doctorID}
                      </div>
                    </Card.Text>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </Link>
        ))}
    </div>
  );
}

export default ShowPrescriptions;
