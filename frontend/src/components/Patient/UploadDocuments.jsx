import React, { useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

function UploadDocuments() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([
    "file1.pdf",
    "file2.pdf",
    "file3.pdf",
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

  const addFiles = () => {
    setUploadedFiles([]);
    //fetch medical history tani
  };

  return (
    <Card>
      <Card.Header>
        <h5>My Documents</h5>
      </Card.Header>
      <Card.Body>
        <label
          style={{
            marginBottom: "1rem",
            cursor: "pointer",
            color: "#099BA0",
            textDecoration: "underline",
          }}
          onClick={() => setUploadVisible(!uploadVisible)}
          htmlFor="weee"
        >
          Upload Health Records
        </label>
        <div>
          <input
            type="file"
            accept=".pdf, .jpeg, .jpg, .png"
            multiple
            onChange={handleFileUpload}
            style={{ display: "none" }}
            id="weee"
          />

          {uploadedFiles.length > 0 && (
            <div>
              <ul>
                {uploadedFiles.map((file, index) => (
                  <li key={index}>
                    {file.name}
                    <FontAwesomeIcon
                      icon={faX}
                      style={{
                        opacity: 1,
                        color: "red",
                        fontSize: "15px",
                        marginLeft: "2rem",
                        cursor: "pointer",
                      }}
                      onClick={() => handleRemoveFile(index)}
                    />
                  </li>
                ))}
              </ul>
              <div
                style={{
                  marginLeft: "6rem",
                  cursor: "pointer",
                  color: "#05afb9 ",
                  fontWeight: "bold",
                  marginBottom: "1rem",
                }}
                onClick={addFiles}
              >
                Add
              </div>
            </div>
          )}
        </div>

        {existingFiles.length > 0 && (
          <div>
            <h6>Existing Documents:</h6>
            <ListGroup>
              {existingFiles.map((file, index) => (
                <ListGroup.Item key={index}>
                  <a
                    href={file}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#212529" }}
                  >
                    {file}
                  </a>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}

export default UploadDocuments;
