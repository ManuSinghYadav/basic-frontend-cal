import type { Metadata } from "next";
import "./globals.css";

import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

import Link from "next/link";

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
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-gray-950 text-white antialiased">
          <header className="border-b border-white/10 bg-gray-950/80 backdrop-blur-md">
            <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">

              {/* Logo */}
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

              {/* Authentication */}
              <div className="flex items-center gap-3">

                {/* When signed out */}
                <Show when="signed-out">
                  <SignInButton mode="modal">
                    <button className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 transition hover:bg-white/10 hover:text-white">
                      Sign In
                    </button>
                  </SignInButton>

                  <SignUpButton mode="modal">
                    <button className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-950 transition hover:bg-gray-200">
                      Sign Up
                    </button>
                  </SignUpButton>
                </Show>

                {/* When signed in */}
                <Show when="signed-in">
                  <UserButton />
                </Show>

              </div>
            </nav>
          </header>

          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}