import React from "react";
import { Button } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket} from "@fortawesome/free-solid-svg-icons";

export default function HealthPackageCard({id, packageName, fee, docDiscount, pharmacyDiscount, famDiscount,}) {
  
  const dynamicTexts = [fee, docDiscount, pharmacyDiscount, famDiscount];
  const constantTexts = [
    "Annual Fee",
    "Doctor Discount",
    "Medicine Discount",
    "Family Discount",
  ];
  const descriptions = [
    "Amount payed per year",
    "Discount on any doctor's session price",
    "Discount on any medicine ordered from pharmacy platform",
    "Discount on the subscribtion of any family member in any package",
  ];

  return (
    <Card
    style={{
      width: "300px",
      boxShadow: "0px 4px 4px 0px #adb5bd",
      borderRadius: "3px",
      marginBottom: "60px",
    }}
    >
      <Card.Header className="d-flex flex-column" style={{ height: "100px" }}>
      <Card.Title
            className="d-flex justify-content-center"
            style={{
              color: "#ff6b35",
              fontWeight: "bold",
              fontSize: "25px",
              textAlign: "center",
              marginTop: "20px",
            }}
          >
            {packageName}
          </Card.Title>
      </Card.Header>
      <ListGroup variant="flush">
        {constantTexts.map((constant, index) => (
          <div key={index}>
            <ListGroup.Item className="d-flex justify-content-between">
              <span style={{ fontWeight: "bold", color: "#ADB5BD " }}>
                {constant}
              </span>
              <span
                style={{
                  borderLeft: "1px solid #ccc",
                  paddingLeft: "10px",
                  width: "100px",
                }}
              >
                
                  {dynamicTexts[index]}
                
              </span>
            </ListGroup.Item>
            <div
              style={{
                fontSize: "13px",
                margin: "5px",
                marginLeft: "15px",
                color: "#212529  ",
              }}
            >
              {descriptions[index]}
            </div>
          </div>
        ))}
      </ListGroup>
      <Card.Body className="d-flex align-items-center justify-content-center">
        <Button
          style={{ backgroundColor: "#ff6b35" }}
        >
          Buy Package
            <FontAwesomeIcon
              icon={faShoppingBasket}
              style={{
                opacity: 1,
                color: "#f0f0f0 ",
                fontSize: "20px",
                cursor: "pointer",
                marginLeft: "5px",
              }}
            />
        </Button>
      </Card.Body>
    </Card>
  );
}
