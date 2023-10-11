import React, { useEffect, useState } from "react";
import { Card, Col, Row, Image, Spinner } from "react-bootstrap";
import defaultPfp from "../../Assets/Patient/DefaultPfp.png";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setDoctorData } from "../../state/doctorIdReducer";
import { setSearchData } from "../../state/Patient/SearchDoctor";
import { setFilterArray } from "../../state/Patient/filteredDoctors";
import axios from "axios";

function ShowDoctors() {
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [error1, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // const updateFilteredDoctors = (filteredArray) => {
  //   dispatch(setFilterArray({ filterArray: filteredDoctors }));
  // };
  const _id = useSelector((state) => state.patientLogin.userId);
  const searchDataName = useSelector((state) => state.searchDoctor.name); // Assuming 'searchDoctor' is the slice name
  const searchDataSpec = useSelector((state) => state.searchDoctor.specialty); // Assuming 'searchDoctor' is the slice name
  const searchDataFilterSpec = useSelector(
    (state) => state.searchDoctor.filterSpecialty
  ); // Assuming 'searchDoctor' is the slice name
  const searchDataDate = useSelector((state) => state.searchDoctor.date); // Assuming 'searchDoctor' is the slice name
  const searchDataTime = useSelector((state) => state.searchDoctor.time); // Assuming 'searchDoctor' is the slice name

  const handleCard = (doctor, index) => {
    dispatch(
      setDoctorData({
        username: doctor.username,
        name: doctor.name,
        email: doctor.email,
        dateOfBirth: doctor.dateOfBirth,
        hourlyRate: doctor.hourlyRate,
        affiliation: doctor.affiliation,
        educationalBackground: doctor.educationalBackground,
        speciality: doctor.speciality,
        photoLink: doctor.photoLink,
      })
    );
    navigate(`/patient/view-doctors/${index}`);
  };

  useEffect(() => {
    fetchData();
  }, {}); // Fetch data when searchData changes

  const fetchData = async () => {
    const config = {
      headers: {
        _id: _id,
      },
    };
    try {
      const response = await axios.post(
        "/getDoctorsWithSessionPrice",
        { _id: _id },
        config
      );
      if (response.status === 200) {
        console.log("RESPONSE:", response.data);
        setResponseData(response.data.allDoctors);
      } else {
        console.log("Server error");
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No doctors found.");
      } else if (error.response && error.response.status === 500) {
        setError("Server Error");
      } else {
        setError("An error occurred. Please try again later.");
      }
      setLoading(false);
    }
  };

  const NeededData = responseData;
  const filteredDoctors = NeededData.filter((doctor) => {
    const name = doctor.name ? doctor.name.toLowerCase() : "";
    const speciality = doctor.speciality ? doctor.speciality.toLowerCase() : "";
    // const filterSpeciality = doctor.speciality
    //   ? doctor.speciality.toLowerCase()
    //   : "";

    const date =
      doctor.appointment && Array.isArray(doctor.appointment)
        ? doctor.appointment.map((appointment) =>
            appointment.date ? appointment.date : ""
          )
        : [];
    const time =
      doctor.appointment && Array.isArray(doctor.appointment)
        ? doctor.appointment.map((appointment) =>
            appointment.time ? appointment.time : ""
          )
        : [];

    return (
      (searchDataName === "" || name.includes(searchDataName.toLowerCase())) &&
      (searchDataSpec === "" ||
        speciality.includes(searchDataSpec.toLowerCase()))
      // (searchDataFilterSpec === "" ||
      //   filterSpeciality.includes(searchDataFilterSpec))
      // date.includes(searchDataDate.toLowerCase()) &&
      // time.includes(searchDataTime.toLowerCase())
    );
  });
  console.log("NEEDEDDATA", NeededData);
  console.log("filterDAya", filteredDoctors);
  // updateFilteredDoctors(filteredDoctors);

  return (
    <div>
      {loading && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )}
      {error1 && <div style={{ color: "red" }}>{error1}</div>}
      {!loading &&
        filteredDoctors.map((doctor, index) => (
          <a
            onClick={() => handleCard(doctor, index + 1)}
            key={index}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <Card
              style={{
                cursor: "pointer",
                marginBottom: "1rem",
                border: "1px solid #ccc",
                borderRadius: "5px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Row>
                <Col lg={4}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                    }}
                  >
                    <Image
                      src={doctor.photoLink || defaultPfp}
                      alt={defaultPfp}
                      fluid
                    />
                  </div>
                </Col>
                <Col lg={8}>
                  <Card.Body>
                    <Card.Title
                      style={{
                        color: "#05afb9",
                        fontSize: "2rem",
                        fontWeight: "600",
                        marginBottom: "1rem",
                      }}
                    >
                      {doctor.name}
                    </Card.Title>
                    <Card.Text>
                      <div
                        style={{
                          fontSize: "1.2rem",
                          color: "#333",
                          marginBottom: "4rem",
                        }}
                      >
                        {doctor.speciality}
                      </div>
                      <div
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "600",
                          color: "#555",
                          marginRight: "1rem",
                        }}
                        className="d-flex align-items-center justify-content-end"
                      >
                        ${doctor.sessionPrice} / Session
                      </div>
                    </Card.Text>
                  </Card.Body>
                </Col>
              </Row>
            </Card>
          </a>
        ))}
    </div>
  );
}

export default ShowDoctors;
