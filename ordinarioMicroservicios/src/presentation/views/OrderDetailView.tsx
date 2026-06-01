import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useOrderViewModel } from '../hooks/useOrderViewModel';
import { PaymentFormModal } from '../components/PaymentFormModal';
import { ConfirmationModal } from '../components/ConfirmationModal';
import { Theme } from '../theme';

export const OrderDetailView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { order, payments, loading, loadingPayments, error, searchOrder, processPayment } = useOrderViewModel();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [notification, setNotification] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: 'success' | 'danger' | 'info';
    }>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info'
    });

    useEffect(() => {
        if (id) {
            searchOrder(id);
        }
    }, [id, searchOrder]);

    const handleProcessPayment = async (amount: number, paymentMethod: string) => {
        if (!order) return false;
        try {
            const success = await processPayment({
                ordenId: order.id,
                amount,
                paymentMethod
            });
            
            if (success) {
                setNotification({
                    isOpen: true,
                    title: 'PAGO PROCESADO',
                    message: 'La transacción se ha completado y el saldo ha sido actualizado.',
                    type: 'success'
                });
                setIsPaymentModalOpen(false);
                // searchOrder(order.id) is already called inside processPayment in the ViewModel
                return true;
            }
            return false;
        } catch (err: any) {
            setNotification({
                isOpen: true,
                title: 'ERROR DE COBRO',
                message: err.message || 'La pasarela de pago ha rechazado la operación.',
                type: 'danger'
            });
            return false;
        }
    };

    if (loading && !order) {
        return (
            <div style={styles.stateContainer}>
                <div style={styles.loader}></div>
                <p>Cargando expediente de la orden...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.stateContainer}>
                <div style={styles.errorIcon}>⚠️</div>
                <p style={styles.errorText}>{error}</p>
                <button onClick={() => navigate('/orders')} style={styles.backLink}>Regresar al listado</button>
            </div>
        );
    }

    return (
        <div style={styles.viewContainer}>
            <header style={styles.viewHeader}>
                <button onClick={() => navigate(-1)} style={styles.backButton}>
                    ← Volver
                </button>
                <h2 style={styles.title}>Expediente de Orden</h2>
            </header>

            {order && (
                <div style={styles.contentGrid}>
                    {/* General Info Card */}
                    <div style={styles.mainCard}>
                        <div style={styles.cardHeader}>
                            <h3 style={styles.orderCode}>{order.orderCode}</h3>
                            <span style={{
                                ...styles.statusBadge,
                                backgroundColor: order.status === 'COMPLETED' || order.status === 'Pagado' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: order.status === 'COMPLETED' || order.status === 'Pagado' ? Theme.colors.success : Theme.colors.error,
                            }}>
                                {order.status}
                            </span>
                        </div>

                        <div style={styles.infoGrid}>
                            <div style={styles.infoItem}>
                                <label style={styles.infoLabel}>ID Único</label>
                                <p style={styles.infoValue}>{order.id}</p>
                            </div>
                            <div style={styles.infoItem}>
                                <label style={styles.infoLabel}>Fecha de Emisión</label>
                                <p style={styles.infoValue}>{order.orderDate}</p>
                            </div>
                            <div style={styles.infoItem}>
                                <label style={styles.infoLabel}>Operador/Usuario</label>
                                <p style={styles.infoValue}>{order.user}</p>
                            </div>
                            <div style={styles.infoItem}>
                                <label style={styles.infoLabel}>Total de la Transacción</label>
                                <p style={{ ...styles.infoValue, color: Theme.colors.primary, fontSize: '1.5rem', fontWeight: 700 }}>
                                    ${order.totalAmount.toFixed(2)}
                                </p>
                            </div>
                            {order.debt !== undefined && (
                                <div style={styles.infoItem}>
                                    <label style={styles.infoLabel}>Saldo Deudor</label>
                                    <p style={{ ...styles.infoValue, color: Theme.colors.error, fontSize: '1.5rem', fontWeight: 700 }}>
                                        ${order.debt.toFixed(2)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Products Section */}
                    <div style={styles.sectionCard}>
                        <h3 style={styles.sectionTitle}>Productos Vinculados</h3>
                        <div style={styles.tableWrapper}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>SKU / ID</th>
                                        <th style={styles.th}>Cant.</th>
                                        <th style={styles.th}>Precio Unit.</th>
                                        <th style={styles.th}>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {order.products.map((p, idx) => (
                                        <tr key={idx} style={styles.tr}>
                                            <td style={styles.td}><code style={styles.skuText}>{p.productId}</code></td>
                                            <td style={styles.td}>{p.quantity}</td>
                                            <td style={styles.td}>${p.price.toFixed(2)}</td>
                                            <td style={{ ...styles.td, color: Theme.colors.accent, fontWeight: 600 }}>
                                                ${(p.quantity * p.price).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Payments Section */}
                    <div style={styles.sectionCard}>
                        <div style={styles.sectionHeader}>
                            <h3 style={styles.sectionTitle}>Historial de Cobros</h3>
                            <button 
                                onClick={() => setIsPaymentModalOpen(true)}
                                style={styles.addPaymentButton}
                            >
                                + Registrar Pago
                            </button>
                        </div>
                        
                        {loadingPayments ? (
                            <div style={styles.miniLoader}>Sincronizando pagos...</div>
                        ) : payments.length === 0 ? (
                            <p style={styles.emptyText}>No se han detectado abonos para esta orden.</p>
                        ) : (
                            <div style={styles.tableWrapper}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.th}>ID Pago</th>
                                            <th style={styles.th}>Método</th>
                                            <th style={styles.th}>Estado</th>
                                            <th style={styles.th}>Monto</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {payments.map((p) => (
                                            <tr key={p.id} style={styles.tr}>
                                                <td style={styles.td}><span style={styles.smallId}>#{p.id.slice(-6)}</span></td>
                                                <td style={styles.td}>{p.paymentMethod}</td>
                                                <td style={styles.td}>
                                                    <span style={{
                                                        ...styles.statusBadgeSmall,
                                                        color: p.status === 'PROCESSED' || p.status === 'COMPLETED' ? Theme.colors.success : Theme.colors.error
                                                    }}>
                                                        ● {p.status}
                                                    </span>
                                                </td>
                                                <td style={{ ...styles.td, color: Theme.colors.success, fontWeight: 700 }}>
                                                    ${p.amount.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {order && (
                <PaymentFormModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    onSubmit={handleProcessPayment}
                    orderId={order.id}
                />
            )}

            <ConfirmationModal 
                isOpen={notification.isOpen}
                onConfirm={() => setNotification(prev => ({ ...prev, isOpen: false }))}
                onCancel={() => setNotification(prev => ({ ...prev, isOpen: false }))}
                title={notification.title}
                message={notification.message}
                type={notification.type}
                hideCancel={true}
            />

            {loading && isPaymentModalOpen && (
                <div style={styles.processingOverlay}>
                    <div style={styles.loader}></div>
                    <p style={styles.processingText}>PROCESANDO TRANSACCIÓN NEÓN...</p>
                </div>
            )}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    viewContainer: { animation: 'fadeIn 0.5s ease-out' },
    viewHeader: { display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' },
    backButton: {
        backgroundColor: 'transparent',
        border: `1px solid ${Theme.colors.border}`,
        color: Theme.colors.textMuted,
        padding: '8px 16px',
        borderRadius: '8px',
    },
    title: { fontSize: '1.8rem', margin: 0 },
    contentGrid: { display: 'flex', flexDirection: 'column', gap: '30px' },
    mainCard: {
        backgroundColor: Theme.colors.surface,
        borderRadius: '16px',
        padding: '30px',
        border: `1px solid ${Theme.colors.border}`,
    },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', borderBottom: `1px solid ${Theme.colors.border}`, paddingBottom: '15px' },
    orderCode: { fontSize: '1.5rem', margin: 0, color: Theme.colors.primary },
    statusBadge: { padding: '6px 15px', borderRadius: '20px', fontSize: '0.9rem', fontWeight: 600 },
    infoGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '25px' },
    infoItem: { display: 'flex', flexDirection: 'column', gap: '5px' },
    infoLabel: { fontSize: '0.75rem', color: Theme.colors.textMuted, textTransform: 'uppercase', letterSpacing: '1px' },
    infoValue: { fontSize: '1.1rem', margin: 0 },
    sectionCard: { backgroundColor: Theme.colors.surface, borderRadius: '16px', padding: '30px', border: `1px solid ${Theme.colors.border}` },
    sectionHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
    sectionTitle: { fontSize: '1.2rem', margin: 0, color: Theme.colors.accent },
    addPaymentButton: { backgroundColor: Theme.colors.primary, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', fontWeight: 600 },
    tableWrapper: { overflowX: 'auto' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'center', padding: '12px', color: Theme.colors.textMuted, fontSize: '0.8rem', borderBottom: `1px solid ${Theme.colors.border}` },
    tr: { borderBottom: `1px solid rgba(255,255,255,0.05)` },
    td: { padding: '12px', fontSize: '0.95rem', textAlign: 'center' },
    skuText: { fontSize: '0.8rem', opacity: 0.7 },
    smallId: { fontFamily: 'monospace', opacity: 0.6 },
    statusBadgeSmall: { fontSize: '0.8rem', fontWeight: 600 },
    emptyText: { color: Theme.colors.textMuted, textAlign: 'center', padding: '20px' },
    stateContainer: { padding: '100px', textAlign: 'center' },
    loader: { width: '40px', height: '40px', border: '3px solid #333', borderTopColor: Theme.colors.primary, borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' },
    processingOverlay: {
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
        zIndex: 3000, backdropFilter: 'blur(10px)'
    },
    processingText: { color: Theme.colors.primary, fontWeight: 700, letterSpacing: '2px', marginTop: '20px' }
};
