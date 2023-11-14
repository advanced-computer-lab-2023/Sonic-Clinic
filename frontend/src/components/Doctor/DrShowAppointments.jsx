import React, { useState, useEffect } from "react";
import { Card, Col, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faCancel,
  faCheck,
  faPause,
  faCheckDouble,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { deleteFilterDrAppointments } from "../../state/Doctor/filterDrAppointments";

function DrShowAppointments({ fetchData, appointments, loading }) {
  const [error1, setError] = useState(null);
  const filterDate = useSelector((state) => state.filterDrAppointments.date);
  const filterStatus = useSelector(
    (state) => state.filterDrAppointments.status
  );
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
    dispatch(
      deleteFilterDrAppointments({
        date: "",
        status: "",
      })
    );
  }, []);

  const getStatusColor = (status) => {
    const lowerCaseStatus = status.toLowerCase();
    switch (lowerCaseStatus) {
      case "upcoming":
        return "#05afb9"; // Blue for Upcoming
      case "completed":
        return "#adb5bd "; // Grey for Completed
      case "cancelled":
        return "#ff6b35 "; // Orange for Cancelled
      case "rescheduled":
        return "#c4e6e6  "; // Light Blue for Rescheduled
      default:
        return "#ff6b35"; // Default color
    }
  };

  const getStatusIcon = (status) => {
    const lowerCaseStatus = status.toLowerCase();
    switch (lowerCaseStatus) {
      case "upcoming":
        return faCheck; // Blue for Upcoming
      case "completed":
        return faCheckDouble; // Grey for Completed
      case "cancelled":
        return faCancel; // Orange for Cancelled
      case "rescheduled":
        return faPause; // Light Blue for Rescheduled
      default:
        return faPause; // Default color
    }
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const isoDate = appointment.date; // Assuming appointment.date is in ISO format like "2023-10-05T14:30:00.000Z"
    const dateObj = new Date(isoDate);
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0"); // Adding 1 to the month because it's zero-based
    const dd = String(dateObj.getDate()).padStart(2, "0");

    const formattedDate = `${yyyy}-${mm}-${dd}`;
    const status = appointment.status ? appointment.status.toLowerCase() : "";

    if (filterDate === "" && filterStatus === "") {
      // If both filterDate and filterStatus are empty, include all appointments.
      return true;
    }

    // Check if the formattedDate includes the filterDate and the status includes filterStatus, both in lowercase
    return (
      (filterDate === "" || formattedDate.includes(filterDate.toLowerCase())) &&
      (filterStatus === "" || status.includes(filterStatus.toLowerCase()))
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
      {filteredAppointments.length === 0 && !loading && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>{error1}</div>
      )}
      {!loading &&
        filteredAppointments.map((appointment) => {
          // Parse the date string into a Date object
          const appointmentDate = new Date(appointment.date);
          // Format the date as "dd/mm/yyyy"
          const formattedDate = `${appointmentDate
            .getDate()
            .toString()
            .padStart(2, "0")}/${(appointmentDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${appointmentDate.getFullYear()}`;
          const hours = appointmentDate.getHours();
          const minutes = appointmentDate.getMinutes();
          // Format the time as HH:MM (24-hour format)
          const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}`;

          return (
            <Link
              key={appointment._id}
              className="text-decoration-none"
              // to={`/appointment/${appointment.appointmentId}`}
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
                        backgroundColor: getStatusColor(appointment.status),
                        borderRadius: "10px 0 0 10px",
                        height: "12rem",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={getStatusIcon(appointment.status)}
                        style={{
                          fontSize: "1.5em",
                          color: "white",
                        }}
                      />
                    </div>
                  </Col>
                  <Col lg={5}>
                    <Card.Body className="p-4">
                      <Card.Title
                        style={{
                          marginTop: "2rem",
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          color: "#212529",
                          marginBottom: "1rem",
                        }}
                      >
                        {appointment.patient?.name}
                      </Card.Title>
                      <Card.Text>
                        <div
                          style={{
                            marginBottom: "1rem",
                            fontSize: "1rem",
                          }}
                        >
                          {appointment.description}
                        </div>
                      </Card.Text>
                    </Card.Body>
                  </Col>
                  <Col lg={5}>
                    <Card.Body className="p-4">
                      <Card.Text>
                        <div
                          className="show-more-date"
                          style={{
                            marginTop: "2rem",
                            marginBottom: "1rem",
                            fontSize: "1rem",
                          }}
                        >
                          <FontAwesomeIcon
                            icon={faCalendar}
                            style={{
                              marginRight: "0.5rem",
                              fontSize: "1.2rem",
                            }}
                          />
                          {formattedDate}
                        </div>
                        <div
                          className="show-more-time"
                          style={{ marginBottom: "1rem", fontSize: "1rem" }}
                        >
                          <FontAwesomeIcon
                            icon={faClock}
                            style={{
                              marginRight: "0.5rem",
                              fontSize: "1.2rem",
                            }}
                          />
                          {appointment.time}
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

export default DrShowAppointments;
