import React, { useEffect } from 'react';
import { useOrderViewModel } from '../hooks/useOrderViewModel';

interface OrderDetailViewProps {
    orderId: string;
    onBack: () => void;
}

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({ orderId, onBack }) => {
    const { order, loading, error, searchOrder } = useOrderViewModel();

    useEffect(() => {
        if (orderId) {
            searchOrder(orderId);
        }
    }, [orderId]);

    return (
        <div style={styles.content}>
            <header style={styles.header}>
                <button onClick={onBack} style={styles.backButton}>← VOLVER</button>
                <h1 style={styles.title}>DETALLE DE LA ORDEN</h1>
            </header>

            <main style={styles.resultSection}>
                {loading && <div style={styles.loadingBox}>CARGANDO DETALLE...</div>}
                {error && <div style={styles.errorBox}>{error}</div>}
                
                {order && (
                    <div style={styles.orderCard}>
                        <div style={styles.orderHeader}>
                            <h2 style={styles.orderCode}>{order.orderCode}</h2>
                            <span style={{
                                ...styles.orderStatus,
                                backgroundColor: order.status === 'COMPLETED' || order.status === 'Pagado' || order.status === 'Pagada' ? '#4ecca3' : '#e94560'
                            }}>
                                {order.status}
                            </span>
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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
    },
    backButton: {
        position: 'absolute',
        left: 0,
        backgroundColor: 'transparent',
        border: '1px solid #e94560',
        color: '#e94560',
        padding: '5px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    title: {
        margin: 0,
        color: '#4ecca3',
        fontSize: '2rem'
    },
    resultSection: {
        minHeight: '200px'
    },
    loadingBox: {
        color: '#4ecca3',
        textAlign: 'center',
        padding: '40px',
        fontSize: '1.5rem'
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
