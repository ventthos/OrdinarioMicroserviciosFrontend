import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Theme } from '../theme';

export const MainLayout: React.FC = () => {
    return (
        <div style={styles.appContainer}>
            <nav style={styles.sidebar}>
                <div style={styles.logoSection}>
                    <h1 style={styles.logo}>GAME<span style={styles.logoAccent}>HUB</span></h1>
                    <div style={styles.logoUnderline}></div>
                </div>

                <div style={styles.navLinks}>
                    <NavLink 
                        to="/inventory" 
                        style={({ isActive }) => ({
                            ...styles.navLink,
                            ...(isActive ? styles.navLinkActive : {})
                        })}
                    >
                        <span style={styles.navIcon}>📦</span> INVENTARIO
                    </NavLink>
                    <NavLink 
                        to="/orders" 
                        style={({ isActive }) => ({
                            ...styles.navLink,
                            ...(isActive ? styles.navLinkActive : {})
                        })}
                    >
                        <span style={styles.navIcon}>📜</span> ÓRDENES
                    </NavLink>
                    <NavLink 
                        to="/search" 
                        style={({ isActive }) => ({
                            ...styles.navLink,
                            ...(isActive ? styles.navLinkActive : {})
                        })}
                    >
                        <span style={styles.navIcon}>🔍</span> BÚSQUEDA
                    </NavLink>
                    <NavLink 
                        to="/shipments" 
                        style={({ isActive }) => ({
                            ...styles.navLink,
                            ...(isActive ? styles.navLinkActive : {})
                        })}
                    >
                        <span style={styles.navIcon}>🚀</span> ENVÍOS
                    </NavLink>
                </div>

                <div style={styles.sidebarFooter}>
                    <p style={styles.footerText}>Gaming Manager v2.0</p>
                </div>
            </nav>

            <main style={styles.mainContent}>
                <Outlet />
            </main>
        </div>
    );
};

const styles: { [key: string]: React.CSSProperties } = {
    appContainer: {
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: Theme.colors.background,
    },
    sidebar: {
        width: '280px',
        backgroundColor: Theme.colors.surface,
        borderRight: `1px solid ${Theme.colors.border}`,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        zIndex: 1000,
    },
    logoSection: {
        padding: '40px 30px',
        textAlign: 'center',
    },
    logo: {
        margin: 0,
        fontSize: '2rem',
        color: Theme.colors.text,
        fontWeight: 700,
    },
    logoAccent: {
        color: Theme.colors.primary,
        textShadow: Theme.shadows.glow,
    },
    logoUnderline: {
        height: '3px',
        width: '50px',
        backgroundColor: Theme.colors.secondary,
        margin: '10px auto 0',
        borderRadius: '2px',
    },
    navLinks: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '20px',
        flex: 1,
    },
    navLink: {
        textDecoration: 'none',
        color: Theme.colors.textMuted,
        padding: '15px 20px',
        borderRadius: '12px',
        fontSize: '1rem',
        fontWeight: 600,
        fontFamily: 'Rajdhani, sans-serif',
        display: 'flex',
        alignItems: 'center',
        gap: '15px',
        transition: Theme.transitions.default,
    },
    navLinkActive: {
        backgroundColor: 'rgba(124, 58, 237, 0.1)',
        color: Theme.colors.primary,
        boxShadow: `inset 4px 0 0 ${Theme.colors.primary}`,
    },
    navIcon: {
        fontSize: '1.2rem',
    },
    mainContent: {
        flex: 1,
        marginLeft: '280px',
        padding: '40px',
        maxWidth: 'calc(100vw - 280px)',
    },
    sidebarFooter: {
        padding: '30px',
        textAlign: 'center',
        borderTop: `1px solid ${Theme.colors.border}`,
    },
    footerText: {
        color: Theme.colors.textMuted,
        fontSize: '0.8rem',
        margin: 0,
    }
};
