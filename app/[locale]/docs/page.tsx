import initTranslations from "@/app/i18n"
import { BackBtn } from "@/components/buttons/BackBtn"
import Link from "next/link"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import endpoints from "@/content/endpoints.json"
import ArrayBread from "@/components/ArrayBread"
import ScrollToTop from "@/components/buttons/ScrollToTop"

export default async function Docs({ params }: { params: { locale: string } }) {
  const { t } = await initTranslations(params.locale, ["docs"])

  return (
    <main className="max-w-3xl mt-32 mx-auto p-6 flex flex-col">
      <ArrayBread items={[{ label: "Docs", link: "/docs" }]} />
      <h1 className="text-3xl font-bold my-4">{t("title")}</h1>
      <p className="my-6">{t("p1")}</p>
      <p className="mb-6">{t("p2")}</p>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {endpoints.map((section) => (
          <li key={section.id}>
            <Link href={`/docs/${section.id}`}>
              <Card>
                <CardHeader className="hover:text-f1 hover:transition-colors">
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
      <BackBtn locale={params.locale} />
      <ScrollToTop />
    </main>
  )
}
