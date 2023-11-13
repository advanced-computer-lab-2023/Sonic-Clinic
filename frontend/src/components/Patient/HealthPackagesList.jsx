import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { cancelPatientPackage } from "../../state/loginPatientReducer";

function HealthPackagesList({ refreshFlag }) {
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [error1, setError] = useState(null);
  const [myCancelled, setMyCancelled] = useState(null);
  const id = useSelector((state) => state.patientLogin.userId);
  const myPackage = useSelector((state) => state.patientLogin.packages);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
    console.log(NeededData);
  }, []); // Fetch data when searchData changes

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

  const cancelPackage = async (famId) => {
    try {
      const response = await axios.post("/cancelHealthPackage", {
        famID: famId,
      });

      if (response.status === 200) {
        if (famId == "") {
          setMyCancelled(myPackage.split(" ")[0]);
          dispatch(cancelPatientPackage());
        }
        fetchData();
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
      {myPackage && (
        <Card className="mb-4">
          <Card.Body>
            <div
              style={{
                color: "#099BA0",
                fontSize: "30px",
                fontWeight: "600",
                marginBottom: "10px",
              }}
            >
              Me
            </div>
            <Row>
              <Col md={8}>
                <p>
                  <strong>Package:</strong> {myPackage.split(" ")[0]}
                </p>
                <p>
                  <strong>Package Status:</strong>Subscribed
                </p>
              </Col>
              <Col
                md={4}
                className="d-flex align-items-end justify-content-end"
              >
                <Button variant="secondary" onClick={() => cancelPackage("")}>
                  Cancel Package
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
      {myCancelled && (
        <Card className="mb-4">
          <Card.Body>
            <div
              style={{
                color: "#099BA0",
                fontSize: "30px",
                fontWeight: "600",
                marginBottom: "10px",
              }}
            >
              Me
            </div>
            <Row>
              <Col md={8}>
                <p>
                  <strong>Package:</strong> {myCancelled}
                </p>
                <p>
                  <strong>Package Status:</strong>Cancelled
                </p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
      {NeededData &&
        NeededData.map((member, index) => (
          <Card key={index} className="mb-4">
            {((member.packagesFamily && member.packagesFamily.length > 0) ||
              (member.canceledHealthPackage &&
                member.canceledHealthPackage.length > 0)) && (
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
                    {member.packagesFamily &&
                      member.packagesFamily.length > 0 &&
                      member.packagesFamily[0].type && ( // Added a check for type
                        <>
                          <p>
                            <strong>Package:</strong>{" "}
                            {member.packagesFamily[0].type.split(" ")[0]}
                          </p>
                          <p>
                            <strong>Package Status:</strong>{" "}
                            {member.packagesFamily[0].status}
                          </p>
                        </>
                      )}
                  </Col>
                  <Col
                    md={4}
                    className="d-flex align-items-end justify-content-end"
                  >
                    {member.packagesFamily &&
                      member.packagesFamily.length > 0 &&
                      member.packagesFamily[0].status === "Subscribed" && (
                        <Button
                          variant="secondary"
                          onClick={() => cancelPackage(member._id)}
                        >
                          Cancel Package
                        </Button>
                      )}
                  </Col>
                </Row>
                {/* the cancelled tel3o ids not objects so i need them either objects or name strings */}
                <Row>
                  {member.canceledHealthPackage &&
                    member.canceledHealthPackage.length > 0 &&
                    member.canceledHealthPackage.map((packagee, index) => (
                      <Col md={8} key={index}>
                        {packagee.type && ( // Added a check for type
                          <>
                            <p>
                              <strong>Package:</strong>{" "}
                              {packagee.type.split(" ")[0]}
                            </p>
                            <p>
                              <strong>Package Status:</strong> {packagee.status}
                            </p>
                          </>
                        )}
                      </Col>
                    ))}
                </Row>
              </Card.Body>
            )}
          </Card>
        ))}
    </Container>
  );
}

export default HealthPackagesList;
