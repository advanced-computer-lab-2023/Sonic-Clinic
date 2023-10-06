import React, { useState } from "react";
import AdminSearchBar from "../../components/Admin/AdminSearchBar";
import { Container } from "react-bootstrap";
import AdminDocReqCard from "./AdminDocReqCard";

export default function AdminDocReqs() {
  const users = [
    { name: "Mark", specialty: "Neurosurgery"},
    { name: "John", specialty: "OB" },
  ];

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
          // docEmail = {user.name}
          // docBirthDate = {user.name}
          // docRate = {user.name}
          // docAffiliation = {user.name}
          // docEducation = {user.name}
        />
      ))}
    </Container>
  );
}
