import Stripe from "stripe"

export function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY || "missing", {
    apiVersion: "2025-01-27.acacia" as any,
  })
}

export async function createCheckoutSession(priceId: string, email?: string, userId?: string) {
  const stripe = getStripe()
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    billing_address_collection: "auto",
    customer_email: email,
    client_reference_id: userId,
    customer_creation: "always",
    allow_promotion_codes: true,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/tarifs`,
  })

  return session
}

export async function createPortalSession(customerId: string) {
  const stripe = getStripe()
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard`,
  })

  return session
}
