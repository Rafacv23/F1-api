import React from "react"
import TermsList from "@/components/terms/TermList"
import initTranslations from "@/app/i18n"
import { BackBtn } from "@/components/buttons/BackBtn"

export default async function Terms({
  params,
}: {
  params: { locale: string }
}) {
  const { t } = await initTranslations(params.locale, ["terms"])

  return (
    <main className="max-w-5xl mx-auto p-6 md:h-screen mt-32 mb-8 flex flex-col justify-center items-center">
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
        <p>{t("subtitle")}</p>
      </section>
      <TermsList locale={params.locale} />
      <BackBtn locale={params.locale} />
    </main>
  )
}
