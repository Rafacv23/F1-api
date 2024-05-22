import Header from "@/components/demo/header"

export default function DemoLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <main className="dark max-w-3xl mx-auto p-6 h-screen flex flex-col justify-center items-center">
        {children}
      </main>
    </>
  )
}
