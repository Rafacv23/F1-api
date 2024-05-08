import Link from "next/link"
import { FaGithub } from "react-icons/fa"
import { SiGoogledocs } from "react-icons/si"

export default function Page() {
  return (
    <main className="max-w-3xl mx-auto p-6 h-screen flex flex-col justify-center items-center">
      <section className=" text-white ">
        <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
              F1 Connect Api.
            </h1>

            <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
              Your free F1 API. Ready for development.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/docs"
                className="flex gap-2 items-center justify-center w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
              >
                <SiGoogledocs />
                <span>Docs</span>
              </Link>
              <Link
                target="_blank"
                rel="noreferrer"
                href="https://ninjapath.vercel.app/f1-api-github"
                className="flex gap-2 items-center w-full justify-center rounded border border-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
              >
                <FaGithub />
                <span>Github</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
