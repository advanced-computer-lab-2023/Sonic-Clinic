import React, { useState } from "react";
import { Card, Col, Row, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

function DrShowPatients() {
  const Patients = [
    {
      PatientName: ': Ahmed',
      date: "2023-10-15",
      time: "10:00 AM",
      status: "Confirmed",
    },
    {
      PatientName: ': Lola',
      date: "2023-10-16",
      time: "2:30 PM",
      status: "Cancelled",
    },
    // Add more appointment objects as needed
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPatients = Patients.filter((Patient) =>
    Patient.PatientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <Form className="my-4 mx-3">
        <Form.Control
          type="text"
          placeholder="Search Patients"
          value={searchTerm}
          onChange={handleSearch}
        />
      </Form>
      {filteredPatients.map((Patient) => (
        <Link
          to={`/appointment/${Patient.PatientName}`}
          key={Patient.PatientName}
        >
          <Card className="mb-4 mx-3~ bg-light" style={{ cursor: "pointer" }}>
            <Row>
              <Col lg={4}>
                <div
                  className={`appointment-icon-container ${
                    Patient.status === "Confirmed"
                      ? "confirmed"
                      : "cancelled"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={
                      Patient.status === "Confirmed"
                        ? faCheckCircle
                        : faTimesCircle
                    }
                    className="appointment-icon"
                  />
                </div>
              </Col>
              <Col lg={8}>
                <Card.Body className="p-4">
                  <Card.Title className="show-more-title">
                    Patient Name {Patient.PatientName}
                  </Card.Title>
                  <Card.Text>
                    <div className="show-more-date">
                      <FontAwesomeIcon
                        icon={faCalendar}
                        style={{ marginRight: "0.5rem" }}
                      />
                      {Patient.date}
                    </div>
                    <div className="show-more-time">
                      <FontAwesomeIcon
                        icon={faClock}
                        style={{ marginRight: "0.5rem" }}
                      />
                      {Patient.time}
                    </div>
                    <div
                      className={`show-more-status ${
                        Patient.status === "Confirmed"
                          ? "confirmed"
                          : "cancelled"
                      }`}
                    >
                      {Patient.status}
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

export default DrShowPatients;
