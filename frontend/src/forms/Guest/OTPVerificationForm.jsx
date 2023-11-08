import axios from "axios";
import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../FormInput";
import "../forms.css";
import { useSelector } from "react-redux";

const OTPVerificationForm = () => {
  const [code, setCode] = useState(""); //change naming to OTP code
  const [error1, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, isLoading] = useState(null);
  const navigate = useNavigate();

  //   const userEmail = useSelector((state) => state.login.userEmail);

  //   const config = {
  //     headers: {
  //       'Access-Control-Allow-Origin': '*',
  //       'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  //       'Content-Type': 'application/json',
  //     },
  //   };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const handleClick = async (e) => {
    try {
      isLoading(true);
      await axios
        .post("/verifyOtp", {
          inputNumber: code,
        })
        .then((response) => {
          if (response.status !== 200) {
            setError("Incorrect Code");
          } else {
            navigate("/forgot-password/reset-password/");
            isLoading(false);
          }
        })
        .catch((error) => {
          isLoading(false);
          setError("Incorrect Code"); // change error msg
        });
    } catch (error) {
      setError(error); // change error msg
    }
  };

  return (
    <div className="col-9 form-container">
      <h1 className="form-title">OTP Verification</h1>
      <h6 className="description" style={{ fontSize: "14px", color: "gray" }}>
        Enter the verification code that has been sent to your email address.
      </h6>
      <form className="rounded-3">
        <FormInput
          name="Enter Code"
          type="numeric"
          placeholder="7789BM6X"
          onChange={(e) => setCode(e.target.value)}
        />

        <button
          disabled={loading}
          className="w-100 btn-sm custom-button"
          type="submit"
          onClick={handleClick}
        >
          Verify
        </button>
        {/* <div className="form-comment" style={{ cursor: "default" }}>
          Didn't get code?{" "}
          <div
            className="text-decoration-none  link-decoration "
            style={{ cursor: "pointer", fontWeight: "600" }}
            onClick={handleClickResend}
          >
            Resend
          </div>
        </div> */}
        {message && <div className="form-comment">{message}</div>}
        {error1 && <div className="error">{error1}</div>}
      </form>
    </div>
  );
};
export default OTPVerificationForm;
