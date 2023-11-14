import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { updatePatientPackage } from "../../state/loginPatientReducer";

function HealthPackagesList({ refreshFlag }) {
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [error1, setError] = useState(null);
  const id = useSelector((state) => state.patientLogin.userId);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchData();
    console.log(NeededData);
  }, []); // Fetch data when searchData changes

  const fetchData = async () => {
    try {
      const response = await axios.get("/viewHealthPackages");

      if (response.status === 200) {
        setResponseData(response.data.healthPackages);
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
          dispatch(updatePatientPackage(""));
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
    <>
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
        {NeededData.length === 0 &&
          NeededData.map((member, index) => (
            <Card key={`outer_${index}`} className="mb-4">
              {Array.isArray(member) ? (
                <Card.Body key={`outer_${index}`}>
                  <div
                    style={{
                      color: "#099BA0",
                      fontSize: "30px",
                      fontWeight: "600",
                      marginBottom: "10px",
                    }}
                  >
                    {member[0] && member[0]?.name}
                  </div>
                  {member.map((innerMember, innerIndex) => (
                    <Card.Body key={`inner_${index}_${innerIndex}`}>
                      {innerMember?.package && (
                        <Row>
                          <Col md={8}>
                            {/* Your existing code for package details */}
                          </Col>
                          <Col
                            md={4}
                            className="d-flex align-items-end justify-content-end"
                          >
                            {/* Your existing code for cancel button */}
                          </Col>
                        </Row>
                      )}
                    </Card.Body>
                  ))}
                </Card.Body>
              ) : (
                <Card.Body>
                  <div
                    style={{
                      color: "#099BA0",
                      fontSize: "30px",
                      fontWeight: "600",
                      marginBottom: "10px",
                    }}
                  >
                    {member?.name || "Name not available"}
                  </div>
                  <Row>
                    <Col md={8}>
                      {/* Your existing code for package details */}
                    </Col>
                    <Col
                      md={4}
                      className="d-flex align-items-end justify-content-end"
                    >
                      {/* Your existing code for cancel button */}
                    </Col>
                  </Row>
                </Card.Body>
              )}
            </Card>
          ))}
      </Container>
    </>
  );
}

export default HealthPackagesList;
