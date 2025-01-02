import Link from "next/link"
import { getAllArticles, getArticleData } from "@/lib/articles"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { ScrollProgress } from "@/components/ui/scroll-progress"

export async function generateStaticParams() {
  const articles = await getAllArticles()
  return articles.map((article) => ({
    slug: article.id,
  }))
}

const Article = async ({ params }: { params: { slug: string } }) => {
  const articleData = await getArticleData(params.slug)

  return (
    <>
      <ScrollProgress />
      <section className="mx-auto w-10/12 md:w-2/3 max-w-5xl flex flex-col gap-5 mt-32">
        <div className="flex justify-between font-poppins">
          <Link
            href={"/blog"}
            className="flex flex-row gap-1 place-items-center"
          >
            <ArrowLeft width={16} />
            <p>Back</p>
          </Link>
          <p>{articleData.date.toString()}</p>
        </div>
        <article
          className="article"
          dangerouslySetInnerHTML={{ __html: articleData.contentHtml }}
        />
        <div className="flex place-content-center mb-8">
          <Link
            title="Back to home page"
            href="/"
            className={buttonVariants({ variant: "link" })}
          >
            <ArrowLeft width={16} />
            Back
          </Link>
          <Link
            title="Back to blog page"
            href="/blog"
            className={buttonVariants({ variant: "link" })}
          >
            Read other articles
            <ArrowRight width={16} />
          </Link>
        </div>
      </section>
    </>
  )
}

export default Article
