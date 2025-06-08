import { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>('system'); // Default to system

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedTheme = localStorage.getItem('theme') as Theme | null;
            if (storedTheme && ['light', 'dark', 'system'].includes(storedTheme)) {
                setTheme(storedTheme);
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const applyTheme = () => {
            const root = document.documentElement;
            if (theme === 'system') {
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                root.classList.remove('light', 'dark');
                root.classList.add(systemTheme);
            } else {
                root.classList.remove('light', 'dark');
                root.classList.add(theme);
            }
        };

        applyTheme();

        if (theme === 'system') {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            const handleChange = () => applyTheme();
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
    }, [theme]);

    const updateTheme = (newTheme: Theme) => {
        setTheme(newTheme);
        if (typeof window !== 'undefined') {
            localStorage.setItem('theme', newTheme);
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, setTheme: updateTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}