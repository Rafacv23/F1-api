import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import initTranslations from "@/app/i18n"
import { BackBtn } from "@/components/BackBtn"
import Link from "next/link"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import endpoints from "@/content/endpoints.json"

export default async function Docs({ params }: { params: { locale: string } }) {
  const { t } = await initTranslations(params.locale, ["docs"])

  return (
    <main className="max-w-3xl p-6">
      <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">{t("home")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Docs</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
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
    </main>
  )
}
