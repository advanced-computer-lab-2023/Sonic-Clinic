import React, { useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import "./DoctorFilter.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setSearchData } from "../../state/Patient/SearchDoctor";
function DoctorFilter() {
  const Specialties = [
    { title: "Cardiology", id: "1", selected: false },
    { title: "Orthopedics", id: "2", selected: false },
    { title: "Oncology", id: "3", selected: false },
    { title: "Neurology", id: "4", selected: false },
    { title: "Pediatrics", id: "5", selected: false },
  ];

  const [currentSpecialties, setSelectedSpecialties] = useState(Specialties);

  const toggleSpecialty = (specialtyItem, index) => {
    const copyCurrentSpecialties = currentSpecialties.map((item, i) => {
      if (i === index) {
        // Toggle the selected state of the clicked specialty
        return { ...item, selected: !item.selected };
      } else {
        return { ...item, selected: false }; // Deselect all other specialties
      }
    });

    setSelectedSpecialties(copyCurrentSpecialties);

    const selectedSpecialtyItem = copyCurrentSpecialties.find(
      (specialty) => specialty.selected === true
    );

    if (selectedSpecialtyItem) {
      setSelectedSpecialty(selectedSpecialtyItem.title);
    } else {
      // If no specialty is selected, you can set the selectedSpecialty to a default value or handle it as needed.
      setSelectedSpecialty(""); // Example: Set to an empty string
    }
  };

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };
  // const handleApply = (e) => {
  //   // console.log("FILTER", filterArray);
  // };

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
  const dispatch = useDispatch();
  const handleSearch = () => {
    dispatch(
      setSearchData({
        filterSpecialty: selectedSpecialty,
        date: selectedDate,
        time: selectedTime,
      })
    );
  };
  // const filteredDoctors = useSelector(
  //   (state) => state.filterDoctor.filterArray
  // );
  // const handleApplyClick = async () => {
  //   try {
  //     // Create an object to hold the filters
  //     const filters = {
  //       specialties: currentSpecialties
  //         .filter((specialty) => specialty.selected)
  //         .map((specialty) => specialty.title),
  //       date: selectedDate,
  //       time: selectedTime,
  //     };
  //     const response = await axios.post(
  //       "/filterDoctorsAfterSearch",
  //       {
  //         array: filteredDoctors, // Replace with your actual id value
  //       },
  //       {
  //         speciality: currentSpecialties
  //           .filter((specialty) => specialty.selected)
  //           .map((specialty) => specialty.title),
  //         date: selectedDate,
  //         time: selectedTime, // Send filters as request parameters
  //       }
  //     );

  //     // Handle the response as needed
  //     console.log("API response:", response.data);
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

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
        Filter Doctors
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
          min={getCurrentDate()}
          onKeyDown={(e) => e.preventDefault()}
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
          style={{ marginBottom: "1rem" }}
          type="time"
          value={selectedTime}
          onChange={handleTimeChange}
        />
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

export default DoctorFilter;
