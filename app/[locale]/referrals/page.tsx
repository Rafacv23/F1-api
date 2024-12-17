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
import { BackBtn } from "@/components/BackBtn"

export default async function Referral({
  params,
}: {
  params: { locale: string }
}) {
  const { t } = await initTranslations(params.locale, ["referrals"])
  return (
    <main className="max-w-5xl mx-auto p-6 h-screen mt-28">
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
      <p className="my-6">{t("subtitle")}</p>
      <ReferralsList locale={params.locale} />
      <BackBtn locale={params.locale} />
    </main>
  )
}
