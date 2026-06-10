import React, { useState } from 'react';
import type { Product } from '../../domain/models/Product';
import { Theme } from '../theme';

interface ProductFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (product: Omit<Product, 'id'>) => Promise<boolean>;
    onError: (message: string) => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, onSubmit, onError }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        quantity: '',
        imageUrl: '',
        supplier: ''
    });
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!formData.name || !formData.description || !formData.price || !formData.quantity || !formData.supplier) {
            onError("Todos los campos excepto la imagen son obligatorios.");
            return;
        }

        const price = parseFloat(formData.price);
        const quantity = parseInt(formData.quantity);

        if (price <= 0) {
            onError("El precio debe ser mayor a 0.");
            return;
        }

        if (quantity <= 0) {
            onError("El stock debe ser mayor a 0.");
            return;
        }

        setSubmitting(true);
        try {
            const success = await onSubmit({
                name: formData.name,
                description: formData.description,
                price: price,
                quantity: quantity,
                imageUrl: formData.imageUrl || "https://placehold.co/600x400/16161a/bc13fe?text=Game+Asset",
                supplier: formData.supplier
            });

            if (success) {
                onClose();
                setFormData({
                    name: '',
                    description: '',
                    price: '',
                    quantity: '',
                    imageUrl: '',
                    supplier: ''
                });
            }
        } catch (error) {
            onError("Error crítico al intentar crear el producto.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={styles.backdrop}>
            <div style={styles.modal}>
                <div style={styles.header}>
                    <h2 style={styles.title}>Nuevo Producto</h2>
                    <div style={styles.titleLine}></div>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                    <div style={styles.scrollArea}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Nombre del Artículo</label>
                            <input 
                                name="name" 
                                value={formData.name} 
                                onChange={handleChange} 
                                style={styles.input} 
                                placeholder="Ej: Consola Retro Z-9000"
                            />
                        </div>
                        
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Descripción</label>
                            <textarea 
                                name="description" 
                                value={formData.description} 
                                onChange={handleChange} 
                                style={{ ...styles.input, height: '80px', resize: 'none' }} 
                                placeholder="Detalles técnicos o de catálogo..."
                            />
                        </div>

                        <div style={styles.row}>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Precio (MXN)</label>
                                <input 
                                    name="price" 
                                    type="number" 
                                    step="0.01"
                                    min="0.01"
                                    value={formData.price} 
                                    onChange={handleChange} 
                                    style={styles.input} 
                                    placeholder="0.00"
                                />
                            </div>
                            <div style={styles.formGroup}>
                                <label style={styles.label}>Stock Inicial</label>
                                <input 
                                    name="quantity" 
                                    type="number" 
                                    min="1"
                                    value={formData.quantity} 
                                    onChange={handleChange} 
                                    style={styles.input} 
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>URL de Imagen de Portada</label>
                            <input 
                                name="imageUrl" 
                                value={formData.imageUrl} 
                                onChange={handleChange} 
                                style={styles.input} 
                                placeholder="https://servidor.com/imagen.jpg"
                            />
                        </div>

                        <div style={styles.formGroup}>
                            <label style={styles.label}>Fabricante / Proveedor</label>
                            <input 
                                name="supplier" 
                                value={formData.supplier} 
                                onChange={handleChange} 
                                style={styles.input} 
                                placeholder="Ej: Nintendo, Sony, Fanatec..."
                            />
                        </div>
                    </div>

                    <div style={styles.actions}>
                        <button type="button" onClick={onClose} style={styles.cancelBtn}>
                            Cancelar
                        </button>
                        <button type="submit" disabled={submitting} style={styles.submitBtn}>
                            {submitting ? 'Registrando...' : 'Confirmar Ingreso'}
                        </button>
                    </div>
                </form>
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
        zIndex: 2000,
        backdropFilter: 'blur(10px)'
    },
    modal: {
        backgroundColor: Theme.colors.surface,
        border: `1px solid ${Theme.colors.border}`,
        borderRadius: '24px',
        width: '90%',
        maxWidth: '550px',
        boxShadow: Theme.shadows.glow,
        animation: 'scaleUp 0.3s ease-out',
        maxHeight: '80vh',
        margin: '20px',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    },
    header: {
        textAlign: 'center',
        padding: '40px 40px 30px 40px'
    },
    title: {
        color: Theme.colors.text,
        margin: 0,
        fontSize: '2rem',
    },
    titleLine: {
        height: '3px',
        width: '60px',
        backgroundColor: Theme.colors.primary,
        margin: '10px auto 0',
        borderRadius: '2px',
        boxShadow: Theme.shadows.glow,
    },
    scrollArea: {
        flex: 1,
        overflowY: 'auto',
        padding: '0 40px 20px 40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    row: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px'
    },
    label: {
        color: Theme.colors.textMuted,
        fontSize: '0.85rem',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    input: {
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: Theme.colors.background,
        border: `1px solid ${Theme.colors.border}`,
        borderRadius: '12px',
        padding: '12px 16px',
        color: Theme.colors.text,
        fontSize: '1rem',
        outline: 'none',
        transition: Theme.transitions.default,
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '15px',
        padding: '20px 40px 40px 40px',
        borderTop: `1px solid ${Theme.colors.border}`,
        backgroundColor: Theme.colors.surface
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: 'transparent',
        border: `1px solid ${Theme.colors.border}`,
        color: Theme.colors.textMuted,
        padding: '14px',
        borderRadius: '12px',
        fontSize: '1rem',
    },
    submitBtn: {
        flex: 2,
        backgroundColor: Theme.colors.primary,
        color: '#fff',
        border: 'none',
        padding: '14px',
        borderRadius: '12px',
        fontSize: '1rem',
        boxShadow: Theme.shadows.glow,
    }
};
