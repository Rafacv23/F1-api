import { buttonVariants } from "@/components/ui/button"
import { cookies } from "next/headers"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function SuccessPage() {
  const cookieStore = await cookies()
  const submitted = cookieStore.get("submitted")

  if (!submitted) {
    redirect("/contact")
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 h-screen">
      <h1 className="text-4xl font-bold">Thank you for your message!</h1>
      <p className="text-lg">We will get back to you soon.</p>
      <footer className="flex flex-row items-center justify-center gap-4 py-4">
        <Link
          href="/contact"
          title="Contact page"
          className={buttonVariants({ variant: "outline" })}
        >
          Back to contact page
        </Link>
        <Link
          href="/"
          title="Home page"
          className={buttonVariants({ variant: "outline" })}
        >
          Back to home page
        </Link>
      </footer>
    </div>
  )
}
