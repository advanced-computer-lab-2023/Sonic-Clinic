import React, { useEffect, useState } from "react";
import { Card, Button, Container, Modal, Form, Spinner } from "react-bootstrap";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { updatePatientWallet } from "../../state/loginPatientReducer";
import { setForFam } from "../../state/loginPatientReducer";
import { setNewApp } from "../../state/loginPatientReducer";

const DoctorAppointments = ({ onBookAppointment }) => {
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [responseUrl, setResponseUrl] = useState([]);
  const [error1, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [bookingStatus, setBookingStatus] = useState("booking");
  const [bookingName, setBookingName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [description, setDescription] = useState("");
  const [selectedFamilyMember, setSelectedFamilyMember] = useState("");
  const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState("");
  const doctorRate = useSelector(
    (state) => state.selectedDoctorData.hourlyRate
  );
  const doctorID = useSelector((state) => state.selectedDoctorData.id);
  const doctorLoc = useSelector(
    (state) => state.selectedDoctorData.affiliation
  );
  const wallet = useSelector((state) => state.patientLogin.wallet);

  const dispatch = useDispatch();

  const handleClose = () => {
    setShowModal(false); // Close the modal first
    setSelectedFamilyMember("");
    setError(null);
    setTimeout(() => {
      setBookingStatus("booking"); // Reset the status after a short delay
    }, 200); // Adjust the delay as needed
    setBookingName("");
    setPaymentMethod("wallet");
    setDescription("");
    setSelectedAppointment(null);
  };
  const handleFamilyMemberChange = (e) => {
    const selectedId = e.target.value;
    setSelectedFamilyMemberId(selectedId === "myself" ? "" : selectedId);
  };

  const handleBookClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  const handleBookAppointment = async () => {
    try {
      dispatch(
        setForFam({
          forFam: selectedFamilyMemberId,
        })
      );
      let apiUrl;

      if (paymentMethod === "creditCard") {
        apiUrl = "/payAppointmentStripe";
      } else {
        apiUrl = "/payAppointmentWallet";
      }

      let response;

      if (paymentMethod === "creditCard") {
        response = await axios.post(`${apiUrl}`, {
          famID: selectedFamilyMemberId,
          doctorID: doctorID,
          date: selectedAppointment.split(" ")[0],
          description: description,
          time: selectedAppointment.split(" ")[1],
        });
      } else {
        response = await axios.post(`${apiUrl}`, {
          famID: selectedFamilyMemberId,
          doctorID: doctorID,
          date: selectedAppointment.split(" ")[0],
          description: description,
          time: selectedAppointment.split(" ")[1],
        });
      }

      const newAppointment = {
        famID: selectedFamilyMemberId,
        doctorID: doctorID,
        date: selectedAppointment.split(" ")[0],
        description: description,
        time: selectedAppointment.split(" ")[1],
      };

      if (response.status === 200) {
        if (paymentMethod === "creditCard") {
          setResponseUrl(response.data.url);
          if (response.data.url) {
            dispatch(
              setNewApp({
                newApp: newAppointment,
              })
            );
            window.location.href = response.data.url;
          }
        } else {
          setBookingStatus("success");
          setError(null);
          dispatch(
            updatePatientWallet({
              wallet: wallet - doctorRate,
            })
          );
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        if (paymentMethod === "creditCard") {
        } else {
          setError(error.response.data.message);
        }
      } else {
        setError("An error occurred. Please try again later");
      }
    }
  };
  const id = useSelector((state) => state.selectedDoctorData.id);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.post(
        `/viewAvailableAppointmentsOfDoctor?_id=${id}`
      );
      if (response.status === 200) {
        setResponseData(response.data.availableSlots);
      } else {
        console.log("Server error");
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No Appointments found.");
      } else {
        setError("Server Error");
      }
      setLoading(false);
    }
  };
  const neededData = responseData;
  const familyMembers = useSelector((state) => state.patientLogin.family);

  return (
    <>
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

      {!loading && (
        <Container style={{ marginTop: "2rem" }}>
          <div className="justify-content-between d-flex">
            <h3 className="carousel-title" style={{ fontSize: "1.75rem" }}>
              Available Appointments
            </h3>
          </div>
          <p className="carousel-description">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              marginRight="20"
              viewBox="0 0 16 16"
              fill="none"
            >
              <g clip-path="url(#clip0_2849_11118)">
                <path
                  d="M8.51465 1.01802C8.34328 1.00537 8.17149 0.999034 7.99965 0.999024V-0.000976281C8.19619 -0.000880453 8.39266 0.00645786 8.58865 0.0210237L8.51465 1.01802ZM10.5187 1.46802C10.1981 1.34433 9.86888 1.24439 9.53365 1.16902L9.75265 0.193024C10.1357 0.279024 10.5127 0.393024 10.8787 0.535024L10.5187 1.46802ZM11.8887 2.17802C11.7457 2.08267 11.5992 1.99261 11.4497 1.90802L11.9427 1.03802C12.2846 1.23176 12.6118 1.45035 12.9217 1.69202L12.3067 2.48102C12.1711 2.37525 12.0317 2.27452 11.8887 2.17902V2.17802ZM13.7227 3.96802C13.5248 3.687 13.3066 3.42094 13.0697 3.17202L13.7937 2.48202C14.0637 2.76702 14.3137 3.07202 14.5407 3.39202L13.7227 3.96802ZM14.4667 5.32002C14.401 5.16148 14.3296 5.00538 14.2527 4.85202L15.1457 4.40202C15.3223 4.75311 15.4727 5.11677 15.5957 5.49002L14.6457 5.80302C14.5919 5.63989 14.5322 5.47878 14.4667 5.32002ZM14.9967 7.82702C14.9886 7.48336 14.9551 7.14077 14.8967 6.80202L15.8817 6.63202C15.9487 7.01802 15.9877 7.41002 15.9977 7.80202L14.9977 7.82702H14.9967ZM14.8657 9.36502C14.8987 9.19502 14.9257 9.02602 14.9467 8.85502L15.9397 8.97802C15.8916 9.36818 15.8147 9.75423 15.7097 10.133L14.7457 9.86602C14.7917 9.70102 14.8317 9.53402 14.8657 9.36502ZM13.9137 11.744C14.0977 11.454 14.2597 11.15 14.3997 10.836L15.3137 11.241C15.1537 11.601 14.9687 11.947 14.7587 12.279L13.9137 11.744ZM12.9497 12.949C13.0717 12.827 13.1887 12.701 13.2997 12.571L14.0577 13.224C13.9293 13.3729 13.7955 13.517 13.6567 13.656L12.9497 12.949Z"
                  fill="#495057"
                />
                <path
                  d="M7.99965 0.999024C6.84853 0.999107 5.7152 1.28307 4.70003 1.82576C3.68486 2.36845 2.8192 3.15312 2.17971 4.11027C1.54022 5.06742 1.14665 6.1675 1.03385 7.31308C0.921047 8.45866 1.0925 9.61438 1.53303 10.6779C1.97356 11.7414 2.66955 12.6798 3.55938 13.4101C4.4492 14.1403 5.50539 14.6399 6.63439 14.8645C7.76338 15.0891 8.93035 15.0318 10.0319 14.6977C11.1335 14.3636 12.1356 13.7629 12.9497 12.949L13.6567 13.656C12.7264 14.5868 11.5809 15.2738 10.3217 15.656C9.06248 16.0383 7.72842 16.1041 6.43772 15.8475C5.14701 15.591 3.93951 15.02 2.9222 14.1853C1.90489 13.3505 1.10919 12.2777 0.605587 11.0619C0.101986 9.84613 -0.0939613 8.5249 0.0351065 7.21529C0.164174 5.90568 0.614272 4.64812 1.34552 3.55404C2.07677 2.45996 3.06659 1.56313 4.22728 0.943026C5.38797 0.322919 6.6837 -0.00132529 7.99965 -0.000976281V0.999024Z"
                  fill="#495057"
                />
                <path
                  d="M7.49965 2.99902C7.63226 2.99902 7.75944 3.0517 7.85321 3.14547C7.94697 3.23924 7.99965 3.36642 7.99965 3.49902V8.70902L11.2477 10.565C11.3594 10.6325 11.4404 10.741 11.4733 10.8673C11.5061 10.9937 11.4883 11.1279 11.4235 11.2412C11.3587 11.3546 11.2522 11.4381 11.1266 11.4739C11.0011 11.5098 10.8665 11.4951 10.7517 11.433L7.25165 9.43302C7.17513 9.38931 7.11151 9.32615 7.06726 9.24993C7.023 9.17371 6.99968 9.08716 6.99965 8.99902V3.49902C6.99965 3.36642 7.05233 3.23924 7.1461 3.14547C7.23987 3.0517 7.36704 2.99902 7.49965 2.99902Z"
                  fill="#495057"
                />
              </g>
              <defs>
                <clipPath id="clip0_2849_11118">
                  <rect width="16" height="16" fill="white" />
                </clipPath>
              </defs>
            </svg>
            Book your desired appointment
          </p>
          <Swiper
            slidesPerView={2.5}
            spaceBetween={10}
            modules={[Pagination]}
            className="mySwiper custom-swipper"
          >
            {neededData &&
              neededData.map((appointment) => (
                <SwiperSlide>
                  {/* <a onClick={() => handleCard(appointment)}> */}
                  <Card
                    style={{
                      borderRadius: "0.625rem",
                      border:
                        " 1px solid var(--components-card-border, rgba(0, 0, 0, 0.17))",
                      background: " var(--gray-white, #FFF)",
                      minHeight: "7rem",
                      cursor: "pointer",
                    }}
                    className="d-flex align-items-start justify-content-start"
                  >
                    <Card.Body className="p-2 w-100">
                      <Card.Title className="carousel-sub-card-title">
                        {doctorLoc}
                      </Card.Title>
                      <Card.Text className="carousel-sub-card-description">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <div>
                            <div>
                              <FontAwesomeIcon
                                icon={faCalendar}
                                style={{
                                  marginRight: "0.5rem",
                                  fontSize: "1rem",
                                }}
                              />
                              {appointment.split(" ")[0]}
                            </div>
                            <div>
                              <FontAwesomeIcon
                                icon={faClock}
                                style={{
                                  marginRight: "0.5rem",
                                  fontSize: "1rem",
                                }}
                              />
                              {appointment.split(" ")[1]}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-center">
                          <Button
                            className="btn-primary mt-4 w-50"
                            onClick={() => handleBookClick(appointment)}
                          >
                            Book
                          </Button>
                        </div>
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  {/* </a> */}
                </SwiperSlide>
              ))}
          </Swiper>
        </Container>
      )}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Book Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bookingStatus === "success" ? (
            <p>You have successfully booked your Appointment.</p>
          ) : (
            <div>
              {/* Display error message */}
              <p>
                Date & Time:{" "}
                <span style={{ fontWeight: "bold" }}>
                  {selectedAppointment ? selectedAppointment : ""}
                </span>
              </p>
              <Form>
                <Form.Group controlId="bookingName">
                  <Form.Label>Booking Name</Form.Label>
                  <Form.Control
                    as="select"
                    value={selectedFamilyMemberId}
                    onChange={handleFamilyMemberChange}
                    defaultValue="myself" // Set "Myself" as the default value
                  >
                    <option value="myself" key="myself">
                      Myself
                    </option>{" "}
                    {familyMembers.map((member) => (
                      <option key={member[0]} value={member[0]}>
                        {member[1]}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="bookingDes">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="input"
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief appointment description"
                  ></Form.Control>
                </Form.Group>
                <Form.Group>
                  <Form.Label>Payment Method</Form.Label>
                  <Form.Check
                    type="radio"
                    label="Wallet"
                    name="paymentMethod"
                    value="wallet"
                    checked={paymentMethod === "wallet"}
                    onChange={handlePaymentMethodChange}
                  />
                  <Form.Check
                    type="radio"
                    label="Credit Card"
                    name="paymentMethod"
                    value="creditCard"
                    onChange={handlePaymentMethodChange}
                  />
                </Form.Group>
                {error1 && <div className="error">{error1}</div>}
              </Form>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {bookingStatus === "success" ? (
            <Button variant="success" onClick={handleClose}>
              Close
            </Button>
          ) : (
            <div className="d-flex justify-content-between align-items-center w-100">
              <div>
                <p>
                  Total Amount:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    ${doctorRate ? doctorRate : ""}
                  </span>
                </p>
              </div>
              <div className="d-flex">
                <Button
                  variant="success"
                  style={{ marginRight: "0.5rem" }}
                  onClick={handleBookAppointment}
                >
                  Book
                </Button>
                <Button variant="danger" onClick={handleClose}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Modal.Footer>
      </Modal>
      {/* <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Book Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bookingStatus === "success" ? (
            <p>You have successfully booked your appointment.</p>
          ) : (
            <div>
              <p>Appointment Details:</p>
     
              <p>
                Date & Time: {selectedAppointment ? selectedAppointment : ""}
              </p>
              <Form>
                <Form.Group controlId="bookingName">
                  <Form.Label>Booking Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter booking name"
                    value={bookingName}
                    onChange={handleBookingNameChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Payment Method</Form.Label>
                  <Form.Check
                    type="radio"
                    label="Wallet"
                    name="paymentMethod"
                    value="wallet"
                    checked={paymentMethod === "wallet"}
                    onChange={handlePaymentMethodChange}
                  />
                  <Form.Check
                    type="radio"
                    label="Credit Card"
                    name="paymentMethod"
                    value="creditCard"
                    checked={paymentMethod === "creditCard"}
                    onChange={handlePaymentMethodChange}
                  />
                </Form.Group>
                {paymentMethod === "creditCard" && (
                  <div>
                    <Form.Group controlId="creditCardNumber">
                      <Form.Label>Credit Card Number</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter credit card number"
                        name="cardNumber"
                        value={creditCard.cardNumber}
                        onChange={handleCreditCardChange}
                      />
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Form.Label column sm={4}>
                        Expiration Date
                      </Form.Label>
                      <Col sm={8}>
                        <Form.Control
                          type="text"
                          placeholder="MM/YYYY"
                          name="expirationDate"
                          value={creditCard.expirationDate}
                          onChange={handleCreditCardChange}
                        />
                      </Col>
                    </Form.Group>
                    <Form.Group controlId="cvv">
                      <Form.Label>CVV</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter CVV"
                        name="cvv"
                        value={creditCard.cvv}
                        onChange={handleCreditCardChange}
                      />
                    </Form.Group>
                  </div>
                )}
              </Form>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {bookingStatus === "success" ? (
            <Button variant="success" onClick={handleClose}>
              Close
            </Button>
          ) : (
            <div>
              <Button variant="success" onClick={handleBookAppointment}>
                Book
              </Button>
              <Button variant="danger" onClick={handleClose}>
                Cancel
              </Button>
            </div>
          )}
        </Modal.Footer>
      </Modal> */}
    </>
  );
};

export default DoctorAppointments;
