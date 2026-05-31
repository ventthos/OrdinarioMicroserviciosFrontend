import React, { useEffect, useState } from 'react';
import { useProductViewModel } from '../hooks/useProductViewModel';
import type { Product } from '../../domain/models/Product';

interface ProductSelectorModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (product: Product) => void;
}

export const ProductSelectorModal: React.FC<ProductSelectorModalProps> = ({ isOpen, onClose, onSelect }) => {
    const { products, loading, error, refreshProducts } = useProductViewModel();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (isOpen) {
            refreshProducts();
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div style={styles.backdrop}>
            <div style={styles.modal}>
                <header style={styles.header}>
                    <h2 style={styles.title}>SELECCIONAR PRODUCTO</h2>
                    <button onClick={onClose} style={styles.closeBtn}>✕</button>
                </header>

                <div style={styles.searchContainer}>
                    <input 
                        type="text" 
                        placeholder="Buscar por nombre o ID..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>

                <div style={styles.listContainer}>
                    {loading && <div style={styles.infoText}>Cargando productos...</div>}
                    {error && <div style={{ ...styles.infoText, color: '#e94560' }}>{error}</div>}
                    
                    {!loading && filteredProducts.length === 0 && (
                        <div style={styles.infoText}>No se encontraron productos.</div>
                    )}

                    {filteredProducts.map(product => (
                        <div 
                            key={product.id} 
                            style={styles.productItem}
                            onClick={() => {
                                onSelect(product);
                                onClose();
                            }}
                        >
                            <div style={styles.productInfo}>
                                <span style={styles.productName}>{product.name}</span>
                                <span style={styles.productId}>ID: {product.id}</span>
                            </div>
                            <div style={styles.productPrice}>
                                ${product.price.toFixed(2)}
                            </div>
                        </div>
                    ))}
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
        zIndex: 1100,
        backdropFilter: 'blur(8px)'
    },
    modal: {
        backgroundColor: '#16213e',
        border: '2px solid #4ecca3',
        borderRadius: '10px',
        width: '90%',
        maxWidth: '500px',
        height: '80vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 0 30px rgba(78, 204, 163, 0.2)'
    },
    header: {
        padding: '20px',
        borderBottom: '1px solid rgba(78, 204, 163, 0.3)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        color: '#4ecca3',
        margin: 0,
        fontSize: '1.2rem',
        letterSpacing: '1px'
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        color: '#e94560',
        fontSize: '1.5rem',
        cursor: 'pointer'
    },
    searchContainer: {
        padding: '15px'
    },
    searchInput: {
        width: '100%',
        backgroundColor: '#1a1a2e',
        border: '1px solid #4ecca3',
        borderRadius: '4px',
        padding: '12px',
        color: '#fff',
        fontFamily: 'inherit',
        outline: 'none'
    },
    listContainer: {
        flex: 1,
        overflowY: 'auto',
        padding: '0 15px 15px 15px'
    },
    infoText: {
        textAlign: 'center',
        padding: '20px',
        color: '#4ecca3'
    },
    productItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px',
        borderBottom: '1px solid rgba(233, 69, 96, 0.2)',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    },
    productInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
    },
    productName: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '1rem'
    },
    productId: {
        color: '#e94560',
        fontSize: '0.75rem'
    },
    productPrice: {
        color: '#4ecca3',
        fontWeight: 'bold',
        fontSize: '1.1rem'
    }
};
