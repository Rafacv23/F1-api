import { FaGithub, FaLinkedin, FaHeart } from "react-icons/fa"
import { MdOutlineWebAsset } from "react-icons/md"
import { SiKofi } from "react-icons/si"
import LanguageChanger from "@/components/LanguageChanger"
import Link from "next/link"
import Image from "next/image"
import initTranslations from "@/app/i18n"
import { SITE_NAME } from "@/lib/constants"

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
              <li>
                <Link
                  href="https://ninjapath.vercel.app/linkedin"
                  rel="noreferrer"
                  target="_blank"
                  title="Rafa Canosa Linkedin"
                  className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                >
                  <FaLinkedin />
                </Link>
              </li>

              <li>
                <Link
                  href="https://ko-fi.com/rafacanosa"
                  rel="noreferrer"
                  target="_blank"
                  title="Buy me a coffee"
                  className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                >
                  <SiKofi />
                </Link>
              </li>

              <li>
                <Link
                  href="https://ninjapath.vercel.app/github"
                  rel="noreferrer"
                  target="_blank"
                  title="Rafa Canosa Github"
                  className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                >
                  <FaGithub />
                </Link>
              </li>
              <li>
                <Link
                  href="https://ninjapath.vercel.app/portfolio"
                  rel="noreferrer"
                  target="_blank"
                  title="Rafa Canosa Portfolio"
                  className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                >
                  <MdOutlineWebAsset />
                </Link>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {t("pages")}
              </p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <Link
                    href="/"
                    title="Home page"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    {t("home")}
                  </Link>
                </li>

                <li>
                  <Link
                    href="/docs"
                    title="Api Documentation"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    {t("docs")}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/referrals"
                    title="Referrals"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    {t("referrals")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-medium text-gray-900 dark:text-white">API</p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <Link
                    href="/api/seasons"
                    title="/api/seasons"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    /api/seasons
                  </Link>
                </li>

                <li>
                  <Link
                    href="/api/drivers"
                    title="/api/drivers"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    /api/drivers
                  </Link>
                </li>

                <li>
                  <Link
                    href="/api/teams"
                    title="/api/teams"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    /api/teams
                  </Link>
                </li>

                <li>
                  <Link
                    href="/api/circuits"
                    title="/api/circuits"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    /api/circuits
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                {t("help")}
              </p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <Link
                    href="/contact"
                    title="Contact"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    {t("contact")}
                  </Link>
                </li>

                <li>
                  <Link
                    href="/faq"
                    title="FAQs"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    {t("faqs")}
                  </Link>
                </li>

                <li>
                  <Link
                    href="/terms"
                    title="Terms & Conditions"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    {t("terms")}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <LanguageChanger />
        <p className="text-xs text-gray-500 dark:text-gray-400 flex gap-2 items-center">
          Made with <FaHeart /> by Rafa Canosa.
        </p>
      </div>
    </footer>
  )
}
