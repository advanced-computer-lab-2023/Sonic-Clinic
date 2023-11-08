import axios from "axios";
import React, { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";
import { useSelector } from "react-redux";

function AddExistingFamilyMemberForm({ onRefresh, toggleForm }) {
  const [error1, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, isLoading] = useState(null);
  const id = useSelector((state) => state.patientLogin.userId);
  const [formData, setFormData] = useState({
    email: "",
    number: "",
    relation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleClick = async (e) => {
    e.preventDefault();
    setError(null);
    isLoading(true);

    if ((!formData.email && !formData.number) || !formData.relation) {
      setError(
        "Please fill in at least one of email or number, and ensure relation is provided."
      );
      isLoading(false);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const englishOnlyRegex = /^[\x00-\x7F]*$/;
    if (!emailRegex.test(formData.email)) {
      setError("Invalid email format.");
      isLoading(false);
      return;
    }
    if (!englishOnlyRegex.test(formData.email)) {
      setError("Email must be in English only.");
      isLoading(false);
      return;
    }
    if (formData.email.length > 320) {
      setError("Email exceeds maximum character limit (320).");
      isLoading(false);
      return;
    }
    if (/[^\x00-\x7F]/.test(formData.email)) {
      setError("Email cannot contain emojis or special characters.");
      isLoading(false);
      return;
    }
    if (/\s/.test(formData.email)) {
      setError("Email cannot contain spaces.");
      isLoading(false);
      return;
    } else {
      try {
        const response = await axios.post("/addFamilyMemberExisting", {
          email: formData.email,
          phoneNumber: formData.number,
          relationToPatient: formData.relation,
        });
        if (response.status === 200) {
          isLoading(false);
          onRefresh();
        } else {
          setError("Server Error");
          isLoading(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log(error.response);
          setError(error.response.data.error);
        } else {
          setError(
            "An error occurred while adding the family member. Please try again later."
          );
        }
        isLoading(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call a function to add the family member with formData

    // Clear the form fields
    setFormData({
      email: "",
      number: "",
      relation: "",
    });
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            name="email"
            value={formData.email}
            placeholder="JohnDoe@gmail.com"
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group controlId="number">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            name="number"
            placeholder="0506404491"
            value={formData.number}
            onChange={handleChange}
          />
        </Form.Group>
        <Form.Group controlId="relation">
          <Form.Label>Relation</Form.Label>
          <Form.Control
            as="select"
            name="relation"
            value={formData.relation}
            onChange={handleChange}
            required
          >
            <option>Husband</option>
            <option>Wife</option>
            <option>Child</option>
          </Form.Control>
        </Form.Group>
        <Button
          variant="primary"
          type="submit"
          style={{ marginTop: "1rem", width: "100%" }}
          onClick={handleClick}
        >
          Add Family Member
        </Button>
        <div
          className="form-comment align-items-center justify-content-center d-flex"
          style={{ cursor: "default" }}
        >
          Family Member is a{" "}
          <div
            className="text-decoration-none  link-decoration "
            style={{ cursor: "pointer", fontWeight: "600" }}
            onClick={toggleForm}
          >
            New User?
          </div>
        </div>
      </Form>
      {error1 && <div className="error">{error1}</div>}
    </>
  );
}

export default AddExistingFamilyMemberForm;
