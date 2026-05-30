import React, { useState } from 'react';
import { useOrderViewModel } from '../hooks/useOrderViewModel';

export const OrderSearchView: React.FC = () => {
    const [searchId, setSearchId] = useState('');
    const { order, loading, error, searchOrder } = useOrderViewModel();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        searchOrder(searchId);
    };

    return (
        <div style={styles.content}>
            <header style={styles.header}>
                <h1 style={styles.title}>BÚSQUEDA DE ÓRDENES</h1>
            </header>

            <section style={styles.searchSection}>
                <form onSubmit={handleSearch} style={styles.searchForm}>
                    <input 
                        type="text" 
                        value={searchId} 
                        onChange={(e) => setSearchId(e.target.value)}
                        placeholder="INGRESE ID DE LA ORDEN (ej: 69b090c1...)"
                        style={styles.searchInput}
                    />
                    <button type="submit" disabled={loading} style={styles.searchButton}>
                        {loading ? 'BUSCANDO...' : 'BUSCAR'}
                    </button>
                </form>
            </section>

            <main style={styles.resultSection}>
                {error && <div style={styles.errorBox}>{error}</div>}
                
                {order && (
                    <div style={styles.orderCard}>
                        <div style={styles.orderHeader}>
                            <h2 style={styles.orderCode}>{order.orderCode}</h2>
                            <span style={styles.orderStatus}>{order.status}</span>
                        </div>
                        
                        <div style={styles.orderGrid}>
                            <div style={styles.infoGroup}>
                                <label style={styles.label}>ID DE ORDEN</label>
                                <p style={styles.value}>{order.id}</p>
                            </div>
                            <div style={styles.infoGroup}>
                                <label style={styles.label}>FECHA</label>
                                <p style={styles.value}>{order.orderDate}</p>
                            </div>
                            <div style={styles.infoGroup}>
                                <label style={styles.label}>USUARIO</label>
                                <p style={styles.value}>{order.user}</p>
                            </div>
                            <div style={styles.infoGroup}>
                                <label style={styles.label}>MONTO TOTAL</label>
                                <p style={{ ...styles.value, color: '#4ecca3', fontSize: '1.5rem' }}>
                                    ${order.totalAmount.toFixed(2)}
                                </p>
                            </div>
                        </div>

                        <div style={styles.productsSection}>
                            <h3 style={styles.subTitle}>PRODUCTOS</h3>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>PRODUCTO ID</th>
                                        <th style={styles.th}>CANTIDAD</th>
                                        <th style={styles.th}>PRECIO UNITARIO</th>
                                        <th style={styles.th}>SUBTOTAL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.products.map((p, idx) => (
                                        <tr key={idx} style={styles.tr}>
                                            <td style={styles.td}>{p.productId}</td>
                                            <td style={styles.td}>{p.quantity}</td>
                                            <td style={styles.td}>${p.price.toFixed(2)}</td>
                                            <td style={{ ...styles.td, color: '#4ecca3' }}>
                                                ${(p.quantity * p.price).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    content: {
        padding: '20px',
        maxWidth: '1000px',
        margin: '0 auto'
    },
    header: {
        borderBottom: '4px solid #e94560',
        marginBottom: '40px',
        paddingBottom: '10px',
        textAlign: 'center'
    },
    title: {
        margin: 0,
        color: '#4ecca3',
        fontSize: '2.5rem'
    },
    searchSection: {
        marginBottom: '40px'
    },
    searchForm: {
        display: 'flex',
        gap: '15px'
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#16213e',
        border: '2px solid #4ecca3',
        borderRadius: '5px',
        padding: '15px',
        color: '#fff',
        fontSize: '1.1rem',
        outline: 'none',
        fontFamily: 'inherit'
    },
    searchButton: {
        backgroundColor: '#4ecca3',
        color: '#1a1a2e',
        border: 'none',
        padding: '0 30px',
        borderRadius: '5px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '1.1rem',
        transition: 'transform 0.2s'
    },
    resultSection: {
        minHeight: '200px'
    },
    errorBox: {
        backgroundColor: 'rgba(233, 69, 96, 0.2)',
        border: '1px solid #e94560',
        color: '#fff',
        padding: '20px',
        borderRadius: '5px',
        textAlign: 'center',
        fontSize: '1.1rem'
    },
    orderCard: {
        backgroundColor: 'rgba(26, 26, 46, 0.95)',
        border: '1px solid #4ecca3',
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0 0 20px rgba(0,0,0,0.5)'
    },
    orderHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        borderBottom: '1px solid rgba(78, 204, 163, 0.3)',
        paddingBottom: '15px'
    },
    orderCode: {
        margin: 0,
        color: '#4ecca3',
        fontSize: '1.8rem'
    },
    orderStatus: {
        backgroundColor: '#e94560',
        color: '#fff',
        padding: '5px 15px',
        borderRadius: '20px',
        fontSize: '0.9rem',
        fontWeight: 'bold'
    },
    orderGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
    },
    infoGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px'
    },
    label: {
        color: '#e94560',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        textTransform: 'uppercase'
    },
    value: {
        color: '#fff',
        margin: 0,
        fontSize: '1.1rem'
    },
    productsSection: {
        marginTop: '30px'
    },
    subTitle: {
        color: '#4ecca3',
        borderBottom: '1px solid rgba(78, 204, 163, 0.3)',
        paddingBottom: '10px',
        marginBottom: '20px'
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
        fontSize: '0.8rem'
    },
    tr: {
        borderBottom: '1px solid rgba(233, 69, 96, 0.2)'
    },
    td: {
        padding: '12px',
        fontSize: '0.9rem'
    }
};
