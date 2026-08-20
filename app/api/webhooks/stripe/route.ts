import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { supabaseAdmin } from "@/lib/supabase/admin"
import Stripe from "stripe"

export async function POST(req: Request) {
  const body = await req.text()
  const headersList = await headers()
  const signature = headersList.get("stripe-signature")

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

        if (session.mode === "subscription" && session.client_reference_id) {
          const subscriptionId = session.subscription as string
          const customerId = session.customer as string

          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const priceId = subscription.items.data[0].price.id

          let plan = "free"
          if (priceId === process.env.STRIPE_PRICE_STARTER_MONTHLY || priceId === process.env.STRIPE_PRICE_STARTER_YEARLY) plan = "starter"
          if (priceId === process.env.STRIPE_PRICE_ALPHA_MONTHLY || priceId === process.env.STRIPE_PRICE_ALPHA_YEARLY) plan = "alpha"

          await supabaseAdmin
            .from("profiles")
            .update({
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              plan,
              subscription_status: subscription.status,
              subscription_end_date: new Date((subscription as any).current_period_end * 1000).toISOString(),
            })
            .eq("id", session.client_reference_id)
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
