import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { getCurrentSignals, getSignalsHistory } from "@/lib/signals"
import { Resend } from "resend"

export async function GET(req: Request) {
  try {
    const headersList = await headers()
    const authHeader = headersList.get("authorization")
    const cronKey = process.env.CRON_SECRET

    if (authHeader !== `Bearer ${cronKey}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const currentSignals = await getCurrentSignals()
    if (!currentSignals) {
      return NextResponse.json({ error: "No signals found" }, { status: 404 })
    }

    const { data: existingSignal } = await supabaseAdmin
      .from("signals")
      .select("id")
      .eq("month", currentSignals.month)
      .single()

    if (!existingSignal) {
      await supabaseAdmin.from("signals").insert({
        month: currentSignals.month,
        positions: currentSignals.positions,
        capital: currentSignals.capital,
        return_pct: currentSignals.return_pct,
        return_eur: currentSignals.return_eur,
        drawdown: currentSignals.drawdown,
      })
    }

    const { data: existingEmail } = await supabaseAdmin
      .from("signal_emails")
      .select("id")
      .eq("month", currentSignals.month)
      .single()

    if (existingEmail) {
      return NextResponse.json({ message: "Emails already sent for this month" })
    }

    const history = await getSignalsHistory()
    const previousSignals = history.length > 1 ? history[history.length - 2] : null

    let sellTickers: string[] = []
    let buyTickers: string[] = []
    let holdTickers: string[] = []

    if (previousSignals) {
      const currentTickers = currentSignals.positions.map(p => p.ticker)
      const prevTickers = previousSignals.positions.map(p => p.ticker)

      sellTickers = prevTickers.filter(t => !currentTickers.includes(t))
      buyTickers = currentTickers.filter(t => !prevTickers.includes(t))
      holdTickers = currentTickers.filter(t => prevTickers.includes(t))
    } else {
      buyTickers = currentSignals.positions.map(p => p.ticker)
    }

    const { data: subscribers } = await supabaseAdmin
      .from("profiles")
      .select("email, full_name, plan")
      .in("plan", ["starter", "alpha"])
      .eq("subscription_status", "active")

    if (subscribers && subscribers.length > 0) {
      const resend = new Resend(process.env.RESEND_API_KEY || "missing_key")

      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0F172A;padding:24px;">
          <div style="max-width:600px;margin:0 auto;background:#1E293B;border-radius:16px;padding:32px;border:1px solid #334155;">
            <div style="text-align:center;margin-bottom:24px;">
              <h1 style="color:#F59E0B;font-size:28px;margin:0;">CITADEL</h1>
              <p style="color:#94A3B8;font-size:14px;">ALPHA — Signaux Mensuels</p>
            </div>

            <h2 style="color:#FEFEFE;text-align:center;margin-bottom:24px;">Vos signaux du mois de ${currentSignals.month}</h2>

            <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
              <thead>
                <tr style="background:#334155/50;">
                  <th style="padding:12px;text-align:left;color:#FCD34D;font-size:13px;">Ticker</th>
                  <th style="padding:12px;text-align:left;color:#FCD34D;font-size:13px;">Secteur</th>
                  <th style="padding:12px;text-align:left;color:#FCD34D;font-size:13px;">Score Momentum</th>
                  <th style="padding:12px;text-align:left;color:#FCD34D;font-size:13px;">Allocation</th>
                </tr>
              </thead>
              <tbody style="color:#FEFEFE;">
                ${currentSignals.positions.map(p => `
                  <tr>
                    <td style="padding:12px;border-bottom:1px solid #334155;font-weight:bold;">${p.ticker}</td>
                    <td style="padding:12px;border-bottom:1px solid #334155;">${p.industry || 'N/A'}</td>
                    <td style="padding:12px;border-bottom:1px solid #334155;color:${p.momentum12m > 0 ? '#10B981' : '#EF4444'}">${(p.momentum12m * 100).toFixed(1)}%</td>
                    <td style="padding:12px;border-bottom:1px solid #334155;">${(p.weight * 100).toFixed(1)}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div style="background:#0F172A;border:1px solid #334155;border-radius:12px;padding:24px;margin-bottom:32px;">
              <h3 style="color:#FEFEFE;margin-top:0;margin-bottom:16px;">Actions à effectuer :</h3>

              <div style="margin-bottom:12px;">
                <span style="color:#EF4444;font-weight:bold;margin-right:8px;">🔴 VENDRE :</span>
                <span style="color:#94A3B8;">${sellTickers.length > 0 ? sellTickers.join(', ') : 'Aucune action à vendre'}</span>
              </div>

              <div style="margin-bottom:12px;">
                <span style="color:#F59E0B;font-weight:bold;margin-right:8px;">🔄 CONSERVER :</span>
                <span style="color:#94A3B8;">${holdTickers.length > 0 ? holdTickers.join(', ') : 'Aucune action à conserver'}</span>
              </div>

              <div>
                <span style="color:#10B981;font-weight:bold;margin-right:8px;">🟢 ACHETER :</span>
                <span style="color:#94A3B8;">${buyTickers.length > 0 ? buyTickers.join(', ') : 'Aucune nouvelle action à acheter'}</span>
              </div>
            </div>

            <div style="margin-bottom:32px;text-align:center;">
              <h3 style="color:#94A3B8;font-size:14px;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Capital Simulé (Base 10 000€)</h3>
              <p style="color:#FEFEFE;font-size:24px;font-weight:bold;margin:0;">
                ${currentSignals.capital.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
              </p>
              ${previousSignals ? `
                <p style="color:${currentSignals.return_pct > previousSignals.return_pct ? '#10B981' : '#EF4444'};font-size:14px;margin-top:4px;">
                  Mois précédent : ${(currentSignals.return_pct - previousSignals.return_pct).toFixed(2)}%
                </p>
              ` : ''}
            </div>

            <div style="text-align:center;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#F59E0B,#FCD34D);color:#0F172A;text-decoration:none;border-radius:8px;font-weight:bold;font-size:16px;">
                Accéder au Dashboard
              </a>
            </div>

            <div style="margin-top:48px;padding-top:24px;border-top:1px solid #334155;text-align:center;">
              <p style="color:#475569;font-size:12px;line-height:1.5;">
                Citadel Alpha<br>
                Ceci n'est pas un conseil en investissement. Vous êtes responsable de vos décisions de trading.<br>
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/dashboard" style="color:#F59E0B;">Gérer mon abonnement</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `

      // Batch sending emails
      const batchSize = 50
      for (let i = 0; i < subscribers.length; i += batchSize) {
        const batch = subscribers.slice(i, i + batchSize)
        await Promise.all(
          batch.map(sub =>
            resend.emails.send({
              from: `Citadel Alpha <${process.env.FROM_EMAIL || 'signaux@citadelalpha.com'}>`,
              to: sub.email,
              subject: `📊 Vos signaux Citadel Alpha — ${currentSignals.month}`,
              html: emailHtml
            })
          )
        )
      }

      await supabaseAdmin.from("signal_emails").insert({
        month: currentSignals.month,
        recipients_count: subscribers.length,
        status: "sent"
      })
    }

    return NextResponse.json({ success: true, processed: true })
  } catch (error: any) {
    console.error("Cron error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
