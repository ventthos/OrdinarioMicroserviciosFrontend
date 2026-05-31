import React, { useEffect } from 'react';
import { useProductViewModel } from '../hooks/useProductViewModel';
import { Theme } from '../theme';

export const ProductListView: React.FC = () => {
    const { products, loading, error, refreshProducts } = useProductViewModel();

    useEffect(() => {
        refreshProducts();
    }, [refreshProducts]);

    return (
        <div style={styles.viewContainer}>
            <header style={styles.viewHeader}>
                <div>
                    <h2 style={styles.title}>Inventario de Productos</h2>
                    <p style={styles.subtitle}>Gestión de stock, precios y catálogo de videojuegos</p>
                </div>
            </header>

            {loading ? (
                <div style={styles.stateContainer}>
                    <div style={styles.loader}></div>
                    <p>Consultando catálogo...</p>
                </div>
            ) : error ? (
                <div style={styles.stateContainer}>
                    <div style={styles.errorIcon}>⚠️</div>
                    <p style={styles.errorText}>{error}</p>
                    <button onClick={refreshProducts} style={styles.retryButton}>Reintentar Carga</button>
                </div>
            ) : (
                <div style={styles.grid}>
                    {products.map((product) => (
                        <div key={product.id} style={styles.card}>
                            <div style={styles.imageContainer}>
                                <img src={product.imageUrl} alt={product.name} style={styles.image} />
                                <div style={styles.priceTag}>${product.price.toFixed(2)}</div>
                            </div>
                            <div style={styles.cardContent}>
                                <h4 style={styles.productName}>{product.name}</h4>
                                <p style={styles.productDesc}>{product.description}</p>
                                <div style={styles.metaInfo}>
                                    <span style={styles.stockInfo}>
                                        📦 Stock: <span style={{ color: product.quantity > 0 ? Theme.colors.success : Theme.colors.error }}>
                                            {product.quantity} unidades
                                        </span>
                                    </span>
                                    <span style={styles.supplierText}>🏷️ {product.supplier}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    viewContainer: { animation: 'fadeIn 0.5s ease-out' },
    viewHeader: { marginBottom: '30px' },
    title: { fontSize: '2rem', margin: 0 },
    subtitle: { color: Theme.colors.textMuted, margin: '5px 0 0 0' },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '25px',
    },
    card: {
        backgroundColor: Theme.colors.surface,
        borderRadius: '16px',
        border: `1px solid ${Theme.colors.border}`,
        overflow: 'hidden',
        transition: Theme.transitions.default,
        position: 'relative',
    },
    imageContainer: {
        height: '200px',
        position: 'relative',
        backgroundColor: '#000',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity: 0.8,
    },
    priceTag: {
        position: 'absolute',
        top: '15px',
        right: '15px',
        backgroundColor: Theme.colors.primary,
        color: '#fff',
        padding: '5px 12px',
        borderRadius: '8px',
        fontWeight: 700,
        boxShadow: Theme.shadows.glow,
    },
    cardContent: {
        padding: '20px',
    },
    productName: {
        margin: '0 0 10px 0',
        fontSize: '1.2rem',
        color: Theme.colors.text,
    },
    productDesc: {
        fontSize: '0.9rem',
        color: Theme.colors.textMuted,
        margin: '0 0 20px 0',
        lineHeight: '1.4',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
    },
    metaInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        paddingTop: '15px',
        borderTop: `1px solid ${Theme.colors.border}`,
    },
    stockInfo: { fontSize: '0.85rem', fontWeight: 600 },
    supplierText: { fontSize: '0.8rem', color: Theme.colors.textMuted },
    stateContainer: { padding: '100px', textAlign: 'center' },
    loader: { width: '40px', height: '40px', border: '3px solid #333', borderTopColor: Theme.colors.primary, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' },
};
