import React from "react"
import faqs from "@/app/data/faqs.json"
import Faq from "./ui/Faq"

export default async function FaqsList() {
  return (
    <ul className="flex flex-col gap-4">
      {faqs.map((faq) => (
        <Faq key={faq.question} question={faq.question} answer={faq.answer} />
      ))}
    </ul>
  )
}
