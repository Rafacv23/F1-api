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
  meet?: string
}

export async function sendEmail({
  subject,
  name,
  email,
  message,
  meet,
}: Params) {
  try {
    const smtpEmail = new brevo.SendSmtpEmail()

    smtpEmail.subject = subject
    smtpEmail.to = [{ email: "rafacv23@gmail.com" }]
    smtpEmail.htmlContent = `<html><body>${message}. <br> How i meet you: ${meet}<br> from ${email}</body></html>`
    smtpEmail.sender = { name: name, email: "rafacv23@gmail.com" }

    await apiInstance.sendTransacEmail(smtpEmail)

    // now we want to send an email to the user to confirm his email was sent
    const emailConfirmation = new brevo.SendSmtpEmail()

    emailConfirmation.subject = "Welcome to F1 API"
    emailConfirmation.to = [{ email: email }]
    emailConfirmation.htmlContent = `<html><body>Your email was sent correctly. The team of F! API will contact you soon.</body></html>`
    emailConfirmation.sender = {
      name: "Rafa Canosa",
      email: "rafacv23@gmail.com",
    }

    await apiInstance.sendTransacEmail(emailConfirmation)
  } catch (error) {
    console.error(error)
  }
}
