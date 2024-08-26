import React from "react"
import Faq from "./ui/Faq"
import initTranslations from "@/app/i18n"

export default async function FaqsList({ locale }: { locale: string }) {
  const { t } = await initTranslations(locale, ["faqs"])

  const faqs = await import(`../locales/${locale}/faqs.json`).then(
    (module) => module.default
  )

  return (
    <ul className="flex flex-col gap-4">
      {faqs.faqs.map((faq: { question: string; answer: string }) => (
        <Faq
          key={t(faq.question)}
          question={t(faq.question)}
          answer={t(faq.answer)}
        />
      ))}
    </ul>
  )
}
