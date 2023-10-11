import React, { useState,useEffect } from "react";
import AdminSearchBar from "../../components/Admin/AdminSearchBar";
import { Container } from "react-bootstrap";
import AdminDocReqCard from "./AdminDocReqCard";
import axios from "axios";

export default function AdminDocReqs() {
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [error1, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const response = await axios.get("/viewPotentialDoctors");
      if (response.status === 200) {
           setResponseData(response.data.potentialDoctors);
      } else {
        console.log("Server error");
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No potential doctors found.");
      } else if (error.response && error.response.status === 500) {
        setError("Server Error");
      }
      setLoading(false);
    }
  };

  const users = responseData;

  return (
    <Container
      className="bg-white px-5 py-4 d-flex align-items-center justify-content-center"
      style={{
        margin: "20px",
        display: "flex",
        flexDirection: "column",
        marginLeft: "100px",
      }}
    >
      <AdminSearchBar />

      {users.map((user, index) => (
        <AdminDocReqCard
          key={index}
          docName={user.name}
          docSpecialty={user.specialty}
          docEmail = {user.email}
          docBirthDate = {user.dateOfBirth}
          docRate = {user.rate}
          docAffiliation = {user.affiliation}
          docEducation = {user.education}
        />
      ))}
    </Container>
  );
}
