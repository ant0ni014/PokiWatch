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

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "https://pokiwatch.vercel.app")
  ),
  title: "PokiWatch – 2-Personen Pokémon Watch-Tracker",
  description: "Verfolge Pokémon-Episoden synchron zu zweit mit YouTube-Player, automatischem Tracking und gemeinsamem Pokédex.",
  applicationName: "PokiWatch",
  openGraph: {
    title: "PokiWatch – 2-Personen Pokémon Watch-Tracker",
    description: "Verfolge Pokémon-Episoden synchron zu zweit mit YouTube-Player und gemeinsamem Pokédex.",
    siteName: "PokiWatch",
    type: "website",
    locale: "de_DE",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "PokiWatch mit Pokéball, Ash und Misty",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PokiWatch – 2-Personen Pokémon Watch-Tracker",
    description: "Verfolge Pokémon-Episoden synchron zu zweit mit YouTube-Player und gemeinsamem Pokédex.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "512x512", type: "image/png" },
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
        <meta property="og:image" content="/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#070a11] text-slate-100">
        {children}
      </body>
    </html>
  );
}
