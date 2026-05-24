import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";

import "./globals.css";

const serifFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
});

const sansFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["300", "400", "500"],
});

export const metadata: Metadata = {
  title: "Rumah Jahit | Koleksi Eksklusif",
  description:
    "Landing page Rumah Jahit dengan koleksi jahitan custom, layanan premium, dan form kontak interaktif.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${serifFont.variable} ${sansFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

