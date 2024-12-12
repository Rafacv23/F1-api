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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function Docs({ params }: { params: { locale: string } }) {
  const { t } = await initTranslations(params.locale, ["docs"])

  return (
    <main className="max-w-5xl mx-auto p-6 mt-28">
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
      <Tabs defaultValue="drivers">
        <TabsList>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="seasons">Seasons</TabsTrigger>
          <TabsTrigger value="races">Races</TabsTrigger>
          <TabsTrigger value="standings">Standings</TabsTrigger>
          <TabsTrigger value="circuits">Circuits</TabsTrigger>
        </TabsList>
        <TabsContent value="drivers">
          Make changes to your account here.
          <EndpointsList locale={params.locale} value="drivers" />
        </TabsContent>
        <TabsContent value="teams">
          Change your password here.
          <EndpointsList locale={params.locale} value="teams" />
        </TabsContent>
        <TabsContent value="seasons">
          <EndpointsList locale={params.locale} value="seasons" />
        </TabsContent>
        <TabsContent value="races">
          <EndpointsList locale={params.locale} value="races" />
        </TabsContent>
        <TabsContent value="standings">
          <EndpointsList locale={params.locale} value="standings" />
        </TabsContent>
        <TabsContent value="circuits">
          <EndpointsList locale={params.locale} value="circuits" />
        </TabsContent>
      </Tabs>
      <BackBtn locale={params.locale} />
    </main>
  )
}
