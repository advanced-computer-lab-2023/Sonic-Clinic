import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";
import axios from "axios";

export default function AddNewAdmin() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (username == "" || password == "" || confirmPassword == "") {
      setError("Please fill in all the required fields");
      console.log(error);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      console.log(error);
      return;
    }
    const passwordRegex = /^(?=.*\d).{8,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "Password should contain at least 8 characters including minimum 1 number. Try again"
      );
      console.log(error);
      return;
    }

    try {
      const response = await axios.post("/addAdmin", {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        setSuccess(true);
      } else if (response.status === 409) {
        setError("Admin with this username already exists");
      } else {
        setError("Signup failed");
      }
    } catch (error) {
      setSuccess(false);
      if (error.response && error.response.status === 409) {
        setError("Username taken!");
      } else {
        setError(
          "An error occurred while adding admin. Please try again later"
        );
      }
    }
    setUsername("");
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <Form
        onSubmit={handleSubmit}
        className="d-flex justify-content-center align-items-center"
      >
        <Form.Control
          className="m-3"
          type="text"
          name="username"
          placeholder="Enter username"
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Form.Control
          className="m-3"
          type="password"
          name="pass"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Form.Control
          className="m-3"
          type="password"
          name="confirmPass"
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit" style={{ width: "200px", margin: "20px" }}>
          Create
        </Button>
      </Form>
      {error && (
        <div
          className="d-flex justify-content-center"
          style={{
            marginTop: "0.5rem",
            marginBottom: "0.5rem",
            fontSize: "0.85rem",
            backgroundColor: "#f44336", // Red background color
            color: "white", // White text color
            padding: "10px", // Padding around the message
            borderRadius: "5px", // Rounded corners
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)", // Box shadow for a subtle effect
          }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          className="d-flex justify-content-center"
          style={{
            marginTop: "0.5rem",
            marginBottom: "0.5rem",
            fontSize: "0.85rem",
            backgroundColor: "#099BA0 ",
            color: "white", // White text color
            padding: "10px", // Padding around the message
            borderRadius: "5px", // Rounded corners
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)", // Box shadow for a subtle effect
          }}
        >
          Admin added successfully!
        </div>
      )}
    </div>
  );
}
