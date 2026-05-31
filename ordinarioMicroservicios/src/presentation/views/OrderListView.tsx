import React, { useEffect, useState } from 'react';
import { useOrderViewModel } from '../hooks/useOrderViewModel';
import { OrderFormModal } from '../components/OrderFormModal';

interface OrderListViewProps {
    onViewDetail: (orderId: string) => void;
}

export const OrderListView: React.FC<OrderListViewProps> = ({ onViewDetail }) => {
    const { orders, loading, error, fetchAllOrders, createOrder, setError } = useOrderViewModel();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchAllOrders();
    }, []);

    return (
        <div style={styles.content}>
            <header style={styles.header}>
                <h1 style={styles.title}>LISTADO DE ÓRDENES</h1>
                <button 
                    style={styles.createBtn} 
                    onClick={() => setIsModalOpen(true)}
                >
                    + NUEVA ORDEN
                </button>
            </header>

            <main style={styles.resultSection}>
                {loading && <div style={styles.loadingBox}>CARGANDO ÓRDENES...</div>}
                {error && <div style={styles.errorBox}>{error}</div>}
                
                {!loading && !error && orders.length > 0 && (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>ID</th>
                                    <th style={styles.th}>CÓDIGO</th>
                                    <th style={styles.th}>FECHA</th>
                                    <th style={styles.th}>USUARIO</th>
                                    <th style={styles.th}>TOTAL</th>
                                    <th style={styles.th}>ESTADO</th>
                                    <th style={styles.th}>ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} style={styles.tr}>
                                        <td style={styles.td}>{order.id}</td>
                                        <td style={styles.td}>{order.orderCode}</td>
                                        <td style={styles.td}>{order.orderDate}</td>
                                        <td style={styles.td}>{order.user}</td>
                                        <td style={{ ...styles.td, color: '#4ecca3', fontWeight: 'bold' }}>
                                            ${order.totalAmount.toFixed(2)}
                                        </td>
                                        <td style={styles.td}>
                                            <span style={{
                                                ...styles.statusBadge,
                                                backgroundColor: order.status === 'COMPLETED' || order.status === 'Pagado' || order.status === 'Pagada' ? '#4ecca3' : '#e94560'
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <button 
                                                onClick={() => onViewDetail(order.id)}
                                                style={styles.viewButton}
                                                title="Ver Detalle"
                                            >
                                                👁️
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {!loading && !error && orders.length === 0 && (
                    <div style={styles.infoBox}>No se encontraron órdenes.</div>
                )}
            </main>

            <OrderFormModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSubmit={createOrder} 
                onError={(msg) => setError(msg)} 
            />
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    content: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
    },
    header: {
        borderBottom: '4px solid #e94560',
        marginBottom: '40px',
        paddingBottom: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    title: {
        margin: 0,
        color: '#4ecca3',
        fontSize: '2.5rem'
    },
    createBtn: {
        backgroundColor: '#e94560',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        fontWeight: 'bold',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: 'transform 0.2s'
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
    infoBox: {
        backgroundColor: 'rgba(78, 204, 163, 0.1)',
        border: '1px solid #4ecca3',
        color: '#fff',
        padding: '20px',
        borderRadius: '5px',
        textAlign: 'center',
        fontSize: '1.1rem'
    },
    tableContainer: {
        backgroundColor: 'rgba(26, 26, 46, 0.95)',
        border: '1px solid #4ecca3',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 0 20px rgba(0,0,0,0.5)',
        overflowX: 'auto'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        color: '#fff'
    },
    th: {
        textAlign: 'left',
        padding: '15px',
        borderBottom: '2px solid #e94560',
        color: '#4ecca3',
        fontSize: '0.9rem',
        textTransform: 'uppercase'
    },
    tr: {
        borderBottom: '1px solid rgba(233, 69, 96, 0.2)',
        transition: 'background-color 0.2s'
    },
    td: {
        padding: '15px',
        fontSize: '0.9rem'
    },
    statusBadge: {
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '0.75rem',
        fontWeight: 'bold',
        color: '#1a1a2e',
        textTransform: 'uppercase'
    },
    viewButton: {
        background: 'none',
        border: '1px solid #4ecca3',
        borderRadius: '5px',
        padding: '5px 10px',
        cursor: 'pointer',
        fontSize: '1.2rem',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
};
