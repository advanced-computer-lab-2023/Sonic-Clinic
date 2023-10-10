import React, { useState, useEffect } from "react";
import { Card, Col, Row, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCalendar,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faChevronDown,
  faChevronUp,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";

function DrShowPatients({ patients, setPatients, responseData }) {
  const [searchTerm, setSearchTerm] = useState("");

  // const [responseData, setResponseData] = useState([]);
  // const [patients, setPatients] = useState([]);
  // const [error, setError] = useState(null);
  // const _id = useSelector((state) => state.doctorLogin.userId);
  const [expandedPatient, setExpandedPatient] = useState(null);

  // useEffect(() => {
  //   fetchData();
  // }, []);

  // const fetchData = async () => {
  //   const config = {
  //     headers: {
  //       _id: _id,
  //     },
  //   };
  //   try {
  //     const response = await axios.post("/viewPatients", { _id: _id }, config);
  //     if (response.status === 200) {
  //       setResponseData(response.data.patients);
  //       setPatients(responseData);
  //       console.log("ba set aho", patients);
  //     } else {
  //       console.log("Server error");
  //     }
  //   } catch (error) {
  //     if (error.response && error.response.status === 404) {
  //       setError("No data found.");
  //     } else if (error.response && error.response.status === 500) {
  //       setError("Server Error");
  //     }
  //   }
  // };

  const handleSearch = () => {
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
          S e a r c h
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
      {/* SHOULD BE PATIENTS BAS BETALA3 RUNTIME ERROR!!!! */}
      {responseData.map((patient, index) => (
        <Card className="mb-4 mx-3 bg-light" key={patient}>
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
                      <h5>Patient Information</h5>
                      <p>Date of birth: {patient.dateOfBirth}</p>
                      <p>Gender: {patient.gender}</p>
                      <p>Medical History:</p>
                      {patient.prescriptions != null ? (
                        patient.prescriptions.map((prescription, index) => (
                          <div key={index}>
                            <p>
                              Prescription {index + 1}: {prescription.date}
                            </p>
                            <ul>
                              {prescription.medicine.map(
                                (medicine, medIndex) => (
                                  <li key={medIndex}>{medicine.name}</li>
                                )
                              )}
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
