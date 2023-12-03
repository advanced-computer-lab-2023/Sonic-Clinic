import React, { useEffect, useState } from "react";
import { ListGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { setNewNotifications } from "../state/notifications";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

const NotificationsPanel = ({ who, isOpen, closePanel, resetNew }) => {
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const newNotif = useSelector(
    (state) => state.newNotifications.newNotifications
  );

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

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.post("/viewNotifications");
      if (response.status === 200) {
        setError(null);
        setNotifications(response.data);
        if (notifications.length == 0) {
          setError("No notifications");
        }
      }
    } catch (error) {
      setError(error.response.data.message);
    }
  };

  const resetNewNotifications = async () => {
    if (newNotif) {
      try {
        const response = await axios.post("/notificationFlag");
        if (response.status === 200) {
          setError(null);
          dispatch(setNewNotifications(false));
        }
      } catch (error) {
        setError(error.response.data.message);
      }
    }
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
        {error && <div className="msg">{error}</div>}
        <ListGroup as="ol">
          {reverseNotifications?.map((notification, index) => (
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
