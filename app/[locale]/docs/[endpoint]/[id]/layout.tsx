import PageNav from "@/components/PageNav"

export default function DocsIdLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: {
    locale: string
  }
}>) {
  return (
    <div className="flex md:flex-row gap-6 justify-center w-full">
      {children}
      <PageNav />
    </div>
  )
}
