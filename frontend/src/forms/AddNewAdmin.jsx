import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { Button, Col } from "react-bootstrap";
import axios from "axios";

export default function AddNewAdmin({ fetchData, closeForm }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (
      username == "" ||
      password == "" ||
      confirmPassword == "" ||
      email == "" ||
      name == ""
    ) {
      setError("Please fill in all the required fields");
      console.log(error);
      return;
    }

    var uppercaseRegex = /[A-Z]/;
    var lowercaseRegex = /[a-z]/;
    var digitRegex = /[0-9]/;
    var specialCharRegex = /[~!@#$%^&*_+=`|(){}[\]:;"'<>,.?/-]/;

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    if (!uppercaseRegex.test(password)) {
      setError("Password must contain at least one uppercase letter");
      return;
    }

    if (!lowercaseRegex.test(password)) {
      setError("Password must contain at least one lowercase letter");
      return;
    }

    if (!digitRegex.test(password)) {
      setError("Password must contain at least one digit");
      return;
    }

    if (!specialCharRegex.test(password)) {
      setError("Password must contain at least one special character");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const englishOnlyRegex = /^[\x00-\x7F]*$/;

    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return;
    }

    if (!englishOnlyRegex.test(email)) {
      setError("Email must be in English only.");
      return;
    }

    try {
      const response = await axios.post("/addAdmin", {
        username: username,
        password: password,
        email: email,
        name: name,
      });

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false); // Clear the error after 5 seconds
        }, 5000);
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setEmail("");
        setName("");
        closeForm();
        fetchData();
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
    setTimeout(() => {
      setError(null); // Clear the error after 5 seconds
    }, 5000);
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <Form
        onSubmit={handleSubmit}
        className="d-flex justify-content-center align-items-center"
        style={{ width: "48rem", marginBottom: "2rem" }}
      >
        <Col lg={5}>
          {" "}
          <Form.Control
            style={{
              width: "15rem",
              marginRight: "0.5rem",
            }}
            type="text"
            name="username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </Col>
        <Col lg={5}>
          <Form.Control
            style={{
              width: "15rem",
              marginRight: "0.5rem",
              marginBottom: "1rem",
            }}
            type="text"
            name="name"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Form.Control
            style={{ width: "15rem", marginRight: "0.5rem" }}
            type="email"
            name="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Col>

        <Col lg={5}>
          <Form.Control
            style={{
              width: "15rem",
              marginRight: "0.5rem",
              marginBottom: "1rem",
            }}
            type="password"
            name="pass"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Form.Control
            style={{ width: "15rem", marginRight: "0.5rem" }}
            type="password"
            name="confirmPass"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Col>

        <Button type="submit" style={{ width: "8rem" }}>
          Create
        </Button>
      </Form>
      {error && <div className="error">{error}</div>}
      {success && <div className="msg">Admin added successfully!</div>}
    </div>
  );
}
