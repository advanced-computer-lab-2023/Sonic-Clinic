import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  faCalendar,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faCheckDouble,
} from "@fortawesome/free-solid-svg-icons";
import { Card, Col, Row, Image, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import prescriptionImg from "../../Assets/Prescription.jpg";
import axios from "axios";
import { useSelector } from "react-redux";
import { useState } from "react";

function ShowAppointments() {
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [error1, setError] = useState(null);
  const id = useSelector((state) => state.patientLogin.userId);
  const filterDate = useSelector((state) => state.filterAppointments.date);
  const filterStatus = useSelector((state) => state.filterAppointments.status);

  useEffect(() => {
    fetchData();
  }, {});

  const fetchData = async () => {
    try {
      const response = await axios.post("/viewAllAppointments", {
        _id: id,
      });
      if (response.status === 200) {
        setResponseData(response.data);
      } else {
        console.log("Server error");
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(" You don't have any appointments.");
      } else if (error.response && error.response.status === 500) {
        setError("Server Error");
      } else {
        setError("An error occurred. Please try again later.");
      }
      setLoading(false);
    }
  };
  const NeededData = responseData;

  const filteredAppointments = NeededData.filter((appointment) => {
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
        filteredAppointments.map((appointment, index) => {
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
              to={`/prescription/${appointment._id}`}
              key={appointment.prescriptionId}
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
                        Appointment {index + 1}
                      </Card.Title>
                      <Card.Text>
                        <div className="show-more-date">
                          <FontAwesomeIcon
                            icon={faCalendar}
                            style={{ marginRight: "0.5rem" }}
                          />
                          {formattedDate}
                        </div>
                        <div className="show-more-date">
                          <FontAwesomeIcon
                            icon={faTimesCircle}
                            style={{ marginRight: "0.5rem" }}
                          />
                          {formattedTime}
                        </div>
                        <div className="show-more-date">
                          <FontAwesomeIcon
                            icon={faCheckDouble}
                            style={{ marginRight: "0.5rem" }}
                          />
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

export default ShowAppointments;
