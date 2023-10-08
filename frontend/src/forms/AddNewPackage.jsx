import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";

export default function AddNewPackage({ fetchData }) {
  const [type, setType] = useState("");
  const [price, setPrice] = useState(null);
  const [sessionDiscount, setSessionDiscount] = useState(null);
  const [medicineDiscount, setMedicineDiscount] = useState(null);
  const [packageDiscountFM, setPackageDiscountFM] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const inputStyle = {
    fontSize: "15px",
    height: "30px",
    borderRadius: "3px",
  };
  const titleStyle = {
    fontWeight: "bold",
    color: "#ADB5BD ",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (
      type == "" ||
      price == null ||
      sessionDiscount == null ||
      medicineDiscount == null ||
      packageDiscountFM == null
    ) {
      setError("Please fill in all the required fields");
      return;
    }
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

    try {
      const response = await axios.post("/addPackage", {
        type: type,
        price: price,
        sessionDiscount: sessionDiscount,
        medicineDiscount: medicineDiscount,
        packageDiscountFM: packageDiscountFM,
      });

      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false); // Clear the error after 5 seconds
        }, 5000);
        fetchData();
      } else if (response.status === 404) {
        setError("Package not found");
      } else {
        setError("Error");
      }
    } catch (error) {
      setSuccess(false);
      if (error.response && error.response.status === 404) {
        setError("Package not found");
      } else {
        setError(
          "An error occurred while adding package. Please try again later"
        );
      }
    }
    setTimeout(() => {
      setError(null); // Clear the error after 5 seconds
    }, 5000);

    setType("");
    setPrice(null);
    setSessionDiscount(null);
    setMedicineDiscount(null);
    setPackageDiscountFM(null);
  };

  return (
    <>
      <Form
        style={{
          width: "300px",
          height: "auto",
          boxShadow: "0px 4px 4px 0px #adb5bd",
          borderRadius: "3px",
          fontSize: "15px",
          border: "1px solid #adb5bd",
        }}
        onSubmit={handleSubmit}
      >
        <Form.Group className="p-2" style={titleStyle}>
          <Form.Label>Package Name</Form.Label>
          <Form.Control
            id="packName"
            style={inputStyle}
            type="text"
            placeholder="Choose Name"
            name="name"
            onChange={(e) => setType(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="p-2" style={titleStyle}>
          <Form.Label>Annual Fee</Form.Label>
          <Form.Control
            id="packFee"
            style={inputStyle}
            type="number"
            placeholder="....LE"
            name="fee"
            onChange={(e) => setPrice(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="p-2" style={titleStyle}>
          <Form.Label>Doctor Discount</Form.Label>
          <Form.Control
            id="packDocDiscount"
            style={inputStyle}
            type="number"
            placeholder="..%"
            name="docDiscount"
            onChange={(e) => setSessionDiscount(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="p-2" style={titleStyle}>
          <Form.Label>Medicine Discount</Form.Label>
          <Form.Control
            id="packPharmacyDiscount"
            style={inputStyle}
            type="number"
            placeholder="..%"
            name="pharmacyDiscount"
            onChange={(e) => setMedicineDiscount(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="p-2" style={titleStyle}>
          <Form.Label>Family Discount</Form.Label>
          <Form.Control
            id="packFamilyDiscount"
            style={inputStyle}
            type="number"
            placeholder="..%"
            name="famDiscount"
            onChange={(e) => setPackageDiscountFM(e.target.value)}
          />
        </Form.Group>
        <Form.Group className="p-2">
          <Button style={{ width: "100%", fontSize: "15px" }} type="submit">
            Add Package
          </Button>
        </Form.Group>
      </Form>
      {error && (
        <div
          className="d-flex justify-content-center"
          style={{
            marginTop: "0.5rem",
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
      {success && (
        <div
          className="d-flex justify-content-center"
          style={{
            marginTop: "0.5rem",
            marginBottom: "0.5rem",
            fontSize: "0.85rem",
            backgroundColor: "#099BA0 ",
            color: "white", // White text color
            padding: "10px", // Padding around the message
            borderRadius: "5px", // Rounded corners
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)", // Box shadow for a subtle effect
          }}
        >
          Package added successfully!
        </div>
      )}
    </>
  );
}
