import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan, faXmark, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Button, Modal, Form } from "react-bootstrap";
import AddNewAdmin from "../../forms/AddNewAdmin";
import axios from "axios";

export default function AdminViewTable({ onAdmins, onDocs, api }) {
  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [username, setUsername] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [loadingg, isLoading] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddNewAdmin, setShowAddNewAdmin] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(api);

      if (response.status === 200) {
        if (api === "/viewAllDoctors") setResponseData(response.data.doctors);
        if (api === "/viewAllPatients") setResponseData(response.data.patients);
        if (api === "/viewAllAdmins") setResponseData(response.data.admins);
      } else if (response.status === 304) {
        if (api === "/viewAllAdmins") setResponseData(response.data.admins);
      } else {
        console.log("Server error");
      }
      setLoading(false);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError("No data found.");
      } else if (error.response && error.response.status === 500) {
        setError("Server Error");
      }
      setLoading(false);
    }
  };

  const users = responseData;
  console.log(users);
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {}, [username]);

  const toggleAddNewAdmin = () => {
    setShowAddNewAdmin(!showAddNewAdmin);
  };

  const addBtnText = showAddNewAdmin ? "Close form" : "Add new adminstrator";

  const iconStyle = {
    opacity: 1,
    color: "#f0f0f0",
    fontSize: "20px",
    cursor: "pointer",
    marginLeft: "10px",
  };

  const deleteUser = async (usernamee) => {
    setError(null);
    setUsername(usernamee);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const actuallyDelete = async () => {
    try {
      let method = "";
      if (api === "/viewAllDoctors") method = "/removeDoctor";
      if (api === "/viewAllPatients") method = "/removePatient";
      if (api === "/viewAllAdmins") method = "/removeAdmin";

      const response = await axios.delete(`${method}?username=${username}`);

      if (response.status === 200) {
        fetchData();
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error");
      isLoading(false);
    }

    setTimeout(() => {
      setError(null); // Clear the error after 5 seconds
    }, 5000);
    setShowModal(false);
  };

  return (
    <>
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer className="d-flex align-items-center justify-content-center">
          <Button variant="secondary" onClick={actuallyDelete}>
            Yes
          </Button>
          <Button variant="primary" onClick={handleClose}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
      <div
        className="justify-content-between"
        style={{
          display: "flex",
          flexDirection: "row",
          width: "65rem",
          marginBottom: "1rem",
        }}
      >
        <Form.Control
          type="Text"
          placeholder="Search by name"
          style={{ height: "2.5rem" }}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {onAdmins && (
        <Button
          style={{ marginLeft: "51.5rem", marginBottom: "1rem" }}
          id="newAdminForm"
          onClick={toggleAddNewAdmin}
        >
          {addBtnText}
          {showAddNewAdmin ? (
            <FontAwesomeIcon icon={faXmark} style={iconStyle} />
          ) : (
            <FontAwesomeIcon icon={faPlus} style={iconStyle} />
          )}
        </Button>
      )}

      <div style={{ marginLeft: "52rem" }}>
        {showAddNewAdmin && (
          <AddNewAdmin fetchData={fetchData} closeForm={toggleAddNewAdmin} />
        )}
      </div>

      <Table striped bordered hover variant="light" style={{ width: "65rem" }}>
        <thead>
          <tr>
            <th style={{ color: "#099BA0" }}>Full Name</th>
            <th style={{ color: "#099BA0" }}>Username</th>
            <th style={{ color: "#099BA0" }}>Email</th>
            {onDocs && <th style={{ color: "#099BA0" }}>Affiliation</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users &&
            filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.username} </td>
                <td>{user.email}</td>
                {onDocs && <td>{user.affiliation}</td>}
                <td>
                  <FontAwesomeIcon
                    icon={faTrashCan}
                    onClick={() => deleteUser(user.username)}
                    style={{
                      opacity: 1,
                      color: "#ff6b35",
                      fontSize: "20px",
                      cursor: "pointer",
                    }}
                  />
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
}
