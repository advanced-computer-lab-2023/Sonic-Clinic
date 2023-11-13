import React, { useState, useEffect } from "react";
import { Container, Form, Spinner } from "react-bootstrap";
import AdminDocReqCard from "./AdminDocReqCard";
import axios from "axios";

export default function AdminDocReqs() {
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [error1, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

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
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div
        className="justify-content-between"
        style={{
          display: "flex",
          flexDirection: "row",
          width: "1000px",
          marginBottom: "1rem",
        }}
      >
        <Form.Control
          type="Text"
          placeholder="Search"
          style={{ height: "2.5rem" }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {loading ? ( // Show loading spinner while data is being fetched
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : (
        filteredUsers.map((user, index) => (
          <AdminDocReqCard
            key={index}
            docId={user._id}
            docName={user.name}
            docSpecialty={user.specialty}
            docEmail={user.email}
            docBirthDate={user.dateOfBirth}
            docRate={user.hourlyRate}
            docAffiliation={user.affiliation}
            docEducation={user.educationalBackground}
            docUsername={user.username}
            docDocuments={user.documents}
            fetchData={fetchData}
          />
        ))
      )}
    </Container>
  );
}
