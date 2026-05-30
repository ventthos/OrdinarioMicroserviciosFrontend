import React from 'react';
import type { Product } from '../../domain/models/Product';

interface ProductCardProps {
    product: Product;
    onDelete: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onDelete }) => {
    return (
        <div style={styles.card}>
            <div style={styles.imageContainer}>
                <img src={product.imageUrl} alt={product.name} style={styles.image} />
                <div style={styles.priceTag}>${product.price.toFixed(2)}</div>
            </div>
            <div style={styles.content}>
                <h3 style={styles.title}>{product.name}</h3>
                <p style={styles.description}>{product.description}</p>
                <div style={styles.infoRow}>
                    <span style={styles.stock}>Stock: {product.quantity}</span>
                    <span style={styles.supplier}>{product.supplier}</span>
                </div>
                <button 
                    onClick={() => onDelete(product.id)} 
                    style={styles.deleteButton}
                >
                    DELETE ITEM
                </button>
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    card: {
        backgroundColor: '#1a1a2e',
        border: '2px solid #0f3460',
        borderRadius: '8px',
        overflow: 'hidden',
        width: '280px',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
        transition: 'transform 0.2s',
        margin: '10px',
        color: '#e94560'
    },
    imageContainer: {
        position: 'relative',
        height: '180px',
        width: '100%',
        backgroundColor: '#16213e'
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover'
    },
    priceTag: {
        position: 'absolute',
        top: '10px',
        right: '10px',
        backgroundColor: '#e94560',
        color: '#fff',
        padding: '5px 10px',
        borderRadius: '4px',
        fontWeight: 'bold',
        fontSize: '1.1rem',
        boxShadow: '0 0 10px #e94560'
    },
    content: {
        padding: '15px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    title: {
        margin: 0,
        fontSize: '1.2rem',
        color: '#4ecca3',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },
    description: {
        margin: 0,
        fontSize: '0.9rem',
        color: '#95a5a6',
        height: '40px',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
    },
    infoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '0.8rem',
        color: '#bdc3c7'
    },
    stock: {
        fontWeight: 'bold'
    },
    supplier: {
        fontStyle: 'italic'
    },
    deleteButton: {
        backgroundColor: 'transparent',
        border: '2px solid #e94560',
        color: '#e94560',
        padding: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        transition: 'all 0.3s',
        marginTop: '5px'
    }
};
