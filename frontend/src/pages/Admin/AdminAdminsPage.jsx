import React, {useState} from "react";
import AdminViewTable from "../../components/Admin/AdminViewTable";
import AdminSearchBar from "../../components/Admin/AdminSearchBar";
import AppNavbar from "../../components/AppNavigation/AppNavbar";
import { Button, Container } from "react-bootstrap";
import HamburgerMenu from "../../components/Patient/HamburgerMenu";
import AddNewAdmin from "../../forms/AddNewAdmin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

export default function AdminAdminsPage() {
    const [showAddNewAdmin, setShowAddNewAdmin] = useState(false);

    const toggleAddNewAdmin = () => {
        setShowAddNewAdmin(!showAddNewAdmin);
      };

    const addBtnText=showAddNewAdmin?"Close Form":"Add new Adminstrator";
    const addBtnIcon={faPlus}
    const btnStyle={
        backgroundcolor: `${showAddNewAdmin ? "#ff6b35" : "#05afb9"} !important`, //leh msh shaghala?
        marginBottom: '20px'
    }
    const iconStyle={
        opacity: 1,
        color: "#f0f0f0",
        fontSize: "20px",
        cursor: "pointer",
        marginLeft:"10px"
  }

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
      Registered Admins
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
      <Button style={btnStyle} id="newAdminForm" onClick={toggleAddNewAdmin}>{addBtnText}
      {showAddNewAdmin? <FontAwesomeIcon
                icon={faXmark}
                style={iconStyle}
              />:<FontAwesomeIcon
              icon={faPlus}
              style={iconStyle}
            />
      }
      </Button>
      {showAddNewAdmin && <AddNewAdmin />}

      <AdminSearchBar/>
      <AdminViewTable />
    </Container>
  </>
  )
}
