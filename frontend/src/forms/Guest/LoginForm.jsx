import axios from "axios";
import * as React from "react";
import { useState } from "react";
import { Col, Container, Form, Row, Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import FormPassword from "../FormPassword";
import FormInput from "../FormInput";
import contract from "../../Assets/EmploymentContract.pdf";
import { setCredentials } from "../../state/loginPatientReducer";
import { baseUrl } from "../../state/baseUrl";
import { setCredentialsPatient } from "../../state/loginPatientReducer";
import { setCredentialsAdmin } from "../../state/loginAdminReducer";
import { setCredentialsDoctor } from "../../state/loginDoctorReducer";

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error1, setError] = useState(null);
  const [loading, isLoading] = useState(null);
  const [agree, setAgree] = useState(false);
  const [okay, setOkay] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);

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
              wallet: 0,
              family: user.familyMembers,
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
              email: user.email,
              name: user.name,
              hourlyRate: user.hourlyRate,
              affiliation: user.affiliation,
              educationalBackground: user.educationalBackground,
              patients: user.patients,
              speciality: user.specialty,
              userId: user._id,
              wallet: 0,
              isLoggedIn: true,
            })
          );
          if (!user.contract) {
            setShowAcceptModal(true);
          } else {
            navigate("/doctor");
          }
          isLoading(false);
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

  const loginNewDoctor = async (e) => {
    e.preventDefault();
    setError(null);
    isLoading(true);
    try {
      const response = await axios.get("/acceptContract");
      if (response.status === 200) {
        setShowAcceptModal(false);
        navigate("/doctor");
      }
    } catch (error) {
      setError(error);
    }
    isLoading(false);
  };

  const rejectContract = async () => {
    try {
      const response = await axios.get("/logout");
      if (response.status === 200) {
        console.log("LOGOUT");
      }
    } catch (error) {
      console.log();
    }
    setShowAcceptModal(false);
    setError(
      "Unfortunately, you cannot join the platform without accepting the contract"
    );
  };

  return (
    <div className="col-9 form-container">
      <div className="form-title">Welcome Back!</div>
      <Modal show={showAcceptModal} onHide={() => setShowAcceptModal(false)}>
        <Modal.Header>
          <Modal.Title>Employment Contract</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <object
            data={contract}
            type="application/pdf"
            width="100%"
            height="500"
          >
            PDF Viewer is not supported in this browser.
          </object>
        </Modal.Body>
        <Modal.Footer className="d-flex align-items-center justify-content-center">
          <Button variant="success" onClick={loginNewDoctor}>
            Accept
          </Button>
          <Button variant="danger" onClick={rejectContract}>
            Reject
          </Button>
        </Modal.Footer>
      </Modal>
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
          <div
            className="forgot-password text-decoration-none"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/forgot-password")}
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
        {/* <div className="form-comment" style={{ cursor: "default" }}>
          Don't have an account?{" "}
          <div
            className="text-decoration-none  link-decoration "
            style={{ cursor: "pointer" }}
            onClick={() => navigate("signup")}
          >
            Sign Up
          </div>
        </div> */}
        {error1 && <div className="error">{error1}</div>}
      </Form>
    </div>
  );
};
export default LoginForm;
