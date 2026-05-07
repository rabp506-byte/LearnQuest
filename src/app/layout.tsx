import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LearnQuest",
  description: "La evolución autónoma de Classcraft.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
