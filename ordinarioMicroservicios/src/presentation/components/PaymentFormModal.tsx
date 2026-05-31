import React, { useState } from 'react';

interface PaymentFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (amount: number, paymentMethod: string) => Promise<boolean>;
    orderId: string;
}

export const PaymentFormModal: React.FC<PaymentFormModalProps> = ({ isOpen, onClose, onSubmit, orderId }) => {
    const [amount, setAmount] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<string>('TARJETA_CREDITO');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount) || numericAmount <= 0) {
            setMessage({ text: 'El monto debe ser un número positivo', type: 'error' });
            return;
        }

        setIsSubmitting(true);
        try {
            const success = await onSubmit(numericAmount, paymentMethod);
            if (success) {
                setMessage({ text: 'Pago registrado exitosamente', type: 'success' });
                setTimeout(() => {
                    onClose();
                    setAmount('');
                    setMessage(null);
                }, 1500);
            } else {
                setMessage({ text: 'No se pudo registrar el pago', type: 'error' });
            }
        } catch (err: any) {
            setMessage({ text: err.message || 'Error al procesar el pago', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2 style={styles.title}>REGISTRAR PAGO</h2>
                <p style={styles.orderId}>Orden ID: {orderId}</p>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>MONTO</label>
                        <input
                            type="number"
                            step="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            style={styles.input}
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>MÉTODO DE PAGO</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            style={styles.select}
                        >
                            <option value="TARJETA_CREDITO">TARJETA DE CRÉDITO</option>
                            <option value="TARJETA_DEBITO">TARJETA DE DÉBITO</option>
                            <option value="EFECTIVO">EFECTIVO</option>
                            <option value="TRANSFERENCIA">TRANSFERENCIA</option>
                        </select>
                    </div>

                    {message && (
                        <div style={{
                            ...styles.message,
                            backgroundColor: message.type === 'success' ? 'rgba(78, 204, 163, 0.2)' : 'rgba(233, 69, 96, 0.2)',
                            borderColor: message.type === 'success' ? '#4ecca3' : '#e94560'
                        }}>
                            {message.text}
                        </div>
                    )}

                    <div style={styles.actions}>
                        <button 
                            type="button" 
                            onClick={onClose} 
                            style={styles.cancelButton}
                            disabled={isSubmitting}
                        >
                            CANCELAR
                        </button>
                        <button 
                            type="submit" 
                            style={styles.submitButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'PROCESANDO...' : 'CONFIRMAR PAGO'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(5px)'
    },
    modal: {
        backgroundColor: '#1a1a2e',
        border: '1px solid #4ecca3',
        borderRadius: '10px',
        padding: '30px',
        width: '90%',
        maxWidth: '450px',
        boxShadow: '0 0 30px rgba(78, 204, 163, 0.2)'
    },
    title: {
        color: '#4ecca3',
        marginTop: 0,
        textAlign: 'center',
        fontSize: '1.5rem',
        borderBottom: '1px solid rgba(78, 204, 163, 0.3)',
        paddingBottom: '15px'
    },
    orderId: {
        color: '#fff',
        opacity: 0.7,
        fontSize: '0.8rem',
        textAlign: 'center',
        marginBottom: '20px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        color: '#e94560',
        fontSize: '0.8rem',
        fontWeight: 'bold'
    },
    input: {
        backgroundColor: '#16213e',
        border: '1px solid rgba(78, 204, 163, 0.3)',
        color: '#fff',
        padding: '12px',
        borderRadius: '5px',
        fontSize: '1rem',
        outline: 'none'
    },
    select: {
        backgroundColor: '#16213e',
        border: '1px solid rgba(78, 204, 163, 0.3)',
        color: '#fff',
        padding: '12px',
        borderRadius: '5px',
        fontSize: '1rem',
        outline: 'none'
    },
    message: {
        padding: '10px',
        borderRadius: '5px',
        color: '#fff',
        fontSize: '0.9rem',
        textAlign: 'center',
        border: '1px solid'
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '15px',
        marginTop: '10px'
    },
    cancelButton: {
        backgroundColor: 'transparent',
        border: '1px solid #e94560',
        color: '#e94560',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    submitButton: {
        backgroundColor: '#4ecca3',
        border: 'none',
        color: '#1a1a2e',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold'
    }
};
