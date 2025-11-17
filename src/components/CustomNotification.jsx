import React, { useState, useEffect } from "react";
import "./CustomNotification.css";

let idCounter = 0;

export const CustomNotification = () => {
  const [notifications, setNotifications] = useState([]);

  // Function to add a notification
  const addNotification = (type, message, duration = 3000) => {
    const id = idCounter++;
    setNotifications((prev) => [...prev, { id, type, message }]);

    // Remove notification after duration
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, duration);
  };

  // Expose a global function to call notifications
  useEffect(() => {
    window.notify = addNotification;
  }, []);

  return (
    <div className="notification-container">
      {notifications.map((n) => (
        <div key={n.id} className={`notification ${n.type}`}>
          {n.message}
        </div>
      ))}
    </div>
  );
};
