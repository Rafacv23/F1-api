"use client"

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
import { Button, buttonVariants } from "@/components/ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { useEffect, useState } from "react"
import { useTheme } from "next-themes"

export default function Header() {
  const buttons = [
    { label: "Docs", href: "/docs" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ]

  const searchOptions = [
    {
      group: "Main",
      links: [
        { label: "Home", href: "/", icon: <StickyNote /> },
        { label: "Docs", href: "/docs", icon: <StickyNote /> },
        { label: "Blog", href: "/blog", icon: <StickyNote /> },
        { label: "Contact", href: "/contact", icon: <StickyNote /> },
      ],
    },
    {
      group: "Endpoints",
      links: [
        { label: "Drivers", href: "/docs/introduction", icon: <Braces /> },
        { label: "Teams", href: "/docs/endpoints", icon: <Braces /> },
      ],
    },
    {
      group: "About",
      links: [
        { label: "FAQs", href: "/faq", icon: <CircleHelp /> },
        { label: "Terms", href: "/terms", icon: <CircleHelp /> },
        {
          label: "Referrals",
          href: "/referrals",
          icon: <CircleHelp />,
        },
      ],
    },
  ]

  const themeToggle = [
    {
      label: "Light",
      icon: <Sun />,
      onclick: () => setTheme("light"),
    },
    {
      label: "Dark",
      icon: <Moon />,
      onclick: () => setTheme("dark"),
    },
    {
      label: "System",
      icon: <Laptop />,
      onclick: () => setTheme("system"),
    },
  ]

  const [open, setOpen] = useState<boolean>(false)
  const { setTheme } = useTheme()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

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
              <h1 className="dark:text-white">{SITE_NAME} API</h1>
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
          <div id="header-end" className="hidden lg:flex gap-2 items-center">
            <Button onClick={() => setOpen(true)} variant={"outline"}>
              Search documentation...{" "}
              <kbd className="pointer-events-none ml-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>J
              </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
              <CommandInput placeholder="Type a command or search..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                {searchOptions.map((option) => (
                  <CommandGroup key={option.group} heading={option.group}>
                    {option.links.map((link) => (
                      <CommandItem key={link.label}>
                        <Link
                          href={link.href}
                          className="flex items-center gap-2 w-full"
                          onClick={() => setOpen(false)}
                        >
                          {link.icon}
                          {link.label}
                        </Link>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
                <CommandSeparator />
                <CommandGroup key={"theme"} heading="Theme">
                  {themeToggle.map((button) => (
                    <CommandItem key={button.label}>
                      <button
                        onClick={button.onclick}
                        className="flex items-center gap-2 w-full"
                      >
                        {button.icon}
                        {button.label}
                      </button>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </CommandDialog>
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
                  {searchOptions.map((option) => (
                    <div key={option.group}>
                      <DrawerDescription>{option.group}</DrawerDescription>
                      {option.links.map((link) => (
                        <Link
                          key={link.label}
                          href={link.href}
                          className="flex items-center gap-2 w-full text-lg"
                          onClick={() => setOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>
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
