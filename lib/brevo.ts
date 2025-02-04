"use server"

import * as brevo from "@getbrevo/brevo"
import { GITHUB_REPO } from "./constants"

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
    smtpEmail.htmlContent = `<html><body>from: ${email} <br> How i meet you: ${meet} <br> ${message}.</body></html>`
    smtpEmail.sender = { name: name, email: "rafacv23@gmail.com" }

    await apiInstance.sendTransacEmail(smtpEmail)

    // now we want to send an email to the user to confirm his email was sent
    const emailConfirmation = new brevo.SendSmtpEmail()

    emailConfirmation.subject = "Welcome to F1 API"
    emailConfirmation.to = [{ email: email }]
    emailConfirmation.htmlContent = `<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Contact confirmation - F1 API</title>
</head>
<body style="background-color: hsl(0, 0%, 100%); color: hsl(0, 0%, 5%); font-family: Arial, sans-serif; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 20px auto; background-color: hsl(0, 0%, 100%); padding: 20px; border-radius: 8px; border: 1px solid hsl(0, 0%, 92%); text-align: center;">
        <h1 style="color: hsl(2, 100%, 44%); margin-bottom: 20px;">Welcome to F1 API</h1>
          <p style="font-size: 16px; color: hsl(0, 0%, 5%);">
            Hi <strong>${name}</strong>!</p>
            <p>Thanks for contacting us. We will get back to you as soon as possible.</p>
            <a href=${GITHUB_REPO} style="display: inline-block; background-color: hsl(2, 100%, 44%); color: hsl(0, 0%, 98%); padding: 12px 20px; font-size: 18px; text-decoration: none; border-radius: 5px; margin-top: 20px;" target="_blank" class="btn">Give us a star on GitHub</a>
            <p>If you have not contacted us, you can ignore this message.</p>
                <hr style="border: none; height: 1px; background-color: hsl(0, 0%, 92%); margin: 20px 0;">
        <div style="font-size: 14px; color: hsl(0, 0%, 45%);">
            © 2024 F1 API.
        </div>
    </div>
</body>
</html>`
    emailConfirmation.sender = {
      name: "Rafa Canosa",
      email: "rafacv23@gmail.com",
    }

    await apiInstance.sendTransacEmail(emailConfirmation)
  } catch (error) {
    console.error(error)
  }
}
