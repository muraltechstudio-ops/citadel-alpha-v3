import { Resend } from "resend"
import { SignalPayload } from "./kv"

const resend = new Resend(process.env.RESEND_API_KEY!)
const fromEmail = process.env.FROM_EMAIL || "signaux@citadel-alpha.com"
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://citadel-alpha-v3.vercel.app"

export async function sendSignalEmail(
  to: string,
  signal: SignalPayload
): Promise<void> {
  const tickersHtml = signal.tickers
    .map(
      (t, i) => `
      <tr>
        <td style="padding:12px;border-bottom:1px solid #eee;font-size:16px;font-weight:600;">${i + 1}</td>
        <td style="padding:12px;border-bottom:1px solid #eee;font-size:16px;font-weight:600;">${t.ticker}</td>
        <td style="padding:12px;border-bottom:1px solid #eee;font-size:16px;color:${t.momentum12m > 0 ? "#10B981" : "#EF4444"};font-weight:600;">${t.momentum12m > 0 ? "+" : ""}${t.momentum12m.toFixed(1)}%</td>
        <td style="padding:12px;border-bottom:1px solid #eee;font-size:16px;">${t.price.toFixed(2)}$</td>
      </tr>
    `
    )
    .join("")

  await resend.emails.send({
    from: `Citadel Alpha <${fromEmail}>`,
    to,
    subject: `📊 Signal Citadel Alpha — ${signal.month}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0F172A;padding:24px;">
        <div style="max-width:600px;margin:0 auto;background:#1E293B;border-radius:16px;padding:32px;border:1px solid #334155;">
          <div style="text-align:center;margin-bottom:24px;">
            <h1 style="color:#F59E0B;font-size:28px;margin:0;">CITADEL</h1>
            <p style="color:#94A3B8;font-size:14px;">ALPHA — Signaux Mensuels</p>
          </div>

          <div style="background:#F59E0B/10;border:1px solid #F59E0B/30;border-radius:12px;padding:16px;text-align:center;margin-bottom:24px;">
            <p style="color:#FCD34D;font-size:14px;margin:0;">
              📅 Signal du <strong>${signal.month}</strong> — Généré le ${new Date(signal.generatedAt).toLocaleDateString("fr-FR")}
            </p>
          </div>

          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <thead>
              <tr style="background:#334155/50;">
                <th style="padding:12px;text-align:left;color:#FCD34D;font-size:13px;">#</th>
                <th style="padding:12px;text-align:left;color:#FCD34D;font-size:13px;">Ticker</th>
                <th style="padding:12px;text-align:left;color:#FCD34D;font-size:13px;">Momentum 12m</th>
                <th style="padding:12px;text-align:left;color:#FCD34D;font-size:13px;">Prix</th>
              </tr>
            </thead>
            <tbody style="color:#FEFEFE;">
              ${tickersHtml}
            </tbody>
          </table>

          <div style="background:#0F172A;border-radius:12px;padding:16px;margin-bottom:24px;border:1px solid #334155;">
            <p style="color:#94A3B8;font-size:13px;margin:0;line-height:1.6;">
              ⚠️ <strong style="color:#FEFEFE;">Avertissement :</strong> Ces signaux sont générés par un système de Dual Momentum. Les performances passées ne préjugent pas des résultats futurs. Le trading comporte des risques financiers importants.
            </p>
          </div>

          <div style="text-align:center;">
            <a href="${baseUrl}/dashboard" style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#F59E0B,#FCD34D);color:#0F172A;text-decoration:none;border-radius:8px;font-weight:600;font-size:14px;">
              Voir le Dashboard
            </a>
            <p style="margin-top:16px;font-size:12px;color:#475569;">
              <a href="${baseUrl}/api/unsubscribe?email=${encodeURIComponent(to)}" style="color:#475569;">Se désinscrire</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  })
}
