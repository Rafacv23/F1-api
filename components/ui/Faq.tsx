import React from "react"
import type { FaqType } from "@/lib/definitions"

const Faq: React.FC<FaqType> = ({ question, answer }) => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-2">{question}</h2>
      <p className="mb-2">{answer}</p>
    </div>
  )
}

export default Faq
