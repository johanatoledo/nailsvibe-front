import { Cormorant_Garamond, Plus_Jakarta_Sans } from 'next/font/google';
import "./globals.css";

const cormorantGaramond = Cormorant_Garamond({
  weight: ['600', '700'],
  subsets: ['latin'],
  variable: '--font-cormorant',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  weight: ['400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-jakarta',
});
export const metadata = {
  charset: "utf-8",
  viewport: "width=device-width, initial-scale=1",  
  title: "Nails Vibe - Catálogo Digital",
  description: "Estética Profesional, Manicure & Nail Art",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${cormorantGaramond.variable} ${plusJakartaSans.variable}`}>
      <body>{children}</body>
    </html>
  );
}