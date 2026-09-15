import type { Metadata } from "next";
import "./globals.css";

import Link from "next/link";
import AppClerkProvider from "@/components/AppClerkProvider";
import AuthButtons from "@/components/AuthButtons";

export const metadata: Metadata = {
  title: "Addition",
  description: "A simple addition calculator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AppClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-gray-950 text-white antialiased">
          <header className="border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
            <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
    
              <Link
                href="/"
                className="flex items-center gap-2.5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-lg font-bold text-gray-950">
                  +
                </div>

                <span className="text-xl font-semibold tracking-tight">
                  Addition
                </span>
              </Link>

              <AuthButtons />

            </nav>
          </header>

          <main>{children}</main>
        </body>
      </html>
    </AppClerkProvider>
  );
}