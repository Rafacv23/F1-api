import React from "react"

interface FaqProps {
  title: string
  description: string
}

const Faq: React.FC<FaqProps> = ({ title, description }) => {
  return (
    <li>
      <h2 className="text-xl font-bold mb-2 mt-4">{title}</h2>
      <p className="mb-2">{description}</p>
    </li>
  )
}

export default Faq
