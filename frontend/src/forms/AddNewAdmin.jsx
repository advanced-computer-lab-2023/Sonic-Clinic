import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";

export default function AddNewAdmin() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPass: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if(formData.username=="" || formData.password=="" || formData.confirmPass==""){
      setError("Please fill in all the required fields");
      console.log(error);
      return;
    }
    if(formData.password!==formData.confirmPass){
      setError("Passwords don't match");
      console.log(error);
      return;
    }
    const passwordRegex = /^(?=.*\d).{8,}$/;
    if(!passwordRegex.test(formData.password)){
      setError("Password should contain at least 8 characters and 1 number, try again");
      console.log(error);
      return;
    }
    createAdmin(formData);
    setFormData({
      username: "",
      password: "",
      confirmPass: "",
    });
  };

  const createAdmin = (formData) => {
    const username = formData.username;
    const password = formData.password;
    console.log("Creating admin ", username, " with pass ", password);
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <Form
        onSubmit={handleSubmit}
        className="d-flex justify-content-center align-items-center"
      >
        <Form.Control
          className="m-3"
          type="text"
          name="username"
          value={formData.username}
          placeholder="Enter username"
          onChange={handleChange}
        />
        <Form.Control
          className="m-3"
          type="password"
          name="pass"
          value={formData.password}
          placeholder="Enter password"
          onChange={handleChange}
          required
        />
        <Form.Control
          className="m-3"
          type="password"
          name="confirmPass"
          value={formData.confirmPass}
          placeholder="Confirm Password"
          onChange={handleChange}
          required
        />
        <Button type="submit" style={{ width: "200px", marginBottom: "20px" }}>
        Create
      </Button>
      </Form>
      
    </div>
  );
}
