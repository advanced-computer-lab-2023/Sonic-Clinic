import React, { useEffect, useState } from "react";
import { Card, Col, Row, Spinner, Modal, Button, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesRight,
  faCalendarAlt,
} from "@fortawesome/free-solid-svg-icons";
import prescriptionImg from "../../Assets/Prescription.jpg";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setPrescriptionData } from "../../state/prescriptionIdReducer";
import axios from "axios";
import {
  faPrescriptionBottle,
  faCheckDouble,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import {
  setNewPres,
  updatePatientWallet,
} from "../../state/loginPatientReducer";

function ShowPrescriptions() {
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [error1, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const id = useSelector((state) => state.patientLogin.userId);
  const filterDate = useSelector((state) => state.filterPrescriptions.date);

  const filterDoctor = useSelector((state) => state.filterPrescriptions.doctor);
  console.log("name", filterDoctor);
  const filterStatus = useSelector((state) => state.filterPrescriptions.status);

  const handleCard = (prescription, index) => {
    dispatch(
      setPrescriptionData({
        _id: prescription._id,
        date: prescription.date,
        description: prescription.description,
        patientID: prescription.patientID,
        doctorID: prescription.doctorID,
        status: prescription.status,
        medicine: prescription.medicine,
        doctorName: prescription.doctorName,
      })
    );
    navigate(`/patient/view-prescriptions/${index}`);
  };

  useEffect(() => {
    fetchData();
  }, {});

  const fetchData = async () => {
    try {
      const response = await axios.post("/viewPrescriptions");
      if (response.status === 200) {
        console.log("RESPONSE:", response.data);
        setResponseData(response.data);
      } else {
        console.log("Server error");
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No Prescriptions Found");
      } else if (error.response && error.response.status === 500) {
        setError("Server Error");
      } else {
        setError("An error occurred. Please try again later.");
      }
      setLoading(false);
    }
  };
  const NeededData = responseData;
  const filteredPrescriptions = NeededData.filter((prescription) => {
    const isoDate = prescription.date; // Assuming appointment.date is in ISO format like "2023-10-05T14:30:00.000Z"
    const dateObj = new Date(isoDate);
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0"); // Adding 1 to the month because it's zero-based
    const dd = String(dateObj.getDate()).padStart(2, "0");

    const formattedDate = `${yyyy}-${mm}-${dd}`;
    const status = prescription.status ? prescription.status.toLowerCase() : "";
    const doctor = prescription.doctorName;
    // Check if the formattedDate includes the filterDate and the status includes filterStatus, both in lowercase
    return (
      formattedDate.includes(filterDate.toLowerCase()) &&
      (filterStatus === ""
        ? status.includes("")
        : status === filterStatus.toLowerCase()) &&
      doctor.toLowerCase().includes(filterDoctor.toLowerCase())
      // doctor.includes(filterDoctor.toLowerCase())
      // status.includes(filterStatus.toLowerCase())
    );
  });

  const getStatusIcon = (status) => {
    const lowerCaseStatus = status.toLowerCase();
    switch (lowerCaseStatus) {
      case "filled":
        return faCheckDouble;
      case "not filled":
        return faPrescriptionBottle;
      default:
        return faPause;
    }
  };

  const getStatusColor = (status) => {
    const lowerCaseStatus = status.toLowerCase();
    switch (lowerCaseStatus) {
      case "filled":
        return "#adb5bd"; // Grey for Filled
      case "not filled":
        return "#05afb9  "; // Blue for Not
      default:
        return "#05afb9 "; // Default color
    }
  };

  const [selectedViewPrescription, setSelectedViewPrescription] =
    useState(null);
  const [showViewSelectedPrescription, setShowViewSelectedPrescription] =
    useState(false);

  const handleViewMore = (prescription) => {
    setSelectedViewPrescription(prescription);
    console.log("ALOOOOOO", prescription);
    setShowViewSelectedPrescription(true);
  };

  const handleCloseModal = () => {
    setShowViewSelectedPrescription(false);
  };
  const handleShowPay = () => {
    setShowPaymentModal(true);
    setShowViewSelectedPrescription(false);
  };
  const handleClosePay = () => {
    setShowPaymentModal(false);
    setShowViewSelectedPrescription(true);
  };

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("paying");
  const calculateTotalAmount = () => {
    let totalAmount = 0;
    if (selectedViewPrescription) {
      selectedViewPrescription.medicine.forEach((med) => {
        totalAmount += parseFloat(med[1]);
      });
    }
    return totalAmount;
  };
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };
  const handleClosePayModal = () => {
    setShowPaymentModal(false);
    setPaymentStatus("paying");
    setPaymentMethod("wallet");
  };

  const [responseUrl, setResponseUrl] = useState([]);
  const wallet = useSelector((state) => state.patientLogin.wallet);

  const handlePayForPrescription = async () => {
    try {
      let apiUrl;

      if (paymentMethod === "creditCard") {
        apiUrl = "/payPrescriptionStripe";
      } else {
        apiUrl = "/payPrescriptionWallet";
      }

      let response;

      if (paymentMethod === "creditCard") {
        response = await axios.post(`${apiUrl}`, {
          id: selectedViewPrescription._id,
        });
      } else {
        response = await axios.post(`${apiUrl}`, {
          id: selectedViewPrescription._id,
        });
      }

      if (response.status === 200) {
        if (paymentMethod === "creditCard") {
          setResponseUrl(response.data.url);
          if (response.data.url) {
            window.location.href = response.data.url;
            dispatch(
              setNewPres({
                newPres: selectedViewPrescription._id,
              })
            );
          }
        } else {
          fetchData();
          setPaymentStatus("success");
          setError(null);
          const totalAmount = calculateTotalAmount().toFixed(2);
          dispatch(
            updatePatientWallet({
              wallet: wallet - totalAmount,
            })
          );
        }
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError(error.response.data.message);
      } else {
        setError("An error occurred. Please try again later");
      }
    }
  };

  const handleDownloadPrescription = async () => {
    const queryParameters = new URLSearchParams({
      id: selectedViewPrescription._id,
    }).toString();
    const url = `/downloadPrescriptions?${queryParameters}`;
    try {
      const response = await axios.post(url, null, { responseType: "blob" });
      console.log("Response Status:", response.status);

      if (response.status === 200) {
        // Create a Blob from the response data
        const blob = new Blob([response.data], { type: "application/pdf" });

        // Create a Blob URL for the PDF
        const blobUrl = window.URL.createObjectURL(blob);
        console.log("Blob URL:", blobUrl);

        // Create an anchor element to trigger the download
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = "prescription.pdf"; // You can set the desired filename
        document.body.appendChild(a);
        console.log("Anchor Element:", a);

        // Programmatically click the anchor element to trigger the download
        a.click();

        // Remove the anchor element from the DOM
        document.body.removeChild(a);

        // Revoke the Blob URL to free up resources
        window.URL.revokeObjectURL(blobUrl);
        console.log("Blob URL Revoked");
      } else {
        console.log("Server error");
      }
    } catch (error) {
      // Handle errors here
      console.error("Error:", error);

      if (error.response && error.response.status === 409) {
        console.log("Conflict error");
      } else {
        console.log("Other error occurred");
      }
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
      {error1 && <div style={{ color: "red" }}>{error1}</div>}
      {filteredPrescriptions.length === 0 && !loading && (
        <div style={{ textAlign: "center", marginTop: "20px" }} className="msg">
          You don't have any prescriptions.
        </div>
      )}
      {!loading &&
        filteredPrescriptions.map((prescription, index) => {
          // Parse the date string into a Date object
          const prescriptionDate = new Date(prescription.date);

          // Format the date as "dd/mm/yyyy"
          const formattedDate = `${prescriptionDate
            .getDate()
            .toString()
            .padStart(2, "0")}/${(prescriptionDate.getMonth() + 1)
            .toString()
            .padStart(2, "0")}/${prescriptionDate.getFullYear()}`;

          return (
            // <a
            //   onClick={() => handleCard(prescription, index + 1)}
            //   key={prescription.prescriptionId}
            //   className="text-decoration-none"
            // >
            <Card
              style={{
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s",
                marginBottom: "2rem",
                marginRight: "2rem",
                height: "10rem",
              }}
            >
              <Row>
                <Col
                  lg={1}
                  style={{
                    display: "flex",
                    flexDirection: "column", // Vertical arrangement
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: getStatusColor(prescription.status),
                    borderRadius: "10px 0 0 10px",
                    height: "10rem",
                  }}
                >
                  <FontAwesomeIcon
                    icon={getStatusIcon(prescription.status)}
                    style={{
                      fontSize: "1.5em",
                      color: "white",
                    }}
                  />
                </Col>
                <Col lg={4}>
                  <Card.Body>
                    <Card.Title
                      style={{
                        marginTop: "2rem",
                        fontSize: "1.5rem",
                        fontWeight: "bold",
                        color: "#212529",
                      }}
                    >
                      Dr. {prescription.doctorName}
                    </Card.Title>
                    <div
                      style={{
                        marginBottom: "1rem",
                        fontSize: "1.2rem",
                        color: "#099BA0",
                      }}
                    >
                      Prescription {index + 1}
                    </div>
                  </Card.Body>
                </Col>
                <Col lg={4}>
                  <Card.Body className="p-4">
                    <Card.Text
                      style={{
                        fontSize: "1.2rem",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        style={{
                          //        marginLeft: "-1.5rem",
                          marginTop: "3rem",
                          fontSize: "1.2rem",
                          marginRight: "0.5rem",
                        }}
                      />
                      {formattedDate}
                    </Card.Text>
                  </Card.Body>
                </Col>
                <Col
                  lg={3}
                  style={{
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                    paddingBottom: "1rem",
                    marginLeft: "-1rem",
                    height: "10rem", // This ensures the column stretches to the bottom of the card
                  }}
                >
                  <Link
                    style={{
                      fontSize: "1.2rem",
                      color: "#05afb9",
                      textDecoration: "none",
                    }}
                    onClick={() => handleViewMore(prescription)}
                  >
                    View Details
                    <FontAwesomeIcon
                      icon={faAnglesRight}
                      style={{
                        marginLeft: "0.5rem",
                        fontSize: "1.2rem",
                        transition: "transform 0.3s ease-in-out",
                        animation:
                          "arrowAnimation2 1.5s infinite alternate ease-in-out",
                      }}
                    />
                  </Link>
                </Col>
              </Row>
            </Card>

            // </a>
          );
        })}

      <Modal show={showViewSelectedPrescription} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Prescription Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedViewPrescription ? (
            <div>
              <p>
                <strong>Date:</strong>{" "}
                {selectedViewPrescription.date?.split("-").reverse().join("/")}
              </p>
              <p>
                <strong>Status:</strong> {selectedViewPrescription.status}
              </p>
              <div>
                <strong>Medicines:</strong>
                {selectedViewPrescription.medicine.length === 0 ? (
                  <div>No medicines added.</div>
                ) : (
                  <div>
                    {selectedViewPrescription.medicine.map((med, index) => (
                      <Card
                        key={index}
                        className="mb-3"
                        style={{ marginTop: "0.5rem", height: "3.5rem" }}
                      >
                        <Card.Body
                          style={{
                            backgroundColor: "#f0f0f0",
                            height: "3rem",
                          }}
                          className="d-flex justify-content-between align-items-center"
                        >
                          <strong>{med[0]}</strong>
                          <strong>
                            Dosage:
                            <span style={{ fontWeight: "normal" }}>
                              {" "}
                              {med[2]}
                            </span>{" "}
                          </strong>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>Loading prescription details...</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <>
            <div className="d-flex align-items-center justify-content-between w-100">
              <div>
                {" "}
                {selectedViewPrescription &&
                  selectedViewPrescription.status !== "Filled" && (
                    <div className="d-flex align-items-center justify-content-center">
                      <Button
                        // Add the logic to handle payment here
                        onClick={() => handleShowPay()}
                      >
                        Pay for Prescription
                      </Button>
                    </div>
                  )}
              </div>

              <Button onClick={handleDownloadPrescription}>Download PDF</Button>
            </div>
          </>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showPaymentModal}
        onHide={() => setShowPaymentModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Pay for Prescription</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {paymentStatus === "success" ? (
            <p>You have successfully paid for your prescription.</p>
          ) : (
            <div>
              {selectedViewPrescription ? (
                <div>
                  <p>
                    <strong>Date:</strong>{" "}
                    {selectedViewPrescription.date
                      ?.split("-")
                      .reverse()
                      .join("/")}
                  </p>
                  <p>
                    <strong>Status:</strong> {selectedViewPrescription.status}
                  </p>
                  <div>
                    <strong>Medicines:</strong>
                    {selectedViewPrescription.medicine.length === 0 ? (
                      <div>No medicines added.</div>
                    ) : (
                      <div>
                        {selectedViewPrescription.medicine.map((med, index) => (
                          <Card
                            key={index}
                            className="mb-3"
                            style={{ marginTop: "0.5rem", height: "3.5rem" }}
                          >
                            <Card.Body
                              style={{
                                backgroundColor: "#f0f0f0",
                                height: "3rem",
                              }}
                              className="d-flex justify-content-between align-items-center"
                            >
                              <strong>{med[0]}</strong>
                              <strong>
                                Price:
                                <span style={{ fontWeight: "normal" }}>
                                  {" "}
                                  ${parseFloat(med[1]).toFixed(2)}
                                </span>{" "}
                              </strong>
                            </Card.Body>
                          </Card>
                        ))}
                        {/* Display the total amount */}
                      </div>
                    )}
                  </div>
                  {/* Payment Method Radio Buttons */}
                  <Form>
                    <Form.Group controlId="paymentMethod">
                      <Form.Label>
                        <strong>Select Payment Method:</strong>
                      </Form.Label>
                      <div>
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
                      </div>
                    </Form.Group>
                  </Form>
                </div>
              ) : (
                <div>Loading prescription details...</div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {paymentStatus === "success" ? (
            <Button variant="primary" onClick={() => handleClosePayModal()}>
              Close
            </Button>
          ) : (
            <div className="d-flex justify-content-between align-items-center w-100">
              <div>
                <p>
                  Total Amount:{" "}
                  <span style={{ fontWeight: "bold" }}>
                    ${calculateTotalAmount().toFixed(2)}
                  </span>
                </p>
              </div>
              <div className="d-flex">
                <Button
                  variant="primary"
                  style={{ marginRight: "0.5rem" }}
                  onClick={handlePayForPrescription}
                >
                  Pay
                </Button>
                <Button variant="secondary" onClick={() => handleClosePay()}>
                  Back
                </Button>
              </div>
            </div>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ShowPrescriptions;
