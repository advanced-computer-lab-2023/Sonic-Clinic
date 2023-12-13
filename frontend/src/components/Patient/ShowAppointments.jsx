import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  faCalendar,
  faClock,
  faCancel,
  faCheck,
  faPause,
  faCheckDouble,
} from "@fortawesome/free-solid-svg-icons";
import { Card, Col, Row, Spinner, Button, Modal, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { setNewNotifications } from "../../state/notifications";

function ShowAppointments() {
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [error1, setError] = useState(null);
  const [msg, setMsg] = useState(null);
  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [rescheduleSlots, setRescheduleSlots] = useState([]);
  const [rescheduleSlot, setRescheduleSlot] = useState([]);
  const [followUpModal, setFollowUpModal] = useState(false);
  const [followUpSlot, setFollowUpSlot] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [confirmFollowModal, setConfirmFollowModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const filterDate = useSelector((state) => state.filterAppointments.date);
  const filterStatus = useSelector((state) => state.filterAppointments.status);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
  }, {});

  const fetchData = async () => {
    try {
      const response = await axios.post("/viewAllAppointmentsPatient");
      if (response.status === 200) {
        setResponseData(response.data);
        setMsg(null);
      } else {
        console.log("Server error");
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMsg(" You don't have any appointments.");
        setError(null);
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
    // Check if the formattedDate includes the filterDate and the status includes filterStatus, both in lowercase
    return (
      formattedDate.includes(filterDate.toLowerCase()) &&
      status.includes(filterStatus.toLowerCase()) &&
      status !== "free" &&
      status !== "Free"
    );
  });

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

  const cancelApp = async (id) => {
    setError(null);
    try {
      const response = await axios.post("/cancelAppointmentPatient", {
        id: id,
      });
      if (response.status === 200) {
        fetchData();
        dispatch(setNewNotifications(true));
        setError(null);
        setCancelModal(false);
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const fetchAvailableSlots = async (id) => {
    try {
      const response = await axios.post(
        `/viewAvailableAppointmentsOfDoctor?_id=${id}`
      );
      if (response.status === 200) {
        setError(null);
        setRescheduleSlots(response.data.availableSlots);
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const rescheduleApp = async (id) => {
    const date = rescheduleSlot.split(" ")[0];
    const time = rescheduleSlot.split(" ")[1];
    try {
      const response = await axios.post("/rescheduleAppForMyselfOrFam", {
        appId: id,
        date: date,
        time: time,
      });
      if (response.status === 200) {
        fetchData();
        setError(null);
        setConfirmModal(true);
        dispatch(setNewNotifications(true));
        setRescheduleModal(false);
        setRescheduleSlot(null);
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const followUpApp = async (id) => {
    const date = followUpSlot.split(" ")[0];
    const time = followUpSlot.split(" ")[1];
    try {
      const response = await axios.post("/reqFollowUpForMyselfOrFam", {
        appId: id,
        date: date,
        time: time,
      });
      if (response.status === 200) {
        fetchData();
        setError(null);
        dispatch(setNewNotifications(true));
        setFollowUpSlot(null);
        setConfirmFollowModal(true);
        setFollowUpModal(false);
      }
    } catch (error) {
      setError(error.response.data.message);
    }
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
      {filteredAppointments.length === 0 && !loading && (
        <div style={{ textAlign: "center", marginTop: "20px" }} className="msg">
          {msg}
        </div>
      )}
      {error1 && <div className="error">{error1}</div>}
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
              // to={`/prescription/${appointment._id}`}
              key={appointment.prescriptionId}
              className="text-decoration-none"
            >
              <Card
                style={{
                  cursor: "default",
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
                  <Col lg={4}>
                    <Card.Body>
                      <Card.Title
                        style={{
                          marginTop: "1.5rem",
                          fontSize: "1.5rem",
                          fontWeight: "bold",
                          color: "#212529",
                          marginBottom: "1rem",
                        }}
                      >
                        Dr {appointment.doctor[0]?.name}
                      </Card.Title>
                      <div
                        style={{
                          marginBottom: "1rem",
                          fontSize: "1.2rem",
                          color: "#099BA0 ",
                        }}
                      >
                        {appointment.doctor[0]?.specialty}
                      </div>
                    </Card.Body>
                  </Col>
                  <Col lg={4}>
                    <Card.Body className="p-4">
                      <Card.Text>
                        <div
                          style={{
                            marginTop: "2rem",
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
                          {appointment.date}
                        </div>
                        <div
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
                        marginTop: "3rem",
                        marginLeft: "1rem",
                      }}
                    >
                      {(appointment.status === "Upcoming" ||
                        appointment.status === "Rescheduled") && (
                        <div>
                          {" "}
                          <Button
                            style={{
                              marginBottom: "1rem",
                              width: "7rem",
                            }}
                            onClick={() => {
                              setRescheduleModal(true);
                              fetchAvailableSlots(appointment.doctor[0]?._id);
                            }}
                          >
                            Reschedule
                          </Button>
                          <Modal show={rescheduleModal}>
                            <Modal.Header>
                              <Modal.Title>
                                Reschedule Appointment with Dr.{" "}
                                {appointment.doctor[0]?.name}
                              </Modal.Title>
                            </Modal.Header>
                            <Modal.Body style={{ margin: "1rem" }}>
                              <div
                                style={{
                                  color: "#099BA0 ",
                                  fontSize: "1.1rem",
                                  fontStyle: "normal",
                                  fontWeight: 500,
                                  lineHeight: "100%",
                                  marginBottom: "1rem",
                                }}
                              >
                                Available Slots
                              </div>
                              <Form.Control
                                as="select"
                                value={rescheduleSlot}
                                onChange={(e) =>
                                  setRescheduleSlot(e.target.value)
                                }
                              >
                                <option value="">Select available slot</option>
                                {rescheduleSlots.map((slot) => (
                                  <option value={slot}>{slot}</option>
                                ))}
                              </Form.Control>
                            </Modal.Body>
                            <Modal.Footer>
                              <Button
                                variant="primary"
                                onClick={() => {
                                  rescheduleApp(appointment._id);
                                }}
                                disabled={rescheduleSlot == null}
                              >
                                Save
                              </Button>
                              <Button
                                variant="secondary"
                                onClick={() => {
                                  setRescheduleModal(false);
                                  setRescheduleSlot(null);
                                }}
                              >
                                Cancel
                              </Button>
                            </Modal.Footer>
                          </Modal>
                          <Modal show={confirmModal}>
                            <Modal.Body>
                              The appointment has been rescheduled
                            </Modal.Body>
                            <Modal.Footer>
                              <Button
                                variant="secondary"
                                onClick={() => setConfirmModal(false)}
                              >
                                Close
                              </Button>
                            </Modal.Footer>
                          </Modal>
                          <Button
                            variant="secondary"
                            style={{ width: "7rem" }}
                            onClick={() => setCancelModal(true)}
                          >
                            Cancel
                          </Button>
                          <Modal show={cancelModal}>
                            <Modal.Body>
                              Are you sure you want to cancel this appointment?
                            </Modal.Body>
                            <Modal.Footer className="d-flex align-items-center justify-content-center">
                              <Button
                                variant="secondary"
                                onClick={() => cancelApp(appointment._id)}
                              >
                                Yes
                              </Button>
                              <Button
                                variant="primary"
                                onClick={() => setCancelModal(false)}
                              >
                                No
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        </div>
                      )}
                      {appointment.status == "Completed" && (
                        <>
                          <Button
                            style={{
                              marginTop: "1.5rem",
                              width: "7rem",
                            }}
                            onClick={() => {
                              setFollowUpModal(true);
                              fetchAvailableSlots(appointment.doctor[0]?._id);
                            }}
                          >
                            Follow Up
                          </Button>
                          <Modal show={followUpModal}>
                            <Modal.Header>
                              <Modal.Title>
                                Schedule a follow up with Dr.{" "}
                                {appointment.doctor[0]?.name}
                              </Modal.Title>
                            </Modal.Header>
                            <Modal.Body style={{ margin: "1rem" }}>
                              <div
                                style={{
                                  color: "#099BA0 ",
                                  fontSize: "1.1rem",
                                  fontStyle: "normal",
                                  fontWeight: 500,
                                  lineHeight: "100%",
                                  marginBottom: "1rem",
                                }}
                              >
                                Available Slots
                              </div>
                              <Form.Control
                                as="select"
                                value={followUpSlot}
                                onChange={(e) =>
                                  setFollowUpSlot(e.target.value)
                                }
                              >
                                <option value="">Select available slot</option>
                                {rescheduleSlots.map((slot) => (
                                  <option value={slot}>{slot}</option>
                                ))}
                              </Form.Control>
                            </Modal.Body>
                            <Modal.Footer>
                              <Button
                                variant="primary"
                                onClick={() => {
                                  if (followUpSlot !== null) {
                                    followUpApp(appointment._id);
                                  }
                                }}
                                disabled={followUpSlot === null}
                              >
                                Save
                              </Button>
                              <Button
                                variant="secondary"
                                onClick={() => {
                                  setFollowUpModal(false);
                                  setFollowUpSlot(null);
                                }}
                              >
                                Cancel
                              </Button>
                            </Modal.Footer>
                          </Modal>
                          <Modal show={confirmFollowModal}>
                            <Modal.Body>
                              A follow up request has been sent, wait for
                              confirmation via email.
                            </Modal.Body>
                            <Modal.Footer>
                              <Button
                                variant="secondary"
                                onClick={() => setConfirmFollowModal(false)}
                              >
                                Close
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        </>
                      )}
                    </div>
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
