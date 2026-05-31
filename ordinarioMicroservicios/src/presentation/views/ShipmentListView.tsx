import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShipmentViewModel } from '../hooks/useShipmentViewModel';
import { Theme } from '../theme';

export const ShipmentListView: React.FC = () => {
    const { shipments, loading, error, fetchAllShipments } = useShipmentViewModel();
    const navigate = useNavigate();

    useEffect(() => {
        fetchAllShipments();
    }, [fetchAllShipments]);

    return (
        <div style={styles.viewContainer}>
            <header style={styles.viewHeader}>
                <div>
                    <h2 style={styles.title}>Logística de Envíos</h2>
                    <p style={styles.subtitle}>Rastreo de paquetes y estado de entregas en tiempo real</p>
                </div>
                <button onClick={fetchAllShipments} style={styles.refreshButton}>
                    🔄 Sincronizar
                </button>
            </header>

            <div style={styles.contentCard}>
                {loading ? (
                    <div style={styles.stateContainer}>
                        <div style={styles.loader}></div>
                        <p style={styles.loadingText}>Accediendo a la base de datos de PostgreSQL...</p>
                    </div>
                ) : error ? (
                    <div style={styles.stateContainer}>
                        <div style={styles.errorIcon}>⚠️</div>
                        <p style={styles.errorText}>{error}</p>
                        <button onClick={fetchAllShipments} style={styles.retryButton}>Reintentar Conexión</button>
                    </div>
                ) : shipments.length === 0 ? (
                    <div style={styles.stateContainer}>
                        <div style={styles.emptyIcon}>📦</div>
                        <p style={styles.emptyText}>No hay envíos programados en este momento.</p>
                    </div>
                ) : (
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>ID Tracking</th>
                                    <th style={styles.th}>Orden Relacionada</th>
                                    <th style={styles.th}>Estado</th>
                                    <th style={styles.th}>Fecha de Registro</th>
                                    <th style={styles.th}>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shipments.map((shipment) => (
                                    <tr key={shipment.id} style={styles.tr}>
                                        <td style={styles.td}>
                                            <span style={styles.idBadge}>#{shipment.id}</span>
                                        </td>
                                        <td style={styles.td}>
                                            <code style={styles.orderCode}>{shipment.ordenId}</code>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={{
                                                ...styles.statusBadge,
                                                backgroundColor: shipment.statusEnvio === 'Enviado' 
                                                    ? 'rgba(16, 185, 129, 0.1)' 
                                                    : 'rgba(239, 68, 68, 0.1)',
                                                color: shipment.statusEnvio === 'Enviado' 
                                                    ? Theme.colors.success 
                                                    : Theme.colors.error,
                                                borderColor: shipment.statusEnvio === 'Enviado' 
                                                    ? 'rgba(16, 185, 129, 0.2)' 
                                                    : 'rgba(239, 68, 68, 0.2)',
                                            }}>
                                                {shipment.statusEnvio}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <span style={styles.dateText}>
                                                {shipment.fechaCreacion 
                                                    ? new Date(shipment.fechaCreacion).toLocaleString('es-MX', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    }) 
                                                    : 'Pendiente'
                                                }
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            <button 
                                                onClick={() => navigate(`/orders/${shipment.ordenId}`)}
                                                style={styles.actionButton}
                                                title="Inspeccionar Orden"
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
            </div>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    viewContainer: {
        animation: 'fadeIn 0.5s ease-out',
    },
    viewHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '30px',
    },
    title: {
        fontSize: '2rem',
        margin: 0,
        color: Theme.colors.text,
    },
    subtitle: {
        color: Theme.colors.textMuted,
        margin: '5px 0 0 0',
        fontSize: '1rem',
    },
    refreshButton: {
        backgroundColor: Theme.colors.surfaceLight,
        color: Theme.colors.text,
        border: `1px solid ${Theme.colors.border}`,
        padding: '10px 20px',
        borderRadius: '8px',
        fontSize: '0.9rem',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
    },
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
    loadingText: {
        color: Theme.colors.textMuted,
        fontSize: '1.1rem',
    },
    errorIcon: { fontSize: '3rem' },
    errorText: { color: Theme.colors.error, fontSize: '1.1rem' },
    retryButton: {
        backgroundColor: Theme.colors.error,
        color: '#fff',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        marginTop: '10px',
    },
    emptyIcon: { fontSize: '3rem', opacity: 0.5 },
    emptyText: { color: Theme.colors.textMuted, fontSize: '1.1rem' },
    tableWrapper: {
        overflowX: 'auto',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
    },
    th: {
        textAlign: 'center',
        padding: '20px',
        backgroundColor: 'rgba(124, 58, 237, 0.05)',
        color: Theme.colors.primary,
        fontSize: '0.85rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '1px',
        borderBottom: `1px solid ${Theme.colors.border}`,
    },
    tr: {
        borderBottom: `1px solid ${Theme.colors.border}`,
        transition: Theme.transitions.default,
    },
    td: {
        padding: '20px',
        fontSize: '0.95rem',
        color: Theme.colors.text,
        textAlign: 'center',
    },
    idBadge: {
        backgroundColor: Theme.colors.surfaceLight,
        padding: '4px 8px',
        borderRadius: '6px',
        fontFamily: 'monospace',
        color: Theme.colors.accent,
    },
    orderCode: {
        color: Theme.colors.textMuted,
        fontSize: '0.85rem',
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: '4px 8px',
        borderRadius: '4px',
    },
    statusBadge: {
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: 600,
        border: '1px solid',
    },
    dateText: {
        color: Theme.colors.textMuted,
        fontSize: '0.9rem',
    },
    actionButton: {
        background: 'none',
        border: `1px solid ${Theme.colors.border}`,
        color: Theme.colors.primary,
        width: '36px',
        height: '36px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.1rem',
        transition: Theme.transitions.default,
    }
};
