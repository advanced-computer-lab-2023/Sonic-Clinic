import React, { useState } from "react";
import { faArrowDown, faPerson } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, Button, Col, Container, Row } from "react-bootstrap";
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import AdminDocReqDetails from "./AdminDocReqDetails";

export default function AdminDocReqCard({docName, docSpecialty, docEmail, docRate, docEducation, docAffiliation, docBirthDate}) {
  return (
    <Container style={{ width: "1000px", padding: "0px" }}>
      <Accordion defaultactiveKey={1} className="acc mt-4">
        <Accordion.Item eventKey={0}>
          <Accordion.Header>
            <div className="d-flex" style={{ flexDirection: "column" }}>
              <div
                style={{
                  fontSize: "17px",
                  marginBottom: "5px",
                  fontWeight: "bold",
                  color: "#212529",
                }}
              >
                {docName}
              </div>
              <div style={{ fontSize: "15px", color: "#05afb9" }}>
                {docSpecialty}
              </div>
            </div>
          </Accordion.Header>
          <AccordionBody>
            <AdminDocReqDetails docEmail={docEmail} docBirthDate={docBirthDate} docRate={docRate} docAffiliation={docAffiliation} docEducation={docEducation}/>
          </AccordionBody>
        </Accordion.Item>
      </Accordion>
    </Container>

    //     <div>
    //      <Card style={{width:'1000px', height:'75px', borderRadius:'2px', marginBottom:'5px', boxShadow: '2px 0px 2px 0px #adb5bd',}}>
    //      <Card.Body className="d-flex align-items-center">
    //   <div>
    //     <Card.Title style={{ fontSize: '17px' }}>{props.docName}</Card.Title>
    //     <Card.Text style={{ fontSize: '14px' }}>
    //       Specialty is {props.docSpecialty}
    //     </Card.Text>
    //   </div>
    //   <div className="d-flex flex-grow-1"></div>
    //   <div className="ms-auto">
    //     <FontAwesomeIcon
    //       icon={faAnglesRight}
    //       style={{
    //         opacity: 1,
    //         color: '#05afb9',
    //         fontSize: '20px',
    //         cursor: 'pointer',
    //         marginRight:'30px',
    //         animation: 'arrowAnimation2 1s infinite alternate ease-in-out',
    //       }}
    //     />
    //   </div>
    // </Card.Body>

    //     </Card>
    //     <AdminDocReqDetails/>
    //     </div>
  );
}
