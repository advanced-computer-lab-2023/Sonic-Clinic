import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateMyMedicalHistory } from "../../state/loginPatientReducer";
import { Card, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { saveAs } from "file-saver";
import axios from "axios";

function UploadDocuments() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [uploadVisible, setUploadVisible] = useState(false);
  const dispatch = useDispatch();
  console.log(existingFiles);

  useEffect(() => {
    reloadMedicalHistory();
  }, []);

  const viewFile = async (file) => {
    try {
      const response = await axios.get(
        `/viewPatientMedicalHistory?filename=${file}`,
        {
          responseType: "text", // Set the responseType to 'text'
        }
      );

      if (response.status === 200) {
        const byteString = response.data;
        const byteNumbers = byteString.split(",").map(Number);

        // Create a Uint8Array from the byte numbers
        const uint8Array = new Uint8Array(byteNumbers);

        // Create a Blob from the Uint8Array
        const blob = new Blob([uint8Array], {
          type: response.headers["content-type"],
        });

        if (blob.size > 0) {
          const url = window.URL.createObjectURL(blob);

          // Create an anchor element
          const a = document.createElement("a");
          a.href = url;
          a.download = file; // Specify the desired filename

          // Append the anchor to the body
          document.body.appendChild(a);

          // Trigger a click event to initiate download
          a.click();

          // Remove the anchor from the DOM
          document.body.removeChild(a);

          // Release the object URL
          window.URL.revokeObjectURL(url);
        } else {
          console.log("File content is empty");
        }
      } else {
        console.log(`Failed to download file. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error fetching file:", error);
      // Handle the error appropriately
    }
  };

  const reloadMedicalHistory = async () => {
    try {
      const response = await axios.get("/viewMedicalRecords");
      if (response.status === 200) {
        setExistingFiles(response.data.medHistory);
        dispatch(
          updateMyMedicalHistory({
            medicalHistory: existingFiles,
          })
        );
      }
    } catch (error) {
      console.log("error" + error);
    }
  };

  const handleFileUpload = async (e) => {
    const newFiles = Array.from(e.target.files);

    // Check for duplicate files
    const uniqueNewFiles = newFiles.filter((newFile) => {
      return !uploadedFiles.some(
        (uploadedFile) => uploadedFile.filename === newFile.name
      );
    });

    // Format and validate files
    const formattedFiles = await Promise.all(
      uniqueNewFiles.map(async (file) => {
        try {
          // Read the file data as a Uint8Array
          const fileArrayBuffer = await file.arrayBuffer();
          const fileUint8Array = new Uint8Array(fileArrayBuffer);

          // Format the file
          const formattedFile = {
            filename: file.name,
            mimetype: file.type,
            buffer: {
              type: "Buffer",
              data: Array.from(fileUint8Array),
            },
          };

          // Log the buffer data
          console.log(`Buffer data for ${file.name}:`, formattedFile.buffer);

          return formattedFile;
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error);
          return null; // Skip invalid files
        }
      })
    );

    const validFiles = formattedFiles.filter(Boolean);

    setUploadedFiles([...uploadedFiles, ...validFiles]);
  };

  console.log(uploadedFiles);

  const handleRemoveFile = (index) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
  };

  const addFiles = async () => {
    try {
      const formData = new FormData();
      uploadedFiles.forEach((file, index) => {
        const blob = new Blob([file.buffer.data], { type: file.mimetype });

        const blobUrl = URL.createObjectURL(blob);
        console.log(blobUrl);

        formData.append("files", blob, file.filename);
      });
      console.log("FILE DATA ", formData);

      const response = await axios.post("/uploadFiles", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 200) {
        reloadMedicalHistory();
        setUploadedFiles([]);
      }
    } catch (error) {
      console.log("Oops, not added", error);
    }
  };

  const deleteFile = async (file) => {
    try {
      const response = await axios.delete(
        `/deleteFileFromMedicalHistory?filename=${file}`
      );
      if (response.status === 200) {
        reloadMedicalHistory();
      }
    } catch (error) {
      console.log("error" + error);
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
                      {file.filename}
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

          {existingFiles && existingFiles.length > 0 ? (
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
                        onClick={(e) => {
                          e.stopPropagation(); // Stop the event from reaching the parent (a tag)
                          deleteFile(file);
                        }}
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
