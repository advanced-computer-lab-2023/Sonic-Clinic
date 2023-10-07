import React from "react";
import { Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faX } from "@fortawesome/free-solid-svg-icons";

export default function AdminDocReqDetails({ docEmail, docRate, docEducation, docAffiliation, docBirthDate }) {
  const rowStyle = {
    display: "flex",
    flexDirection: "row",
    marginBottom: "5px",
  };

  const titleStyle={
    color: "#212529",
    marginRight: "5px",
    fontWeight: "bold",
    fontSize: "15px"
  }

  
  return (
    <Card style={{ width: "100%", border: "transparent" }}>
      <Card.Body>
        <div className="d-flex justify-content-end">
          <Button
            style={{
              backgroundColor: "#f0f0f0",
              marginLeft: "20px",
              borderColor: "#f0f0f0",
              width: "40px",
              height: "40px",
            }}
          >
            <FontAwesomeIcon
              icon={faCheck}
              style={{ color: "#f0f0f0", fontWeight: "bold", fontSize: "20px" }}
            />
          </Button>
          <Button
            style={{
              backgroundColor: "#f0f0f0",
              marginLeft: "20px",
              borderColor: "#f0f0f0",
              width: "40px",
              height: "40px",
            }}
          >
            <FontAwesomeIcon
              icon={faX}
              style={{ color: "#f0f0f0", fontWeight: "bold", fontSize: "20px" }}
            />
          </Button>
        </div>

        <Card.Text>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              fontSize: "15px",
            }}
          >
            <div
              style={rowStyle}
            >
              <span style={titleStyle}>
                Email:
              </span>
              {docEmail}
            </div>
            <div
              style={rowStyle}
            >
              <span style={titleStyle}>
                Date of Birth:
              </span>
              {docBirthDate}
            </div>
            <div
              style={rowStyle}
            >
              <span style={titleStyle}>
                Hourly Rate:
              </span>
              {docRate}
            </div>
            <div
              style={rowStyle}
            >
              <span style={titleStyle}>
                Affiliation:
              </span>
              {docAffiliation}
            </div>
            <div
              style={rowStyle}
            >
              <span style={titleStyle}>
                Educational Background:
              </span>
              {docEducation}
            </div>
          </div>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
