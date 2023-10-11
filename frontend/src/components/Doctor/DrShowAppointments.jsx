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

  const filterDate = useSelector((state) => state.filterDrAppointments.date);
  const filterStatus = useSelector(
    (state) => state.filterDrAppointments.status
  );

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
  const filteredAppointments = appointments.filter((appointment) => {
    const isoDate = appointment.date; // Assuming appointment.date is in ISO format like "2023-10-05T14:30:00.000Z"
    const dateObj = new Date(isoDate);
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0"); // Adding 1 to the month because it's zero-based
    const dd = String(dateObj.getDate()).padStart(2, "0");

    const formattedDate = `${yyyy}-${mm}-${dd}`;
    const status = appointment.status ? appointment.status.toLowerCase() : "";
    console.log("formattedDate", formattedDate);
    console.log("filterDate", filterDate.toLowerCase());

    // Check if the formattedDate includes the filterDate and the status includes filterStatus, both in lowercase
    return (
      formattedDate.includes(filterDate.toLowerCase()) &&
      status.includes(filterStatus.toLowerCase())
    );
  });

  return (
    <div>
      {/* change to filterAppointments */}
      {filteredAppointments.map((appointment) => (
        <Link
          // to={`/appointment/${appointment.appointmentId}`}
          key={appointment._Id}
          className="text-decoration-none"
        >
          <Card className="mb-4 mx-3~ bg-light" style={{ cursor: "pointer" }}>
            <Row>
              <Col lg={4}>
                <div
                  className={`appointment-icon-container
                ${appointment.status === "filled" ? "confirmed" : "cancelled"}`}
                >
                  <FontAwesomeIcon
                    icon={
                      appointment.status === "filled"
                        ? faCheckCircle
                        : faTimesCircle
                    }
                    style={{ height: "2rem" }}
                  />
                </div>
              </Col>
              <Col lg={8}>
                <Card.Body className="p-4">
                  <Card.Title className="show-more-title">
                    {appointment.patient.name}
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
