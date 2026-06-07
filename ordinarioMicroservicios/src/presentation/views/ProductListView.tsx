import React, { useEffect, useState } from 'react';
import { useProductViewModel } from '../hooks/useProductViewModel';
import { Theme } from '../theme';
import { ProductFormModal } from '../components/ProductFormModal';
import { ConfirmationModal } from '../components/ConfirmationModal';

export const ProductListView: React.FC = () => {
    const { 
        products, 
        loading, 
        error, 
        refreshProducts, 
        createProduct,
        deleteProduct,
        modalConfig,
        closeModal,
        showNotification 
    } = useProductViewModel();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        refreshProducts();
    }, [refreshProducts]);

    return (
        <div style={styles.viewContainer}>
            <header style={styles.viewHeader}>
                <div>
                    <h2 style={styles.title}>Almacén Central</h2>
                    <p style={styles.subtitle}>Gestión de stock, precios y catálogo de hardware gaming</p>
                </div>
                <button 
                    onClick={() => setIsCreateModalOpen(true)}
                    style={styles.createButton}
                >
                    + Nuevo Artículo
                </button>
            </header>

            {loading ? (
                <div style={styles.stateContainer}>
                    <div style={styles.loader}></div>
                    <p style={styles.loadingText}>Escaneando inventario...</p>
                </div>
            ) : error ? (
                <div style={styles.stateContainer}>
                    <div style={styles.errorIcon}>⚠️</div>
                    <p style={styles.errorText}>{error}</p>
                    <button onClick={refreshProducts} style={styles.retryButton}>Reiniciar Sistemas</button>
                </div>
            ) : (
                <div style={styles.grid}>
                    {products.map((product) => (
                        <div key={product.id} style={styles.card}>
                            <button 
                                onClick={() => deleteProduct(product.id)}
                                style={styles.deleteButton}
                                title="Eliminar Producto"
                            >
                                🗑️
                            </button>
                            <div style={styles.imageContainer}>
                                <img src={product.imageUrl} alt={product.name} style={styles.image} />
                                <div style={styles.priceTag}>$ {product.price.toFixed(2)} MXN</div>
                            </div>
                            <div style={styles.cardContent}>
                                <h4 style={styles.productName}>{product.name}</h4>
                                <p style={styles.productDesc}>{product.description}</p>
                                <div style={styles.metaInfo}>
                                    <div style={styles.metaRow}>
                                        <span style={styles.metaLabel}>Stock:</span>
                                        <span style={{ 
                                            ...styles.metaValue, 
                                            color: product.quantity > 0 ? Theme.colors.success : Theme.colors.error,
                                        }}>
                                            {product.quantity} U
                                        </span>
                                    </div>
                                    <div style={styles.metaRow}>
                                        <span style={styles.metaLabel}>Proveedor:</span>
                                        <span style={{ ...styles.metaValue, color: Theme.colors.accent }}>
                                            {product.supplier.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ProductFormModal 
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onSubmit={createProduct}
                onError={(msg) => showNotification("ERROR DE REGISTRO", msg, "danger")}
            />

            <ConfirmationModal 
                isOpen={modalConfig.isOpen}
                onCancel={closeModal}
                title={modalConfig.title}
                message={modalConfig.message}
                type={modalConfig.type}
                onConfirm={modalConfig.onConfirm}
                hideCancel={modalConfig.hideCancel}
            />
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    viewContainer: { animation: 'fadeIn 0.5s ease-out' },
    viewHeader: { 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '40px' 
    },
    title: { fontSize: '2.5rem', margin: 0, textShadow: Theme.shadows.glow },
    subtitle: { color: Theme.colors.textMuted, margin: '5px 0 0 0', fontSize: '1.1rem' },
    createButton: {
        backgroundColor: Theme.colors.primary,
        color: '#fff',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '12px',
        fontWeight: 700,
        boxShadow: Theme.shadows.glow,
        fontSize: '1rem',
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '20px',
    },
    card: {
        backgroundColor: Theme.colors.surface,
        borderRadius: '16px',
        border: `1px solid ${Theme.colors.border}`,
        overflow: 'hidden',
        transition: Theme.transitions.default,
        boxShadow: Theme.shadows.card,
        position: 'relative',
    },
    imageContainer: {
        height: '160px',
        position: 'relative',
        backgroundColor: '#000',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        opacity: 0.6,
        transition: 'transform 0.5s ease',
    },
    deleteButton: {
        position: 'absolute',
        top: '10px',
        left: '10px',
        zIndex: 10,
        backgroundColor: 'rgba(255, 49, 49, 0.2)',
        color: Theme.colors.error,
        border: `1px solid ${Theme.colors.error}`,
        borderRadius: '8px',
        width: '32px',
        height: '32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        backdropFilter: 'blur(5px)',
        transition: Theme.transitions.default,
    },
    priceTag: {
        position: 'absolute',
        bottom: '10px',
        right: '10px',
        backgroundColor: 'rgba(0, 242, 255, 0.2)',
        color: Theme.colors.accent,
        padding: '4px 10px',
        borderRadius: '8px',
        fontWeight: 800,
        fontSize: '1rem',
        backdropFilter: 'blur(10px)',
        border: `1px solid ${Theme.colors.accent}`,
    },
    cardContent: {
        padding: '15px',
    },
    productName: {
        margin: '0 0 5px 0',
        fontSize: '1.2rem',
        color: Theme.colors.text,
        fontFamily: 'Rajdhani, sans-serif',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    productDesc: {
        fontSize: '0.85rem',
        color: Theme.colors.textMuted,
        margin: '0 0 15px 0',
        lineHeight: '1.4',
        height: '2.8em',
        overflow: 'hidden',
    },
    metaInfo: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        paddingTop: '12px',
        borderTop: `1px solid ${Theme.colors.border}`,
    },
    metaRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    metaLabel: {
        fontSize: '0.7rem',
        color: Theme.colors.textMuted,
        fontWeight: 700,
    },
    metaValue: {
        fontSize: '0.85rem',
        fontWeight: 700,
    },
    stateContainer: { padding: '100px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' },
    loader: { width: '50px', height: '50px', border: '4px solid #1a1a1e', borderTopColor: Theme.colors.primary, borderRadius: '50%', animation: 'spin 1s linear infinite' },
    loadingText: { color: Theme.colors.primary, fontWeight: 600, letterSpacing: '2px' },
    errorIcon: { fontSize: '4rem' },
    errorText: { color: Theme.colors.error, fontSize: '1.2rem' },
    retryButton: {
        backgroundColor: 'transparent',
        border: `2px solid ${Theme.colors.error}`,
        color: Theme.colors.error,
        padding: '12px 24px',
        borderRadius: '12px',
        fontWeight: 700,
    }
};
