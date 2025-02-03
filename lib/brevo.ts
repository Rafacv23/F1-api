"use server"

import * as brevo from "@getbrevo/brevo"

const apiInstance = new brevo.TransactionalEmailsApi()

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY as string
)

// params received from the frontend form
interface Params {
  subject: string
  name: string
  email: string
  message: string
}

export async function sendEmail({ subject, name, email, message }: Params) {
  try {
    const smtpEmail = new brevo.SendSmtpEmail()

    smtpEmail.subject = subject
    smtpEmail.to = [{ email: "rafacv23@gmail.com" }]
    smtpEmail.htmlContent = `<html><body>${message} from ${email}</body></html>`
    smtpEmail.sender = { name: name, email: "rafacv23@gmail.com" }

    await apiInstance.sendTransacEmail(smtpEmail)
  } catch (error) {
    console.error(error)
  }
}
