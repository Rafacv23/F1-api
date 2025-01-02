"use client"

import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { useEffect } from "react"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="max-w-3xl mx-auto p-6 h-screen flex flex-col justify-center items-center">
      <h2 className="text-3xl font-bold mb-4">This article doesnt exists!</h2>
      <p className="text-gray-900 dark:text-gray-100">
        Looks like this article doesnt exists. But dont worry, we have a lot of
        other articles.
      </p>
      <div className="flex gap-2 items-center mt-4">
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Back to home
        </Link>
        <Link href="/blog" className={buttonVariants({ variant: "outline" })}>
          Read other articles
        </Link>
      </div>
    </main>
  )
}
