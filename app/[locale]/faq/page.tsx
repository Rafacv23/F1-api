import initTranslations from "@/app/i18n"
import FaqsList from "@/components/FaqsList"
import Link from "next/link"
import React from "react"

export default async function FAQs({ params }: { params: { locale: string } }) {
  const { t } = await initTranslations(params.locale, ["faqs"])

  return (
    <main className="max-w-3xl mx-auto p-6 md:h-screen flex flex-col justify-center items-center">
      <section>
        <div className="max-w-screen-lg mx-auto">
          <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
          <FaqsList locale={params.locale} />
          <div className="mt-8">
            <Link
              title="Back to home page"
              href="/"
              className="text-blue-500 hover:underline"
            >
              {t("back")}
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
