import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function AdminHomeCard(props) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      to={props.location}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Card
        className="d-flex align-items-center justify-content-center"
        style={{
          background: "white",
          borderRadius: "3px",
          boxShadow: "0px 4px 4px 0px #adb5bd",
          width: "210px",
          height: "160px",
          cursor: "pointer",
          position: "relative", // Added for positioning the arrow
          margin: "30px",
          marginTop: "10px",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Card.Body>
          <Card.Title
            style={{
              color: "#212529",
              fontSize: "20px",
              margin: "10px",
              marginTop: "25px",
              fontWeight: "bold",
            }}
          >
            {props.cardText}
          </Card.Title>
          {isHovered && (
            <FontAwesomeIcon
              icon={faAnglesDown}
              style={{
                opacity: 1,
                color: "#05afb9",
                fontSize: "20px",
                transition: "transform 0.3s ease-in-out",
                position: "absolute",
                bottom: "20px",
                right: "45%",
                animation: "arrowAnimation 1s infinite alternate ease-in-out",
              }}
            />
          )}
        </Card.Body>
      </Card>
    </Link>
  );
}
