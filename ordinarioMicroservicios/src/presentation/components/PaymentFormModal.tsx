import React, { useState } from 'react';
import { Theme } from '../theme';

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

    const handleClose = () => {
        setAmount('');
        setPaymentMethod('TARJETA_CREDITO');
        setMessage(null);
        onClose();
    };

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
                setMessage({ text: 'PAGO REGISTRADO EXITOSAMENTE', type: 'success' });
                setTimeout(() => {
                    onClose();
                    setAmount('');
                    setMessage(null);
                }, 1500);
            } else {
                setMessage({ text: 'No se pudo procesar el cobro en este momento.', type: 'error' });
            }
        } catch (err: any) {
            setMessage({ text: err.message || 'Error crítico en la pasarela de pagos.', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Registrar Cobro</h2>
                    <p style={styles.orderId}>Expediente: {orderId}</p>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Importe a Liquidar</label>
                        <div style={styles.inputWrapper}>
                            <span style={styles.currencyPrefix}>$</span>
                            <input
                                type="number"
                                step="0.01"
                                min="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                style={styles.input}
                                placeholder="0.00"
                                required
                            />
                            <span style={{ marginLeft: '10px', color: Theme.colors.text, fontWeight: 'bold' }}>MXN</span>
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label style={styles.label}>Pasarela / Método</label>
                        <select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            style={styles.select}
                        >
                            <option value="TARJETA_CREDITO">Tarjeta de Crédito</option>
                            <option value="TARJETA_DEBITO">Tarjeta de Débito</option>
                            <option value="EFECTIVO">Efectivo en Caja</option>
                            <option value="TRANSFERENCIA">Transferencia SPEI</option>
                        </select>
                    </div>

                    {message && (
                        <div style={{
                            ...styles.message,
                            backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: message.type === 'success' ? Theme.colors.success : Theme.colors.error,
                            borderColor: message.type === 'success' ? Theme.colors.success : Theme.colors.error,
                        }}>
                            {message.text}
                        </div>
                    )}

                    <div style={styles.actions}>
                        <button 
                            type="button" 
                            onClick={handleClose} 
                            style={styles.cancelButton}
                            disabled={isSubmitting}
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            style={styles.submitButton}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Procesando...' : 'Confirmar Transacción'}
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
        zIndex: 2000,
        backdropFilter: 'blur(8px)'
    },
    modal: {
        backgroundColor: Theme.colors.surface,
        border: `1px solid ${Theme.colors.border}`,
        borderRadius: '20px',
        padding: '40px',
        width: '90%',
        maxWidth: '500px',
        boxShadow: Theme.shadows.glow,
        animation: 'scaleUp 0.3s ease-out',
    },
    header: { textAlign: 'center', marginBottom: '30px' },
    title: { color: Theme.colors.text, fontSize: '1.8rem', margin: 0 },
    orderId: { color: Theme.colors.textMuted, fontSize: '0.85rem', margin: '5px 0 0 0' },
    form: { display: 'flex', flexDirection: 'column', gap: '25px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    label: { color: Theme.colors.textMuted, fontSize: '0.85rem', fontWeight: 600 },
    inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    currencyPrefix: { position: 'absolute', left: '15px', color: Theme.colors.primary, fontWeight: 700 },
    input: {
        backgroundColor: Theme.colors.background,
        border: `1px solid ${Theme.colors.border}`,
        color: Theme.colors.text,
        padding: '15px 15px 15px 35px',
        borderRadius: '12px',
        fontSize: '1.2rem',
        width: '100%',
        outline: 'none',
    },
    select: {
        backgroundColor: Theme.colors.background,
        border: `1px solid ${Theme.colors.border}`,
        color: Theme.colors.text,
        padding: '15px',
        borderRadius: '12px',
        fontSize: '1rem',
        outline: 'none',
    },
    message: { padding: '15px', borderRadius: '10px', fontSize: '0.9rem', textAlign: 'center', border: '1px solid' },
    actions: { display: 'flex', gap: '15px', marginTop: '10px' },
    cancelButton: { flex: 1, backgroundColor: 'transparent', border: `1px solid ${Theme.colors.border}`, color: Theme.colors.textMuted, padding: '15px', borderRadius: '12px' },
    submitButton: { flex: 2, backgroundColor: Theme.colors.primary, color: '#fff', border: 'none', padding: '15px', borderRadius: '12px', fontWeight: 700, boxShadow: Theme.shadows.glow },
};
