import { faArrowDown, faPerson } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Accordion, Button, Col, Container, Row } from "react-bootstrap";
import AccordionBody from "react-bootstrap/esm/AccordionBody";
import AddFamilyMemberForm from "../../forms/AddFamilyMemberForm";

function AddFamilyMember({ onRefresh }) {
  return (
    <Container style={{ width: "100%" }}>
      <Accordion defaultactiveKey={1} className="acc mt-4">
        <Accordion.Item eventKey={0}>
          <Accordion.Header>
            <div className="d-flex align-items-center">
              <div>
                <FontAwesomeIcon
                  icon={faPerson}
                  style={{
                    color: "#ff6b35",
                    fontSize: "20px",
                    marginRight: "5px",
                  }}
                />
              </div>
              <div style={{ fontWeight: "bold" }}>Add a new family member</div>
            </div>
          </Accordion.Header>

          <AccordionBody>
            <AddFamilyMemberForm onRefresh={onRefresh} />
          </AccordionBody>
        </Accordion.Item>
      </Accordion>
    </Container>
  );
}
export default AddFamilyMember;
