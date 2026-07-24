import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    const showNotification = useCallback((message, type = 'info', duration = 5000) => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, message, type }]);

        if (duration) {
            setTimeout(() => {
                removeNotification(id);
            }, duration);
        }
    }, [removeNotification]);

    const success = (msg) => showNotification(msg, 'success');
    const error = (msg) => showNotification(msg, 'danger');
    const info = (msg) => showNotification(msg, 'info');
    const warning = (msg) => showNotification(msg, 'warning');

    return (
        <NotificationContext.Provider value={{ success, error, info, warning }}>
            {children}
            <div 
                className="toast-container position-fixed bottom-0 end-0 p-3" 
                style={{ zIndex: 9999 }}
            >
                {notifications.map((n) => (
                    <div 
                        key={n.id} 
                        className={`toast show align-items-center text-white bg-${n.type} border-0 mb-2`}
                        role="alert" 
                        aria-live="assertive" 
                        aria-atomic="true"
                    >
                        <div className="d-flex">
                            <div className="toast-body">
                                {n.type === 'success' && '✅ '}
                                {n.type === 'danger' && '❌ '}
                                {n.type === 'warning' && '⚠️ '}
                                {n.type === 'info' && 'ℹ️ '}
                                {n.message}
                            </div>
                            <button 
                                type="button" 
                                className="btn-close btn-close-white me-2 m-auto" 
                                onClick={() => removeNotification(n.id)}
                            ></button>
                        </div>
                    </div>
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
