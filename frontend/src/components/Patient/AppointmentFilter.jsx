import React, { useState } from "react";
import { Button, Container, Dropdown, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setFilterAppointments } from "../../state/Patient/filterAppointments";

function AppointmentFilter() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const dispatch = useDispatch();

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e);
  };
  const handleSearch = () => {
    dispatch(
      setFilterAppointments({
        date: selectedDate,
        status: selectedStatus,
      })
    );
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

        <Dropdown onSelect={handleStatusChange}>
          <Dropdown.Toggle
            id="dropdown-basic"
            className="custom-dropdown-toggle"
          >
            {selectedStatus === "" ? "Select status " : selectedStatus}
          </Dropdown.Toggle>

          <Dropdown.Menu style={{ width: "100%" }}>
            <Dropdown.Item eventKey="">All</Dropdown.Item> {/* Reset option */}
            <Dropdown.Item eventKey="Upcoming">Upcoming</Dropdown.Item>
            <Dropdown.Item eventKey="Completed">Completed</Dropdown.Item>
            <Dropdown.Item eventKey="Cancelled">Cancelled</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>

      <Container
        fluid
        className="d-flex align-items-center justify-content-center"
      >
        <Button className="custom-button" onClick={handleSearch}>
          Apply
        </Button>
      </Container>
    </Container>
  );
}

export default AppointmentFilter;
