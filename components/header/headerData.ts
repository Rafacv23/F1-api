import { Braces, CircleHelp, Laptop, Moon, StickyNote, Sun } from "lucide-react"
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
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
]

const searchOptions: SearchOption[] = [
  {
    group: "Main",
    links: [
      { label: "Home", href: "/", icon: StickyNote },
      { label: "Docs", href: "/docs", icon: StickyNote },
      { label: "Blog", href: "/blog", icon: StickyNote },
      { label: "Contact", href: "/contact", icon: StickyNote },
    ],
  },
  {
    group: "Endpoints",
    links: [
      { label: "Drivers", href: "/docs/introduction", icon: Braces },
      { label: "Teams", href: "/docs/endpoints", icon: Braces },
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
