import type { Metadata, Viewport } from "next"
import { GoogleAnalytics } from "@next/third-parties/google"
import { Inter } from "next/font/google"
import {
  SITE_META_NAME,
  SITE_META_DESCRIPTION,
  SITE_URL,
} from "@/lib/constants"
import "./globals.css"
import Footer from "@/components/footer/Footer"
import initTranslations from "../i18n"
import TranslationsProvider from "@/components/TranslationsProvider"
import { Providers } from "@/components/Providers"
import Header from "@/components/header/Header"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })

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
      fr: "/fr",
      de: "/de",
      it: "/it",
      ja: "/jp",
      ch: "/ch",
      pt: "/pt",
    },
  },
  keywords: [
    "F1",
    "Public API",
    "Formula 1",
    "F1 API",
    "F1 Data",
    "F1 Stats",
    "formula 1 formula 1",
    "f1 formula 1",
    "formula one f1",
    "grand prix",
    "formula 1 1",
    "formula 1 race",
    "formula one drivers",
    "formula 1 standings",
    "formula one grand prix",
    "github ai",
    "public api",
    "api documentation",
    "free api",
    "open api",
    "open source",
    "github api",
    "F1 Stats API",
    "Open source",
    "Open f1 api",
    "Fast f1 api",
    "Open-source F1 API",
    "Real-time Formula 1 data",
    "F1 race results API",
    "Formula 1 historical data API",
    "F1 team stats",
    "F1 driver standings API",
    "Fastest lap data API",
    "Formula 1 race telemetry",
    "Live F1 leaderboard API",
  ],
  referrer: "origin-when-cross-origin",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
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
    site: "@rafacanosa",
    creator: "@rafacanosa",
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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-schema: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
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
      <body className={inter.variable}>
        <TranslationsProvider
          namespaces={i18nNamespaces}
          locale={params.locale}
          resources={resources}
        >
          <Providers>
            <Header />
            {children}
            <Footer locale={params.locale} />
          </Providers>
        </TranslationsProvider>
      </body>
      <GoogleAnalytics gaId="G-BSF96MBRJC" />
    </html>
  )
}
