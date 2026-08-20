import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { getStripe } from "@/lib/stripe"
import { supabaseAdmin } from "@/lib/supabase/admin"
import Stripe from "stripe"
import { Resend } from "resend"

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")
  const stripe = getStripe()

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe signature" }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.error(`Webhook Error: ${error.message}`)
    return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 })
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session

        if (session.mode === "subscription") {
          const subscriptionId = session.subscription as string
          const customerId = session.customer as string
          const customerEmail = session.customer_details?.email

          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const priceId = subscription.items.data[0].price.id

          let plan = "free"
          if (priceId === process.env.STRIPE_PRICE_STARTER_MONTHLY || priceId === process.env.STRIPE_PRICE_STARTER_YEARLY) plan = "starter"
          if (priceId === process.env.STRIPE_PRICE_ALPHA_MONTHLY || priceId === process.env.STRIPE_PRICE_ALPHA_YEARLY) plan = "alpha"

          let userId = session.client_reference_id

          // Si on n'a pas de userId, le client a souscrit directement
          // On doit lui créer un compte Supabase Auth
          if (!userId && customerEmail) {
            // Générer un mot de passe temporaire aléatoire
            const tempPassword = Math.random().toString(36).slice(-10) + "A1!"

            const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
              email: customerEmail,
              password: tempPassword,
              email_confirm: true,
            })

            if (authData?.user) {
              userId = authData.user.id

              // Envoyer l'email avec les identifiants
              const resend = new Resend(process.env.RESEND_API_KEY || "missing_key")
              const fromEmail = process.env.FROM_EMAIL || "contact@citadel-alpha.com"

              await resend.emails.send({
                from: `Citadel Alpha <${fromEmail}>`,
                to: customerEmail,
                subject: `Bienvenue chez Citadel Alpha ! Vos accès`,
                html: `
                  <div style="font-family:sans-serif;color:#1a1a2e;">
                    <h2>Bienvenue chez Citadel Alpha</h2>
                    <p>Merci pour votre abonnement ! Voici vos identifiants pour accéder à votre espace membre :</p>
                    <div style="background:#f4f4f4;padding:16px;border-radius:8px;margin:16px 0;">
                      <p><strong>Email :</strong> ${customerEmail}</p>
                      <p><strong>Mot de passe :</strong> ${tempPassword}</p>
                    </div>
                    <p>Vous pouvez vous connecter ici : <a href="${process.env.NEXT_PUBLIC_BASE_URL}/auth/login">${process.env.NEXT_PUBLIC_BASE_URL}/auth/login</a></p>
                    <p>Nous vous recommandons de changer ce mot de passe dès votre première connexion.</p>
                  </div>
                `
              })
            } else {
              console.error("Erreur création user auth:", authError)
            }
          }

          if (userId) {
            await supabaseAdmin
              .from("profiles")
              .upsert({
                id: userId,
                email: customerEmail || "",
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                plan,
                subscription_status: subscription.status,
                subscription_end_date: new Date((subscription as any).current_period_end * 1000).toISOString(),
              })
          }
        }
        break
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as any
        const priceId = subscription.items.data[0].price.id

        let plan = "free"
        if (priceId === process.env.STRIPE_PRICE_STARTER_MONTHLY || priceId === process.env.STRIPE_PRICE_STARTER_YEARLY) plan = "starter"
        if (priceId === process.env.STRIPE_PRICE_ALPHA_MONTHLY || priceId === process.env.STRIPE_PRICE_ALPHA_YEARLY) plan = "alpha"

        await supabaseAdmin
          .from("profiles")
          .update({
            plan,
            subscription_status: subscription.status,
            subscription_end_date: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id)
        break
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as any
        await supabaseAdmin
          .from("profiles")
          .update({
            plan: "free",
            subscription_status: "canceled",
          })
          .eq("stripe_subscription_id", subscription.id)
        break
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as any
        if (invoice.subscription) {
          await supabaseAdmin
            .from("profiles")
            .update({
              subscription_status: "past_due",
            })
            .eq("stripe_subscription_id", invoice.subscription as string)
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error("Database Error:", error)
    return NextResponse.json({ error: "Database operation failed" }, { status: 500 })
  }
}
