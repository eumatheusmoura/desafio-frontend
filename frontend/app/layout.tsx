import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider, THEME_CONFIG } from "@/components/theme";
import ToasterProvider from "@/components/toaster-provider";

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
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('${THEME_CONFIG.storageKey}') || '${THEME_CONFIG.defaultTheme}';
                  var resolvedTheme = theme;
                  
                  if (theme === 'system') {
                    resolvedTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  }
                  
                  if (resolvedTheme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {
                  // Fallback para tema claro se houver erro
                  document.documentElement.classList.remove('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          defaultTheme={THEME_CONFIG.defaultTheme}
          storageKey={THEME_CONFIG.storageKey}
        >
          {children}
          <ToasterProvider defaultPosition="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
