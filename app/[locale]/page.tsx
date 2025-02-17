import Announcer from "@/components/home/Announcer"
import HomeBanner from "@/components/home/HomeBanner"

export default function Page({ params }: { params: { locale: string } }) {
  return (
    <main className="max-w-3xl mx-auto p-6 h-screen flex flex-col justify-center items-center">
      <HomeBanner locale={params.locale} />
      <Announcer />
    </main>
  )
}
