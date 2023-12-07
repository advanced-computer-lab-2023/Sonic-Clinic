import React, { useState } from "react";
import { Card, Form, Button, Dropdown } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setSearchData } from "../../state/Patient/SearchDoctor";
import { useNavigate } from "react-router";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function ViewDoctorsSearch() {
  const [doctorName, setDoctorName] = useState("");
  const [doctorSpecialty, setDoctorSpecialty] = useState("");
  const dispatch = useDispatch();

  const handleSearch = () => {
    dispatch(
      setSearchData({
        name: doctorName,
        specialty: doctorSpecialty,
      })
    );
    // Uncomment these lines if you want to set the query locally
    // setNameQuery(doctorName);
    // setSpecQuery(doctorSpecialty);
  };
  const handleSelect = (eventKey) => {
    setDoctorSpecialty(eventKey === "Select specialty" ? "" : eventKey);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the form from submitting and page refresh
    handleSearch(); // Call your search function here
  };

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
          position: "relative",
        }}
      >
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <div className="d-flex align-items-center justify-content-between">
              <div className="col-5">
                <Form.Group className="mr-2">
                  <Form.Label>Doctor Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter doctor's name"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                  />
                </Form.Group>
              </div>
              <div className="col-5">
                <Form.Group className="m-2" style={{ flex: 2 }}>
                  <Form.Label>Specialty</Form.Label>
                  <Dropdown onSelect={handleSelect}>
                    <Dropdown.Toggle
                      id="dropdown-basic"
                      className="custom-dropdown-toggle"
                    >
                      {doctorSpecialty || "Select Specialty"}
                    </Dropdown.Toggle>

                    <Dropdown.Menu style={{ width: "100%" }}>
                      <Dropdown.Item eventKey="">All</Dropdown.Item>
                      <Dropdown.Item eventKey="Cardiology">
                        Cardiology
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Pediatrics">
                        Pediatrics
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Dermatology">
                        Dermatology
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Oncology">
                        Oncology
                      </Dropdown.Item>
                      <Dropdown.Item eventKey="Neurology">
                        Neurology
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
              </div>
              <div className="col-2">
                <Button
                  variant="primary"
                  type="submit"
                  style={{ width: "150px", height: "40px", marginTop: "30px" }}
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
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}

export default ViewDoctorsSearch;
