import axios from "axios";
import * as React from "react";
import { useState, useEffect } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import FormPassword from "../FormPassword";
import FormInput from "./FormInput";
import { setCredentials } from "../../state/loginPatientReducer";

const LoginForm = () => {
  // console.log(baseUrl);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
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
    if (!email || !password) {
      setError("Please fill in all the required fields");
      isLoading(false);
      return;
    }
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!email.match(emailRegex)) {
      setError("Invalid email format.");
      console.log(error1);
      isLoading(false);
      return;
    }
    dispatch(
      setCredentials({
        token: "1234",
        password: password,
        birthdate: "18/05/2002",
        userEmail: email,
        firstName: "Youssef",
        lastName: "Bassem",
        gender: "Male",
        phoneNumber: "01018874155",
        userId: "1",
        emergencyName: "bbb",
        emergencyNumber: "2222",
        isLoggedIn: true,
      })
    );
    isLoading(false);
    navigate("/patient");
    // const config = {
    //   headers: {
    //     "Access-Control-Allow-Origin": "*",
    //     "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    //   },
    // };

    // try {
    //   isLoading(true);
    //   await axios
    //     .post(
    //       baseUrl + "/auth/login",
    //       {
    //         email: email,
    //         password: password,
    //       },
    //       config
    //     )
    //     .then((response) => {
    //       if (response.status !== 200) {
    //         console.log("Authentication failed");
    //         console.log(response);
    //       } else {
    //         console.log("Headers: " + response.headers);
    //         console.log(response);
    //         const user = response.data.user;
    //         const token = response.data.token;
    //         console.log("User");
    //         console.log(user);
    //         dispatch(
    //           setCredentials({
    //             userEmail: email,
    //             token: token,
    //             firstName: user.firstName,
    //             lastName: user.lastName,
    //             nationality: user.nationality,
    //             userId: user.userId,
    //             phoneNumber: user.phoneNumber,
    //             isLoggedIn: true,
    //           })
    //         );
    //         isLoading(false);
    //         navigate("/home");
    //       }
    //     })
    //     .catch((error) => {
    //       console.error("Error:", error);
    //       if (error.response) {
    //         if (error.response.status === 400) {
    //           console.log("Authentication error");
    //         }
    //       }
    //     });
    // } catch (error) {
    //   console.log(error);
    // }
  };

  return (
    <div className="col-9 form-container">
      <div className="form-title">Welcome Back!</div>
      <Form className="rounded-3" onSubmit={handleSubmit}>
        <FormInput
          name="Email Address"
          type="email"
          placeholder="john.doe@ibm.com"
          onChange={(e) => setEmail(e.target.value)}
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
