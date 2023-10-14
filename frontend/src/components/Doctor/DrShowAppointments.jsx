import React, { useState, useEffect } from "react";
import { Card, Col, Row, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { deleteFilterDrAppointments } from "../../state/Doctor/filterDrAppointments";
import axios from "axios";

function DrShowAppointments() {
  const [responseData, setResponseData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error1, setError] = useState(null);
  const _id = useSelector((state) => state.doctorLogin.userId);
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
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No data found.");
      } else if (error.response && error.response.status === 500) {
        setError("Server Error");
      }
      setLoading(false);
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

  console.log("Check:", filteredAppointments);

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
      {/* {error1 && <div style={{ color: "red" }}>{error1}</div>} */}
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
              key={appointment._id} // Use _id as the key
              to={`/appointment/${appointment.appointmentId}`}
              className="text-decoration-none"
            >
              <Card
                className={`mb-4 mx-3~ bg-light ${
                  appointment.status === "Confirmed" ? "confirmed" : "cancelled"
                }`}
                style={{ cursor: "pointer" }}
              >
                <Row>
                  <Col lg={4}>
                    <div className="appointment-icon-container">
                      <FontAwesomeIcon
                        icon={
                          appointment.status === "Confirmed"
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
                          {formattedDate}
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
          );
        })}
    </div>
  );
}

export default DrShowAppointments;
