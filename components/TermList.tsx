import React from "react"
import terms from "@/app/data/terms.json"
import Term from "./ui/Term"

export default async function TermsList() {
  const data = terms

  return (
    <ul className="flex flex-col gap-4">
      {data.terms.map((faq) => (
        <Term key={faq.title} title={faq.title} description={faq.description} />
      ))}
    </ul>
  )
}
