import Link from "next/link"
import { FaGithub } from "react-icons/fa"
import { SiGoogledocs } from "react-icons/si"

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto p-6 h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-4">F1 API</h1>
      <p className="text-center mb-4">
        Your free F1 API. Ready for development.
      </p>
      <section className="flex gap-4">
        <Link
          href="/docs"
          className="flex gap-2 items-center hover:text-blue-500 hover:transition-colors"
        >
          <SiGoogledocs />
          <span>Docs</span>
        </Link>
        <Link
          href="https://github.com/Rafacv23/F1-api"
          className="flex gap-2 items-center hover:text-blue-500 hover:transition-colors"
        >
          <FaGithub />
          <span>Github</span>
        </Link>
      </section>
    </main>
  )
}
