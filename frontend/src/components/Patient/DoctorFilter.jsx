import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import "./DoctorFilter.css";
function DoctorFilter() {
  const Specialties = [
    { title: "Cardiologist", id: "1", selected: false },
    { title: "Dermatologist", id: "2", selected: false },
    { title: "Pediatrician", id: "3", selected: false },
    { title: "Orthopedic Surgeon", id: "4", selected: false },
    { title: "Ophthalmologist", id: "5", selected: false },
    { title: "Gynecologist", id: "6", selected: false },
    { title: "Urologist", id: "7", selected: false },
    { title: "Neurologist", id: "8", selected: false },
    { title: "Dentist", id: "9", selected: false },
    { title: "Psychiatrist", id: "10", selected: false },
    { title: "Endocrinologist", id: "11", selected: false },
    { title: "Rheumatologist", id: "12", selected: false },
    { title: "Allergist", id: "13", selected: false },
    { title: "Oncologist", id: "14", selected: false },
    { title: "Pulmonologist", id: "15", selected: false },
  ];

  const [currentSpecialties, setSelectedSpecialties] = useState(Specialties);

  const toggleSpecialty = (specialtyItem, index) => {
    const copyCurrentSpecialties = [...currentSpecialties];
    copyCurrentSpecialties[index].selected =
      !copyCurrentSpecialties[index].selected;
    setSelectedSpecialties(copyCurrentSpecialties);
  };

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };
  function getCurrentDate() {
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; // January is 0
    const yyyy = today.getFullYear();

    // Add leading zero to day and month if they are less than 10
    if (dd < 10) {
      dd = `0${dd}`;
    }
    if (mm < 10) {
      mm = `0${mm}`;
    }

    return `${yyyy}-${mm}-${dd}`;
  }

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
        Filter Doctors
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
          Specialty
        </div>
        {currentSpecialties.map((specialtyItem, index) => (
          <div
            className={`${
              specialtyItem.selected === false
                ? "filter-btn"
                : "filter-btn-selected"
            } filter-btn`}
            onClick={() => toggleSpecialty(specialtyItem, index)}
          >
            {specialtyItem.title}
          </div>
        ))}
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
          min={getCurrentDate()}
          onKeyDown={(e) => e.preventDefault()}
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
        <Button className="custom-button">Apply</Button>
      </Container>
    </Container>
  );
}

export default DoctorFilter;
