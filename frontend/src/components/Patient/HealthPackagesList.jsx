import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Row, Spinner } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { updatePatientPackage } from "../../state/loginPatientReducer";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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
            // marginBottom: "0.5rem",
          }}
        >
          Your Health Packages
        </div>
        <div
          className=" d-flex justify-content-center align-items-center"
          style={{
            cursor: "default",
            color: "#ADB5BD",
            fontSize: "1.1rem",
            marginBottom: "1rem",
          }}
        >
          Explore Health Packages{"  "}
          <div
            className="  link-decoration "
            style={{ cursor: "pointer", marginLeft: "0.5rem" }}
            onClick={() => navigate("/patient/health-packages")}
          >
            <strong>Here</strong>
          </div>
        </div>
        {(NeededData.every((member) => member.length === 0) ||
          NeededData.length === 0) && (
          <div
            className="msg"
            style={{ width: "30rem", marginLeft: "12rem", marginTop: "3rem" }}
          >
            No health package history
          </div>
        )}
        {NeededData && NeededData[0] && !Array.isArray(NeededData[0]) && (
          <Card
            key={`outer_bla`}
            style={{ padding: "1rem", marginBottom: "1rem" }}
          >
            <Card.Body>
              <div
                style={{
                  color: "#099BA0",
                  fontSize: "1.7rem",
                  fontWeight: "600",
                  marginBottom: "10px",
                }}
              >
                {NeededData[0].name || "Name not available"}
              </div>
              <Row>
                <Col md={8}>
                  {Array.isArray(NeededData[0].package) ? (
                    NeededData[0].package.map((packagee, packageIndex) => (
                      <div
                        key={`innerPackage_${packageIndex}`}
                        style={{ fontSize: "1.05rem" }}
                      >
                        <p>
                          <strong>Package:</strong>{" "}
                          {packagee.type?.split(" ")[0]}
                        </p>
                        <p>
                          <strong>Package Status:</strong> {packagee.status}
                        </p>
                        {packagee.status === "Subscribed" ? (
                          <>
                            {" "}
                            <p>
                              <strong>Price:</strong>$ {packagee.price}
                            </p>
                            <p>
                              <strong>Renewal Date:</strong>{" "}
                              {packagee.renewalDate}
                            </p>
                          </>
                        ) : (
                          <p style={{ fontSize: "1.05rem" }}>
                            <strong>End Date:</strong> {packagee.endDate}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div style={{ fontSize: "1.05rem" }}>
                      {" "}
                      <p>
                        <strong>Package:</strong>{" "}
                        {NeededData[0].package.type?.split(" ")[0]}
                      </p>
                      <p>
                        <strong>Package Status:</strong>{" "}
                        {NeededData[0].package.status}
                      </p>
                      {NeededData[0].package.status === "Subscribed" ? (
                        <div>
                          {" "}
                          <p>
                            <strong>Price:</strong>${" "}
                            {NeededData[0].package.price}
                          </p>
                          <p>
                            <strong>Renewal Date:</strong>{" "}
                            {NeededData[0].package.renewalDate}
                          </p>
                        </div>
                      ) : (
                        <p>
                          <strong>End Date:</strong>{" "}
                          {NeededData[0].package.endDate}
                        </p>
                      )}
                    </div>
                  )}
                </Col>
                <Col
                  md={4}
                  className="d-flex align-items-end justify-content-end"
                >
                  {NeededData[0].package.status === "Subscribed" && (
                    <Button
                      variant="secondary"
                      style={{ marginBottom: "5.5rem" }}
                      onClick={() => cancelPackage(NeededData[0]._id)}
                    >
                      Cancel Package
                    </Button>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        )}
        {NeededData &&
          NeededData.every(
            (member, index) => index === 0 || member.length > 0
          ) &&
          NeededData.slice(1).map((member, index) => (
            <Card
              key={`outer_${index}`}
              style={{ padding: "1rem", marginBottom: "1rem" }}
            >
              {Array.isArray(member) ? (
                <Card.Body key={`outer_${index}`}>
                  <div
                    style={{
                      color: "#099BA0",
                      fontSize: "1.7rem",
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
                            {Array.isArray(innerMember.package) ? (
                              innerMember.package.map(
                                (packagee, packageIndex) => (
                                  <div
                                    key={`innerPackage_${packageIndex}`}
                                    style={{ fontSize: "1.05rem" }}
                                  >
                                    <p>
                                      <strong>Package:</strong>{" "}
                                      {packagee.type?.split(" ")[0]}
                                    </p>
                                    <p>
                                      <strong>Package Status:</strong>{" "}
                                      {packagee.status}
                                    </p>
                                    {packagee.status === "Subscribed" ? (
                                      <>
                                        {" "}
                                        <p>
                                          <strong>Price:</strong> ${" "}
                                          {packagee.price}
                                        </p>
                                        <p>
                                          <strong>Renewal Date:</strong>{" "}
                                          {packagee.renewalDate}
                                        </p>
                                      </>
                                    ) : (
                                      <p>
                                        <strong>End Date:</strong>{" "}
                                        {packagee.endDate}
                                      </p>
                                    )}
                                  </div>
                                )
                              )
                            ) : (
                              <div style={{ fontSize: "1.05rem" }}>
                                <p>
                                  <strong>Package:</strong>{" "}
                                  {innerMember.package.type?.split(" ")[0]}
                                </p>
                                <p>
                                  <strong>Package Status:</strong>{" "}
                                  {innerMember.package.status}
                                </p>
                                {innerMember.package.status === "Subscribed" ? (
                                  <>
                                    {" "}
                                    <p>
                                      <strong>Price:</strong> ${" "}
                                      {innerMember.package.price}
                                    </p>
                                    <p>
                                      <strong>Renewal Date:</strong>{" "}
                                      {innerMember.package.renewalDate}
                                    </p>
                                  </>
                                ) : (
                                  <p style={{ fontSize: "1.05rem" }}>
                                    <strong>End Date:</strong>{" "}
                                    {innerMember.package.endDate}
                                  </p>
                                )}
                              </div>
                            )}
                          </Col>
                          <Col
                            md={4}
                            className="d-flex align-items-end justify-content-end"
                          >
                            {innerMember.package &&
                              innerMember.package.status === "Subscribed" && (
                                <Button
                                  variant="secondary"
                                  style={{ marginBottom: "5.5rem" }}
                                  onClick={() => cancelPackage(innerMember._id)}
                                >
                                  Cancel Package
                                </Button>
                              )}
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
                      fontSize: "1.7rem",
                      fontWeight: "600",
                      marginBottom: "10px",
                    }}
                  >
                    {member.name || "Name not available"}
                  </div>
                  <Row>
                    <Col md={8}>
                      {Array.isArray(member.package) ? (
                        member.package.map((packagee, packageIndex) => (
                          <div
                            key={`innerPackage_${packageIndex}`}
                            style={{ fontSize: "1.05rem" }}
                          >
                            <p>
                              <strong>Package:</strong>{" "}
                              {packagee.type?.split(" ")[0]}
                            </p>
                            <p>
                              <strong>Package Status:</strong> {packagee.status}
                            </p>
                            {packagee.status === "Subscribed" ? (
                              <>
                                {" "}
                                <p>
                                  <strong>Price:</strong>$ {packagee.price}
                                </p>
                                <p>
                                  <strong>Renewal Date:</strong>{" "}
                                  {packagee.renewalDate}
                                </p>
                              </>
                            ) : (
                              <p style={{ fontSize: "1.05rem" }}>
                                <strong>End Date:</strong> {packagee.endDate}
                              </p>
                            )}
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: "1.05rem" }}>
                          {" "}
                          <p>
                            <strong>Package:</strong>{" "}
                            {member.package.type.split(" ")[0]}
                          </p>
                          <p>
                            <strong>Package Status:</strong>{" "}
                            {member.package.status}
                          </p>
                          {member.package.status === "Subscribed" ? (
                            <div>
                              {" "}
                              <p>
                                <strong>Price:</strong>$ {member.package.price}
                              </p>
                              <p>
                                <strong>Renewal Date:</strong>{" "}
                                {member.package.renewalDate}
                              </p>
                            </div>
                          ) : (
                            <p>
                              <strong>End Date:</strong>{" "}
                              {member.package.endDate}
                            </p>
                          )}
                        </div>
                      )}
                    </Col>
                    <Col
                      md={4}
                      className="d-flex align-items-end justify-content-end"
                    >
                      {member.package.status === "Subscribed" && (
                        <Button
                          variant="secondary"
                          style={{ marginBottom: "5.5rem" }}
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
    </>
  );
}

export default HealthPackagesList;
