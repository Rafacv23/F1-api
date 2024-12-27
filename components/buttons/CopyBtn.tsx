"use client"

import { Button } from "@/components/ui/button"
import { Check, Copy } from "lucide-react"
import { copyUrlToClipboard } from "@/lib/utils"
import { useState } from "react"

interface CopyBtnProps extends React.HTMLAttributes<HTMLButtonElement> {
  text: string
}

export default function CopyBtn({ text }: CopyBtnProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      copyUrlToClipboard(text) // Assuming this function handles copying to clipboard
      setCopied(true) // Set copied state to true
      setTimeout(() => setCopied(false), 3000) // Reset copied state after 2 seconds
    } catch (error) {
      console.error("Failed to copy text:", error)
    }
  }

  return (
    <Button className="flex gap-2 items-center" onClick={handleCopy}>
      {copied ? "Copied!" : "Copy Link"}
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </Button>
  )
}