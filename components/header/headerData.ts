import {
  Braces,
  CircleHelp,
  Download,
  Github,
  Laptop,
  Moon,
  Radio,
  StickyNote,
  Sun,
} from "lucide-react"
import React from "react"

type Button = {
  label: string
  href: string
}

type Option = {
  label: string
  href: string
  icon: React.FC<React.SVGProps<SVGSVGElement>>
}

type SearchOption = {
  group: string
  links: Option[]
}

const buttons: Button[] = [
  { label: "Docs", href: "/docs" },
  { label: "Live", href: "https://live.f1api.dev" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
]

const searchOptions: SearchOption[] = [
  {
    group: "Main",
    links: [
      { label: "Home", href: "/", icon: StickyNote },
      { label: "Docs", href: "/docs", icon: StickyNote },
      { label: "Live", href: "https://live.f1api.dev", icon: StickyNote },
      { label: "Blog", href: "/blog", icon: StickyNote },
      { label: "Contact", href: "/contact", icon: StickyNote },
    ],
  },
  {
    group: "Endpoints",
    links: [
      { label: "Drivers", href: "/docs/introduction", icon: Braces },
      { label: "Teams", href: "/docs/endpoints", icon: Braces },
      { label: "Seasons", href: "/docs/seasons", icon: Braces },
      { label: "Races", href: "/docs/races", icon: Braces },
      { label: "Standings", href: "/docs/standings", icon: Braces },
      { label: "Circuits", href: "/docs/circuits", icon: Braces },
    ],
  },
  {
    group: "Resources",
    links: [
      {
        label: "GitHub",
        href: "https://github.com/rafacv23/f1-api",
        icon: Github,
      },
      {
        label: "NPM",
        href: "https://www.npmjs.com/package/@f1api/sdk",
        icon: Download,
      },
    ],
  },
  {
    group: "About",
    links: [
      { label: "FAQs", href: "/faq", icon: CircleHelp },
      { label: "Terms", href: "/terms", icon: CircleHelp },
      { label: "Referrals", href: "/referrals", icon: CircleHelp },
    ],
  },
]

const themeToggle = (setTheme: (theme: string) => void) => [
  {
    label: "Light",
    icon: Sun,
    onclick: () => setTheme("light"),
  },
  {
    label: "Dark",
    icon: Moon,
    onclick: () => setTheme("dark"),
  },
  {
    label: "System",
    icon: Laptop,
    onclick: () => setTheme("system"),
  },
]

export { buttons, searchOptions, themeToggle }
