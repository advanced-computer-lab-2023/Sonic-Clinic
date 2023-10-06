import React from "react";
import { Card, ListGroup } from "react-bootstrap";

function FamilyMembersList() {
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
          color: "#ff6b35 ",
          textDecoration: "underline",
        }}
      >
        Family Members
      </div>
      <ListGroup variant="flush">
        {familyMembers.map((member, index) => (
          <ListGroup.Item key={index}>
            <strong>Name:</strong> {member.name}
            <br />
            <strong>National ID:</strong> {member.nationalId}
            <br />
            <strong>Age:</strong> {member.age}
            <br />
            <strong>Gender:</strong> {member.gender}
            <br />
            <strong>Relation:</strong> {member.relation}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
}

export default FamilyMembersList;