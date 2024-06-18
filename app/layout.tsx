import type { Metadata } from "next"
import {
  SITE_META_NAME,
  SITE_META_DESCRIPTION,
  SITE_URL,
} from "@/lib/constants"
import "./globals.css"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: SITE_META_NAME,
  description: SITE_META_DESCRIPTION,
  creator: "Rafa Canosa",
  metadataBase: new URL(SITE_URL),
  verification: { google: "8Ssu9wyMqGLnOHp01rAbY2QJAKTU4XkqTq9OPShpeOc" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: SITE_META_NAME,
    description: SITE_META_DESCRIPTION,
    siteName: SITE_META_NAME,
    images: [
      {
        url: "https://i.imgur.com/leJWdTG.png",
        width: 1200,
        height: 630,
        alt: SITE_META_NAME,
      },
    ],
  },
  alternates: {
    canonical: "/",
  },
  keywords: ["F1", "Public API", "Formula 1"],
  referrer: "origin-when-cross-origin",
  themeColor: "#000000", // Para los navegadores móviles
  colorScheme: "dark", // Para temas oscuros
  viewport: "width=device-width, initial-scale=1.0",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        type: "image/png",
        href: "/logo.avif",
      },
    ],
  },
  robots: "index, follow",
  twitter: {
    card: "summary_large_image",
    site: "@yourTwitterHandle",
    creator: "@yourTwitterHandle",
    title: SITE_META_NAME,
    description: SITE_META_DESCRIPTION,
    images: [
      {
        url: "https://i.imgur.com/leJWdTG.png",
        alt: SITE_META_NAME,
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={"dark"}>
        {children}
        <Footer />
      </body>
    </html>
  )
}
