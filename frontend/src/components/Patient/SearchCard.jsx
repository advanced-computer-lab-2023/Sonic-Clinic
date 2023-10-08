import {
  faArrowRight,
  faUser,
  faSearch,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Form, Button } from "react-bootstrap";

function SearchCard() {
  return (
    <div
      className="d-flex justify-content-center"
      style={{
        marginTop: "-7rem",
        marginLeft: "3rem",
        marginRight: "3rem",
        marginBottom: "2rem",
      }}
    >
      <Card
        className="p-4 col-6 mx-4 "
        style={{
          boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.4)",
          backgroundColor: "white",
          width: "80%",
          position: "relative", // Add this style for positioning
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
          Search Doctor
        </div>
        <hr />
        <Card.Body>
          <Form>
            <div className="d-flex align-items-center justify-content-between">
              <Form.Group className="mr-2">
                <Form.Label>Doctor Name</Form.Label>
                <Form.Control
                  type="text"
                  style={{ width: "200px", marginRight: "10px" }}
                  placeholder="Enter doctor's name"
                />
              </Form.Group>

              <Form.Group className="mr-2">
                <Form.Label>Location</Form.Label>
                <Form.Control
                  type="text"
                  style={{ width: "200px" }}
                  placeholder="Enter location"
                />
              </Form.Group>

              <Form.Group className="m-2" style={{ flex: "2" }}>
                <Form.Label>Specialty</Form.Label>
                <Form.Control
                  as="select"
                  style={{ width: "200px", cursor: "pointer" }}
                >
                  <option>Select specialty</option>
                  <option>Specialty 1</option>
                  <option>Specialty 2</option>
                  <option>Specialty 3</option>
                </Form.Control>
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                style={{ width: "20%", height: "3rem", marginTop: "30px" }}
              >
                S e a r c h
                <FontAwesomeIcon
                  icon={faSearch}
                  style={{
                    opacity: 1,
                    color: "white",
                    fontSize: "15px",
                    marginLeft: "10px",
                  }}
                />
              </Button>
            </div>
          </Form>

          <a
            href="/patient/view-doctors"
            style={{
              position: "absolute",
              bottom: "10px",
              right: "25px",
              color: "#099BA0  ",
              textDecoration: "none",
              fontSize: "1rem",
              fontWeight: "600",
              marginRight: "20px",
            }}
          >
            View All Doctors
            {/* <FontAwesomeIcon
              icon={faArrowRight}
              style={{ marginLeft: "1rem" }}
            /> */}
            <FontAwesomeIcon
              icon={faAnglesRight}
              style={{
                opacity: 1,
                color: "#099BA0 ",
                fontSize: "15px",
                transition: "transform 0.3s ease-in-out",
                marginLeft: "1rem",
                animation: "arrowAnimation2 1s infinite alternate ease-in-out",
              }}
            />
          </a>
        </Card.Body>
      </Card>
    </div>
  );
}

export default SearchCard;
