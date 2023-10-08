import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";

function AppointmentFilter({ onFilter }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleFilter = () => {
    const filterData = {
      date: selectedDate,
      status: selectedStatus,
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
          fontSize: "30px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "120%",
          marginBottom: "1rem",
        }}
      >
        Filter Appointments
      </div>

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
            color: "#099BA0 ",
            fontSize: "1.1rem",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "100%",
            marginBottom: "1rem",
          }}
        >
          Status
        </div>
        <Form.Control as="select" onChange={handleStatusChange}>
          <option value="">Select status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
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

export default AppointmentFilter;
