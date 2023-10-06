import React from "react";
import { Row, Col, Form } from "react-bootstrap";

import "./forms.css";

const FormInput = (props) => {
  const { name, type, placeholder, value, onChange } = props;

  return (
    <Form.Group as={Row} className="mb-3">
      <Col sm={12}>
        <Form.Label htmlFor={name} className="form-input-label">
          {name}
        </Form.Label>
        <Form.Control
          type={type}
          id={name}
          placeholder={placeholder}
          className="form-control"
          value={value}
          onChange={onChange}
        />
      </Col>
    </Form.Group>
  );
};

export default FormInput;
