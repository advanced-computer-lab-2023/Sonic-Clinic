import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

export default function AdminSearchBar(props) {
  const [isHovered, setIsHovered] = useState(false);

  const iconStyle = {
    opacity: 1,
    color: "#f0f0f0",
    fontSize: isHovered ? "19px" : "18px",
    cursor: "pointer",
  };

  return (
    <div
      className="justify-content-between"
      style={{
        display: "flex",
        flexDirection: "row",
        width: "1000px",
        marginBottom: "30px",
      }}
    >
      <Form.Control type="Text" placeholder="Search" />
      <Button
        style={{
          backgroundColor: "#f0f0f0",
          marginLeft: "20px",
          borderColor: "#f0f0f0",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <FontAwesomeIcon icon={faSearch} id="searchIcon" style={iconStyle} />
      </Button>
    </div>
  );
}
