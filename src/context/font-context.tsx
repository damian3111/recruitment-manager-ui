// context/font-context.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { fonts } from '@/config/fonts';

// Define the font type based on the fonts array
type Font = typeof fonts[number]; // "inter" | "manrope" | "system"

interface FontContextType {
    font: Font;
    setFont: (font: Font) => void;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export function FontProvider({ children }: { children: React.ReactNode }) {
    const [font, setFont] = useState<Font>('inter'); // Default to a valid font

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedFont = localStorage.getItem('font');
            if (storedFont && fonts.includes(storedFont as Font)) {
                setFont(storedFont as Font);
            }
        }
    }, []);

    const updateFont = (newFont: Font) => {
        setFont(newFont);
        if (typeof window !== 'undefined') {
            localStorage.setItem('font', newFont);
        }
    };

    return (
        <FontContext.Provider value={{ font, setFont: updateFont }}>
            {children}
        </FontContext.Provider>
    );
}

export function useFont() {
    const context = useContext(FontContext);
    if (!context) {
        throw new Error('useFont must be used within a FontProvider');
    }
    return context;
}