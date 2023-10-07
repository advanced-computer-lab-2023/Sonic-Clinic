import React, { useEffect } from "react";
import { Card, Col, Row, Image } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import doctorImg from "../../Assets/Patient/Doctor.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import {
  faLocation,
  faLocationDot,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { setDoctorData } from "../../state/doctorIdReducer";

function ShowDoctors() {
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
  }, []);

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
        setError("An error occurred while logging in. Please try again later.");
      }
      setLoading(false);
    }
  };

  const NeededData = responseData;

  return (
    <div>
      {error1 && <div>{error1}</div>}
      {NeededData.map((doctor) => (
        <a onClick={() => handleCard(doctor)} key={doctor._id}>
          <Card className="mb-4 mx-3~ bg-light" style={{ cursor: "pointer" }}>
            <Row>
              <Col lg={4}>
                <div className="doctor-image-container">
                  <Image
                    src={doctor.photoLink}
                    alt={`Dr. ${doctor.name}`}
                    fluid
                    className="doctor-image"
                  />
                </div>
              </Col>
              <Col lg={8}>
                <Card.Body className="p-4">
                  <Card.Title className="show-more-title">
                    {doctor.name}
                  </Card.Title>
                  <Card.Text>
                    <div className="show-more-loc">{doctor.speciality}</div>
                    <div className="show-more-price">
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
