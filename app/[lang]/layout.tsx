import type { Metadata } from "next";
import { LanguageProvider } from "@/contexts/LanguageContext";
import PageTransition from "@/components/PageTransition";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
    title: "Learn2ux",
    description: "Get 150+ Answers About Interface Design For Free.",
};


type Params = Promise<{ lang: string }>;

export default async function RootLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Params;
}>) {
    const { lang } = (await params) as { lang: "en" | "ar" };

    return (
        <html lang={lang} dir={lang === "ar" ? "rtl" : "ltr"}>
            <head>
                <link
                    rel="icon"
                    href="/fav.svg"
                    type="image/x-icon"
                    sizes="any"
                />
            </head>
            <body
                suppressHydrationWarning
                className="bg-[#FDFDFD] min-h-screen w-full relative flex flex-col"
            >
                <LanguageProvider lang={lang}>
                    <main className="flex-1">
                        <div className="container mx-auto">
                            <PageTransition>{children}</PageTransition>
                            <Toaster
                                position="top-center"
                                reverseOrder={false}
                            />
                        </div>
                    </main>
                </LanguageProvider>
            </body>
        </html>
    );
}
