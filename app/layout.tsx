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
  alternates: {
    canonical: "/",
  },
  keywords: ["F1", "Public API", "Formula 1"],
  referrer: "origin-when-cross-origin",
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
