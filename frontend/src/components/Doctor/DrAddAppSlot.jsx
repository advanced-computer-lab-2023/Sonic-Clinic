import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import axios from "axios";

function DrAddAppSlot({ fetchData }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [error, setError] = useState(null);
  const _id = useSelector((state) => state.doctorLogin.userId);

  const handleTimeChange = (e) => {
    const inputTime = e.target.value;
    const timeParts = inputTime.split(":");
    if (timeParts.length === 2) {
      const hours = parseInt(timeParts[0], 10);
      const minutes = parseInt(timeParts[1], 10);
      const nearestHalfHour = (Math.round(minutes / 30) * 30) % 60;
      const roundedTime = `${hours}:${nearestHalfHour
        .toString()
        .padStart(2, "0")}`;
      setSelectedTime(roundedTime);
    }
  };

  const addSlot = async () => {
    const selectedDateTime = new Date(
      selectedDate + "T" + selectedTime + ":00"
    ).toISOString();
    try {
      const response = await axios.post("/addAppointmentSlot", {
        _id: _id,
        dateTime: selectedDateTime,
      });

      if (response.status === 200) {
        fetchData();
      } else {
        setError("Error");
      }
    } catch (error) {
      setError(
        "An error occurred while adding appointment. Please try again later"
      );
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
          fontSize: "30px",
          fontStyle: "normal",
          fontWeight: 700,
          lineHeight: "120%",
          marginBottom: "1rem",
        }}
      >
        Add Appointment Slot
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
          onChange={(e) => setSelectedDate(e.target.value)}
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
          Time
        </div>
        <Form.Control
          type="time"
          value={selectedTime}
          onChange={handleTimeChange}
        />
      </div>
      <Container
        fluid
        className="d-flex align-items-center justify-content-center"
      >
        <Button className="custom-button" onClick={addSlot}>
          Add Slot
        </Button>
      </Container>
    </Container>
  );
}

export default DrAddAppSlot;
