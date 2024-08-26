"use client"

import { useRouter } from "next/navigation"
import { usePathname } from "next/navigation"
import { useTranslation } from "react-i18next"
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select"
import i18nConfig from "@/i18nConfig"

export default function LanguageChanger() {
  const { i18n } = useTranslation()
  const currentLocale = i18n.language
  const router = useRouter()
  const currentPathname = usePathname()

  const handleChange = (newLocale) => {
    // set cookie for next-i18n-router
    const days = 30
    const date = new Date()
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
    const expires = date.toUTCString()
    document.cookie = `NEXT_LOCALE=${newLocale};expires=${expires};path=/`

    // redirect to the new locale path
    if (
      currentLocale === i18nConfig.defaultLocale &&
      !i18nConfig.prefixDefault
    ) {
      router.push("/" + newLocale + currentPathname)
    } else {
      router.push(currentPathname.replace(`/${currentLocale}`, `/${newLocale}`))
    }

    router.refresh()
  }

  return (
    <Select onValueChange={handleChange} value={currentLocale}>
      <SelectTrigger className="w-[180px]" aria-label="Change language">
        <span className="sr-only">{currentLocale}</span>
        <SelectValue placeholder={currentLocale} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="es">Español</SelectItem>
        <SelectItem value="ru">Russian</SelectItem>
        <SelectItem value="fr">French</SelectItem>
        <SelectItem value="de">German</SelectItem>
        <SelectItem value="it">Italian</SelectItem>
        <SelectItem value="pt">Portuguese</SelectItem>
        <SelectItem value="jp">Japanese</SelectItem>
        <SelectItem value="ch">Chinese</SelectItem>
      </SelectContent>
    </Select>
  )
}
