import React from "react";
import { Button } from "react-bootstrap";
import contract from "../../Assets/EmploymentContract.pdf";

function DrContract() {
  return (
    <div>
      <div style={{ width: "30rem" }}>
        <iframe
          src={contract}
          title="Employment Contract"
          width="500rem"
          height="600rem"
        >
          PDF Viewer is not supported in this browser.
        </iframe>
      </div>
    </div>
  );
}

export default DrContract;
