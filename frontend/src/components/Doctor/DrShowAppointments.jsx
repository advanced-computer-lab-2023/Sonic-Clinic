import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

function DrShowAppointments() {
  const appointments = [
    {
      appointmentId: 1,
      date: "2023-10-15",
      time: "10:00 AM",
      status: "Confirmed",
    },
    {
      appointmentId: 2,
      date: "2023-10-16",
      time: "2:30 PM",
      status: "Cancelled",
    },
    // Add more appointment objects as needed
  ];

  return (
    <div>
      {appointments.map((appointment) => (
        <Link
          to={`/appointment/${appointment.appointmentId}`}
          key={appointment.appointmentId}
          className="text-decoration-none"
        >
          <Card className="mb-4 mx-3~ bg-light" style={{ cursor: "pointer" }}>
            <Row>
              <Col lg={4}>
                <div
                  className={`appointment-icon-container ${
                    appointment.status === "Confirmed"
                      ? "confirmed"
                      : "cancelled"
                  }`}
                >
                  <FontAwesomeIcon
                    icon={
                      appointment.status === "Confirmed"
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
                    Appointment {appointment.appointmentId}
                  </Card.Title>
                  <Card.Text>
                    <div className="show-more-date">
                      <FontAwesomeIcon
                        icon={faCalendar}
                        style={{ marginRight: "0.5rem" }}
                      />
                      {appointment.date}
                    </div>
                    <div className="show-more-time">
                      <FontAwesomeIcon
                        icon={faClock}
                        style={{ marginRight: "0.5rem" }}
                      />
                      {appointment.time}
                    </div>
                    <div
                      className={`show-more-status ${
                        appointment.status === "Confirmed"
                          ? "confirmed"
                          : "cancelled"
                      }`}
                    >
                      {appointment.status}
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

export default DrShowAppointments;
