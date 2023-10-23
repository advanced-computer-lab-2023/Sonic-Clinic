import React, { useState } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";

function UploadDocuments() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([
    "document1.pdf",
    "image.jpg",
    "document2.pdf",
  ]);
  const [uploadVisible, setUploadVisible] = useState(false);

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
  };

  return (
    <Card>
      <Card.Header>
        <h5>My Documents</h5>
      </Card.Header>
      <Card.Body>
        <Button
          variant="primary"
          onClick={() => setUploadVisible(!uploadVisible)}
        >
          {uploadVisible ? "Hide Upload" : "Upload Documents"}
        </Button>

        {uploadVisible && (
          <div>
            <input
              type="file"
              accept=".pdf, .jpeg, .jpg, .png"
              multiple
              onChange={handleFileUpload}
            />

            {uploadedFiles.length > 0 && (
              <div>
                <h6>Newly Uploaded Documents:</h6>
                <ul>
                  {uploadedFiles.map((file, index) => (
                    <li key={index}>
                      {file.name}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleRemoveFile(index)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {existingFiles.length > 0 && (
          <div>
            <h6>Existing Documents:</h6>
            <ListGroup>
              {existingFiles.map((file, index) => (
                <ListGroup.Item key={index}>{file}</ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default UploadDocuments;
