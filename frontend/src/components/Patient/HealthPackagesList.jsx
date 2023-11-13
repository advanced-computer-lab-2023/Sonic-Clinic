import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
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
      {NeededData &&
        NeededData.map((member, index) => (
          <Card key={`outer_${index}`} className="mb-4">
            {member.package &&
              member.package.length > 0 &&
              member.package.map((packagee, packageIndex) => (
                <Card.Body key={`inner_${index}_${packageIndex}`}>
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
                        <strong>Package:</strong> {packagee.type.split(" ")[0]}
                      </p>
                      <p>
                        <strong>Package Status:</strong> {packagee.status}
                      </p>
                      {packagee.status !== "Subscribed" && (
                        <p>
                          <strong>End Date:</strong> {packagee.endDate}
                        </p>
                      )}
                      {packagee.status === "Subscribed" && (
                        <p>
                          <strong>Price:</strong> {packagee.price}
                        </p>
                      )}
                      {packagee.status === "Subscribed" && (
                        <p>
                          <strong>Renewal Date:</strong> {packagee.renewalDate}
                        </p>
                      )}
                    </Col>
                    <Col
                      md={4}
                      className="d-flex align-items-end justify-content-end"
                    >
                      {packagee.status === "Subscribed" && (
                        <Button
                          variant="secondary"
                          onClick={() => cancelPackage(member._id)}
                        >
                          Cancel Package
                        </Button>
                      )}
                    </Col>
                  </Row>
                </Card.Body>
              ))}
            {member.package && (
              <Card.Body>
                {/* <div
                  style={{
                    color: "#099BA0",
                    fontSize: "30px",
                    fontWeight: "600",
                    marginBottom: "10px",
                  }}
                >
                  {member.name}
                </div> */}
                <Row>
                  <Col md={8}>
                    <p>
                      <strong>Package:</strong> {member.package.type}
                    </p>
                    <p>
                      <strong>Package Status:</strong> {member.package.status}
                    </p>
                    {member.package.status === "Cancelled" && (
                      <p>
                        <strong>End Date:</strong> {member.package.endDate}
                      </p>
                    )}
                    {member.package.status === "Subscribed" && (
                      <p>
                        <strong>Price:</strong> {member.package.price}
                      </p>
                    )}
                    {member.package.status === "Subscribed" && (
                      <p>
                        <strong>End Date:</strong> {member.package.renewalDate}
                      </p>
                    )}
                  </Col>
                  <Col
                    md={4}
                    className="d-flex align-items-end justify-content-end"
                  >
                    {member.package.status === "Subscribed" && (
                      <Button
                        variant="secondary"
                        onClick={() => cancelPackage(member._id)}
                      >
                        Cancel Package
                      </Button>
                    )}
                  </Col>
                </Row>
              </Card.Body>
            )}
          </Card>
        ))}
    </Container>
  );
}

export default HealthPackagesList;
