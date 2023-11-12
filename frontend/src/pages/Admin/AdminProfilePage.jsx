import React, { useState } from "react";
import { Container, Tab, Col, Row, Nav, ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import AdminBurgerMenu from "../../components/Admin/AdminBurgerMenu";
import ChangePass from "../../forms/ChangePass";

function AdminProfilePage() {
  const [activeKey, setActiveKey] = useState("first");
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [showChangePass, setShowChangePass] = useState(false);
  const user = useSelector((state) => state.adminLogin);

  const listItemStyle = {
    fontSize: "1rem", // Font size for all information
    marginBottom: "0.7rem", // Margin bottom for all information
    verticalAlign: "top", // Align items at the top of each column
    fontWeight: "600", // Bold font weight for information title
  };

  const labelStyle = {
    cursor: "pointer",
    fontWeight: "lighter",
    textDecoration: showChangePass ? "underline" : "none",
    color: "inherit",
  };

  const handleSelect = (selectedKey) => {
    setActiveKey(selectedKey);
  };

  const toggleChangePass = () => {
    setShowChangePass(!showChangePass);
  };

  return (
    <div>
      <AppNavbar hamburgerMenu={<AdminBurgerMenu />} />
      <Container fluid className="bg-light pt-3 mt-2">
        <Container className="bg-white px-5 py-4 d-flex align-items-center justify-content-center">
          <Row className="w-100">
            <div className="w-100 mt-5">
              <Tab.Container id="left-tabs-example" defaultActiveKey="first">
                <Row>
                  <Col lg={3}>
                    <Nav
                      variant="pills"
                      className="flex-column"
                      activeKey={activeKey}
                      onSelect={handleSelect}
                    >
                      <Nav.Item>
                        <Nav.Link
                          eventKey="first"
                          style={{
                            background:
                              activeKey === "first" ? "#05afb9" : "white",
                            color: activeKey === "first" ? "white" : "black",
                            border:
                              activeKey === "first"
                                ? "none"
                                : "1px solid rgb(189, 189, 189)",
                            marginBottom: "1rem",
                            fontSize: "1.2rem",
                            fontWeight: "600",
                          }}
                        >
                          Personal Information
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                  </Col>
                  <Col lg={9}>
                    <Tab.Content>
                      <Tab.Pane eventKey="first">
                        <div>
                          <div
                            className="d-flex justify-content-center align-items-center"
                            style={{
                              fontSize: "2.5rem", // Increase font size for the title
                              fontWeight: "600",
                              color: "#212529",
                              lineHeight: "1.5",
                            }}
                          >
                            Personal Information
                          </div>
                          <ListGroup>
                            <ListGroup.Item>
                              <div style={listItemStyle}>
                                <span style={{ color: "#099BA0" }}>
                                  Username:
                                </span>{" "}
                                {user.userName}
                              </div>
                              <div style={listItemStyle}>
                                <span style={{ color: "#099BA0" }}>
                                  Password:
                                </span>{" "}
                                <span>
                                  <label
                                    style={labelStyle}
                                    onClick={toggleChangePass} // Add your click handler here
                                  >
                                    {showChangePass ? "close" : "********"}
                                  </label>
                                </span>
                                {showChangePass && (
                                  <ChangePass
                                    patient={true}
                                    api="/changePasswordForAdmin"
                                  />
                                )}
                              </div>
                            </ListGroup.Item>
                          </ListGroup>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Col>
                </Row>
              </Tab.Container>
            </div>
          </Row>
        </Container>
      </Container>
    </div>
  );
}

export default AdminProfilePage;
