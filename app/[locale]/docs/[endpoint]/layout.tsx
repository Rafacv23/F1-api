import DocsNav from "@/components/DocsNav"

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
    <div className="flex p-6 mt-32 max-w-6xl w-full justify-center mx-auto">
      <DocsNav />
      {children}
    </div>
  )
}
