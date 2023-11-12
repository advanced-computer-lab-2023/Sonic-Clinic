import React, { useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import contract from "../../Assets/EmploymentContract.pdf";
import axios from "axios";

export default function AdminDocReqDetails({
  docEmail,
  docRate,
  docEducation,
  docAffiliation,
  docBirthDate,
  fetchData,
  docUsername,
  docMedicalLicense,
  docMedicalDegree,
  docDocID,
}) {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [error, setError] = useState(null);

  const rowStyle = {
    display: "flex",
    flexDirection: "row",
    marginBottom: "0.8rem",
  };

  const linkStyle = {
    display: "flex",
    flexDirection: "row",
    marginBottom: "0.8rem",
    cursor: "pointer",
    textDecoration: "underline",
  };

  const titleStyle = {
    color: "#212529",
    marginRight: "0.5rem",
    fontWeight: "bold",
    fontSize: "1rem",
  };

  const handleClose = () => {
    setShowRejectModal(false);
    setShowAcceptModal(false);
  };

  const acceptDoctor = async () => {
    try {
      const response = await axios.post("/acceptPotientialDoc", {
        username: docUsername,
      });
      if (response.status === 201) {
        handleClose();
        fetchData();
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

  const rejectDoctor = async () => {
    try {
      const response = await axios.delete(
        `/rejectDoctor?username=${docUsername}`
      );

      if (response.status === 200) {
        handleClose();
        fetchData();
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

  const viewFile = async (file) => {
    console.log("view");
  };

  return (
    <>
      <Modal show={showRejectModal} onHide={handleClose}>
        <Modal.Body>
          Are you sure you want to reject this doctor's application?
        </Modal.Body>
        <Modal.Footer className="d-flex align-items-center justify-content-center">
          <Button variant="danger" onClick={rejectDoctor}>
            Yes
          </Button>
          <Button variant="success" onClick={handleClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showAcceptModal} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>Review Employment Contract</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <object
            data={contract}
            type="application/pdf"
            width="100%"
            height="500"
          >
            PDF Viewer is not supported in this browser.
          </object>
        </Modal.Body>
        <Modal.Footer className="d-flex align-items-center justify-content-center">
          <Button variant="success" onClick={acceptDoctor}>
            Send Contract
          </Button>
          <Button variant="danger" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <Card style={{ width: "100%", border: "transparent" }}>
        <Card.Body>
          <div className="d-flex justify-content-end">
            <Button
              style={{
                backgroundColor: "#f0f0f0",
                marginLeft: "20px",
                borderColor: "#f0f0f0",
                width: "40px",
                height: "40px",
              }}
              onClick={() => setShowAcceptModal(true)}
            >
              <FontAwesomeIcon
                icon={faCheck}
                style={{
                  color: "#f0f0f0",
                  fontWeight: "bold",
                  fontSize: "20px",
                }}
              />
            </Button>
            <Button
              style={{
                backgroundColor: "#f0f0f0",
                marginLeft: "20px",
                borderColor: "#f0f0f0",
                width: "40px",
                height: "40px",
              }}
              onClick={() => setShowRejectModal(true)}
            >
              <FontAwesomeIcon
                icon={faX}
                style={{
                  color: "#f0f0f0",
                  fontWeight: "bold",
                  fontSize: "20px",
                }}
              />
            </Button>
          </div>
          <Card.Text>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flexWrap: "wrap",
                fontSize: "15px",
              }}
            >
              <div style={rowStyle}>
                <span style={titleStyle}>Email:</span>
                {docEmail}
              </div>
              <div style={rowStyle}>
                <span style={titleStyle}>Date of Birth:</span>
                {docBirthDate}
              </div>
              <div style={rowStyle}>
                <span style={titleStyle}>Hourly Rate:</span>
                {docRate} LE/hr
              </div>
              <div style={rowStyle}>
                <span style={titleStyle}>Affiliation:</span>
                {docAffiliation}
              </div>
              <div style={rowStyle}>
                <span style={titleStyle}>Educational Background:</span>
                {docEducation}
              </div>
              <div className="d-flex flex-row">
                <span style={titleStyle}>Doctor ID: </span>
                <a style={linkStyle} onClick={() => viewFile({ docDocID })}>
                  {docDocID}
                </a>
              </div>
              <div className="d-flex flex-row">
                <span style={titleStyle}>Medical Degree: </span>
                <a
                  style={linkStyle}
                  onClick={() => viewFile({ docMedicalDegree })}
                >
                  {docMedicalDegree}
                </a>
              </div>
              <div className="d-flex flex-row">
                <span style={titleStyle}>Medical License: </span>
                <a
                  style={linkStyle}
                  onClick={() => viewFile({ docMedicalLicense })}
                >
                  {docMedicalLicense}
                </a>
              </div>
            </div>
          </Card.Text>
        </Card.Body>
      </Card>
    </>
  );
}
