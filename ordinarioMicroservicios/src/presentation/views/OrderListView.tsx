import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderViewModel } from '../hooks/useOrderViewModel';
import { Theme } from '../theme';

export const OrderListView: React.FC = () => {
    const { orders, loading, error, fetchAllOrders } = useOrderViewModel();
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllOrders();
    }, [fetchAllOrders]);

    return (
        <div style={styles.viewContainer}>
            <header style={styles.viewHeader}>
                <div>
                    <h2 style={styles.title}>Historial de Órdenes</h2>
                    <p style={styles.subtitle}>Gestión integral de transacciones y estados de pedido</p>
                </div>
            </header>

            <div style={styles.contentCard}>
                {loading ? (
                    <div style={styles.stateContainer}>
                        <div style={styles.loader}></div>
                        <p style={styles.loadingText}>Sincronizando con el servidor de órdenes...</p>
                    </div>
                ) : error ? (
                    <div style={styles.stateContainer}>
                        <div style={styles.errorIcon}>❌</div>
                        <p style={styles.errorText}>{error}</p>
                        <button onClick={fetchAllOrders} style={styles.retryButton}>Reintentar Carga</button>
                    </div>
                ) : orders.length === 0 ? (
                    <div style={styles.stateContainer}>
                        <div style={styles.emptyIcon}>📂</div>
                        <p style={styles.emptyText}>Aún no se han registrado órdenes en el sistema.</p>
                    </div>
                ) : (
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>Código</th>
                                    <th style={styles.th}>Usuario</th>
                                    <th style={styles.th}>Fecha</th>
                                    <th style={styles.th}>Total</th>
                                    <th style={styles.th}>Deuda</th>
                                    <th style={styles.th}>Estado</th>
                                    <th style={styles.th}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id} style={styles.tr}>
                                        <td style={styles.td}>
                                            <span style={styles.orderCodeBadge}>{order.orderCode}</span>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={styles.userText}>{order.user}</span>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={styles.dateText}>{order.orderDate}</span>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={styles.totalText}>${order.totalAmount.toFixed(2)}</span>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={{
                                                ...styles.debtText,
                                                color: (order.debt || 0) > 0 ? Theme.colors.error : Theme.colors.success
                                            }}>
                                                ${(order.debt || 0).toFixed(2)}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={{
                                                ...styles.statusBadge,
                                                backgroundColor: order.status === 'COMPLETED' || order.status === 'Pagado' 
                                                    ? 'rgba(16, 185, 129, 0.1)' 
                                                    : 'rgba(245, 158, 11, 0.1)',
                                                color: order.status === 'COMPLETED' || order.status === 'Pagado' 
                                                    ? Theme.colors.success 
                                                    : Theme.colors.warning,
                                                borderColor: order.status === 'COMPLETED' || order.status === 'Pagado' 
                                                    ? 'rgba(16, 185, 129, 0.2)' 
                                                    : 'rgba(245, 158, 11, 0.2)',
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <button 
                                                onClick={() => navigate(`/orders/${order.id}`)}
                                                style={styles.actionButton}
                                                title="Ver Detalles"
                                            >
                                                🔍
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    viewContainer: { animation: 'fadeIn 0.5s ease-out' },
    viewHeader: { marginBottom: '30px' },
    title: { fontSize: '2rem', margin: 0, color: Theme.colors.text },
    subtitle: { color: Theme.colors.textMuted, margin: '5px 0 0 0' },
    contentCard: {
        backgroundColor: Theme.colors.surface,
        borderRadius: '16px',
        border: `1px solid ${Theme.colors.border}`,
        overflow: 'hidden',
        boxShadow: Theme.shadows.card,
    },
    stateContainer: {
        padding: '80px 40px',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '20px',
    },
    loader: {
        width: '40px',
        height: '40px',
        border: `3px solid ${Theme.colors.surfaceLight}`,
        borderTop: `3px solid ${Theme.colors.primary}`,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    loadingText: { color: Theme.colors.textMuted },
    errorIcon: { fontSize: '3rem' },
    errorText: { color: Theme.colors.error },
    retryButton: {
        backgroundColor: Theme.colors.primary,
        color: '#fff',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
    },
    emptyIcon: { fontSize: '3rem', opacity: 0.5 },
    emptyText: { color: Theme.colors.textMuted },
    tableWrapper: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: {
        textAlign: 'left',
        padding: '20px',
        backgroundColor: 'rgba(124, 58, 237, 0.05)',
        color: Theme.colors.primary,
        fontSize: '0.85rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        borderBottom: `1px solid ${Theme.colors.border}`,
    },
    tr: {
        borderBottom: `1px solid ${Theme.colors.border}`,
        transition: Theme.transitions.default,
    },
    td: { padding: '20px', fontSize: '0.95rem', color: Theme.colors.text },
    orderCodeBadge: {
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        color: Theme.colors.accent,
        padding: '4px 10px',
        borderRadius: '6px',
        fontWeight: 600,
        fontFamily: 'Rajdhani, sans-serif',
    },
    userText: { fontWeight: 500 },
    dateText: { color: Theme.colors.textMuted, fontSize: '0.9rem' },
    totalText: { fontWeight: 700, color: Theme.colors.primary },
    debtText: { fontWeight: 600 },
    statusBadge: {
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: 600,
        border: '1px solid',
    },
    actionButton: {
        background: 'none',
        border: `1px solid ${Theme.colors.border}`,
        color: Theme.colors.primary,
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        cursor: 'pointer',
        fontSize: '1rem',
        transition: Theme.transitions.default,
    }
};
