export const Theme = {
    colors: {
        background: '#050505', // Deeper black
        surface: '#0f0f12',
        surfaceLight: '#1a1a1e',
        primary: '#bc13fe', // Vibrant Neon Purple
        primaryHover: '#d670ff',
        secondary: '#ff0055', // Electric Pink
        accent: '#00f2ff', // Cyber Cyan
        success: '#10b981', // Sophisticated Emerald Green (Muted)
        error: '#ff3131', // Neon Red
        warning: '#ffcc00',
        text: '#ffffff',
        textMuted: '#a0a0b8',
        border: 'rgba(188, 19, 254, 0.3)',
        borderHover: 'rgba(188, 19, 254, 0.6)',
    },
    shadows: {
        glow: '0 0 15px rgba(188, 19, 254, 0.5), 0 0 30px rgba(188, 19, 254, 0.2)',
        glowSecondary: '0 0 15px rgba(255, 0, 85, 0.5), 0 0 30px rgba(255, 0, 85, 0.2)',
        glowAccent: '0 0 15px rgba(0, 242, 255, 0.5), 0 0 30px rgba(0, 242, 255, 0.2)',
        card: '0 8px 32px 0 rgba(0, 0, 0, 0.8)',
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
