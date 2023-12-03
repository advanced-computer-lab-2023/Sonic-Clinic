import React from "react";
import { ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const NotificationsPanel = ({ who, isOpen, closePanel }) => {
  const panelStyles = {
    position: "fixed",
    top: 0,
    width: "35rem",
    height: "100%",
    backgroundColor: "#fff",
    boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.2)",
    transition: "right 0.5s ease-in-out", // Transition for sliding effect
    right: isOpen ? 0 : "-35rem", // Slide the panel in or out
    zIndex: 999,
    fontSize: "1rem",
  };

  const contentStyles = {
    padding: "1rem",
  };

  const notifications = [
    "New message from Dr. Smith",
    "Appointment reminder for tomorrow",
    "Payment received",
  ];

  const resetNewNotifications = () => {
    //call the api that changes the flag
  };

  const reverseNotifications = [...notifications].reverse();

  return (
    <div style={panelStyles}>
      <div style={contentStyles}>
        <div className="d-flex justify-content-between p-2">
          <div
            style={{
              fontSize: "1.2rem",
              color: "transparent",
              fontWeight: "bold",
            }}
          >
            Your Notifications
          </div>
          <FontAwesomeIcon
            icon={faX}
            onClick={() => {
              resetNewNotifications();
              closePanel();
            }}
            style={{
              fontWeight: "bold",
              fontSize: "1.2rem",
              color: "#05afb9",
            }}
          />
        </div>

        <ListGroup as="ol">
          {reverseNotifications.map((notification, index) => (
            <ListGroup.Item
              key={index}
              as="li"
              className="d-flex justify-content-between align-items-start"
            >
              <div className="ms-2 me-auto">{notification}</div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  );
};

export default NotificationsPanel;
