import { SITE_NAME } from "@/lib/constants"
import Link from "next/link"
import { buttons } from "@/components/header/headerData"
import MobileHeader from "@/components/header/MobileHeader"
import DesktopHeader from "@/components/header/DesktopHeader"

export default function Header() {
  return (
    <header>
      <div className="fixed inset-x-0 z-50 top-0 p-4 items-center justify-center flex">
        <div className="max-w-7xl bg-gradient-to-r from-white to-slate-50 dark:from-customGrayDark dark:to-customGrayDarker border border-headerBorder w-full lg:w-2/3 relative flex items-center justify-between gap-4 rounded-lg px-4 py-5 shadow-lg">
          <div id="header-start" className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 hover:transform hover:scale-105 hover:transition-all ease-in-out duration-300"
            >
              <img src="/logo.avif" alt="logo" className="h-8 w-8" />
              <h2 className="dark:text-white">{SITE_NAME}</h1>
            </Link>
          </div>
          <div className="hidden gap-4 lg:flex items-center justify-center">
            {buttons.map((button) => (
              <Link
                key={button.label}
                href={button.href}
                className="text-slate-500 hover:text-black dark:text-slate-300 dark:hover:text-white hover:transition-all ease-in-out duration-300"
              >
                {button.label}
              </Link>
            ))}
          </div>
          <DesktopHeader />
          <MobileHeader />
        </div>
      </div>
    </header>
  )
}
