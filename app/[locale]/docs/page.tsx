import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import EndpointsList from "@/components/EndpointsList"
import initTranslations from "@/app/i18n"
import { BackBtn } from "@/components/BackBtn"

export default async function Docs({ params }: { params: { locale: string } }) {
  const { t } = await initTranslations(params.locale, ["docs"])

  return (
    <main className="max-w-3xl mx-auto p-6">
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
      <p className="mb-6">{t("p1")}</p>
      <p className="mb-6">{t("p2")}</p>
      <EndpointsList locale={params.locale} />
      <BackBtn locale={params.locale} />
    </main>
  )
}
