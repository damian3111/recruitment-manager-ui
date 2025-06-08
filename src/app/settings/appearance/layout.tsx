"use client"

import {FontProvider} from "@/context/font-context";
import {ThemeProvider} from "@/context/theme-context";

export default function DashboardLayout({
                                            children
                                        }: {
    children: React.ReactNode;
}) {
    return (
        <FontProvider>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </FontProvider>
    );
}
