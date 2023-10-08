import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";

function FamilyMembersList() {
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [error1, setError] = useState(null);
  const id = useSelector((state) => state.patientLogin.userId);
  useEffect(() => {
    fetchData();
  }, {}); // Fetch data when searchData changes

  const fetchData = async () => {
    try {
      const response = await axios.get("/viewFamilyMembers", {
        data: {
          _id: id,
        },
      });

      if (response.status === 200) {
        console.log("RESPONSE:", response.familyMembers);
      } else {
        console.log("Server error");
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("Error. Please try again");
      }
      setLoading(false);
    }
  };

  const NeededData = responseData;
  const familyMembers = [
    {
      name: "John Doe",
      nationalId: "1234567890123456",
      age: 30,
      gender: "Male",
      relation: "Spouse",
    },
    {
      name: "Jane Doe",
      nationalId: "9876543210987654",
      age: 28,
      gender: "Female",
      relation: "Spouse",
    },
  ];

  return (
    <div>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          fontSize: "2rem",
          fontWeight: "600",
          color: "#212529  ",
          // textDecoration: "underline",
        }}
      >
        Family Members
      </div>
      <ListGroup variant="flush">
        {NeededData.map((member, index) => (
          <ListGroup.Item key={index}>
            {/* <strong style ={{color:}}>Name:</strong> {member.name} */}
            <div
              style={{
                color: "#099BA0  ",
                fontSize: "20px",
                fontWeight: "600",
                marginBottom: "10px",
              }}
            >
              {member.name}
            </div>
            {/* <br /> */}
            <strong>National ID:</strong> {member.nationalID}
            <br />
            <strong>Age:</strong> {member.age}
            <br />
            <strong>Gender:</strong> {member.gender}
            <br />
            <strong>Relation:</strong> {member.relationToPatient}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default FamilyMembersList;
