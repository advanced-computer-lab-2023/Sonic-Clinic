import React, { useState, useEffect } from "react";
import { Card, Col, Row, Spinner, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function DrFollowUps() {
  const [error1, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [appointments, setAppointments] = useState(null);
  const [loading, setLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.post("/viewDocApp");
      if (response.status === 200) {
        setResponseData(response.data);
        setAppointments(responseData);
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

  const acceptApp = async (id) => {
    console.log(id);
  };

  const revokeApp = async (id) => {
    console.log(id);
  };

  const handleSearch = () => {
    setAppointments(
      responseData.filter((app) =>
        app.patient.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

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
      <div
        className="d-flex justify-content-center align-items-center flex-row"
        style={{
          width: "60rem",
          marginBottom: "2rem",
        }}
      >
        <Form.Control
          type="text"
          placeholder="Search Patients"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ height: "2.5rem" }}
        />
        <Button
          variant="primary"
          type="submit"
          style={{ width: "8rem", height: "2.5rem", marginLeft: "1rem" }}
          onClick={handleSearch}
        >
          Search
          <FontAwesomeIcon
            icon={faSearch}
            style={{
              opacity: 1,
              color: "white",
              fontSize: "1rem",
              marginLeft: "1rem",
            }}
          />
        </Button>
      </div>
      {appointments?.length === 0 && !loading && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>{error1}</div>
      )}
      {!loading &&
        appointments?.map((appointment) => {
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
            <div
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
                  height: "10rem",
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
                        backgroundColor: "#adb5bd ",
                        borderRadius: "10px 0 0 10px",
                        height: "10rem",
                        width: "2.5rem",
                      }}
                    ></div>
                  </Col>
                  <Col lg={4}>
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
                  <Col lg={4}>
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
                  <Col lg={2}>
                    <div
                      className="d-flex flex-row justify-content-space-between"
                      style={{ marginTop: "6rem", marginLeft: "1rem" }}
                    >
                      <Button
                        style={{ marginRight: "1rem" }}
                        onClick={() => acceptApp(appointment._id)}
                      >
                        Accept
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => revokeApp(appointment._id)}
                      >
                        Revoke
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card>
            </div>
          );
        })}
    </div>
  );
}

export default DrFollowUps;
