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
    gender: "",
    relation: "",
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
    } else if (e === "Male" || e === "Female") {
      // Assuming 'e' represents the selected value from the Gender Dropdown
      setFormData({
        ...formData,
        gender: e,
      });
    } else if (e === "Husband" || e === "Wife" || e === "Child") {
      // Assuming 'e' represents the selected value from the Relation Dropdown
      setFormData({
        ...formData,
        relation: e,
      });
    }
  };

  const genderRelationOptions = {
    Male: ["Husband", "Child"],
    Female: ["Wife", "Child"],
  };
  const handleGenderChange = (selectedGender) => {
    // Update the gender in the form data
    setFormData({
      ...formData,
      gender: selectedGender,
      // Set the relation to the first option of the selected gender
      relation: genderRelationOptions[selectedGender][0] || "",
    });
  };

  const handleRelationChange = (selectedRelation) => {
    // Update the relation in the form data
    setFormData({
      ...formData,
      relation: selectedRelation,
    });
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
        }
      } catch (error) {
        setError(error.response.data.error);
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

        <Form.Group controlId="gender">
          <Form.Label>Gender</Form.Label>
          <Dropdown
            onSelect={handleGenderChange}
            style={{ marginBottom: "0.5rem" }}
          >
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
          <Dropdown
            onSelect={handleRelationChange}
            style={{ marginBottom: "0.5rem" }}
          >
            <Dropdown.Toggle
              className="custom-dropdown-toggle"
              id="dropdown-relation"
            >
              {formData.relation || "Select Relation"}
            </Dropdown.Toggle>

            <Dropdown.Menu className="w-100">
              {genderRelationOptions[formData.gender] &&
                genderRelationOptions[formData.gender].map((option) => (
                  <Dropdown.Item key={option} eventKey={option}>
                    {option}
                  </Dropdown.Item>
                ))}
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
