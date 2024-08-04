import type { Metadata } from "next"
import { GoogleAnalytics } from "@next/third-parties/google"
import {
  SITE_META_NAME,
  SITE_META_DESCRIPTION,
  SITE_URL,
} from "@/lib/constants"
import "./globals.css"
import Footer from "@/components/Footer"
import initTranslations from "../i18n"
import TranslationsProvider from "@/components/TranslationsProvider"

const i18nNamespaces = ["home"]

export const metadata: Metadata = {
  title: SITE_META_NAME,
  description: SITE_META_DESCRIPTION,
  creator: "Rafa Canosa",
  authors: { name: "Rafa Canosa" },
  metadataBase: new URL(SITE_URL),
  category: "formula one",
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
    languages: {
      en: "/",
      es: "/es",
      ru: "/ru",
    },
  },
  keywords: ["F1", "Public API", "Formula 1"],
  referrer: "origin-when-cross-origin",
  themeColor: "#000000", // Para los navegadores móviles
  colorScheme: "dark", // Para temas oscuros
  viewport: "width=device-width, initial-scale=1.0",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
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

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: {
    locale: string
  }
}>) {
  const { t, resources } = await initTranslations(params.locale, i18nNamespaces)

  return (
    <html lang={params.locale}>
      <body className={"dark"}>
        <TranslationsProvider
          namespaces={i18nNamespaces}
          locale={params.locale}
          resources={resources}
        >
          {children}
          <Footer locale={params.locale} />
        </TranslationsProvider>
      </body>
      <GoogleAnalytics gaId="G-BSF96MBRJC" />
    </html>
  )
}
