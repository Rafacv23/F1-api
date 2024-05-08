import Link from "next/link"

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
            <div className="bg-gray-800 rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-2">Email</h2>
              <p className="mb-2">
                Send us an email at{" "}
                <a
                  href="mailto:rafacv23@gmail.com"
                  title="Send us an email"
                  className="text-blue-500 hover:underline"
                >
                  rafacv23@gmail.com
                </a>{" "}
                and well get back to you as soon as possible.
              </p>
            </div>
            <div className="bg-gray-800 rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-2">Social Media</h2>
              <p className="mb-2">
                Follow us on social media for updates and announcements:
              </p>
              <ul className="list-disc ml-6">
                <li>
                  <Link
                    href="https://ninjapath.vercel.app/f1-api-github"
                    title="F1 connect api github repository"
                    className="text-blue-500 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Github
                  </Link>
                </li>
                <li>
                  <Link
                    href="https://ninjapath.vercel.app/linkedin"
                    title="Rafa Canosa Linkedin"
                    className="text-blue-500 hover:underline"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Linkedin
                  </Link>
                </li>
              </ul>
            </div>
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
