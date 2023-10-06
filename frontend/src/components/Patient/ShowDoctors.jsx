import React from "react";
import { Card, Col, Row, Image } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import doctorImg from "../../Assets/Patient/Doctor.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocation,
  faLocationDot,
  faStar,
} from "@fortawesome/free-solid-svg-icons";

function ShowDoctors() {
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const navigate = useNavigate();

  const handleCard = (doctor) => {
    // Handle card click action here
    navigate("/");
  };

  const NeededData = [
    {
      doctorId: 1,
      Name: "Dr. John Doe",
      specialty: "Cardiologist",
      location: "New York",
      rating: 4.5,
      Price: 150,
    },
    {
      doctorId: 2,
      Name: "Dr. Jane Smith",
      specialty: "Dermatologist",
      location: "Los Angeles",
      rating: 4.0,
      Price: 120,
    },
    // Add more doctor objects as needed
  ];

  return (
    <div>
      {NeededData.map((doctor) => (
        <a onClick={() => handleCard(doctor)} key={doctor.doctorId}>
          <Card className="mb-4 mx-3~ bg-light" style={{ cursor: "pointer" }}>
            <Row>
              <Col lg={4}>
                <div className="doctor-image-container">
                  <Image
                    src={doctorImg}
                    alt={`Dr. ${doctor.Name}`}
                    fluid
                    className="doctor-image"
                  />
                </div>
              </Col>
              <Col lg={8}>
                <Card.Body className="p-4">
                  <Card.Title className="show-more-title">
                    {doctor.Name}
                  </Card.Title>
                  <Card.Text>
                    <div className="show-more-loc">{doctor.specialty}</div>
                    <div className="show-more-loc">
                      {" "}
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        style={{ marginRight: "0.5rem" }}
                      />
                      {doctor.location}
                    </div>
                    <div className="show-more-rating">
                      {" "}
                      <FontAwesomeIcon
                        icon={faStar}
                        style={{ marginRight: "0.5rem" }}
                      />
                      {doctor.rating}
                    </div>
                    <div className="show-more-price">
                      ${doctor.Price} / Session
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
