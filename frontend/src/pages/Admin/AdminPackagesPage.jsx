import React from 'react';
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import { Container } from "react-bootstrap";
import AdminBurgerMenu from "../../components/Admin/AdminBurgerMenu";
import AdminPackageCarousel from '../../components/Admin/AdminPackageCarousel';

export default function AdminPackagesPage() {

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
        Availabe Health Packages
      </div>
      <Container
        className="bg-white px-5 py-4 d-flex align-items-center justify-content-center"
        style={{
          margin: "20px",
          display: "flex",
          flexDirection: "column",
          marginLeft: "100px",
        }}
      >
        <AdminPackageCarousel/>
      </Container>
    </>
  )
}
