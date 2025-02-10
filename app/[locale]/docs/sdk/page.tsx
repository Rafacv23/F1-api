import ArrayBread from "@/components/ArrayBread"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, ArrowRight, Download, Github } from "lucide-react"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"

const installationReadme = `
\`\`\`bash
npm install @f1api/sdk
\`\`\`
`

const usageReadme = `
Initialize the SDK

\`\`\`js
import F1Api from "@f1api/sdk"

const f1Api = new F1Api()
\`\`\`

### Use any method to retrieve endpoint data

\`\`\`js
const drivers = await f1Api.getDrivers()
\`\`\`
`

export default function SDKPage() {
  return (
    <main className="max-w-3xl mt-32 mx-auto p-6 flex flex-col space-y-8">
      <ArrayBread
        items={[
          { label: "Docs", link: "/docs" },
          {
            label: "SDK",
            link: `/docs/sdk`,
          },
        ]}
      />

      <h1 className="text-3xl font-bold mb-4">SDK</h1>
      <p className="mb-4">
        We are designed our new SDK tool that you can use via NPM. It is
        compatible with ES6 and CommonJS.
      </p>
      <div className="space-x-4">
        <Link
          className={buttonVariants({
            variant: "outline",
            className: "flex gap-2",
          })}
          target="_blank"
          rel="noreferrer"
          href={`https://github.com/Rafacv23/f1api-sdk`}
        >
          <Github size={16} />
          GitHub
        </Link>
        <Link
          className={buttonVariants({
            variant: "outline",
            className: "flex gap-2",
          })}
          target="_blank"
          rel="noreferrer"
          href={`https://www.npmjs.com/package/@f1api/sdk`}
        >
          <Download size={16} />
          NPM
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Installation</CardTitle>
        </CardHeader>
        <CardContent>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "")
                return match ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              },
            }}
          >
            {installationReadme}
          </ReactMarkdown>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "")
                return match ? (
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              },
            }}
          >
            {usageReadme}
          </ReactMarkdown>
        </CardContent>
      </Card>
      <div className="mt-8 place-content-center flex">
        <Link className={buttonVariants({ variant: "link" })} href={`/`}>
          <ArrowLeft size={16} />
          Home
        </Link>
        <Link className={buttonVariants({ variant: "link" })} href={`/docs`}>
          See other endpoints
          <ArrowRight size={16} />
        </Link>
      </div>
    </main>
  )
}
