import Link from "next/link"

export default function DocsIdLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: {
    locale: string
  }
}>) {
  return (
    <div className="flex md:flex-row gap-6 justify-center w-full">
      {children}
      <nav className="hidden lg:block w-full md:w-1/6 border-l border-headerBorder dark:border-customGrayDark pl-4 sticky top-32 h-screen overflow-y-auto">
        <h3 className="font-semibold text-lg mb-4">On this page</h3>
        <ul className="flex flex-col gap-2">
          <li>
            <Link
              href={`#start`}
              className="text-slate-500 hover:text-black dark:text-slate-300 dark:hover:text-white hover:transition-all ease-in-out duration-300"
            >
              Endpoint
            </Link>
          </li>
          <li>
            <Link
              href={`#example`}
              className="text-slate-500 hover:text-black dark:text-slate-300 dark:hover:text-white hover:transition-all ease-in-out duration-300"
            >
              Example Response
            </Link>
          </li>
          <li>
            <Link
              href={`#example`}
              className="text-slate-500 hover:text-black dark:text-slate-300 dark:hover:text-white hover:transition-all ease-in-out duration-300"
            >
              Response Types
            </Link>
          </li>
          <li>
            <Link
              href={`#params`}
              className="text-slate-500 hover:text-black dark:text-slate-300 dark:hover:text-white hover:transition-all ease-in-out duration-300"
            >
              Response Params
            </Link>
          </li>
          <li>
            <Link
              href={`#status`}
              className="text-slate-500 hover:text-black dark:text-slate-300 dark:hover:text-white hover:transition-all ease-in-out duration-300"
            >
              Response Status
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
