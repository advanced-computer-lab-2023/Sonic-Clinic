import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Row,
  Form,
  Button,
  ListGroup,
  Spinner,
  Modal,
  Dropdown,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faSearch,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { setNewNotifications } from "../../state/notifications";
import { useDispatch } from "react-redux";

function DrShowPatients({
  patients,
  setPatients,
  responseData,
  upcomingApp,
  loading,
  fetchData,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedPatient, setExpandedPatient] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadVisible, setUploadVisible] = useState(false);

  const [prescriptionVisible, setPrescriptionVisible] = useState(false);
  const [addingPrescription, setAddingPrescription] = useState("adding");
  const [selectedPatientPrescription, setSelectedPatientPrescription] =
    useState(null);

  const [followUpModal, setFollowUpModal] = useState(false);
  const [followUpDateTime, setFollowUpDateTime] = useState(null);
  const [existingFiles, setExistingFiles] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);

  const dispatch = useDispatch();

  const handleFileUpload = async (e) => {
    const newFiles = Array.from(e.target.files);
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

  const handleRemoveFile = (index) => {
    const updatedFiles = [...uploadedFiles];
    updatedFiles.splice(index, 1);
    setUploadedFiles(updatedFiles);
  };

  function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = `${(now.getMonth() + 1).toString().padStart(2, "0")}`;
    const day = `${now.getDate().toString().padStart(2, "0")}`;
    const hours = `${now.getHours().toString().padStart(2, "0")}`;
    const minutes = `${now.getMinutes().toString().padStart(2, "0")}`;

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  // Function to format the date of birth
  function formatDateOfBirth(isoDate) {
    if (!isoDate) {
      return "N/A"; // Handle cases where dateOfBirth is missing
    }

    const dateObj = new Date(isoDate);
    const day = dateObj.getDate();
    const month = dateObj.getMonth() + 1; // Months are zero-based
    const year = dateObj.getFullYear();

    return `${day}/${month}/${year}`;
  }

  const handleSearch = () => {
    // Filter patients based on the search term
    setPatients(
      responseData.filter((patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const toggleExpand = (index, id) => {
    if (expandedPatient === index) {
      setExpandedPatient(null);
    } else {
      setExpandedPatient(index);
      setSelectedPatient(id);
      if (patients && patients[index]) {
        setExistingFiles(patients[index].medicalHistory);
      }
    }
  };

  const viewMedicalRecord = async (file) => {
    try {
      const response = await axios.post(
        "/viewPatientMedicalHistoryForDoctors",
        {
          id: selectedPatient,
          filename: file,
        },
        {
          responseType: "text", // Set the response type to 'text'
        }
      );

      if (response.status === 200) {
        const byteString = response.data;
        const byteNumbers = byteString.split(",").map(Number);
        const uint8Array = new Uint8Array(byteNumbers);

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

  const addFiles = async (id) => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      uploadedFiles.forEach((file, index) => {
        const blob = new Blob([file.buffer.data], { type: file.mimetype });

        const blobUrl = URL.createObjectURL(blob);
        console.log(blobUrl);

        formData.append("files", blob, file.filename);
      });
      console.log("FILE DATA ", formData);

      const response = await axios.post(
        `/uploadFilesbyDoctors?id=${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        fetchData();

        setExistingFiles((prevFiles) => [...prevFiles, ...uploadedFiles]);
        setUploadedFiles([]);
      }
    } catch (error) {
      console.log("Oops, not added", error);
    } finally {
      setIsLoading(false); // Set loading to false when the operation is complete (success or failure)
    }
  };

  const scheduleFollowUp = async (patientID) => {
    if (followUpDateTime != null) {
      const [datePart, timePart] = followUpDateTime.split("T");
      try {
        const response = await axios.post("/addAppointmentByPatientID", {
          date: datePart,
          description: "Follow up",
          status: "upcoming",
          patientID: patientID,
          time: timePart,
        });
        if (response.status === 201) {
          dispatch(setNewNotifications(true));
          setFollowUpDateTime(null);
          setFollowUpModal(false);
          setConfirmModal(true);
        }
      } catch (error) {
        console.log();
      }
    }
  };
  const handleShowPrescriptionModal = async (patient) => {
    setSelectedPatientPrescription(patient);

    // Call the function to fetch medicine data here
    await fetchMedicineData();

    setPrescriptionVisible(!prescriptionVisible);
  };

  const handleClose = () => {
    setPrescriptionVisible(false);
    setSelectedPatientPrescription(null);
    setSelectedMedicine(null);
    setSearchTermMedicine("");
    setDosage("");
    setPrescription([]); // Close the modal first
  };
  const [medicineData, setMedicineData] = useState([]);
  const fetchMedicineData = async () => {
    try {
      const response = await axios.get("/viewMedicines"); // Replace with the actual endpoint
      if (response.status === 200) {
        setMedicineData(response.data); // Assuming the response data is an array of medicine objects
      }
    } catch (error) {
      console.error("Error fetching medicine data:", error);
    }
  };
  const neededMedicineData = medicineData;
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [dosage, setDosage] = useState(null);
  // State for the search term
  const [searchTermMedicine, setSearchTermMedicine] = useState("");

  // State for filtered medicines
  const [filteredMedicines, setFilteredMedicines] =
    useState(neededMedicineData);

  // Function to filter medicines based on search term
  const filterMedicines = () => {
    const filtered = neededMedicineData.filter((medicine) =>
      medicine.name.toLowerCase().startsWith(searchTermMedicine.toLowerCase())
    );
    setFilteredMedicines(filtered);
  };

  // Update filtered medicines whenever the search term changes
  useEffect(() => {
    filterMedicines();
  }, [searchTermMedicine, neededMedicineData]);

  const handleDropdownSelect = (medicine) => {
    setSelectedMedicine(medicine);
    setSearchTerm(""); // Clear the search term when an item is selected
  };

  const [prescription, setPrescription] = useState([]);
  const [showAddNewMedicineForm, setShowAddNewMedicineForm] = useState(false);
  const [newMedicineName, setNewMedicineName] = useState("");
  const [newMedicineDosage, setNewMedicineDosage] = useState("");

  const addMedicineToPrescription = () => {
    if (selectedMedicine && dosage) {
      const medicineItem = {
        medicine: selectedMedicine,
        dosage,
      };
      setPrescription([...prescription, medicineItem]);
      setSelectedMedicine(null);
      setDosage("");
    }
  };

  const handleAddButtonClick = () => {
    addMedicineToPrescription();
  };

  const handleSubmitPrescription = () => {
    // Handle submitting the prescription, you can do whatever you want here.
    // For example, you can send the prescription to the server.
    // Reset the state or close the modal as needed.
    console.log("Prescription submitted:", prescription);
    // Reset the state
    setPrescription([]);
    setSelectedMedicine(null);
    setDosage("");
    setNewMedicineName("");
    setNewMedicineDosage("");
    // Close the modal
    handleClose();
  };

  return (
    <div>
      <div
        className="d-flex justify-content-center align-items-center flex-row"
        style={{
          width: "95%",
          marginBottom: "1rem",
          marginLeft: "1rem",
        }}
      >
        <Form.Control
          type="text"
          placeholder="Search Patients"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ height: "2.5rem" }}
        />
        <Button
          variant="primary"
          type="submit"
          style={{ width: "10rem", height: "2.5rem", marginLeft: "1rem" }}
          onClick={handleSearch}
        >
          Search
          <FontAwesomeIcon
            icon={faSearch}
            style={{
              opacity: 1,
              color: "white",
              fontSize: "15px",
              marginLeft: "10px",
            }}
          />
        </Button>
      </div>
      {(isLoading || loading) && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      )}
      {(!isLoading || !loading) &&
        patients.map((patient, index) => (
          <Card className="mb-4 mx-3 bg-white" key={patient.username}>
            <Card.Header
              className="d-flex align-items-center justify-content-between"
              onClick={() => toggleExpand(index, patient._id)}
              style={{ cursor: "pointer" }}
            >
              <span>{patient.name}</span>
              <FontAwesomeIcon
                icon={expandedPatient === index ? faChevronUp : faChevronDown}
              />
            </Card.Header>
            {expandedPatient === index && (
              <Card.Body>
                <Row>
                  <Col lg={8}>
                    <Card.Text>
                      <Button
                        style={{ marginBottom: "1rem" }}
                        onClick={() =>
                          followUpModal
                            ? scheduleFollowUp(patient._id)
                            : setFollowUpModal(true)
                        }
                      >
                        {followUpModal ? "Save" : "Schedule Follow-up"}
                      </Button>
                      {followUpModal && (
                        <div>
                          <Form.Group style={{ marginBottom: "1rem" }}>
                            <Form.Control
                              type="datetime-local"
                              // value={followUpDateTime}
                              onChange={(e) =>
                                setFollowUpDateTime(e.target.value)
                              }
                              min={getCurrentDateTime()}
                            />
                          </Form.Group>
                        </div>
                      )}
                      <Modal show={confirmModal}>
                        <Modal.Header>
                          <Modal.Title>Appointment Confirmed</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                          An appointment with {patient.name} has been scheduled
                        </Modal.Body>
                        <Modal.Footer>
                          <Button
                            variant="secondary"
                            onClick={() => setConfirmModal(false)}
                          >
                            Close
                          </Button>
                        </Modal.Footer>
                      </Modal>

                      {upcomingApp && <div>Has an upcoming appointment</div>}
                      <div className="patient-info">
                        <p>
                          Date of birth:{" "}
                          {formatDateOfBirth(patient.dateOfBirth)}
                        </p>
                        <p>Gender: {patient.gender}</p>
                        <p style={{ fontWeight: "bold" }}>Medical History:</p>
                        {existingFiles ? (
                          <ListGroup>
                            {existingFiles.map((file, index) => (
                              <ListGroup.Item key={index}>
                                <a
                                  onClick={() =>
                                    viewMedicalRecord(file.filename)
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: "#212529",
                                    textDecoration: "underline",
                                    cursor: "pointer",
                                  }}
                                >
                                  {file.filename}
                                </a>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        ) : (
                          <div>No previous history found</div>
                        )}

                        <label
                          style={{
                            marginTop: "1rem",
                            cursor: "pointer",
                            color: "#099BA0",
                            textDecoration: "underline",
                            marginBottom: "1rem",
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
                              <ul
                                style={{
                                  marginBottom: "1rem",
                                }}
                              >
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
                                }}
                                onClick={() => addFiles(patient._id)}
                              >
                                Confirm Add
                              </div>
                            </div>
                          )}
                          <p style={{ fontWeight: "bold" }}>Prescriptions:</p>
                          <label
                            style={{
                              marginTop: "1rem",
                              cursor: "pointer",
                              color: "#099BA0",
                              textDecoration: "underline",
                              marginBottom: "1rem",
                            }}
                            onClick={() => {
                              handleShowPrescriptionModal(patient);
                            }}
                          >
                            Add New Prescription
                          </label>
                        </div>
                      </div>
                    </Card.Text>
                  </Col>
                </Row>
              </Card.Body>
            )}
          </Card>
        ))}
      <Modal show={prescriptionVisible} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedPatientPrescription
              ? `Add Prescription for ${selectedPatientPrescription.name}`
              : "Add Prescription"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <p>Medicine: </p>
            <Dropdown>
              <Dropdown.Toggle
                variant="primary"
                id="medicine-dropdown"
                className="custom-dropdown-toggle"
              >
                {selectedMedicine ? selectedMedicine.name : "Select Medicine"}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ width: "100%" }}>
                <input
                  type="text"
                  placeholder="Search Medicine"
                  className="form-control"
                  value={selectedMedicine ? selectedMedicine.name : ""}
                  onChange={() => {}}
                  readOnly
                />
                {medicineData.map((medicine) => (
                  <Dropdown.Item
                    key={medicine.id}
                    onClick={() => handleDropdownSelect(medicine)}
                  >
                    {medicine.name}
                  </Dropdown.Item>
                ))}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          <div className="mt-3">
            <label htmlFor="dosage">Dosage:</label>
            <input
              type="text"
              id="dosage"
              className="form-control"
              placeholder="Enter dosage"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
            />
          </div>
          <div className="d-flex justify-content-center">
            <Button
              variant="success"
              onClick={handleAddButtonClick}
              className="mt-4 w-50"
            >
              Add Medicine
            </Button>
          </div>
        </Modal.Body>

        <Modal.Footer>
          <div className="w-100">
            {prescription.length > 0 && (
              <div className="mb-3">
                <p>Prescription Items:</p>
                <ul>
                  {prescription.map((item, index) => (
                    <li key={index}>
                      {item.medicine.name} - {item.dosage}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {prescription.length > 0 && (
            <Button variant="primary" onClick={handleSubmitPrescription}>
              Submit Prescription
            </Button>
          )}
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DrShowPatients;
