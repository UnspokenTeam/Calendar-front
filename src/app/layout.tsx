import "@/styles/globals.css";

import {Inter} from "next/font/google";
import QueryProvider from "@/components/query-provider";
import SessionProviderF from "@/components/session-provider";
import {Toaster} from "@/components/ui/sonner";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata = {
    title: "Calendar",
    description: "Simple calendar app",
    icons: [{rel: "icon", url: "/favicon.ico"}],
};


export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <QueryProvider>
            <SessionProviderF>
                <body className={`font-sans ${inter.variable}`}>
                    {children}
                    <Toaster richColors closeButton/>
                </body>
            </SessionProviderF>
        </QueryProvider>
        </html>
    );
}
