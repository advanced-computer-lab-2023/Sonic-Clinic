import { faCommentsDollar } from "@fortawesome/free-solid-svg-icons";
import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";

export default function AddNewPackage() {
  const inputStyle = {
    fontSize: "15px",
    height: "30px",
    borderRadius: "3px",
  };
  const titleStyle = {
    fontWeight: "bold",
    color: "#ADB5BD ",
  };
  const [formData, setFormData] = useState({
    name: "",
    fee: "",
    docDiscount: "",
    pharmacyDiscount: "",
    famDiscount: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    if(formData.name=="" || formData.fee=="" || formData.docDiscount=="" || formData.pharmacyDiscount=="" || formData.famDiscount==""){
      setError("Please fill in all the required fields");
      console.log(error);
      return;
    }
    const priceRegex = /^\d+(\.\d{1,2})?\s*LE$/;
    if(!priceRegex.test(formData.fee)){
      setError("Please enter a price in the correct format");
      console.log(error);
      return;
    }
    const percentRegex = /^\d+(\.\d{1,2})?%$/;
    if(!percentRegex.test(formData.docDiscount) || !percentRegex.test(formData.pharmacyDiscount) || !percentRegex.test(formData.famDiscount)){
      setError("Please enter a percentage in the correct format");
      console.log(error);
      return;
    }
    createPackage(formData);
    setFormData({
      name: "",
      fee: "",
      docDiscount: "",
      pharmacyDiscount: "",
      famDiscount: "",
    });

  };

  const createPackage = (formData) => {
    const name = formData.name;
    const fee = formData.fee;
    const docDiscount = formData.docDiscount;
    const pharmacyDiscount = formData.pharmacyDiscount;
    const famDiscount = formData.famDiscount;
    console.log(
      "Create Package: ", name, fee, docDiscount, pharmacyDiscount, famDiscount,);
  };

  return (
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
          value={formData.name}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="p-2" style={titleStyle}>
        <Form.Label>Annual Fee</Form.Label>
        <Form.Control
          id="packFee"
          style={inputStyle}
          type="text"
          placeholder="....LE"
          name="fee"
          value={formData.fee}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="p-2" style={titleStyle}>
        <Form.Label>Doctor Discount</Form.Label>
        <Form.Control
          id="packDocDiscount"
          style={inputStyle}
          type="text"
          placeholder="..%"
          name="docDiscount"
          value={formData.docDiscount}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="p-2" style={titleStyle}>
        <Form.Label>Medicine Discount</Form.Label>
        <Form.Control
          id="packPharmacyDiscount"
          style={inputStyle}
          type="text"
          placeholder="..%"
          name="pharmacyDiscount"
          value={formData.pharmacyDiscount}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="p-2" style={titleStyle}>
        <Form.Label>Family Discount</Form.Label>
        <Form.Control
          id="packFamilyDiscount"
          style={inputStyle}
          type="text"
          placeholder="..%"
          name="famDiscount"
          value={formData.famDiscount}
          onChange={handleChange}
        />
      </Form.Group>
      <Form.Group className="p-2">
        <Button
          style={{ width: "100%", fontSize: "15px" }}
          type="submit"
        >
          Add Package
        </Button>
      </Form.Group>
    </Form>
  );
}
