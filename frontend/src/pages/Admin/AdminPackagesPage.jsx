import React from 'react';
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import { Container } from "react-bootstrap";
import HamburgerMenu from "../../components/Patient/HamburgerMenu";
import AdminPackageCarousel from '../../components/Admin/AdminPackageCarousel';
import AddNewPackage from '../../forms/AddNewPackage';

export default function AdminPackagesPage() {

  //add button to toggle the AddNewPackageForm
  return (
    <>
      <AppNavbar hamburgerMenu={<HamburgerMenu />} />
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
        {/* <AdminPackageCarousel/> */}
        <AdminPackageCarousel/>
      </Container>
    </>
  )
}
