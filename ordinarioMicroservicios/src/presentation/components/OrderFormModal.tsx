import React, { useState } from 'react';
import type { Order, OrderProduct } from '../../domain/models/Order';
import { ProductSelectorModal } from './ProductSelectorModal';
import type { Product } from '../../domain/models/Product';
import { Theme } from '../theme';

interface OrderFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (order: Omit<Order, 'id' | 'user' | 'debt'> & { userId: string }) => Promise<boolean>;
    onError: (message: string) => void;
}

export const OrderFormModal: React.FC<OrderFormModalProps> = ({ isOpen, onClose, onSubmit, onError }) => {
    const [formData, setFormData] = useState({
        orderCode: `ORD-${Math.floor(Math.random() * 1000)}-${Date.now().toString().slice(-4)}`,
        orderDate: new Date().toISOString().split('T')[0],
        totalAmount: '0.00',
        status: 'PENDING',
        userId: ''
    });

    const [products, setProducts] = useState<OrderProduct[]>([]);
    const [isSelectorOpen, setIsSelectorOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const handleClose = () => {
        setFormData({
            orderCode: `ORD-${Math.floor(Math.random() * 1000)}-${Date.now().toString().slice(-4)}`,
            orderDate: new Date().toISOString().split('T')[0],
            totalAmount: '0.00',
            status: 'PENDING',
            userId: ''
        });
        setProducts([]);
        onClose();
    };

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
        const newProduct: OrderProduct = {
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
            onError("Completa todos los campos y añade al menos un producto.");
            return;
        }

        setSubmitting(true);
        try {
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
                    orderCode: `ORD-${Math.floor(Math.random() * 1000)}-${Date.now().toString().slice(-4)}`,
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
                <div style={styles.header}>
                    <h2 style={styles.title}>Nueva Orden</h2>
                    <div style={styles.titleLine}></div>
                </div>

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.row}>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Código de Control</label>
                            <input 
                                name="orderCode" 
                                value={formData.orderCode} 
                                onChange={handleChange} 
                                style={styles.input} 
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Fecha de Emisión</label>
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
                            <label style={styles.label}>Correo del cliente</label>
                            <input 
                                name="userId" 
                                type="email"
                                value={formData.userId} 
                                onChange={handleChange} 
                                style={styles.input} 
                                placeholder="usuario@gaminghub.com"
                            />
                        </div>
                        <div style={styles.formGroup}>
                            <label style={styles.label}>Estado Inicial</label>
                            <select 
                                name="status" 
                                value={formData.status} 
                                onChange={handleChange} 
                                style={styles.input}
                            >
                                <option value="PENDING">PENDIENTE</option>
                                <option value="COMPLETED">COMPLETADA</option>
                                <option value="CANCELLED">CANCELADA</option>
                            </select>
                        </div>
                    </div>

                    <div style={styles.productsSection}>
                        <div style={styles.productsHeader}>
                            <label style={styles.label}>Artículos en el Carrito</label>
                            <button type="button" onClick={() => setIsSelectorOpen(true)} style={styles.addBtn}>
                                + Buscar Producto
                            </button>
                        </div>
                        
                        <div style={styles.productList}>
                            {products.length === 0 ? (
                                <div style={styles.emptyProducts}>
                                    El carrito está vacío. Inicia la búsqueda de hardware.
                                </div>
                            ) : (
                                products.map((product, index) => (
                                    <div key={index} style={styles.productRow}>
                                        <div style={styles.productInfo}>
                                            <span style={styles.productNameText}>{product.name}</span>
                                            <code style={styles.productIdText}>{product.productId}</code>
                                        </div>
                                        <div style={styles.productControls}>
                                            <input 
                                                type="number"
                                                value={product.quantity}
                                                onChange={(e) => handleProductChange(index, 'quantity', parseInt(e.target.value) || 0)}
                                                style={styles.quantityInput}
                                            />
                                            <div style={styles.priceInfo}>
                                                <span style={styles.unitPrice}>${product.price.toFixed(2)}</span>
                                                <span style={styles.rowTotal}>${(product.quantity * product.price).toFixed(2)}</span>
                                            </div>
                                            <button type="button" onClick={() => removeProduct(index)} style={styles.removeBtn}>
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div style={styles.footer}>
                        <div style={styles.totalBox}>
                            <span style={styles.totalLabel}>Total de Transacción</span>
                            <span style={styles.totalValue}>$ {formData.totalAmount} MXN</span>
                        </div>

                        <div style={styles.actions}>
                            <button type="button" onClick={handleClose} style={styles.cancelBtn}>
                                Cancelar
                            </button>
                            <button type="submit" disabled={submitting} style={styles.submitBtn}>
                                {submitting ? 'Procesando...' : 'Confirmar Orden'}
                            </button>
                        </div>
                    </div>
                </form>

                <ProductSelectorModal 
                    isOpen={isSelectorOpen} 
                    onClose={() => setIsSelectorOpen(false)} 
                    onSelect={handleSelectProduct}
                    excludeIds={products.map(p => p.productId)}
                />
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    backdrop: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 2000, backdropFilter: 'blur(10px)'
    },
    modal: {
        backgroundColor: Theme.colors.surface,
        border: `1px solid ${Theme.colors.border}`,
        borderRadius: '24px',
        width: '95%', maxWidth: '850px',
        padding: '40px',
        boxShadow: Theme.shadows.glow,
        maxHeight: '90vh', overflowY: 'auto'
    },
    header: { textAlign: 'center', marginBottom: '30px' },
    title: { color: Theme.colors.text, margin: 0, fontSize: '2rem' },
    titleLine: { height: '3px', width: '60px', backgroundColor: Theme.colors.primary, margin: '10px auto 0', borderRadius: '2px', boxShadow: Theme.shadows.glow },
    form: { display: 'flex', flexDirection: 'column', gap: '25px' },
    formGroup: { display: 'flex', flexDirection: 'column', gap: '8px' },
    row: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
    label: { color: Theme.colors.textMuted, fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' },
    input: {
        backgroundColor: Theme.colors.background,
        border: `1px solid ${Theme.colors.border}`,
        borderRadius: '12px', padding: '12px 16px',
        color: Theme.colors.text, fontSize: '1rem', outline: 'none'
    },
    productsSection: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        borderRadius: '16px', padding: '20px',
        border: `1px solid ${Theme.colors.border}`
    },
    productsHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    productList: { display: 'flex', flexDirection: 'column', gap: '15px' },
    emptyProducts: { textAlign: 'center', padding: '30px', color: Theme.colors.textMuted, border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '12px' },
    productRow: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '15px', backgroundColor: Theme.colors.surfaceLight,
        borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'
    },
    productInfo: { display: 'flex', flexDirection: 'column', gap: '4px' },
    productNameText: { fontWeight: 700, color: Theme.colors.text },
    productIdText: { fontSize: '0.75rem', color: Theme.colors.accent, opacity: 0.8 },
    productControls: { display: 'flex', alignItems: 'center', gap: '20px' },
    quantityInput: {
        width: '60px', backgroundColor: Theme.colors.background,
        border: `1px solid ${Theme.colors.border}`, borderRadius: '8px',
        padding: '8px', color: Theme.colors.text, textAlign: 'center'
    },
    priceInfo: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: '100px' },
    unitPrice: { fontSize: '0.75rem', color: Theme.colors.textMuted },
    rowTotal: { fontWeight: 700, color: Theme.colors.success },
    addBtn: {
        backgroundColor: Theme.colors.accent, color: '#000',
        border: 'none', padding: '8px 16px', borderRadius: '8px',
        fontWeight: 700, fontSize: '0.85rem'
    },
    removeBtn: {
        backgroundColor: 'rgba(255,49,49,0.1)', color: Theme.colors.error,
        border: `1px solid ${Theme.colors.error}`, width: '32px', height: '32px',
        borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    footer: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: '10px', paddingTop: '20px', borderTop: `1px solid ${Theme.colors.border}`
    },
    totalBox: { display: 'flex', flexDirection: 'column' },
    totalLabel: { fontSize: '0.85rem', color: Theme.colors.textMuted },
    totalValue: { fontSize: '2rem', fontWeight: 800, color: Theme.colors.primary, textShadow: Theme.shadows.glow },
    actions: { display: 'flex', gap: '15px' },
    cancelBtn: {
        backgroundColor: 'transparent', border: `1px solid ${Theme.colors.border}`,
        color: Theme.colors.textMuted, padding: '14px 24px', borderRadius: '12px'
    },
    submitBtn: {
        backgroundColor: Theme.colors.primary, color: '#fff',
        border: 'none', padding: '14px 24px', borderRadius: '12px',
        fontWeight: 700, boxShadow: Theme.shadows.glow
    }
};
