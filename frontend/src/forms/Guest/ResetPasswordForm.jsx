import axios from "axios";
import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormPassword from "../FormPassword";
import "../forms.css";
import { useSelector } from "react-redux";

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error1, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, isLoading] = useState(null);
  const navigate = useNavigate();
  const email = useSelector((state) => state.forgotEmail.email);

  //   const userEmail = useSelector((state) => state.login.userEmail);

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setError(null);
    isLoading(true);

    if (!password || !confirmPassword) {
      setError("Please enter all fields");
      isLoading(false);
      return;
    }
    var uppercaseRegex = /[A-Z]/;
    var lowercaseRegex = /[a-z]/;
    var digitRegex = /[0-9]/;
    var specialCharRegex = /[~!@#$%^&*_+=`|(){}[\]:;"'<>,.?/-]/;

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      isLoading(false);
      return;
    }

    if (!uppercaseRegex.test(password)) {
      setError("Password must contain at least one uppercase letter");
      isLoading(false);
      return;
    }

    if (!lowercaseRegex.test(password)) {
      setError("Password must contain at least one lowercase letter");
      isLoading(false);
      return;
    }

    if (!digitRegex.test(password)) {
      setError("Password must contain at least one digit");
      isLoading(false);
      return;
    }

    if (!specialCharRegex.test(password)) {
      setError("Password must contain at least one special character");
      isLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      isLoading(false);
      return;
    } else {
      try {
        isLoading(true);
        await axios
          .post("/changePasswordForPatientForget", {
            email: email,
            newPassword: password,
          })
          .then((response) => {
            if (response.status !== 200) {
              setError("Incorrect Code");
            } else {
              navigate("/forgot-password/password-changed");
              isLoading(false);
            }
          })
          .catch((error) => {
            isLoading(false);
            setError("Error"); // change error msg
          });
      } catch (error) {
        setError(error); // change error msg
      }
    }
  };

  return (
    <div className="col-9 form-container">
      <div
        className="form-title"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontWeight: 600,
          fontSize: "2rem",
        }}
      >
        Create New Password
      </div>
      <h6 className="description" style={{ fontSize: "14px", color: "gray" }}>
        Your new password must be unique from those previously used.
      </h6>
      <form className="rounded-3" onSubmit={handleSubmit}>
        <FormPassword
          name="Enter a password"
          type="password"
          placeholder="**************"
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormPassword
          name="Confirm password"
          type="password"
          placeholder="**************"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button
          className="w-100 btn-sm custom-button"
          type="submit"
          onClick={handleClick}
        >
          Confirm
        </button>
        {error1 && <div className="error">{error1}</div>}
      </form>
    </div>
  );
};
export default ResetPasswordForm;
