import { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/constants"
import { getAllArticles } from "@/lib/articles"
import endpoints from "@/content/endpoints.json"

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getAllArticles()

  const articleRoutes = articles.map((article) => {
    return {
      url: `${SITE_URL}/blog/${article.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }
  })

  const endpointsPages = endpoints.map((endpoint) => ({
    url: `${SITE_URL}/docs/${endpoint.section}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }))

  const subendpointsPages = endpoints.flatMap((endpoint) => {
    return endpoint.endpoints.map((subendpoint) => ({
      url: `${SITE_URL}/docs/${endpoint.section}/${subendpoint.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }))
  })

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),

      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/docs`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/referrals`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.5,
    },
    ...articleRoutes,
    ...endpointsPages,
    ...subendpointsPages,
  ]
}
