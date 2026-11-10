import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MedNexus OS | Hospital management & clinical safety",
  description: "Panel hospitalario bilingüe con seguridad clínica, red de atención y modelos educativos 3D.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
