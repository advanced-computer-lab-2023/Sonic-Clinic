import React, { useState } from "react";
import AdminSearchBar from "../../components/Admin/AdminSearchBar";
import { Container } from "react-bootstrap";
import AdminDocReqCard from "./AdminDocReqCard";

export default function AdminDocReqs() {
  const users = [
    { name: "Mark Brown", specialty: "Neurosurgery", email:"bla@bla", dateOfBirth: "10/12/1990", rate: "100/hr", affiliation: "St Jose", education: "GUC"},
    { name: "John Doe", specialty: "Physiotherapy", email:"bla@bla", dateOfBirth: "10/12/1990", rate: "100/hr", affiliation: "St Jose", education: "GUC" },
    { name: "Audrey Lim", specialty: "Psychology", email:"bla@bla", dateOfBirth: "10/12/1990", rate: "100/hr", affiliation: "St Jose", education: "GUC" },
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
