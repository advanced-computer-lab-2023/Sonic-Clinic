import { faArrowRight, faUser, faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Card, Form, Button } from "react-bootstrap";

function ViewDoctorsSearch() {
  return (
    <div
      className="d-flex justify-content-center"
      style={{
        marginLeft: "3rem",
        marginRight: "3rem",
        marginBottom: "2rem",
      }}
    >
      <Card
        className=" col-10 mx-4 "
        style={{
          boxShadow: "0px 0px 5px rgba(0, 0, 0, 0.4)",
          backgroundColor: "white",

          position: "relative", // Add this style for positioning
        }}
      >
        <Card.Body>
          <Form>
            <div className="d-flex align-items-center justify-content-between">
              <div className="col-5">
                <Form.Group className="mr-2">
                  <Form.Label>Doctor Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter doctor's name" />
                </Form.Group>
              </div>
              <div className="col-5">
                <Form.Group className="m-2">
                  <Form.Label>Specialty</Form.Label>
                  <Form.Control as="select" style={{ cursor: "pointer" }}>
                    <option>Select specialty</option>
                    <option>Specialty 1</option>
                    <option>Specialty 2</option>
                    <option>Specialty 3</option>
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="col-2">
              <Button
                variant="primary"
                type="submit"
                style={{ width: "150px", height: "40px", marginTop:"30px"}}
              >
                S e a r c h
                <FontAwesomeIcon
            icon={faSearch}
            style={{
              opacity: 1,
              color: "white",
              fontSize: "15px",
              marginLeft: "10px"
            }}
          />
              </Button>
              </div>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ViewDoctorsSearch;
