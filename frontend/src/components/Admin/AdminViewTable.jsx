import React, {useEffect,useState} from "react";
import Table from "react-bootstrap/Table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export default function AdminViewTable({onAdmins, api}) {

  const [loading, setLoading] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [username, setUsername] = useState("");
  const [error1, setError] = useState(null);
  const [loadingg, isLoading] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);
  
  const fetchData = async () => {
    try {
      const response = await axios.get(api);
      if (response.status === 200) {
        if(api==="/viewAllDoctors")
           setResponseData(response.data.doctors[0]);
        if(api==="/viewAllPatients")
           setResponseData(response.data.patients);
        if(api==="/viewAllAdmins")
           setResponseData(response.data.admins);
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

  const deleteUser = async (e) => {
    // e.preventDefault();
    setError(null);
    try {
      let method = "";
      if(api==="/viewAllDoctors")
      method = "/removeDoctor";
      if(api==="/viewAllPatients")
      method = "/removePatient";
      if(api==="/viewAllAdmins")
      method = "/removeAdmin";

      const response = await axios.delete(method, {
        username: username,
      });

      if (response.status === 200) {
        console.log("Successful");
      }
    } 
    catch (error) {
      console.error("Error:", error);
      setError("Error");
      isLoading(false);
    }
    console.log('Deleting user with username:', username);
  };

  return (
    <Table striped bordered hover variant="light" style={{ width: "1000px" }}>
      <thead>
        <tr>
          {!onAdmins && <th style={{ color: "#099BA0" }}>Full Name</th>}
          <th style={{ color: "#099BA0" }}>Username</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user._id}>
            {!onAdmins && <td>{user.name}</td>}
            <td>{user.username} </td>
            <td>
              <FontAwesomeIcon
                icon={faTrashCan}
                onClick={() => deleteUser((e)=>setUsername(username))} 
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
