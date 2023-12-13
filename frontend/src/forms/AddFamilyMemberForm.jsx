import axios from "axios";
import React, { useState } from "react";
import { Form, Button, Col, Dropdown } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addFamilyMemberState } from "../state/loginPatientReducer";

function AddFamilyMemberForm({ onRefresh, toggleForm }) {
  const [error1, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [loading, isLoading] = useState(null);
  const id = useSelector((state) => state.patientLogin.userId);
  const handleClickAlreadyUser = async (e) => {};
  const [formData, setFormData] = useState({
    name: "",
    nationalId: "",
    age: "",
    gender: "Male",
    relation: "Husband",
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    // Check if e.target is available (for regular form elements)
    if (e.target) {
      const { name, value } = e.target;
      setFormData({
        ...formData,
        [name]: value,
      });
    } else {
      // For the Dropdown, manually set the name
      setFormData({
        ...formData,
        relation: e, // Assuming 'e' is the selected value from the Dropdown
      });
    }
  };
  const handleClick = async (e) => {
    e.preventDefault();
    setError(null);
    isLoading(true);

    if (
      !formData.name ||
      !formData.nationalId ||
      !formData.age ||
      !formData.gender ||
      !formData.relation
    ) {
      setError("Please fill in all fields");
      console.log(error1);
      isLoading(false);
      return;
    }

    const emojiRegex = /[\u{1F300}-\u{1F6FF}]/u;
    const numberRegex = /\d/;
    const symbolRegex = /[!@#$%^&*(),.?":{}|<>]/;
    const languageRegex = /[^\x00-\x7F]/;
    const nameRegex = /^[^\s]+(\s[^\s]+)?$/;

    if (formData.name.length < 2) {
      setError("name must be at least 2 characters.");
      isLoading(false);
      return;
    }
    if (emojiRegex.test(formData.name)) {
      setError(" name cannot contain emojis.");
      isLoading(false);
      return;
    }
    if (numberRegex.test(formData.name)) {
      setError("name cannot contain numbers.");
      isLoading(false);
      return;
    }
    if (symbolRegex.test(formData.name)) {
      setError(" name cannot contain symbols.");
      isLoading(false);
      return;
    }
    if (languageRegex.test(formData.name)) {
      setError("Last name cannot contain characters from multiple languages.");
      isLoading(false);
      return;
    }
    if (!nameRegex.test(formData.name)) {
      setError(
        "Name must contain either one name or two names with only one space between them."
      );
      isLoading(false);
      return;
    } else {
      try {
        const response = await axios.post("/addFamilyMember", {
          name: formData.name,
          nationalID: formData.nationalId,
          age: formData.age,
          gender: formData.gender,
          relationToPatient: formData.relation,
        });

        if (response.status === 200) {
          isLoading(false);
          onRefresh();
          setFormData({
            name: "",
            nationalId: "",
            age: "",
            gender: "Male",
            relation: "Husband",
          });
          dispatch(
            addFamilyMemberState({
              family: [response.data._id, response.data.name],
            })
          );
        } else {
          setError("Signup failed");
          isLoading(false);
        }
      } catch (error) {
        console.error("Error:", error);

        if (error.response && error.response.status === 409) {
          setError("Username taken!");
        } else if (error.response && error.response.status !== 200) {
          setError("Signup failed");
        } else {
          setError(
            "An error occurred while signing up. Please try again later."
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
      name: "",
      nationalId: "",
      age: "",
      gender: "Male",
      relation: "",
    });
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            placeholder="John Doe"
            onChange={handleChange}
            required
            style={{ marginBottom: "0.5rem" }}
          />
        </Form.Group>

        <Form.Group controlId="nationalId">
          <Form.Label>National ID</Form.Label>
          <Form.Control
            type="text"
            name="nationalId"
            placeholder="Enter 16 digit number"
            value={formData.nationalId}
            onChange={handleChange}
            maxLength="16"
            minLength="16"
            required
            style={{ marginBottom: "0.5rem" }}
          />
        </Form.Group>

        <Form.Group controlId="age">
          <Form.Label>Age</Form.Label>
          <Form.Control
            type="number"
            name="age"
            placeholder="13"
            value={formData.age}
            onChange={handleChange}
            required
            style={{ marginBottom: "0.5rem" }}
          />
        </Form.Group>

        <Form.Group controlId="relation">
          <Form.Label>Gender</Form.Label>
          <Dropdown onSelect={handleChange} style={{ marginBottom: "0.5rem" }}>
            <Dropdown.Toggle
              className="custom-dropdown-toggle"
              id="dropdown-relation"
            >
              {formData.gender || "Select Gender"}
            </Dropdown.Toggle>

            <Dropdown.Menu className="w-100">
              <Dropdown.Item eventKey="Male">Male</Dropdown.Item>
              <Dropdown.Item eventKey="Female">Female</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Form.Group>

        <Form.Group controlId="relation">
          <Form.Label>Relation</Form.Label>
          <Dropdown onSelect={handleChange} style={{ marginBottom: "0.5rem" }}>
            <Dropdown.Toggle
              className="custom-dropdown-toggle"
              id="dropdown-relation"
            >
              {formData.relation || "Select Relation"}
            </Dropdown.Toggle>

            <Dropdown.Menu className="w-100">
              <Dropdown.Item eventKey="Husband">Husband</Dropdown.Item>
              <Dropdown.Item eventKey="Wife">Wife</Dropdown.Item>
              <Dropdown.Item eventKey="Child">Child</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
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
          className="form-comment"
          style={{ cursor: "default", marginLeft: "14.5rem" }}
        >
          Family member is{" "}
          <div
            className="text-decoration-none  link-decoration "
            style={{ cursor: "pointer", fontWeight: "600" }}
            onClick={toggleForm}
          >
            already a user?
          </div>
        </div>
      </Form>
      {error1 && <div className="error">{error1}</div>}
    </>
  );
}

export default AddFamilyMemberForm;
