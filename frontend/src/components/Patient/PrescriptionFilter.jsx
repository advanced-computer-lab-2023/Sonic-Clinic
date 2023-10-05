import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";

function PrescriptionFilter({ onFilter }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [isFilled, setIsFilled] = useState(null);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleDoctorChange = (e) => {
    setSelectedDoctor(e.target.value);
  };

  const handleStatusChange = (e) => {
    const status =
      e.target.value === "filled"
        ? true
        : e.target.value === "unfilled"
        ? false
        : null;
    setIsFilled(status);
  };

  const handleFilter = () => {
    const filterData = {
      date: selectedDate,
      doctor: selectedDoctor,
      isFilled: isFilled,
    };

    // Call the callback function with the filter data
    onFilter(filterData);
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
          fontSize: "2rem",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "120%",
        }}
      >
        Filter Prescriptions
      </div>

      <div className="mb-2">
        <div
          style={{
            color: "#000",
            fontSize: "1.25rem",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "100%",
            marginBottom: "1.4rem",
          }}
        >
          Date
        </div>
        <Form.Control
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>

      <div className="mb-2">
        <div
          style={{
            color: "#000",
            fontSize: "1.25rem",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "100%",
            marginBottom: "1.4rem",
          }}
        >
          Doctor
        </div>
        <Form.Control
          type="text"
          value={selectedDoctor}
          onChange={handleDoctorChange}
        />
      </div>

      <div className="mb-2">
        <div
          style={{
            color: "#000",
            fontSize: "1.25rem",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "100%",
            marginBottom: "1.4rem",
          }}
        >
          Status
        </div>
        <Form.Control as="select" onChange={handleStatusChange}>
          <option value="">Select status</option>
          <option value="filled">Filled</option>
          <option value="unfilled">Unfilled</option>
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

export default PrescriptionFilter;
