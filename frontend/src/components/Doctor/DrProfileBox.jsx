import React, { useState } from "react";
import doctorImg from "../../Assets/Patient/Doctor.jpg";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

function DrProfileBox() {
  const profileBoxStyle = {
    width: "80%",
    maxWidth: "500px",
    padding: "20px",
    backgroundColor: "#ffffff",
    textAlign: "center",
  };

  const profilePageStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f0f0f0",
  };

  const profileImageStyle = {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "20px",
  };

  const inputStyle = {
    width: "20rem",
    padding: "8px",
    borderRadius: "8px",
    border: "1px solid #ADB5BD",
  };

  const inputLabel = {
    width: "7rem",
    marginRight: "0.5rem",
    fontWeight: "bold",
    color: "#adb5bd ",
    fontSize: "1.1rem",
    textAlign: "left",
  };

  // Initial profile data
  const [profileData, setProfileData] = useState({
    name: useSelector((state) => state.doctorLogin.name),
    email: useSelector((state) => state.doctorLogin.email),
    affiliation: useSelector((state) => state.doctorLogin.affiliation),
    hourlyRate: useSelector((state) => state.doctorLogin.hourlyRate),
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e, field) => {
    setProfileData((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = () => {
    // Save the profile data (you can send it to the server if needed)
    // For now, we'll just log it to the console
    console.log("Saving profile data:", profileData);
    setIsEditing(false);
  };

  return (
    <div style={profilePageStyle}>
      <div style={profileBoxStyle}>
        <div className="d-flex justify-content-end">
          {!isEditing ? (
            <FontAwesomeIcon
              icon={faPenToSquare}
              style={{
                opacity: 1,
                color: "#099BA0 ",
                fontSize: "20px",
                cursor: "pointer",
                marginBottom: "5px",
              }}
              onClick={handleEditClick}
            />
          ) : (
            <FontAwesomeIcon
              icon={faPenToSquare}
              style={{
                opacity: 0,
              }}
              onClick={handleEditClick}
            />
          )}
        </div>
        <img src={doctorImg} alt="Profile Image" style={profileImageStyle} />
        <h2 style={{ marginBottom: "2rem" }}>
          <strong>{profileData.name}</strong>
        </h2>
        <div className="d-flex flex-column align-items-start">
          <p class="d-flex flex-row">
            <div style={inputLabel}>Email: </div>
            {isEditing ? (
              <input
                type="text"
                value={profileData.email}
                onChange={(e) => handleInputChange(e, "email")}
                style={inputStyle}
              />
            ) : (
              <span>{profileData.email}</span>
            )}
          </p>
          <p class="d-flex flex-row">
            <div style={inputLabel}>Affiliation: </div>
            {isEditing ? (
              <input
                type="text"
                value={profileData.affiliation}
                onChange={(e) => handleInputChange(e, "affiliation")}
                style={inputStyle}
              />
            ) : (
              <span>{profileData.affiliation}</span>
            )}
          </p>
          <p class="d-flex flex-row">
            <div style={inputLabel}>Hourly Rate:</div>
            {isEditing ? (
              <input
                type="text"
                value={profileData.hourlyRate}
                onChange={(e) => handleInputChange(e, "hourlyRate")}
                style={inputStyle}
              />
            ) : (
              <span>{profileData.hourlyRate}</span>
            )}
          </p>
        </div>
        <div>
          {isEditing && (
            <Button onClick={handleSaveChanges}>Save Changes</Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DrProfileBox;
