import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const SITE_URL = "https://pokiwatch.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "PokiWatch – 2-Personen Pokémon Watch-Tracker",
  description: "Verfolge Pokémon-Episoden synchron zu zweit mit YouTube-Player, automatischem Tracking und gemeinsamem Pokédex.",
  applicationName: "PokiWatch",
  openGraph: {
    title: "PokiWatch – 2-Personen Pokémon Watch-Tracker",
    description: "Verfolge Pokémon-Episoden synchron zu zweit mit YouTube-Player und gemeinsamem Pokédex.",
    url: SITE_URL,
    siteName: "PokiWatch",
    type: "website",
    locale: "de_DE",
    images: [
      {
        url: `${SITE_URL}/og-image.png`,
        secureUrl: `${SITE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "PokiWatch mit Pokéball, Ash und Misty",
      },
      {
        url: `${SITE_URL}/icon.png`,
        secureUrl: `${SITE_URL}/icon.png`,
        width: 512,
        height: 512,
        type: "image/png",
        alt: "PokiWatch Logo",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PokiWatch – 2-Personen Pokémon Watch-Tracker",
    description: "Verfolge Pokémon-Episoden synchron zu zweit mit YouTube-Player und gemeinsamem Pokédex.",
    images: [`${SITE_URL}/og-image.png`],
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={`${outfit.variable} ${inter.variable} h-full antialiased dark`}>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        {/* OpenGraph & WhatsApp absolute URL image tags */}
        <meta property="og:site_name" content="PokiWatch" />
        <meta property="og:title" content="PokiWatch – 2-Personen Pokémon Watch-Tracker" />
        <meta property="og:description" content="Verfolge Pokémon-Episoden synchron zu zweit mit YouTube-Player und gemeinsamem Pokédex." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://pokiwatch.vercel.app" />
        <meta property="og:image" content="https://pokiwatch.vercel.app/og-image.png" />
        <meta property="og:image:secure_url" content="https://pokiwatch.vercel.app/og-image.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content="PokiWatch mit Pokéball, Ash und Misty" />
        
        {/* Favicon and Apple Touch Icon */}
        <link rel="icon" type="image/png" sizes="512x512" href="/icon.png" />
        <link rel="shortcut icon" href="/icon.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#070a11] text-slate-100">
        {children}
      </body>
    </html>
  );
}
