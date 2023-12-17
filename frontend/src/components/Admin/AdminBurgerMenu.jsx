import {
  faHospitalUser,
  faUserDoctor,
  faUsers,
  faUser,
  faBriefcaseMedical,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { slide as Menu } from "react-burger-menu";

function HamburgerMenu() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuClick = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div>
      <Menu
        customBurgerIcon={
          <div
            onClick={handleMenuClick}
            style={{
              display: "block",
              borderRadius: "0.25rem",
              border: "1px solid var(--theme-primary, #05AFB9)",
              background: "var(--HitBox, rgba(255, 255, 255, 0.00))",
              padding: "8px", // Add padding to create space for the SVG icon
            }}
          >
            {" "}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 30 30"
              fill="none"
              onClick={handleMenuClick}
            >
              <path d="M4 23H26H4Z" fill="#05AFB9" />
              <path
                d="M4 7H26M4 15H26M4 23H26"
                stroke="#05AFB9"
                stroke-width="2"
                stroke-miterlimit="10"
                stroke-linecap="round"
              />
            </svg>{" "}
          </div>
        }
        customCrossIcon={false}
        width={"20rem"} // Set the width to 20rem
        styles={{
          bmBurgerButton: {
            position: "absolute",
            width: "40px",
            height: "40px",
            left: "20px", // Adjust the distance from the left edge
            top: "20px",
          },
          bmBurgerBars: {
            background: "white", // Set the burger icon color to white
          },
          bmCrossButton: {
            display: "none", // Hide the close (X) button
          },
          bmMenu: {
            position: "fixed", // Set the position to 'fixed'
            top: "0", // Adjust the top position to '0' to start from the top
            left: "0", // Adjust the left position to '0' to start from the left
            background: "white", // Set the menu background color to white
            width: "20rem", // Set the width to 20rem
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)", // Add a box shadow for better visibility
          },
          bmMenuWrap: {
            position: "fixed",
            // Set the position to 'fixed'
            top: "0", // Adjust the top position to '0' to start from the top
            left: "0", // Adjust the left position to '0' to start from the left
            height: "100%",
            background: "red",
          },
          bmItemList: {
            color: "var(--theme-dark, #212529)",
            padding: "0.8rem",
          },
          bmItem: {
            display: "block",
            margin: "1rem 0",
          },
          bmOverlay: {
            position: "fixed", // Set the position to 'fixed'
            top: "0", // Adjust the top position to '0' to start from the top
            left: "0", // Adjust the left position to '0' to start from the left
            width: "100%", // Set the width to 100% to cover the entire screen
            height: "100%",
            background: "rgba(0, 0, 0, 0.1)",
          },
        }}
      >
        <div className="menu-list">
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                color: "#404040",
                fontSize: "1.2rem",
                fontFamily: "'Bebas Neue', sans-serif",
                fontWeight: 700,
                lineHeight: "0.75rem",
                marginLeft: "1rem",
              }}
            >
              Hello
            </div>
          </div>

          <hr className="menu-line" />
          <a
            id="home"
            className="menu-item"
            href="/admin"
            onClick={closeMenu}
            style={{
              color: "var(--gray-600, #6C757D)",
              fontFamily: "Roboto",
              fontSize: "0.9375rem",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "1rem" /* 106.667% */,
              display: "flex",
              alignItems: "center",
              textDecoration: "none", // To remove underlines
              padding: "0.5rem 0",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
              style={{ marginRight: "0.5rem" }}
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M2.87493 19.4062V10.0625H4.31243V19.4062C4.31243 19.5969 4.38816 19.7797 4.52295 19.9145C4.65774 20.0493 4.84056 20.125 5.03118 20.125H17.9687C18.1593 20.125 18.3421 20.0493 18.4769 19.9145C18.6117 19.7797 18.6874 19.5969 18.6874 19.4062V10.0625H20.1249V19.4062C20.1249 19.9781 19.8978 20.5266 19.4934 20.9309C19.089 21.3353 18.5406 21.5625 17.9687 21.5625H5.03118C4.45931 21.5625 3.91086 21.3353 3.50648 20.9309C3.10211 20.5266 2.87493 19.9781 2.87493 19.4062ZM18.6874 3.59373V8.62498L15.8124 5.74998V3.59373C15.8124 3.40311 15.8882 3.22029 16.0229 3.0855C16.1577 2.95071 16.3406 2.87498 16.5312 2.87498H17.9687C18.1593 2.87498 18.3421 2.95071 18.4769 3.0855C18.6117 3.22029 18.6874 3.40311 18.6874 3.59373Z"
                fill="#6C757D"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M10.4836 2.15623C10.7532 1.88674 11.1188 1.73535 11.4999 1.73535C11.8811 1.73535 12.2467 1.88674 12.5162 2.15623L22.0713 11.7099C22.2063 11.8448 22.2821 12.0279 22.2821 12.2187C22.2821 12.4096 22.2063 12.5926 22.0713 12.7276C21.9363 12.8626 21.7533 12.9384 21.5624 12.9384C21.3716 12.9384 21.1885 12.8626 21.0536 12.7276L11.4999 3.17254L1.94631 12.7276C1.81134 12.8626 1.6283 12.9384 1.43743 12.9384C1.24657 12.9384 1.06352 12.8626 0.928556 12.7276C0.793594 12.5926 0.717773 12.4096 0.717773 12.2187C0.717773 12.0279 0.793594 11.8448 0.928556 11.7099L10.4836 2.15623Z"
                fill="#6C757D"
              />
            </svg>
            Home
          </a>
          <hr className="menu-line" />
          <a
            id="profile"
            className="menu-item"
            href="/admin/profile"
            onClick={closeMenu}
            style={{
              color: "var(--gray-600, #6C757D)",
              fontFamily: "Roboto",
              fontSize: "0.9375rem",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "1rem" /* 106.667% */,
              display: "flex",
              alignItems: "center",
              textDecoration: "none", // To remove underlines
              padding: "0.5rem 0",
            }}
          >
            <FontAwesomeIcon icon={faUser} style={{ marginRight: "0.5rem" }} />
            My Profile
          </a>
          {/* Add a line between menu items */}
          <hr className="menu-line" />
          <a
            id="patients"
            className="menu-item"
            href="/admin/patients-list"
            onClick={closeMenu}
            style={{
              color: "var(--gray-600, #6C757D)",
              fontFamily: "Roboto",
              fontSize: "0.9375rem",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "1rem" /* 106.667% */,
              display: "flex",
              alignItems: "center",
              textDecoration: "none", // To remove underlines
              padding: "0.5rem 0",
            }}
          >
            <FontAwesomeIcon
              icon={faHospitalUser}
              style={{ marginRight: "0.5rem" }}
            />
            Patients
          </a>

          <hr className="menu-line" />
          <a
            id="doctors"
            className="menu-item"
            href="/admin/doctors-list"
            onClick={closeMenu}
            style={{
              color: "var(--gray-600, #6C757D)",
              fontFamily: "Roboto",
              fontSize: "0.9375rem",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "1rem" /* 106.667% */,
              display: "flex",
              alignItems: "center",
              textDecoration: "none", // To remove underlines
              padding: "0.5rem 0",
            }}
          >
            <FontAwesomeIcon
              icon={faUserDoctor}
              style={{ marginRight: "0.5rem" }}
            />
            Doctors
          </a>

          <hr className="menu-line" />
          <a
            id="admins"
            className="menu-item"
            href="/admin/admins-list"
            onClick={closeMenu}
            style={{
              color: "var(--gray-600, #6C757D)",
              fontFamily: "Roboto",
              fontSize: "0.9375rem",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "1rem" /* 106.667% */,
              display: "flex",
              alignItems: "center",
              textDecoration: "none", // To remove underlines
              padding: "0.5rem 0",
            }}
          >
            <FontAwesomeIcon icon={faUsers} style={{ marginRight: "0.5rem" }} />
            Admins
          </a>
          <hr className="menu-line" />
          <a
            id="packages"
            className="menu-item"
            href="/admin/packages"
            onClick={closeMenu}
            style={{
              color: "var(--gray-600, #6C757D)",
              fontFamily: "Roboto",
              fontSize: "0.9375rem",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "1rem" /* 106.667% */,
              display: "flex",
              alignItems: "center",
              textDecoration: "none", // To remove underlines
              padding: "0.5rem 0",
            }}
          >
            <FontAwesomeIcon
              icon={faBriefcaseMedical}
              style={{ marginRight: "0.5rem" }}
            />
            Health Packages
          </a>

          <hr className="menu-line" />
          <a
            id="logout"
            className="menu-item"
            href="/"
            style={{
              color: "var(--gray-600, #6C757D)",
              fontFamily: "Roboto",
              fontSize: "0.9375rem",
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "1rem" /* 106.667% */,
              display: "flex",
              alignItems: "center",
              textDecoration: "none", // To remove underlines
              padding: "0.5rem 0",
              cursor: "pointer",
            }}
          >
            <FontAwesomeIcon
              icon={faRightFromBracket}
              style={{ marginRight: "0.5rem" }}
            />
            Logout
          </a>
          <hr className="menu-line" />
        </div>
      </Menu>
    </div>
  );
}
export default HamburgerMenu;
