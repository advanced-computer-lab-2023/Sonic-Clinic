import React, { useState } from "react";
import AdminViewTable from "../../components/Admin/AdminViewTable";
import AdminSearchBar from "../../components/Admin/AdminSearchBar";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import { Container } from "react-bootstrap";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import AdminDocReqs from "../../components/Admin/AdminDocReqs";
import AdminBurgerMenu from "../../components/Admin/AdminBurgerMenu";

export default function AdminDoctorsPage() {
  const [tab, setTab] = useState("registered");

  const doctors = [
    { id: 1, firstName: "Robin", lastName: "Otto", username: "@rno" },
    { id: 2, firstName: "Joe", lastName: "Doe", username: "@joedoe" },
  ];

  return (
    <>
      <AppNavbar hamburgerMenu={<AdminBurgerMenu />} />
      <div
        style={{
          marginTop: "50px",
          color: "var(--body-text-body-color, #212529)",
          fontSize: "2rem",
          fontWeight: "600",
          textAlign: "center",
          lineHeight: "120%",
        }}
      >
        Available Doctors
      </div>
      <style>
        {`
          /* Custom CSS for inactive tabs */
          .nav-link {
            color: #099BA0  ; /* Set the color for inactive tabs */
          }
        `}
      </style>

      <Tabs
        id="controlled-tab-example"
        activeKey={tab}
        onSelect={(k) => setTab(k)}
        className="mb-3 d-flex align-items-center justify-content-center"
        style={{ marginTop: "20px" }}
      >
        <Tab eventKey="registered" title="Registered">
          <Container
            className="bg-white px-5 py-4 d-flex align-items-center justify-content-center"
            style={{
              margin: "20px",
              display: "flex",
              flexDirection: "column",
              marginLeft: "100px",
            }}
          >
            <AdminSearchBar />
            <AdminViewTable onAdmins={false} users={doctors} />
          </Container>
        </Tab>
        <Tab eventKey="requests" title="Requests">
          <AdminDocReqs />
        </Tab>
      </Tabs>
    </>
  );
}
