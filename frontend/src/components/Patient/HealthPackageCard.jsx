import React, { useEffect, useState } from "react";
import { Button, Carousel, Col, Form, Modal, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function HealthPackageCard() {
  const constantTexts = [
    "Annual Fee",
    "Doctor Discount",
    "Medicine Discount",
    "Family Discount",
  ];
  const descriptions = [
    "Amount payed per year",
    "Discount on any doctor's session price",
    "Discount on any medicine ordered from pharmacy platform",
    "Discount on the subscribtion of any family member in any package",
  ];
  const [showAddPackage, setShowAddPackage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [error1, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [bookingStatus, setBookingStatus] = useState("booking");

  const [bookingName, setBookingName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [creditCard, setCreditCard] = useState({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });
  const [selectedPackage, setSelectedPackage] = useState(null);

  const handleClose = () => {
    setShowModal(false); // Close the modal first

    setTimeout(() => {
      setBookingStatus("booking"); // Reset the status after a short delay
    }, 200); // Adjust the delay as needed
    setBookingName("");
    setPaymentMethod("wallet");
    setCreditCard({
      cardNumber: "",
      expirationDate: "",
      cvv: "",
    });
    setSelectedPackage(null);
  };

  const handleBookClick = (appointment) => {
    setSelectedPackage(appointment);
    setShowModal(true);
  };

  const handleBookingNameChange = (e) => {
    setBookingName(e.target.value);
  };

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);

    // Clear credit card details when switching payment method
    setCreditCard({
      cardNumber: "",
      expirationDate: "",
      cvv: "",
    });
  };

  const handleCreditCardChange = (e) => {
    const { name, value } = e.target;
    setCreditCard({
      ...creditCard,
      [name]: value,
    });
  };

  // const handleBookAppointment = () => {
  //   // Simulate a booking request (replace with actual API call)
  //   setBookingStatus("booking"); // Show "Booking in progress" message
  //   setTimeout(() => {
  //     // Simulate a successful booking
  //     setBookingStatus("success"); // Show "Booking success" message
  //   }, 500); // Simulate a 2-second delay (replace with actual API call)

  //   // In a real application, you would perform the booking logic and handle the response.

  //   // Close the modal
  //   // handleClose();
  // };
  const handleBookAppointment = async () => {
    try {
      const response = await axios.post("/subscribeHealthPackage?type=Silver");
      if (response.status === 200) {
        setBookingStatus("booking"); // Show "Booking in progress" message
        setTimeout(() => {
          // Simulate a successful booking
          setBookingStatus("success"); // Show "Booking success" message
        }, 500);
        //doctor accepted feedback
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("Doctor not found");
      } else {
        setError(
          "An error occurred while accepting doctor. Please try again later"
        );
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/viewPackagesAdmin");
      if (response.status === 200) {
        setResponseData(response.data);
      } else {
        console.log("Server error");
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No packages found.");
      } else if (error.response && error.response.status === 500) {
        setError("Server Error");
      }
      setLoading(false);
    }
  };
  const packages = responseData;

  const toggleAddPackage = () => {
    setShowAddPackage(!showAddPackage);
  };

  const iconStyle = {
    opacity: 1,
    color: "white",
    fontSize: "20px",
    cursor: "pointer",
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center flex-row"
      style={{ width: "100%", marginTop: "3rem" }}
    >
      <Carousel
        className="d-flex align-items-center carousel-dark"
        style={{ height: "550px", width: "60rem", marginBottom: "5px" }}
      >
        {packages.map((packagee, index) => {
          const dynamicTextsForPackage = [
            packagee.price,
            packagee.sessionDiscount + " %",
            packagee.medicineDiscount + " %",
            packagee.packageDiscountFM + " %",
          ];

          return (
            <Carousel.Item
              key={index}
              className="align-items-center"
              style={{ marginLeft: "13%" }}
            >
              <Card
                style={{
                  width: "45rem",
                  boxShadow: "0px 4px 4px 0px #adb5bd",
                  borderRadius: "3px",
                  marginBottom: "60px",
                }}
              >
                <Card.Header
                  className="d-flex flex-column"
                  style={{ height: "100px" }}
                >
                  <Card.Title
                    className="d-flex justify-content-center"
                    style={{
                      color: "#ff6b35",
                      fontWeight: "bold",
                      fontSize: "25px",
                      textAlign: "center",
                      marginTop: "20px",
                    }}
                  >
                    {packagee.type}
                  </Card.Title>
                </Card.Header>
                <ListGroup variant="flush">
                  {constantTexts.map((constant, index) => (
                    <div key={index}>
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span style={{ fontWeight: "bold", color: "#ADB5BD " }}>
                          {constant}
                        </span>
                        <span
                          style={{
                            borderLeft: "1px solid #ccc",
                            paddingLeft: "10px",
                            width: "100px",
                          }}
                        >
                          {dynamicTextsForPackage[index]}
                        </span>
                      </ListGroup.Item>
                      <div
                        style={{
                          fontSize: "13px",
                          margin: "5px",
                          marginLeft: "15px",
                          color: "#212529  ",
                        }}
                      >
                        {descriptions[index]}
                      </div>
                    </div>
                  ))}
                </ListGroup>
                <Card.Body className="d-flex align-items-center justify-content-center">
                  <Button
                    style={{ backgroundColor: "#ff6b35" }}
                    onClick={() => handleBookClick(packagee)}
                  >
                    Buy Package
                    <FontAwesomeIcon
                      icon={faShoppingBasket}
                      style={{
                        opacity: 1,
                        color: "#f0f0f0 ",
                        fontSize: "20px",
                        cursor: "pointer",
                        marginLeft: "5px",
                      }}
                    />
                  </Button>
                </Card.Body>
              </Card>
            </Carousel.Item>
          );
        })}
      </Carousel>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Book Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bookingStatus === "success" ? (
            <p>You have successfully booked your package.</p>
          ) : (
            <div>
              <p>Package Name: {selectedPackage ? selectedPackage.type : ""}</p>
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
      </Modal>
    </div>
  );
}
