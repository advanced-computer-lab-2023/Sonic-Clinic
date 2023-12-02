import React, { useState } from "react";
import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "react-bootstrap";

export default function ChatPat() {
  const [isHovered, setIsHovered] = useState(false);

  const buttonStyle = {
    position: "fixed",
    top: "45rem",
    right: "1rem",
    fontSize: "1.1rem",
    backgroundColor: "transparent",
    border: "none",
    color: "white",
    overflow: "hidden",
    transition: "width 0.3s ease-in-out", // Smooth transition for width change
    width: isHovered ? "13rem" : "3rem", // Change width on hover
  };

  const buttonContentStyle = {
    display: "flex",
    alignItems: "center",
    position: "relative",
    transition: "0.3s ease-in-out", // Smooth transition for positioning
    left: isHovered ? "-0.3rem" : "0", // Move content to the left on hover
  };

  const buttonTextPosition = isHovered ? "0" : "-100%";
  const buttonTextOpacity = isHovered ? 1 : 0;

  return (
    <div>
      <Button
        style={buttonStyle}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div style={buttonContentStyle}>
          <FontAwesomeIcon
            icon={faMessage}
            style={{ color: "white", marginRight: "5px" }}
          />
          <span
            style={{
              transition: "0.3s ease-in-out", // Smooth transition for text
              transform: `translateX(${buttonTextPosition})`, // Translate text on X-axis
              opacity: buttonTextOpacity,
              whiteSpace: "nowrap",
            }}
          >
            Chat with your doctor
          </span>
        </div>
      </Button>
    </div>
  );
}
