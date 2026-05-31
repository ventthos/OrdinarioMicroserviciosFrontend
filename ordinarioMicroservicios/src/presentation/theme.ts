export const Theme = {
    colors: {
        background: '#0a0a0c',
        surface: '#16161a',
        surfaceLight: '#1f1f23',
        primary: '#7c3aed', // Purple neon
        primaryHover: '#8b5cf6',
        secondary: '#ec4899', // Pink neon
        accent: '#06b6d4', // Cyan neon
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        text: '#f8fafc',
        textMuted: '#94a3b8',
        border: 'rgba(124, 58, 237, 0.2)',
        borderHover: 'rgba(124, 58, 237, 0.4)',
    },
    shadows: {
        glow: '0 0 20px rgba(124, 58, 237, 0.3)',
        glowSecondary: '0 0 20px rgba(236, 72, 153, 0.3)',
        card: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    transitions: {
        default: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    }
};

export const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Inter:wght@400;500;600&display=swap');

    :root {
        --bg: ${Theme.colors.background};
        --surface: ${Theme.colors.surface};
        --surface-light: ${Theme.colors.surfaceLight};
        --primary: ${Theme.colors.primary};
        --primary-hover: ${Theme.colors.primaryHover};
        --secondary: ${Theme.colors.secondary};
        --accent: ${Theme.colors.accent};
        --text: ${Theme.colors.text};
        --text-muted: ${Theme.colors.textMuted};
    }

    body {
        margin: 0;
        padding: 0;
        background-color: var(--bg);
        color: var(--text);
        font-family: 'Inter', sans-serif;
        -webkit-font-smoothing: antialiased;
    }

    h1, h2, h3, h4, h5, h6 {
        font-family: 'Rajdhani', sans-serif;
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    button {
        font-family: 'Rajdhani', sans-serif;
        font-weight: 600;
        text-transform: uppercase;
        cursor: pointer;
        transition: ${Theme.transitions.default};
    }

    /* Scrollbar */
    ::-webkit-scrollbar {
        width: 8px;
    }
    ::-webkit-scrollbar-track {
        background: var(--bg);
    }
    ::-webkit-scrollbar-thumb {
        background: var(--surface-light);
        border-radius: 4px;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: var(--primary);
    }
`;
