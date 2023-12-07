import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import axios from "axios";
import DrPatientFilter from "./DrPatientFilter";
import DrShowPatients from "./DrShowPatients";

export default function DrViewPatients() {
  const [responseData, setResponseData] = useState([]);
  const [patients, setPatients] = useState([]);
  const [upcomingApp, setUpcomingApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const _id = useSelector((state) => state.doctorLogin.userId);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.post("/viewPatients");
      if (response.status === 200) {
        setPatients(response.data.patients);
        setResponseData(response.data.patients);
        setLoading(false);
      } else {
        console.log("Server error");
        setLoading(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No data found.");
        setLoading(false);
      } else if (error.response && error.response.status === 500) {
        setError("Server Error");
        setLoading(false);
      }
    }
  };
  return (
    <Container fluid className="bg-light pt-3 mt-2">
      <Container className="bg-white px-5 py-4 d-flex flex-row align-items-center justify-content-center">
        <div
          className="col-5"
          style={{ position: "sticky", top: "0", height: "100vh" }}
        >
          <DrPatientFilter
            patients={patients}
            responseData={responseData}
            setPatients={setPatients}
            setUpcomingApp={setUpcomingApp}
          />
        </div>
        <div
          className="col-7"
          style={{ position: "sticky", top: "0", height: "100vh" }}
        >
          <DrShowPatients
            patients={patients}
            responseData={responseData}
            setPatients={setPatients}
            upcomingApp={upcomingApp}
            loading={loading}
            fetchData={fetchData}
          />
        </div>
      </Container>
    </Container>
  );
}
