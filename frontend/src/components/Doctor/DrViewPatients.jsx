import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Container } from "react-bootstrap";
import axios from "axios";
import DrPatientFilter from "./DrPatientFilter";
import DrShowPatients from "./DrShowPatients";

export default function DrViewPatients() {
  const [responseData, setResponseData] = useState([]);
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState(null);
  const _id = useSelector((state) => state.doctorLogin.userId);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const config = {
      headers: {
        _id: _id,
      },
    };
    try {
      const response = await axios.post("/viewPatients", { _id: _id }, config);
      if (response.status === 200) {
        setPatients(response.data.patients);
        setResponseData(response.data.patients);
      } else {
        console.log("Server error");
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No data found.");
      } else if (error.response && error.response.status === 500) {
        setError("Server Error");
      }
    }
  };
  return (
    <Container fluid className="bg-light pt-3 mt-2">
      <Container className="bg-white px-5 py-4 d-flex flex-row align-items-center justify-content-center">
        <div className="col-5">
          <DrPatientFilter
            patients={patients}
            responseData={responseData}
            setPatients={setPatients}
          />
        </div>
        <div className="col-7">
          <DrShowPatients
            patients={patients}
            responseData={responseData}
            setPatients={setPatients}
          />
        </div>
      </Container>
    </Container>
  );
}
