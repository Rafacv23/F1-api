import Link from "next/link"
import React from "react"

export default function FAQs() {
  return (
    <main className="max-w-3xl mx-auto p-6 md:h-screen flex flex-col justify-center items-center">
      <section className="text-white">
        <div className="max-w-screen-lg mx-auto">
          <h1 className="text-3xl font-bold mb-4">
            Frequently Asked Questions
          </h1>
          <div className="bg-gray-800 rounded-lg shadow-md p-4">
            <h2 className="text-xl font-semibold mb-2">
              What is F1 Connect API?
            </h2>
            <p className="mb-2">
              F1 Connect API is a free API service providing data related to
              Formula 1 racing.
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-md p-4 mt-4">
            <h2 className="text-xl font-semibold mb-2">
              How do I access the API?
            </h2>
            <p className="mb-2">
              You can access the API by making HTTP requests to the provided
              endpoints. Refer to the{" "}
              <Link
                href={"/docs"}
                title="Documentation"
                className="text-blue-500 hover:underline"
              >
                documentation
              </Link>{" "}
              for details.
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-md p-4 mt-4">
            <h2 className="text-xl font-semibold mb-2">
              Is the API free to use?
            </h2>
            <p className="mb-2">
              Yes, the F1 Connect API is completely free to use for personal
              projects.
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-md p-4 mt-4">
            <h2 className="text-xl font-semibold mb-2">
              From which season is the information available?
            </h2>
            <p className="mb-2">
              The objective is to have all the F1 seasons available. Since the
              first one (1950) to the latest.
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg shadow-md p-4 mt-4">
            <h2 className="text-xl font-semibold mb-2">
              How long does it take to update information after each race?
            </h2>
            <p className="mb-2">
              Information is typically updated within 24-48 hours after the
              conclusion of each race.
            </p>
          </div>
          <div className="mt-8">
            <Link
              title="Back to home page"
              href="/"
              className="text-blue-500 hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
