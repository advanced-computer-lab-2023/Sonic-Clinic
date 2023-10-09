import React, { useState, useEffect } from "react";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import axios from "axios";

function DrShowAppointments() {
  const [responseData, setResponseData] = useState([]);
  const [error, setError] = useState(null);
  const _id = useSelector((state) => state.doctorLogin.userId);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const config = {
      headers: {
        _id: _id,
      },
    };
    console.log(_id);
    try {
      const response = await axios.post("/viewDocApp", { _id: _id }, config);
      if (response.status === 200) {
        setResponseData(response.data);
      } else {
        console.log("Server error");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No data found.");
      } else if (error.response && error.response.status === 500) {
        setError("Server Error");
      }
    }
  };

  const appointments = responseData;

  return (
    <div>
      {appointments.map((appointment) => (
        <Link
          // to={`/appointment/${appointment.appointmentId}`}
          // key={appointment.appointmentId}
          className="text-decoration-none"
        >
          <Card className="mb-4 mx-3~ bg-light" style={{ cursor: "pointer" }}>
            <Row>
              <Col lg={4}>
                <div
                // className={`appointment-icon-container
                // ${ appointment.status === "Filled"
                //     ? "confirmed"
                //     : "cancelled"
                // }`}
                >
                  <FontAwesomeIcon
                    icon={
                      appointment.status === "Filled"
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
                    Patient: {appointment.patient.name}
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
                        appointment.status === "Filled"
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
