import axios from "axios";
import * as React from "react";
import { useState, useEffect } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import FormPassword from "../FormPassword";
import FormInput from "../FormInput";
import { setCredentials } from "../../state/loginPatientReducer";
import { baseUrl } from "../../state/baseUrl";
import { setCredentialsPatient } from "../../state/loginPatientReducer";
import { setCredentialsAdmin } from "../../state/loginAdminReducer";
import { setCredentialsDoctor } from "../../state/loginDoctorReducer";

const LoginForm = () => {
  // console.log(baseUrl);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error1, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, isLoading] = useState(null);
  const [agree, setAgree] = useState(false);
  const [okay, setOkay] = useState(false);
  const [open, setOpen] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setError(null);
    isLoading(true);

    if (!username || !password) {
      setError("Please fill in all the required fields");
      isLoading(false);
      return;
    }

    try {
      const response = await axios.post("/login", {
        username: username,
        password: password,
      });

      if (response.status === 200) {
        const user = response.data.user;
        const type = response.data.message;

        if (type === "Patient") {
          dispatch(
            setCredentialsPatient({
              password: password,
              userName: username,
              birthdate: user.dateOfBirth,
              userEmail: user.email,
              name: user.name,
              packages: user.package,
              gender: user.gender,
              phoneNumber: user.mobileNumber,
              userId: user._id,
              emergencyName: user.emergencyFullName,
              emergencyNumber: user.emergencyMobileNumber,
              isLoggedIn: true,
            })
          );

          isLoading(false);
          navigate("/patient");
        }
        if (type === "Doctor") {
          dispatch(
            setCredentialsDoctor({
              password: password,
              userName: username,
              birthdate: user.dateOfBirth,
              userEmail: user.email,
              name: user.name,
              hourlyRate: user.hourlyRate,
              affiliation: user.affiliation,
              education: user.educationalBackground,
              patients: user.patients,
              speciality: user.speciality,
              userId: user._id,
              isLoggedIn: true,
            })
          );

          isLoading(false);
          navigate("/doctor");
        }
        if (type === "Admin") {
          dispatch(
            setCredentialsAdmin({
              password: password,
              userName: username,
              userId: user._id,
            })
          );

          navigate("/admin");
          isLoading(false);
        }
      } else {
        console.error("Login failed:", response.data);
        setError("Login failed");
        isLoading(false);
      }
    } catch (error) {
      console.error("Error:", error);

      if (error.response && error.response.status === 401) {
        console.log("Authentication error");
        setError("Invalid Credentials");
      } else if (error.response && error.response.status === 500) {
        setError("Server Error");
      } else {
        setError("An error occurred while logging in. Please try again later.");
      }

      isLoading(false);
    }
  };

  return (
    <div className="col-9 form-container">
      <div className="form-title">Welcome Back!</div>
      <Form className="rounded-3" onSubmit={handleSubmit}>
        <FormInput
          name="Username"
          type="text"
          placeholder="john.doe"
          onChange={(e) => setUsername(e.target.value)}
        />
        <FormPassword
          name="Password"
          type="password"
          placeholder="**************"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Container className="forgot-password-container">
          {/* <div className="form-comment"> */}
          <div
            className="forgot-password text-decoration-none"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("forgot-password")}
          >
            Forgot Password?
          </div>
        </Container>
        <button
          className="w-100 btn-sm custom-button"
          disabled={loading}
          onClick={handleClick}
          style={{ cursor: "pointer" }}
        >
          Login
        </button>
        <div className="form-comment" style={{ cursor: "default" }}>
          Don't have an account?{" "}
          <div
            className="text-decoration-none  link-decoration "
            style={{ cursor: "pointer" }}
            onClick={() => navigate("signup")}
          >
            Sign Up
          </div>
        </div>
        {error1 && (
          <div
            style={{
              marginTop: "2rem",
              backgroundColor: "#f44336", // Red background color
              color: "white", // White text color
              padding: "10px", // Padding around the message
              borderRadius: "5px", // Rounded corners
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)", // Box shadow for a subtle effect
            }}
          >
            {error1}
          </div>
        )}
      </Form>
    </div>
  );
};
export default LoginForm;
