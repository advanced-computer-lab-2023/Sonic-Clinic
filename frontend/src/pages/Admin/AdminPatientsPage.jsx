import React from "react";
import AdminViewTable from "../../components/Admin/AdminViewTable";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import { Container } from "react-bootstrap";
import AdminBurgerMenu from "../../components/Admin/AdminBurgerMenu";

export default function AdminPatientsPage() {
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
        Registered Patients
      </div>
      <Container
        className="bg-white px-5 py-4 d-flex align-items-center justify-content-center"
        style={{
          marginTop: "1.5rem",
          display: "flex",
          flexDirection: "column",
          marginLeft: "11rem",
        }}
      >
        <AdminViewTable onAdmins={false} api={"/viewAllPatients"} />
      </Container>
    </>
  );
}
