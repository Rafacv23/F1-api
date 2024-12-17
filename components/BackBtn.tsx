import Link from "next/link"
import initTranslations from "@/app/i18n"
import { buttonVariants } from "@/components/ui/button"

export async function BackBtn({ locale }: { locale: string }) {
  const { t } = await initTranslations(locale, ["common"])

  return (
    <div className="my-8 place-content-center grid">
      <Link
        title="Back to home page"
        href="/"
        className={buttonVariants({ variant: "link" })}
      >
        {t("back")}
      </Link>
    </div>
  )
}
