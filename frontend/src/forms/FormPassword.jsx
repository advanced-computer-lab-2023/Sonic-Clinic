import React, { useState } from "react";
import { FormControl } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import "./forms.css";
import { Row, Col, Form } from "react-bootstrap";

function FormPassword(props) {
  const { name, type, placeholder, value, onChange } = props;
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <Form.Group as={Row} className="mb-3">
      <Col sm={12}>
        <Form.Label htmlFor={name} className="form-input-label">
          {name}
        </Form.Label>
        <div className="password-group">
          <Form.Control
            type={passwordVisible ? "text" : type}
            id={name}
            placeholder={placeholder}
            className="form-control form-box"
            value={value}
            onChange={onChange}
          />
          <span className="password-toggle" onClick={togglePasswordVisibility}>
            <FontAwesomeIcon
              icon={passwordVisible ? faEye : faEyeSlash}
              className="password-icon"
            />
          </span>
        </div>
      </Col>
    </Form.Group>
  );
}

export default FormPassword;
