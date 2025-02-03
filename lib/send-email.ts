"use server"

import { redirect } from "next/navigation"
import { sendEmail } from "./brevo"
import { z } from "zod"
import { formSchema } from "@/components/ContactForm"

export const handleSubmit = async (values: z.infer<typeof formSchema>) => {
  const subject = values.subject
  const name = values.name
  const email = values.email
  const message = values.message

  // check all the fields are filled
  if (!subject || !name || !email || !message) {
    return console.log("Please fill all the fields")
  }

  await sendEmail({
    subject,
    name,
    email,
    message,
  })

  console.log("Form submitted successfully")

  redirect("/contact/success")
}
