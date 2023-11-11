import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";

function DrPatientFilter({ setPatients, responseData, setUpcomingApp }) {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [error, setError] = useState(null);
  const _id = useSelector((state) => state.doctorLogin._id);

  const handleFilter = async () => {
    if (selectedStatus === "upcoming") {
      try {
        const response = await axios.post("/filterPatientsByAppointments");
        if (response.status === 200) {
          console.log("yay");
          setPatients(response.data.patients);
          setUpcomingApp(true);
        } else {
          console.log("Server error");
        }
      } catch (error) {
        //fix error messages
        if (error.response && error.response.status === 409) {
          setError("Error occured");
        } else {
          setError(
            "An error occurred while adding admin. Please try again later"
          );
        }
      }
    } else {
      setPatients(responseData);
      setUpcomingApp(null);
    }
  };

  return (
    <Container
      style={{
        height: "fit-content",
        flexShrink: 0,
        width: "80%",
        borderRadius: "2.5625rem 2.5625rem 3.25rem 3.25rem",
        border: "1px solid var(--gray-400, #ced4da)",
        background: "var(--gray-white, #fff)",
        padding: "1.6rem",
        marginLeft: "2.2rem",
      }}
    >
      <div
        style={{
          color: "var(--theme-dark, #212529)",
          // fontSize: "2rem",
          fontSize: "30px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "120%",
          marginBottom: "1rem",
        }}
      >
        Filter Patients
      </div>

      {/* <div className="mb-2">
        <div
          style={{
            color: "#099BA0 ",
            fontSize: "1.1rem",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "100%",
            marginBottom: "1rem",
          }}
        >
          Appointment Date
        </div>
        <Form.Control
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div> */}

      <div className="mb-2">
        <div
          style={{
            color: "#099BA0 ",
            fontSize: "1.1rem",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "100%",
            marginBottom: "1rem",
          }}
        >
          Appointment Status
        </div>
        <Form.Control
          as="select"
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{ marginBottom: "1rem" }}
        >
          <option value="">Select status</option>
          <option value="all">All</option>
          <option value="upcoming">Upcoming</option>
        </Form.Control>
      </div>

      <Container
        fluid
        className="d-flex align-items-center justify-content-center"
      >
        <Button className="custom-button" onClick={handleFilter}>
          Apply
        </Button>
      </Container>
    </Container>
  );
}

export default DrPatientFilter;
