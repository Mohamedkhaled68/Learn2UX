"use client";

import { createContext, useContext } from "react";

type LanguageContextType = {
    lang: "en" | "ar";
};

const LanguageContext = createContext<LanguageContextType | undefined>(
    undefined
);

export function LanguageProvider({
    children,
    lang,
}: {
    children: React.ReactNode;
    lang: "en" | "ar";
}) {
    return (
        <LanguageContext.Provider value={{ lang }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
