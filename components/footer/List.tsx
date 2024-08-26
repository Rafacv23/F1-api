import initTranslations from "@/app/i18n"
import Link from "next/link"

export async function List({
  array,
  locale,
  title,
}: {
  array: Array<any>
  locale: string
  title: string
}) {
  const { t } = await initTranslations(locale, ["footer"])

  return (
    <div className="flex flex-col">
      <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
      <ul className="mt-6 space-y-4 text-sm">
        {array.map((page) => (
          <li key={page.title}>
            <Link
              href={page.href}
              title={page.title}
              className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
            >
              {t(page.children)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
