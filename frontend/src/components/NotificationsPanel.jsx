import React from "react";
import { ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";

const NotificationsPanel = ({ who, isOpen, closePanel }) => {
  const panelStyles = {
    position: "fixed",
    top: 0,
    right: isOpen ? 0 : "-100%", // Slide the panel in or out
    width: "35rem",
    height: "100%",
    backgroundColor: "#fff",
    boxShadow: "-2px 0 5px rgba(0, 0, 0, 0.2)",
    transition: "right 0.3s ease-out",
    zIndex: 999,
    fontSize: "1rem",
  };

  const contentStyles = {
    padding: "1rem",
  };

  const notifications = [
    { message: "New message from Dr. Smith", new: false },
    { message: "Appointment reminder for tomorrow", new: false },
    { message: "Payment received", new: true },
  ];

  const resetNewNotifications = () => {
    notifications.map((notification) => ({
      ...notification,
      new: false,
    }));
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
              <div className="ms-2 me-auto">{notification.message}</div>
              {notification.new && (
                <span
                  style={{
                    width: "0.7rem",
                    height: "0.7rem",
                    borderRadius: "50%",
                    backgroundColor: "#ff6b35",
                    marginTop: "0.5rem",
                  }}
                />
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </div>
    </div>
  );
};

export default NotificationsPanel;
