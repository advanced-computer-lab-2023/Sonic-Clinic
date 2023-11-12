import {
  faArrowRight,
  faUser,
  faSearch,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setSearchData } from "../../state/Patient/SearchDoctor";
import { useNavigate } from "react-router";

function SearchCard() {
  const [doctorName, setDoctorName] = useState("");
  const [doctorSpecialty, setDoctorSpecialty] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the form from submitting and page refresh
    handleSearch();
    navigate("/patient/view-doctors"); // Call your search function here
  };

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
          <Form onSubmit={handleSubmit}>
            <div className="d-flex align-items-center justify-content-between w-100">
              <Form.Group className="mr-2" style={{ flex: 2 }}>
                <Form.Label>Doctor Name</Form.Label>
                <Form.Control
                  type="text"
                  style={{ width: "100%" }}
                  placeholder="Enter doctor's name"
                  onChange={(e) => setDoctorName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="m-2" style={{ flex: 2 }}>
                <Form.Label>Specialty</Form.Label>
                <Form.Control
                  as="select"
                  style={{ width: "100%", cursor: "pointer" }}
                  onChange={(e) => {
                    const selectedSpecialty = e.target.value;
                    setDoctorSpecialty(
                      selectedSpecialty === "Select specialty"
                        ? ""
                        : selectedSpecialty
                    );
                  }}
                >
                  <option>Select specialty</option>
                  <option>Cardiology</option>
                  <option>Pediatrics</option>
                  <option>Dermatology</option>
                  <option>Oncology</option>
                  <option>Neurology</option>
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
