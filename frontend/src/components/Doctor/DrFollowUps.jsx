import React, { useState, useEffect } from "react";
import { Card, Col, Row, Spinner, Button, Form, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function DrFollowUps() {
  const [error1, setError] = useState(null);
  const [responseData, setResponseData] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [revokeModal, setRevokeModal] = useState(false);
  const [acceptModal, setAcceptModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.post("/viewFollowUpsReq");
      if (response.status === 200) {
        setLoading(null);
        setResponseData(response.data);
        setAppointments(response.data);
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
    setError(null);
    try {
      const response = await axios.post("/acceptFollowUp", {
        _id: id,
      });
      if (response.status === 200) {
        setAcceptModal(true);
        setError(null);
        fetchData();
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const revokeApp = async (id) => {
    setError(null);
    try {
      const response = await axios.post("/rejectFollowUp", {
        _id: id,
      });
      if (response.status === 200) {
        setRevokeModal(false);
        setError(null);
        fetchData();
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const handleSearch = () => {
    setAppointments(
      responseData.filter((app) =>
        app.patientName.toLowerCase().includes(searchTerm.toLowerCase())
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
          width: "50rem",
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
      {appointments.length === 0 && (
        <div
          style={{
            textAlign: "center",
            marginTop: "2rem",
            width: "20rem",
            marginLeft: "15rem",
          }}
          className="msg"
        >
          No follow up requests
        </div>
      )}
      <div className="d-flex justify-content-center align-items-center">
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
            const formattedTime = `${hours
              .toString()
              .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
            return (
              <div
                key={appointment._id}
                className="text-decoration-none "
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
                    width: "50rem",
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
                            marginTop: "2.3rem",
                            fontSize: "1.5rem",
                            fontWeight: "bold",
                            color: "#212529",
                            marginBottom: "1rem",
                          }}
                        >
                          {appointment.patientName}
                        </Card.Title>
                      </Card.Body>
                    </Col>
                    <Col lg={4}>
                      <Card.Body className="p-4">
                        <Card.Text>
                          <div
                            className="show-more-date"
                            style={{
                              marginTop: "1.5rem",
                              marginBottom: "1rem",
                              fontSize: "1.1rem",
                            }}
                          >
                            <FontAwesomeIcon
                              icon={faCalendar}
                              style={{
                                marginRight: "0.5rem",
                                fontSize: "1.1rem",
                              }}
                            />
                            {formattedDate}
                          </div>
                          <div
                            className="show-more-time"
                            style={{ marginBottom: "1rem", fontSize: "1.1rem" }}
                          >
                            <FontAwesomeIcon
                              icon={faClock}
                              style={{
                                marginRight: "0.5rem",
                                fontSize: "1.1rem",
                              }}
                            />
                            {appointment.time}
                          </div>
                        </Card.Text>
                      </Card.Body>
                    </Col>
                    <Col lg={2}>
                      <div
                        style={{
                          marginTop: "2.3rem",
                          marginLeft: "1rem",
                        }}
                      >
                        <Modal show={acceptModal}>
                          <Modal.Body>
                            {appointment.patient?.name}'s follow up request has
                            been accepted
                          </Modal.Body>
                          <Modal.Footer>
                            <Button
                              variant="secondary"
                              onClick={() => setAcceptModal(false)}
                            >
                              Close
                            </Button>
                          </Modal.Footer>
                        </Modal>
                        <Modal show={revokeModal}>
                          <Modal.Body>
                            Are you sure you want to revoke this follow up
                            request?
                            {error1 && <div className="error">{error1}</div>}
                          </Modal.Body>
                          <Modal.Footer className="d-flex align-items-center justify-content-center">
                            <Button
                              variant="secondary"
                              onClick={() => revokeApp(appointment._id)}
                            >
                              Yes
                            </Button>
                            <Button
                              variant="primary"
                              onClick={() => setRevokeModal(false)}
                            >
                              No
                            </Button>
                          </Modal.Footer>
                        </Modal>
                        <Button
                          style={{ marginBottom: "1rem" }}
                          onClick={() => acceptApp(appointment._id)}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="secondary"
                          onClick={() => setRevokeModal(true)}
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
    </div>
  );
}

export default DrFollowUps;
