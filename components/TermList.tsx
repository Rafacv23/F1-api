import React from "react"
import Term from "./ui/Term"

export default async function TermsList({ locale }: { locale: string }) {
  const terms = await import(`../locales/${locale}/terms.json`).then(
    (module) => module.default
  )

  return (
    <ul className="flex flex-col gap-4">
      {terms.terms.map((faq: { title: string; description: string }) => (
        <Term key={faq.title} title={faq.title} description={faq.description} />
      ))}
    </ul>
  )
}
