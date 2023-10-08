import React, { useEffect, useState } from "react";
import { Card, Col, Row, Image, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setDoctorData } from "../../state/doctorIdReducer";
import defaultPfp from "../../Assets/Patient/DefaultPfp.png";

function ShowDoctors({ nameQuery, specQuery }) {
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error1, setError] = useState(null);

  const handleCard = (doctor) => {
    dispatch(
      setDoctorData({
        username: doctor.username,
        name: doctor.name,
        email: doctor.email,
        dateOfBirth: doctor.dateOfBirth,
        hourlyRate: doctor.hourlyRate,
        affiliation: doctor.affiliation,
        educationalBackground: doctor.educationalBackground,
        speciality: doctor.speciality,
        photoLink: doctor.photoLink,
      })
    );
    navigate("/patient");
  };

  useEffect(() => {
    fetchData();
  }, {});

  const fetchData = async () => {
    try {
      const response = await axios.get("/viewAllDoctors");
      if (response.status === 200) {
        console.log("RESPONSE:", response.data);
        setResponseData(response.data.doctors[0]);
      } else {
        console.log("Server error");
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No doctors found.");
      } else if (error.response && error.response.status === 500) {
        setError("Server Error");
      } else {
        setError("An error occurred. Please try again later.");
      }
      setLoading(false);
    }
  };

  const NeededData = responseData;
  const filteredDoctors = NeededData.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(nameQuery.toLowerCase()) &&
      doctor.speciality.toLowerCase().includes(specQuery.toLowerCase())
  );

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
      {!loading &&
        filteredDoctors.map((doctor) => (
          <a
            onClick={() => handleCard(doctor)}
            key={doctor._id}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Card
              style={{
                cursor: "pointer",
                marginBottom: "1rem",
                border: "1px solid #ccc",
                borderRadius: "5px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Row>
                <Col lg={4}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Image
                      src={doctor.photoLink || defaultPfp}
                      alt={defaultPfp}
                      fluid
                    />
                  </div>
                </Col>
                <Col lg={8}>
                  <Card.Body>
                    <Card.Title
                      style={{
                        color: "#05afb9", // Doctor's name color
                        fontSize: "2rem",
                        fontWeight: "600",
                        marginBottom: "1rem", // Doctor's name font size
                      }}
                    >
                      {doctor.name}
                    </Card.Title>
                    <Card.Text>
                      <div
                        style={{
                          fontSize: "1.2rem", // Speciality font size
                          color: "#333",
                          marginBottom: "4rem", // Speciality color
                        }}
                      >
                        {doctor.speciality}
                      </div>
                      <div
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "600", // Hourly rate font size
                          color: "#555",
                          marginRight: "1rem", // Hourly rate color
                        }}
                        className="d-flex align-items-center justify-content-end"
                      >
                        ${doctor.hourlyRate} / Session
                      </div>
                    </Card.Text>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </a>
        ))}
    </div>
  );
}

export default ShowDoctors;
