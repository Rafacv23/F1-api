import { FaHeart } from "react-icons/fa"
import LanguageChanger from "@/components/LanguageChanger"
import Link from "next/link"
import Image from "next/image"
import initTranslations from "@/app/i18n"
import { SITE_NAME } from "@/lib/constants"
import ThemeToggle from "./ThemeToggle"
import {
  contactLinks,
  pages,
  help,
  api,
} from "@/components/footer/footerLinks.js"
import { List } from "./footer/list"

export default async function Footer({ locale }: { locale: string }) {
  const { t } = await initTranslations(locale, ["footer"])

  return (
    <footer className="bg-dark dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="text-teal-600 dark:text-teal-300 flex gap-2 items-center">
              <Image
                src="/logo.avif"
                width={60}
                height={60}
                alt="f1 connect logo"
                loading="lazy"
              />
              {SITE_NAME}
            </div>
            <p className="mt-4 max-w-xs text-gray-500 dark:text-gray-400">
              {t("description")}
            </p>
            <ul className="mt-8 flex gap-6">
              {contactLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    title={link.title}
                    rel="noreferrer"
                    target="_blank"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    {link.icon}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
            <List title={t("pages")} array={pages} locale={locale} />
            <List title="API" array={api} locale={locale} />
            <List title={t("help")} array={help} locale={locale} />
          </div>
        </div>
        <div className="flex gap-2">
          <LanguageChanger />
          <ThemeToggle locale={locale} />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 flex gap-2 items-center">
          Made with <FaHeart /> by Rafa Canosa.
        </p>
      </div>
    </footer>
  )
}
