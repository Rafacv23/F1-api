"use server"

import { redirect } from "next/navigation"
import { sendEmail } from "./brevo"
import { z } from "zod"
import { formSchema } from "@/components/ContactForm"
import { cookies } from "next/headers"

export const handleSubmit = async (values: z.infer<typeof formSchema>) => {
  const subject = values.subject
  const name = values.name
  const email = values.email
  const message = values.message
  const meet = values.meet

  // check all the fields are filled
  if (!subject || !name || !email || !message) {
    return { error: "Please fill all required fields." }
  }

  const response = await sendEmail(values)

  if (!response.success) {
    return { error: response.error }
  }

  // create a cookie to set that the user has submitted the form and can access to the success page
  const cookieStore = await cookies()
  cookieStore.set("submitted", "true", {
    path: "/",
    maxAge: 60, // 60 seconds
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  })

  redirect("/contact/success")
}
