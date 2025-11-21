import React, { useEffect } from 'react';


interface ToastProps {
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
    duration?: number;
    action?: React.ReactNode;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 3000, action }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    return (
        <div className={`toast toast--${type}`} role="alert" aria-live="polite">
            <div className="toast__content">
                <span className="toast__message">{message}</span>
                {action && <span className="toast__action">{action}</span>}
            </div>
            <button className="toast__close" onClick={onClose} aria-label="Close notification">
                &times;
            </button>
        </div>
    );
};

export default Toast;
