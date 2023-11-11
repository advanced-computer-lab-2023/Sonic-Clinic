import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { updateMyMedicalHistory } from "../../state/loginPatientReducer";
import { Card, ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function UploadDocuments() {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [existingFiles, setExistingFiles] = useState([]);
  const [uploadVisible, setUploadVisible] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    reloadMedicalHistory();
  }, []);

  const viewFile = async (file) => {
    try {
      const response = await axios.get(
        `/viewPatientMedicalHistory?filename=${file}`,
        {
          responseType: "arraybuffer",
        }
      );

      console.log("Server Response Data:", response.data);

      if (response.status === 200) {
        const blob = new Blob([response.data], {
          type: response.headers["content-type"],
        });

        console.log("Blob:", blob);

        if (blob.size > 0) {
          const url = window.URL.createObjectURL(blob);
          window.open(url, "_blank");
        } else {
          console.log("File content is empty");
        }
      }
    } catch (error) {
      console.log("Error fetching file:", error);
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

  const handleFileUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    const formattedFiles = newFiles.map((file) => ({
      filename: file.name,
      mimetype: file.type,
      buffer: {
        type: "Buffer",
        data: Array.from(new Uint8Array(file)),
      },
    }));
    setUploadedFiles([...uploadedFiles, ...formattedFiles]);
  };

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
        formData.append("files", blob, file.filename);
      });

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
    console.log(file);
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
