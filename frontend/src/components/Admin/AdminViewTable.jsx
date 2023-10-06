import React from "react";
import Table from "react-bootstrap/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

export default function AdminViewTable(props) {
  const deleteUser = (username) => {
    console.log('Deleting user with username:', username);
  };

  const isAdmins= props.onAdmins?true:false;

  return (
    <Table striped bordered hover variant="light" style={{ width: "1000px" }}>
      <thead>
        <tr>
          {!isAdmins && <th style={{ color: "#099BA0" }}>First Name</th>}
          {!isAdmins && <th style={{ color: "#099BA0" }}>Last Name</th>}
          <th style={{ color: "#099BA0" }}>Username</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {props.users.map((user) => (
          <tr key={user.id}>
            {!isAdmins && <td>{user.firstName}</td>}
            {!isAdmins && <td>{user.lastName}</td>}
            <td>{user.username}</td>
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
  );
}
