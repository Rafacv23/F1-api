import Link from "next/link"
import React from "react"

interface FaqProps {
  url: string
  title: string
  description: string
}

const Faq: React.FC<FaqProps> = ({ url, title, description }) => {
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
