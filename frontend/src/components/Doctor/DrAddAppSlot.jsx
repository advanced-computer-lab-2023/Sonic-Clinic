import React, { useState, useEffect } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import moment from "moment";
const localizer = momentLocalizer(moment);

function DrAddAppSlot() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [error1, setError] = useState(null);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/viewAvailableSlots");

      if (response.status === 200) {
        setResponseData(response.data.availableSlots);
        setMsg(null);
      } else {
        console.log("Server error");
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setMsg("No available appointment slots found.");
        setError(null);
      } else {
        setError("Server Error");
      }
      setLoading(false);
    }
  };

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
    if (!selectedDate || !selectedTime) {
      setError("Please select both a date and a time");
      return;
    }
    try {
      const response = await axios.post("/addAvailableSlots", {
        slots: [selectedDate + " " + selectedTime],
      });

      if (response.status === 200) {
        fetchData();
        setError(null);
      } else {
        setError("Error");
      }
    } catch (error) {
      setError(
        "An error occurred while adding appointment. Please try again later"
      );
    }
  };

  const getCurrentDate = () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    let month = (currentDate.getMonth() + 1).toString();
    let day = currentDate.getDate().toString();

    // Ensure the month and day have two digits
    month = month.length === 1 ? "0" + month : month;
    day = day.length === 1 ? "0" + day : day;

    return `${year}-${month}-${day}`;
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

  const availableSlots = responseData.map((slot) => {
    // Format the slot as required by your calendar
    const slotTime = new Date(slot).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    return {
      start: new Date(slot),
      end: new Date(slot), // Assuming each slot is a single point in time
      title: slotTime, // Display only the formatted time
    };
  });

  return (
    <div className="d-flex, column-flex">
      <div
        className="d-flex flex-row justify-content-between"
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
          min={getCurrentDate()}
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
      <div className="d-flex flex-column align-items-center justify-content-center">
        <div style={{ width: "20rem" }}>
          {error1 && <div className="error">{error1}</div>}
          {msg && <div className="msg">{msg}</div>}
        </div>
        <div>
          <style>{`
          .rbc-toolbar-label {
            color: #ff6b35  ;
            font-weight: bold;
            font-size: 2rem;
            margin-left: 30rem;
          }
          .events-container {
            overflow-y: auto; /* Enable vertical scrolling */
          }
        `}</style>

          <Calendar
            localizer={localizer}
            events={availableSlots}
            startAccessor="start"
            endAccessor="end"
            views={["month"]}
            defaultDate={new Date()}
            style={{ height: 1000, width: 1000, marginLeft: "1.5rem" }}
            eventPropGetter={eventStyleGetter} // Apply event styling
            // titleAccessor="time"
            components={{
              eventWrapper: ({ children }) => (
                <div className="events-container">{children}</div>
              ),
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default DrAddAppSlot;
