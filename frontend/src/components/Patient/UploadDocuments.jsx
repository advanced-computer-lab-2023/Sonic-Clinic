import React, { useState } from "react";
import { Card, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function UploadDocuments() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([
    //mn redux
    "file1.pdf",
    "file2.pdf",
    "file3.pdf",
  ]);
  const [uploadVisible, setUploadVisible] = useState(false);

  const fetchData = async () => {
    //mafrod el medical history tkon fl redux
  };

  const viewFile = async (file) => {
    console.log(file);
    try {
      const response = await axios.get(
        `/viewPatientMedicalHistory?filename=${file}`
      );

      if (response.status === 200) {
        console.log("cool");
      }
    } catch (error) {
      console.log("oops");
    }
  };

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
  };

  const addFiles = async () => {
    console.log(uploadedFiles);
    try {
      const response = await axios.post("/uploadFiles", {
        files: uploadedFiles,
      });
      if (response.status === 200) {
        setUploadedFiles([]);
        fetchData();
      }
    } catch (error) {
      console.log("oops");
    }
  };

  const deleteFile = async (file) => {
    console.log(file);
    try {
      const response = await axios.delete(
        `/deleteFileFromMedicalHistory?filename=${file}`
      );
      if (response.status === 200) {
        fetchData();
      }
    } catch (error) {
      console.log("oops");
    }
  };

  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{
          fontSize: "2.5rem", // Increase font size for the title
          fontWeight: "600",
          color: "#212529",
          lineHeight: "1.5",
        }}
      >
        Medical History
      </div>
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

          {existingFiles.length > 0 ? (
            <div>
              <h6>Existing Documents:</h6>
              <ListGroup>
                {existingFiles.map((file, index) => (
                  <ListGroup.Item key={index}>
                    <a
                      onClick={() => viewFile(file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#212529", cursor: "pointer" }}
                      className="d-flex justify-content-between"
                    >
                      {file}
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        onClick={() => deleteFile(file)}
                        style={{
                          opacity: 1,
                          color: "#ff6b35",
                          fontSize: "20px",
                          cursor: "pointer",
                        }}
                      />
                    </a>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          ) : (
            <div>No medical records found</div>
          )}
        </Card.Body>
      </Card>
    </>
  );
}

export default UploadDocuments;
