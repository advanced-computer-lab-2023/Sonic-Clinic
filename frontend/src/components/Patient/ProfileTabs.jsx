import { useState } from "react";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import AddFamilyMember from "./AddFamilyMember";
import FamilyMembersList from "./FamilyMembersList";
import ViewPersonalInfo from "./viewPersonalInfo";
import UploadDocuments from "./UploadDocuments";
import { useSelector } from "react-redux";
import HealthPackagesList from "./HealthPackagesList";
import { useNavigate } from "react-router-dom";

function ProfileTabs() {
  const [activeKey, setActiveKey] = useState("first");
  const [refreshFlag, setRefreshFlag] = useState(false);
  const wallet = useSelector((state) => state.patientLogin.wallet);

  const handleSelect = (selectedKey) => {
    setActiveKey(selectedKey);
  };

  const handleRefresh = () => {
    setRefreshFlag(!refreshFlag); // Toggle the refreshFlag to trigger a refresh
  };

  return (
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
                    background: activeKey === "first" ? "#05afb9" : "white",
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
              <Nav.Item>
                <Nav.Link
                  eventKey="second"
                  style={{
                    background: activeKey === "second" ? "#05afb9" : "white",
                    color: activeKey === "second" ? "white" : "black",
                    border:
                      activeKey === "second"
                        ? "none"
                        : "1px solid rgb(189, 189, 189)",
                    marginBottom: "1rem",
                    fontSize: "1.2rem",
                    fontWeight: "600",
                  }}
                >
                  Family Members
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  eventKey="third"
                  style={{
                    background: activeKey === "third" ? "#05afb9" : "white",
                    color: activeKey === "third" ? "white" : "black",
                    border:
                      activeKey === "third"
                        ? "none"
                        : "1px solid rgb(189, 189, 189)",
                    marginBottom: "1rem",
                    fontSize: "1.2rem",
                    fontWeight: "600",
                  }}
                >
                  Medical History
                </Nav.Link>
              </Nav.Item>

              <Nav.Item>
                <Nav.Link
                  eventKey="fifth"
                  style={{
                    background: activeKey === "fifth" ? "#05afb9" : "white",
                    color: activeKey === "fifth" ? "white" : "black",
                    border:
                      activeKey === "fifth"
                        ? "none"
                        : "1px solid rgb(189, 189, 189)",
                    marginBottom: "1rem",
                    fontSize: "1.2rem",
                    fontWeight: "600",
                  }}
                >
                  My Health Packages
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col lg={9}>
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <ViewPersonalInfo />
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <div>
                  <FamilyMembersList refreshFlag={refreshFlag} />
                  <AddFamilyMember onRefresh={handleRefresh} />
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="third">
                <UploadDocuments />
              </Tab.Pane>
              <Tab.Pane eventKey="fifth">
                <HealthPackagesList />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}

export default ProfileTabs;
