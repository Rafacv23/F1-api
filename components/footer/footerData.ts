import { FaGithub, FaLinkedin, FaDownload } from "react-icons/fa"
import { MdOutlineWebAsset } from "react-icons/md"
import { SiKofi } from "react-icons/si"

interface Link {
  href: string
  title: string
  children?: string
}

interface ContactLink extends Link {
  icon: React.FC<React.SVGProps<SVGSVGElement>>
}

const contactLinks: ContactLink[] = [
  {
    href: "https://ninjapath.vercel.app/linkedin",
    title: "Rafa Canosa Linkedin",
    icon: FaLinkedin,
  },
  {
    href: "https://ko-fi.com/rafacanosa",
    title: "Buy me a coffee",
    icon: SiKofi,
  },
  {
    href: "https://ninjapath.vercel.app/github",
    title: "Rafa Canosa Github",
    icon: FaGithub,
  },
  {
    href: "https://www.npmjs.com/package/@f1api/sdk",
    title: "Download the SDK from NPM",
    icon: FaDownload,
  },
  {
    href: "https://ninjapath.vercel.app/portfolio",
    title: "Rafa Canosa Portfolio",
    icon: MdOutlineWebAsset,
  },
]

const pages: Link[] = [
  {
    href: "/",
    title: "Home page",
    children: "home",
  },
  {
    href: "/docs",
    title: "Api Documentation",
    children: "docs",
  },
  {
    href: "/blog",
    title: "Blog",
    children: "Blog",
  },
  {
    href: "/referrals",
    title: "Referrals",
    children: "referrals",
  },
]

const api: Link[] = [
  {
    href: "/api/seasons",
    title: "/api/seasons",
    children: "/api/seasons",
  },
  {
    href: "/api/drivers",
    title: "/api/drivers",
    children: "/api/drivers",
  },
  {
    href: "/api/circuits",
    title: "/api/circuits",
    children: "/api/circuits",
  },
  {
    href: "/api/teams",
    title: "/api/teams",
    children: "/api/teams",
  },
]

const help: Link[] = [
  {
    href: "/contact",
    title: "Contact",
    children: "contact",
  },
  {
    href: "/faq",
    title: "FAQs",
    children: "faqs",
  },
  {
    href: "/terms",
    title: "Terms & Conditions",
    children: "terms",
  },
]

export { contactLinks, pages, api, help }
