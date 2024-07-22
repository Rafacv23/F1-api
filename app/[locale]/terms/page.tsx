import React from "react"
import TermsList from "@/components/TermList"
import Link from "next/link"
import initTranslations from "@/app/i18n"

export default async function Terms({
  params,
}: {
  params: { locale: string }
}) {
  const { t } = await initTranslations(params.locale, ["terms"])

  return (
    <main className="max-w-3xl mx-auto p-6 md:h-screen flex flex-col justify-center items-center">
      <section className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
        <p>{t("subtitle")}</p>
      </section>
      <TermsList />
      <div className="mt-8">
        <Link href="/" className="text-blue-500 hover:underline">
          {t("back")}
        </Link>
      </div>
    </main>
  )
}
