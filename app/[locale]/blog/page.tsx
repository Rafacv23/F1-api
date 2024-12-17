import initTranslations from "@/app/i18n"
import ArticleItemList from "@/components/ArticleListItem"
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getCategorizedArticles } from "@/lib/articles"

const HomePage = async ({ params }: { params: { locale: string } }) => {
  const articles = getCategorizedArticles()
  const { t } = await initTranslations(params.locale, ["docs"])

  return (
    <main className="max-w-5xl mx-auto p-6 mt-28 h-screen">
      <header className="font-light text-6xl">
        <h1 className="text-3xl font-bold mb-4">Blog</h1>
      </header>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">{t("home")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Blog</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <p className="my-6">{t("blog-entrance")}</p>
      <p className="my-6">{t("blog-advertise")}</p>
      <section
        className={`md:grid md:grid-cols-2 flex flex-col gap-10 ${
          Object.keys(articles).length === 0 ? "hidden" : ""
        }`}
      >
        <Tabs defaultValue="changelog">
          <TabsList>
            {Object.keys(articles).map((category) => (
              <TabsTrigger key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.keys(articles).map((category) => (
            <TabsContent key={category} value={category}>
              <ArticleItemList articles={articles[category]} />
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </main>
  )
}

export default HomePage
