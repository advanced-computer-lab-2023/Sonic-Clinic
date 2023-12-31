import React, { useState } from "react";
import { faArrowDown, faPerson } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, Button, Col, Container, Row } from "react-bootstrap";
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import AdminDocReqDetails from "./AdminDocReqDetails";

export default function AdminDocReqCard({
  docName,
  docId,
  docSpecialty,
  docEmail,
  docRate,
  docEducation,
  docAffiliation,
  docBirthDate,
  fetchData,
  docUsername,
  docDocuments,
  loading,
  clearExpanded,
}) {
  const formattedDateOfBirth = new Date(docBirthDate).toLocaleDateString(
    "en-GB"
  );
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
            <AdminDocReqDetails
              docEmail={docEmail}
              docId={docId}
              docBirthDate={formattedDateOfBirth}
              docRate={docRate}
              docAffiliation={docAffiliation}
              docEducation={docEducation}
              fetchData={fetchData}
              docUsername={docUsername}
              docDocuments={docDocuments}
              loading={loading}
              clearExpanded={clearExpanded}
            />
          </AccordionBody>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}
