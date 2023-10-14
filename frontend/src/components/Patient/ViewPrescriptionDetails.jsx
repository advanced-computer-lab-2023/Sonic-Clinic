import React from "react";
import { ListGroup, Col, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

function ViewDoctorDetails() {
  const prescription = useSelector((state) => state.selectedPrescriptionData);

  const listItemStyle = {
    fontSize: "1rem",
    marginBottom: "0.7rem",
    verticalAlign: "top",
    fontWeight: "600",
  };

  return (
    <div>
      <Row>
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
            {/*Should be a title */}Prescription by Dr.{" "}
            {prescription.doctorName}
          </div>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <div style={listItemStyle}>
                <span style={{ color: "#099BA0" }}>Date:</span>{" "}
                {prescription.date}
              </div>
              <div style={listItemStyle}>
                {prescription.medicine.map((medicine, index) => (
                  <div key={index} style={listItemStyle}>
                    <span style={{ color: "#099BA0" }}>
                      Medicine {index + 1}:
                    </span>{" "}
                    {medicine}
                  </div>
                ))}
              </div>
              <div style={listItemStyle}>
                <span style={{ color: "#099BA0" }}>Status:</span>{" "}
                {prescription.status}
              </div>
            </ListGroup.Item>
          </ListGroup>
        </Col>
      </Row>
    </div>
  );
}

export default ViewDoctorDetails;
