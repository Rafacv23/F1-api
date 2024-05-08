import { FaGithub, FaLinkedin, FaHeart } from "react-icons/fa"
import { MdOutlineWebAsset } from "react-icons/md"
import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-dark dark:bg-gray-900">
      <div className="mx-auto max-w-screen-xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="text-teal-600 dark:text-teal-300 flex gap-2 items-center">
              <img
                src="/logo.avif"
                width={60}
                alt="f1 connect logo"
                loading="lazy"
              />
              F1 Connect
            </div>

            <p className="mt-4 max-w-xs text-gray-500 dark:text-gray-400">
              F1 Connect Api. Your free API, ready for development.
            </p>

            <ul className="mt-8 flex gap-6">
              <li>
                <Link
                  href="https://ninjapath.vercel.app/linkedin"
                  rel="noreferrer"
                  target="_blank"
                  title="Rafa Canosa Linkedin"
                  className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                >
                  <FaLinkedin />
                </Link>
              </li>

              <li>
                <Link
                  href="https://ninjapath.vercel.app/github"
                  rel="noreferrer"
                  target="_blank"
                  title="Rafa Canosa Github"
                  className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                >
                  <FaGithub />
                </Link>
              </li>
              <li>
                <Link
                  href="https://ninjapath.vercel.app/portfolio"
                  rel="noreferrer"
                  target="_blank"
                  title="Rafa Canosa Portfolio"
                  className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                >
                  <MdOutlineWebAsset />
                </Link>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
            <div>
              <p className="font-medium text-gray-900 dark:text-white">Pages</p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <Link
                    href="/"
                    title="Home page"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    {" "}
                    Home{" "}
                  </Link>
                </li>

                <li>
                  <Link
                    href="/docs"
                    title="Api Documentation"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    {" "}
                    Docs{" "}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-medium text-gray-900 dark:text-white">API</p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <Link
                    href="/api/seasons"
                    title="/api/seasons"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    {" "}
                    /api/seasons{" "}
                  </Link>
                </li>

                <li>
                  <Link
                    href="/api/drivers"
                    title="/api/drivers"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    {" "}
                    /api/drivers{" "}
                  </Link>
                </li>

                <li>
                  <Link
                    href="/api/teams"
                    title="/api/teams"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    {" "}
                    /api/teams{" "}
                  </Link>
                </li>

                <li>
                  <Link
                    href="/api/circuits"
                    title="/api/circuits"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    {" "}
                    /api/circuits{" "}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-medium text-gray-900 dark:text-white">
                Helpful Links
              </p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <Link
                    href="/contact"
                    title="Contact"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    {" "}
                    Contact{" "}
                  </Link>
                </li>

                <li>
                  <Link
                    href="/faq"
                    title="FAQs"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    {" "}
                    FAQs{" "}
                  </Link>
                </li>

                <li>
                  <Link
                    href="/terms"
                    title="Terms & Conditions"
                    className="text-gray-700 transition hover:opacity-75 dark:text-gray-200"
                  >
                    {" "}
                    Terms & Conditions{" "}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 flex gap-2 items-center">
          Made with <FaHeart /> by Rafa Canosa.
        </p>
      </div>
    </footer>
  )
}
