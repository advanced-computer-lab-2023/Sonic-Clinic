import React from "react";
import { Card, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faX } from "@fortawesome/free-solid-svg-icons";

export default function AdminDocReqDetails({ props }) {
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
              hello
            </div>
            <div
              style={rowStyle}
            >
              <span style={titleStyle}>
                Date of Birth:
              </span>
              Hi
            </div>
            <div
              style={rowStyle}
            >
              <span style={titleStyle}>
                Hourly Rate:
              </span>
              Hi
            </div>
            <div
              style={rowStyle}
            >
              <span style={titleStyle}>
                Affiliation:
              </span>
              HI
            </div>
            <div
              style={rowStyle}
            >
              <span style={titleStyle}>
                Educational Background:
              </span>
              HI
            </div>
          </div>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
