import React, { useEffect } from 'react';
import { useShipmentViewModel } from '../hooks/useShipmentViewModel';

interface ShipmentListViewProps {
    onViewDetail?: (orderId: string) => void;
}

export const ShipmentListView: React.FC<ShipmentListViewProps> = ({ onViewDetail }) => {
    const { shipments, loading, error, fetchAllShipments } = useShipmentViewModel();

    useEffect(() => {
        fetchAllShipments();
    }, [fetchAllShipments]);

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>LISTA DE ENVÍOS</h1>
                <div style={styles.headerLine}></div>
            </header>

            <main style={styles.main}>
                {loading && (
                    <div style={styles.loadingContainer}>
                        <div style={styles.loadingText}>CARGANDO ENVÍOS...</div>
                    </div>
                )}

                {error && (
                    <div style={styles.errorBox}>
                        <p>{error}</p>
                        <button onClick={fetchAllShipments} style={styles.retryButton}>REINTENTAR</button>
                    </div>
                )}

                {!loading && !error && shipments.length === 0 && (
                    <div style={styles.emptyBox}>
                        No se encontraron envíos programados.
                    </div>
                )}

                {!loading && shipments.length > 0 && (
                    <div style={styles.tableContainer}>
                        <table style={styles.table}>
                            <thead>
                                <tr>
                                    <th style={styles.th}>ID</th>
                                    <th style={styles.th}>ORDEN ID</th>
                                    <th style={styles.th}>ESTADO ENVÍO</th>
                                    <th style={styles.th}>FECHA CREACIÓN</th>
                                    <th style={styles.th}>ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {shipments.map((shipment) => (
                                    <tr key={shipment.id} style={styles.tr}>
                                        <td style={styles.td}>{shipment.id}</td>
                                        <td style={styles.td}>{shipment.ordenId}</td>
                                        <td style={styles.td}>
                                            <span style={{
                                                ...styles.statusBadge,
                                                backgroundColor: shipment.statusEnvio === 'Enviado' ? '#4ecca3' : '#e94560'
                                            }}>
                                                {shipment.statusEnvio}
                                            </span>
                                        </td>
                                        <td style={styles.td}>
                                            {shipment.fechaCreacion 
                                                ? new Date(shipment.fechaCreacion).toLocaleString() 
                                                : <span style={{ opacity: 0.5 }}>No disponible</span>
                                            }
                                        </td>
                                        <td style={styles.td}>
                                            <button 
                                                onClick={() => onViewDetail && onViewDetail(shipment.ordenId)}
                                                style={styles.viewButton}
                                                title="Ver detalle de orden"
                                            >
                                                👁
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    container: {
        padding: '40px 20px',
        maxWidth: '1200px',
        margin: '0 auto',
        color: '#fff'
    },
    header: {
        marginBottom: '40px',
        textAlign: 'center'
    },
    title: {
        fontSize: '2.5rem',
        color: '#4ecca3',
        margin: '0 0 10px 0',
        textTransform: 'uppercase',
        letterSpacing: '2px'
    },
    headerLine: {
        height: '4px',
        backgroundColor: '#e94560',
        width: '100px',
        margin: '0 auto'
    },
    main: {
        backgroundColor: 'rgba(26, 26, 46, 0.95)',
        borderRadius: '15px',
        padding: '30px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        border: '1px solid rgba(78, 204, 163, 0.2)'
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        padding: '50px'
    },
    loadingText: {
        color: '#4ecca3',
        fontSize: '1.2rem',
        fontWeight: 'bold'
    },
    errorBox: {
        backgroundColor: 'rgba(233, 69, 96, 0.1)',
        border: '1px solid #e94560',
        padding: '20px',
        borderRadius: '10px',
        textAlign: 'center',
        color: '#fff'
    },
    retryButton: {
        backgroundColor: '#e94560',
        color: '#fff',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontWeight: 'bold',
        marginTop: '10px'
    },
    emptyBox: {
        textAlign: 'center',
        padding: '40px',
        color: '#fff',
        opacity: 0.7,
        fontSize: '1.1rem'
    },
    tableContainer: {
        overflowX: 'auto'
    },
    table: {
        width: '100%',
        borderCollapse: 'separate',
        borderSpacing: '0 10px'
    },
    th: {
        textAlign: 'left',
        padding: '15px',
        color: '#e94560',
        fontSize: '0.9rem',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        borderBottom: '2px solid rgba(233, 69, 96, 0.3)'
    },
    tr: {
        backgroundColor: 'rgba(22, 33, 62, 0.5)',
        transition: 'transform 0.2s',
    },
    td: {
        padding: '15px',
        fontSize: '1rem',
        borderBottom: '1px solid rgba(78, 204, 163, 0.1)'
    },
    statusBadge: {
        padding: '5px 12px',
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        color: '#1a1a2e'
    },
    viewButton: {
        background: 'none',
        border: '1px solid #4ecca3',
        color: '#4ecca3',
        padding: '5px 10px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1.2rem',
        transition: 'all 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
};
