import React, { useState } from "react";
import { Form, Button, Col } from "react-bootstrap";

function AddFamilyMemberForm({ onAddFamilyMember }) {
  const [formData, setFormData] = useState({
    name: "",
    nationalId: "",
    age: "",
    gender: "Male",
    relation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call a function to add the family member with formData
    onAddFamilyMember(formData);

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
        />
      </Form.Group>

      <Form.Group controlId="gender">
        <Form.Label>Gender</Form.Label>
        <Form.Control
          as="select"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          required
        >
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </Form.Control>
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
          <option>Daughter</option>
          <option>Son</option>
          <option>Daughter</option>
          <option>Other</option>
        </Form.Control>
      </Form.Group>

      <Button variant="primary" type="submit">
        Add Family Member
      </Button>
    </Form>
  );
}

export default AddFamilyMemberForm;
