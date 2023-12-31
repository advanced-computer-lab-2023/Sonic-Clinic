import axios from "axios";
import * as React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import FormPassword from "../FormPassword";
import FormInput from "../FormInput";
import { Dropdown, Form, Spinner } from "react-bootstrap";

const DrSignupForm = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [rate, setRate] = useState("");
  const [affiliation, setAffiliation] = useState("");
  const [education, setEducation] = useState("");
  const [speciality, setSpeciality] = useState("Cardiology");
  const [doctorID, setdoctorID] = useState(null);
  const [medicalLicense, setMedicalLicense] = useState(null);
  const [medicalDegree, setMedicalDegree] = useState(null);
  const [error1, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setError(null);

    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !birthdate ||
      !username ||
      !education ||
      !affiliation ||
      !speciality ||
      !rate ||
      !medicalDegree ||
      !medicalLicense ||
      !doctorID
    ) {
      setError("Please fill in all fields");
      console.log(error1);
      return;
    }
    if (!username.trim()) {
      setError("Username is required.");
      return;
    }
    //Validation For Email input field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const englishOnlyRegex = /^[\x00-\x7F]*$/;

    if (!email) {
      setError("Email field cannot be empty.");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Invalid email format.");
      return;
    }
    if (!englishOnlyRegex.test(email)) {
      setError("Email must be in English only.");
      return;
    }
    if (email.length > 320) {
      setError("Email exceeds maximum character limit (320).");
      return;
    }
    if (/[^\x00-\x7F]/.test(email)) {
      setError("Email cannot contain emojis or special characters.");
      return;
    }
    if (/\s/.test(email)) {
      setError("Email cannot contain spaces.");
      return;
    }
    // Validation for Last Name
    const nameRegex = /^[^\s]+(\s[^\s]+)?$/;

    if (name.length < 2) {
      setError("name must be at least 2 characters.");
      return;
    }

    if (!nameRegex.test(name)) {
      setError(
        "Name must contain either one name or two names with only one space between them."
      );
      return;
    }

    //Validation for Password Field
    var uppercaseRegex = /[A-Z]/;
    var lowercaseRegex = /[a-z]/;
    var digitRegex = /[0-9]/;
    var specialCharRegex = /[~!@#$%^&*_+=`|(){}[\]:;"'<>,.?/-]/;

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }
    const twentyYearsAgo = new Date();
    twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 20);

    if (new Date(birthdate) > twentyYearsAgo) {
      setError("You must be at least 20 years old to sign up.");
      return;
    }

    if (!uppercaseRegex.test(password)) {
      setError("Password must contain at least one uppercase letter");
      return;
    }

    if (!lowercaseRegex.test(password)) {
      setError("Password must contain at least one lowercase letter");
      return;
    }

    if (!digitRegex.test(password)) {
      setError("Password must contain at least one digit");
      return;
    }

    if (!specialCharRegex.test(password)) {
      setError("Password must contain at least one special character");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    } else {
      try {
        setLoading(true);
        const response = await axios.post("/addPotentialDoctor", {
          username: username,
          name: name,
          email: email,
          password: password,
          dateOfBirth: birthdate,
          hourlyRate: rate,
          affiliation: affiliation,
          educationalBackground: education,
          specialty: speciality,
        });

        if (response.status === 201) {
          setLoading(false);
          setName("");
          setBirthdate("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setUsername("");
          setRate("");
          setAffiliation("");
          setEducation("");
          setSpeciality("");
          setdoctorID(null);
          setMedicalLicense(null);
          setMedicalDegree(null);
          setSuccess("Your application will be reviewed");
          setError(null);
          try {
            const formData = new FormData();
            if (medicalLicense) {
              console.log("MEDICAL LICENSE", medicalLicense);

              try {
                // Read the file data as a Uint8Array
                const fileArrayBuffer = await medicalLicense.arrayBuffer();
                const fileUint8Array = new Uint8Array(fileArrayBuffer);

                // Format the file
                const formattedFile = {
                  filename: medicalLicense.name,
                  mimetype: medicalLicense.type,
                  buffer: {
                    type: "Buffer",
                    data: Array.from(fileUint8Array),
                  },
                };

                console.log(`Processed file: ${medicalLicense.name}`);

                // Check if any errors occurred during processing
                if (!formattedFile) {
                  console.error("Error processing file:", medicalLicense.name);
                  return;
                }

                const blob = new Blob([formattedFile.buffer.data], {
                  type: formattedFile.mimetype,
                });

                formData.append("files", blob, formattedFile.filename);

                console.log(
                  "formData after processing medicalLicense:",
                  formData
                );
              } catch (error) {
                console.error(
                  "Error processing file:",
                  medicalLicense.name,
                  error
                );
              }
            }
            // Format and append medicalLicense file
            if (medicalDegree) {
              try {
                // Read the file data as a Uint8Array
                const fileArrayBuffer = await medicalDegree.arrayBuffer();
                const fileUint8Array = new Uint8Array(fileArrayBuffer);

                // Format the file
                const formattedFile = {
                  filename: medicalDegree.name,
                  mimetype: medicalDegree.type,
                  buffer: {
                    type: "Buffer",
                    data: Array.from(fileUint8Array),
                  },
                };

                console.log(`Processed file: ${medicalDegree.name}`);

                // Check if any errors occurred during processing
                if (!formattedFile) {
                  console.error("Error processing file:", medicalDegree.name);
                  return;
                }

                const blob = new Blob([formattedFile.buffer.data], {
                  type: formattedFile.mimetype,
                });

                formData.append("files", blob, formattedFile.filename);

                console.log(
                  "formData after processing medicalLicense:",
                  formData
                );
              } catch (error) {
                console.error(
                  "Error processing file:",
                  medicalDegree.name,
                  error
                );
              }
            }
            // Format and append doctorID file
            if (doctorID) {
              try {
                // Read the file data as a Uint8Array
                const fileArrayBuffer = await doctorID.arrayBuffer();
                const fileUint8Array = new Uint8Array(fileArrayBuffer);

                // Format the file
                const formattedFile = {
                  filename: doctorID.name,
                  mimetype: doctorID.type,
                  buffer: {
                    type: "Buffer",
                    data: Array.from(fileUint8Array),
                  },
                };

                console.log(`Processed file: ${doctorID.name}`);

                // Check if any errors occurred during processing
                if (!formattedFile) {
                  console.error("Error processing file:", doctorID.name);
                  return;
                }

                const blob = new Blob([formattedFile.buffer.data], {
                  type: formattedFile.mimetype,
                });

                formData.append("files", blob, formattedFile.filename);

                console.log(
                  "formData after processing medicalLicense:",
                  formData
                );
              } catch (error) {
                console.error(
                  "Error processing file:",
                  medicalDegree.name,
                  error
                );
              }
            }
            const response2 = await axios.post(
              `/uploadFilesForPotentialDoctor?username=${username}`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            if (response2.status === 200) {
              setLoading(false);
              setName("");
              setBirthdate("");
              setEmail("");
              setPassword("");
              setConfirmPassword("");
              setUsername("");
              setRate("");
              setAffiliation("");
              setEducation("");
              setSpeciality("");
              setdoctorID(null);
              setMedicalLicense(null);
              setMedicalDegree(null);
              setSuccess("Your application will be reviewed");
              setError(null);
            }
          } catch (error) {}
        } else {
          setError("Signup failed");
          setLoading(false);
        }
      } catch (error) {
        if (error.response && error.response.status === 409) {
          setError("Username taken!");
          setLoading(false);
        } else if (error.response && error.response.status !== 200) {
          setError("Signup failed");
          setLoading(false);
        } else {
          setError(
            "An error occurred while signing up. Please try again later."
          );
          setLoading(false);
        }
      }
    }
  };

  return (
    <div className="col-9 form-container">
      <div
        className="form-title"
        style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontWeight: 600,
          fontSize: "1.71rem",
        }}
      >
        Submit a request to get started!
      </div>
      <form className="rounded-3" onSubmit={handleSubmit}>
        <div className="col">
          <div className="form-group">
            <FormInput
              name="Full Name"
              type="text"
              placeholder="John Doe"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <FormInput
              name="Birth date"
              type="date"
              onChange={(e) => setBirthdate(e.target.value)}
              value={birthdate}
            />
          </div>
          <div className="col">
            <FormInput
              name="Username"
              placeholder="ElinaJohn1"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <FormInput
              name="Hourly Rate"
              type="number"
              placeholder="50"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>
          <div className="col">
            <FormInput
              name="Affiliation"
              placeholder="ZZZ Hospital"
              type="text"
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
            />
          </div>
        </div>
        <div className="row">
          <div className="col">
            <FormInput
              name="Educational Background"
              type="text"
              placeholder="MBA"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
            />
          </div>
          <div className="col">
            <Form.Group controlId="SpecialtySelect">
              <Form.Label
                style={{
                  width: "7.75rem",
                  height: "1.1875rem",
                  flexShrink: 0,
                  color: "var(--flowkit-charcoal, #222)",
                  fontSize: "0.75rem",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                }}
              >
                Specialty
              </Form.Label>

              <Dropdown
                onSelect={(selectedValue) => setSpeciality(selectedValue)}
              >
                <Dropdown.Toggle
                  id="dropdown-basic"
                  className="custom-dropdown-toggle"
                >
                  {speciality === "" ? "Select Speciality" : speciality}
                </Dropdown.Toggle>

                <Dropdown.Menu style={{ width: "100%" }}>
                  <Dropdown.Item eventKey="Cardiology">
                    Cardiology
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="Orthopedics">
                    Orthopedics
                  </Dropdown.Item>
                  <Dropdown.Item eventKey="Oncology">Oncology</Dropdown.Item>
                  <Dropdown.Item eventKey="Neurology">Neurology</Dropdown.Item>
                  <Dropdown.Item eventKey="Pediatrics">
                    Pediatrics
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Form.Group>
          </div>
          <div className="col">
            <label
              htmlFor="fileInput"
              style={{
                width: "7.75rem",
                height: "1.1875rem",
                flexShrink: 0,
                color: "var(--flowkit-charcoal, #222)",
                fontSize: "0.75rem",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal",
              }}
            >
              Medical License
            </label>
            <input
              type="file"
              accept=".pdf"
              // value={medicalLicense}
              onChange={(e) => setMedicalLicense(e.target.files[0])}
              style={{
                color: "#05afb9",
                fontSize: "0.93rem",
                marginBottom: "1rem",
              }}
              id="licenseInput"
            />
          </div>
          <div className="col">
            <label
              htmlFor="fileInput"
              style={{
                width: "7.75rem",
                height: "1.1875rem",
                flexShrink: 0,
                color: "var(--flowkit-charcoal, #222)",
                fontSize: "0.75rem",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal",
              }}
            >
              Medical Degree
            </label>
            <input
              type="file"
              accept=".pdf"
              // value={medicalDegree}
              onChange={(e) => setMedicalDegree(e.target.files[0])}
              style={{
                color: "#05afb9",
                fontSize: "0.93rem",
                marginBottom: "1rem",
              }}
              id="degreeInput"
            />
          </div>
          <div className="col">
            <label
              style={{
                width: "7.75rem",
                height: "1.1875rem",
                flexShrink: 0,
                color: "var(--flowkit-charcoal, #222)",
                fontSize: "0.75rem",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal",
              }}
            >
              Doctor ID
            </label>
            <input
              type="file"
              accept=".pdf"
              // value={doctorID}
              onChange={(e) => setdoctorID(e.target.files[0])}
              style={{
                color: "#05afb9",
                fontSize: "0.93rem",
                marginBottom: "0.75rem",
              }}
              id="IdInput"
            />
          </div>
        </div>
        <FormInput
          name="Email"
          type="email"
          placeholder="john.doe@ibm.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormPassword
          id="password"
          name="Password"
          type="password"
          placeholder="**************"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormPassword
          name="Confirm Password"
          type="password"
          placeholder="**************"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <button
          id="nextbtn"
          className="w-100 btn-sm custom-button"
          onClick={handleClick}
          disabled={loading} // Disable the button when loading
        >
          {loading ? (
            <Spinner animation="border" size="sm" role="status" />
          ) : (
            "Next"
          )}
        </button>
        <div className="form-comment" style={{ cursor: "default" }}>
          Have an account?{" "}
          <div
            className="text-decoration-none link-decoration"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Login
          </div>
        </div>
        {error1 && <div className="error">{error1}</div>}
        {success && <div className="msg">{success}</div>}
      </form>
    </div>
  );
};

export default DrSignupForm;
