import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";

function FamilyMembersList({ refreshFlag }) {
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [error1, setError] = useState(null);
  const id = useSelector((state) => state.patientLogin.userId);
  useEffect(() => {
    fetchData();
  }, [refreshFlag]); // Fetch data when searchData changes

  const fetchData = async () => {
    try {
      const response = await axios.post("/viewFamilyMembers");

      if (response.status === 200) {
        setResponseData(response.data.familyMembers);
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

  return (
    <div>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          fontSize: "2.5rem", // Increase font size for the title
          fontWeight: "600",
          color: "#212529",
          lineHeight: "1.5",
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
            <strong>Package:</strong> {member.package}
            <br />
            <strong>Relation:</strong> {member.relationToPatient}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default FamilyMembersList;
