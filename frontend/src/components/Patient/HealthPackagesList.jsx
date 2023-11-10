import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

function HealthPackagesList({ refreshFlag }) {
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [error1, setError] = useState(null);
  const id = useSelector((state) => state.patientLogin.userId);
  useEffect(() => {
    fetchData();
  }, [refreshFlag]); // Fetch data when searchData changes

  const fetchData = async () => {
    try {
      const response = await axios.post("/viewFamilyMembers");

      if (response.status === 200) {
        setResponseData(response.data.familyMembers);
      } else {
        console.log("Server error");
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("Error. Please try again");
      }
      setLoading(false);
    }
  };

  const NeededData = responseData;

  return (
    <Container>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          fontSize: "2.5rem",
          fontWeight: "600",
          color: "#212529",
          lineHeight: "1.5",
        }}
      >
        Your Health Packages
      </div>
      {NeededData.map((member, index) => (
        <Card key={index} className="mb-4">
          <Card.Body>
            <div
              style={{
                color: "#099BA0",
                fontSize: "30px",
                fontWeight: "600",
                marginBottom: "10px",
              }}
            >
              {member.name}
            </div>
            <Row>
              <Col md={8}>
                <p>
                  <strong>Package:</strong> {member.package}
                </p>
                <p>
                  <strong>Package Status:</strong> {member.packageStatus}
                </p>
              </Col>
              <Col
                md={4}
                className="d-flex align-items-end justify-content-end"
              >
                <Button variant="secondary">Cancel Package</Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}

export default HealthPackagesList;
