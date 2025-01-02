import Link from "next/link"
import endpoints from "@/content/endpoints.json"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function DocsNav() {
  return (
    <nav className="hidden md:block w-full md:min-w-fit md:max-w-xs md:w-2/6 border-r pr-4 border-headerBorder dark:border-customGrayDark sticky top-32 h-screen overflow-y-auto">
      <Link
        href="/docs"
        className="font-semibold text-lg mb-4 hover:text-f1 hover:transition-colors"
      >
        Endpoints
      </Link>
      <ul>
        {endpoints.map((endpoint) => (
          <li key={endpoint.id}>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <Link href={`/docs/${endpoint.id}`}>{endpoint.title}</Link>
                </AccordionTrigger>
                <AccordionContent>
                  <ul className="overflow-y-auto relative space-y-2">
                    {endpoint.endpoints.map((subEndpoint) => (
                      <li key={subEndpoint.id}>
                        <Link
                          href={`/docs/${endpoint.id}/${subEndpoint.id}`}
                          className="text-slate-500 hover:text-black dark:text-slate-300 dark:hover:text-white hover:transition-all ease-in-out duration-300"
                        >
                          {subEndpoint.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </li>
        ))}
      </ul>
    </nav>
  )
}
