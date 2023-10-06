import axios from "axios";
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setCredentials } from "../../state/loginPatientReducer";

import FormPassword from "../FormPassword";
import FormInput from "../FormInput";

const PatientSignupForm = () => {
  const [firstName, setFirstname] = useState("");
  const [lastName, setLastname] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [gender, setGender] = useState("");
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [error1, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, isLoading] = useState(null);
  const [agree, setAgree] = useState(false);
  const [okay, setOkay] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleLink = () => {
    setOpen(true);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setError(null);
    isLoading(true);

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !birthdate ||
      !gender ||
      !username ||
      !emergencyName ||
      !emergencyPhone ||
      !phoneNumber
    ) {
      setError("Please fill in all fields");
      console.log(error1);
      isLoading(false);
      return;
    }
    if (!username.trim()) {
      setError("Nationality is required.");
      isLoading(false);
      return;
    }
    //Validation For Email input field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const englishOnlyRegex = /^[\x00-\x7F]*$/;

    if (!email) {
      setError("Email field cannot be empty.");
      isLoading(false);
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      isLoading(false);
      return;
    }
    if (!englishOnlyRegex.test(email)) {
      setError("Email must be in English only.");
      isLoading(false);
      return;
    }
    if (email.length > 320) {
      setError("Email exceeds maximum character limit (320).");
      isLoading(false);
      return;
    }
    // } if (/\d/.test(email)) {
    //   setError("Email cannot contain numeric characters.");
    //   isLoading(false);
    //   return;
    if (/[^\x00-\x7F]/.test(email)) {
      setError("Email cannot contain emojis or special characters.");
      isLoading(false);
      return;
    }
    if (/\s/.test(email)) {
      setError("Email cannot contain spaces.");
      isLoading(false);
      return;
    }
    // Validation for Last Name
    const emojiRegex = /[\u{1F300}-\u{1F6FF}]/u;
    const numberRegex = /\d/;
    const symbolRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const languageRegex = /[^\x00-\x7F]/;
    const nameRegex = /^[^\s]+(\s[^\s]+)?$/;

    if ((lastName.length || firstName.length) < 2) {
      setError("name must be at least 2 characters.");
      isLoading(false);
      return;
    }
    if (emojiRegex.test(lastName) || emojiRegex.test(firstName)) {
      setError(" name cannot contain emojis.");
      isLoading(false);
      return;
    }
    if (numberRegex.test(lastName) || numberRegex.test(firstName)) {
      setError("name cannot contain numbers.");
      isLoading(false);
      return;
    }
    if (symbolRegex.test(lastName) || symbolRegex.test(firstName)) {
      setError(" name cannot contain symbols.");
      isLoading(false);
      return;
    }
    if (languageRegex.test(lastName) || languageRegex.test(firstName)) {
      setError("Last name cannot contain characters from multiple languages.");
      isLoading(false);
      return;
    }
    if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
      setError(
        "Name must contain either one name or two names with only one space between them."
      );
      isLoading(false);
      return;
    }

    //Validation for Password Field
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
      const user = {
        firstName,
        lastName,
        username,
        email,
        password,
        phoneNumber,
        birthdate,
        emergencyName,
        emergencyPhone,
      };
      dispatch(
        setCredentials({
          userName: username,
          firstName: firstName,
          lastName: lastName,
          userEmail: email,
          password: password,
          birthdate: birthdate,
          gender: gender,
          phoneNumber: phoneNumber,
          emergencyName: emergencyName,
          emergencyNumber: emergencyPhone,
          userId: "123",
        })
      );
      isLoading(false);
      navigate("/signup/email-verification");

      //   const config = {
      //     headers: {
      //       "Access-Control-Allow-Origin": "*",
      //       "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      //       "Content-Type": "application/json",
      //     },
      //   };
      //   try {
      //     isLoading(true);
      //     await axios
      //       .post(
      //         baseUrl + "/otp/signUp/generateOTP",
      //         {
      //           email: email,
      //         },
      //         config
      //       )
      //       .then((response) => {
      //         if (response.status !== 200) {
      //           console.log("Server error");
      //           console.log(response);
      //         } else {
      //           console.log(response);
      //           dispatch(
      //             setCredentials({
      //               birthdate: birthdate,
      //               password: password,
      //               userEmail: email,
      //               firstName: firstName,
      //               lastName: lastName,
      //               nationality: nationality,
      //               phoneNumber: phoneNumber,
      //             })
      //           );
      //           isLoading(false);
      //           navigate("/signup/email-verification");
      //         }
      //       })
      //       .catch((error) => {
      //         console.error("Error:", error);
      //         if (error.response) {
      //           setMessage(null);
      //           setOkay(false);
      //           if (error.response.status === 400) {
      //             console.log(email);
      //             console.log("Authentication error");
      //           }
      //         }
      //       });
      //   } catch (error) {
      //     setMessage(null);
      //     setOkay(false);
      //     console.log(error);
      //   }
    }
  };
  const checkboxHandler = () => {
    setAgree(!agree);
  };

  return (
    <div className="col-9 form-container">
      <div className="form-title">Hello!</div>
      <div className="form-title">SignUp to Get Started</div>
      <form className="rounded-3" onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <FormInput
                name="First Name"
                type="text"
                placeholder="Elina"
                onChange={(e) => setFirstname(e.target.value)}
                value={firstName}
              />
            </div>
          </div>
          <div className="col">
            <FormInput
              name="Last Name"
              type="text"
              placeholder="John"
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <FormInput
              name="Birthdate"
              type="date"
              onChange={(e) => setBirthdate(e.target.value)}
            />
          </div>
          <div className="col">
            <FormInput
              name="Username"
              placeholder="ElinaJohn1"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <FormInput
              name="Phone Number"
              type="text"
              placeholder="0506404491"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
          <div className="col">
            <FormInput
              name="Gender"
              placeholder="Male"
              type="select"
              onChange={(e) => setGender(e.target.value)}
            />
          </div>
        </div>

        <FormInput
          name="email"
          type="email"
          placeholder="john.doe@ibm.com"
          onChange={
            (e) => setEmail(e.target.value)
            // validateEmail();
          }
        />
        <FormPassword
          id="password"
          name="password"
          type="password"
          placeholder="**************"
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormPassword
          name="confirmPassword"
          type="password"
          placeholder="**************"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <div className="row">
          <div className="col">
            <FormInput
              name="Emergency Name"
              type="text"
              placeholder="John Doe"
              onChange={(e) => setEmergencyName(e.target.value)}
            />
          </div>
          <div className="col">
            <FormInput
              name=" Emergency Phone Number"
              type="text"
              placeholder="0506404491"
              onChange={(e) => setEmergencyPhone(e.target.value)}
            />
          </div>
        </div>

        <button
          id="nextbtn"
          className="w-100 btn-sm custom-button"
          onClick={handleClick}
        >
          Next
        </button>
        <div className="form-comment" style={{ cursor: "default" }}>
          Have an account?{" "}
          <div
            className="text-decoration-none link-decoration"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Login
          </div>
        </div>
        {error1 && <div className="error">{error1}</div>}
      </form>
    </div>
  );
};

export default PatientSignupForm;
