import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function AdminSearchBar() {
  return (
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
      />
      <Button
        variant="primary"
        type="submit"
        style={{ width: "10rem", height: "2.5rem", marginLeft: "1rem" }}
      >
        S e a r c h
        <FontAwesomeIcon
          icon={faSearch}
          style={{
            opacity: 1,
            color: "white",
            fontSize: "15px",
            marginLeft: "10px",
          }}
        />
      </Button>
    </div>
  );
}
