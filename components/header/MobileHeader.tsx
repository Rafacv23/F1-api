"use client"

import { SITE_NAME } from "@/lib/constants"
import { AlignJustify } from "lucide-react"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { searchOptions, themeToggle } from "@/components/header/headerData"
import { useState } from "react"
import { useTheme } from "next-themes"
import Link from "next/link"

export default function MobileHeader() {
  const [open, setOpen] = useState<boolean>(false)
  const { setTheme } = useTheme()

  return (
    <div className="lg:hidden">
      <Drawer>
        <DrawerTrigger>
          <AlignJustify />
        </DrawerTrigger>
        <DrawerContent className="h-2/3">
          <DrawerHeader>
            <DrawerTitle>{SITE_NAME}</DrawerTitle>
            <DrawerDescription>
              {SITE_NAME} API is a free and open-source API for Formula 1 data.
            </DrawerDescription>
          </DrawerHeader>
          <ul className="flex flex-col gap-2 p-4 overflow-y-auto">
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
            <DrawerDescription>Theme</DrawerDescription>
            {themeToggle(setTheme).map((button) => (
              <button
                key={button.label}
                onClick={button.onclick}
                className="flex items-center gap-2 w-full"
              >
                <button.icon />
                {button.label}
              </button>
            ))}
          </ul>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
