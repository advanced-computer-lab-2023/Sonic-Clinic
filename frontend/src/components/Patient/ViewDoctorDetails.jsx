import React from "react";
import { ListGroup, Col, Row, Image } from "react-bootstrap";
import { useSelector } from "react-redux";
import defaultPfp from "../../Assets/Patient/DefaultPfp.png";

function ViewDoctorDetails() {
  const doctor = useSelector((state) => state.selectedDoctorData);

  const listItemStyle = {
    fontSize: "1rem",
    marginBottom: "0.7rem",
    verticalAlign: "top",
    fontWeight: "600",
  };

  const photoStyle = {
    height: "100%", // Set the height to 100% of the list item
    objectFit: "cover", // Ensure the image covers the entire height
  };

  return (
    <div>
      <Row>
        <Col xs={12} lg={3}>
          {/* Photo */}
          <Image
            src={doctor.photoLink || defaultPfp}
            alt={defaultPfp}
            style={photoStyle}
            fluid
          />
        </Col>
        <Col xs={12} lg={9}>
          {/* Doctor Details */}
          <div
            className="d-flex justify-content-start align-items-center"
            style={{
              fontSize: "2.5rem",
              fontWeight: "600",
              color: "#212529",
              lineHeight: "1.5",
            }}
          >
            {doctor.name}
          </div>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <div style={listItemStyle}>
                <span style={{ color: "#099BA0" }}>Specialty:</span>{" "}
                {doctor.speciality}
              </div>
              <div style={listItemStyle}>
                <span style={{ color: "#099BA0" }}>
                  Educational Background:
                </span>{" "}
                {doctor.educationalBackground}
              </div>
              <div style={listItemStyle}>
                <span style={{ color: "#099BA0" }}>Affiliation:</span>{" "}
                {doctor.affiliation}
              </div>
              <div style={listItemStyle}>
                <span style={{ color: "#099BA0" }}>Rate/Session:</span> $
                {doctor.hourlyRate}
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </div>
  );
}

export default ViewDoctorDetails;
