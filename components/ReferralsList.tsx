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
import { SITE_NAME } from "@/lib/constants"

export default function ReferralsList() {
  return (
    <>
      <h2 className="text-2xl font-bold mb-2">Referrals</h2>
      <Table className="mb-8">
        <TableCaption>A list of all the Friends of {SITE_NAME}.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Logo</TableHead>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Link</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {referrals.map((referral) => (
            <TableRow key={referral.url}>
              <TableCell>
                <img
                  className="rounded"
                  src={referral.img}
                  alt={`${referral.name} logo`}
                  width={100}
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
