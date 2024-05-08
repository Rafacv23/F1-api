import React from "react"
import { SITE_NAME } from "@/lib/constants"
import TermsList from "@/components/TermList"

export default function Terms() {
  return (
    <main className="max-w-3xl mx-auto p-6 h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-4">Terms & Conditions</h1>
      <p>
        {SITE_NAME} is an experimental web service that provides a historical
        record of motor racing data for non-commercial purposes.
      </p>
      <p>By using this API, you agree to the following terms and conditions:</p>
      <h2 className="text-xl font-bold mb-2 mt-4">Terms Of Use</h2>
      <TermsList />
    </main>
  )
}
