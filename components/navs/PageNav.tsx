import Link from "next/link"

const sections = [
  { label: "Endpoint", link: "#start" },
  { label: "Example Response", link: "#example" },
  { label: "Response Types", link: "#types" },
  { label: "Response Params", link: "#params" },
  { label: "Response Status", link: "#status" },
]

export default function PageNav() {
  return (
    <nav className="hidden xl:block w-full md:w-1/6 border-l border-headerBorder dark:border-customGrayDark pl-4 sticky top-32 h-screen overflow-y-auto">
      <h3 className="font-semibold text-lg mb-4">On this page</h3>
      <ul className="flex flex-col gap-2">
        {sections.map((section) => (
          <li key={section.label}>
            <Link
              href={section.link}
              className="text-slate-500 hover:text-black dark:text-slate-300 dark:hover:text-white hover:transition-all ease-in-out duration-300"
            >
              {section.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
