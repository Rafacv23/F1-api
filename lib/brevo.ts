import * as brevo from "@getbrevo/brevo"

const apiInstance = new brevo.TransactionalEmailsApi()

apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY as string
)

// params received from the frontend form
interface Params {
  name: string
  email: { email: string; name: string }[]
  message: string
}

export async function sendEmail({ name, email, message }: Params) {
  try {
    const smtpEmail = new brevo.SendSmtpEmail()

    //smtpEmail.subject = subject
    smtpEmail.to = { name: "Rafa Canosa", email: "rafacv23@gmail.com" }
    smtpEmail.htmlContent = `<html><body>${message}</body></html>`
    smtpEmail.sender = { name: name, email: email }

    await apiInstance.sendTransacEmail(smtpEmail)
  } catch (error) {
    console.error(error)
  }
}
