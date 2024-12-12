import { SITE_NAME } from "@/lib/constants"
import {
  AlignJustify,
  Braces,
  CircleHelp,
  Github,
  Laptop,
  Moon,
  StickyNote,
  Sun,
} from "lucide-react"
import Link from "next/link"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

export default function Header() {
  const buttons = [
    { label: "Docs", href: "/docs" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ]

  const searchOptions = [
    {
      links: [
        { label: "Home", href: "/", icon: <StickyNote /> },
        { label: "Docs", href: "/docs", icon: <StickyNote /> },
        { label: "API", href: "/api", icon: <StickyNote /> },
        { label: "Blog", href: "/blog", icon: <StickyNote /> },
        { label: "Contact", href: "/contact", icon: <StickyNote /> },
      ],
      enpoints: [
        { label: "drivers", href: "/docs/introduction", icon: <Braces /> },
        { label: "teams", href: "/docs/endpoints", icon: <Braces /> },
      ],
      about: [
        { label: "Faqs", href: "/docs/endpoints", icon: <CircleHelp /> },
        { label: "Terms", href: "/docs/data-structure", icon: <CircleHelp /> },
        {
          label: "Referrals",
          href: "/docs/data-structure",
          icon: <CircleHelp />,
        },
      ],
      theme: [
        { label: "Light", href: "/docs/introduction", icon: <Sun /> },
        { label: "Dark", href: "/docs/endpoints", icon: <Moon /> },
        { label: "System", href: "/docs/data-structure", icon: <Laptop /> },
      ],
    },
  ]

  return (
    <header>
      <div className="fixed inset-x-0 z-50 top-0 p-4 items-center justify-center flex">
        <div className="max-w-7xl bg-gradient-to-r from-customGrayDark to-customGrayDarker border border-headerBorder w-full lg:w-2/3 relative flex items-center justify-between gap-4 rounded-lg px-4 py-5 text-white shadow-lg">
          <div id="header-start" className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 hover:transform hover:scale-105 hover:transition-all ease-in-out duration-300"
            >
              <img src="/logo.avif" alt="logo" className="h-8 w-8" />
              <h1>{SITE_NAME} API</h1>
            </Link>
          </div>
          <div className="hidden gap-4 lg:flex items-center justify-center">
            {buttons.map((button) => (
              <Link
                key={button.label}
                href={button.href}
                className="text-slate-300 hover:text-white hover:transition-all ease-in-out duration-300"
              >
                {button.label}
              </Link>
            ))}
          </div>
          <div id="header-end" className="hidden lg:flex gap-2 items-center">
            <Dialog>
              <DialogTrigger className={buttonVariants({ variant: "outline" })}>
                Search documentation...
              </DialogTrigger>
              <DialogContent className="h-auto">
                <DialogHeader>
                  <DialogTitle>Search</DialogTitle>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor="link" className="sr-only">
                      Link
                    </Label>
                    <Input
                      id="link"
                      placeholder="Search..."
                      type="search"
                      autoFocus
                    />
                  </div>
                </div>
                {searchOptions.map((option) => (
                  <>
                    <DialogDescription>
                      {option.links[0].label}
                    </DialogDescription>
                    <ul className="flex flex-col gap-4 items-start">
                      {option.links.map((link) => (
                        <li
                          key={link.label}
                          className={buttonVariants({
                            variant: "ghost",
                            className: "flex items-center gap-2 px-0",
                          })}
                        >
                          {option.links[0].icon}
                          <Link href={link.href}>{link.label}</Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ))}
                <DialogDescription>Links</DialogDescription>
                <ul className="flex flex-col gap-4 items-start">
                  <li
                    className={buttonVariants({
                      variant: "ghost",
                      className: "flex items-center gap-2 px-0",
                    })}
                  >
                    <StickyNote />
                    <Link href="/docs/introduction">Home</Link>
                  </li>
                  <li
                    className={buttonVariants({
                      variant: "ghost",
                      className: "flex items-center gap-2 px-0",
                    })}
                  >
                    {" "}
                    <StickyNote />
                    <Link href="/docs/endpoints">Docs</Link>
                  </li>
                  <li
                    className={buttonVariants({
                      variant: "ghost",
                      className: "flex items-center gap-2 px-0",
                    })}
                  >
                    {" "}
                    <StickyNote />
                    <Link href="/docs/data-structure">Blog</Link>
                  </li>
                </ul>
                <DialogDescription>Endpoints</DialogDescription>
                <ul className="flex flex-col gap-4 items-start">
                  <li
                    className={buttonVariants({
                      variant: "ghost",
                      className: "flex items-center gap-2 px-0",
                    })}
                  >
                    {" "}
                    <Braces />
                    <Link href="/docs/introduction">drivers</Link>
                  </li>
                  <li
                    className={buttonVariants({
                      variant: "ghost",
                      className: "flex items-center gap-2 px-0",
                    })}
                  >
                    {" "}
                    <Braces />
                    <Link href="/docs/endpoints">teams</Link>
                  </li>
                </ul>
                <DialogDescription>About</DialogDescription>
                <ul className="flex flex-col gap-4 items-start">
                  <li
                    className={buttonVariants({
                      variant: "ghost",
                      className: "flex items-center gap-2 px-0",
                    })}
                  >
                    {" "}
                    <CircleHelp />
                    <Link href="/docs/introduction">Contact</Link>
                  </li>
                  <li
                    className={buttonVariants({
                      variant: "ghost",
                      className: "flex items-center gap-2 px-0",
                    })}
                  >
                    {" "}
                    <CircleHelp />
                    <Link href="/docs/endpoints">Faqs</Link>
                  </li>

                  <li
                    className={buttonVariants({
                      variant: "ghost",
                      className: "flex items-center gap-2 px-0",
                    })}
                  >
                    {" "}
                    <CircleHelp />
                    <Link href="/docs/data-structure">Terms</Link>
                  </li>
                  <li
                    className={buttonVariants({
                      variant: "ghost",
                      className: "flex items-center gap-2 px-0",
                    })}
                  >
                    {" "}
                    <CircleHelp />
                    <Link href="/docs/data-structure">Referrals</Link>
                  </li>
                </ul>
                <DialogDescription>Theme</DialogDescription>
                <ul className="flex flex-col gap-4 items-start">
                  <li
                    className={buttonVariants({
                      variant: "ghost",
                      className: "flex items-center gap-2 px-0",
                    })}
                  >
                    <Sun />
                    <Link href="/docs/introduction">Light</Link>
                  </li>
                  <li
                    className={buttonVariants({
                      variant: "ghost",
                      className: "flex items-center gap-2 px-0",
                    })}
                  >
                    <Moon />
                    <Link href="/docs/endpoints">Dark</Link>
                  </li>
                  <li
                    className={buttonVariants({
                      variant: "ghost",
                      className: "flex items-center gap-2 px-0",
                    })}
                  >
                    <Laptop />
                    <Link href="/docs/data-structure">System</Link>
                  </li>
                </ul>
              </DialogContent>
            </Dialog>
            <Link
              href={"https://github.com/rafacv23/f1-api"}
              target="_blank"
              rel="noreferrer"
              className={buttonVariants({ variant: "outline" })}
            >
              <Github />
            </Link>
          </div>
          <div className="lg:hidden">
            <Drawer>
              <DrawerTrigger>
                <AlignJustify />
              </DrawerTrigger>
              <DrawerContent className="h-2/3">
                <DrawerHeader>
                  <DrawerTitle>{SITE_NAME} API</DrawerTitle>
                  <DrawerDescription>
                    {SITE_NAME} API is a free and open-source API for Formula 1
                    data.
                  </DrawerDescription>
                </DrawerHeader>
                <ul className="flex flex-col gap-2 p-4">
                  {buttons.map((button) => (
                    <Link key={button.label} href={button.href}>
                      {button.label}
                    </Link>
                  ))}
                </ul>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </div>
    </header>
  )
}
