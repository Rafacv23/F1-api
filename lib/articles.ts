import fs from "fs"
import matter from "gray-matter"
import path from "path"
import moment from "moment"
import { remark } from "remark"
import html from "remark-html"
import { ArticleItem } from "@/lib/definitions"

const articlesDirectory = path.join(process.cwd(), "articles")

export const getAllArticles = (): ArticleItem[] => {
  const fileNames = fs.readdirSync(articlesDirectory)

  const allArticlesData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, "")

    const fullPath = path.join(articlesDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, "utf-8")

    const matterResult = matter(fileContents)

    return {
      id,
      title: matterResult.data.title,
      description: matterResult.data.description,
      date: matterResult.data.date,
      category: matterResult.data.category,
      author: matterResult.data.author,
    }
  })

  return allArticlesData.sort((a, b) =>
    moment(a.date, "DD-MM-YYYY").diff(moment(b.date, "DD-MM-YYYY"))
  )
}

const getSortedArticles = (): ArticleItem[] => {
  const fileNames = fs.readdirSync(articlesDirectory)

  const allArticlesData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, "")

    const fullPath = path.join(articlesDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, "utf-8")

    const matterResult = matter(fileContents)

    return {
      id,
      title: matterResult.data.title,
      description: matterResult.data.description,
      date: matterResult.data.date,
      category: matterResult.data.category,
      author: matterResult.data.author,
    }
  })

  return allArticlesData.sort((a, b) => {
    const format = "DD-MM-YYYY"
    const dateOne = moment(a.date, format, true)
    const dateTwo = moment(b.date, format, true)
    if (!dateOne.isValid() || !dateTwo.isValid()) {
      console.warn(`Fecha inválida en los artículos: ${a.title} o ${b.title}`)
      return 0 // Si alguna fecha es inválida, se mantiene el orden original
    }

    return dateTwo.valueOf() - dateOne.valueOf()
  })
}

export const getCategorizedArticles = (): Record<string, ArticleItem[]> => {
  const sortedArticles = getSortedArticles()
  const categorizedArticles: Record<string, ArticleItem[]> = {}

  sortedArticles.forEach((article) => {
    if (!categorizedArticles[article.category]) {
      categorizedArticles[article.category] = []
    }
    categorizedArticles[article.category].push(article)
  })

  return categorizedArticles
}

export const getArticleData = async (id: string) => {
  const fullPath = path.join(articlesDirectory, `${id}.md`)

  const fileContents = fs.readFileSync(fullPath, "utf8")

  const matterResult = matter(fileContents)

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content)

  const contentHtml = processedContent.toString()

  return {
    id,
    contentHtml,
    title: matterResult.data.title,
    description: matterResult.data.description,
    category: matterResult.data.category,
    date: moment(matterResult.data.date, "DD-MM-YYYY").format("MMMM Do YYYY"),
  }
}
