import React, { useEffect } from 'react';
import './ToastNotification.css'; // Добавим стили ниже

const ToastNotification = ({ message, duration = 10000, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className="toast-notification">
            <p>{message}</p>
        </div>
    );
};

export default ToastNotification;
