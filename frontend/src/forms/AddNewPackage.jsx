import React from 'react';
import { Button, Form } from 'react-bootstrap';

export default function AddNewPackage() {
  return (
    <Form style={{ width: '300px', height: 'auto',boxShadow: '0px 4px 4px 0px #adb5bd', borderRadius: '3px' }}>
      <Form.Group className="p-3">
        <Form.Label style={{ color: '#099BA0 ', fontWeight: 'bold', fontSize: '25px', marginLeft: '30px' }}>
          Add a new package
        </Form.Label>
      </Form.Group>
      <Form.Group className="p-3">
        <Form.Label>Package Name</Form.Label>
        <Form.Control type="text"  />
      </Form.Group>
      <Form.Group className="p-3">
        <Form.Label>Annual Fee</Form.Label>
        <Form.Control type="text" placeholder="....LE" />
      </Form.Group>
      <Form.Group className="p-3">
        <Form.Label>Doctor Discount</Form.Label>
        <Form.Control type="text" placeholder="..%" />
      </Form.Group>
      <Form.Group className="p-3">
        <Form.Label>Medicine Discount</Form.Label>
        <Form.Control type="text" placeholder="..%" />
      </Form.Group>
      <Form.Group className="p-3">
        <Form.Label>Family Discount</Form.Label>
        <Form.Control type="text" placeholder="..%" />
      </Form.Group>
      <Form.Group className="p-3">
        <Button style={{marginLeft:'70px'}}>Add Package</Button>
      </Form.Group>
    </Form>
  );
}
