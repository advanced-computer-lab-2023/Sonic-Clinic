import React, { useState } from "react";
import { Card, Col, Row, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock, faCheckCircle, faTimesCircle, faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

function DrShowPatients() {
  const Patients = [
    {
      PatientName: 'Ahmed',
      date: "2023-10-15",
      time: "10:00 AM",
      status: "Confirmed",
      upcomingAppointments: [
        {
          date: "2023-10-20",
          time: "9:30 AM",
          status: "Confirmed",
        },
        {
          date: "2023-10-25",
          time: "11:00 AM",
          status: "Confirmed",
        },
      ],
      age: 35,
      gender: "Male",
      medicalHistory: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce auctor euismod lacus, non cursus nunc fringilla ut.",
    },
    {
      PatientName: 'Lola',
      date: "2023-10-16",
      time: "2:30 PM",
      status: "Cancelled",
      upcomingAppointments: [],
      age: 28,
      gender: "Female",
      medicalHistory: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce auctor euismod lacus, non cursus nunc fringilla ut.",
    },
    // Add more patient objects as needed
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPatients = Patients.filter((patient) =>
    patient.PatientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [expandedPatient, setExpandedPatient] = useState(null);

  const toggleExpand = (index) => {
    if (expandedPatient === index) {
      setExpandedPatient(null);
    } else {
      setExpandedPatient(index);
    }
  };

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
      {filteredPatients.map((patient, index) => (
        <Card className="mb-4 mx-3 bg-light" key={patient.PatientName}>
          <Card.Header
            className="d-flex align-items-center justify-content-between"
            onClick={() => toggleExpand(index)}
            style={{ cursor: "pointer" }}
          >
            <span>Patient Name: {patient.PatientName}</span>
            <FontAwesomeIcon
              icon={expandedPatient === index ? faChevronUp : faChevronDown}
            />
          </Card.Header>
          {expandedPatient === index && (
            <Card.Body>
              <Row>
                <Col lg={4}>
                  <div
                    className={`appointment-icon-container ${
                      patient.status === "Confirmed" ? "confirmed" : "cancelled"
                    }`}
                  >
                    <FontAwesomeIcon
                      icon={
                        patient.status === "Confirmed"
                          ? faCheckCircle
                          : faTimesCircle
                      }
                      className="appointment-icon"
                    />
                  </div>
                </Col>
                <Col lg={8}>
                  <Card.Text>
                    <div className="show-more-date">
                      <FontAwesomeIcon
                        icon={faCalendar}
                        style={{ marginRight: "0.5rem" }}
                      />
                      {patient.date}
                    </div>
                    <div className="show-more-time">
                      <FontAwesomeIcon
                        icon={faClock}
                        style={{ marginRight: "0.5rem" }}
                      />
                      {patient.time}
                    </div>
                    <div
                      className={`show-more-status ${
                        patient.status === "Confirmed" ? "confirmed" : "cancelled"
                      }`}
                    >
                      {patient.status}
                    </div>
                    <hr />
                    <div className="upcoming-appointments">
                      <h5>Upcoming Appointments</h5>
                      {patient.upcomingAppointments.length === 0 ? (
                        <p>No upcoming appointments</p>
                      ) : (
                        <ul>
                          {patient.upcomingAppointments.map((appointment) => (
                            <li key={appointment.date}>
                              <div>{appointment.date}</div>
                              <div>{appointment.time}</div>
                              <div>{appointment.status}</div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <hr />
                    <div className="patient-info">
                      <h5>Patient Information</h5>
                      <p>Age: {patient.age}</p>
                      <p>Gender: {patient.gender}</p>
                      <p>Medical History: {patient.medicalHistory}</p>
                    </div>
                  </Card.Text>
                </Col>
              </Row>
            </Card.Body>
          )}
        </Card>
      ))}
    </div>
  );
}

export default DrShowPatients;