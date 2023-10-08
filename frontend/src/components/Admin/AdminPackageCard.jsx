import React, { useState } from "react";
import { Button, Card, ListGroup, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function AdminPackageCard({
  id,
  packageName,
  fee,
  docDiscount,
  pharmacyDiscount,
  famDiscount,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  let dynamicTexts = [fee, docDiscount, pharmacyDiscount, famDiscount];
  const [editedDynamicTexts, setEditedDynamicTexts] = useState([
    ...dynamicTexts,
  ]);
  // const [editedPackageName, setEditedPackageName] = useState(packageName);
  const [_id, set_Id] = useState(id);
  const [type, setType] = useState(packageName);
  const [price, setPrice] = useState(fee);
  const [sessionDiscount, setSessionDiscount] = useState(docDiscount);
  const [medicineDiscount, setMedicineDiscount] = useState(pharmacyDiscount);
  const [packageDiscountFM, setPackageDiscountFM] = useState(famDiscount);

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

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const deletePackage = (id) => {
    console.log("Delete package", id);
  };

  const handleInputChange = (index, event) => {
    const updatedDynamicTexts = [...editedDynamicTexts];
    updatedDynamicTexts[index] = event.target.value;
    setEditedDynamicTexts(updatedDynamicTexts);
  };

  // const handleSaveClick = () => {
  //   // Handle saving the edited dynamic texts, e.g., send to server or update state
  //   console.log("Saving edited dynamic texts:", editedDynamicTexts);
  //   setIsEditing(false);
  // };

  const handleSaveClick = async () => {
    const updatedValues = editedDynamicTexts.slice();

    const annualFeeRegex = /^\d+(\.\d+)?$/;
    const commonRegex = /^(?:\d{1,2}|100)$/;

    let isValid = true;
    let index = 0;
    while (index < updatedValues.length && isValid) {
      const value = updatedValues[index];

      if (index === 0) {
        isValid = annualFeeRegex.test(value);
      } else {
        isValid = commonRegex.test(value);
      }

      if (!isValid) {
        setError("Please write the correct formats");
        // return;
      }
      index++;
    }

    // If all values are valid, print the new values
    if (isValid) {
      setEditedDynamicTexts(updatedValues);
      dynamicTexts = updatedValues;
      //THE VALUES ARE NOT GETTING SET WHYYYYYYYYY
      setType(dynamicTexts[0]);
      setPrice(dynamicTexts[1]);
      setSessionDiscount(dynamicTexts[2]);
      setMedicineDiscount(dynamicTexts[3]);
      setPackageDiscountFM(dynamicTexts[4]);
      try {
        const response = await axios.post("/updatePackage", {
          type: type,
          price: price,
          sessionDiscount: sessionDiscount,
          medicineDiscount: medicineDiscount,
          packageDiscountFM: packageDiscountFM,
        });

        if (response.status === 200) {
          console.log("tmam");
        } else if (response.status === 404) {
          setError("Package not found");
        } else {
          setError("Error");
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setError("Package not found");
        } else {
          setError(
            "An error occurred while updating package. Please try again later"
          );
        }
      }
      setIsEditing(false);
      setError(null);
    } else {
      console.log(error);
      setIsEditing(false);
      setEditedDynamicTexts(dynamicTexts);
    }
  };

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
        <div className="d-flex justify-content-end">
          {!isEditing ? (
            <FontAwesomeIcon
              icon={faPenToSquare}
              style={{
                opacity: 1,
                color: "#099BA0 ",
                fontSize: "20px",
                cursor: "pointer",
                marginBottom: "5px",
              }}
              onClick={handleEditClick}
            />
          ) : (
            <FontAwesomeIcon
              icon={faPenToSquare}
              style={{
                opacity: 0,
              }}
              onClick={handleEditClick}
            />
          )}
        </div>
        {isEditing ? (
          <Form.Control
            className="d-flex"
            style={{
              color: "#ff6b35",
              fontWeight: "bold",
              fontSize: "25px",
              marginLeft: "30px",
              border: "none",
              width: "200px",
            }}
            value={type}
            onChange={(e) => setType(e.target.value)}
          />
        ) : (
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
            {type}
          </Card.Title>
        )}
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
                {isEditing ? (
                  <Form.Control
                    type="text"
                    value={editedDynamicTexts[index] || ""}
                    onChange={(e) => handleInputChange(index, e)} // Pass index and event here
                  />
                ) : (
                  <>
                    {editedDynamicTexts[index]} {index === 0 ? "LE" : "%"}
                  </>
                )}
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
          onClick={isEditing ? handleSaveClick : () => deletePackage(id)}
        >
          {isEditing ? "Save Changes" : "Delete Package"}
          {/* {!isEditing && variant:"danger"} */}
          {!isEditing && (
            <FontAwesomeIcon
              icon={faTrashCan}
              style={{
                opacity: 1,
                color: "#f0f0f0 ",
                fontSize: "20px",
                cursor: "pointer",
                marginLeft: "5px",
              }}
            />
          )}
        </Button>
      </Card.Body>
    </Card>
  );
}
