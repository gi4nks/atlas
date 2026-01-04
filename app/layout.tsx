import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Atlas | App Catalog",
  description: "A centralized catalog for your applications and projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-theme="corporate">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-base-100 text-base-content selection:bg-primary selection:text-primary-content`}>
        <Header />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="footer footer-center p-4 bg-base-200 text-base-content/50">
          <aside>
            <p>Atlas &copy; {new Date().getFullYear()} - Managed with ♥️</p>
          </aside>
        </footer>
      </body>
    </html>
  );
}