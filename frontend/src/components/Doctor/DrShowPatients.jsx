import React, { useState } from "react";
import {
  Card,
  Col,
  Row,
  Form,
  Button,
  ListGroup,
  Spinner,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faSearch,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function DrShowPatients({
  patients,
  setPatients,
  responseData,
  upcomingApp,
  loading,
  fetchData,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedPatient, setExpandedPatient] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [followUpModal, setFollowUpModal] = useState(false);
  const [followUpDateTime, setFollowUpDateTime] = useState(null);
  const [existingFiles, setExistingFiles] = useState();

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    const formattedFiles = newFiles.map((file) => ({
      filename: file.name,
      mimetype: file.type,
      buffer: {
        type: "Buffer",
        data: Array.from(new Uint8Array(file)),
      },
    }));
    setUploadedFiles([...uploadedFiles, ...formattedFiles]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
  };

  // Function to format the date of birth
  function formatDateOfBirth(isoDate) {
    if (!isoDate) {
      return "N/A"; // Handle cases where dateOfBirth is missing
    }

    const dateObj = new Date(isoDate);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1; // Months are zero-based
    const year = dateObj.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const handleSearch = () => {
    // Filter patients based on the search term
    setPatients(
      responseData.filter((patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const toggleExpand = (index, id) => {
    if (expandedPatient === index) {
      setExpandedPatient(null);
    } else {
      setExpandedPatient(index);
      setSelectedPatient(id);
      if (patients && patients[index]) {
        setExistingFiles(patients[index].medicalHistory);
      }
    }
  };

  const viewMedicalRecord = async (file) => {
    try {
      const response = await axios.post(
        "/viewPatientMedicalHistoryForDoctors",
        {
          id: selectedPatient,
          filename: file,
        },
        {
          responseType: "blob", // Set the response type to 'blob'
        }
      );

      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });

        // Check if the blob is not empty
        if (blob.size > 0) {
          const url = window.URL.createObjectURL(blob);

          // Open the file in a new tab
          window.open(url, "_blank");
        } else {
          console.log("File content is empty");
        }
      }
    } catch (error) {
      console.log("not cool", error);
    }
  };

  const addFiles = async (id) => {
    try {
      console.log(id);
      const formData = new FormData();

      uploadedFiles.forEach((file, index) => {
        const blob = new Blob([file.buffer.data], { type: file.mimetype });
        formData.append("files", blob, file.filename);
      });

      const response = await axios.post(
        `/uploadFilesbyDoctors?id=${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        fetchData();

        setExistingFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
        setUploadedFiles([]);
      }
    } catch (error) {
      console.log("Oops, not added", error);
    }
  };

  const scheduleFollowUp = async (patientID) => {
    const [datePart, timePart] = followUpDateTime.split("T");
    try {
      const response = await axios.post("/addAppointmentByPatientID", {
        date: datePart,
        description: patientID,
        status: "upcoming",
        patientID: patientID,
        time: timePart,
      });
      if (response.status === 201) {
        setFollowUpModal(false);
      }
    } catch (error) {
      console.log();
    }
  };

  return (
    <div>
      <div
        className="d-flex justify-content-center align-items-center flex-row"
        style={{
          width: "95%",
          marginBottom: "1rem",
          marginLeft: "1rem",
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
          style={{ width: "10rem", height: "2.5rem", marginLeft: "1rem" }}
          onClick={handleSearch}
        >
          Search
          <FontAwesomeIcon
            icon={faSearch}
            style={{
              opacity: 1,
              color: "white",
              fontSize: "15px",
              marginLeft: "10px",
            }}
          />
        </Button>
      </div>
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )}
      {!loading &&
        patients.map((patient, index) => (
          <Card className="mb-4 mx-3 bg-white" key={patient.username}>
            <Card.Header
              className="d-flex align-items-center justify-content-between"
              onClick={() => toggleExpand(index, patient._id)}
              style={{ cursor: "pointer" }}
            >
              <span>{patient.name}</span>
              <FontAwesomeIcon
                icon={expandedPatient === index ? faChevronUp : faChevronDown}
              />
            </Card.Header>
            {expandedPatient === index && (
              <Card.Body>
                <Row>
                  <Col lg={8}>
                    <Card.Text>
                      <Button
                        style={{ marginBottom: "1rem" }}
                        onClick={() =>
                          followUpModal
                            ? scheduleFollowUp(patient._id)
                            : setFollowUpModal(true)
                        }
                      >
                        {followUpModal ? "Save" : "Schedule Follow-up"}
                      </Button>
                      {followUpModal && (
                        <div>
                          <Form.Group style={{ marginBottom: "1rem" }}>
                            <Form.Control
                              type="datetime-local"
                              value={followUpDateTime}
                              onChange={(e) =>
                                setFollowUpDateTime(e.target.value)
                              }
                            />
                          </Form.Group>
                        </div>
                      )}

                      {upcomingApp && <div>Has an upcoming appointment</div>}
                      <div className="patient-info">
                        <p>
                          Date of birth:{" "}
                          {formatDateOfBirth(patient.dateOfBirth)}
                        </p>
                        <p>Gender: {patient.gender}</p>
                        <p style={{ fontWeight: "bold" }}>Medical History:</p>
                        {existingFiles ? (
                          <ListGroup>
                            {existingFiles.map((file, index) => (
                              <ListGroup.Item key={index}>
                                <a
                                  onClick={() =>
                                    viewMedicalRecord(file.filename)
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: "#212529",
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                  }}
                                >
                                  {file.filename}
                                </a>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        ) : (
                          <div>No previous history found</div>
                        )}

                        <label
                          style={{
                            marginTop: "1rem",
                            cursor: "pointer",
                            color: "#099BA0",
                            textDecoration: "underline",
                          }}
                          onClick={() => setUploadVisible(!uploadVisible)}
                          htmlFor="weee"
                        >
                          Upload Health Records
                        </label>
                        <div>
                          <input
                            type="file"
                            accept=".pdf, .jpeg, .jpg, .png"
                            multiple
                            onChange={handleFileUpload}
                            style={{ display: "none" }}
                            id="weee"
                          />

                          {uploadedFiles.length > 0 && (
                            <div>
                              <ul style={{ marginTop: "1rem" }}>
                                {uploadedFiles.map((file, index) => (
                                  <li key={index}>
                                    {file.filename}
                                    <FontAwesomeIcon
                                      icon={faX}
                                      style={{
                                        opacity: 1,
                                        color: "red",
                                        fontSize: "15px",
                                        marginLeft: "2rem",
                                        cursor: "pointer",
                                      }}
                                      onClick={() => handleRemoveFile(index)}
                                    />
                                  </li>
                                ))}
                              </ul>
                              <div
                                style={{
                                  marginLeft: "6rem",
                                  cursor: "pointer",
                                  color: "#05afb9 ",
                                  fontWeight: "bold",
                                }}
                                onClick={() => addFiles(patient._id)}
                              >
                                Add
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card.Text>
                  </Col>
                </Row>
              </Card.Body>
            )}
          </Card>
        ))}
    </div>
  );
}

export default DrShowPatients;
