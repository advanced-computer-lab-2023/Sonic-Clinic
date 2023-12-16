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
  FormControl,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAnglesRight,
  faChevronDown,
  faChevronUp,
  faPlusSquare,
  faSearch,
  faTrashAlt,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { setNewNotifications } from "../../state/notifications";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

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
  const [existingPrescriptions, setExistingPrescriptions] = useState();
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
        setExistingPrescriptions(patients[index].prescreptions);
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
    setSearchAddMedicine("");
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

  const [filteredMedicines, setFilteredMedicines] = useState(medicineData);
  const [searchAddMedicine, setSearchAddMedicine] = useState(""); // Updated the variable name

  const filterMedicines = (searchTerm) => {
    setSearchAddMedicine(searchTerm); // Updated the state variable name

    const filteredResults = medicineData.filter((medicine) =>
      medicine.name.toLowerCase().includes((searchTerm || "").toLowerCase())
    );

    setFilteredMedicines(filteredResults);
  };

  const handleDropdownSelect = (medicine) => {
    setSelectedMedicine(medicine);
    setSearchAddMedicine(""); // Clear the search term when an item is selected
  };

  // Update filtered medicines whenever the search term changes
  useEffect(() => {
    filterMedicines();
  }, [searchAddMedicine, neededMedicineData]);

  const [prescription, setPrescription] = useState([]);
  const [showAddNewMedicineForm, setShowAddNewMedicineForm] = useState(false);
  const [newMedicineName, setNewMedicineName] = useState("");
  const [newMedicineDosage, setNewMedicineDosage] = useState("");

  const addMedicineToPrescription = () => {
    if (selectedMedicine && dosage) {
      const medicineItem = {
        name: selectedMedicine.name,
        price: selectedMedicine.price,
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

  const handleSubmitPrescription = async () => {
    try {
      // Map through the prescription array and convert each object's values to an array of strings
      const prescriptionValues = prescription.map((item) => [
        String(item.name),
        String(item.price),
        String(item.dosage),
      ]);

      const response = await axios.post("/AddPrescription", {
        medicine: prescriptionValues, // Now sending an array of arrays of strings
        patientID: selectedPatient,
        // Add any other necessary prescription data here
      });

      if (response.status === 200) {
        console.log("Prescription saved successfully:", response.data);
        fetchData();

        // Clear the prescription form if the post is successful
        setPrescription([]);
        setSelectedMedicine(null);
        setDosage("");
        setNewMedicineName("");
        setNewMedicineDosage("");
      } else {
        // Handle any statuses that indicate a failed request
        console.error(
          "Prescription submission failed with status:",
          response.status
        );
      }
    } catch (error) {
      // Handle errors from the POST request here
      console.error("Error submitting prescription:", error);
    }

    handleClose(); // Assuming this closes a modal or similar
  };

  useEffect(() => {
    console.log("aho2", existingPrescriptions);
    if (patients && expandedPatient !== null) {
      setExistingPrescriptions(patients[expandedPatient]?.prescreptions || []);
    }
  }, [patients, expandedPatient]);

  const [selectedViewPrescription, setSelectedViewPrescription] =
    useState(null);
  const [showViewSelectedPrescription, setShowViewSelectedPrescription] =
    useState(false);

  const handleViewMoreClick = (prescription) => {
    setSelectedViewPrescription(prescription);
    setShowViewSelectedPrescription(true);
  };

  const handleCloseModal = () => {
    setShowViewSelectedPrescription(false);
    setIsEditMode(false);
    setSelectedMedicine(null);
    setDosage("");
  };

  const [isEditMode, setIsEditMode] = useState(false);
  const [editedDosage, setEditedDosage] = useState("");
  const [editedPrescription, setEditedPrescription] = useState(null);

  const handleEditClick = async () => {
    if (isEditMode) {
      // Cancel edit and reset to original prescription

      setIsEditMode(false);
      setEditedPrescription(null);
    } else {
      // Enter edit mode and initialize editedPrescription with the current prescription
      await fetchMedicineData();
      setIsEditMode(true);
      setEditedPrescription({ ...selectedViewPrescription });
    }
  };

  const handleSaveChanges = async () => {
    try {
      const response = await axios.post("/updatePrescription ", {
        medicine: editedPrescription.medicine, // Now sending an array of arrays of strings
        prescriptionID: editedPrescription._id,
        // Add any other necessary prescription data here
      });

      if (response.status === 200) {
        fetchData();
        setIsEditMode(false);
        setSelectedViewPrescription(editedPrescription);
      } else {
        // Handle any statuses that indicate a failed request
        console.error("Prescription edit failed with status:", response.status);
      }
    } catch (error) {
      // Handle errors from the POST request here
      console.error("Error editing prescription:", error);
    }

    handleClose(); // Assuming this closes a modal or similar
  };

  const handleSaveDosage = async (medicineName) => {
    // Here, implement the API call or logic to save the updated dosage
    console.log(`Saving new dosage for ${medicineName}: ${editedDosage}`);
    setEditedDosage(""); // Reset edited dosage
  };

  const handleDeleteMedicine = (medicineName) => {
    // Filter out the medicine to be deleted
    const updatedMedicines = editedPrescription.medicine.filter(
      (med) => med[0] !== medicineName
    );

    // Update the edited prescription with the modified medicines list
    setEditedPrescription({
      ...editedPrescription,
      medicine: updatedMedicines,
    });
  };
  const renderMedicineItems = () => {
    return (
      <ul>
        {selectedViewPrescription.medicine.map((med, index) => (
          <li key={index}>
            <strong>Name:</strong> {med[0]}
            {isEditMode ? (
              <div>
                <FormControl
                  type="text"
                  value={editedDosage}
                  onChange={(e) => setEditedDosage(e.target.value)}
                />
                <Button
                  variant="outline-success"
                  onClick={() => handleSaveDosage(med[0])}
                >
                  Save
                </Button>
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  onClick={() => handleDeleteMedicine(med[0])}
                  style={{ cursor: "pointer", marginLeft: "10px" }}
                />
              </div>
            ) : (
              <div>
                <strong>Dosage:</strong> {med[2]}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  const handleAddEditButtonClick = () => {
    if (selectedMedicine && dosage) {
      const medicineItem = {
        name: selectedMedicine.name,
        price: selectedMedicine.price,
        dosage,
      };

      // Create a copy of the current medicines and add the new medicine in the same format
      const updatedMedicineList = [
        ...editedPrescription.medicine,
        [
          medicineItem.name,
          String(medicineItem.price),
          String(medicineItem.dosage),
        ],
      ];

      // Update the editedPrescription with the updated medicine list
      setEditedPrescription({
        ...editedPrescription,
        medicine: updatedMedicineList,
      });

      // Reset the selected medicine and dosage inputs
      setSelectedMedicine(null);
      setDosage("");
    }
  };

  const handleEditDosageChange = (medicineName, newDosage) => {
    if (editedPrescription) {
      const updatedMedicine = editedPrescription.medicine.map((med) =>
        med[0] === medicineName ? [med[0], med[1], newDosage] : med
      );
      setEditedPrescription({
        ...editedPrescription,
        medicine: updatedMedicine,
      });
    }
  };
  const handleDownloadPrescription = async () => {
    const queryParameters = new URLSearchParams({
      id: selectedViewPrescription._id,
    }).toString();
    const url = `/downloadPrescriptions?${queryParameters}`;
    try {
      const response = await axios.post(url, null, { responseType: "blob" });
      console.log("Response Status:", response.status);

      if (response.status === 200) {
        // Create a Blob from the response data
        const blob = new Blob([response.data], { type: "application/pdf" });

        // Create a Blob URL for the PDF
        const blobUrl = window.URL.createObjectURL(blob);
        console.log("Blob URL:", blobUrl);

        // Create an anchor element to trigger the download
        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = "prescription.pdf"; // You can set the desired filename
        document.body.appendChild(a);
        console.log("Anchor Element:", a);

        // Programmatically click the anchor element to trigger the download
        a.click();

        // Remove the anchor element from the DOM
        document.body.removeChild(a);

        // Revoke the Blob URL to free up resources
        window.URL.revokeObjectURL(blobUrl);
        console.log("Blob URL Revoked");
      } else {
        console.log("Server error");
      }
    } catch (error) {
      // Handle errors here
      console.error("Error:", error);

      if (error.response && error.response.status === 409) {
        console.log("Conflict error");
      } else {
        console.log("Other error occurred");
      }
    }
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
        (patients.length === 0 ? (
          <div className="msg d-flex justify-content-center align-items-center  ">
            No Available Patients
          </div>
        ) : (
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
                    <Col lg={12}>
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
                            An appointment with {patient.name} has been
                            scheduled
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
                          {existingFiles && existingFiles.length > 0 ? (
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
                            {existingPrescriptions &&
                            existingPrescriptions.length > 0 ? (
                              <ListGroup className="d-flex w-100">
                                {existingPrescriptions.map(
                                  (prescription, index) => (
                                    <Card className="d-flex w-100 p-2 mb-3">
                                      <div className="d-flex justify-content-between w-100">
                                        <div>
                                          <span style={{ color: "#ff6b35" }}>
                                            Prescription {index + 1}
                                          </span>
                                        </div>
                                        <span style={{ color: "black" }}>
                                          {prescription.date
                                            .split("-")
                                            .reverse()
                                            .join("/")}
                                        </span>
                                        <div className="d-flex align-items-center">
                                          <Link
                                            style={{
                                              fontSize: "1rem",
                                              color: "#ff6b35",
                                              textDecoration: "none",
                                            }}
                                            onClick={() =>
                                              handleViewMoreClick(prescription)
                                            }
                                          >
                                            View Details
                                            <FontAwesomeIcon
                                              icon={faAnglesRight}
                                              style={{
                                                fontSize: "0.8rem",
                                                marginLeft: "0.5rem",
                                                transition:
                                                  "transform 0.3s ease-in-out",

                                                animation:
                                                  "arrowAnimation2 1.5s infinite alternate ease-in-out",
                                              }}
                                            />
                                          </Link>
                                        </div>
                                      </div>
                                    </Card>
                                  )
                                )}
                              </ListGroup>
                            ) : (
                              <div>No previous prescriptions found</div>
                            )}
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
          ))
        ))}
      <Modal show={prescriptionVisible} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedPatientPrescription
              ? `Add Prescription for ${selectedPatientPrescription.name}`
              : "Add Prescription"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ fontSize: "1.05rem" }}>
          <div>
            <div style={{ fontWeight: "bold", marginBottom: "0rem" }}>
              Medicine:{" "}
            </div>
            <Dropdown>
              <Dropdown.Toggle
                variant="primary"
                id="medicine-dropdown"
                className="custom-dropdown-toggle"
              >
                {selectedMedicine ? selectedMedicine.name : "Select Medicine"}
              </Dropdown.Toggle>
              <Dropdown.Menu style={{ width: "100%" }}>
                <FormControl
                  type="text"
                  placeholder="Search Medicine"
                  className="form-control"
                  value={searchAddMedicine}
                  onChange={(e) => filterMedicines(e.target.value)}
                />
                {filteredMedicines.map((medicine) => (
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
            <label htmlFor="dosage" style={{ fontWeight: "bold" }}>
              Dosage:
            </label>
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
              variant="primary"
              onClick={handleAddButtonClick}
              className="mt-4 w-50"
            >
              Add Medicine
            </Button>
          </div>
          <div className="w-100">
            {prescription.length > 0 && (
              <div className="mb-1">
                <div
                  style={{
                    fontWeight: "bold",
                    marginBottom: "0.3rem",
                    marginTop: "0.7rem",
                  }}
                >
                  Prescription Items:
                </div>
                <ul>
                  {prescription.map((item, index) => (
                    <li key={index}>
                      {item.name} - {item.dosage}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer>
          {prescription.length > 0 && (
            <Button variant="primary" onClick={handleSubmitPrescription}>
              Submit Prescription
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      <Modal
        show={showViewSelectedPrescription}
        onHide={handleCloseModal}
        style={{ fontSize: "1.05rem" }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Prescription Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedViewPrescription ? (
            <div>
              <p>
                <strong>Date:</strong>{" "}
                {selectedViewPrescription.date?.split("-").reverse().join("/")}
              </p>
              <p>
                <strong>Status:</strong> {selectedViewPrescription.status}
              </p>
              {isEditMode ? (
                <div>
                  {editedPrescription.medicine.map((med, index) => (
                    <Card
                      key={index}
                      className="mb-3"
                      style={{ height: "3.5rem" }}
                    >
                      <Card.Body
                        style={{
                          position: "relative",
                          backgroundColor: "#f0f0f0",
                          height: "3rem",
                        }}
                        className="d-flex flex-row justify-content-between"
                      >
                        <strong>{med[0]}</strong>
                        <div
                          className="d-flex "
                          style={{ marginTop: "-0.4rem" }}
                        >
                          <FormControl
                            type="text"
                            value={med[2]}
                            onChange={(e) =>
                              handleEditDosageChange(med[0], e.target.value)
                            }
                            style={{ width: "10rem", height: "2.3rem" }} // Make the FormControl take all available space
                          />
                          <FontAwesomeIcon
                            icon={faTrashAlt}
                            onClick={() => handleDeleteMedicine(med[0])}
                            style={{
                              cursor: "pointer",
                              color: "#ff6b35",
                              marginLeft: "2rem",
                              marginTop: "0.6rem",
                            }}
                          />
                        </div>
                      </Card.Body>
                    </Card>
                  ))}
                  <div className="d-flex flex-wrap justify-content-between align-items-center">
                    <div>
                      <strong>Add a New Medicine</strong>
                    </div>
                    <div className="d-flex align-items-center justify-content-center mt-3 w-100">
                      <div style={{ width: "50%" }}>
                        <Dropdown>
                          <Dropdown.Toggle
                            variant="primary"
                            id="medicine-dropdown"
                            className="custom-dropdown-toggle"
                          >
                            {selectedMedicine
                              ? selectedMedicine.name
                              : "Select Medicine"}
                          </Dropdown.Toggle>
                          <Dropdown.Menu style={{ width: "100%" }}>
                            <input
                              type="text"
                              placeholder="Search Medicine"
                              className="form-control"
                              value={
                                selectedMedicine ? selectedMedicine.name : ""
                              }
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
                      <div style={{ width: "50%", marginLeft: "10px" }}>
                        <input
                          type="text"
                          id="dosage"
                          className="form-control"
                          placeholder="Enter dosage"
                          value={dosage}
                          onChange={(e) => setDosage(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="d-flex justify-content-center mt-4 w-100">
                      <Button
                        variant="success"
                        onClick={handleAddEditButtonClick}
                        className="w-50"
                      >
                        Add Medicine
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <strong>Medicines:</strong>
                  {selectedViewPrescription.medicine.length === 0 ? (
                    <div>No medicines added.</div>
                  ) : (
                    <div>
                      {selectedViewPrescription.medicine.map((med, index) => (
                        <Card
                          key={index}
                          className="mb-3"
                          style={{ marginTop: "0.5rem", height: "3.5rem" }}
                        >
                          <Card.Body
                            style={{
                              backgroundColor: "#f0f0f0",
                              height: "3rem",
                            }}
                            className="d-flex justify-content-between align-items-center"
                          >
                            <strong>{med[0]}</strong>
                            <strong>
                              Dosage:
                              <span style={{ fontWeight: "normal" }}>
                                {" "}
                                {med[2]}
                              </span>{" "}
                            </strong>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>Loading prescription details...</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {isEditMode ? (
            <>
              <div className="d-flex align-items-center justify-content-between w-100">
                <div className="d-flex align-items-center justify-content-center">
                  <Button
                    variant="primary"
                    onClick={handleSaveChanges}
                    style={{ marginTop: "10px" }}
                  >
                    Save Changes
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={handleEditClick}
                    style={{ marginTop: "10px", marginLeft: "10px" }}
                  >
                    Cancel Edit
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="d-flex align-items-center justify-content-between w-100">
                <div className="d-flex align-items-center justify-content-center">
                  {selectedViewPrescription &&
                    selectedViewPrescription.status !== "Filled" && (
                      <Button
                        variant="secondary"
                        onClick={() => handleEditClick()}
                      >
                        Edit Prescription
                      </Button>
                    )}
                </div>
                <div className="d-flex align-items-center justify-content-center">
                  <Button onClick={handleDownloadPrescription}>
                    Download PDF
                  </Button>
                </div>
              </div>
            </>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DrShowPatients;
