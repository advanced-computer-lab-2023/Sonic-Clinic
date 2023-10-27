import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import contract from "../../Assets/EmploymentContract.pdf";

function DrContract() {
  const [showContract, setShowContract] = useState(false);

  return (
    <div>
      <Button onClick={() => setShowContract(true)}>View Contract</Button>
      {showContract && (
        <div style={{ marginTop: "1.5rem", width: "20rem" }}>
          <h4>Employment Contract</h4>
          <iframe
            src={contract}
            title="Employment Contract"
            width="100%"
            height="500"
          >
            PDF Viewer is not supported in this browser.
          </iframe>
          <div className="d-flex align-items-center justify-content-center">
            <Button variant="success" onClick={() => setShowContract(false)}>
              Accept
            </Button>
            <Button variant="danger" onClick={() => setShowContract(false)}>
              Reject
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default DrContract;
