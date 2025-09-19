import type { Metadata } from "next";
import { Suspense } from "react";
// import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingSpinner } from "@/components/LoadingStates";
import "./globals.css";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ['latin'], display: 'swap', adjustFontFallback: true})

export const metadata: Metadata = {
  title: "PomoCute - Pomodoro Timer",
  description: "Um adorável timer Pomodoro para aumentar sua produtividade com a técnica Pomodoro",
  keywords: ["pomodoro", "timer", "produtividade", "foco", "trabalho"],
  authors: [{ name: "PomoCute Team" }],
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "PomoCute",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "PomoCute",
    title: "PomoCute - Pomodoro Timer",
    description: "Um adorável timer Pomodoro para aumentar sua produtividade",
  },
  twitter: {
    card: "summary",
    title: "PomoCute - Pomodoro Timer",
    description: "Um adorável timer Pomodoro para aumentar sua produtividade",
  },
};

export function generateViewport() {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: "#ffffff" },
      { media: "(prefers-color-scheme: dark)", color: "#000000" }
    ],
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`antialiased flex flex-col ${inter.className}`}
      >
        <ErrorBoundary>
          <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
              <LoadingSpinner size="lg" />
            </div>
          }>
            {children}
          </Suspense>
        </ErrorBoundary>
      </body>
    </html>
  );
}