import React from 'react';
import { Button, Form } from 'react-bootstrap';

export default function AddNewPackage() {
  const inputStyle={
    fontSize:"15px",
    height: "30px",
    borderRadius:"3px"

}
const createPackage = (name, fee, docDiscount, pharmacyDiscount, famDiscount) => {
  console.log('Creating new package: ',name, fee, docDiscount, pharmacyDiscount, famDiscount);
  alert("package added");
};

  return (
    <Form style={{ width: '300px', height: 'auto',boxShadow: '0px 4px 4px 0px #adb5bd', borderRadius: '3px', fontSize:'15px'}}>
      <Form.Group className="p-2">
        <Form.Label>Package Name</Form.Label>
        <Form.Control id="packName" style={inputStyle} type="text" placeholder="Chosen Name" />
      </Form.Group>
      <Form.Group className="p-2">
        <Form.Label>Annual Fee</Form.Label>
        <Form.Control id="packFee" style={inputStyle} type="text" placeholder="....LE" />
      </Form.Group>
      <Form.Group className="p-2">
        <Form.Label>Doctor Discount</Form.Label>
        <Form.Control id="packDocDiscount" style={inputStyle} type="text" placeholder="..%" />
      </Form.Group>
      <Form.Group className="p-2">
        <Form.Label>Medicine Discount</Form.Label>
        <Form.Control id="packPharmacyDiscount" style={inputStyle} type="text" placeholder="..%" />
      </Form.Group>
      <Form.Group className="p-2">
        <Form.Label>Family Discount</Form.Label>
        <Form.Control id="packFamilyDiscount" style={inputStyle} type="text" placeholder="..%" />
      </Form.Group>
      <Form.Group className="p-2">
        <Button style={{width:'100%'}}
        onClick={() => {
          const name = document.getElementById("packName").value;
          const fee = document.getElementById("packFee").value;
          const docDiscount = document.getElementById("packDocDiscount").value;
          const pharmacyDiscount = document.getElementById("packPharmacyDiscount").value;
          const famDiscount = document.getElementById("packFamilyDiscount").value;
          createPackage(name, fee, docDiscount, pharmacyDiscount, famDiscount);
        }}>Add Package</Button>
      </Form.Group>
    </Form>
  );
}
