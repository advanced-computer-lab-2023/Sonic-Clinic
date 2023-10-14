import React, { useState } from "react";
import { Card, Col, Row, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faChevronDown,
  faChevronUp,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

function DrShowPatients({ patients, setPatients, responseData }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedPatient, setExpandedPatient] = useState(null);

  // Function to format the date of birth
  function formatDateOfBirth(isoDate) {
    if (!isoDate) {
      return "N/A"; // Handle cases where dateOfBirth is missing
    }

    const dateObj = new Date(isoDate);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1; // Months are zero-based
    const year = dateObj.getFullYear();

    // Format the date as "dd/mm/yyyy"
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

  const toggleExpand = (index) => {
    if (expandedPatient === index) {
      setExpandedPatient(null);
    } else {
      setExpandedPatient(index);
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
      {patients.map((patient, index) => (
        <Card className="mb-4 mx-3 bg-light" key={patient.username}>
          <Card.Header
            className="d-flex align-items-center justify-content-between"
            onClick={() => toggleExpand(index)}
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
                    <div className="patient-info">
                      <h5 style={{ fontWeight: "bold" }}>
                        Patient Information
                      </h5>
                      <p>
                        Date of birth: {formatDateOfBirth(patient.dateOfBirth)}
                      </p>
                      <p>Gender: {patient.gender}</p>
                      <p style={{ fontWeight: "bold" }}>Medical History:</p>
                      {patient.prescriptions &&
                      patient.prescriptions.length > 0 ? (
                        patient.prescriptions.map((prescription, pIndex) => (
                          <div key={pIndex}>
                            <p>
                              Prescription {pIndex + 1} by Dr{" "}
                              {prescription.doctorName}
                            </p>
                            <ul>
                              {prescription.medicine.map((medicine, mIndex) => (
                                <li key={mIndex}>{medicine}</li>
                              ))}
                            </ul>
                          </div>
                        ))
                      ) : (
                        <div>No previous history found</div>
                      )}
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
