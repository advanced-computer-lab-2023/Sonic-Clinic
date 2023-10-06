import React from "react";
import Form from "react-bootstrap/Form";
import { Button } from "react-bootstrap";

export default function AddNewAdmin() {

    const createAdmin = (username, password, confirmPassword) => {
        console.log('Creating admin with info:', username, ' ', password, ' ', confirmPassword);
      };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center">
      <Form className="d-flex justify-content-center align-items-center">
        <Form.Control
          className="m-3"
          controlId="newAdminUsername"
          type="text"
          placeholder="Enter username"
        />
        <Form.Control
          className="m-3"
          controlId="newAdminPassword"
          type="text"
          placeholder="Enter password"
        />
        <Form.Control
          className="m-3"
          controlId="newAdminConfirmPassword"
          type="text"
          placeholder="Confirm Password"
        />
      </Form>
      <Button
        style={{ width: "200px", marginBottom: "20px" }}
        onClick={() => {
          const username = document.getElementById("newAdminUsername").value;
          const password = document.getElementById("newAdminPassword").value;
          const confirmPassword = document.getElementById("newAdminConfirmPassword").value;
          createAdmin(username, password, confirmPassword);
        }}
      >
        Create Adminstrator
      </Button>
    </div>
  );
}
