import Link from "next/link"
import initTranslations from "@/app/i18n"

export async function BackBtn({ locale }: { locale: string }) {
  const { t } = await initTranslations(locale, ["common"])

  return (
    <div className="mt-8">
      <Link
        title="Back to home page"
        href="/"
        className="text-blue-500 hover:underline"
      >
        {t("back")}
      </Link>
    </div>
  )
}
