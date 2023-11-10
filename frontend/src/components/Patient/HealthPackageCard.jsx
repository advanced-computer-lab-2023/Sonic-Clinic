import React, { useEffect, useState } from "react";
import { Button, Carousel, Col, Form, Modal, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function HealthPackageCard() {
  const navigate = useNavigate();
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
  const [responseUrl, setResponseUrl] = useState([]);
  const [error1, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [bookingStatus, setBookingStatus] = useState("booking");

  const [selectedFamilyMember, setSelectedFamilyMember] = useState("");
  const [selectedFamilyMemberId, setSelectedFamilyMemberId] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [creditCard, setCreditCard] = useState({
    cardNumber: "",
    expirationDate: "",
    cvv: "",
  });
  const [selectedPackage, setSelectedPackage] = useState(null);

  const handleClose = () => {
    setShowModal(false); // Close the modal first
    setError(null);
    setTimeout(() => {
      setBookingStatus("booking"); // Reset the status after a short delay
    }, 200); // Adjust the delay as needed
    setSelectedFamilyMember("");
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

  const handleFamilyMemberChange = (e) => {
    const selectedId = e.target.value;
    setSelectedFamilyMemberId(selectedId === "myself" ? "" : selectedId);
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

  const handleBookAppointment = async () => {
    try {
      let apiUrl;

      if (paymentMethod === "creditCard") {
        apiUrl = "/subscribeHealthPackage";
      } else {
        apiUrl = "/subscribeHealthPackageWallet";
      }

      let response;

      if (paymentMethod === "creditCard") {
        response = await axios.post(`${apiUrl}?type=${selectedPackage.type}`);
      } else {
        response = await axios.post(`${apiUrl}`, {
          type: selectedPackage.type,
          _id: selectedFamilyMemberId,
        });
      }

      if (response.status === 200) {
        setBookingStatus("booking");

        if (paymentMethod === "creditCard") {
          setResponseUrl(response.data.url);
          if (response.data.url) {
            window.location.href = response.data.url;
          }
        } else {
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        if (paymentMethod === "creditCard") {
        } else {
          setError(error.response.data.message);
        }
      } else {
        setError(
          "An error occurred while accepting the doctor. Please try again later"
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
  const familyMembers = useSelector((state) => state.patientLogin.family);

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
          <Modal.Title>Buy Health Package</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bookingStatus === "success" ? (
            <p>You have successfully booked your package.</p>
          ) : (
            <div>
              {/* Display error message */}
              <p>
                Package Name:{" "}
                <span style={{ fontWeight: "bold" }}>
                  {selectedPackage ? selectedPackage.type : ""}
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
                    // checked={paymentMethod === "creditCard"}
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
                    ${selectedPackage ? selectedPackage.price : ""}
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
    </div>
  );
}
