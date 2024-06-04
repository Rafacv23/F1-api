import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto p-6 h-screen flex flex-col justify-center items-center">
      <section className="text-white">
        <div className="max-w-screen-lg mx-auto">
          <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
          <p className="mb-8">
            Have questions, suggestions, or feedback? Wed love to hear from you!
            Reach out to us using one of the following methods:
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <ul className="flex flex-col gap-4">
              <li className="h-[max-content]">
                <Card className="w-[350px]">
                  <CardHeader>
                    <CardTitle>Email</CardTitle>
                    <CardDescription>
                      Send us an email at{" "}
                      <Link
                        href="mailto:rafacv23@gmail.com"
                        title="Send us an email"
                        className="text-blue-500 hover:underline"
                      >
                        rafacv23@gmail.com
                      </Link>{" "}
                      and well get back to you as soon as possible.
                    </CardDescription>
                  </CardHeader>
                </Card>
              </li>
              <li>
                <Card className="w-[350px]">
                  <CardHeader>
                    <CardTitle>Social Media</CardTitle>
                    <CardDescription>
                      Follow us on social media for updates and announcements:
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <Link
                      href="https://ninjapath.vercel.app/linkedin"
                      title="Rafa Canosa Linkedin"
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Linkedin
                    </Link>
                    <Link
                      href="https://ninjapath.vercel.app/f1-api-github"
                      title="F1 connect api github repository"
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Github
                    </Link>
                  </CardContent>
                </Card>
              </li>
              <li>
                <Card className="w-[350px]">
                  <CardHeader>
                    <CardTitle>Support me</CardTitle>
                    <CardDescription>
                      If you like my work, you can buy me a coffee.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    <Link
                      href="https://ko-fi.com/rafacanosa"
                      title="Buy me a coffee"
                      className="text-blue-500 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Ko-fi
                    </Link>
                  </CardContent>
                </Card>
              </li>
            </ul>
          </div>
          <div className="mt-8">
            <Link href="/" className="text-blue-500 hover:underline">
              ← Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
