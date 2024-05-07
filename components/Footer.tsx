import { MdOutlinePrivacyTip } from "react-icons/md"
import { IoMdContact, IoMdHome } from "react-icons/io"
import { FaQuestion } from "react-icons/fa"
import Link from "next/link"
import { SiGoogledocs } from "react-icons/si"

export default function Footer() {
  return (
    <footer className="text-gray-300 py-4 border-t-slate-200 border">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <p className="text-sm">© 2024 Formula 1 API. All rights reserved.</p>
        <ul className="flex space-x-4">
          <li>
            <Link
              href="/"
              className="hover:text-gray-400 transition duration-300 flex gap-2 items-center"
            >
              <IoMdHome /> Home
            </Link>
          </li>
          <li>
            <Link
              href="/docs"
              className="hover:text-gray-400 transition duration-300 flex gap-2 items-center"
            >
              <SiGoogledocs />
              <span>Docs</span>
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className="hover:text-gray-400 transition duration-300 flex gap-2 items-center"
            >
              <IoMdContact /> Contact
            </Link>
          </li>
          <li>
            <Link
              href="/faq"
              className="hover:text-gray-400 transition duration-300 flex gap-2 items-center"
            >
              <FaQuestion /> FAQ
            </Link>
          </li>
          <li>
            <Link
              href="/terms"
              className="hover:text-gray-400 transition duration-300 flex gap-2 items-center"
            >
              <MdOutlinePrivacyTip /> Terms & Conditions
            </Link>
          </li>
        </ul>
      </div>
    </footer>
  )
}
