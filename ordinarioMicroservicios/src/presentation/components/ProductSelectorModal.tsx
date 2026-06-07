import React, { useEffect, useState } from 'react';
import { useProductViewModel } from '../hooks/useProductViewModel';
import type { Product } from '../../domain/models/Product';
import { Theme } from '../theme';

interface ProductSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (product: Product) => void;
    excludeIds?: string[];
}

export const ProductSelectorModal: React.FC<ProductSelectorModalProps> = ({ isOpen, onClose, onSelect, excludeIds = [] }) => {
    const { products, loading, error, refreshProducts } = useProductViewModel();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            refreshProducts();
        }
    }, [isOpen, refreshProducts]);

    if (!isOpen) return null;

    const filteredProducts = products
        .filter(p => !excludeIds.includes(p.id))
        .filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.id.toLowerCase().includes(searchTerm.toLowerCase())
        );

    return (
        <div style={styles.backdrop}>
            <div style={styles.modal}>
                <header style={styles.header}>
                    <div style={styles.headerTitle}>
                        <h2 style={styles.title}>Selección de Hardware</h2>
                        <div style={styles.titleLine}></div>
                    </div>
                    <button onClick={onClose} style={styles.closeBtn}>✕</button>
                </header>

                <div style={styles.searchSection}>
                    <div style={styles.inputWrapper}>
                        <span style={styles.searchIcon}>🔍</span>
                        <input 
                            type="text" 
                            placeholder="Filtrar por nombre o identificador..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={styles.searchInput}
                        />
                    </div>
                </div>

                <div style={styles.listContainer}>
                    {loading ? (
                        <div style={styles.stateBox}>
                            <div style={styles.miniLoader}></div>
                            <p style={styles.stateText}>Escaneando base de datos...</p>
                        </div>
                    ) : error ? (
                        <div style={styles.stateBox}>
                            <span style={styles.errorIcon}>⚠️</span>
                            <p style={{ ...styles.stateText, color: Theme.colors.error }}>{error}</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <div style={styles.stateBox}>
                            <span style={styles.emptyIcon}>🚫</span>
                            <p style={styles.stateText}>Sin coincidencias en el radar.</p>
                        </div>
                    ) : (
                        filteredProducts.map(product => (
                            <div 
                                key={product.id} 
                                style={styles.productItem}
                                onClick={() => {
                                    onSelect(product);
                                    onClose();
                                }}
                            >
                                <div style={styles.productMain}>
                                    <img 
                                        src={product.imageUrl} 
                                        alt={product.name} 
                                        style={styles.thumbnail} 
                                    />
                                    <div style={styles.productInfo}>
                                        <span style={styles.productName}>{product.name}</span>
                                        <code style={styles.productId}>{product.id}</code>
                                    </div>
                                </div>
                                <div style={styles.productMeta}>
                                    <span style={styles.stockBadge}>
                                        {product.quantity} U
                                    </span>
                                    <span style={styles.productPrice}>
                                        $ {product.price.toFixed(2)} MXN
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <footer style={styles.footer}>
                    <p style={styles.footerInfo}>Mostrando {filteredProducts.length} de {products.length} artículos</p>
                </footer>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    backdrop: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        zIndex: 3000, backdropFilter: 'blur(10px)'
    },
    modal: {
        backgroundColor: Theme.colors.surface,
        border: `1px solid ${Theme.colors.border}`,
        borderRadius: '24px',
        width: '90%', maxWidth: '600px',
        maxHeight: '80vh',
        display: 'flex', flexDirection: 'column',
        boxShadow: Theme.shadows.glow,
        animation: 'scaleUp 0.3s ease-out',
        overflow: 'hidden'
    },
    header: {
        padding: '30px 40px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        borderBottom: `1px solid ${Theme.colors.border}`,
        backgroundColor: 'rgba(255,255,255,0.02)'
    },
    headerTitle: { display: 'flex', flexDirection: 'column', gap: '5px' },
    title: { color: Theme.colors.text, margin: 0, fontSize: '1.8rem' },
    titleLine: { height: '3px', width: '40px', backgroundColor: Theme.colors.accent, borderRadius: '2px' },
    closeBtn: {
        background: 'none', border: 'none', color: Theme.colors.textMuted,
        fontSize: '1.5rem', cursor: 'pointer', transition: Theme.transitions.default
    },
    searchSection: { padding: '20px 40px' },
    inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
    searchIcon: { position: 'absolute', left: '15px', color: Theme.colors.accent, opacity: 0.6 },
    searchInput: {
        width: '100%', boxSizing: 'border-box',
        backgroundColor: Theme.colors.background,
        border: `1px solid ${Theme.colors.border}`,
        borderRadius: '12px', padding: '12px 12px 12px 45px',
        color: Theme.colors.text, fontSize: '1rem', outline: 'none',
        transition: Theme.transitions.default
    },
    listContainer: { flex: 1, overflowY: 'auto', padding: '0 40px 20px 40px' },
    stateBox: { textAlign: 'center', padding: '60px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' },
    stateText: { color: Theme.colors.textMuted, margin: 0 },
    miniLoader: { width: '30px', height: '30px', border: '3px solid rgba(255,255,255,0.1)', borderTopColor: Theme.colors.accent, borderRadius: '50%', animation: 'spin 1s linear infinite' },
    errorIcon: { fontSize: '2rem' },
    emptyIcon: { fontSize: '2rem', opacity: 0.5 },
    productItem: {
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '12px 20px', borderRadius: '16px', marginBottom: '12px',
        backgroundColor: 'rgba(255,255,255,0.03)', border: `1px solid ${Theme.colors.border}`,
        cursor: 'pointer', transition: Theme.transitions.default
    },
    productMain: { display: 'flex', alignItems: 'center', gap: '15px', flex: 1, minWidth: '0' },
    thumbnail: {
        width: '50px', height: '50px', borderRadius: '10px',
        objectFit: 'cover', border: `1px solid ${Theme.colors.border}`
    },
    productInfo: { 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '4px', 
        flex: 1, 
        minWidth: '0',
        textAlign: 'left' // Ensure absolute left alignment
    },
    productName: { 
        color: Theme.colors.text, 
        fontWeight: 700, 
        fontSize: '1rem',
        whiteSpace: 'nowrap', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis',
        textAlign: 'left' // Double check
    },
    productId: { 
        fontSize: '0.7rem', 
        color: Theme.colors.textMuted, 
        fontFamily: 'monospace',
        whiteSpace: 'nowrap', 
        overflow: 'hidden', 
        textOverflow: 'ellipsis',
        textAlign: 'left' // Double check
    },
    productMeta: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', minWidth: '80px', marginLeft: '15px' },
    stockBadge: { fontSize: '0.75rem', fontWeight: 700, color: Theme.colors.success, backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '6px' },
    productPrice: { color: Theme.colors.accent, fontWeight: 800, fontSize: '1.1rem' },
    footer: { padding: '15px 40px', borderTop: `1px solid ${Theme.colors.border}`, backgroundColor: 'rgba(0,0,0,0.2)' },
    footerInfo: { fontSize: '0.8rem', color: Theme.colors.textMuted, margin: 0, textAlign: 'right' }
};
