import ScrollToTop from "@/components/buttons/ScrollToTop"
import DocsNav from "@/components/navs/DocsNav"

export default function DocsLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: {
    locale: string
  }
}>) {
  return (
    <div className="flex p-6 mt-32 mb-8 max-w-7xl w-full justify-center mx-auto">
      <DocsNav />
      {children}
      <ScrollToTop />
    </div>
  )
}
