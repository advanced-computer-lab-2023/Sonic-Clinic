import axios from "axios";
import * as React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormPassword from "../FormPassword";
import "../forms.css";
import { useDispatch, useSelector } from "react-redux";

const ResetPasswordForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error1, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, isLoading] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      const config = {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
          "Content-Type": "application/json",
        },
      };

      //   try {
      //     isLoading(true);
      //     console.log(userEmail, password);
      //     await axios
      //       .put(
      //         baseUrl + '/identity/changePassword',
      //         {
      //           email: userEmail,
      //           newPassword: password,
      //         },
      //         config,
      //       )
      //       .then((response) => {
      //         if (response.status !== 200) {
      //           setError('Authentication Failed');
      //           console.log('Authentication failed'); // remove
      //           console.log(response); // remove
      //         } else {
      //           console.log('Response: '); // remove
      //           console.log(response); // remove
      //           dispatch(
      //             setCredentials({
      //               password: password,
      //             }),
      //           );
      //           isLoading(false);
      //           navigate('/forgot-password/password-changed');
      //         }
      //       })
      //       .catch((error) => {
      //         console.error('Error:', error); // remove
      //         setError("There's an error"); // change error msg
      //         if (error.response) {
      //           if (error.response.status === 400) {
      //             setError('Authentication error'); // change error msg
      //             console.log('Authentication error'); // remove
      //           }
      //         }
      //       });
      //   } catch (error) {
      //     setError(error); // change error msg
      //     console.log(error); // remove
      //   }
      navigate("/forgot-password/password-changed");
    }
  };

  return (
    <div className="col-9 form-container">
      <h1 className="form-title">Create New Password</h1>
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
