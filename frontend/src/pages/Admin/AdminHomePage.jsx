import React from "react";
import AdminHomeCard from "../../components/Admin/AdminHomeCard";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import { Container, Row } from "react-bootstrap";
import AdminImg from "../../components/Admin/AdminImg";
import AdminBurgerMenu from "../../components/Admin/AdminBurgerMenu";

export default function AdminHomePage() {
  return (
    <>
      <AppNavbar hamburgerMenu={<AdminBurgerMenu/>} />
      <Container
        className="bg-white px-5 py-4 d-flex align-items-center justify-content-center"
        style={{
          margin: "20px",
          display: "flex",
          flexDirection: "column",
          marginLeft: "100px",
        }}
      >
        <Row className="row-sub-container">
          <AdminImg />
        </Row>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: "20px",
          }}
        >
          <AdminHomeCard location="/admin/patients-list" cardText="Patients" />
          <AdminHomeCard location="/admin/doctors-list" cardText="Doctors" />
          <AdminHomeCard location="/admin/admins-list" cardText="Admins" />
          <AdminHomeCard location="/admin/packages" cardText="Health Packages" />
        </div>
      </Container>
    </>
  );
}
