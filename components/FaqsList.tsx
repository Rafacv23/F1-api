import React from "react"
import faqs from "@/app/data/faqs.json"
import Faq from "./ui/Faq"

export default async function FaqsList() {
  const data = faqs

  return (
    <ul className="flex flex-col gap-4">
      {data.faqs.map((faq) => (
        <Faq key={faq.question} question={faq.question} answer={faq.answer} />
      ))}
    </ul>
  )
}
