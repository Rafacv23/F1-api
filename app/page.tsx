import Announcer from "@/components/Announcer"
import HomeBanner from "@/components/HomeBanner"

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto p-6 h-screen flex flex-col justify-center items-center">
      <Announcer />
      <HomeBanner />
    </main>
  )
}
