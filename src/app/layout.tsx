import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Achadinhos | Painel",
  description: "Painel de operação do Achadinhos Engine.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}