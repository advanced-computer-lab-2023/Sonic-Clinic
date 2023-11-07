import React, { useState } from "react";
import doctorImg from "../../Assets/Patient/Doctor.jpg";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setUpdatesDoctor } from "../../state/loginDoctorReducer";
import defaultImg from "../../Assets/doctor/UnknownUser.jpg";
import axios from "axios";

function DrProfileBox() {
  const profileBoxStyle = {
    width: "30rem",
    padding: "1rem",
    backgroundColor: "#ffffff",
    textAlign: "center",
  };

  const profileImageStyle = {
    width: "150px",
    height: "150px",
    borderRadius: "50%",
    objectFit: "cover",
    marginBottom: "20px",
  };

  const inputStyle = {
    width: "18rem",
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
    photo: useSelector((state) => state.doctorLogin.photo),
    name: useSelector((state) => state.doctorLogin.name),
    username: useSelector((state) => state.doctorLogin.userName),
    speciality: useSelector((state) => state.doctorLogin.speciality),
    email: useSelector((state) => state.doctorLogin.email),
    affiliation: useSelector((state) => state.doctorLogin.affiliation),
    hourlyRate: useSelector((state) => state.doctorLogin.hourlyRate),
    birthDate: useSelector((state) => state.doctorLogin.birthdate),
    phoneNumber: useSelector((state) => state.doctorLogin.phoneNumber),
    educationalBackground: useSelector(
      (state) => state.doctorLogin.educationalBackground
    ),
  });

  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const _id = useSelector((state) => state.doctorLogin.userId);
  const dispatch = useDispatch();

  const handleInputChange = (e, field) => {
    setProfileData((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handleSaveChanges = async () => {
    dispatch(
      setUpdatesDoctor({
        email: profileData.email,
        hourlyRate: profileData.hourlyRate,
        affiliation: profileData.affiliation,
      })
    );
    const queryParameters = new URLSearchParams({
      _id: _id,
      email: profileData.email,
      hourlyRate: profileData.hourlyRate,
      affiliation: profileData.affiliation,
    }).toString();
    const url = `/updateDoctorProfile?${queryParameters}`;

    try {
      const response = await axios.put(url, null);

      if (response.status === 200) {
        console.log("tmam");
      } else if (response.status === 404) {
        setError("Doctor not found");
      } else {
        setError("Error");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("Doctor not found");
      } else {
        setError(
          "An error occurred while updating doctor. Please try again later"
        );
      }
    }
    setIsEditing(false);
  };

  return (
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
      <img src={profileData.photo || defaultImg} style={profileImageStyle} />
      <h2 style={{ marginBottom: "1rem" }}>
        <strong>Dr. {profileData.name}</strong>
      </h2>
      <h2 style={{ marginBottom: "2rem", fontSize: "20px", color: "#05afb9 " }}>
        <strong>{profileData.speciality}</strong>
      </h2>
      <div className="d-flex flex-column align-items-start">
        <p class="d-flex flex-row">
          <div style={inputLabel}>Username:</div>
          <span>{profileData.username}</span>
        </p>
        <p class="d-flex flex-row">
          <div style={inputLabel}>Email: </div>
          {isEditing ? (
            <input
              type="email"
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
              type="number"
              value={profileData.hourlyRate}
              onChange={(e) => handleInputChange(e, "hourlyRate")}
              style={inputStyle}
            />
          ) : (
            <span>{profileData.hourlyRate} LE/hr</span>
          )}
        </p>
      </div>
      <p class="d-flex flex-row">
        <div style={inputLabel}>Educational Background:</div>
        <span>{profileData.educationalBackground}</span>
      </p>
      <div>
        {isEditing && <Button onClick={handleSaveChanges}>Save Changes</Button>}
      </div>
    </div>
  );
}

export default DrProfileBox;
