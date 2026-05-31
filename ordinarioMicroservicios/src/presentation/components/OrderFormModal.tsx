import React, { useState } from 'react';
import type { Order, OrderProduct } from '../../domain/models/Order';
import { ProductSelectorModal } from './ProductSelectorModal';
import type { Product } from '../../domain/models/Product';

interface OrderFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (order: Omit<Order, 'id' | 'user' | 'debt'> & { userId: string }) => Promise<boolean>;
    onError: (message: string) => void;
}

interface OrderProductWithExtra extends OrderProduct {
    name?: string;
}

export const OrderFormModal: React.FC<OrderFormModalProps> = ({ isOpen, onClose, onSubmit, onError }) => {
    const [formData, setFormData] = useState({
        orderCode: `ORD-${Math.floor(Math.random() * 1000)}-${Date.now()}`,
        orderDate: new Date().toISOString().split('T')[0],
        totalAmount: '0.00',
        status: 'PENDING',
        userId: ''
    });

    const [products, setProducts] = useState<OrderProductWithExtra[]>([]);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleProductChange = (index: number, field: keyof OrderProduct, value: string | number) => {
        const newProducts = [...products];
        newProducts[index] = { ...newProducts[index], [field]: value };
        setProducts(newProducts);
        updateTotal(newProducts);
    };

    const updateTotal = (currentProducts: OrderProduct[]) => {
        const total = currentProducts.reduce((sum, p) => sum + (p.quantity * p.price), 0);
        setFormData(prev => ({ ...prev, totalAmount: total.toFixed(2) }));
    };

    const handleSelectProduct = (product: Product) => {
        const newProduct: OrderProductWithExtra = {
            productId: product.id,
            name: product.name,
            quantity: 1,
            price: product.price
        };
        const newProducts = [...products, newProduct];
        setProducts(newProducts);
        updateTotal(newProducts);
    };

    const removeProduct = (index: number) => {
        const newProducts = products.filter((_, i) => i !== index);
        setProducts(newProducts);
        updateTotal(newProducts);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.orderCode || !formData.orderDate || !formData.userId || products.length === 0) {
            onError("Todos los campos son obligatorios y debe haber al menos un producto.");
            return;
        }

        setSubmitting(true);
        try {
            // Remove extra 'name' field before sending
            const cleanProducts = products.map(({ productId, quantity, price }) => ({
                productId,
                quantity,
                price
            }));

            const success = await onSubmit({
                orderCode: formData.orderCode,
                orderDate: formData.orderDate,
                totalAmount: parseFloat(formData.totalAmount) || 0,
                status: formData.status,
                userId: formData.userId,
                products: cleanProducts
            });

            if (success) {
                onClose();
                setFormData({
                    orderCode: `ORD-${Math.floor(Math.random() * 1000)}-${Date.now()}`,
                    orderDate: new Date().toISOString().split('T')[0],
                    totalAmount: '0.00',
                    status: 'PENDING',
                    userId: ''
                });
                setProducts([]);
            }
        } catch (error) {
            onError("Error crítico al intentar crear la orden.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={styles.backdrop}>
            <div style={styles.modal}>
                <h2 style={styles.title}>NUEVA ORDEN</h2>
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.row}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>CÓDIGO DE ORDEN</label>
                            <input 
                                name="orderCode" 
                                value={formData.orderCode} 
                                onChange={handleChange} 
                                style={styles.input} 
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>FECHA</label>
                            <input 
                                name="orderDate" 
                                type="date"
                                value={formData.orderDate} 
                                onChange={handleChange} 
                                style={styles.input} 
                            />
                        </div>
                    </div>

                    <div style={styles.row}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>ID DE USUARIO (EMAIL)</label>
                            <input 
                                name="userId" 
                                type="email"
                                value={formData.userId} 
                                onChange={handleChange} 
                                style={styles.input} 
                                placeholder="ejemplo@correo.com"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>ESTADO</label>
                            <select 
                                name="status" 
                                value={formData.status} 
                                onChange={handleChange} 
                                style={styles.input}
                            >
                                <option value="PENDING">PENDING</option>
                                <option value="COMPLETED">COMPLETED</option>
                                <option value="CANCELLED">CANCELLED</option>
                            </select>
                        </div>
                    </div>

                    <div style={styles.productsSection}>
                        <div style={styles.productsHeader}>
                            <label style={styles.label}>PRODUCTOS</label>
                            <button type="button" onClick={() => setIsSelectorOpen(true)} style={styles.addBtn}>+ BUSCAR Y AÑADIR</button>
                        </div>
                        <div style={styles.productLabels}>
                            <span style={{ ...styles.label, flex: 2 }}>PRODUCTO</span>
                            <span style={{ ...styles.label, flex: 0.6 }}>CANT.</span>
                            <span style={{ ...styles.label, flex: 1 }}>PRECIO</span>
                            <span style={{ ...styles.label, flex: 1 }}>SUBTOTAL</span>
                            <span style={{ width: '30px' }}></span>
                        </div>
                        {products.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '10px', color: 'rgba(78, 204, 163, 0.5)', fontSize: '0.9rem' }}>
                                No hay productos añadidos. Haz clic en el botón para buscar uno.
                            </div>
                        )}
                        {products.map((product, index) => (
                            <div key={index} style={styles.productRow}>
                                <div style={{ ...styles.productNameCell, flex: 2 }}>
                                    <span style={styles.productNameText}>{product.name || 'Sin nombre'}</span>
                                    <span style={styles.productIdText}>{product.productId}</span>
                                </div>
                                <input 
                                    type="number"
                                    placeholder="0"
                                    value={product.quantity}
                                    onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 0)}
                                    style={{ ...styles.input, flex: 0.6, minWidth: '0' }}
                                />
                                <div style={{ ...styles.priceCell, flex: 1 }}>
                                    ${product.price.toFixed(2)}
                                </div>
                                <div style={styles.subtotalValue}>
                                    ${(product.quantity * product.price).toFixed(2)}
                                </div>
                                <button type="button" onClick={() => removeProduct(index)} style={styles.removeBtn}>✕</button>
                            </div>
                        ))}
                    </div>

                    <div style={styles.totalContainer}>
                        <label style={styles.totalLabel}>MONTO TOTAL DE LA ORDEN</label>
                        <div style={styles.totalDisplay}>
                            ${formData.totalAmount || '0.00'}
                        </div>
                    </div>

                    <div style={styles.actions}>
                        <button type="button" onClick={onClose} style={styles.cancelBtn}>CANCELAR</button>
                        <button type="submit" disabled={submitting} style={styles.submitBtn}>
                            {submitting ? 'CREANDO...' : 'GUARDAR ORDEN'}
                        </button>
                    </div>
                </form>

                <ProductSelectorModal 
                    isOpen={isSelectorOpen} 
                    onClose={() => setIsSelectorOpen(false)} 
                    onSelect={handleSelectProduct}
                />
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
        width: '95%',
        maxWidth: '800px',
        padding: '30px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
        maxHeight: '90vh',
        overflowY: 'auto'
    },
    title: {
        color: '#4ecca3',
        marginTop: 0,
        textAlign: 'center',
        letterSpacing: '2px',
        fontSize: '1.8rem'
    },
    form: {
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
        color: '#e94560',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    input: {
        backgroundColor: '#16213e',
        border: '1px solid #4ecca3',
        borderRadius: '4px',
        padding: '12px',
        color: '#fff',
        fontFamily: 'inherit',
        fontSize: '0.95rem',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box'
    },
    productsSection: {
        border: '1px solid rgba(78, 204, 163, 0.3)',
        borderRadius: '8px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        backgroundColor: 'rgba(22, 33, 62, 0.5)'
    },
    productsHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '5px'
    },
    productLabels: {
        display: 'flex',
        gap: '10px',
        paddingRight: '40px',
        marginBottom: '5px'
    },
    productRow: {
        display: 'flex',
        gap: '10px',
        alignItems: 'center',
        width: '100%',
        padding: '8px 0',
        borderBottom: '1px solid rgba(233, 69, 96, 0.1)'
    },
    productNameCell: {
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
        minWidth: '0'
    },
    productNameText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '0.9rem',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
    },
    productIdText: {
        color: '#e94560',
        fontSize: '0.7rem'
    },
    priceCell: {
        color: '#fff',
        fontSize: '0.95rem',
        textAlign: 'center'
    },
    subtotalValue: {
        flex: 1,
        color: '#4ecca3',
        fontWeight: 'bold',
        textAlign: 'right',
        fontSize: '0.9rem',
        minWidth: '70px'
    },
    addBtn: {
        backgroundColor: '#e94560',
        border: 'none',
        color: '#fff',
        padding: '8px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        transition: 'opacity 0.2s',
        letterSpacing: '1px'
    },
    removeBtn: {
        backgroundColor: '#e94560',
        border: 'none',
        color: '#fff',
        width: '30px',
        height: '30px',
        minWidth: '30px',
        borderRadius: '50%',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '0.8rem'
    },
    totalContainer: {
        backgroundColor: '#0f3460',
        padding: '20px',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid #4ecca3'
    },
    totalLabel: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '1rem'
    },
    totalDisplay: {
        color: '#4ecca3',
        fontSize: '1.8rem',
        fontWeight: 'bold'
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '15px',
        marginTop: '10px'
    },
    cancelBtn: {
        backgroundColor: 'transparent',
        border: '1px solid #e94560',
        color: '#e94560',
        padding: '12px 25px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'all 0.2s'
    },
    submitBtn: {
        backgroundColor: '#4ecca3',
        border: 'none',
        color: '#1a1a2e',
        padding: '12px 25px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'all 0.2s'
    }
};
