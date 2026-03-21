import type { Metadata } from "next";
import { Playfair_Display, Manrope, Caveat } from "next/font/google";
import "./globals.css";
import { AuthGate } from "@/components/auth-gate";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "For the love of my life",
  description: "A romantic website full of love, memories and special moments.",
  keywords: ["love", "memories", "romance", "moments"],
  authors: [{ name: "Nefise" }],
  openGraph: {
    title: "For the love of my life",
    description: "A romantic website full of love and special moments",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${manrope.variable} ${caveat.variable} antialiased`}
      >
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}
