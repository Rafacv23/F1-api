import React from "react"
import type { FaqType } from "@/lib/definitions"
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const Faq: React.FC<FaqType> = ({ question, answer }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{question}</CardTitle>
        <CardDescription>{answer}</CardDescription>
      </CardHeader>
    </Card>
  )
}

export default Faq
