"use client"

import { Download, Github } from "lucide-react"
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
import { searchOptions, themeToggle } from "@/components/header/headerData"
import Link from "next/link"

export default function DesktopHeader() {
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
                    <link.icon />
                    {link.label}
                  </Link>
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
          <CommandSeparator />
          <CommandGroup key={"theme"} heading="Theme">
            {themeToggle(setTheme).map((button) => (
              <CommandItem key={button.label}>
                <button
                  onClick={button.onclick}
                  className="flex items-center gap-2 w-full"
                >
                  <button.icon />
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
        title="View the source code on GitHub"
        className={buttonVariants({ variant: "outline" })}
      >
        <Github />
      </Link>
      <Link
        href={"https://www.npmjs.com/package/@f1api/sdk"}
        target="_blank"
        rel="noreferrer"
        title="Download the SDK from NPM"
        className={buttonVariants({ variant: "outline" })}
      >
        <Download />
      </Link>
    </div>
  )
}
