import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lucy Chinese Studio | Lucy老师中文课堂",
  description:
    "Bilingual Chinese learning website for foreign children, teens, and adults with booking, registration, and paid course flow."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
