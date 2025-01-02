import Link from "next/link"
import type { ArticleItem } from "@/lib/definitions"
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card"
import moment from "moment"

interface Props {
  articles: ArticleItem[]
}

const ArticleItemList = ({ articles }: Props) => {
  return (
    <>
      {articles.map((article, id) => (
        <Card key={article.id} className="my-4">
          <CardHeader className="flex flex-col gap-2.5 font-poppins text-lg">
            <CardTitle>
              <Link
                href={`/blog/${article.id}`}
                key={id}
                className="hover:text-f1 transition duration-150"
              >
                {article.title}
              </Link>
            </CardTitle>
            <CardDescription>
              {moment(article.date, "DD-MM-YYYY").format("MMMM Do YYYY")} by{" "}
              {article.author}
            </CardDescription>
          </CardHeader>
        </Card>
      ))}
    </>
  )
}

export default ArticleItemList
