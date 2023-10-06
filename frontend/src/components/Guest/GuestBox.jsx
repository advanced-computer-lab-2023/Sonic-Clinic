import { faArrowRight, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Button, Dropdown } from "react-bootstrap";

function GuestBox() {
  return (
    <div
      className="d-flex flex-column align-items-center"
      style={{
        marginTop: "-7rem",
        marginLeft: "3rem",
        marginRight: "3rem",
        marginBottom: "2rem",
      }}
    >
      <Card
        className="p-4 col-6 mx-4"
        style={{
          boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.4)",
          backgroundColor: "white",
          width: "80%",
          position: "relative",
        }}
      >
        <div
          className="d-flex align-items-center justify-content-center"
          style={{
            color: "var(--body-text-body-color, #212529)",
            fontSize: "2rem",
            fontWeight: "600",
          }}
        >
          Hello Guest!
        </div>
        <hr />
        <div className="d-flex align-items-center justify-content-center flex-column">
          <Button
            variant="primary"
            type="submit"
            style={{
              width: "300px",
              height: "3rem",
              marginBottom: "1rem",
            }}
          >
            Login
          </Button>
          <Dropdown>
            <Dropdown.Toggle
              variant="primary"
              style={{
                width: "300px",
                height: "3rem",             

              }}
            >
              Sign Up
            </Dropdown.Toggle>
            <Dropdown.Menu style={{ width: "300px",}}>
              <Dropdown.Item>Sign Up as Doctor</Dropdown.Item>
              <Dropdown.Item>Sign Up as Patient</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <div
          className="d-flex align-items-center justify-content-end"
          style={{
            marginTop: "1rem",
            color: "#05afb9",
            textDecoration: "none",
            fontSize: "1rem",
            fontWeight: "600",
          }}
        >
        </div>
      </Card>
    </div>
  );
}

export default GuestBox;