import React, { useState } from "react";
import { Button, Card, ListGroup, Form } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";

export default function AdminPackageCard({ dynamicTexts, packageName, id }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedDynamicTexts, setEditedDynamicTexts] = useState([
    ...dynamicTexts,
  ]);
  const [editedPackageName, setEditedPackageName] = useState(packageName);

  const constantTexts = [
    "Annual Fee",
    "Doctor Discount",
    "Medicine Discount",
    "Family Discount",
  ];

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const deletePackage = (id) => {
    console.log("Delete package", id);
  };

  const handleInputChange = (index, event) => {
    const updatedDynamicTexts = [...editedDynamicTexts];
    updatedDynamicTexts[index] = event.target.value;
    setEditedDynamicTexts(updatedDynamicTexts);
  };

  const handleSaveClick = () => {
    // Handle saving the edited dynamic texts, e.g., send to server or update state
    console.log("Saving edited dynamic texts:", editedDynamicTexts);
    setIsEditing(false);
  };

  return (
    <Card
      style={{
        width: "300px",
        boxShadow: "0px 4px 4px 0px #adb5bd",
        borderRadius: "3px",
        marginBottom: "60px"
      }}
    >
      <Card.Header className="d-flex flex-column" style={{ height: "120px" }}>
        <div className="d-flex justify-content-end">
          {!isEditing ? (
            <FontAwesomeIcon
              icon={faPenToSquare}
              style={{
                opacity: 1,
                color: "#099BA0 ",
                fontSize: "20px",
                cursor: "pointer",
                marginBottom: "5px"
              }}
              onClick={handleEditClick}
            />
          ) : (
            <FontAwesomeIcon
              icon={faPenToSquare}
              style={{
                opacity: 0,
              }}
              onClick={handleEditClick}
            />
          )}
        </div>
        {isEditing ? (
          <Form.Control
            className="d-flex"
            style={{
              color: "#ff6b35",
              fontWeight: "bold",
              fontSize: "25px",
              marginLeft: "30px",
              border: "none",
              width: "200px",
            }}
            value={editedPackageName}
            onChange={(e) => setEditedPackageName(e.target.value)}
          />
        ) : (
          <Card.Title
            className="d-flex justify-content-center"
            style={{
              color: "#ff6b35",
              fontWeight:"bold",
              fontSize: "25px",
              textAlign: "center",
              marginTop:'20px',
            }}
          >
            {editedPackageName}
          </Card.Title>
        )}
      </Card.Header>
      <ListGroup variant="flush">
        {constantTexts.map((constant, index) => (
          <ListGroup.Item
            key={index}
            className="d-flex justify-content-between"
          >
            <span style={{ fontWeight: "bold", color: "#ADB5BD " }}>
              {constant}
            </span>
            <span
              style={{
                borderLeft: "1px solid #ccc",
                paddingLeft: "10px",
                width: "100px",
              }}
            >
              {isEditing ? (
                <Form.Control
                  type="text"
                  value={editedDynamicTexts[index] || ""}
                  onChange={(e) => handleInputChange(index, e)}
                />
              ) : (
                editedDynamicTexts[index]
              )}
            </span>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Card.Body className="d-flex align-items-center justify-content-center">
        <Button
          style={{ backgroundColor: "#ff6b35" }}
          onClick={isEditing ? handleSaveClick : () => deletePackage(id)}
        >
          {isEditing ? "Save Changes" : "Delete Package"}
          {/* {!isEditing && variant:"danger"} */}
          {!isEditing && (
            <FontAwesomeIcon
              icon={faTrashCan}
              style={{
                opacity: 1,
                color: "#f0f0f0 ",
                fontSize: "20px",
                cursor: "pointer",
                marginLeft: "5px",
              }}
            />
          )}
        </Button>
      </Card.Body>
    </Card>
  );
}

// import React from "react";
// import { Button } from "react-bootstrap";
// import Card from "react-bootstrap/Card";
// import ListGroup from "react-bootstrap/ListGroup";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
// import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
// import PropTypes from 'prop-types';

// export default function AdminPackageCard(props) {
//   //package as prop

//   const constantTexts = ['Annual Fee', 'Doctor Disocunt', 'Medicine Discount', 'Family Discount'];
//   const dynamicTexts = ['Dynamic 1', 'Dynamic 2', 'Dynamic 3', 'Dynamic 4', 'Dynamic 5'];

//   return (
//     <Card
//       style={{
//         width: "300px",
//         boxShadow: "0px 4px 4px 0px #adb5bd",
//         borderRadius: "3px",
//       }}
//     >
//       <Card.Header className="d-flex flex-column" style={{ height: "80px" }}>
//         <div className="d-flex justify-content-end">
//           <FontAwesomeIcon
//             icon={faPenToSquare}
//             style={{
//               opacity: 1,
//               color: "#099BA0 ",
//               fontSize: "20px",
//               cursor: "pointer",
//             }}
//           />
//         </div>
//         <Card.Title
//           className="d-flex"
//           style={{
//             color: "#ff6b35",
//             fontWeight: "bold",
//             fontSize: "25px",
//             marginLeft: "40px",
//           }}
//         >
//           Silver Package
//         </Card.Title>
//       </Card.Header>
//       <ListGroup variant="flush">
//         {constantTexts.map((constant, index) => (
//           <ListGroup.Item key={index} className="d-flex justify-content-between">
//             <span>{constant}</span>
//             <span style={{ borderLeft: '1px solid #ccc', paddingLeft: '10px' }}>{dynamicTexts[index]}</span>
//           </ListGroup.Item>
//         ))}
//       </ListGroup>
//       <Card.Body className="d-flex align-items-center justify-content-center">
//         <Button style={{ backgroundColor: "#ff6b35" }}>
//           Delete Package
//           <FontAwesomeIcon
//             icon={faTrashCan}
//             style={{
//               opacity: 1,
//               color: "#f0f0f0 ",
//               fontSize: "20px",
//               cursor: "pointer",
//               marginLeft: "5px",
//             }}
//           />
//         </Button>
//       </Card.Body>
//     </Card>
//   );
// }
