import React, { useState } from "react";
import { Button, Container, Dropdown, Form } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setFilterPrescriptions } from "../../state/Patient/filterPrescriptions";

function PrescriptionFilter() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [isFilled, setIsFilled] = useState("");
  const dispatch = useDispatch();

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleDoctorChange = (e) => {
    setSelectedDoctor(e.target.value);
  };

  const handleStatusChange = (e) => {
    setIsFilled(e);
  };

  const handleSearch = () => {
    dispatch(
      setFilterPrescriptions({
        date: selectedDate,
        doctor: selectedDoctor,
        status: isFilled,
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
          // color: "var(--theme-dark, #212529)",
          // fontSize: "2rem",
          // fontStyle: "normal",
          // fontWeight: 700,
          // lineHeight: "120%",
          fontSize: "30px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "120%",
          marginBottom: "1rem",
        }}
      >
        Filter Prescriptions
      </div>

      <div className="mb-2">
        <div
          style={{
            // color: "#000",
            // fontSize: "1.25rem",
            // fontStyle: "normal",
            // fontWeight: 700,
            // lineHeight: "100%",
            // marginBottom: "1.4rem",
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
          style={{ marginBottom: "1rem" }}
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>

      <div className="mb-2">
        <div
          style={{
            // color: "#000",
            // fontSize: "1.25rem",
            // fontStyle: "normal",
            // fontWeight: 700,
            // lineHeight: "100%",
            // marginBottom: "1.4rem",
            color: "#099BA0 ",
            fontSize: "1.1rem",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "100%",
            marginBottom: "1rem",
          }}
        >
          Doctor
        </div>
        <Form.Control
          style={{ marginBottom: "1rem" }}
          type="text"
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
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
            {isFilled === "" ? "Select status " : isFilled}
          </Dropdown.Toggle>

          <Dropdown.Menu style={{ width: "100%" }}>
            <Dropdown.Item eventKey="">All</Dropdown.Item> {/* Reset option */}
            <Dropdown.Item eventKey="Filled">Filled</Dropdown.Item>
            <Dropdown.Item eventKey="Not Filled">Not Filled</Dropdown.Item>
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

export default PrescriptionFilter;
