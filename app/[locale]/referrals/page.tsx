import React from "react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import ReferralsList from "@/components/ReferralsList"
import initTranslations from "@/app/i18n"
import Link from "next/link"
import { BackBtn } from "@/components/BackBtn"

export default async function Referral({
  params,
}: {
  params: { locale: string }
}) {
  const { t } = await initTranslations(params.locale, ["referrals"])
  return (
    <main className="max-w-3xl mx-auto p-6 h-screen">
      <h1 className="text-3xl font-bold mb-4">{t("title")}</h1>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">{t("home")}</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{t("title")}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <p className="mb-6">{t("subtitle")}</p>
      <ReferralsList locale={params.locale} />
      <BackBtn locale={params.locale} />
    </main>
  )
}
