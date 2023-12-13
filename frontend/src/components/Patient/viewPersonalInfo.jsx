import React, { useState } from "react";
import { ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import ChangePass from "../../forms/ChangePass";

function ViewPersonalInfo() {
  const user = useSelector((state) => state.patientLogin);
  const [showChangePass, setShowChangePass] = useState(false);

  const listItemStyle = {
    fontSize: "1.05rem", // Font size for all information
    marginBottom: "0.75rem", // Margin bottom for all information
    verticalAlign: "top", // Align items at the top of each column
  };

  const labelStyle = {
    cursor: "pointer",
    fontWeight: "lighter",
    textDecoration: "underline",
    color: "inherit",
  };

  const toggleChangePass = () => {
    setShowChangePass(!showChangePass);
  };

  return (
    <div>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          fontSize: "2.5rem", // Increase font size for the title
          fontWeight: "600",
          color: "#212529",
          lineHeight: "1.5",
          marginBottom: "1rem",
        }}
      >
        Personal Information
      </div>
      <ListGroup>
        <ListGroup.Item>
          <div style={listItemStyle}>
            <span style={{ color: "#099BA0", fontWeight: "bold" }}>Name:</span>{" "}
            {user.name}
          </div>
          <div style={listItemStyle}>
            <span style={{ color: "#099BA0", fontWeight: "bold" }}>
              Username:
            </span>{" "}
            {user.userName}
          </div>
          <div style={listItemStyle}>
            <span style={{ color: "#099BA0", fontWeight: "bold" }}>
              Password:
            </span>{" "}
            <span>
              <label
                style={labelStyle}
                onClick={toggleChangePass} // Add your click handler here
              >
                {showChangePass ? "close" : "change password"}
              </label>
            </span>
            {showChangePass && (
              <ChangePass patient={true} api="/changePasswordForPatient" />
            )}
          </div>
          <div style={listItemStyle}>
            <span style={{ color: "#099BA0", fontWeight: "bold" }}>Email:</span>{" "}
            {user.userEmail}
          </div>
          <div style={listItemStyle}>
            <span style={{ color: "#099BA0", fontWeight: "bold" }}>
              Date of birth:
            </span>{" "}
            {user.birthdate.split("T")[0].split("-").reverse().join("/")}
          </div>
          <div style={listItemStyle}>
            <span style={{ color: "#099BA0", fontWeight: "bold" }}>
              Phone Number:
            </span>{" "}
            {user.phoneNumber}
          </div>
          <div style={listItemStyle}>
            <span style={{ color: "#099BA0", fontWeight: "bold" }}>
              Package:
            </span>{" "}
            {user.packages ? user.packages.split(" ")[0] : "No Packages"}
          </div>
          <div style={listItemStyle}>
            <span style={{ color: "#099BA0", fontWeight: "bold" }}>
              Emergency Name:
            </span>{" "}
            {user.emergencyName}
          </div>
          <div style={listItemStyle}>
            <span style={{ color: "#099BA0", fontWeight: "bold" }}>
              Emergency Number:
            </span>{" "}
            {user.emergencyNumber}
          </div>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}

export default ViewPersonalInfo;
