import React, { useState } from 'react';
import { useOrderViewModel } from '../hooks/useOrderViewModel';
import { useNavigate } from 'react-router-dom';
import { Theme } from '../theme';

export const OrderSearchView: React.FC = () => {
    const [id, setId] = useState<string>('');
    const { order, loading, error, searchOrder } = useOrderViewModel();
    const navigate = useNavigate();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (id.trim()) {
            await searchOrder(id.trim());
        }
    };

    return (
        <div style={styles.viewContainer}>
            <header style={styles.viewHeader}>
                <h2 style={styles.title}>Rastreo de Órdenes</h2>
                <p style={styles.subtitle}>Localiza cualquier transacción mediante su identificador único</p>
            </header>

            <div style={styles.searchSection}>
                <form onSubmit={handleSearch} style={styles.searchForm}>
                    <input
                        type="text"
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        placeholder="Ingresa el ID de la orden (ej: 69ac63...)"
                        style={styles.input}
                    />
                    <button type="submit" disabled={loading} style={styles.searchButton}>
                        {loading ? 'Buscando...' : 'Localizar Orden'}
                    </button>
                </form>
            </div>

            {error && (
                <div style={styles.errorBox}>
                    <span style={styles.errorIcon}>⚠️</span>
                    <p style={styles.errorText}>{error}</p>
                </div>
            )}

            {order && (
                <div style={styles.resultCard}>
                    <div style={styles.resultHeader}>
                        <div>
                            <span style={styles.foundText}>ORDEN ENCONTRADA</span>
                            <h3 style={styles.orderCode}>{order.orderCode}</h3>
                        </div>
                        <span style={{
                            ...styles.statusBadge,
                            color: order.status === 'COMPLETED' || order.status === 'Pagado' ? Theme.colors.success : Theme.colors.warning
                        }}>
                            {order.status}
                        </span>
                    </div>

                    <div style={styles.resultBody}>
                        <div style={styles.resultInfo}>
                            <div style={styles.infoGroup}>
                                <label style={styles.label}>Cliente / Usuario</label>
                                <p style={styles.value}>{order.user}</p>
                            </div>
                            <div style={styles.infoGroup}>
                                <label style={styles.label}>Total Bruto</label>
                                <p style={{ ...styles.value, color: Theme.colors.primary }}>${order.totalAmount.toFixed(2)}</p>
                            </div>
                        </div>
                        
                        <button 
                            onClick={() => navigate(`/orders/${order.id}`)}
                            style={styles.viewDetailButton}
                        >
                            Ver Expediente Completo →
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    viewContainer: { animation: 'fadeIn 0.5s ease-out', maxWidth: '800px', margin: '0 auto' },
    viewHeader: { marginBottom: '40px', textAlign: 'center' },
    title: { fontSize: '2.5rem', margin: 0 },
    subtitle: { color: Theme.colors.textMuted, marginTop: '10px' },
    searchSection: {
        backgroundColor: Theme.colors.surface,
        padding: '40px',
        borderRadius: '20px',
        border: `1px solid ${Theme.colors.border}`,
        boxShadow: Theme.shadows.card,
        marginBottom: '30px',
    },
    searchForm: { display: 'flex', gap: '15px' },
    input: {
        flex: 1,
        backgroundColor: Theme.colors.background,
        border: `1px solid ${Theme.colors.border}`,
        borderRadius: '12px',
        padding: '15px 20px',
        color: Theme.colors.text,
        fontSize: '1rem',
        outline: 'none',
        transition: Theme.transitions.default,
    },
    searchButton: {
        backgroundColor: Theme.colors.primary,
        color: '#fff',
        border: 'none',
        padding: '0 30px',
        borderRadius: '12px',
        fontWeight: 700,
        boxShadow: Theme.shadows.glow,
    },
    errorBox: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: '20px',
        borderRadius: '12px',
        border: `1px solid ${Theme.colors.error}`,
    },
    errorText: { color: Theme.colors.error, margin: 0 },
    resultCard: {
        backgroundColor: Theme.colors.surface,
        borderRadius: '20px',
        padding: '30px',
        border: `1px solid ${Theme.colors.accent}`,
        animation: 'slideUp 0.4s ease-out',
    },
    resultHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: `1px solid ${Theme.colors.border}`,
        paddingBottom: '20px',
        marginBottom: '20px',
    },
    foundText: { fontSize: '0.7rem', color: Theme.colors.accent, fontWeight: 700, letterSpacing: '2px' },
    orderCode: { margin: '5px 0 0 0', fontSize: '1.8rem', color: Theme.colors.text },
    statusBadge: { fontWeight: 700, textTransform: 'uppercase', fontSize: '0.9rem' },
    resultBody: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    resultInfo: { display: 'flex', gap: '40px' },
    infoGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontSize: '0.8rem', color: Theme.colors.textMuted },
    value: { fontSize: '1.2rem', margin: 0, fontWeight: 600 },
    viewDetailButton: {
        backgroundColor: 'transparent',
        border: `1px solid ${Theme.colors.primary}`,
        color: Theme.colors.primary,
        padding: '12px 24px',
        borderRadius: '10px',
        fontWeight: 600,
        transition: Theme.transitions.default,
    }
};
