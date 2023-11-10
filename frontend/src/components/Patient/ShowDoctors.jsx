import React, { useEffect, useState } from "react";
import { Card, Col, Row, Image, Spinner } from "react-bootstrap";
import defaultPfp from "../../Assets/Patient/DefaultPfp.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setDoctorData } from "../../state/doctorIdReducer";
import { setSearchData } from "../../state/Patient/SearchDoctor";
import { setFilterArray } from "../../state/Patient/filteredDoctors";
import axios from "axios";

function ShowDoctors({ patients, responseData, setPatients, loading, error1 }) {
  // const [loading, setLoading] = useState(true);
  // const [responseData, setResponseData] = useState([]);
  // const [error1, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const _id = useSelector((state) => state.patientLogin.userId);
  // const searchDataName = useSelector((state) => state.searchDoctor.name);
  // const searchDataSpec = useSelector((state) => state.searchDoctor.specialty);
  // const searchDataDate = useSelector((state) => state.searchDoctor.date);
  // const searchDataTime = useSelector((state) => state.searchDoctor.time);

  const handleCard = (doctor, index) => {
    dispatch(
      setDoctorData({
        username: doctor.username,
        name: doctor.name,
        email: doctor.email,
        dateOfBirth: doctor.dateOfBirth,
        hourlyRate: doctor.sessionPrice.toFixed(2),
        affiliation: doctor.affiliation,
        educationalBackground: doctor.educationalBackground,
        speciality: doctor.specialty,
        photoLink: doctor.photoLink,
        id: doctor.id,
      })
    );
    navigate(`/patient/view-doctors/${index}`);
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
      {!loading &&
        patients?.map((doctor, index) => (
          <a
            onClick={() => handleCard(doctor, index + 1)}
            key={index}
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
                        color: "#05afb9",
                        fontSize: "2rem",
                        fontWeight: "600",
                        marginBottom: "1rem",
                      }}
                    >
                      Dr. {doctor.name}
                    </Card.Title>
                    <Card.Text>
                      <div
                        style={{
                          fontSize: "1.2rem",
                          color: "#333",
                          marginBottom: "4rem",
                        }}
                      >
                        {doctor.specialty}
                      </div>
                      <div
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "600",
                          color: "#555",
                          marginRight: "1rem",
                        }}
                        className="d-flex align-items-center justify-content-end"
                      >
                        ${doctor.sessionPrice.toFixed(2)} / Session
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
