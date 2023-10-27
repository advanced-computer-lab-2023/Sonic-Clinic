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
    console.log("code" + code); //remove
    e.preventDefault();
    setError(null);
    isLoading(true);
    if (!code) {
      setError("Please enter the OTP");
      isLoading(false);
      return;
    }

    const otpRegex = /^[A-Z0-9]+$/i;
    if (!code.match(otpRegex)) {
      setError("Invalid OTP.");
      console.log(error1);
      isLoading(false);
      return;
    }

    if (code.length != 6) {
      setError("Invalid OTP.");
      isLoading(false);
      return;
    } else {
      //   const data = { otp: code, email: userEmail, type: 'forgetPassword' };
      //   try {
      //     isLoading(true);
      //     await axios
      //       .post(baseUrl + '/otp/confirmOTP', data, config)
      //       .then((response) => {
      //         if (response.status !== 200) {
      //           setError('Server Error'); //change : nzabat el error msgs
      //           console.log('Server error'); //remove
      //           console.log(response); //remove
      //         } else {
      //           console.log('OTP tmam'); //remove
      //           console.log(response); //remove
      //           isLoading(false);
      //           navigate('/forgot-password/reset-password');
      //         }
      //       })
      //       .catch((error) => {
      //         console.error('Error:', error); //remove
      //         setError("There's an error");
      //         if (error.response) {
      //           setMessage(null); // change : eh lazmetha?
      //           if (error.response.status === 400) {
      //             // console.log(userEmail);
      //             setError('Authentication error'); //change
      //             console.log('Authentication error'); //remove
      //           }
      //         }
      //       });
      //   } catch (error) {
      //     // setMessage("An error occurred");
      //     setError(error); //change error msg
      //     // setOkay(false);
      //     console.log(error); //remove
      //   }

      navigate("/forgot-password/reset-password");
    }
  };

  const handleClickResend = async (e) => {
    //   try {
    //     isLoading(true);
    //     setError(null);
    //     await axios
    //       .post(
    //         baseUrl + '/otp/forgetPassword/generateOTP', // forgetPassword wala signup?
    //         {
    //           email: userEmail,
    //         },
    //         config,
    //       )
    //       .then((response) => {
    //         setMessage('An OTP code has been sent to your email');
    //         isLoading(false);
    //       })
    //       .catch((error) => {
    //         setError("There's an error"); //remove
    //         if (error.response) {
    //           if (error.response.status === 400) {
    //             setError('Authentication Error'); //change
    //           }
    //         }
    //       });
    //   } catch (error) {
    //     console.log('error mn el awel'); //remove
    //     setError(error); //change
    //   }
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
        <div className="form-comment" style={{ cursor: "default" }}>
          Didn't get code?{" "}
          <div
            className="text-decoration-none  link-decoration "
            style={{ cursor: "pointer", fontWeight: "600" }}
            onClick={handleClickResend}
          >
            Resend
          </div>
        </div>
        {message && <div className="form-comment">{message}</div>}
        {error1 && <div className="error">{error1}</div>}
      </form>
    </div>
  );
};
export default OTPVerificationForm;
