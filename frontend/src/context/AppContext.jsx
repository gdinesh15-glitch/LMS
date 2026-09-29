import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    // Initial load from localStorage
    const storedNotifs = localStorage.getItem('notifications');
    const storedActs = localStorage.getItem('activities');
    const storedSettings = localStorage.getItem('systemSettings');

    if (storedNotifs) setNotifications(JSON.parse(storedNotifs));
    if (storedActs) setActivities(JSON.parse(storedActs));
    if (storedSettings) setSettings(JSON.parse(storedSettings));
  }, []);

  const addActivity = (icon, color, text, bg) => {
    const newAct = {
      id: Date.now(),
      icon, color, text, bg,
      ts: new Date().toISOString()
    };
    const updated = [newAct, ...activities].slice(0, 50);
    setActivities(updated);
    localStorage.setItem('activities', JSON.stringify(updated));
  };

  const pushNotif = (icon, bg, color, text, type) => {
    const newNotif = {
      id: Date.now(),
      icon, bg, color, text, type,
      read: false,
      ts: new Date().toISOString()
    };
    const updated = [newNotif, ...notifications].slice(0, 20);
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const markNotifRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    localStorage.setItem('notifications', JSON.stringify(updated));
  };

  const clearNotifs = () => {
    setNotifications([]);
    localStorage.removeItem('notifications');
  };

  return (
    <AppContext.Provider value={{
      notifications, pushNotif, markNotifRead, clearNotifs,
      activities, addActivity,
      settings, setSettings
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
