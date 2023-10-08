import React, { useState } from "react";
import { Button, Card, ListGroup, Form, Modal } from "react-bootstrap";
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
  fetchData,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [_id, set_Id] = useState(id);
  const [type, setType] = useState(packageName);
  const [price, setPrice] = useState(fee);
  const [sessionDiscount, setSessionDiscount] = useState(docDiscount);
  const [medicineDiscount, setMedicineDiscount] = useState(pharmacyDiscount);
  const [packageDiscountFM, setPackageDiscountFM] = useState(famDiscount);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const deletePackage = () => {
    setError(null);
    set_Id(_id);
    setShowModal(true);
  };

  const actuallyDelete = async () => {
    try {
      const response = await axios.delete("/deletePackage", {
        _id: _id,
      });
      if (response.status === 200) {
        console.log("Successful");
        fetchData();
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
    handleClose();
    setTimeout(() => {
      setError(null); // Clear the error after 5 seconds
    }, 5000);
  };

  const handleSaveClick = () => {
    //Validations
    const priceRegex = /^\d+(\.\d+)?$/;
    if (!priceRegex.test(price)) {
      setError("Please enter a price in the correct format");
      console.log(error);
      return;
    }
    const percentRegex = /^(?:\d{1,2}|100)$/;
    if (
      !percentRegex.test(sessionDiscount) ||
      !percentRegex.test(medicineDiscount) ||
      !percentRegex.test(packageDiscountFM)
    ) {
      setError("Please enter a percentage in the correct format");
      console.log(error);
      return;
    }
    actuallyUpdate();
    setIsEditing(false);
  };

  const actuallyUpdate = async () => {
    const config = {
      headers: {
        _id: _id,
      },
    };
    try {
      const response = await axios.put(
        "/updatePackage",
        {
          type: type,
          price: price,
          sessionDiscount: sessionDiscount,
          medicineDiscount: medicineDiscount,
          packageDiscountFM: packageDiscountFM,
        },
        config
      );

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
    setTimeout(() => {
      setError(null); // Clear the error after 5 seconds
    }, 5000);
  };

  return (
    <>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Body>
          Are you sure you want to delete this health package?
        </Modal.Body>
        <Modal.Footer className="d-flex align-items-center justify-content-center">
          <Button variant="danger" onClick={actuallyDelete}>
            Yes
          </Button>
          <Button variant="success" onClick={handleClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
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
            <>
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
            </>
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
          <div id="AnnualFee">
            <ListGroup.Item className="d-flex justify-content-between">
              <span style={{ fontWeight: "bold", color: "#ADB5BD " }}>
                Annual Fee
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
                    value={price || ""}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                ) : (
                  <>{price} LE</>
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
              Amount payed per year
            </div>
          </div>
          <div id="SessionDiscount">
            <ListGroup.Item className="d-flex justify-content-between">
              <span style={{ fontWeight: "bold", color: "#ADB5BD " }}>
                Session Discount
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
                    value={sessionDiscount || ""}
                    onChange={(e) => setSessionDiscount(e.target.value)}
                  />
                ) : (
                  <>{sessionDiscount} %</>
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
              Discount on any doctor's session price
            </div>
          </div>
          <div id="MedicineDiscount">
            <ListGroup.Item className="d-flex justify-content-between">
              <span style={{ fontWeight: "bold", color: "#ADB5BD " }}>
                Medicine Discount
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
                    value={medicineDiscount || ""}
                    onChange={(e) => setMedicineDiscount(e.target.value)}
                  />
                ) : (
                  <>{medicineDiscount} %</>
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
              Discount on any medicine ordered from pharmacy platform
            </div>
          </div>
          <div id="PackageDiscountFM">
            <ListGroup.Item className="d-flex justify-content-between">
              <span style={{ fontWeight: "bold", color: "#ADB5BD " }}>
                Family Discount
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
                    value={packageDiscountFM || ""}
                    onChange={(e) => setPackageDiscountFM(e.target.value)}
                  />
                ) : (
                  <>{packageDiscountFM} %</>
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
              Discount on the subscribtion of any family member in any package
            </div>
          </div>
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
      {error && (
        <div
          className="d-flex justify-content-center"
          style={{
            width: "19rem",
            marginBottom: "0.5rem",
            fontSize: "0.85rem",
            backgroundColor: "#f44336", // Red background color
            color: "white", // White text color
            padding: "10px", // Padding around the message
            borderRadius: "5px", // Rounded corners
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)", // Box shadow for a subtle effect
          }}
        >
          {error}
        </div>
      )}
    </>
  );
}
