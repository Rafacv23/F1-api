import React from "react"
import referrals from "@/app/data/referrals.json"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"
import initTranslations from "@/app/i18n"
import Image from "next/image"

export default async function ReferralsList({ locale }: { locale: string }) {
  const { t } = await initTranslations(locale, ["referrals"])

  return (
    <>
      <h2 className="text-2xl font-bold mb-2">{t("title")}</h2>
      <Table className="mb-8">
        <TableCaption>{t("table-caption")}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">{t("logo")}</TableHead>
            <TableHead className="w-[100px]">{t("name")}</TableHead>
            <TableHead>{t("description")}</TableHead>
            <TableHead>{t("author")}</TableHead>
            <TableHead>{t("link")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {referrals.map((referral) => (
            <TableRow key={referral.url}>
              <TableCell>
                <Image
                  className="rounded"
                  src={referral.img}
                  alt={`${referral.name} logo`}
                  width={100}
                  height={100}
                  loading="lazy"
                />
              </TableCell>
              <TableCell className="font-medium">{referral.name}</TableCell>
              <TableCell>{referral.description}</TableCell>
              <TableCell>{referral.author}</TableCell>
              <TableCell>
                <Link
                  href={referral.url}
                  title={referral.url}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-blue-500 hover:transition-colors hover:underline"
                >
                  {referral.url}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
