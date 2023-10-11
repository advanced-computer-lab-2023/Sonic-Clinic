//will need to fix it to have a personal pic for each dr

import React, { useState } from 'react';
import doctorImg from "../../Assets/Patient/Doctor.jpg";

function DrProfileBox() {
  const profileBoxStyle = {
    width: '80%',
    maxWidth: '500px',
    padding: '20px',
    backgroundColor: '#ffffff',
    textAlign: 'center',
  };

  const profilePageStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  };

  const profileImageStyle = {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '20px',
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    borderRadius: '8px',
    border: '1px solid #ADB5BD',
  };

  // Initial profile data
  const [profileData, setProfileData] = useState({
    name: 'John Doe',
    email: 'johndoe@example.com',
    affiliation: 'Example Affiliation',
    hourlyRate: '$50',
  });

  const handleInputChange = (e, field) => {
    setProfileData((prevData) => ({
      ...prevData,
      [field]: e.target.value,
    }));
  };

  return (
    <div style={profilePageStyle}>
      <div style={profileBoxStyle}>
        <img
          src={doctorImg}
          alt="Profile Image"
          style={profileImageStyle}
        />
        <h2>Profile Details</h2>
        <p>
          Name: <strong>{profileData.name}</strong>
        </p>
        <p>
          Email: 
          <input
            type="text"
            value={profileData.email}
            onChange={(e) => handleInputChange(e, 'email')}
            style={inputStyle}
          />
        </p>
        <p>
          Affiliation: 
          <input
            type="text"
            value={profileData.affiliation}
            onChange={(e) => handleInputChange(e, 'affiliation')}
            style={inputStyle}
          />
        </p>
        <p>
          Hourly Rate: 
          <input
            type="text"
            value={profileData.hourlyRate}
            onChange={(e) => handleInputChange(e, 'hourlyRate')}
            style={inputStyle}
          />
        </p>
      </div>
    </div>
  );
}

export default DrProfileBox;