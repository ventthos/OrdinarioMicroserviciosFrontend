import React, { useState } from 'react';
import type { Product } from '../../domain/models/Product';

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
        
        // Validation: All except imageUrl must not be empty
        if (!formData.name || !formData.description || !formData.price || !formData.quantity || !formData.supplier) {
            onError("Todos los campos excepto la imagen son obligatorios.");
            return;
        }

        const price = parseFloat(formData.price);
        const quantity = parseInt(formData.quantity);

        if (price < 0) {
            onError("El precio no puede ser negativo.");
            return;
        }

        if (quantity < 0) {
            onError("El stock no puede ser negativo.");
            return;
        }

        setSubmitting(true);
        try {
            const success = await onSubmit({
                name: formData.name,
                description: formData.description,
                price: price,
                quantity: quantity,
                imageUrl: formData.imageUrl || "http://placeimg.com/640/480",
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
                <h2 style={styles.title}>NUEVO PRODUCTO</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>NOMBRE</label>
                        <input 
                            name="name" 
                            value={formData.name} 
                            onChange={handleChange} 
                            style={styles.input} 
                            placeholder="Nombre del producto"
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>DESCRIPCIÓN</label>
                        <textarea 
                            name="description" 
                            value={formData.description} 
                            onChange={handleChange} 
                            style={{ ...styles.input, height: '60px' }} 
                            placeholder="Descripción"
                        />
                    </div>
                    <div style={styles.row}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>PRECIO</label>
                            <input 
                                name="price" 
                                type="number" 
                                value={formData.price} 
                                onChange={handleChange} 
                                style={styles.input} 
                                placeholder="0.00"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>STOCK</label>
                            <input 
                                name="quantity" 
                                type="number" 
                                value={formData.quantity} 
                                onChange={handleChange} 
                                style={styles.input} 
                                placeholder="0"
                            />
                        </div>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>URL DE IMAGEN (OPCIONAL)</label>
                        <input 
                            name="imageUrl" 
                            value={formData.imageUrl} 
                            onChange={handleChange} 
                            style={styles.input} 
                            placeholder="http://..."
                        />
                    </div>
                    {formData.imageUrl && (
                        <div style={styles.previewContainer}>
                            <p style={styles.label}>VISTA PREVIA:</p>
                            <img src={formData.imageUrl} alt="Preview" style={styles.preview} />
                        </div>
                    )}
                    <div style={styles.formGroup}>
                        <label style={styles.label}>PROVEEDOR</label>
                        <input 
                            name="supplier" 
                            value={formData.supplier} 
                            onChange={handleChange} 
                            style={styles.input} 
                            placeholder="Nombre del proveedor"
                        />
                    </div>
                    <div style={styles.actions}>
                        <button type="button" onClick={onClose} style={styles.cancelBtn}>CANCELAR</button>
                        <button type="submit" disabled={submitting} style={styles.submitBtn}>
                            {submitting ? 'CREANDO...' : 'GUARDAR PRODUCTO'}
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
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(5px)'
    },
    modal: {
        backgroundColor: '#1a1a2e',
        border: '2px solid #4ecca3',
        borderRadius: '10px',
        width: '90%',
        maxWidth: '500px',
        padding: '30px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)'
    },
    title: {
        color: '#4ecca3',
        marginTop: 0,
        textAlign: 'center',
        letterSpacing: '2px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px'
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    },
    row: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '15px'
    },
    label: {
        color: '#e94560',
        fontSize: '0.8rem',
        fontWeight: 'bold'
    },
    input: {
        backgroundColor: '#16213e',
        border: '1px solid #4ecca3',
        borderRadius: '4px',
        padding: '10px',
        color: '#fff',
        fontFamily: 'inherit'
    },
    previewContainer: {
        textAlign: 'center',
        marginTop: '10px'
    },
    preview: {
        maxWidth: '100px',
        maxHeight: '100px',
        borderRadius: '5px',
        border: '1px solid #4ecca3'
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        marginTop: '20px'
    },
    cancelBtn: {
        backgroundColor: 'transparent',
        border: '1px solid #e94560',
        color: '#e94560',
        padding: '10px 20px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    submitBtn: {
        backgroundColor: '#4ecca3',
        border: 'none',
        color: '#1a1a2e',
        padding: '10px 20px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold'
    }
};
