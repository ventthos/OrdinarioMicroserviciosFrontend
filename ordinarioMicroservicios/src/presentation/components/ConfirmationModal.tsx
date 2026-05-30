import React from 'react';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'success' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
    isOpen, 
    title, 
    message, 
    onConfirm, 
    onCancel, 
    confirmText = "CONFIRMAR", 
    cancelText = "CANCELAR",
    type = 'info'
}) => {
    if (!isOpen) return null;

    const accentColor = type === 'danger' ? '#e94560' : type === 'success' ? '#4ecca3' : '#4ecca3';

    return (
        <div style={styles.backdrop}>
            <div style={{ ...styles.modal, border: `2px solid ${accentColor}` }}>
                <h2 style={{ ...styles.title, color: accentColor }}>{title}</h2>
                <p style={styles.message}>{message}</p>
                <div style={styles.actions}>
                    <button onClick={onCancel} style={{ ...styles.cancelBtn, borderColor: accentColor, color: accentColor }}>
                        {cancelText}
                    </button>
                    <button onClick={onConfirm} style={{ ...styles.confirmBtn, backgroundColor: accentColor }}>
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    backdrop: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2000,
        backdropFilter: 'blur(8px)'
    },
    modal: {
        backgroundColor: '#1a1a2e',
        borderRadius: '10px',
        width: '90%',
        maxWidth: '400px',
        padding: '25px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)',
        textAlign: 'center'
    },
    title: {
        marginTop: 0,
        fontSize: '1.5rem',
        letterSpacing: '1px'
    },
    message: {
        color: '#fff',
        margin: '20px 0',
        lineHeight: '1.5'
    },
    actions: {
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
        marginTop: '25px'
    },
    cancelBtn: {
        backgroundColor: 'transparent',
        border: '1px solid',
        padding: '10px 20px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '0.9rem'
    },
    confirmBtn: {
        border: 'none',
        color: '#1a1a2e',
        padding: '10px 20px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '0.9rem'
    }
};
