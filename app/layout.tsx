import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// IMPORTANTE: Importación global del CSS de Mapbox para que el mapa no se vea blanco
import 'mapbox-gl/dist/mapbox-gl.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EcoIxtac - Explora Ixtaczoquitlán",
  description: "Descubre la aventura y la naturaleza en el corazón de Veracruz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      // suppressHydrationWarning aquí evita errores por extensiones que traducen la página
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body 
        className="min-h-full flex flex-col"
        // suppressHydrationWarning aquí ignora atributos inyectados como 'cz-shortcut-listen'
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}