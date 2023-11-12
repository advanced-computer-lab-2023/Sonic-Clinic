import axios from "axios";
import * as React from "react";
import { useState } from "react";
import FormPassword from "../FormPassword";
import FormInput from "../FormInput";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setForgotEmail } from "../../state/forgotEmail";
import "../forms.css";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [error1, setError] = useState(null);
  const [loading, isLoading] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setError(null);
    isLoading(true);
    if (!email) {
      setError("Please fill in your email");
      isLoading(false);
      return;
    }
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!email.match(emailRegex)) {
      setError("Invalid email format.");
      isLoading(false);
      console.log(error1);
      return;
    } else {
      try {
        isLoading(true);
        await axios
          .post("/otp", {
            email: email,
          })
          .then((response) => {
            if (response.status !== 200) {
              setError("Incorrect Email");
            } else {
              dispatch(
                setForgotEmail({
                  email: email,
                })
              );
              navigate("/forgot-password/otp-verification");
              isLoading(false);
            }
          })
          .catch((error) => {
            isLoading(false);
            setError("Incorrect Email"); // change error msg
          });
      } catch (error) {
        setError(error); // change error msg
      }
    }
  };

  return (
    <div className="col-9 form-container">
      <h1 className="form-title">Forgot Password!</h1>
      <h6 className="description" style={{ fontSize: "14px", color: "gray" }}>
        Don't worry! It occurs. Please enter the email address linked with your
        account.
      </h6>

      <form className="rounded-3" onSubmit={handleSubmit}>
        <FormInput
          name="Email"
          type="email"
          placeholder="john.doe@ibm.com"
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          disabled={loading}
          className="w-100 btn-sm custom-button"
          type="submit"
          onClick={handleClick}
        >
          Next
        </button>
        {error1 && <div className="error">{error1}</div>}
      </form>
    </div>
  );
};
export default ForgotPasswordForm;
