import React from 'react';
import { Theme } from '../theme';

interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'success' | 'info';
    hideCancel?: boolean;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ 
    isOpen, 
    title, 
    message, 
    onConfirm, 
    onCancel, 
    confirmText = "Confirmar", 
    cancelText = "Cancelar",
    type = 'info',
    hideCancel = false
}) => {
    if (!isOpen) return null;

    const accentColor = type === 'danger' ? Theme.colors.error : type === 'success' ? Theme.colors.success : Theme.colors.primary;
    const glowColor = type === 'danger' ? 'rgba(255, 49, 49, 0.4)' : type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(188, 19, 254, 0.4)';

    return (
        <div style={styles.backdrop}>
            <div style={{ ...styles.modal, border: `1px solid ${accentColor}`, boxShadow: `0 0 20px ${glowColor}` }}>
                <h2 style={{ ...styles.title, color: accentColor }}>{title}</h2>
                <div style={{ ...styles.line, backgroundColor: accentColor }}></div>
                <p style={styles.message}>{message}</p>
                <div style={styles.actions}>
                    {!hideCancel && (
                        <button onClick={onCancel} style={styles.cancelBtn}>
                            {cancelText}
                        </button>
                    )}
                    <button onClick={onConfirm} style={{ ...styles.confirmBtn, backgroundColor: accentColor, flex: hideCancel ? '0 1 200px' : 1 }}>
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
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 3000,
        backdropFilter: 'blur(10px)'
    },
    modal: {
        backgroundColor: Theme.colors.surface,
        borderRadius: '24px',
        width: '90%',
        maxWidth: '450px',
        padding: '35px',
        textAlign: 'center',
        animation: 'scaleUp 0.2s ease-out',
    },
    title: {
        marginTop: 0,
        fontSize: '1.8rem',
        textTransform: 'uppercase',
        fontFamily: 'Rajdhani, sans-serif'
    },
    line: {
        height: '2px',
        width: '40px',
        margin: '10px auto 25px',
        borderRadius: '2px'
    },
    message: {
        color: Theme.colors.text,
        margin: '0 0 30px 0',
        lineHeight: '1.6',
        fontSize: '1.1rem'
    },
    actions: {
        display: 'flex',
        justifyContent: 'center',
        gap: '15px',
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: 'transparent',
        border: `1px solid ${Theme.colors.border}`,
        color: Theme.colors.textMuted,
        padding: '12px 20px',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: '1rem'
    },
    confirmBtn: {
        flex: 1,
        border: 'none',
        color: '#fff',
        padding: '12px 20px',
        borderRadius: '12px',
        cursor: 'pointer',
        fontWeight: 700,
        fontSize: '1rem',
        boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
    }
};
