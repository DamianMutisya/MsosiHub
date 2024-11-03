import React from 'react';
import { Providers } from './providers'
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ToastProvider } from '../components/ui/use-toast';
import { AuthProvider } from '../context/AuthContext';

// Add environment variable validation
if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error('NEXT_PUBLIC_API_URL environment variable is not set');
}

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "MsosiHub",
  description: "Discover the Flavors of Kenya - Your Ultimate Recipe Hub",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <ToastProvider>
            <Providers>{children}</Providers>
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
