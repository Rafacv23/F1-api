import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import initTranslations from "@/app/i18n"
import { BackBtn } from "@/components/BackBtn"

export default async function ContactPage({
  params,
}: {
  params: { locale: string }
}) {
  const { t } = await initTranslations(params.locale, ["contact"])

  return (
    <main className="max-w-5xl mx-auto p-6 h-screen mt-44 md:mt-32 mb-20 md:mb-0 flex flex-col justify-center items-center">
      <section>
        <div className="max-w-screen-lg mx-auto">
          <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
          <p className="mb-8">{t("subtitle")}</p>
          <div>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <li>
                <Card className="w-[300px] h-[200px]">
                  <CardHeader>
                    <CardTitle>{t("email")}</CardTitle>
                    <CardDescription>
                      {t("email1")}{" "}
                      <Link
                        href="mailto:rafacv23@gmail.com"
                        title="Send us an email"
                        className="text-f1 hover:underline"
                      >
                        rafacv23@gmail.com
                      </Link>{" "}
                      {t("email2")}
                    </CardDescription>
                  </CardHeader>
                </Card>
              </li>
              <li>
                <Card className="w-[300px] h-[200px]">
                  <CardHeader>
                    <CardTitle>{t("social")}</CardTitle>
                    <CardDescription>{t("social-description")}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-row gap-4">
                    <Link
                      href="https://ninjapath.vercel.app/linkedin"
                      title="Rafa Canosa Linkedin"
                      className="text-f1 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Linkedin
                    </Link>
                    <Link
                      href="https://ninjapath.vercel.app/f1-api-github"
                      title="F1 connect api github repository"
                      className="text-f1 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Github
                    </Link>
                  </CardContent>
                </Card>
              </li>
              <li>
                <Card className="w-[300px] h-[200px]">
                  <CardHeader>
                    <CardTitle>{t("support")}</CardTitle>
                    <CardDescription>
                      {t("support-description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <Link
                      href="https://ko-fi.com/rafacanosa"
                      title="Buy me a coffee"
                      className="text-f1 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ko-fi
                    </Link>
                  </CardContent>
                </Card>
              </li>
            </ul>
          </div>
          <BackBtn locale={params.locale} />
        </div>
      </section>
    </main>
  )
}
