import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function AdminHomeCard({
  location,
  cardText,
  cardDetails,
  icon,
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link to={location} style={{ textDecoration: "none", color: "inherit" }}>
      <Card
        className="d-flex align-items-center justify-content-center"
        style={{
          background: "white",
          borderRadius: "3px",
          border: "1px solid #099BA0    ",
          boxShadow: "0px 4px 4px 0px #099BA0   ",
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
        <Card.Body className="d-flex justify-content-center flex-column">
          <FontAwesomeIcon
            icon={icon}
            style={{
              opacity: 1,
              color: "#212529",
              fontSize: "20px",
              marginTop: "10px",
            }}
          />
          <Card.Title
            className="d-flex justify-content-center"
            style={{
              color: "#212529",
              fontSize: "20px",
              margin: "5px",
              // marginTop: "25px",
              fontWeight: "bold",
            }}
          >
            {cardText}
          </Card.Title>

          {isHovered && (
            <Card.Text
              className="d-flex justify-content-center text-center"
              style={{
                fontWeight: "lighter",
                color: "#adb5bd ",
                fontSize: "15px",
              }}
            >
              {cardDetails}
            </Card.Text>
          )}
          {isHovered && (
            <FontAwesomeIcon
              icon={faAnglesDown}
              style={{
                opacity: 1,
                color: "#05afb9",
                fontSize: "20px",
                transition: "transform 0.3s ease-in-out",
                // position: "absolute",
                bottom: "15px",
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
