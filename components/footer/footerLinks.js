import { FaGithub, FaLinkedin } from "react-icons/fa"
import { MdOutlineWebAsset } from "react-icons/md"
import { SiKofi } from "react-icons/si"

export const contactLinks = [
  {
    href: "https://ninjapath.vercel.app/linkedin",
    title: "Rafa Canosa Linkedin",
    icon: <FaLinkedin />,
  },
  {
    href: "https://ko-fi.com/rafacanosa",
    title: "Buy me a coffee",
    icon: <SiKofi />,
  },
  {
    href: "https://ninjapath.vercel.app/github",
    title: "Rafa Canosa Github",
    icon: <FaGithub />,
  },
  {
    href: "https://ninjapath.vercel.app/portfolio",
    title: "Rafa Canosa Portfolio",
    icon: <MdOutlineWebAsset />,
  },
]

export const pages = [
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

export const api = [
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

export const help = [
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
