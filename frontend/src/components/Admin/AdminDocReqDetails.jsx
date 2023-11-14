import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faX } from "@fortawesome/free-solid-svg-icons";
import contract from "../../Assets/EmploymentContract.pdf";
import axios from "axios";

export default function AdminDocReqDetails({
  docEmail,
  docRate,
  docId,
  docEducation,
  docAffiliation,
  docBirthDate,
  fetchData,
  docUsername,
  docDocuments,
  loading,
  clearExpanded,
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
        clearExpanded();
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
        clearExpanded();
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
  const viewMedicalRecord = async (file) => {
    try {
      const response = await axios.post(
        "/viewPtlDocDocumentsbyAdmins",
        {
          id: docId,
          filename: file,
        },
        {
          responseType: "text", // Set the response type to 'text'
        }
      );

      if (response.status === 200) {
        const byteString = response.data;
        const byteNumbers = byteString.split(",").map(Number);
        const uint8Array = new Uint8Array(byteNumbers);

        const blob = new Blob([uint8Array], {
          type: response.headers["content-type"],
        });

        if (blob.size > 0) {
          const url = window.URL.createObjectURL(blob);

          // Create an anchor element
          const a = document.createElement("a");
          a.href = url;
          a.download = file; // Specify the desired filename

          // Append the anchor to the body
          document.body.appendChild(a);

          // Trigger a click event to initiate download
          a.click();

          // Remove the anchor from the DOM
          document.body.removeChild(a);

          // Release the object URL
          window.URL.revokeObjectURL(url);
        } else {
          console.log("File content is empty");
        }
      } else {
        console.log(`Failed to download file. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching file:", error);
      // Handle the error appropriately
    }
  };

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
        <>
          <Modal show={showRejectModal} onHide={handleClose}>
            <Modal.Body>
              Are you sure you want to reject this doctor's application?
            </Modal.Body>
            <Modal.Footer className="d-flex align-items-center justify-content-center">
              <Button variant="secondary" onClick={rejectDoctor}>
                Yes
              </Button>
              <Button variant="primary" onClick={handleClose}>
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
              <Button variant="primary" onClick={acceptDoctor}>
                Send Contract
              </Button>
              <Button variant="secondary" onClick={handleClose}>
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
                  {docDocuments && (
                    <div>
                      {" "}
                      <div className="d-flex flex-row">
                        <span style={titleStyle}>Medical License: </span>
                        <a
                          style={linkStyle}
                          onClick={() =>
                            viewMedicalRecord(docDocuments[0].filename)
                          }
                        >
                          {docDocuments[0] && docDocuments[0].filename}
                        </a>
                      </div>
                      <div className="d-flex flex-row">
                        <span style={titleStyle}>Medical Degree: </span>
                        <a
                          style={linkStyle}
                          onClick={() =>
                            viewMedicalRecord(docDocuments[1].filename)
                          }
                        >
                          {docDocuments[1] && docDocuments[1].filename}
                        </a>
                      </div>
                      <div className="d-flex flex-row">
                        <span style={titleStyle}>Doctor Id: </span>
                        <a
                          style={linkStyle}
                          onClick={() =>
                            viewMedicalRecord(docDocuments[2].filename)
                          }
                        >
                          {docDocuments[2] && docDocuments[2].filename}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </Card.Text>
            </Card.Body>
          </Card>
        </>
      )}
    </>
  );
}
