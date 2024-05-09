import React from "react"
import type { TermType } from "@/lib/definitions"

const Term: React.FC<TermType> = ({ title, description }) => {
  return (
    <li>
      <h2 className="text-xl font-bold mb-2 mt-4">{title}</h2>
      <p className="mb-2">{description}</p>
    </li>
  )
}

export default Term
