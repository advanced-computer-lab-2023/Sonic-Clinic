import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faFileAlt,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";

function ShowPrescriptions() {
  const prescriptions = [
    {
      prescriptionId: 1,
      date: "2023-10-15",
      doctor: "Dr. John Doe",
      status: "Filled",
    },
    {
      prescriptionId: 2,
      date: "2023-10-16",
      doctor: "Dr. Jane Smith",
      status: "Unfilled",
    },
    // Add more prescription objects as needed
  ];

  return (
    <div>
      {prescriptions.map((prescription) => (
        <Link
          to={`/prescription/${prescription.prescriptionId}`}
          key={prescription.prescriptionId}
          className="text-decoration-none"
        >
          <Card className="mb-4 mx-3~ bg-light" style={{ cursor: "pointer" }}>
            <Row>
              <Col lg={4}>
                <div className="prescription-icon-container">
                  <FontAwesomeIcon
                    icon={faFileAlt}
                    className="prescription-icon"
                  />
                </div>
              </Col>
              <Col lg={8}> 
                <Card.Body className="p-4">
                  <Card.Title className="show-more-title">
                    Prescription {prescription.prescriptionId}
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
                        prescription.status === "Filled" ? "filled" : "unfilled"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={faCheckCircle}
                        style={{ marginRight: "0.5rem" }}
                      />
                      {prescription.status}
                    </div>
                    <div className="show-more-doctor">
                      {prescription.doctor}
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
