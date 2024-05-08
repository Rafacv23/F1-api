import FaqsList from "@/components/FaqsList"
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
          <FaqsList />
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
