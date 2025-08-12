import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | Desafio Frontend",
    default: "Desafio Frontend - Dashboard Moderno",
  },
  description:
    "Aplicação frontend moderna desenvolvida com Next.js, TypeScript e Tailwind CSS. Seguindo as melhores práticas de Clean Code e UX Design.",
  keywords: [
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Frontend",
    "Dashboard",
  ],
  authors: [{ name: "Desenvolvedor Frontend" }],
  creator: "Desenvolvedor Frontend",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    title: "Desafio Frontend - Dashboard Moderno",
    description:
      "Aplicação frontend moderna desenvolvida com Next.js, TypeScript e Tailwind CSS.",
    siteName: "Desafio Frontend",
  },
  twitter: {
    card: "summary_large_image",
    title: "Desafio Frontend - Dashboard Moderno",
    description:
      "Aplicação frontend moderna desenvolvida com Next.js, TypeScript e Tailwind CSS.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          defaultTheme="system"
          storageKey="desafio-frontend-theme"
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
