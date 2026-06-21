import { NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      )
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Email invalide" },
        { status: 400 }
      )
    }

    // Send email notification to admin
    const resend = new Resend(process.env.RESEND_API_KEY!)
    const fromEmail = process.env.FROM_EMAIL || "contact@citadel-alpha.com"

    await resend.emails.send({
      from: `Citadel Alpha <${fromEmail}>`,
      to: "contact@citadel-alpha.com",
      subject: `[Citadel Alpha] Nouveau message de ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family:sans-serif;background:#f4f4f4;padding:24px;">
          <div style="max-width:500px;margin:0 auto;background:#fff;border-radius:12px;padding:24px;">
            <h2 style="color:#1a1a2e;margin-top:0;">Nouveau message de contact</h2>
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#666;font-size:14px;">Nom</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-size:14px;">Email</td><td style="padding:8px 0;font-weight:600;">${email}</td></tr>
            </table>
            <hr style="border:none;border-top:1px solid #eee;margin:16px 0;" />
            <p style="font-size:14px;line-height:1.6;white-space:pre-wrap;">${message}</p>
          </div>
        </body>
        </html>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Contact error:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message. Veuillez réessayer." },
      { status: 500 }
    )
  }
}
