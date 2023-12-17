import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { useSelector } from "react-redux";

function FamilyMembersList({ refreshFlag }) {
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
  console.log("ZZZZZZZZZ", NeededData);

  return (
    <Container>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          fontSize: "2.5rem", // Increase font size for the title
          fontWeight: "600",
          color: "#212529",
          lineHeight: "1.5",
          marginBottom: "1rem",
        }}
      >
        Family Members
      </div>
      {NeededData &&
        NeededData.map((member, index) => (
          <Card key={member} className="mb-4">
            <Card.Body>
              <div
                style={{
                  color: "#099BA0  ",
                  fontSize: "1.7rem",
                  fontWeight: "600",
                  marginBottom: "10px",
                }}
              >
                {member.name}
              </div>
              <Row style={{ fontSize: "1.05rem" }}>
                <Col md={3}>
                  <p>
                    <strong>Gender:</strong> {member.gender}
                  </p>
                  <p>
                    <strong>Age:</strong> {member.age}
                  </p>
                </Col>
                <Col md={5}>
                  <p>
                    <strong>National ID:</strong> {member.nationalID}
                  </p>
                  <p>
                    <strong>Relation:</strong> {member.relationToPatient}
                  </p>
                </Col>
                <Col md={4}>
                  <p>
                    <strong>Package:</strong>{" "}
                    {member.packagesFamily && member.packagesFamily[0]
                      ? member.packagesFamily[0].type.split(" ")[0]
                      : member.package && member.package.trim() !== ""
                      ? member.package
                      : "No Packages"}
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))}
    </Container>
  );
}

export default FamilyMembersList;
