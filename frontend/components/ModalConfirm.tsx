import React, { useEffect, useRef } from 'react';


interface ModalConfirmProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading?: boolean;
}

const ModalConfirm: React.FC<ModalConfirmProps> = ({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    isLoading = false,
}) => {
    const confirmButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        if (isOpen) {
            confirmButtonRef.current?.focus();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
            <div className="modal">
                <h2 id="modal-title" className="modal__title">{title}</h2>
                <p className="modal__content">{message}</p>
                <div className="modal__actions">
                    <button className="btn btn--secondary" onClick={onCancel} disabled={isLoading}>
                        Cancel
                    </button>
                    <button
                        ref={confirmButtonRef}
                        className="btn btn--danger"
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ModalConfirm;
