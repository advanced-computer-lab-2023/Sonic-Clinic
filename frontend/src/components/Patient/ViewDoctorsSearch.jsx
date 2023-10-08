import React, { useState } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setSearchData } from "../../state/Patient/SearchDoctor";
import { useNavigate } from "react-router";

function ViewDoctorsSearch({ setNameQuery, setSpecQuery }) {
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
                <Form.Group className="m-2">
                  <Form.Label>Specialty</Form.Label>
                  <Form.Control
                    as="select"
                    style={{ cursor: "pointer" }}
                    onChange={(e) => {
                      const selectedSpecialty = e.target.value;
                      setDoctorSpecialty(
                        selectedSpecialty === "Select specialty"
                          ? ""
                          : selectedSpecialty
                      );
                    }}
                    value={doctorSpecialty}
                  >
                    <option>Select specialty</option>
                    <option>Cardiologist</option>
                    <option>Pediatrician</option>
                    <option>Dermatologist</option>
                    <option>Oncologist</option>
                    <option>Neurologist</option>
                  </Form.Control>
                </Form.Group>
              </div>
              <div className="col-2">
                <Button
                  variant="primary"
                  type="submit"
                  style={{ width: "150px", height: "40px", marginTop: "30px" }}
                >
                  S e a r c h
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
