import React from 'react';
import { useProductViewModel } from '../hooks/useProductViewModel';
import heroBackground from '../../assets/hero.png';

export const ProductListView: React.FC = () => {
    const { products, loading, error, deleteProduct } = useProductViewModel();

    if (loading) {
        return (
            <div style={styles.container}>
                <h1 style={styles.loadingText}>CARGANDO SISTEMA...</h1>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.container}>
                <h1 style={styles.errorText}>ERROR DEL SISTEMA: {error}</h1>
            </div>
        );
    }

    return (
        <div style={styles.content}>
            <header style={styles.header}>
                <h1 style={styles.title}>GAME NEXUS POS</h1>
                <div style={styles.stats}>
                    TOTAL DE ARTÍCULOS: {products.length}
                </div>
            </header>
            <main style={styles.tableContainer}>
                {products.length === 0 ? (
                    <p style={styles.emptyText}>NO SE DETECTÓ INVENTARIO</p>
                ) : (
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>IMAGEN</th>
                                <th style={styles.th}>NOMBRE</th>
                                <th style={styles.th}>DESCRIPCIÓN</th>
                                <th style={styles.th}>PRECIO</th>
                                <th style={styles.th}>STOCK</th>
                                <th style={styles.th}>PROVEEDOR</th>
                                <th style={styles.th}>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id} style={styles.tr}>
                                    <td style={styles.td}>
                                        <img src={product.imageUrl} alt={product.name} style={styles.productImg} />
                                    </td>
                                    <td style={{ ...styles.td, color: '#4ecca3', fontWeight: 'bold' }}>{product.name}</td>
                                    <td style={styles.td}>{product.description}</td>
                                    <td style={{ ...styles.td, color: '#e94560' }}>${product.price.toFixed(2)}</td>
                                    <td style={styles.td}>{product.quantity}</td>
                                    <td style={styles.td}>{product.supplier}</td>
                                    <td style={styles.td}>
                                        <button 
                                            onClick={() => deleteProduct(product.id)}
                                            style={styles.deleteButton}
                                        >
                                            ELIMINAR
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </main>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        minHeight: '100vh',
        position: 'relative',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    content: {
        padding: '20px'
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '4px solid #e94560',
        marginBottom: '30px',
        paddingBottom: '10px'
    },
    title: {
        margin: 0,
        color: '#4ecca3',
        fontSize: '2.5rem',
        textShadow: '0 0 10px #4ecca3'
    },
    stats: {
        color: '#fff',
        fontWeight: 'bold',
        backgroundColor: '#1a1a2e',
        padding: '10px 20px',
        borderRadius: '5px',
        border: '1px solid #4ecca3'
    },
    tableContainer: {
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        overflowX: 'auto',
        backgroundColor: 'rgba(26, 26, 46, 0.95)',
        borderRadius: '10px',
        padding: '20px',
        border: '1px solid #4ecca3',
        boxSizing: 'border-box',
        boxShadow: '0 0 20px rgba(0, 0, 0, 0.5)'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        color: '#fff'
    },
    th: {
        textAlign: 'left',
        padding: '12px',
        borderBottom: '2px solid #e94560',
        color: '#4ecca3',
        textTransform: 'uppercase',
        letterSpacing: '1px'
    },
    tr: {
        borderBottom: '1px solid rgba(233, 69, 96, 0.3)',
        transition: 'background-color 0.3s'
    },
    td: {
        padding: '12px',
        fontSize: '0.95rem'
    },
    productImg: {
        width: '50px',
        height: '50px',
        objectFit: 'cover',
        borderRadius: '5px',
        border: '1px solid #4ecca3'
    },
    deleteButton: {
        backgroundColor: '#e94560',
        color: 'white',
        border: 'none',
        padding: '8px 15px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'transform 0.2s',
        fontSize: '0.8rem'
    },
    loadingText: {
        color: '#4ecca3',
        textAlign: 'center',
        paddingTop: '20%',
        position: 'relative',
        zIndex: 2
    },
    errorText: {
        color: '#e94560',
        textAlign: 'center',
        paddingTop: '20%',
        position: 'relative',
        zIndex: 2
    },
    emptyText: {
        color: '#fff',
        fontSize: '1.5rem',
        textAlign: 'center'
    }
};
