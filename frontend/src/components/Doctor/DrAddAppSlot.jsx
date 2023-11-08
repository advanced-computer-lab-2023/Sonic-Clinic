import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import moment from "moment";
const localizer = momentLocalizer(moment);

function DrAddAppSlot() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [error, setError] = useState(null);

  const appointmentSlots = [
    {
      title: "4:30pm",
      start: new Date(2023, 0, 1, 9, 0, 0),
      end: new Date(2023, 0, 1, 10, 0, 0),
      time: "wee",
    },

    // Add more slots here
  ];

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
        dateTime: selectedDateTime,
      });

      if (response.status === 200) {
        // fetchData() betgeeb el free appointments;
      } else {
        setError("Error");
      }
    } catch (error) {
      setError(
        "An error occurred while adding appointment. Please try again later"
      );
    }
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    const eventStyle = {
      backgroundColor: "#05afb9  ", // Background color
      color: "white", // Text color
      border: "none", // Border styles
      marginBottom: "0.3rem",
      width: "90%",
      marginLeft: "0.3rem",
    };

    return {
      style: eventStyle,
    };
  };

  return (
    <div className="d-flex, column-flex">
      <div
        className="d-flex flex-row"
        style={{ marginBottom: "2rem", marginLeft: "5rem" }}
      >
        <div
          style={{
            color: "#099BA0",
            fontSize: "1.1rem",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "100%",
            marginRight: "1rem",
          }}
        >
          Date
        </div>
        <Form.Control
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          style={{ marginRight: "2rem" }}
        />
        <div
          style={{
            color: "#099BA0",
            fontSize: "1.1rem",
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "100%",
            marginRight: "1rem",
          }}
        >
          Time
        </div>
        <Form.Control
          type="time"
          value={selectedTime}
          onChange={handleTimeChange}
        />
        <Container
          fluid
          className="d-flex align-items-center justify-content-center"
        >
          <Button className="custom-button" onClick={addSlot}>
            Add Slot
          </Button>
        </Container>
      </div>

      <div>
        <style>{`
          .rbc-toolbar-label {
            color: #ff6b35  ;
            font-weight: bold;
            font-size: 2rem;
          }
          .events-container {
            overflow-y: auto; /* Enable vertical scrolling */
          }
        `}</style>

        <Calendar
          localizer={localizer}
          events={appointmentSlots}
          startAccessor="start"
          endAccessor="end"
          views={["month"]}
          defaultDate={new Date()}
          style={{ height: 800, width: 1000, marginLeft: "1.5rem" }}
          eventPropGetter={eventStyleGetter} // Apply event styling
          titleAccessor="time"
          components={{
            eventWrapper: ({ children }) => (
              <div className="events-container">{children}</div>
            ),
          }}
        />
      </div>
    </div>
  );
}

export default DrAddAppSlot;
