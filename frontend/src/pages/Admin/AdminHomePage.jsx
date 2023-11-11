import React from "react";
import AdminHomeCard from "../../components/Admin/AdminHomeCard";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import { Container, Row } from "react-bootstrap";
import AdminImg from "../../components/Admin/AdminImg";
import AdminBurgerMenu from "../../components/Admin/AdminBurgerMenu";
import {
  faHospitalUser,
  faUserDoctor,
  faUsers,
  faBriefcaseMedical,
} from "@fortawesome/free-solid-svg-icons";
import { Waypoint } from "react-waypoint";
import { useSpring, animated } from "react-spring";
import { useState } from "react";

export default function AdminHomePage() {
  const [ourDoctorsVisible, setOurDoctorsVisible] = useState(false);
  const ourDoctorsSpring = useSpring({
    opacity: ourDoctorsVisible ? 1 : 0,
    transform: ourDoctorsVisible ? "translateX(0)" : "translateX(-50%)",
    config: { duration: 1000 },
  });
  return (
    <>
      <AppNavbar hamburgerMenu={<AdminBurgerMenu />} />
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
          <Waypoint
            onEnter={() => setOurDoctorsVisible(true)}
            onLeave={() => setOurDoctorsVisible(false)}
          />
          <animated.div style={ourDoctorsSpring} className="d-flex flex-row">
            <div className="mr-2">
              <AdminHomeCard
                location="/admin/patients-list"
                cardText="Patients"
                cardDetails="View/Edit Patients"
                icon={faHospitalUser}
              />
            </div>
            <div>
              <AdminHomeCard
                location="/admin/doctors-list"
                cardText="Doctors"
                cardDetails="View/Edit Doctors"
                icon={faUserDoctor}
              />
            </div>
            <div>
              <AdminHomeCard
                location="/admin/admins-list"
                cardText="Admins"
                cardDetails="View/Edit Admins"
                icon={faUsers}
              />
            </div>
            <div>
              <AdminHomeCard
                location="/admin/packages"
                cardText="Health Packages"
                cardDetails="View/Edit Health Packages"
                icon={faBriefcaseMedical}
              />
            </div>
          </animated.div>
        </div>
      </Container>
    </>
  );
}
