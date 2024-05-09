import Link from "next/link"
import React from "react"
import type { EndpointType } from "@/lib/definitions"

const Faq: React.FC<EndpointType> = ({ url, title, description }) => {
  return (
    <li key={title} className="mb-2">
      <Link href={url} title={title} className="text-blue-500">
        {title}
      </Link>
      {": "}
      {description}
    </li>
  )
}

export default Faq
