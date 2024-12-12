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

  const contactWays = [
    {
      title: t("email"),
      description: t("email-description"),
      links: [
        {
          link: "mailto:rafacv23@gmail.com",
          linkTitle: "Send us an email",
        },
      ],
    },
    {
      title: t("social"),
      description: t("social-description"),
      links: [
        {
          link: "https://ninjapath.vercel.app/linkedin",
          linkTitle: "Linkedin",
        },
        {
          link: "https://ninjapath.vercel.app/f1-api-github",
          linkTitle: "Github",
        },
      ],
    },
    {
      title: t("support"),
      description: t("support-description"),
      links: [
        {
          link: "https://ko-fi.com/rafacanosa",
          linkTitle: "Buy me a coffee",
        },
      ],
    },
  ]

  return (
    <main className="max-w-5xl mx-auto p-6 h-screen mt-44 md:mt-28 mb-20 md:mb-0 flex flex-col justify-center items-center">
      <section>
        <div className="max-w-screen-lg mx-auto">
          <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
          <p className="mb-8">{t("subtitle")}</p>
          <div>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {contactWays.map((way) => (
                <li key={way.title}>
                  <Card className="w-[300px] h-[200px]">
                    <CardHeader>
                      <CardTitle>{way.title}</CardTitle>
                      <CardDescription>{way.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-row gap-4">
                      {way.links.map((link) => (
                        <Link
                          key={link.link}
                          href={link.link}
                          title={link.linkTitle}
                          className="text-f1 hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        >
                          {link.linkTitle}
                        </Link>
                      ))}
                    </CardContent>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
          <BackBtn locale={params.locale} />
        </div>
      </section>
    </main>
  )
}
