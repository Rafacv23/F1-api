import Link from "next/link"
import type { ArticleItem } from "@/lib/definitions"
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card"
import moment from "moment"

interface Props {
  articles: ArticleItem[]
}

const ArticleItemList = ({ articles }: Props) => {
  return (
    <Card className="flex flex-col gap-5">
      {articles.map((article, id) => (
        <CardHeader
          className="flex flex-col gap-2.5 font-poppins text-lg"
          key={article.id}
        >
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
      ))}
    </Card>
  )
}

export default ArticleItemList
