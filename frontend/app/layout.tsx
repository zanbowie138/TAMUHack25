import React from "react";
import "./globals.css";
import { Poppins } from "next/font/google" // poppins for landing page text

const poppins = Poppins({
  weight: ["200", "500"],
  subsets: ["latin"],
  variable: "--font-poppins",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} scroll-smooth`}>
      <body className="bg-[#1C1C1C] font-poppins">{children}</body>
    </html>
  )
}