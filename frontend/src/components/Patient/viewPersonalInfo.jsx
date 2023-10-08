import React from "react";
import { ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";

function ViewPersonalInfo() {
  const user = useSelector((state) => state.patientLogin);

  const listItemStyle = {
    fontSize: "1rem", // Font size for all information
    marginBottom: "0.7rem", // Margin bottom for all information
    verticalAlign: "top", // Align items at the top of each column
    fontWeight: "600", // Bold font weight for information title
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
        }}
      >
        Personal Information
      </div>
      <ListGroup>
        <ListGroup.Item>
          <div style={listItemStyle}>
            <span style={{ color: "#099BA0" }}>Name:</span> {user.name}
          </div>
          <div style={listItemStyle}>
            <span style={{ color: "#099BA0" }}>Username:</span> {user.userName}
          </div>
          <div style={listItemStyle}>
            <span style={{ color: "#099BA0" }}>Email:</span> {user.userEmail}
          </div>
          <div style={listItemStyle}>
            <span style={{ color: "#099BA0" }}>Phone Number:</span>{" "}
            {user.phoneNumber}
          </div>
          <div style={listItemStyle}>
            <span style={{ color: "#099BA0" }}>Packages:</span>{" "}
            {user.packages || "No Packages"}
          </div>
          <div style={listItemStyle}>
            <span style={{ color: "#099BA0" }}>Emergency Name:</span>{" "}
            {user.emergencyName}
          </div>
          <div style={listItemStyle}>
            <span style={{ color: "#099BA0" }}>Emergency Number:</span>{" "}
            {user.emergencyNumber}
          </div>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
}

export default ViewPersonalInfo;
