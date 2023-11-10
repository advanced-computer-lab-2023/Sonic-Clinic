import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import axios from "axios";

export default function ChangePass({ patient, api }) {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmNewPass, setConfirmNewPass] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!oldPass || !newPass || !confirmNewPass) {
      setError("Please fill in all fields");
      return;
    }
    var uppercaseRegex = /[A-Z]/;
    var lowercaseRegex = /[a-z]/;
    var digitRegex = /[0-9]/;
    var specialCharRegex = /[~!@#$%^&*_+=`|(){}[\]:;"'<>,.?/-]/;
    if (newPass != confirmNewPass) {
      setError("Passwords do not match");
      return;
    }
    if (newPass.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (!uppercaseRegex.test(newPass)) {
      setError("Password must contain at least one uppercase letter");
      return;
    }
    if (!lowercaseRegex.test(newPass)) {
      setError("Password must contain at least one lowercase letter");
      return;
    }
    if (!digitRegex.test(newPass)) {
      setError("Password must contain at least one digit");
      return;
    }
    if (!specialCharRegex.test(newPass)) {
      setError("Password must contain at least one special character");
      return;
    }

    try {
      console.log("11");
      const url = api;
      const response = await axios.post(url, {
        currentPassword: oldPass,
        newPassword: newPass,
      });
      if (response.status === 200) {
        console.log("tmam");
      }
    } catch (error) {
      console.error("Error:", error);
      if (error.response && error.response.status === 409) {
        setError("Incorrect current password");
      } else {
        setError(
          "An error occurred while changing password. Please try again later."
        );
      }
    }
  };

  const formStyle = {
    fontSize: "1rem",
    marginLeft: "0rem",
    width: "16rem",
  };

  return (
    <div className="d-flex flex-column">
      <Form>
        <Form.Control
          className="m-3"
          style={formStyle}
          type="text"
          name="currPass"
          placeholder="Current Password"
          onChange={(e) => setOldPass(e.target.value)}
          required
        />
        <Form.Control
          className="m-3"
          style={formStyle}
          type="password"
          name="pass"
          placeholder="New Password"
          onChange={(e) => setNewPass(e.target.value)}
          required
        />
        <Form.Control
          className="m-3"
          style={formStyle}
          type="password"
          name="confirmPass"
          placeholder="Confirm Password"
          onChange={(e) => setConfirmNewPass(e.target.value)}
          required
        />

        <label
          onClick={handleSubmit}
          style={{
            cursor: "pointer",
            color: "#05afb9 ",
            fontWeight: "bold",
            fontSize: "0.9rem",
            marginLeft: patient ? "8rem" : "0px",
          }}
        >
          Save
        </label>
      </Form>
      {error && <div className="error">{error}</div>}
    </div>
  );
}
