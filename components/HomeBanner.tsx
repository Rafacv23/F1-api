import React from "react"
import Link from "next/link"
import { FaGithub } from "react-icons/fa"
import { SiGoogledocs } from "react-icons/si"
import initTranslations from "@/app/i18n"
import { SITE_TITLE } from "@/lib/constants"
import Image from "next/image"
import { Button } from "./ui/button"

export default async function HomeBanner({ locale }: { locale: string }) {
  const { t } = await initTranslations(locale, ["home"])
  return (
    <>
      <Image
        src="/logo.avif"
        width={200}
        height={300}
        alt="F1 Connect Api Logo"
      />
      <section>
        <div className="mx-auto max-w-screen-xl px-4 lg:flex lg:items-center">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-extrabold text-transparent sm:text-5xl text-white">
              {SITE_TITLE}
            </h1>

            <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
              {t("subtitle")}
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link href="/docs">
                <Button className="flex gap-2">
                  <SiGoogledocs />
                  <span>Docs</span>
                </Button>
              </Link>
              <Link
                target="_blank"
                rel="noreferrer"
                href="https://ninjapath.vercel.app/f1-api-github"
              >
                <Button className="flex gap-2" variant="ghost">
                  <FaGithub />
                  <span>Github</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
